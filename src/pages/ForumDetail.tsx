import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  MessageSquare, 
  Heart, 
  Reply, 
  Eye, 
  Pin, 
  User, 
  Clock, 
  ArrowLeft,
  Send
} from "lucide-react";
import { useNavigate, useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { CommunityService, CommunityForum, ForumPost, ForumReply } from '@/services/communityService';
import { format } from 'date-fns';

const ForumDetail = () => {
  const navigate = useNavigate();
  const { forumId } = useParams<{ forumId: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [forum, setForum] = useState<CommunityForum | null>(null);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showReplyDialog, setShowReplyDialog] = useState(false);
  const [showPostDetail, setShowPostDetail] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newReplyContent, setNewReplyContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  useEffect(() => {
    if (forumId) {
      loadForumData();
    }
  }, [forumId]);

  const loadForumData = async () => {
    if (!forumId) return;
    
    setLoading(true);
    try {
      const [forumsData, postsData] = await Promise.all([
        CommunityService.getForums(),
        CommunityService.getForumPosts(forumId)
      ]);
      
      const currentForum = forumsData.find(f => f.id === forumId);
      setForum(currentForum || null);
      setPosts(postsData);
    } catch (error) {
      console.error('Error loading forum data:', error);
      toast({
        title: "Error",
        description: "Failed to load forum data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user || !forumId) return;
    
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      await CommunityService.createForumPost(
        user.id,
        forumId,
        newPostTitle,
        newPostContent,
        'discussion',
        isAnonymous
      );
      
      toast({
        title: "Success",
        description: "Post created successfully!",
      });
      
      setNewPostTitle('');
      setNewPostContent('');
      setIsAnonymous(false);
      setShowCreatePost(false);
      loadForumData(); // Refresh posts
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post.",
        variant: "destructive"
      });
    }
  };

  const handleCreateReply = async () => {
    if (!user || !selectedPost) return;
    
    if (!newReplyContent.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a reply.",
        variant: "destructive"
      });
      return;
    }

    try {
      await CommunityService.createForumReply(
        user.id,
        selectedPost.id,
        newReplyContent,
        isAnonymous
      );
      
      toast({
        title: "Success",
        description: "Reply posted successfully!",
      });
      
      setNewReplyContent('');
      setIsAnonymous(false);
      setShowReplyDialog(false);
      loadPostReplies(selectedPost.id); // Refresh replies
    } catch (error) {
      console.error('Error creating reply:', error);
      toast({
        title: "Error",
        description: "Failed to post reply.",
        variant: "destructive"
      });
    }
  };

  const loadPostReplies = async (postId: string) => {
    try {
      const repliesData = await CommunityService.getForumReplies(postId);
      setReplies(repliesData);
    } catch (error) {
      console.error('Error loading replies:', error);
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!user) return;
    
    try {
      await CommunityService.likeContent('post', postId);
      loadForumData(); // Refresh to update like count
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleViewPost = async (post: ForumPost) => {
    setSelectedPost(post);
    await loadPostReplies(post.id);
    setShowPostDetail(true);
  };

  const handleReplyToPost = (post: ForumPost) => {
    setSelectedPost(post);
    setShowReplyDialog(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!forum) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <p className="text-gray-500">Forum not found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b p-4">
        <div className="flex items-center space-x-3 max-w-6xl mx-auto">
          <Button variant="ghost" onClick={() => navigate('/community')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <img  
              className="h-8 w-auto"
              src="https://i.ibb.co/whR2z9DX/logo1b.png"
              alt="logo"
            />
            <div>
              <h1 className="text-xl font-bold text-gray-800">{forum.name}</h1>
              <p className="text-sm text-gray-600">{forum.member_count} members</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Forum Info */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{forum.name}</CardTitle>
                <CardDescription>{forum.description}</CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="capitalize">
                  {forum.category.replace('_', ' ')}
                </Badge>
                {forum.is_peer_led && (
                  <Badge variant="default">Peer-Led</Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Create Post Button */}
        <div className="mb-6">
          <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <MessageSquare className="w-4 h-4 mr-2" />
                Create New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    placeholder="Enter post title..."
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Share your thoughts, questions, or experiences..."
                    rows={6}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                  <label htmlFor="anonymous" className="text-sm">Post anonymously</label>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreatePost}>
                    <Send className="w-4 h-4 mr-2" />
                    Create Post
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {post.is_pinned && <Pin className="w-4 h-4 text-yellow-500" />}
                      <h3 className="text-lg font-semibold">{post.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.content}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{post.is_anonymous ? 'Anonymous' : post.user?.user_metadata?.full_name || 'User'}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{format(new Date(post.created_at), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleLikePost(post.id)}
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          {post.likes_count}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewPost(post)}
                        >
                          <Reply className="w-4 h-4 mr-1" />
                          {post.replies_count}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReplyToPost(post)}
                        >
                          Reply
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          {post.views_count}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Post Detail Dialog */}
        <Dialog open={showPostDetail} onOpenChange={setShowPostDetail}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedPost?.title}</DialogTitle>
            </DialogHeader>
            {selectedPost && (
              <div className="space-y-6">
                {/* Original Post */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <User className="w-4 h-4" />
                      <span className="font-medium">
                        {selectedPost.is_anonymous ? 'Anonymous' : selectedPost.user?.user_metadata?.full_name || 'User'}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-500">{format(new Date(selectedPost.created_at), 'MMM d, yyyy')}</span>
                    </div>
                    <p className="text-gray-700">{selectedPost.content}</p>
                  </CardContent>
                </Card>

                {/* Replies */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Replies ({replies.length})</h3>
                  {replies.map((reply) => (
                    <Card key={reply.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <User className="w-4 h-4" />
                          <span className="font-medium">
                            {reply.is_anonymous ? 'Anonymous' : reply.user?.user_metadata?.full_name || 'User'}
                          </span>
                          <span className="text-gray-500">•</span>
                          <span className="text-gray-500">{format(new Date(reply.created_at), 'MMM d, yyyy')}</span>
                        </div>
                        <p className="text-gray-700">{reply.content}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Reply Dialog */}
        <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reply to Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Your Reply</label>
                <Textarea
                  value={newReplyContent}
                  onChange={(e) => setNewReplyContent(e.target.value)}
                  placeholder="Write your reply..."
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="reply-anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                <label htmlFor="reply-anonymous" className="text-sm">Reply anonymously</label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowReplyDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateReply}>
                  <Send className="w-4 h-4 mr-2" />
                  Reply
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ForumDetail;