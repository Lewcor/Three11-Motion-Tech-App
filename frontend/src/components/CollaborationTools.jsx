import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar } from './ui/avatar';
import { 
  MessageSquare, 
  Users, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Star,
  Paperclip,
  AtSign,
  FileText,
  Workflow,
  Settings,
  Filter,
  Search
} from 'lucide-react';

const CollaborationTools = () => {
  const [comments, setComments] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [workflows, setWorkflows] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [selectedContent, setSelectedContent] = useState('content_1');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('comments');

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockData = {
      comments: [
        {
          id: 'comment_1',
          content_id: 'content_1',
          user: {
            id: 'user_1',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@example.com',
            avatar: null
          },
          comment_text: 'Great caption! I love the hook at the beginning. Could we make the CTA a bit stronger though?',
          parent_comment_id: null,
          mentions: [],
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
          updated_at: null,
          reactions: {
            '👍': ['user_2', 'user_3'],
            '❤️': ['user_2']
          },
          replies: [
            {
              id: 'comment_2',
              user: {
                id: 'user_2',
                name: 'Emma Wilson',
                email: 'emma.wilson@example.com',
                avatar: null
              },
              comment_text: 'Good point! How about "Swipe up to transform your style today!" instead?',
              created_at: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
              reactions: { '👍': ['user_1'] }
            }
          ]
        },
        {
          id: 'comment_3',
          content_id: 'content_1',
          user: {
            id: 'user_3',
            name: 'Mike Chen',
            email: 'mike.chen@example.com',
            avatar: null
          },
          comment_text: 'The visual concept looks amazing! Just need to check brand compliance for the color scheme.',
          parent_comment_id: null,
          mentions: ['user_1'],
          created_at: new Date(Date.now() - 1 * 60 * 60 * 1000),
          reactions: { '⚠️': ['user_1'] },
          replies: []
        }
      ],
      reviews: [
        {
          id: 'review_1',
          content_id: 'content_1',
          reviewer: {
            id: 'user_1',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@example.com'
          },
          review_type: 'brand_compliance',
          status: 'approved',
          overall_rating: 4,
          feedback_areas: {
            'brand_consistency': 'Logo placement and colors look great',
            'messaging': 'Tone matches our brand voice perfectly',
            'legal_compliance': 'All claims are substantiated'
          },
          action_items: [],
          decision_comment: 'Approved with minor suggestions for the CTA',
          created_at: new Date(Date.now() - 3 * 60 * 60 * 1000),
          completed_at: new Date(Date.now() - 2.5 * 60 * 60 * 1000)
        },
        {
          id: 'review_2',
          content_id: 'content_2',
          reviewer: {
            id: 'user_3',
            name: 'Mike Chen',
            email: 'mike.chen@example.com'
          },
          review_type: 'general',
          status: 'changes_requested',
          overall_rating: 3,
          feedback_areas: {
            'content_quality': 'Good concept but needs refinement',
            'visual_appeal': 'Colors could be more vibrant',
            'engagement_potential': 'Hook needs to be stronger'
          },
          action_items: [
            'Increase color saturation by 20%',
            'Rewrite the opening hook',
            'Add trending hashtags'
          ],
          decision_comment: 'Great start! Please address the action items and resubmit.',
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000),
          completed_at: new Date(Date.now() - 3.5 * 60 * 60 * 1000)
        }
      ],
      workflows: [
        {
          id: 'workflow_1',
          name: 'Instagram Content Approval',
          content_id: 'content_1',
          current_stage: 'Brand Review',
          status: 'in_progress',
          stages: [
            { name: 'Content Creation', status: 'completed', assignee: 'Emma Wilson' },
            { name: 'Peer Review', status: 'completed', assignee: 'Mike Chen' },
            { name: 'Brand Review', status: 'in_progress', assignee: 'Sarah Johnson' },
            { name: 'Final Approval', status: 'pending', assignee: 'Team Lead' }
          ],
          started_at: new Date(Date.now() - 6 * 60 * 60 * 1000),
          estimated_completion: new Date(Date.now() + 2 * 60 * 60 * 1000)
        },
        {
          id: 'workflow_2',
          name: 'TikTok Video Production',
          content_id: 'content_3',
          current_stage: 'Editing',
          status: 'in_progress',
          stages: [
            { name: 'Script Writing', status: 'completed', assignee: 'Lisa Rodriguez' },
            { name: 'Editing', status: 'in_progress', assignee: 'Alex Kim' },
            { name: 'Music & Effects', status: 'pending', assignee: 'Music Team' },
            { name: 'Final Review', status: 'pending', assignee: 'Content Lead' }
          ],
          started_at: new Date(Date.now() - 12 * 60 * 60 * 1000),
          estimated_completion: new Date(Date.now() + 6 * 60 * 60 * 1000)
        }
      ]
    };

    setTimeout(() => {
      setComments(mockData.comments);
      setReviews(mockData.reviews);
      setWorkflows(mockData.workflows);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      id: `comment_${Date.now()}`,
      content_id: selectedContent,
      user: {
        id: 'current_user',
        name: 'Current User',
        email: 'current@example.com',
        avatar: null
      },
      comment_text: newComment,
      parent_comment_id: null,
      mentions: [],
      created_at: new Date(),
      reactions: {},
      replies: []
    };

    setComments(prev => [comment, ...prev]);
    setNewComment('');
  };

  const getTimeAgo = (date) => {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'changes_requested':
        return <AlertCircle className="h-4 w-4 text-amber-500" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-gray-500" />;
      default:
        return <Eye className="h-4 w-4 text-gray-500" />;
    }
  };

  const getWorkflowProgress = (workflow) => {
    const completedStages = workflow.stages.filter(stage => stage.status === 'completed').length;
    return (completedStages / workflow.stages.length) * 100;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading collaboration tools...</p>
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
            Collaboration Tools
          </h1>
          <p className="text-gray-600">Collaborate on content with comments, reviews, and workflows</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-fit lg:grid-cols-3">
          <TabsTrigger value="comments" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Comments ({comments.length})
          </TabsTrigger>
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Reviews ({reviews.length})
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <Workflow className="h-4 w-4" />
            Workflows ({workflows.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="comments" className="space-y-6">
          {/* Comment Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add Comment</CardTitle>
              <CardDescription>Share feedback and collaborate with your team</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <Textarea
                  placeholder="Share your thoughts, feedback, or questions..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button type="button" variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4 mr-1" />
                      Attach
                    </Button>
                    <Button type="button" variant="ghost" size="sm">
                      <AtSign className="h-4 w-4 mr-1" />
                      Mention
                    </Button>
                  </div>
                  <Button type="submit" disabled={!newComment.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Comment
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Comments List */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {comment.user.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{comment.user.name}</span>
                          <span className="text-xs text-gray-500">{getTimeAgo(comment.created_at)}</span>
                          {comment.mentions.length > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              <AtSign className="h-3 w-3 mr-1" />
                              Mentions
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{comment.comment_text}</p>
                        
                        {/* Reactions */}
                        <div className="flex items-center gap-2">
                          {Object.entries(comment.reactions).map(([emoji, users]) => (
                            <Button
                              key={emoji}
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs px-2"
                            >
                              {emoji} {users.length}
                            </Button>
                          ))}
                          <Button variant="ghost" size="sm" className="h-6 text-xs px-2">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            React
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 text-xs px-2">
                            Reply
                          </Button>
                        </div>

                        {/* Replies */}
                        {comment.replies.length > 0 && (
                          <div className="mt-3 pl-4 border-l-2 border-gray-200 space-y-3">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start gap-3">
                                <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                  {reply.user.name.charAt(0)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-semibold text-xs">{reply.user.name}</span>
                                    <span className="text-xs text-gray-500">{getTimeAgo(reply.created_at)}</span>
                                  </div>
                                  <p className="text-xs text-gray-700 mb-1">{reply.comment_text}</p>
                                  <div className="flex items-center gap-2">
                                    {Object.entries(reply.reactions).map(([emoji, users]) => (
                                      <Button
                                        key={emoji}
                                        variant="ghost"
                                        size="sm"
                                        className="h-5 text-xs px-1"
                                      >
                                        {emoji} {users.length}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {review.reviewer.name.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-base">{review.reviewer.name}</CardTitle>
                        <CardDescription className="capitalize">
                          {review.review_type.replace('_', ' ')} review
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(review.status)}
                      <Badge 
                        variant={review.status === 'approved' ? 'default' : review.status === 'changes_requested' ? 'secondary' : 'destructive'}
                        className="capitalize"
                      >
                        {review.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Overall Rating:</span>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.overall_rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {review.overall_rating}/5
                        </span>
                      </div>
                    </div>

                    {/* Feedback Areas */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Feedback Areas:</h4>
                      {Object.entries(review.feedback_areas).map(([area, feedback]) => (
                        <div key={area} className="p-3 rounded-lg bg-gray-50">
                          <div className="text-sm font-medium capitalize mb-1">
                            {area.replace('_', ' ')}
                          </div>
                          <div className="text-sm text-gray-600">{feedback}</div>
                        </div>
                      ))}
                    </div>

                    {/* Action Items */}
                    {review.action_items.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Action Items:</h4>
                        <ul className="space-y-1">
                          {review.action_items.map((item, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center mt-0.5 font-medium">
                                {index + 1}
                              </span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Decision Comment */}
                    {review.decision_comment && (
                      <div className="p-3 rounded-lg bg-blue-50 border-l-4 border-blue-400">
                        <div className="text-sm font-medium mb-1">Decision:</div>
                        <div className="text-sm text-gray-700">{review.decision_comment}</div>
                      </div>
                    )}

                    {/* Timing */}
                    <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
                      <span>Submitted: {review.created_at.toLocaleString()}</span>
                      {review.completed_at && (
                        <span>Completed: {review.completed_at.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <div className="space-y-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">{workflow.name}</CardTitle>
                      <CardDescription>
                        Current stage: {workflow.current_stage}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(workflow.status)}
                      <Badge 
                        variant={workflow.status === 'completed' ? 'default' : 'secondary'}
                        className="capitalize"
                      >
                        {workflow.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{Math.round(getWorkflowProgress(workflow))}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${getWorkflowProgress(workflow)}%` }}
                        />
                      </div>
                    </div>

                    {/* Workflow Stages */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Stages:</h4>
                      {workflow.stages.map((stage, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg border">
                          {getStatusIcon(stage.status)}
                          <div className="flex-1">
                            <div className="text-sm font-medium">{stage.name}</div>
                            <div className="text-xs text-gray-600">
                              Assigned to: {stage.assignee}
                            </div>
                          </div>
                          <Badge 
                            variant={stage.status === 'completed' ? 'default' : stage.status === 'in_progress' ? 'secondary' : 'outline'}
                            className="capitalize text-xs"
                          >
                            {stage.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      ))}
                    </div>

                    {/* Timing */}
                    <div className="flex justify-between text-xs text-gray-500 pt-2 border-t">
                      <span>Started: {workflow.started_at.toLocaleString()}</span>
                      <span>Est. completion: {workflow.estimated_completion.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CollaborationTools;