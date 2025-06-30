import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Target, 
  Trophy, 
  Award, 
  Share2, 
  Plus, 
  Search, 
  Filter, 
  ChevronDown, 
  X, 
  Check, 
  Clock, 
  Zap, 
  Star, 
  Mail, 
  UserPlus, 
  Settings, 
  Lock, 
  Eye, 
  EyeOff, 
  MessageCircle,
  Heart,
  Repeat,
  MoreHorizontal,
  Image,
  Send,
  Calendar,
  TrendingUp,
  PiggyBank,
  DollarSign,
  Shield,
  Flame,
  BookOpen,
  CheckCircle,
  Edit,
  Info
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { useUserProfile } from '../hooks/useUserProfile';
import { useXP } from '../hooks/useXP';

interface CommunityPageProps {
  user: User;
  onXPUpdate: (points: number) => void;
}

interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: Date;
  achievement?: {
    type: string;
    title: string;
    icon: React.ElementType;
  };
  liked?: boolean;
}

interface MoneyCircle {
  id: string;
  name: string;
  description: string;
  members: number;
  progress: number;
  goalAmount: number;
  currentAmount: number;
  isPrivate: boolean;
  isJoined: boolean;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  daysLeft: number;
  progress: number;
  isCompleted: boolean;
  icon: React.ElementType;
}

interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  savingsRate: number;
  streakDays: number;
  isCurrentUser: boolean;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  isEarned: boolean;
  progress?: number;
  earnedDate?: Date;
}

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  email: string;
  accessLevel: 'full' | 'limited' | 'view';
  status: 'active' | 'pending';
}

const CommunityPage: React.FC<CommunityPageProps> = ({ user, onXPUpdate }) => {
  const [activeTab, setActiveTab] = useState<'circles' | 'quests' | 'leaderboard' | 'badges' | 'collaboration' | 'feed'>('feed');
  const [showCreateCircleModal, setShowCreateCircleModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPost, setNewPost] = useState('');
  const { getDisplayName } = useUserProfile(user);
  const { getCurrentLevel } = useXP(user);
  
  const displayName = getDisplayName();
  const level = getCurrentLevel();

  // Sample data for Money Circles
  const [moneyCircles, setMoneyCircles] = useState<MoneyCircle[]>([
    {
      id: '1',
      name: 'Family Savings Challenge',
      description: 'Our family working together to save for our annual vacation',
      members: 4,
      progress: 65,
      goalAmount: 5000,
      currentAmount: 3250,
      isPrivate: true,
      isJoined: true
    },
    {
      id: '2',
      name: 'Debt Destroyers',
      description: 'Friends supporting each other to eliminate debt',
      members: 6,
      progress: 42,
      goalAmount: 15000,
      currentAmount: 6300,
      isPrivate: false,
      isJoined: true
    },
    {
      id: '3',
      name: 'Investment Club',
      description: 'Learning and growing our investments together',
      members: 12,
      progress: 78,
      goalAmount: 10000,
      currentAmount: 7800,
      isPrivate: false,
      isJoined: false
    }
  ]);

  // Sample data for Weekly Quests
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: '1',
      title: 'Transaction Tracker',
      description: 'Log every transaction for 5 consecutive days',
      xpReward: 50,
      daysLeft: 3,
      progress: 60,
      isCompleted: false,
      icon: Calendar
    },
    {
      id: '2',
      title: 'Budget Master',
      description: 'Stay under budget in all categories for one week',
      xpReward: 75,
      daysLeft: 5,
      progress: 85,
      isCompleted: false,
      icon: DollarSign
    },
    {
      id: '3',
      title: 'Savings Streak',
      description: 'Transfer money to savings 3 days in a row',
      xpReward: 30,
      daysLeft: 2,
      progress: 100,
      isCompleted: true,
      icon: PiggyBank
    },
    {
      id: '4',
      title: 'Investment Insight',
      description: 'Research and add a new investment to your watchlist',
      xpReward: 40,
      daysLeft: 4,
      progress: 25,
      isCompleted: false,
      icon: TrendingUp
    }
  ]);

  // Sample data for Leaderboard
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardUser[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      xp: 1250,
      savingsRate: 32,
      streakDays: 45,
      isCurrentUser: false
    },
    {
      id: '2',
      name: 'Michael Chen',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      xp: 980,
      savingsRate: 28,
      streakDays: 30,
      isCurrentUser: false
    },
    {
      id: '3',
      name: displayName,
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      xp: 875,
      savingsRate: 25,
      streakDays: 21,
      isCurrentUser: true
    },
    {
      id: '4',
      name: 'David Rodriguez',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      xp: 750,
      savingsRate: 22,
      streakDays: 15,
      isCurrentUser: false
    },
    {
      id: '5',
      name: 'Emma Wilson',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      xp: 620,
      savingsRate: 18,
      streakDays: 12,
      isCurrentUser: false
    }
  ]);

  // Sample data for Badges
  const [badges, setBadges] = useState<Badge[]>([
    {
      id: '1',
      name: 'Savings Samurai',
      description: 'Saved 20% of income for 3 consecutive months',
      icon: Award,
      rarity: 'legendary',
      isEarned: true,
      earnedDate: new Date(2025, 5, 15)
    },
    {
      id: '2',
      name: 'Budget Ninja',
      description: 'Stayed under budget in all categories for a month',
      icon: Target,
      rarity: 'epic',
      isEarned: true,
      earnedDate: new Date(2025, 4, 28)
    },
    {
      id: '3',
      name: 'Investment Guru',
      description: 'Maintained a diversified portfolio for 6 months',
      icon: Trophy,
      rarity: 'rare',
      isEarned: false,
      progress: 75
    },
    {
      id: '4',
      name: 'Debt Destroyer',
      description: 'Paid off a major debt ahead of schedule',
      icon: Award,
      rarity: 'epic',
      isEarned: false,
      progress: 50
    },
    {
      id: '5',
      name: 'Emergency Fund Hero',
      description: 'Built a full 6-month emergency fund',
      icon: Shield,
      rarity: 'rare',
      isEarned: true,
      earnedDate: new Date(2025, 3, 10)
    },
    {
      id: '6',
      name: 'Goal Crusher',
      description: 'Achieved 3 financial goals',
      icon: Target,
      rarity: 'uncommon',
      isEarned: true,
      earnedDate: new Date(2025, 2, 5)
    },
    {
      id: '7',
      name: 'Streak Master',
      description: 'Logged in for 30 consecutive days',
      icon: Flame,
      rarity: 'common',
      isEarned: true,
      earnedDate: new Date(2025, 1, 20)
    },
    {
      id: '8',
      name: 'Financial Bookworm',
      description: 'Completed 10 learning modules',
      icon: BookOpen,
      rarity: 'uncommon',
      isEarned: false,
      progress: 60
    }
  ]);

  // Sample data for Collaborators
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    {
      id: '1',
      name: 'Alex Johnson',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      email: 'alex.johnson@example.com',
      accessLevel: 'full',
      status: 'active'
    },
    {
      id: '2',
      name: 'Jamie Smith',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      email: 'jamie.smith@example.com',
      accessLevel: 'limited',
      status: 'active'
    },
    {
      id: '3',
      name: 'Taylor Wilson',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
      email: 'taylor.wilson@example.com',
      accessLevel: 'view',
      status: 'pending'
    }
  ]);

  // Sample data for Community Feed
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Sarah Johnson',
      userAvatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: 'Just hit my emergency fund goal of $10,000! 🎉 Six months of expenses saved and ready for whatever life throws my way. #FinancialFreedom',
      likes: 24,
      comments: 7,
      shares: 3,
      timestamp: new Date(2025, 5, 28, 14, 30),
      achievement: {
        type: 'goal',
        title: 'Emergency Fund Complete',
        icon: Shield
      }
    },
    {
      id: '2',
      userId: '2',
      userName: 'Michael Chen',
      userAvatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: 'Weekly tip: I\'ve been using the "envelope method\" for discretionary spending and it\'s been a game-changer. No more end-of-month surprises!',
      likes: 18,
      comments: 5,
      shares: 8,
      timestamp: new Date(2025, 5, 27, 9, 15)
    },
    {
      id: '3',
      userId: '3',
      userName: displayName,
      userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: 'Just completed my first month of zero-based budgeting and found an extra $200 I didn\'t know I had! What should I do with it - extra debt payment or boost my investments?',
      image: 'https://images.pexels.com/photos/4386158/pexels-photo-4386158.jpeg?auto=compress&cs=tinysrgb&w=500',
      likes: 32,
      comments: 12,
      shares: 2,
      timestamp: new Date(2025, 5, 26, 18, 45),
      liked: true
    },
    {
      id: '4',
      userId: '4',
      userName: 'Emma Wilson',
      userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: 'Celebrating paying off my last credit card today! $12,500 gone in 14 months through the debt snowball method. Next up: student loans! #DebtFreeJourney',
      likes: 45,
      comments: 15,
      shares: 7,
      timestamp: new Date(2025, 5, 25, 12, 10),
      achievement: {
        type: 'milestone',
        title: 'Debt Free',
        icon: Award
      }
    },
    {
      id: '5',
      userId: '5',
      userName: 'David Rodriguez',
      userAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: 'Just earned the "Investment Guru" badge by maintaining a diversified portfolio for 6 months! The automatic rebalancing feature has been super helpful.',
      likes: 29,
      comments: 8,
      shares: 4,
      timestamp: new Date(2025, 5, 24, 16, 20),
      achievement: {
        type: 'badge',
        title: 'Investment Guru',
        icon: Trophy
      }
    }
  ]);

  const handleQuestComplete = (questId: string) => {
    setQuests(prev => prev.map(quest => 
      quest.id === questId ? { ...quest, isCompleted: true, progress: 100 } : quest
    ));
    
    // Award XP
    const quest = quests.find(q => q.id === questId);
    if (quest && !quest.isCompleted) {
      onXPUpdate(quest.xpReward);
    }
  };

  const handleJoinCircle = (circleId: string) => {
    setMoneyCircles(prev => prev.map(circle => 
      circle.id === circleId ? { ...circle, isJoined: true } : circle
    ));
    
    // Award XP for joining a circle
    onXPUpdate(25);
  };

  const handleCreateCircle = (name: string, description: string, isPrivate: boolean, goalAmount: number) => {
    const newCircle: MoneyCircle = {
      id: Date.now().toString(),
      name,
      description,
      members: 1,
      progress: 0,
      goalAmount,
      currentAmount: 0,
      isPrivate,
      isJoined: true
    };
    
    setMoneyCircles(prev => [...prev, newCircle]);
    setShowCreateCircleModal(false);
    
    // Award XP for creating a circle
    onXPUpdate(50);
  };

  const handleInviteCollaborator = (email: string, accessLevel: 'full' | 'limited' | 'view') => {
    const newCollaborator: Collaborator = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
      email,
      accessLevel,
      status: 'pending'
    };
    
    setCollaborators(prev => [...prev, newCollaborator]);
    setShowInviteModal(false);
  };

  const handleRemoveCollaborator = (collaboratorId: string) => {
    setCollaborators(prev => prev.filter(c => c.id !== collaboratorId));
  };

  const handleUpdateCollaboratorAccess = (collaboratorId: string, accessLevel: 'full' | 'limited' | 'view') => {
    setCollaborators(prev => prev.map(c => 
      c.id === collaboratorId ? { ...c, accessLevel } : c
    ));
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    const newCommunityPost: CommunityPost = {
      id: Date.now().toString(),
      userId: user.id,
      userName: displayName,
      userAvatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: newPost,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: new Date(),
      liked: false
    };
    
    setCommunityPosts(prev => [newCommunityPost, ...prev]);
    setNewPost('');
    
    // Award XP for posting
    onXPUpdate(10);
  };

  const handleLikePost = (postId: string) => {
    setCommunityPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = post.liked || false;
        return {
          ...post,
          likes: isLiked ? post.likes - 1 : post.likes + 1,
          liked: !isLiked
        };
      }
      return post;
    }));
  };

  const formatTimeAgo = (date: Date) => {
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

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-amber-600';
      case 'epic': return 'from-purple-400 to-purple-600';
      case 'rare': return 'from-blue-400 to-blue-600';
      case 'uncommon': return 'from-green-400 to-green-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'full': return 'bg-green-100 text-green-800';
      case 'limited': return 'bg-blue-100 text-blue-800';
      case 'view': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccessLevelLabel = (level: string) => {
    switch (level) {
      case 'full': return 'Full Access';
      case 'limited': return 'Limited Access';
      case 'view': return 'View Only';
      default: return 'Unknown';
    }
  };

  const filteredCircles = moneyCircles.filter(circle => 
    circle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    circle.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <p className="text-white/90 text-sm">Train together, grow together, achieve together</p>
          </div>
        </div>
        
        <div className="bg-white/20 rounded-lg px-3 py-1 text-sm">
          <span className="text-white font-medium">Level {level}</span>
          <span className="mx-2 text-white/60">•</span>
          <span className="text-white/90">{leaderboardUsers.find(u => u.isCurrentUser)?.xp || 0} XP</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'feed'
                ? 'border-[#2A6F68] text-[#2A6F68]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>Community Feed</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('circles')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'circles'
                ? 'border-[#2A6F68] text-[#2A6F68]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Money Circles</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('quests')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'quests'
                ? 'border-[#2A6F68] text-[#2A6F68]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Weekly Quests</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'leaderboard'
                ? 'border-[#2A6F68] text-[#2A6F68]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Trophy className="h-5 w-5" />
              <span>Leaderboard</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'badges'
                ? 'border-[#2A6F68] text-[#2A6F68]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Award className="h-5 w-5" />
              <span>Badges</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('collaboration')}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 ${
              activeTab === 'collaboration'
                ? 'border-[#2A6F68] text-[#2A6F68]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Share2 className="h-5 w-5" />
              <span>Collaboration</span>
            </div>
          </button>
        </div>
      </div>

      {/* Community Feed */}
      {activeTab === 'feed' && (
        <div className="space-y-6">
          {/* Create Post */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <form onSubmit={handlePostSubmit}>
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#2A6F68]/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-[#2A6F68]" />
                </div>
                <div className="flex-1">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share your financial wins, tips, or ask for advice..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all text-sm min-h-[100px]"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-2">
                      <button type="button" className="p-2 text-gray-500 hover:text-[#2A6F68] hover:bg-[#2A6F68]/10 rounded-full transition-colors">
                        <Image className="h-5 w-5" />
                      </button>
                      <button type="button" className="p-2 text-gray-500 hover:text-[#2A6F68] hover:bg-[#2A6F68]/10 rounded-full transition-colors">
                        <Award className="h-5 w-5" />
                      </button>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={!newPost.trim()}
                      className="flex items-center space-x-2 bg-[#2A6F68] text-white px-4 py-2 rounded-lg hover:bg-[#235A54] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="h-4 w-4" />
                      <span>Post</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Feed Posts */}
          <div className="space-y-4">
            {communityPosts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <div className="flex items-start space-x-3 mb-3">
                  <img 
                    src={post.userAvatar} 
                    alt={post.userName} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{post.userName}</h3>
                        <p className="text-xs text-gray-500">{formatTimeAgo(post.timestamp)}</p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {post.achievement && (
                  <div className="mb-3 bg-gradient-to-r from-[#2A6F68]/10 to-[#B76E79]/10 rounded-lg p-3 border border-[#2A6F68]/20">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#2A6F68] to-[#B76E79] rounded-full flex items-center justify-center">
                        <post.achievement.icon className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#2A6F68]">Achievement Unlocked</p>
                        <p className="text-sm font-semibold">{post.achievement.title}</p>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-gray-700 mb-3">{post.content}</p>

                {post.image && (
                  <div className="mb-3 rounded-lg overflow-hidden">
                    <img 
                      src={post.image} 
                      alt="Post attachment" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-6">
                    <button 
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center space-x-1 ${post.liked ? 'text-[#B76E79]' : 'text-gray-500'} hover:text-[#B76E79]`}
                    >
                      <Heart className={`h-4 w-4 ${post.liked ? 'fill-[#B76E79]' : ''}`} />
                      <span className="text-xs">{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-[#2A6F68]">
                      <MessageCircle className="h-4 w-4" />
                      <span className="text-xs">{post.comments}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-[#2A6F68]">
                      <Repeat className="h-4 w-4" />
                      <span className="text-xs">{post.shares}</span>
                    </button>
                  </div>
                  <button className="text-gray-500 hover:text-[#2A6F68]">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Money Circles */}
      {activeTab === 'circles' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search circles..."
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all text-sm"
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateCircleModal(true)}
              className="flex items-center space-x-2 bg-[#2A6F68] text-white px-4 py-2 rounded-lg hover:bg-[#235A54] transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Create Circle</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCircles.map((circle) => (
              <motion.div
                key={circle.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{circle.name}</h3>
                      {circle.isPrivate && (
                        <span className="p-1 bg-gray-100 rounded-full">
                          <Lock className="h-3 w-3 text-gray-500" />
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{circle.description}</p>
                  </div>
                  <div className="bg-[#2A6F68]/10 text-[#2A6F68] px-2 py-1 rounded-full text-xs font-medium">
                    {circle.members} members
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      ${circle.currentAmount.toLocaleString()}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-600">of ${circle.goalAmount.toLocaleString()}</span>
                      <span className="text-[#2A6F68] font-medium text-sm">
                        ({circle.progress}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-[#2A6F68]"
                      style={{ width: `${circle.progress}%` }}
                    />
                  </div>
                </div>

                {circle.isJoined ? (
                  <button className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                    <Check className="h-4 w-4" />
                    <span>Joined</span>
                  </button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleJoinCircle(circle.id)}
                    className="w-full flex items-center justify-center space-x-2 bg-[#2A6F68] text-white px-4 py-2 rounded-lg hover:bg-[#235A54] transition-colors"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Join Circle</span>
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Quests */}
      {activeTab === 'quests' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quests.map((quest) => (
              <motion.div
                key={quest.id}
                whileHover={{ y: -5 }}
                className={`bg-white rounded-xl p-6 shadow-sm border ${
                  quest.isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200'
                } hover:shadow-md transition-all`}
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    quest.isCompleted ? 'bg-green-100' : 'bg-[#2A6F68]/10'
                  }`}>
                    <quest.icon className={`h-6 w-6 ${
                      quest.isCompleted ? 'text-green-600' : 'text-[#2A6F68]'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">{quest.title}</h3>
                      <div className="flex items-center space-x-1 text-yellow-500">
                        <Zap className="h-4 w-4" />
                        <span className="text-xs font-medium">+{quest.xpReward} XP</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{quest.description}</p>
                    
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-500">
                            {quest.isCompleted ? 'Completed' : `${quest.daysLeft} days left`}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-[#2A6F68]">
                          {quest.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            quest.isCompleted ? 'bg-green-500' : 'bg-[#2A6F68]'
                          }`}
                          style={{ width: `${quest.progress}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      {quest.isCompleted ? (
                        <div className="flex items-center justify-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                          <CheckCircle className="h-4 w-4" />
                          <span>Completed</span>
                        </div>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleQuestComplete(quest.id)}
                          className="w-full flex items-center justify-center space-x-2 bg-[#2A6F68] text-white px-4 py-2 rounded-lg hover:bg-[#235A54] transition-colors"
                        >
                          <Target className="h-4 w-4" />
                          <span>Complete Quest</span>
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {activeTab === 'leaderboard' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Top Performers</h3>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 bg-[#2A6F68] text-white rounded-lg text-sm">XP</button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">Savings Rate</button>
                <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-sm">Streak</button>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {leaderboardUsers.map((user, index) => (
                <div 
                  key={user.id}
                  className={`p-4 flex items-center space-x-4 ${
                    user.isCurrentUser ? 'bg-[#2A6F68]/5' : ''
                  }`}
                >
                  <div className="w-8 text-center font-bold text-gray-500">
                    {index + 1}
                  </div>
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{user.name}</h4>
                      {user.isCurrentUser && (
                        <span className="px-2 py-0.5 bg-[#2A6F68]/10 text-[#2A6F68] rounded-full text-xs">
                          You
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                      <span>{user.savingsRate}% savings rate</span>
                      <span>{user.streakDays} day streak</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 bg-[#2A6F68]/10 text-[#2A6F68] px-3 py-1 rounded-full">
                    <Trophy className="h-4 w-4" />
                    <span className="font-bold">{user.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Badges */}
      {activeTab === 'badges' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {badges.map((badge) => (
              <motion.div
                key={badge.id}
                whileHover={{ y: -5 }}
                className={`bg-white rounded-xl p-6 shadow-sm border ${
                  badge.isEarned ? 'border-[#2A6F68]' : 'border-gray-200'
                } hover:shadow-md transition-all text-center`}
              >
                <div className="mb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${getRarityColor(badge.rarity)} flex items-center justify-center`}>
                    <badge.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="mt-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      badge.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                      badge.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                      badge.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                      badge.rarity === 'uncommon' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1">{badge.name}</h3>
                <p className="text-xs text-gray-600 mb-3">{badge.description}</p>
                
                {badge.isEarned ? (
                  <div className="flex items-center justify-center space-x-2 text-[#2A6F68] text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>Earned {badge.earnedDate?.toLocaleDateString()}</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-[#2A6F68]"
                        style={{ width: `${badge.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-600">{badge.progress || 0}% complete</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Collaboration */}
      {activeTab === 'collaboration' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Manage Collaborators</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowInviteModal(true)}
              className="flex items-center space-x-2 bg-[#2A6F68] text-white px-4 py-2 rounded-lg hover:bg-[#235A54] transition-colors"
            >
              <UserPlus className="h-4 w-4" />
              <span>Invite Collaborator</span>
            </motion.button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-medium text-gray-900">Active Collaborators</h4>
            </div>
            
            <div className="divide-y divide-gray-100">
              {collaborators.map((collaborator) => (
                <div 
                  key={collaborator.id}
                  className="p-4 flex items-center space-x-4"
                >
                  <img 
                    src={collaborator.avatar} 
                    alt={collaborator.name} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{collaborator.name}</h4>
                      {collaborator.status === 'pending' && (
                        <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{collaborator.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <select
                      value={collaborator.accessLevel}
                      onChange={(e) => handleUpdateCollaboratorAccess(
                        collaborator.id, 
                        e.target.value as 'full' | 'limited' | 'view'
                      )}
                      className={`px-3 py-1 rounded-lg text-xs font-medium ${getAccessLevelColor(collaborator.accessLevel)}`}
                    >
                      <option value="full">Full Access</option>
                      <option value="limited">Limited Access</option>
                      <option value="view">View Only</option>
                    </select>
                    <button
                      onClick={() => handleRemoveCollaborator(collaborator.id)}
                      className="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              
              {collaborators.length === 0 && (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">No Collaborators Yet</h4>
                  <p className="text-gray-600 mb-4">Invite family members or financial advisors to collaborate on your finances</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowInviteModal(true)}
                    className="inline-flex items-center space-x-2 bg-[#2A6F68] text-white px-4 py-2 rounded-lg hover:bg-[#235A54] transition-colors"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Invite Collaborator</span>
                  </motion.button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">Access Levels Explained</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-green-100 text-green-800 rounded-lg">
                  <Settings className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Full Access</h5>
                  <p className="text-sm text-gray-600">Can view, edit, and manage all financial data and settings</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 text-blue-800 rounded-lg">
                  <Edit className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">Limited Access</h5>
                  <p className="text-sm text-gray-600">Can view all data and edit specific areas you grant permission for</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gray-100 text-gray-800 rounded-lg">
                  <Eye className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">View Only</h5>
                  <p className="text-sm text-gray-600">Can only view financial data but cannot make any changes</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Circle Modal */}
      <AnimatePresence>
        {showCreateCircleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCreateCircleModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#333333]">Create Money Circle</h2>
                  <button
                    onClick={() => setShowCreateCircleModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const name = formData.get('name') as string;
                  const description = formData.get('description') as string;
                  const isPrivate = formData.get('privacy') === 'private';
                  const goalAmount = parseFloat(formData.get('goalAmount') as string);
                  
                  if (name && description && goalAmount) {
                    handleCreateCircle(name, description, isPrivate, goalAmount);
                  }
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Circle Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all"
                        placeholder="e.g., Family Savings Challenge"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        required
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all"
                        placeholder="What is this circle for?"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Goal Amount *
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="number"
                          name="goalAmount"
                          required
                          min="1"
                          step="0.01"
                          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all"
                          placeholder="5000"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Privacy Setting
                      </label>
                      <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="privacy"
                            value="public"
                            defaultChecked
                            className="text-[#2A6F68] focus:ring-[#2A6F68]"
                          />
                          <span className="text-sm text-gray-700">Public</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="privacy"
                            value="private"
                            className="text-[#2A6F68] focus:ring-[#2A6F68]"
                          />
                          <span className="text-sm text-gray-700">Private</span>
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowCreateCircleModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex-1 bg-[#2A6F68] text-white px-4 py-2 rounded-lg hover:bg-[#235A54] transition-colors"
                    >
                      Create Circle
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invite Collaborator Modal */}
      <AnimatePresence>
        {showInviteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowInviteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-[#333333]">Invite Collaborator</h2>
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const email = formData.get('email') as string;
                  const accessLevel = formData.get('accessLevel') as 'full' | 'limited' | 'view';
                  
                  if (email && accessLevel) {
                    handleInviteCollaborator(email, accessLevel);
                  }
                }}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="email"
                          name="email"
                          required
                          className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all"
                          placeholder="collaborator@example.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Access Level *
                      </label>
                      <select
                        name="accessLevel"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all"
                      >
                        <option value="full">Full Access</option>
                        <option value="limited">Limited Access</option>
                        <option value="view">View Only</option>
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        Full access allows the collaborator to view and edit all your financial data.
                      </p>
                    </div>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-xs text-blue-700">
                          Collaborators will receive an email invitation to join your financial dashboard. They'll need to create an account if they don't already have one.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowInviteModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      className="flex-1 bg-[#2A6F68] text-white px-4 py-2 rounded-lg hover:bg-[#235A54] transition-colors"
                    >
                      Send Invitation
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommunityPage;