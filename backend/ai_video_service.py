from typing import List, Dict, Any, Optional
import uuid
import logging
import os
from datetime import datetime
from models import *
from database import get_database
from emergentintegrations.llm.gemeni.image_generation import GeminiImageGeneration
from PIL import Image, ImageDraw, ImageFont
import io
import base64

logger = logging.getLogger(__name__)

class AIVideoService:
    def __init__(self):
        self.db = None
        
    async def initialize(self):
        """Initialize database connection"""
        if self.db is None:
            self.db = get_database()

    async def generate_video(self, request: dict) -> dict:
        """Generate AI video using Google Imagen 3"""
        await self.initialize()
        
        try:
            # Create video project
            video_id = str(uuid.uuid4())
            
            # Generate scene descriptions from script
            scenes = await self._generate_scenes(
                request['script'], 
                request['number_of_scenes'],
                request['style']
            )
            
            # Generate images for each scene using Imagen 3
            scene_images = []
            for i, scene in enumerate(scenes):
                try:
                    image_data = await self._generate_scene_image(scene, request['style'])
                    scene_images.append({
                        'scene_number': i + 1,
                        'description': scene['description'],
                        'timestamp': scene['timestamp'],
                        'duration': scene['duration'],
                        'image_url': image_data.get('image_url'),
                        'image_data': image_data.get('image_data')
                    })
                except Exception as e:
                    logger.error(f"Error generating image for scene {i+1}: {e}")
                    # Create placeholder image for failed scenes
                    placeholder_image = await self._create_placeholder_image(scene['description'])
                    scene_images.append({
                        'scene_number': i + 1,
                        'description': scene['description'],
                        'timestamp': scene['timestamp'],
                        'duration': scene['duration'],
                        'image_url': f"data:image/png;base64,{placeholder_image}",
                        'image_data': placeholder_image
                    })
            
            # Create video project record
            video_project = {
                'id': video_id,
                'title': request['title'],
                'script': request['script'],
                'style': request['style'],
                'duration': request['duration'],
                'format': request['format'],
                'voice_style': request['voice_style'],
                'number_of_scenes': request['number_of_scenes'],
                'scenes': scene_images,
                'status': 'completed',
                'created_at': datetime.utcnow().isoformat(),
                'preview_url': f'/api/ai-video/{video_id}/preview'
            }
            
            # Store in database
            await self.db.ai_videos.insert_one(video_project)
            
            return {
                'success': True,
                'video': video_project
            }
            
        except Exception as e:
            logger.error(f"Error generating video: {e}")
            return {
                'success': False,
                'error': str(e)
            }

    async def _generate_scenes(self, script: str, num_scenes: int, style: str) -> List[Dict]:
        """Generate scene descriptions from script"""
        await self.initialize()
        
        try:
            # For now, use fallback scene generation since we need proper Gemini text integration
            # In a full implementation, you'd use Gemini for text generation here
            scenes = self._create_fallback_scenes(script, num_scenes)
            return scenes
            
        except Exception as e:
            logger.error(f"Error generating scenes: {e}")
            return self._create_fallback_scenes(script, num_scenes)

    async def _generate_scene_image(self, scene: Dict, style: str) -> Dict:
        """Generate image for a scene using Imagen 3"""
        await self.initialize()
        
        try:
            # Enhance the scene description with style-specific details
            enhanced_prompt = f"""
            Create a {style} style image: {scene['description']}
            
            Style specifications:
            - {self._get_style_specifications(style)}
            - High quality, professional cinematography
            - Rich details and textures
            - Perfect lighting and composition
            """
            
            gemini_api_key = os.getenv('GEMINI_API_KEY')
            if gemini_api_key:
                try:
                    # Use the emergentintegrations Gemini image generation
                    gemini_gen = GeminiImageGeneration(api_key=gemini_api_key)
                    image_response = gemini_gen.generate_image(prompt=enhanced_prompt)
                    
                    if image_response:
                        return {
                            'image_url': f"data:image/png;base64,{image_response}",
                            'image_data': image_response
                        }
                except Exception as e:
                    logger.error(f"Gemini image generation failed: {e}")
            
            # Fallback to placeholder image
            placeholder = await self._create_placeholder_image(scene['description'])
            return {
                'image_url': f"data:image/png;base64,{placeholder}",
                'image_data': placeholder
            }
            
        except Exception as e:
            logger.error(f"Error generating scene image: {e}")
            placeholder = await self._create_placeholder_image(scene['description'])
            return {
                'image_url': f"data:image/png;base64,{placeholder}",
                'image_data': placeholder
            }

    async def _create_placeholder_image(self, description: str) -> str:
        """Create a professional placeholder image with scene description"""
        try:
            # Create a 1920x1080 image
            width, height = 1920, 1080
            image = Image.new('RGB', (width, height), color='#1a1a2e')
            draw = ImageDraw.Draw(image)
            
            # Add gradient background
            for i in range(height):
                color_value = int(26 + (i / height) * 50)  # Gradient from dark to slightly lighter
                draw.line([(0, i), (width, i)], fill=(color_value, color_value, color_value + 10))
            
            # Add THREE11 MOTION TECH branding
            try:
                # Try to use a better font if available
                title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
                desc_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
                small_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 16)
            except:
                # Fallback to default font
                title_font = ImageFont.load_default()
                desc_font = ImageFont.load_default()
                small_font = ImageFont.load_default()
            
            # Add title
            title_text = "THREE11 MOTION TECH"
            title_bbox = draw.textbbox((0, 0), title_text, font=title_font)
            title_width = title_bbox[2] - title_bbox[0]
            draw.text(((width - title_width) // 2, 100), title_text, fill='#8b5cf6', font=title_font)
            
            # Add subtitle
            subtitle_text = "AI Video Studio - Powered by Imagen 3"
            subtitle_bbox = draw.textbbox((0, 0), subtitle_text, font=desc_font)
            subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
            draw.text(((width - subtitle_width) // 2, 160), subtitle_text, fill='#a78bfa', font=desc_font)
            
            # Add scene description (wrapped)
            desc_text = f"Scene: {description}"
            words = desc_text.split()
            lines = []
            current_line = []
            max_width = width - 200
            
            for word in words:
                test_line = ' '.join(current_line + [word])
                test_bbox = draw.textbbox((0, 0), test_line, font=desc_font)
                test_width = test_bbox[2] - test_bbox[0]
                
                if test_width <= max_width:
                    current_line.append(word)
                else:
                    if current_line:
                        lines.append(' '.join(current_line))
                    current_line = [word]
            
            if current_line:
                lines.append(' '.join(current_line))
            
            # Draw wrapped text
            y_offset = 400
            for line in lines[:5]:  # Max 5 lines
                line_bbox = draw.textbbox((0, 0), line, font=desc_font)
                line_width = line_bbox[2] - line_bbox[0]
                draw.text(((width - line_width) // 2, y_offset), line, fill='#e5e7eb', font=desc_font)
                y_offset += 40
            
            # Add footer
            footer_text = "Generated by THREE11 MOTION TECH AI Video Studio"
            footer_bbox = draw.textbbox((0, 0), footer_text, font=small_font)
            footer_width = footer_bbox[2] - footer_bbox[0]
            draw.text(((width - footer_width) // 2, height - 60), footer_text, fill='#6b7280', font=small_font)
            
            # Add decorative elements
            # Draw some geometric shapes for visual interest
            for i in range(5):
                x = 100 + i * 350
                y = 300 + (i % 2) * 100
                draw.ellipse([x, y, x + 50, y + 50], fill=(139, 92, 246, 50))
            
            # Convert to base64
            buffer = io.BytesIO()
            image.save(buffer, format='PNG', quality=95)
            image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
            
            return image_base64
            
        except Exception as e:
            logger.error(f"Error creating placeholder image: {e}")
            # Return a minimal base64 image
            return "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="

    def _get_style_specifications(self, style: str) -> str:
        """Get style-specific visual specifications"""
        style_specs = {
            'cinematic': 'Professional film quality, dramatic lighting, deep depth of field, rich colors, cinematic composition',
            'modern': 'Clean contemporary aesthetic, minimalist design, sharp focus, professional lighting',
            'vibrant': 'Bold saturated colors, high contrast, energetic composition, bright lighting',
            'minimal': 'Simple clean design, lots of white space, subtle colors, focused composition',
            'artistic': 'Creative expressive style, unique perspectives, artistic lighting, abstract elements'
        }
        return style_specs.get(style, 'Professional high-quality visual style')

    def _create_fallback_scenes(self, script: str, num_scenes: int) -> List[Dict]:
        """Create intelligent fallback scenes when AI generation fails"""
        scene_duration = 30 // num_scenes if num_scenes > 0 else 10  # Distribute evenly
        scenes = []
        
        # Create more intelligent scene descriptions based on the script
        script_words = script.lower().split()
        
        # Basic scene templates based on common video types
        if any(word in script_words for word in ['fashion', 'style', 'clothing', 'outfit']):
            scene_templates = [
                "Close-up of fashionable clothing with elegant lighting and modern aesthetic",
                "Fashion model showcasing the latest trends in a contemporary studio setting", 
                "Stylish accessories arranged artistically with professional product photography"
            ]
        elif any(word in script_words for word in ['business', 'professional', 'corporate']):
            scene_templates = [
                "Modern office environment with professional lighting and clean aesthetics",
                "Business meeting in contemporary conference room with natural lighting",
                "Professional workspace with modern technology and minimalist design"
            ]
        elif any(word in script_words for word in ['travel', 'adventure', 'explore']):
            scene_templates = [
                "Stunning landscape view with cinematic wide-angle composition",
                "Travel destination with vibrant colors and engaging perspective",
                "Adventure scene with dynamic movement and inspiring atmosphere"
            ]
        else:
            # Generic templates
            scene_templates = [
                f"Professional scene showcasing the main concept with {'' if len(scenes) == 0 else 'continuing '} visual narrative",
                f"Dynamic composition highlighting key elements with engaging cinematography",
                f"Compelling visual that supports the story with professional lighting and composition"
            ]
        
        for i in range(num_scenes):
            # Use script content to create more relevant descriptions
            if i < len(scene_templates):
                description = scene_templates[i]
            else:
                description = f"Scene {i+1}: Continuation of visual narrative with professional cinematography emphasizing the core message"
            
            scenes.append({
                'description': f"{description}. Theme: {script[:100]}..." if len(script) > 100 else description,
                'timestamp': i * scene_duration,
                'duration': scene_duration
            })
        
        return scenes

    def _parse_scenes_response(self, response: str, num_scenes: int) -> List[Dict]:
        """Parse AI response into structured scenes"""
        try:
            # Basic parsing - in a real implementation, you'd want more robust parsing
            scenes = []
            scene_duration = 30 // num_scenes
            
            lines = response.split('\n')
            current_scene = {}
            scene_count = 0
            
            for line in lines:
                line = line.strip()
                if not line:
                    continue
                
                if 'scene' in line.lower() and scene_count < num_scenes:
                    if current_scene and 'description' in current_scene:
                        scenes.append(current_scene)
                    
                    current_scene = {
                        'description': line,
                        'timestamp': scene_count * scene_duration,
                        'duration': scene_duration
                    }
                    scene_count += 1
                elif current_scene:
                    current_scene['description'] += ' ' + line
            
            if current_scene and 'description' in current_scene:
                scenes.append(current_scene)
            
            # Fill remaining scenes if needed
            while len(scenes) < num_scenes:
                scene_num = len(scenes)
                scenes.append({
                    'description': f"Scene {scene_num + 1}: Continuation of the video content with cinematic quality",
                    'timestamp': scene_num * scene_duration,
                    'duration': scene_duration
                })
            
            return scenes[:num_scenes]
            
        except Exception as e:
            logger.error(f"Error parsing scenes: {e}")
            return self._create_fallback_scenes("", num_scenes)

    async def get_video_projects(self, user_id: str = None) -> List[Dict]:
        """Get video projects for a user"""
        await self.initialize()
        
        try:
            query = {}
            if user_id:
                query['user_id'] = user_id
            
            cursor = self.db.ai_videos.find(query).sort('created_at', -1).limit(20)
            projects = await cursor.to_list(length=20)
            
            # Convert ObjectId to string for JSON serialization
            for project in projects:
                if '_id' in project:
                    del project['_id']
            
            return projects
            
        except Exception as e:
            logger.error(f"Error getting video projects: {e}")
            return []

    async def get_video_by_id(self, video_id: str) -> Optional[Dict]:
        """Get a specific video project by ID"""
        await self.initialize()
        
        try:
            video = await self.db.ai_videos.find_one({'id': video_id})
            if video:
                if '_id' in video:
                    del video['_id']
                return video
            return None
            
        except Exception as e:
            logger.error(f"Error getting video by ID: {e}")
            return None

    async def delete_video_project(self, video_id: str, user_id: str = None) -> bool:
        """Delete a video project"""
        await self.initialize()
        
        try:
            query = {'id': video_id}
            if user_id:
                query['user_id'] = user_id
            
            result = await self.db.ai_videos.delete_one(query)
            return result.deleted_count > 0
            
        except Exception as e:
            logger.error(f"Error deleting video project: {e}")
            return False

# Create service instance
ai_video_service = AIVideoService()