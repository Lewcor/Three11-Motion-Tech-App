import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Progress } from './ui/progress';
import { 
  Users, 
  UserPlus, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Calendar,
  Settings,
  BarChart3,
  Shield,
  Activity,
  Crown,
  Star,
  Zap
} from 'lucide-react';

const TeamDashboard = () => {
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock team data - in real app, this would come from API
  useEffect(() => {
    const mockTeamData = {
      team: {
        id: 'team_123',
        name: 'Fashion Content Team',
        description: 'Creating viral fashion content for Instagram and TikTok',
        owner: 'Sarah Johnson',
        created_at: '2024-01-15',
        plan: 'Professional',
        workspace_slug: 'fashion-content-team-a8b9'
      },
      summary: {
        total_members: 12,
        active_members: 10,
        pending_invitations: 2,
        total_content_pieces: 156,
        content_in_review: 8,
        published_this_month: 42
      },
      performance: {
        avg_approval_time_hours: 4.2,
        content_approval_rate: 94.5,
        team_productivity_score: 87.3,
        collaboration_index: 92.1
      },
      recent_activities: [
        {
          id: 1,
          user: 'Emma Wilson',
          action: 'created new Instagram caption',
          content: 'Fall Fashion Trends 2024',
          time: '2 minutes ago',
          type: 'content_created'
        },
        {
          id: 2,
          user: 'Mike Chen',
          action: 'approved content',
          content: 'TikTok video script',
          time: '15 minutes ago',
          type: 'content_approved'
        },
        {
          id: 3,
          user: 'Lisa Rodriguez',
          action: 'joined the team',
          content: 'Content Creator role',
          time: '1 hour ago',
          type: 'member_joined'
        },
        {
          id: 4,
          user: 'Alex Kim',
          action: 'submitted for review',
          content: 'Brand collaboration post',
          time: '2 hours ago',
          type: 'content_submitted'
        }
      ],
      workflows: [
        {
          id: 'wf_1',
          name: 'Instagram Content Review',
          items_pending: 3,
          avg_completion_time: 2.5
        },
        {
          id: 'wf_2',
          name: 'Brand Compliance Check',
          items_pending: 1,
          avg_completion_time: 1.2
        },
        {
          id: 'wf_3',
          name: 'TikTok Video Approval',
          items_pending: 4,
          avg_completion_time: 3.8
        }
      ],
      insights: [
        'Team productivity increased 15% this month',
        'Average content approval time improved by 2.3 hours',
        'Brand compliance rate is 98.5% - excellent work!',
        '3 new team members onboarded successfully'
      ]
    };

    setTimeout(() => {
      setTeamData(mockTeamData);
      setLoading(false);
    }, 1000);
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'content_created':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'content_approved':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'member_joined':
        return <UserPlus className="h-4 w-4 text-purple-500" />;
      case 'content_submitted':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading team dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="mb-4 lg:mb-0">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-6 w-6 text-yellow-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {teamData.team.name}
            </h1>
            <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
              {teamData.team.plan}
            </Badge>
          </div>
          <p className="text-gray-600">{teamData.team.description}</p>
          <p className="text-sm text-gray-500 mt-1">
            Team Owner: {teamData.team.owner} • Created {new Date(teamData.team.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
            <UserPlus className="h-4 w-4 mr-2" />
            Invite Member
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-fit lg:grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="workflows" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Insights
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Team Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamData.summary.total_members}</div>
                <p className="text-xs text-muted-foreground">
                  {teamData.summary.active_members} active, {teamData.summary.pending_invitations} pending
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Content Pieces</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamData.summary.total_content_pieces}</div>
                <p className="text-xs text-muted-foreground">
                  {teamData.summary.published_this_month} published this month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Review</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamData.summary.content_in_review}</div>
                <p className="text-xs text-muted-foreground">
                  Avg. {teamData.performance.avg_approval_time_hours}h approval time
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{teamData.performance.content_approval_rate}%</div>
                <p className="text-xs text-muted-foreground">
                  +5.2% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
                <CardDescription>Key productivity and collaboration metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Productivity Score</span>
                    <span className="font-medium">{teamData.performance.team_productivity_score}/100</span>
                  </div>
                  <Progress value={teamData.performance.team_productivity_score} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Collaboration Index</span>
                    <span className="font-medium">{teamData.performance.collaboration_index}/100</span>
                  </div>
                  <Progress value={teamData.performance.collaboration_index} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Approval Rate</span>
                    <span className="font-medium">{teamData.performance.content_approval_rate}%</span>
                  </div>
                  <Progress value={teamData.performance.content_approval_rate} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Workflows</CardTitle>
                <CardDescription>Current approval processes and pending items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {teamData.workflows.map((workflow) => (
                    <div key={workflow.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium text-sm">{workflow.name}</p>
                        <p className="text-xs text-gray-500">
                          Avg. completion: {workflow.avg_completion_time}h
                        </p>
                      </div>
                      <Badge variant={workflow.items_pending > 3 ? "destructive" : "secondary"}>
                        {workflow.items_pending} pending
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Team Activity</CardTitle>
              <CardDescription>Latest actions and updates from your team members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamData.recent_activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    {getActivityIcon(activity.type)}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>
                        {' '}{activity.action}
                        {activity.content && (
                          <span className="font-medium text-blue-600"> "{activity.content}"</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {teamData.workflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardHeader>
                  <CardTitle className="text-base">{workflow.name}</CardTitle>
                  <CardDescription>
                    {workflow.items_pending} items pending approval
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Average completion time</span>
                      <span className="font-medium">{workflow.avg_completion_time} hours</span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Insights</CardTitle>
              <CardDescription>AI-powered insights and recommendations for your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teamData.insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border">
                    <Star className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm font-medium">{insight}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamDashboard;