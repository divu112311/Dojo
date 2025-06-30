import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Award, 
  Target, 
  Calendar, 
  MessageCircle, 
  Heart, 
  Share2, 
  Send, 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  User, 
  ThumbsUp, 
  MessageSquare, 
  Clock, 
  Zap, 
  Trophy, 
  CheckCircle, 
  Star, 
  TrendingUp, 
  PiggyBank, 
  DollarSign, 
  Gift, 
  Bell, 
  Bookmark, 
  MoreHorizontal, 
  Image, 
  Smile, 
  Paperclip
} from 'lucide-react';
import { User as UserType } from '@supabase/supabase-js';
import doughjoMascot from '../assets/doughjo-mascot.png';

interface CommunityPageProps {
  user: UserType;
  onXPUpdate: (points: number) => void;
}

interface MoneyCircle {
  id: string;
  name: string;
  members: number;
  description: string;
  category: string;
  isJoined: boolean;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  deadline: string;
  progress: number;
  isCompleted: boolean;
}

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  level: number;
  xp: number;
  rank: number;
  change: 'up' | 'down' | 'same';
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  isEarned: boolean;
  earnedDate?: string;
}

interface CollaborationProject {
  id: string;
  title: string;
  description: string;
  members: number;
  progress: number;
  category: string;
  deadline: string;
}

interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userLevel: number;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  media?: string;
  achievement?: {
    type: string;
    title: string;
    icon: React.ElementType;
  };
}

const CommunityPage: React.FC<CommunityPageProps> = ({ user, onXPUpdate }) => {
  const [activeTab, setActiveTab] = useState<'circles' | 'quests' | 'leaderboard' | 'badges' | 'collaboration' | 'feed'>('feed');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newPostContent, setNewPostContent] = useState('');
  const [isPostingComment, setIsPostingComment] = useState(false);

  // Sample data for Money Circles
  const [moneyCircles] = useState<MoneyCircle[]>([
    {
      id: '1',
      name: 'Budget Masters',
      members: 1243,
      description: 'A community focused on optimizing budgets and saving strategies.',
      category: 'Budgeting',
      isJoined: true
    },
    {
      id: '2',
      name: 'Investment Ninjas',
      members: 856,
      description: 'Learn and discuss investment strategies for long-term wealth building.',
      category: 'Investing',
      isJoined: false
    },
    {
      id: '3',
      name: 'Debt Destroyers',
      members: 1502,
      description: 'Support group for those working to eliminate debt and achieve financial freedom.',
      category: 'Debt',
      isJoined: true
    },
    {
      id: '4',
      name: 'FIRE Enthusiasts',
      members: 723,
      description: 'Financial Independence, Retire Early - strategies and support.',
      category: 'FIRE',
      isJoined: false
    },
    {
      id: '5',
      name: 'Real Estate Investors',
      members: 945,
      description: 'Discuss real estate investment strategies, market trends, and opportunities.',
      category: 'Real Estate',
      isJoined: false
    }
  ]);

  // Sample data for Weekly Quests
  const [quests] = useState<Quest[]>([
    {
      id: '1',
      title: 'Budget Warrior',
      description: 'Create and stick to a budget for 7 consecutive days.',
      xpReward: 100,
      deadline: '2025-07-07',
      progress: 71,
      isCompleted: false
    },
    {
      id: '2',
      title: 'Savings Streak',
      description: 'Save at least $50 this week toward your primary goal.',
      xpReward: 75,
      deadline: '2025-07-07',
      progress: 100,
      isCompleted: true
    },
    {
      id: '3',
      title: 'Knowledge Seeker',
      description: 'Complete 3 learning modules in the Finance Kata section.',
      xpReward: 150,
      deadline: '2025-07-07',
      progress: 33,
      isCompleted: false
    },
    {
      id: '4',
      title: 'Community Contributor',
      description: 'Make 5 helpful comments in Money Circles discussions.',
      xpReward: 50,
      deadline: '2025-07-07',
      progress: 60,
      isCompleted: false
    },
    {
      id: '5',
      title: 'Expense Tracker',
      description: 'Log all your expenses for 5 consecutive days.',
      xpReward: 80,
      deadline: '2025-07-07',
      progress: 100,
      isCompleted: true
    }
  ]);

  // Sample data for Leaderboard
  const [leaderboard] = useState<LeaderboardUser[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      level: 15,
      xp: 1520,
      rank: 1,
      change: 'same'
    },
    {
      id: '2',
      name: 'Michael Chen',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      level: 14,
      xp: 1480,
      rank: 2,
      change: 'up'
    },
    {
      id: '3',
      name: 'Jessica Williams',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      level: 13,
      xp: 1350,
      rank: 3,
      change: 'down'
    },
    {
      id: '4',
      name: 'David Rodriguez',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      level: 12,
      xp: 1210,
      rank: 4,
      change: 'up'
    },
    {
      id: '5',
      name: 'Emily Taylor',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      level: 11,
      xp: 1150,
      rank: 5,
      change: 'same'
    }
  ]);

  // Sample data for Badges
  const [badges] = useState<Badge[]>([
    {
      id: '1',
      name: 'Budget Master',
      description: 'Created and maintained a budget for 30 consecutive days.',
      icon: Target,
      rarity: 'uncommon',
      isEarned: true,
      earnedDate: '2025-06-15'
    },
    {
      id: '2',
      name: 'Savings Champion',
      description: 'Reached 100% of a savings goal.',
      icon: Trophy,
      rarity: 'rare',
      isEarned: true,
      earnedDate: '2025-05-22'
    },
    {
      id: '3',
      name: 'Knowledge Seeker',
      description: 'Completed 10 learning modules.',
      icon: Award,
      rarity: 'uncommon',
      isEarned: false
    },
    {
      id: '4',
      name: 'Debt Destroyer',
      description: 'Paid off a debt completely.',
      icon: CheckCircle,
      rarity: 'epic',
      isEarned: false
    },
    {
      id: '5',
      name: 'Community Pillar',
      description: 'Helped 50 community members with financial advice.',
      icon: Users,
      rarity: 'legendary',
      isEarned: false
    },
    {
      id: '6',
      name: 'Investment Guru',
      description: 'Created a diversified investment portfolio.',
      icon: TrendingUp,
      rarity: 'rare',
      isEarned: true,
      earnedDate: '2025-04-10'
    }
  ]);

  // Sample data for Collaboration Projects
  const [collaborationProjects] = useState<CollaborationProject[]>([
    {
      id: '1',
      title: 'Group Investment Club',
      description: 'Pool resources to invest in dividend stocks and share knowledge.',
      members: 12,
      progress: 65,
      category: 'Investing',
      deadline: '2025-09-30'
    },
    {
      id: '2',
      title: 'Neighborhood Savings Challenge',
      description: 'Compete with neighbors to save the most in 3 months.',
      members: 8,
      progress: 40,
      category: 'Saving',
      deadline: '2025-08-15'
    },
    {
      id: '3',
      title: 'Financial Literacy Workshop',
      description: 'Organize and run a workshop for local high school students.',
      members: 5,
      progress: 25,
      category: 'Education',
      deadline: '2025-10-10'
    },
    {
      id: '4',
      title: 'Real Estate Investment Group',
      description: 'Analyze and potentially invest in local rental properties as a group.',
      members: 15,
      progress: 80,
      category: 'Real Estate',
      deadline: '2025-12-01'
    }
  ]);

  // Sample data for Community Feed
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Sarah Johnson',
      userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      userLevel: 15,
      content: "Just reached my emergency fund goal of $10,000! 🎉 It took me 8 months of consistent saving. Next up: starting to invest for retirement!",
      timestamp: '2025-06-29T14:30:00Z',
      likes: 42,
      comments: 8,
      isLiked: true,
      achievement: {
        type: 'goal',
        title: 'Goal Completed',
        icon: Target
      }
    },
    {
      id: '2',
      userId: '2',
      userName: 'Michael Chen',
      userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      userLevel: 14,
      content: "Question for the community: I'm trying to decide between paying off my student loans faster or investing more in my 401(k). My loans are at 4.5% interest, and I'm currently getting a 5% employer match on my 401(k). What would you do?",
      timestamp: '2025-06-28T10:15:00Z',
      likes: 18,
      comments: 23,
      isLiked: false
    },
    {
      id: '3',
      userId: '3',
      userName: 'Jessica Williams',
      userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      userLevel: 13,
      content: "I just used the 'Debt Avalanche' strategy from the learning modules to create a debt payoff plan. According to my calculations, I'll be debt-free in 18 months instead of 3 years! Thanks DoughJo!",
      timestamp: '2025-06-27T16:45:00Z',
      likes: 35,
      comments: 5,
      isLiked: true,
      media: 'https://images.pexels.com/photos/4386339/pexels-photo-4386339.jpeg?auto=compress&cs=tinysrgb&w=600'
    },
    {
      id: '4',
      userId: '4',
      userName: 'David Rodriguez',
      userAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      userLevel: 12,
      content: "Just earned the 'Investment Guru' badge! 🏆 My portfolio is now properly diversified across stocks, bonds, and REITs. Who else has earned this badge?",
      timestamp: '2025-06-26T09:20:00Z',
      likes: 27,
      comments: 12,
      isLiked: false,
      achievement: {
        type: 'badge',
        title: 'Badge Earned',
        icon: Award
      }
    },
    {
      id: '5',
      userId: '5',
      userName: 'Emily Taylor',
      userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      userLevel: 11,
      content: "Weekly challenge update: I've cut my dining out expenses by 50% this week by meal prepping on Sundays. Already saved $45 that's going straight to my vacation fund!",
      timestamp: '2025-06-25T13:10:00Z',
      likes: 31,
      comments: 7,
      isLiked: true
    }
  ]);

  const handleJoinCircle = (circleId: string) => {
    // In a real app, this would call an API to join the circle
    // For demo purposes, we'll just update the local state
    const updatedCircles = moneyCircles.map(circle => 
      circle.id === circleId ? { ...circle, isJoined: true } : circle
    );
    // setMoneyCircles(updatedCircles);
    
    // Award XP for joining a circle
    onXPUpdate(25);
  };

  const handleCompleteQuest = (questId: string) => {
    // In a real app, this would call an API to mark the quest as complete
    // For demo purposes, we'll just simulate it
    const quest = quests.find(q => q.id === questId);
    if (quest && !quest.isCompleted) {
      // Award XP for completing the quest
      onXPUpdate(quest.xpReward);
    }
  };

  const handleLikePost = (postId: string) => {
    // Update the post's like status
    const updatedPosts = communityPosts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1 
          } 
        : post
    );
    setCommunityPosts(updatedPosts);
    
    // Award XP for engagement
    if (!communityPosts.find(p => p.id === postId)?.isLiked) {
      onXPUpdate(2);
    }
  };

  const handleSubmitPost = () => {
    if (!newPostContent.trim()) return;
    
    // Create a new post
    const newPost: CommunityPost = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      userAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      userLevel: 5, // This would come from the user's actual level
      content: newPostContent,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      isLiked: false
    };
    
    // Add the new post to the beginning of the list
    setCommunityPosts([newPost, ...communityPosts]);
    
    // Clear the input
    setNewPostContent('');
    
    // Award XP for creating a post
    onXPUpdate(10);
  };

  const handleJoinProject = (projectId: string) => {
    // In a real app, this would call an API to join the project
    // For demo purposes, we'll just simulate it
    
    // Award XP for joining a collaboration project
    onXPUpdate(30);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'uncommon': return 'bg-green-100 text-green-800 border-green-200';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'legendary': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
      return `${diffDay}d ago`;
    } else if (diffHour > 0) {
      return `${diffHour}h ago`;
    } else if (diffMin > 0) {
      return `${diffMin}m ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#2A6F68] rounded-xl p-6 text-white relative overflow-hidden">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <Users className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Community Dojo</h1>
            <p className="text-white/90 text-sm">Connect, learn, and grow with fellow financial warriors</p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-1">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center justify-center space-x-1 py-3 px-2 rounded-lg transition-all ${
              activeTab === 'feed'
                ? 'bg-[#2A6F68] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            <span className="font-medium text-sm">Feed</span>
          </button>
          
          <button
            onClick={() => setActiveTab('circles')}
            className={`flex items-center justify-center space-x-1 py-3 px-2 rounded-lg transition-all ${
              activeTab === 'circles'
                ? 'bg-[#2A6F68] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="h-4 w-4" />
            <span className="font-medium text-sm">Money Circles</span>
          </button>
          
          <button
            onClick={() => setActiveTab('quests')}
            className={`flex items-center justify-center space-x-1 py-3 px-2 rounded-lg transition-all ${
              activeTab === 'quests'
                ? 'bg-[#2A6F68] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span className="font-medium text-sm">Weekly Quests</span>
          </button>
          
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center justify-center space-x-1 py-3 px-2 rounded-lg transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-[#2A6F68] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Trophy className="h-4 w-4" />
            <span className="font-medium text-sm">Leaderboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab('badges')}
            className={`flex items-center justify-center space-x-1 py-3 px-2 rounded-lg transition-all ${
              activeTab === 'badges'
                ? 'bg-[#2A6F68] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Award className="h-4 w-4" />
            <span className="font-medium text-sm">Badges</span>
          </button>
          
          <button
            onClick={() => setActiveTab('collaboration')}
            className={`flex items-center justify-center space-x-1 py-3 px-2 rounded-lg transition-all ${
              activeTab === 'collaboration'
                ? 'bg-[#2A6F68] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Target className="h-4 w-4" />
            <span className="font-medium text-sm">Collaboration</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
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
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#2A6F68] to-[#B76E79] rounded-full flex items-center justify-center p-1">
                  <img 
                    src={doughjoMascot} 
                    alt="User Avatar" 
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <div className="flex-1">
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Share your financial journey, ask questions, or celebrate wins..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all text-sm min-h-[80px] resize-none"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-500 hover:text-[#2A6F68] hover:bg-gray-100 rounded-full transition-colors">
                        <Image className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-[#2A6F68] hover:bg-gray-100 rounded-full transition-colors">
                        <Smile className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-[#2A6F68] hover:bg-gray-100 rounded-full transition-colors">
                        <Paperclip className="h-5 w-5" />
                      </button>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSubmitPost}
                      disabled={!newPostContent.trim()}
                      className="flex items-center space-x-2 bg-[#2A6F68] text-white px-4 py-2 rounded-lg hover:bg-[#235A54] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="h-4 w-4" />
                      <span>Post</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>

            {/* Community Feed */}
            <div className="space-y-4">
              {communityPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                >
                  {/* Post Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={post.userAvatar} 
                        alt={post.userName} 
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-[#333333]">{post.userName}</h3>
                          <div className="px-2 py-0.5 bg-[#2A6F68]/10 text-[#2A6F68] rounded-full text-xs font-medium">
                            Level {post.userLevel}
                          </div>
                        </div>
                        <div className="text-xs text-gray-500">{formatTimeAgo(post.timestamp)}</div>
                      </div>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <MoreHorizontal className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Achievement Banner (if applicable) */}
                  {post.achievement && (
                    <div className="mb-3 p-2 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
                      <div className="flex items-center space-x-2">
                        <post.achievement.icon className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-800">{post.achievement.title}</span>
                      </div>
                    </div>
                  )}

                  {/* Post Content */}
                  <p className="text-gray-700 mb-3">{post.content}</p>

                  {/* Post Media (if applicable) */}
                  {post.media && (
                    <div className="mb-3 rounded-lg overflow-hidden">
                      <img 
                        src={post.media} 
                        alt="Post media" 
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => handleLikePost(post.id)}
                        className={`flex items-center space-x-1 px-2 py-1 rounded-lg transition-colors ${
                          post.isLiked 
                            ? 'text-[#B76E79] bg-[#B76E79]/10' 
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1 px-2 py-1 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comments}</span>
                      </button>
                      <button className="flex items-center space-x-1 px-2 py-1 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                    <button className="flex items-center space-x-1 px-2 py-1 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors">
                      <Bookmark className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'circles' && (
          <motion.div
            key="circles"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search money circles..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all"
                />
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter className="h-5 w-5 text-gray-500" />
                  <span>Filters</span>
                  {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 bg-[#2A6F68] text-white px-4 py-2 rounded-lg hover:bg-[#235A54] transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create Circle</span>
                </motion.button>
              </div>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all"
                      >
                        <option value="all">All Categories</option>
                        <option value="Budgeting">Budgeting</option>
                        <option value="Investing">Investing</option>
                        <option value="Debt">Debt</option>
                        <option value="FIRE">FIRE</option>
                        <option value="Real Estate">Real Estate</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all"
                      >
                        <option value="all">All Circles</option>
                        <option value="joined">Joined</option>
                        <option value="not-joined">Not Joined</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all"
                      >
                        <option value="popular">Most Popular</option>
                        <option value="recent">Recently Active</option>
                        <option value="new">Newest</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Money Circles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {moneyCircles
                .filter(circle => selectedCategory === 'all' || circle.category === selectedCategory)
                .filter(circle => !searchTerm || circle.name.toLowerCase().includes(searchTerm.toLowerCase()) || circle.description.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((circle) => (
                  <motion.div
                    key={circle.id}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-[#2A6F68]/10 rounded-lg flex items-center justify-center">
                          <Users className="h-6 w-6 text-[#2A6F68]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#333333]">{circle.name}</h3>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Users className="h-3 w-3" />
                            <span>{circle.members.toLocaleString()} members</span>
                          </div>
                        </div>
                      </div>
                      <div className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {circle.category}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">{circle.description}</p>
                    <div className="flex justify-end">
                      {circle.isJoined ? (
                        <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm">
                          <CheckCircle className="h-4 w-4" />
                          <span>Joined</span>
                        </div>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleJoinCircle(circle.id)}
                          className="flex items-center space-x-1 px-3 py-1 bg-[#2A6F68] text-white rounded-lg hover:bg-[#235A54] transition-colors text-sm"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Join Circle</span>
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'quests' && (
          <motion.div
            key="quests"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Weekly Quests Header */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#B76E79]/10 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-[#B76E79]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#333333]">Weekly Quests</h3>
                    <p className="text-sm text-gray-600">Complete quests to earn XP and rewards</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Resets in</div>
                  <div className="font-semibold text-[#333333]">2 days 14 hours</div>
                </div>
              </div>
            </div>

            {/* Quests List */}
            <div className="space-y-4">
              {quests.map((quest) => (
                <motion.div
                  key={quest.id}
                  whileHover={{ y: -2 }}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        quest.isCompleted ? 'bg-green-100' : 'bg-[#2A6F68]/10'
                      }`}>
                        {quest.isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <Target className="h-6 w-6 text-[#2A6F68]" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#333333]">{quest.title}</h3>
                        <div className="flex items-center space-x-2 text-sm">
                          <div className="flex items-center space-x-1 text-yellow-600">
                            <Zap className="h-3 w-3" />
                            <span>{quest.xpReward} XP</span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <div className="flex items-center space-x-1 text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>Ends {formatDate(quest.deadline)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    {quest.isCompleted ? (
                      <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        Completed
                      </div>
                    ) : (
                      <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        In Progress
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{quest.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-[#2A6F68]">{quest.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${quest.progress}%` }}
                        transition={{ duration: 1 }}
                        className={`h-2 rounded-full ${
                          quest.isCompleted ? 'bg-green-500' : 'bg-[#2A6F68]'
                        }`}
                      />
                    </div>
                  </div>
                  {!quest.isCompleted && quest.progress === 100 && (
                    <div className="mt-4 flex justify-end">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCompleteQuest(quest.id)}
                        className="flex items-center space-x-1 px-3 py-1 bg-[#2A6F68] text-white rounded-lg hover:bg-[#235A54] transition-colors text-sm"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Claim Reward</span>
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              ))}
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
            {/* Leaderboard Header */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#333333]">Financial Warriors Leaderboard</h3>
                    <p className="text-sm text-gray-600">Top performers in your community</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Your Rank</div>
                  <div className="font-semibold text-[#333333]">#42</div>
                </div>
              </div>
            </div>

            {/* Leaderboard Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">XP</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {leaderboard.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                            user.rank === 1 ? 'bg-amber-100 text-amber-800' :
                            user.rank === 2 ? 'bg-gray-100 text-gray-800' :
                            user.rank === 3 ? 'bg-amber-50 text-amber-700' :
                            'bg-gray-50 text-gray-600'
                          }`}>
                            {user.rank}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <img className="h-8 w-8 rounded-full object-cover" src={user.avatar} alt={user.name} />
                          <div className="font-medium text-gray-900">{user.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Level {user.level}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.xp.toLocaleString()} XP</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center space-x-1 ${
                          user.change === 'up' ? 'text-green-600' :
                          user.change === 'down' ? 'text-red-600' :
                          'text-gray-500'
                        }`}>
                          {user.change === 'up' ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : user.change === 'down' ? (
                            <TrendingDown className="h-4 w-4" />
                          ) : (
                            <Minus className="h-4 w-4" />
                          )}
                          <span className="text-sm">{user.change === 'same' ? 'No change' : `${user.change === 'up' ? 'Up' : 'Down'}`}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'badges' && (
          <motion.div
            key="badges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Badges Header */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#B76E79]/10 rounded-lg flex items-center justify-center">
                    <Award className="h-6 w-6 text-[#B76E79]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#333333]">Achievement Badges</h3>
                    <p className="text-sm text-gray-600">Showcase your financial accomplishments</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Your Badges</div>
                  <div className="font-semibold text-[#333333]">{badges.filter(b => b.isEarned).length} / {badges.length}</div>
                </div>
              </div>
            </div>

            {/* Badges Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <motion.div
                  key={badge.id}
                  whileHover={{ y: -5 }}
                  className={`bg-white rounded-xl p-5 shadow-sm border ${
                    badge.isEarned ? 'border-amber-200' : 'border-gray-200'
                  } hover:shadow-md transition-all ${
                    !badge.isEarned && 'opacity-70'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        badge.isEarned ? 'bg-amber-100' : 'bg-gray-100'
                      }`}>
                        <badge.icon className={`h-6 w-6 ${
                          badge.isEarned ? 'text-amber-600' : 'text-gray-400'
                        }`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#333333]">{badge.name}</h3>
                        <div className={`px-2 py-0.5 rounded text-xs font-medium ${getRarityColor(badge.rarity)}`}>
                          {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                        </div>
                      </div>
                    </div>
                    {badge.isEarned && (
                      <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                        <CheckCircle className="h-3 w-3" />
                        <span>Earned</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{badge.description}</p>
                  {badge.isEarned && badge.earnedDate && (
                    <div className="text-xs text-gray-500">
                      Earned on {formatDate(badge.earnedDate)}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'collaboration' && (
          <motion.div
            key="collaboration"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Collaboration Header */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[#2A6F68]/10 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-[#2A6F68]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#333333]">Collaboration Projects</h3>
                    <p className="text-sm text-gray-600">Work together to achieve financial goals</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 bg-[#2A6F68] text-white px-4 py-2 rounded-lg hover:bg-[#235A54] transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  <span>Create Project</span>
                </motion.button>
              </div>
            </div>

            {/* Collaboration Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collaborationProjects.map((project) => (
                <motion.div
                  key={project.id}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-[#333333]">{project.title}</h3>
                        <div className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          {project.category}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Users className="h-3 w-3" />
                        <span>{project.members} members</span>
                        <span className="text-gray-300">•</span>
                        <Calendar className="h-3 w-3" />
                        <span>Due {formatDate(project.deadline)}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-[#2A6F68]">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        transition={{ duration: 1 }}
                        className="h-2 rounded-full bg-[#2A6F68]"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleJoinProject(project.id)}
                      className="flex items-center space-x-1 px-3 py-1 bg-[#2A6F68] text-white rounded-lg hover:bg-[#235A54] transition-colors text-sm"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Join Project</span>
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityPage;