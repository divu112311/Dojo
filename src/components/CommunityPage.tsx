import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  MessageSquare, 
  Award, 
  TrendingUp, 
  Heart, 
  Share2, 
  ThumbsUp, 
  Send, 
  Filter, 
  Search,
  User as UserIcon,
  Calendar,
  Clock,
  Bookmark,
  MoreHorizontal,
  ChevronDown,
  Tag,
  Zap,
  X
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { useUserProfile } from '../hooks/useUserProfile';
import { useXP } from '../hooks/useXP';

interface CommunityPageProps {
  user: User;
  onXPUpdate?: (points: number) => void;
}

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    level: number;
    belt: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  tags: string[];
  liked: boolean;
  bookmarked: boolean;
}

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ user, onXPUpdate }) => {
  const { getDisplayName } = useUserProfile(user);
  const { getCurrentLevel, getBeltRank } = useXP(user);
  const [activeTab, setActiveTab] = useState<'feed' | 'challenges' | 'leaderboard'>('feed');
  const [newPostContent, setNewPostContent] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showTagFilter, setShowTagFilter] = useState(false);
  const [posts, setPosts] = useState<Post[]>(generateSamplePosts());
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [postComments, setPostComments] = useState<Record<string, Comment[]>>({});
  const [newComment, setNewComment] = useState('');

  const level = getCurrentLevel();
  const beltRank = getBeltRank(level);
  const displayName = getDisplayName();

  const popularTags = [
    'budgeting', 'investing', 'saving', 'debt-free', 'financial-freedom',
    'retirement', 'side-hustle', 'frugal-living', 'wealth-building'
  ];

  function generateSamplePosts(): Post[] {
    const samplePosts: Post[] = [
      {
        id: '1',
        author: {
          name: 'Jessica Chen',
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
          level: 8,
          belt: 'Yellow Belt'
        },
        content: "Just hit my emergency fund goal of $10,000! 🎉 Took me 14 months of consistent saving. For anyone struggling to build their fund, my tip is to start small and automate transfers on payday before you can spend it. What strategies worked for you?",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        likes: 42,
        comments: 7,
        tags: ['emergency-fund', 'saving', 'goals'],
        liked: false,
        bookmarked: false
      },
      {
        id: '2',
        author: {
          name: 'Marcus Johnson',
          avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
          level: 15,
          belt: 'Blue Belt'
        },
        content: "I've been using the 50/30/20 budget rule for 6 months now and it's completely changed my financial life. 50% needs, 30% wants, 20% savings/debt. Simple but effective. What budgeting method works best for you?",
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
        likes: 38,
        comments: 12,
        tags: ['budgeting', '50-30-20-rule', 'money-management'],
        liked: true,
        bookmarked: true
      },
      {
        id: '3',
        author: {
          name: 'Sophia Rodriguez',
          avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
          level: 24,
          belt: 'Brown Belt'
        },
        content: "Investment milestone: My portfolio just crossed $100K! Started with just $50/month five years ago, then gradually increased as my income grew. Compound interest is truly magical. Key lesson: time in the market beats timing the market. Stay consistent!",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        likes: 87,
        comments: 23,
        tags: ['investing', 'milestone', 'compound-interest'],
        liked: false,
        bookmarked: false
      },
      {
        id: '4',
        author: {
          name: 'David Kim',
          avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
          level: 12,
          belt: 'Green Belt'
        },
        content: "Finally paid off my $35,000 student loan today! 🎉 Took 3 years of aggressive payments and some serious lifestyle adjustments, but the freedom feels incredible. If you're struggling with debt, remember that every extra dollar toward principal makes a difference!",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        likes: 124,
        comments: 31,
        tags: ['debt-free', 'student-loans', 'financial-freedom'],
        liked: false,
        bookmarked: true
      },
      {
        id: '5',
        author: {
          name: 'Aisha Patel',
          avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
          level: 32,
          belt: 'Black Belt'
        },
        content: "Side hustle update: My Etsy shop just hit $2,000 monthly revenue! 📈 Started as a hobby 18 months ago and now it covers my rent. For those interested in side hustles, find something you enjoy that solves a problem for others. What side hustles have worked for you?",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        likes: 76,
        comments: 19,
        tags: ['side-hustle', 'passive-income', 'entrepreneurship'],
        liked: true,
        bookmarked: false
      }
    ];

    return samplePosts;
  }

  const generateSampleComments = (postId: string): Comment[] => {
    const sampleComments: Comment[] = [
      {
        id: `${postId}-comment-1`,
        author: {
          name: 'Taylor Wilson',
          avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150',
        },
        content: "Congratulations! I'm working on my emergency fund too. Did you keep it in a high-yield savings account?",
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        likes: 3
      },
      {
        id: `${postId}-comment-2`,
        author: {
          name: 'Jordan Lee',
          avatar: 'https://images.pexels.com/photos/1933873/pexels-photo-1933873.jpeg?auto=compress&cs=tinysrgb&w=150',
        },
        content: "This is so inspiring! I'm about halfway to my goal. The automation tip is key - I don't even see the money before it goes to savings.",
        timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        likes: 5
      },
      {
        id: `${postId}-comment-3`,
        author: {
          name: 'Alex Morgan',
          avatar: 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=150',
        },
        content: "Great job! I found that having a separate account specifically for emergencies helped me avoid dipping into it for non-emergencies.",
        timestamp: new Date(Date.now() - 90 * 60 * 1000), // 90 minutes ago
        likes: 2
      }
    ];

    return sampleComments;
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPostContent.trim()) return;
    
    // Create new post
    const newPost: Post = {
      id: `user-post-${Date.now()}`,
      author: {
        name: displayName,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2A6F68&color=fff`,
        level,
        belt: beltRank.name
      },
      content: newPostContent,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      tags: extractTags(newPostContent),
      liked: false,
      bookmarked: false
    };
    
    // Add to posts
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    
    // Award XP for community contribution
    if (onXPUpdate) {
      onXPUpdate(10);
    }
  };

  const extractTags = (content: string): string[] => {
    const hashtagRegex = /#(\w+)/g;
    const matches = content.match(hashtagRegex);
    
    if (!matches) return [];
    
    return matches.map(tag => tag.substring(1).toLowerCase());
  };

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const newLiked = !post.liked;
        return {
          ...post,
          liked: newLiked,
          likes: newLiked ? post.likes + 1 : post.likes - 1
        };
      }
      return post;
    }));
  };

  const handleBookmarkPost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          bookmarked: !post.bookmarked
        };
      }
      return post;
    }));
  };

  const handleExpandPost = (postId: string) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
      return;
    }
    
    setExpandedPost(postId);
    
    // Generate comments if they don't exist
    if (!postComments[postId]) {
      setPostComments({
        ...postComments,
        [postId]: generateSampleComments(postId)
      });
    }
  };

  const handleAddComment = (postId: string) => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: `${postId}-comment-${Date.now()}`,
      author: {
        name: displayName,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2A6F68&color=fff`,
      },
      content: newComment,
      timestamp: new Date(),
      likes: 0
    };
    
    // Add comment to post
    setPostComments({
      ...postComments,
      [postId]: [...(postComments[postId] || []), comment]
    });
    
    // Update comment count
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: post.comments + 1
        };
      }
      return post;
    }));
    
    setNewComment('');
    
    // Award XP for community engagement
    if (onXPUpdate) {
      onXPUpdate(5);
    }
  };

  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else if (diffMins > 0) {
      return `${diffMins}m ago`;
    } else {
      return 'Just now';
    }
  };

  const filteredPosts = posts.filter(post => {
    // Filter by search term
    if (searchTerm && !post.content.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !post.author.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by tag
    if (selectedTag && !post.tags.includes(selectedTag)) {
      return false;
    }
    
    return true;
  });

  const leaderboardUsers = [
    { 
      name: 'Aisha Patel', 
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      level: 32,
      belt: 'Black Belt',
      xp: 3245,
      achievements: ['Investment Master', 'Community Leader', 'Knowledge Sharer']
    },
    { 
      name: 'Marcus Johnson', 
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      level: 28,
      belt: 'Black Belt',
      xp: 2876,
      achievements: ['Debt Destroyer', 'Savings Champion', 'Budget Master']
    },
    { 
      name: 'Sophia Rodriguez', 
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      level: 24,
      belt: 'Brown Belt',
      xp: 2412,
      achievements: ['Investment Guru', 'Goal Crusher', 'Quiz Ace']
    },
    { 
      name: displayName, 
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=2A6F68&color=fff`,
      level,
      belt: beltRank.name,
      xp: level * 100,
      achievements: ['Welcome', 'First Steps', 'Learning Starter']
    },
    { 
      name: 'David Kim', 
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      level: 12,
      belt: 'Green Belt',
      xp: 1245,
      achievements: ['Debt Slayer', 'Budget Novice']
    }
  ].sort((a, b) => b.xp - a.xp);

  const activeChallenges = [
    {
      id: '1',
      title: 'No-Spend Weekend Challenge',
      description: 'Go an entire weekend without spending any money on non-essentials',
      participants: 342,
      daysLeft: 3,
      xpReward: 50,
      difficulty: 'Medium',
      category: 'Saving'
    },
    {
      id: '2',
      title: '30-Day Meal Prep Challenge',
      description: 'Prepare all your meals at home for 30 days to reduce food expenses',
      participants: 156,
      daysLeft: 12,
      xpReward: 100,
      difficulty: 'Hard',
      category: 'Budgeting'
    },
    {
      id: '3',
      title: 'Investment Learning Sprint',
      description: 'Complete 5 investment modules in 7 days',
      participants: 278,
      daysLeft: 5,
      xpReward: 75,
      difficulty: 'Medium',
      category: 'Learning'
    },
    {
      id: '4',
      title: 'Subscription Audit',
      description: 'Review and cancel at least 2 unused subscriptions',
      participants: 421,
      daysLeft: 7,
      xpReward: 30,
      difficulty: 'Easy',
      category: 'Saving'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#2A6F68] rounded-xl p-6 text-white relative overflow-hidden flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Community Dojo</h1>
            <p className="text-white/90 text-sm">Connect, share, and grow with fellow financial warriors</p>
          </div>
        </div>
        
        <div className="bg-white/20 rounded-lg px-3 py-1 text-sm">
          <span className="text-white font-medium">{beltRank.name}</span>
          <span className="mx-2 text-white/60">•</span>
          <span className="text-white/90">{level * 100} XP</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Community Feed & Tabs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => setActiveTab('feed')}
                className={`py-3 px-4 rounded-lg transition-all ${
                  activeTab === 'feed'
                    ? 'bg-[#2A6F68] text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <MessageSquare className="h-4 w-4" />
                  <span className="font-medium">Community Feed</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('challenges')}
                className={`py-3 px-4 rounded-lg transition-all ${
                  activeTab === 'challenges'
                    ? 'bg-[#2A6F68] text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Award className="h-4 w-4" />
                  <span className="font-medium">Challenges</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('leaderboard')}
                className={`py-3 px-4 rounded-lg transition-all ${
                  activeTab === 'leaderboard'
                    ? 'bg-[#2A6F68] text-white'
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="font-medium">Leaderboard</span>
                </div>
              </button>
            </div>
          </div>

          {/* Content based on active tab */}
          <AnimatePresence mode="wait">
            {activeTab === 'feed' && (
              <motion.div
                key="feed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Create Post */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <form onSubmit={handlePostSubmit}>
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-[#2A6F68] flex items-center justify-center text-white">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={newPostContent}
                          onChange={(e) => setNewPostContent(e.target.value)}
                          placeholder="Share your financial wins, tips, or questions with the community..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all min-h-[100px] text-sm"
                        />
                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-xs text-gray-500">
                            Use #hashtags to categorize your post
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            disabled={!newPostContent.trim()}
                            className="bg-[#2A6F68] text-white px-4 py-2 rounded-lg hover:bg-[#235A54] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
                          >
                            Post to Community
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Search and Filter */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search posts..."
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all text-sm"
                      />
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => setShowTagFilter(!showTagFilter)}
                        className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                      >
                        <Filter className="h-4 w-4 text-gray-500" />
                        <span>{selectedTag ? `#${selectedTag}` : 'Filter by tag'}</span>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      </button>
                      
                      <AnimatePresence>
                        {showTagFilter && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-10"
                          >
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-sm text-gray-700">Popular Tags</h4>
                              {selectedTag && (
                                <button
                                  onClick={() => {
                                    setSelectedTag(null);
                                    setShowTagFilter(false);
                                  }}
                                  className="text-xs text-[#2A6F68] hover:underline"
                                >
                                  Clear filter
                                </button>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {popularTags.map(tag => (
                                <button
                                  key={tag}
                                  onClick={() => {
                                    setSelectedTag(tag);
                                    setShowTagFilter(false);
                                  }}
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    selectedTag === tag
                                      ? 'bg-[#2A6F68] text-white'
                                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                  }`}
                                >
                                  #{tag}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>

                {/* Posts */}
                {filteredPosts.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm || selectedTag
                        ? 'Try adjusting your search or filters'
                        : 'Be the first to share with the community!'}
                    </p>
                    {(searchTerm || selectedTag) && (
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setSelectedTag(null);
                        }}
                        className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <X className="h-4 w-4" />
                        <span>Clear filters</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPosts.map(post => (
                      <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                        {/* Post Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <img
                              src={post.author.avatar}
                              alt={post.author.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                                <span className="text-xs bg-[#2A6F68]/10 text-[#2A6F68] px-2 py-0.5 rounded-full">
                                  Level {post.author.level}
                                </span>
                                <span className="text-xs text-gray-500">{post.author.belt}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-xs text-gray-500">
                                <Clock className="h-3 w-3" />
                                <span>{formatTimestamp(post.timestamp)}</span>
                              </div>
                            </div>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                        
                        {/* Post Content */}
                        <div className="mb-3">
                          <p className="text-gray-800 whitespace-pre-line">{post.content}</p>
                        </div>
                        
                        {/* Post Tags */}
                        {post.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {post.tags.map(tag => (
                              <button
                                key={tag}
                                onClick={() => setSelectedTag(tag)}
                                className="flex items-center space-x-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs hover:bg-gray-200 transition-colors"
                              >
                                <Tag className="h-3 w-3" />
                                <span>#{tag}</span>
                              </button>
                            ))}
                          </div>
                        )}
                        
                        {/* Post Actions */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => handleLikePost(post.id)}
                              className={`flex items-center space-x-1 text-sm ${
                                post.liked ? 'text-[#B76E79]' : 'text-gray-500 hover:text-[#B76E79]'
                              }`}
                            >
                              <ThumbsUp className="h-4 w-4" />
                              <span>{post.likes}</span>
                            </button>
                            <button
                              onClick={() => handleExpandPost(post.id)}
                              className="flex items-center space-x-1 text-sm text-gray-500 hover:text-[#2A6F68]"
                            >
                              <MessageSquare className="h-4 w-4" />
                              <span>{post.comments}</span>
                            </button>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => handleBookmarkPost(post.id)}
                              className={`text-sm ${
                                post.bookmarked ? 'text-[#2A6F68]' : 'text-gray-500 hover:text-[#2A6F68]'
                              }`}
                            >
                              <Bookmark className="h-4 w-4" />
                            </button>
                            <button className="text-sm text-gray-500 hover:text-[#2A6F68]">
                              <Share2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Comments Section */}
                        <AnimatePresence>
                          {expandedPost === post.id && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t border-gray-100"
                            >
                              <h4 className="font-medium text-gray-900 mb-3">Comments</h4>
                              
                              {/* Comment List */}
                              <div className="space-y-3 mb-4">
                                {postComments[post.id]?.map(comment => (
                                  <div key={comment.id} className="flex space-x-3">
                                    <img
                                      src={comment.author.avatar}
                                      alt={comment.author.name}
                                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                    />
                                    <div className="flex-1 bg-gray-50 rounded-lg p-3">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-gray-900 text-sm">{comment.author.name}</span>
                                        <span className="text-xs text-gray-500">{formatTimestamp(comment.timestamp)}</span>
                                      </div>
                                      <p className="text-gray-800 text-sm">{comment.content}</p>
                                      <div className="flex items-center space-x-2 mt-2">
                                        <button className="text-xs text-gray-500 hover:text-[#B76E79] flex items-center space-x-1">
                                          <ThumbsUp className="h-3 w-3" />
                                          <span>{comment.likes}</span>
                                        </button>
                                        <button className="text-xs text-gray-500 hover:text-[#2A6F68]">
                                          Reply
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              
                              {/* Add Comment */}
                              <div className="flex space-x-3">
                                <div className="w-8 h-8 rounded-full bg-[#2A6F68] flex items-center justify-center text-white flex-shrink-0">
                                  {displayName.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 relative">
                                  <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all text-sm"
                                  />
                                  <button
                                    onClick={() => handleAddComment(post.id)}
                                    disabled={!newComment.trim()}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#2A6F68] disabled:text-gray-300"
                                  >
                                    <Send className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'challenges' && (
              <motion.div
                key="challenges"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Active Challenges */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Active Community Challenges</h3>
                  <div className="space-y-4">
                    {activeChallenges.map(challenge => (
                      <div key={challenge.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-semibold text-gray-900">{challenge.title}</h4>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${
                                challenge.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                challenge.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {challenge.difficulty}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-3">{challenge.description}</p>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Users className="h-3 w-3" />
                                <span>{challenge.participants} participants</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="h-3 w-3" />
                                <span>{challenge.daysLeft} days left</span>
                              </div>
                              <div className="flex items-center space-x-1 text-yellow-600">
                                <Zap className="h-3 w-3" />
                                <span>+{challenge.xpReward} XP reward</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Tag className="h-3 w-3" />
                                <span>{challenge.category}</span>
                              </div>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-[#2A6F68] text-white px-3 py-1 rounded-lg text-sm hover:bg-[#235A54] transition-colors"
                          >
                            Join Challenge
                          </motion.button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Past Challenges */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Past Challenges</h3>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900">52-Week Savings Challenge</h4>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">Completed</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">Save an increasing amount each week for a year, starting with $1 and ending with $52</p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>1,245 participants</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Ended 2 months ago</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Tag className="h-3 w-3" />
                              <span>Saving</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-lg text-xs">
                          <CheckCircle className="h-3 w-3" />
                          <span>+150 XP earned</span>
                        </div>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900">Financial Book Club</h4>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-800">Completed</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">Read "The Psychology of Money" and participate in weekly discussions</p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>876 participants</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Ended 3 weeks ago</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Tag className="h-3 w-3" />
                              <span>Learning</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded-lg text-xs">
                          <CheckCircle className="h-3 w-3" />
                          <span>+100 XP earned</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Challenges */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Upcoming Challenges</h3>
                    <button className="text-sm text-[#2A6F68] hover:underline">View all</button>
                  </div>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900">Debt Payoff Sprint</h4>
                            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">Coming Soon</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">Accelerate your debt payoff by making extra payments for 30 days</p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>Starts in 2 weeks</span>
                            </div>
                            <div className="flex items-center space-x-1 text-yellow-600">
                              <Zap className="h-3 w-3" />
                              <span>+125 XP reward</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Tag className="h-3 w-3" />
                              <span>Debt Management</span>
                            </div>
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm hover:bg-gray-200 transition-colors"
                        >
                          Get Notified
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'leaderboard' && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Leaderboard */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Community Leaderboard</h3>
                  <div className="space-y-4">
                    {leaderboardUsers.map((user, index) => (
                      <div 
                        key={user.name} 
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          user.name === displayName 
                            ? 'bg-[#2A6F68]/10 border border-[#2A6F68]/20' 
                            : index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 flex items-center justify-center font-bold text-gray-700 bg-gray-200 rounded-full">
                            {index + 1}
                          </div>
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-gray-900">{user.name}</h4>
                              {user.name === displayName && (
                                <span className="text-xs bg-[#2A6F68]/10 text-[#2A6F68] px-2 py-0.5 rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span>Level {user.level}</span>
                              <span>•</span>
                              <span>{user.belt}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-[#2A6F68]">{user.xp} XP</div>
                          <div className="flex items-center justify-end space-x-1 text-xs text-gray-500">
                            <Award className="h-3 w-3" />
                            <span>{user.achievements.length} achievements</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievement Showcase */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Top Achievements</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-amber-50 to-amber-100">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                          <Award className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Debt Destroyer</h4>
                          <p className="text-xs text-gray-600">Completely pay off a major debt</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>124 members earned</span>
                        <span className="text-amber-600">+200 XP</span>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-blue-100">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                          <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Investment Guru</h4>
                          <p className="text-xs text-gray-600">Complete all investment modules</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>87 members earned</span>
                        <span className="text-blue-600">+250 XP</span>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-green-50 to-green-100">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                          <Heart className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Community Leader</h4>
                          <p className="text-xs text-gray-600">Help 50+ members with advice</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>32 members earned</span>
                        <span className="text-green-600">+300 XP</span>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-purple-50 to-purple-100">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Challenge Champion</h4>
                          <p className="text-xs text-gray-600">Complete 10 community challenges</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>45 members earned</span>
                        <span className="text-purple-600">+275 XP</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column - Community Stats & Trending */}
        <div className="space-y-6">
          {/* Your Community Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Your Community Stats</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#2A6F68]/10 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-[#2A6F68]">Level {level}</div>
                <div className="text-xs text-gray-600">{beltRank.name}</div>
              </div>
              <div className="bg-[#B76E79]/10 rounded-lg p-3 text-center">
                <div className="text-lg font-bold text-[#B76E79]">3</div>
                <div className="text-xs text-gray-600">Contributions</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Posts</span>
                <span className="font-medium text-gray-900">2</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Comments</span>
                <span className="font-medium text-gray-900">5</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Challenges Completed</span>
                <span className="font-medium text-gray-900">1</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Helpful Votes Received</span>
                <span className="font-medium text-gray-900">12</span>
              </div>
            </div>
          </div>

          {/* Trending Topics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Trending Topics</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">I-Bonds vs HYSA</h4>
                  <p className="text-xs text-gray-500">32 posts this week</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">Recession-Proof Careers</h4>
                  <p className="text-xs text-gray-500">28 posts this week</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">House Hacking Strategies</h4>
                  <p className="text-xs text-gray-500">24 posts this week</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm">Credit Card Churning</h4>
                  <p className="text-xs text-gray-500">19 posts this week</p>
                </div>
              </div>
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="bg-gradient-to-br from-[#2A6F68]/5 to-[#B76E79]/10 rounded-xl p-4 border border-[#2A6F68]/20">
            <h3 className="font-semibold text-[#2A6F68] mb-3">Community Guidelines</h3>
            <div className="space-y-2 text-sm text-gray-700">
              <p>• Be respectful and supportive of others</p>
              <p>• Share knowledge, not financial advice</p>
              <p>• Protect your privacy - don't share account details</p>
              <p>• Stay on topic with financial discussions</p>
              <p>• Celebrate wins and learn from setbacks</p>
            </div>
            <button className="mt-3 text-sm text-[#2A6F68] hover:underline">
              Read full guidelines
            </button>
          </div>

          {/* Active Members */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Active Members</h3>
              <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                24 online now
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="w-8 h-8 rounded-full bg-[#2A6F68] flex items-center justify-center text-white text-xs">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <img
                src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
                alt="Member"
                className="w-8 h-8 rounded-full object-cover"
              />
              <img
                src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
                alt="Member"
                className="w-8 h-8 rounded-full object-cover"
              />
              <img
                src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150"
                alt="Member"
                className="w-8 h-8 rounded-full object-cover"
              />
              <img
                src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150"
                alt="Member"
                className="w-8 h-8 rounded-full object-cover"
              />
              <img
                src="https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150"
                alt="Member"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs">
                +18
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;