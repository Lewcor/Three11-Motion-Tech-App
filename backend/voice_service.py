"""
Voice Processing Service for THREE11 MOTION TECH
Handles speech-to-text conversion and voice-driven content creation
"""

import os
import tempfile
import uuid
from typing import Dict, Any, Optional, List
import speech_recognition as sr
from pydub import AudioSegment
import openai
import io
import base64
from ai_service import AIService
from models import ContentCreationType, Platform
import asyncio
from concurrent.futures import ThreadPoolExecutor

class VoiceService:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.ai_service = AIService()
        self.openai_client = openai.OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        self.executor = ThreadPoolExecutor(max_workers=3)
        
    def _convert_audio_to_wav(self, audio_data: bytes, source_format: str = "webm") -> bytes:
        """Convert audio data to WAV format for speech recognition"""
        try:
            # Create audio segment from bytes
            audio = AudioSegment.from_file(io.BytesIO(audio_data), format=source_format)
            
            # Convert to WAV
            wav_buffer = io.BytesIO()
            audio.export(wav_buffer, format="wav")
            wav_buffer.seek(0)
            
            return wav_buffer.read()
        except Exception as e:
            raise Exception(f"Audio conversion failed: {str(e)}")
    
    def _transcribe_with_whisper(self, audio_data: bytes) -> str:
        """Transcribe audio using OpenAI Whisper"""
        try:
            # Create a temporary file for Whisper
            with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as temp_file:
                temp_file.write(audio_data)
                temp_file_path = temp_file.name
            
            try:
                # Use OpenAI Whisper API
                with open(temp_file_path, "rb") as audio_file:
                    transcript = self.openai_client.audio.transcriptions.create(
                        model="whisper-1",
                        file=audio_file,
                        response_format="text"
                    )
                return transcript.strip()
            finally:
                # Clean up temp file
                os.unlink(temp_file_path)
                
        except Exception as e:
            raise Exception(f"Whisper transcription failed: {str(e)}")
    
    def _transcribe_with_speech_recognition(self, audio_data: bytes) -> str:
        """Fallback transcription using SpeechRecognition library"""
        try:
            # Use speech recognition as fallback
            with sr.AudioFile(io.BytesIO(audio_data)) as source:
                audio = self.recognizer.record(source)
                text = self.recognizer.recognize_google(audio)
                return text.strip()
        except sr.UnknownValueError:
            return "Could not understand audio"
        except sr.RequestError as e:
            raise Exception(f"Speech recognition service error: {str(e)}")
    
    async def transcribe_audio(self, audio_data: bytes, source_format: str = "webm") -> str:
        """
        Transcribe audio to text using OpenAI Whisper with fallback to Google Speech Recognition
        """
        try:
            # Convert to WAV format
            wav_data = self._convert_audio_to_wav(audio_data, source_format)
            
            # Try Whisper first (more accurate)
            try:
                loop = asyncio.get_event_loop()
                transcript = await loop.run_in_executor(
                    self.executor, 
                    self._transcribe_with_whisper, 
                    wav_data
                )
                return transcript
            except Exception as whisper_error:
                print(f"Whisper failed, trying fallback: {whisper_error}")
                
                # Fallback to Google Speech Recognition
                loop = asyncio.get_event_loop()
                transcript = await loop.run_in_executor(
                    self.executor, 
                    self._transcribe_with_speech_recognition, 
                    wav_data
                )
                return transcript
                
        except Exception as e:
            raise Exception(f"Audio transcription failed: {str(e)}")
    
    def _extract_content_details_from_voice(self, transcript: str) -> Dict[str, Any]:
        """
        Extract content creation details from voice transcript using AI
        """
        try:
            # Enhanced prompt for better voice-to-content extraction
            prompt = f"""
            Analyze this voice transcript and extract content creation details:
            
            Transcript: "{transcript}"
            
            Extract the following and return as JSON:
            {{
                "category": "fashion/fitness/food/travel/business/gaming/music/ideas/event_space",
                "platform": "tiktok/instagram/youtube/facebook",
                "content_type": "viral_caption/trending_hashtags/content_ideas/video_script",
                "mood": "professional/casual/funny/inspiring/romantic/energetic",
                "target_audience": "description of target audience",
                "key_points": ["main points to include"],
                "call_to_action": "suggested call to action",
                "additional_context": "any additional context from the voice"
            }}
            
            If any details are unclear from the transcript, make reasonable assumptions based on context.
            """
            
            # Use OpenAI to analyze the transcript
            response = self.openai_client.chat.completions.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are an expert content strategist who analyzes voice inputs to create social media content. Return only valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )
            
            import json
            content_details = json.loads(response.choices[0].message.content)
            return content_details
            
        except Exception as e:
            # Return default structure if analysis fails
            return {
                "category": "business",
                "platform": "instagram",
                "content_type": "viral_caption",
                "mood": "professional",
                "target_audience": "general audience",
                "key_points": [transcript],
                "call_to_action": "Engage with this content",
                "additional_context": transcript
            }
    
    async def voice_to_content_suite(self, audio_data: bytes, source_format: str = "webm") -> Dict[str, Any]:
        """
        Complete voice-to-content pipeline: transcribe audio and generate full content suite
        """
        try:
            # Step 1: Transcribe audio
            transcript = await self.transcribe_audio(audio_data, source_format)
            
            if not transcript or transcript == "Could not understand audio":
                return {
                    "success": False,
                    "error": "Could not understand the audio. Please try speaking more clearly.",
                    "transcript": transcript
                }
            
            # Step 2: Extract content details from voice
            content_details = self._extract_content_details_from_voice(transcript)
            
            # Step 3: Generate content using AI service
            category = ContentCreationType(content_details.get("category", "business"))
            platform = Platform(content_details.get("platform", "instagram"))
            
            # Create enhanced prompt with voice context
            enhanced_prompt = f"""
            Voice Input Context: "{transcript}"
            
            Content Details Extracted:
            - Category: {content_details.get("category")}
            - Platform: {content_details.get("platform")}
            - Mood: {content_details.get("mood")}
            - Target Audience: {content_details.get("target_audience")}
            - Key Points: {', '.join(content_details.get("key_points", []))}
            - Call to Action: {content_details.get("call_to_action")}
            
            Generate viral content that captures the essence of this voice input.
            """
            
            # Generate content using existing AI service
            content_result = await self.ai_service.generate_content(
                category=category,
                platform=platform,
                user_prompt=enhanced_prompt,
                user_id=str(uuid.uuid4())  # Generate temp user ID for voice sessions
            )
            
            # Step 4: Return comprehensive result
            return {
                "success": True,
                "transcript": transcript,
                "content_details": content_details,
                "generated_content": content_result,
                "voice_analysis": {
                    "detected_intent": content_details.get("additional_context"),
                    "suggested_improvements": [
                        "Consider adding more specific details about your target audience",
                        "Include trending keywords relevant to your niche",
                        "Add emojis and hashtags for better engagement"
                    ]
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Voice processing failed: {str(e)}",
                "transcript": ""
            }
    
    async def voice_command_handler(self, audio_data: bytes, source_format: str = "webm") -> Dict[str, Any]:
        """
        Handle voice commands for hands-free operation
        """
        try:
            # Transcribe the command
            transcript = await self.transcribe_audio(audio_data, source_format)
            
            # Analyze command intent
            command_analysis = self._analyze_voice_command(transcript)
            
            # Execute command based on intent
            if command_analysis["intent"] == "generate_content":
                return await self.voice_to_content_suite(audio_data, source_format)
            elif command_analysis["intent"] == "navigate":
                return {
                    "success": True,
                    "action": "navigate",
                    "destination": command_analysis["destination"],
                    "transcript": transcript
                }
            elif command_analysis["intent"] == "settings":
                return {
                    "success": True,
                    "action": "settings",
                    "setting": command_analysis["setting"],
                    "transcript": transcript
                }
            else:
                return {
                    "success": False,
                    "error": "Command not recognized. Try saying 'create content about...' or 'navigate to...'",
                    "transcript": transcript
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": f"Voice command processing failed: {str(e)}",
                "transcript": ""
            }
    
    def _analyze_voice_command(self, transcript: str) -> Dict[str, Any]:
        """
        Analyze voice command to determine intent and extract parameters
        """
        transcript_lower = transcript.lower()
        
        # Command patterns
        if any(phrase in transcript_lower for phrase in ["create", "generate", "make", "write"]):
            return {
                "intent": "generate_content",
                "confidence": 0.9
            }
        elif any(phrase in transcript_lower for phrase in ["go to", "navigate", "open", "show"]):
            destination = "generator"
            if "premium" in transcript_lower:
                destination = "premium"
            elif "content" in transcript_lower:
                destination = "content-creation"
            
            return {
                "intent": "navigate",
                "destination": destination,
                "confidence": 0.8
            }
        elif any(phrase in transcript_lower for phrase in ["settings", "configure", "setup"]):
            return {
                "intent": "settings",
                "setting": "general",
                "confidence": 0.7
            }
        else:
            return {
                "intent": "unknown",
                "confidence": 0.1
            }