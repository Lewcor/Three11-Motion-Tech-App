import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Send, 
  Calendar, 
  Image, 
  Video, 
  Hash, 
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  PlaySquare,
  Plus,
  Settings,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const SocialMediaPublishing = () => {
  const [posts, setPosts] = useState([]);
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [publishing, setPublishing] = useState({});
  const [postForm, setPostForm] = useState({
    title: '',
    content: '',
    platforms: [],
    media_urls: [],
    hashtags: [],
    location: '',
    scheduled_time: '',
    publish_immediately: false
  });

  // Mock data loading
  useEffect(() => {
    const mockData = {
      connected_accounts: [
        {
          platform: 'instagram',
          account_name: 'Fashion Creator',
          username: '@fashioncreator',
          followers_count: 15420,
          status: 'connected'
        },
        {
          platform: 'facebook',
          account_name: 'Fashion Brand Page',
          username: 'fashionbrand',
          followers_count: 8750,
          status: 'connected'
        },
        {
          platform: 'twitter',
          account_name: 'Fashion Trends',
          username: '@fashiontrends',
          followers_count: 12300,
          status: 'connected'
        },
        {
          platform: 'linkedin',
          account_name: 'Professional Profile',
          username: 'fashion-expert',
          followers_count: 3450,
          status: 'connected'
        }
      ],
      posts: [
        {
          id: 'post_1',
          title: 'Fall Fashion Trends 2024',
          content: '🍂 Fall is here and these are the trends taking over! From cozy cardigans to statement boots, here\'s what you need in your wardrobe this season. #FallFashion #Trends2024 #OOTD',
          platforms: ['instagram', 'facebook'],
          hashtags: ['#FallFashion', '#Trends2024', '#OOTD', '#StyleInspo'],
          status: 'published',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
          published_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
          engagement: {
            likes: 234,
            comments: 18,
            shares: 12
          }
        },
        {
          id: 'post_2',
          title: 'Behind the Scenes - Photoshoot',
          content: 'Take a peek behind the scenes of our latest photoshoot! The creative process is just as beautiful as the final result ✨',
          platforms: ['instagram', 'twitter'],
          hashtags: ['#BehindTheScenes', '#Photoshoot', '#Creative'],
          status: 'scheduled',
          scheduled_time: new Date(Date.now() + 4 * 60 * 60 * 1000),
          created_at: new Date(Date.now() - 1 * 60 * 60 * 1000)
        },
        {
          id: 'post_3',
          title: 'Weekend Style Guide',
          content: 'Weekend vibes call for comfortable yet chic outfits. Here are 5 easy looks that transition from brunch to shopping effortlessly!',
          platforms: ['facebook', 'linkedin'],
          hashtags: ['#WeekendStyle', '#ChicAndComfy', '#StyleGuide'],
          status: 'draft',
          created_at: new Date(Date.now() - 30 * 60 * 1000)
        }
      ]
    };

    setTimeout(() => {
      setConnectedAccounts(mockData.connected_accounts);
      setPosts(mockData.posts);
      setLoading(false);
    }, 1000);
  }, []);

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'instagram':
        return <Instagram className="h-4 w-4 text-pink-500" />;
      case 'facebook':
        return <Facebook className="h-4 w-4 text-blue-600" />;
      case 'twitter':
        return <Twitter className="h-4 w-4 text-blue-400" />;
      case 'linkedin':
        return <Linkedin className="h-4 w-4 text-blue-700" />;
      case 'tiktok':
        return <PlaySquare className="h-4 w-4 text-black" />;
      default:
        return <Send className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'published':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'scheduled':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'draft':
        return <Edit className="h-4 w-4 text-gray-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!postForm.title || !postForm.content || postForm.platforms.length === 0) {
      alert('Please fill in required fields');
      return;
    }

    // Create new post
    const newPost = {
      id: `post_${Date.now()}`,
      title: postForm.title,
      content: postForm.content,
      platforms: postForm.platforms,
      hashtags: postForm.hashtags,
      location: postForm.location,
      status: postForm.publish_immediately ? 'publishing' : postForm.scheduled_time ? 'scheduled' : 'draft',
      scheduled_time: postForm.scheduled_time ? new Date(postForm.scheduled_time) : null,
      created_at: new Date()
    };

    setPosts(prev => [newPost, ...prev]);
    
    // Reset form
    setPostForm({
      title: '',
      content: '',
      platforms: [],
      media_urls: [],
      hashtags: [],
      location: '',
      scheduled_time: '',
      publish_immediately: false
    });
    setShowCreateDialog(false);

    // If publishing immediately, simulate publishing
    if (postForm.publish_immediately) {
      handlePublishPost(newPost.id);
    }
  };

  const handlePublishPost = async (postId) => {
    setPublishing(prev => ({ ...prev, [postId]: true }));
    
    // Simulate API call
    setTimeout(() => {
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, status: 'published', published_at: new Date() }
          : post
      ));
      setPublishing(prev => ({ ...prev, [postId]: false }));
    }, 2000);
  };

  const handlePlatformToggle = (platform) => {
    setPostForm(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const formatScheduledTime = (date) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading social media publishing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="mb-4 lg:mb-0">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Social Media Publishing
          </h1>
          <p className="text-gray-600">Create and publish content across all your social platforms</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
                <DialogDescription>
                  Create and schedule content for your social media platforms
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreatePost} className="space-y-6">
                <div>
                  <Label htmlFor="title">Post Title</Label>
                  <Input
                    id="title"
                    value={postForm.title}
                    onChange={(e) => setPostForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter post title"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={postForm.content}
                    onChange={(e) => setPostForm(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="What's happening?"
                    rows={4}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {postForm.content.length}/2200 characters
                  </p>
                </div>
                
                <div>
                  <Label>Select Platforms</Label>
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    {connectedAccounts.map((account) => (
                      <div key={account.platform} className="flex items-center space-x-2">
                        <Checkbox
                          id={account.platform}
                          checked={postForm.platforms.includes(account.platform)}
                          onCheckedChange={() => handlePlatformToggle(account.platform)}
                        />
                        <Label 
                          htmlFor={account.platform}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          {getPlatformIcon(account.platform)}
                          <span className="capitalize">{account.platform}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="hashtags">Hashtags</Label>
                  <Input
                    id="hashtags"
                    value={postForm.hashtags.join(' ')}
                    onChange={(e) => setPostForm(prev => ({ 
                      ...prev, 
                      hashtags: e.target.value.split(' ').filter(tag => tag.trim())
                    }))}
                    placeholder="#fashion #style #ootd"
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">Location (Optional)</Label>
                  <Input
                    id="location"
                    value={postForm.location}
                    onChange={(e) => setPostForm(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="New York, NY"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="publish_immediately"
                      checked={postForm.publish_immediately}
                      onCheckedChange={(checked) => setPostForm(prev => ({ 
                        ...prev, 
                        publish_immediately: checked,
                        scheduled_time: checked ? '' : prev.scheduled_time
                      }))}
                    />
                    <Label htmlFor="publish_immediately">Publish immediately</Label>
                  </div>
                  
                  {!postForm.publish_immediately && (
                    <div>
                      <Label htmlFor="scheduled_time">Schedule for later (Optional)</Label>
                      <Input
                        id="scheduled_time"
                        type="datetime-local"
                        value={postForm.scheduled_time}
                        onChange={(e) => setPostForm(prev => ({ ...prev, scheduled_time: e.target.value }))}
                        min={new Date().toISOString().slice(0, 16)}
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1" disabled={postForm.platforms.length === 0}>
                    {postForm.publish_immediately ? (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Publish Now
                      </>
                    ) : postForm.scheduled_time ? (
                      <>
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Post
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Save Draft
                      </>
                    )}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Connected Accounts Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Connected Accounts</CardTitle>
          <CardDescription>Your social media accounts ready for publishing</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 overflow-x-auto">
            {connectedAccounts.map((account) => (
              <div key={account.platform} className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg min-w-fit">
                {getPlatformIcon(account.platform)}
                <div>
                  <p className="text-sm font-medium capitalize">{account.platform}</p>
                  <p className="text-xs text-gray-600">{account.username}</p>
                </div>
                <Badge className="bg-green-100 text-green-700 text-xs">Connected</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Posts List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Posts</h2>
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{post.title}</h3>
                    <Badge className={`${getStatusBadgeColor(post.status)} text-xs`}>
                      {post.status}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{post.content}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <span>Platforms:</span>
                      <div className="flex gap-1">
                        {post.platforms.map((platform) => (
                          <span key={platform} className="flex items-center gap-1">
                            {getPlatformIcon(platform)}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {post.hashtags && post.hashtags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        <span>{post.hashtags.length} hashtags</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {post.status === 'published' && post.published_at ? (
                        <span>Published {formatTimeAgo(post.published_at)}</span>
                      ) : post.status === 'scheduled' && post.scheduled_time ? (
                        <span>Scheduled for {formatScheduledTime(post.scheduled_time)}</span>
                      ) : (
                        <span>Created {formatTimeAgo(post.created_at)}</span>
                      )}
                    </div>
                  </div>
                  
                  {post.engagement && (
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <span className="flex items-center gap-1">
                        <span>❤️</span> {post.engagement.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>💬</span> {post.engagement.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <span>🔄</span> {post.engagement.shares}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  {getStatusIcon(post.status)}
                  
                  {post.status === 'draft' && (
                    <Button 
                      size="sm" 
                      onClick={() => handlePublishPost(post.id)}
                      disabled={publishing[post.id]}
                    >
                      {publishing[post.id] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  
                  {post.status === 'scheduled' && (
                    <Button size="sm" variant="outline">
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {post.status === 'published' && (
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {posts.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Send className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-4">Create your first social media post to get started</p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Post
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SocialMediaPublishing;