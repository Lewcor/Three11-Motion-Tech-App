import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Calendar, Clock, Eye, Edit, Trash2, Plus, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';

const ContentScheduler = () => {
  const [scheduledContent, setScheduledContent] = useState([]);
  const [generationResults, setGenerationResults] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [scheduledTime, setScheduledTime] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [autoPost, setAutoPost] = useState(false);
  const [notes, setNotes] = useState('');
  const [calendarOverview, setCalendarOverview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const API = `${BACKEND_URL}/api`;

  const platforms = [
    { id: 'tiktok', name: 'TikTok', icon: '📱', color: 'bg-pink-500' },
    { id: 'instagram', name: 'Instagram', icon: '📷', color: 'bg-purple-500' },
    { id: 'youtube', name: 'YouTube', icon: '📺', color: 'bg-red-500' },
    { id: 'facebook', name: 'Facebook', icon: '👥', color: 'bg-blue-500' }
  ];

  useEffect(() => {
    fetchScheduledContent();
    fetchGenerationResults();
    fetchCalendarOverview();
  }, []);

  const fetchScheduledContent = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/schedule`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setScheduledContent(response.data);
    } catch (error) {
      console.error('Error fetching scheduled content:', error);
    }
  };

  const fetchGenerationResults = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/generations?limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGenerationResults(response.data);
    } catch (error) {
      console.error('Error fetching generation results:', error);
    }
  };

  const fetchCalendarOverview = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API}/schedule/calendar`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCalendarOverview(response.data);
    } catch (error) {
      console.error('Error fetching calendar overview:', error);
    }
  };

  const handleScheduleContent = async () => {
    if (!selectedContent || !scheduledDate || !scheduledTime) {
      toast.error('Please select content and set schedule time');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      
      const formData = new FormData();
      formData.append('user_id', 'current_user');
      formData.append('generation_result_id', selectedContent.id);
      formData.append('platform', selectedContent.platform);
      formData.append('scheduled_time', scheduledDateTime.toISOString());
      formData.append('auto_post', autoPost);
      formData.append('notes', notes);

      await axios.post(`${API}/schedule`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Content scheduled successfully!');
      setShowScheduleModal(false);
      resetForm();
      fetchScheduledContent();
      fetchCalendarOverview();
    } catch (error) {
      console.error('Error scheduling content:', error);
      toast.error(error.response?.data?.detail || 'Failed to schedule content');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelScheduled = async (scheduledId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API}/schedule/${scheduledId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Scheduled content cancelled');
      fetchScheduledContent();
      fetchCalendarOverview();
    } catch (error) {
      console.error('Error cancelling scheduled content:', error);
      toast.error('Failed to cancel scheduled content');
    }
  };

  const resetForm = () => {
    setSelectedContent(null);
    setScheduledDate('');
    setScheduledTime('');
    setAutoPost(false);
    setNotes('');
  };

  const getPlatformInfo = (platformId) => {
    return platforms.find(p => p.id === platformId) || platforms[0];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'posted':
        return 'bg-green-100 text-green-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'cancelled':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-yellow-100 text-yellow-700';
    }
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUpcoming: date > new Date(),
      isPast: date < new Date()
    };
  };

  const getUpcomingPosts = () => {
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    
    return scheduledContent.filter(item => {
      const scheduledDate = new Date(item.scheduled_time);
      return scheduledDate >= now && scheduledDate <= next24Hours && item.status === 'scheduled';
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-4">
          Content Scheduler
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Plan and schedule your content across all platforms
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Overview */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Calendar Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {calendarOverview ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{calendarOverview.total_scheduled}</div>
                      <div className="text-sm text-blue-600">Total Scheduled</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{calendarOverview.next_7_days}</div>
                      <div className="text-sm text-green-600">Next 7 Days</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Platforms</h4>
                    <div className="space-y-2">
                      {Object.entries(calendarOverview.platforms || {}).map(([platform, count]) => {
                        const platformInfo = getPlatformInfo(platform);
                        return (
                          <div key={platform} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span>{platformInfo.icon}</span>
                              <span className="text-sm">{platformInfo.name}</span>
                            </div>
                            <Badge variant="outline">{count}</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <Calendar className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">Loading overview...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Next 24 Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              {getUpcomingPosts().length > 0 ? (
                <div className="space-y-3">
                  {getUpcomingPosts().slice(0, 5).map((item) => {
                    const dateTime = formatDateTime(item.scheduled_time);
                    const platformInfo = getPlatformInfo(item.platform);
                    
                    return (
                      <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <div className={`w-8 h-8 rounded-full ${platformInfo.color} flex items-center justify-center text-white text-sm`}>
                          {platformInfo.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.notes || 'Scheduled post'}</p>
                          <p className="text-xs text-gray-600">{dateTime.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <Clock className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p className="text-sm">No posts in next 24 hours</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Quick Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => setShowScheduleModal(true)}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Schedule Content
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Scheduled Content List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Scheduled Content
              </CardTitle>
              <CardDescription>
                Manage your scheduled posts across all platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              {scheduledContent.length > 0 ? (
                <div className="space-y-4">
                  {scheduledContent.map((item) => {
                    const dateTime = formatDateTime(item.scheduled_time);
                    const platformInfo = getPlatformInfo(item.platform);
                    
                    return (
                      <div key={item.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-full ${platformInfo.color} flex items-center justify-center text-white`}>
                              {platformInfo.icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{platformInfo.name}</h3>
                                <Badge className={getStatusColor(item.status)}>
                                  {item.status.toUpperCase()}
                                </Badge>
                                {item.auto_post && (
                                  <Badge variant="outline">Auto-Post</Badge>
                                )}
                              </div>
                              <p className="text-sm text-gray-600">
                                {dateTime.date} at {dateTime.time}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            {item.status === 'scheduled' && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelScheduled(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        {item.notes && (
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {item.notes}
                          </p>
                        )}
                        
                        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                          <span>Created: {new Date(item.created_at).toLocaleDateString()}</span>
                          {dateTime.isUpcoming && (
                            <span className="text-blue-600">⏰ Upcoming</span>
                          )}
                          {dateTime.isPast && item.status === 'scheduled' && (
                            <span className="text-red-600">⚠️ Overdue</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No scheduled content yet</p>
                  <p className="text-sm">Schedule your first post to see it here!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Schedule Content</CardTitle>
              <CardDescription>
                Select content and set schedule time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Content Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Select Content</label>
                <div className="max-h-40 overflow-y-auto border rounded-lg">
                  {generationResults.map((result) => (
                    <div
                      key={result.id}
                      className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                        selectedContent?.id === result.id ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => setSelectedContent(result)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{result.category} • {result.platform}</p>
                          <p className="text-xs text-gray-600 truncate">{result.content_description}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(result.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schedule Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Date</label>
                  <Input
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Time</label>
                  <Input
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Auto Post Toggle */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="autoPost"
                  checked={autoPost}
                  onChange={(e) => setAutoPost(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="autoPost" className="text-sm font-medium">
                  Auto-post (requires social media integration)
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
                <Textarea
                  placeholder="Add notes about this scheduled post..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleScheduleContent}
                  disabled={loading || !selectedContent || !scheduledDate || !scheduledTime}
                  className="flex-1"
                >
                  {loading ? 'Scheduling...' : 'Schedule Content'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowScheduleModal(false);
                    resetForm();
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ContentScheduler;