import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Target, 
  Trophy, 
  Award, 
  Share2, 
  Plus, 
  CheckCircle, 
  Clock, 
  Calendar, 
  ArrowRight, 
  UserPlus, 
  X, 
  Mail, 
  Search, 
  Filter, 
  ChevronDown, 
  Star, 
  Zap,
  MessageCircle,
  Bell,
  Settings,
  UserCheck,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { useUserProfile } from '../hooks/useUserProfile';

interface CommunityPageProps {
  user: User;
  onXPUpdate: (points: number) => void;
}

const CommunityPage: React.FC<CommunityPageProps> = ({ user, onXPUpdate }) => {
  const [activeTab, setActiveTab] = useState<'circles' | 'quests' | 'leaderboard' | 'badges' | 'collaboration'>('circles');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateCircleModal, setShowCreateCircleModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { getDisplayName } = useUserProfile(user);
  
  // Sample data for Money Circles
  const [moneyCircles, setMoneyCircles] = useState([
    {
      id: '1',
      name: 'Family Budget Group',
      members: ['Sarah J.', 'Michael T.', 'Jessica R.'],
      memberCount: 3,
      type: 'family',
      lastActive: '2 hours ago',
      goalProgress: 75,
      unreadMessages: 2,
      isAdmin: true
    },
    {
      id: '2',
      name: 'Investment Club',
      members: ['David K.', 'Lisa M.', 'Robert P.', 'Emma S.', 'John D.'],
      memberCount: 5,
      type: 'investment',
      lastActive: '1 day ago',
      goalProgress: 60,
      unreadMessages: 0,
      isAdmin: false
    },
    {
      id: '3',
      name: 'Homebuyers Support',
      members: ['Alex B.', 'Taylor W.'],
      memberCount: 2,
      type: 'savings',
      lastActive: '3 days ago',
      goalProgress: 45,
      unreadMessages: 5,
      isAdmin: true
    }
  ]);

  // Sample data for Weekly Quests
  const [weeklyQuests, setWeeklyQuests] = useState([
    {
      id: '1',
      title: 'Transaction Tracker',
      description: 'Log every transaction for 5 consecutive days',
      progress: 3,
      total: 5,
      xpReward: 50,
      daysLeft: 4,
      completed: false
    },
    {
      id: '2',
      title: 'Budget Master',
      description: 'Stay under budget in 3 spending categories',
      progress: 2,
      total: 3,
      xpReward: 75,
      daysLeft: 2,
      completed: false
    },
    {
      id: '3',
      title: 'Savings Streak',
      description: 'Add to your savings goal 3 times this week',
      progress: 3,
      total: 3,
      xpReward: 100,
      daysLeft: 1,
      completed: true
    },
    {
      id: '4',
      title: 'Financial Learner',
      description: 'Complete 2 learning modules this week',
      progress: 1,
      total: 2,
      xpReward: 60,
      daysLeft: 3,
      completed: false
    }
  ]);

  // Sample data for Leaderboard
  const [leaderboardUsers, setLeaderboardUsers] = useState([
    {
      id: '1',
      name: 'Jessica R.',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      xp: 1250,
      rank: 1,
      badges: 8,
      savingsRate: 32,
      streak: 45
    },
    {
      id: '2',
      name: 'Michael T.',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      xp: 1120,
      rank: 2,
      badges: 7,
      savingsRate: 28,
      streak: 30
    },
    {
      id: '3',
      name: 'Emma S.',
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150',
      xp: 980,
      rank: 3,
      badges: 6,
      savingsRate: 25,
      streak: 21
    },
    {
      id: '4',
      name: 'David K.',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150',
      xp: 875,
      rank: 4,
      badges: 5,
      savingsRate: 22,
      streak: 14
    },
    {
      id: '5',
      name: getDisplayName(),
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=150',
      xp: 820,
      rank: 5,
      badges: 4,
      savingsRate: 20,
      streak: 10
    }
  ]);

  // Sample data for Badges
  const [badges, setBadges] = useState([
    {
      id: '1',
      name: 'Savings Champion',
      description: 'Reached 20% savings rate for 3 consecutive months',
      icon: <PiggyBankIcon />,
      earned: true,
      date: '2025-05-15',
      rarity: 'rare',
      xpAwarded: 200
    },
    {
      id: '2',
      name: 'Budget Master',
      description: 'Stayed under budget in all categories for a full month',
      icon: <CalculatorIcon />,
      earned: true,
      date: '2025-04-30',
      rarity: 'uncommon',
      xpAwarded: 150
    },
    {
      id: '3',
      name: 'Debt Destroyer',
      description: 'Paid off a debt account completely',
      icon: <TrophyIcon />,
      earned: true,
      date: '2025-03-22',
      rarity: 'rare',
      xpAwarded: 250
    },
    {
      id: '4',
      name: 'Investment Guru',
      description: 'Started your first investment account',
      icon: <ChartIcon />,
      earned: true,
      date: '2025-02-10',
      rarity: 'common',
      xpAwarded: 100
    },
    {
      id: '5',
      name: 'Goal Crusher',
      description: 'Achieved a financial goal ahead of schedule',
      icon: <TargetIcon />,
      earned: false,
      rarity: 'epic',
      xpAwarded: 300
    },
    {
      id: '6',
      name: 'Knowledge Seeker',
      description: 'Completed 10 learning modules',
      icon: <BookIcon />,
      earned: false,
      rarity: 'uncommon',
      xpAwarded: 150
    },
    {
      id: '7',
      name: 'Community Leader',
      description: 'Created a Money Circle with 5+ active members',
      icon: <UsersIcon />,
      earned: false,
      rarity: 'legendary',
      xpAwarded: 500
    },
    {
      id: '8',
      name: 'Streak Master',
      description: 'Logged in for 30 consecutive days',
      icon: <FlameIcon />,
      earned: false,
      rarity: 'rare',
      xpAwarded: 200
    }
  ]);

  // Sample data for Collaboration
  const [collaborators, setCollaborators] = useState([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
      accessLevel: 'full',
      dateAdded: '2025-05-01',
      lastActive: '2 hours ago'
    },
    {
      id: '2',
      name: 'Michael Thompson',
      email: 'michael.t@example.com',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150',
      accessLevel: 'limited',
      dateAdded: '2025-04-15',
      lastActive: '1 day ago'
    }
  ]);

  const [newCircleData, setNewCircleData] = useState({
    name: '',
    type: 'savings',
    description: '',
    isPrivate: false
  });

  const handleCreateCircle = () => {
    if (!newCircleData.name) return;
    
    const newCircle = {
      id: (moneyCircles.length + 1).toString(),
      name: newCircleData.name,
      members: [getDisplayName()],
      memberCount: 1,
      type: newCircleData.type,
      lastActive: 'Just now',
      goalProgress: 0,
      unreadMessages: 0,
      isAdmin: true
    };
    
    setMoneyCircles([newCircle, ...moneyCircles]);
    setNewCircleData({
      name: '',
      type: 'savings',
      description: '',
      isPrivate: false
    });
    setShowCreateCircleModal(false);
    
    // Award XP for creating a circle
    onXPUpdate(25);
  };

  const handleInviteSubmit = () => {
    if (!inviteEmail) return;
    
    // In a real app, this would send an invitation
    console.log(`Invitation sent to: ${inviteEmail}`);
    setInviteEmail('');
    setShowInviteModal(false);
    
    // Award XP for inviting someone
    onXPUpdate(10);
  };

  const handleQuestProgress = (questId: string) => {
    setWeeklyQuests(quests => 
      quests.map(quest => {
        if (quest.id === questId && !quest.completed) {
          const newProgress = quest.progress + 1;
          const completed = newProgress >= quest.total;
          
          // Award XP if quest is completed
          if (completed && !quest.completed) {
            onXPUpdate(quest.xpReward);
          }
          
          return {
            ...quest,
            progress: newProgress,
            completed: completed
          };
        }
        return quest;
      })
    );
  };

  const filteredBadges = badges.filter(badge => {
    if (filterType === 'earned') return badge.earned;
    if (filterType === 'unearned') return !badge.earned;
    return true;
  }).filter(badge => 
    badge.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    badge.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCircles = moneyCircles.filter(circle => 
    circle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    circle.type.toLowerCase().includes(searchTerm.toLowerCase())
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
            <p className="text-white/90 text-sm">Connect, compete, and collaborate with fellow financial warriors</p>
          </div>
        </div>
        
        <div className="bg-white/20 rounded-lg px-3 py-1 text-sm">
          <span className="text-white font-medium">{moneyCircles.length} Circles</span>
          <span className="mx-2 text-white/60">•</span>
          <span className="text-white/90">{weeklyQuests.filter(q => q.completed).length}/{weeklyQuests.length} Quests</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-200">
        <div className="grid grid-cols-5 gap-1">
          <button
            onClick={() => setActiveTab('circles')}
            className={`flex flex-col items-center justify-center py-3 px-4 rounded-lg transition-all ${
              activeTab === 'circles'
                ? 'bg-[#2A6F68] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Money Circles</span>
          </button>
          
          <button
            onClick={() => setActiveTab('quests')}
            className={`flex flex-col items-center justify-center py-3 px-4 rounded-lg transition-all ${
              activeTab === 'quests'
                ? 'bg-[#2A6F68] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Target className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Weekly Quests</span>
          </button>
          
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex flex-col items-center justify-center py-3 px-4 rounded-lg transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-[#2A6F68] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Trophy className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Leaderboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab('badges')}
            className={`flex flex-col items-center justify-center py-3 px-4 rounded-lg transition-all ${
              activeTab === 'badges'
                ? 'bg-[#2A6F68] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Award className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Badges</span>
          </button>
          
          <button
            onClick={() => setActiveTab('collaboration')}
            className={`flex flex-col items-center justify-center py-3 px-4 rounded-lg transition-all ${
              activeTab === 'collaboration'
                ? 'bg-[#2A6F68] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Share2 className="h-5 w-5 mb-1" />
            <span className="text-xs font-medium">Collaboration</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {/* Money Circles */}
        {activeTab === 'circles' && (
          <motion.div
            key="circles"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#333333]">Your Money Circles</h2>
              <div className="flex space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search circles..."
                    className="pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all w-48 md:w-64"
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateCircleModal(true)}
                  className="flex items-center space-x-2 bg-[#2A6F68] text-white px-3 py-2 rounded-lg hover:bg-[#235A54] transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Circle</span>
                </motion.button>
              </div>
            </div>

            {filteredCircles.length === 0 ? (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-[#333333] mb-2">No Money Circles Found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm ? 'No circles match your search. Try different keywords.' : 'Create your first Money Circle to start collaborating with friends and family on financial goals.'}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowCreateCircleModal(true)}
                  className="inline-flex items-center space-x-2 bg-[#2A6F68] text-white px-4 py-2 rounded-lg hover:bg-[#235A54] transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create Your First Circle</span>
                </motion.button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCircles.map((circle) => (
                  <motion.div
                    key={circle.id}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-[#2A6F68]/10 rounded-lg flex items-center justify-center">
                          <Users className="h-5 w-5 text-[#2A6F68]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[#333333]">{circle.name}</h3>
                          <p className="text-xs text-gray-500">{circle.memberCount} members • {circle.type}</p>
                        </div>
                      </div>
                      {circle.unreadMessages > 0 && (
                        <div className="bg-[#B76E79] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                          {circle.unreadMessages}
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Goal Progress</span>
                        <span>{circle.goalProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-[#2A6F68] h-2 rounded-full" 
                          style={{ width: `${circle.goalProgress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex -space-x-2 mb-3">
                      {circle.members.slice(0, 3).map((member, index) => (
                        <div 
                          key={index} 
                          className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-800"
                        >
                          {member.charAt(0)}
                        </div>
                      ))}
                      {circle.members.length > 3 && (
                        <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs font-medium text-gray-800">
                          +{circle.members.length - 3}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Active {circle.lastActive}</span>
                      <div className="flex space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowInviteModal(true)}
                          className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          <UserPlus className="h-4 w-4 text-gray-600" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="p-2 bg-[#2A6F68] rounded-lg hover:bg-[#235A54] transition-colors"
                        >
                          <MessageCircle className="h-4 w-4 text-white" />
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="bg-[#2A6F68]/5 rounded-xl p-5 border border-[#2A6F68]/20">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-[#2A6F68]/20 rounded-lg flex items-center justify-center mt-1">
                  <Users className="h-5 w-5 text-[#2A6F68]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#2A6F68] mb-2">Why Join Money Circles?</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-[#2A6F68] mt-0.5 flex-shrink-0" />
                      <span>Stay accountable with friends and family</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-[#2A6F68] mt-0.5 flex-shrink-0" />
                      <span>Share progress on common financial goals</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-[#2A6F68] mt-0.5 flex-shrink-0" />
                      <span>Celebrate wins together and stay motivated</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-[#2A6F68] mt-0.5 flex-shrink-0" />
                      <span>Learn from others' financial strategies</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Weekly Quests */}
        {activeTab === 'quests' && (
          <motion.div
            key="quests"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#333333]">Weekly Quests</h2>
              <div className="bg-[#2A6F68]/10 text-[#2A6F68] px-3 py-1 rounded-lg text-sm font-medium flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Resets in 2 days</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {weeklyQuests.map((quest) => (
                <motion.div
                  key={quest.id}
                  whileHover={{ y: -5 }}
                  className={`bg-white rounded-xl p-5 shadow-sm border transition-all ${
                    quest.completed 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        quest.completed 
                          ? 'bg-green-100' 
                          : 'bg-[#2A6F68]/10'
                      }`}>
                        {quest.completed ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <Target className="h-5 w-5 text-[#2A6F68]" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#333333]">{quest.title}</h3>
                        <p className="text-xs text-gray-500">
                          {quest.completed 
                            ? 'Completed' 
                            : `${quest.daysLeft} day${quest.daysLeft !== 1 ? 's' : ''} left`
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                      <Zap className="h-3 w-3" />
                      <span>+{quest.xpReward} XP</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{quest.description}</p>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{quest.progress}/{quest.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          quest.completed 
                            ? 'bg-green-500' 
                            : 'bg-[#2A6F68]'
                        }`}
                        style={{ width: `${(quest.progress / quest.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {quest.completed ? (
                    <div className="flex items-center justify-center space-x-2 bg-green-100 text-green-700 p-2 rounded-lg">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">Quest Completed!</span>
                    </div>
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleQuestProgress(quest.id)}
                      className="w-full bg-[#2A6F68] text-white py-2 rounded-lg hover:bg-[#235A54] transition-colors text-sm font-medium"
                    >
                      Log Progress
                    </motion.button>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="bg-[#B76E79]/5 rounded-xl p-5 border border-[#B76E79]/20">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-[#B76E79]/20 rounded-lg flex items-center justify-center mt-1">
                  <Target className="h-5 w-5 text-[#B76E79]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#B76E79] mb-2">Quest Benefits</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-[#B76E79] mt-0.5 flex-shrink-0" />
                      <span>Build consistent financial habits through weekly challenges</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-[#B76E79] mt-0.5 flex-shrink-0" />
                      <span>Earn XP and badges to showcase your financial discipline</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-[#B76E79] mt-0.5 flex-shrink-0" />
                      <span>Track your progress with visual indicators</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-[#B76E79] mt-0.5 flex-shrink-0" />
                      <span>Compete with friends to stay motivated</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard */}
        {activeTab === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#333333]">Financial Warriors Leaderboard</h2>
              <div className="flex items-center space-x-2 bg-[#2A6F68]/10 text-[#2A6F68] px-3 py-1 rounded-lg text-sm">
                <Trophy className="h-4 w-4" />
                <span>Weekly Ranking</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200 text-sm font-medium text-gray-500">
                <div className="col-span-1 text-center">Rank</div>
                <div className="col-span-5">User</div>
                <div className="col-span-2 text-center">XP</div>
                <div className="col-span-2 text-center">Savings Rate</div>
                <div className="col-span-2 text-center">Streak</div>
              </div>
              
              {leaderboardUsers.map((user, index) => (
                <div 
                  key={user.id}
                  className={`grid grid-cols-12 p-4 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } ${
                    user.name === getDisplayName() ? 'bg-[#2A6F68]/5 border-l-4 border-[#2A6F68]' : ''
                  }`}
                >
                  <div className="col-span-1 flex justify-center items-center">
                    {user.rank === 1 ? (
                      <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-yellow-600" />
                      </div>
                    ) : user.rank === 2 ? (
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-gray-500" />
                      </div>
                    ) : user.rank === 3 ? (
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                        <Trophy className="h-4 w-4 text-amber-600" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 font-medium">
                        {user.rank}
                      </div>
                    )}
                  </div>
                  
                  <div className="col-span-5 flex items-center space-x-3">
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-900 flex items-center">
                        {user.name}
                        {user.name === getDisplayName() && (
                          <span className="ml-2 text-xs bg-[#2A6F68]/10 text-[#2A6F68] px-2 py-0.5 rounded">
                            You
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center space-x-1">
                        <Award className="h-3 w-3" />
                        <span>{user.badges} badges</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-2 flex justify-center items-center">
                    <div className="flex items-center space-x-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
                      <Zap className="h-3 w-3" />
                      <span>{user.xp.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="col-span-2 flex justify-center items-center">
                    <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                      <TrendingUp className="h-3 w-3" />
                      <span>{user.savingsRate}%</span>
                    </div>
                  </div>
                  
                  <div className="col-span-2 flex justify-center items-center">
                    <div className="flex items-center space-x-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium">
                      <Flame className="h-3 w-3" />
                      <span>{user.streak} days</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#333333]">Top Savers</h3>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img 
                        src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150" 
                        alt="Jessica R." 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm">Jessica R.</span>
                    </div>
                    <div className="text-sm font-medium text-green-600">42%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img 
                        src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150" 
                        alt="Michael T." 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm">Michael T.</span>
                    </div>
                    <div className="text-sm font-medium text-green-600">38%</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img 
                        src="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150" 
                        alt="David K." 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm">David K.</span>
                    </div>
                    <div className="text-sm font-medium text-green-600">35%</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#333333]">Longest Streaks</h3>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img 
                        src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150" 
                        alt="Jessica R." 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm">Jessica R.</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm font-medium text-orange-600">
                      <Flame className="h-3 w-3" />
                      <span>45 days</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img 
                        src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150" 
                        alt="Michael T." 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm">Michael T.</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm font-medium text-orange-600">
                      <Flame className="h-3 w-3" />
                      <span>30 days</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img 
                        src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150" 
                        alt="Emma S." 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm">Emma S.</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm font-medium text-orange-600">
                      <Flame className="h-3 w-3" />
                      <span>21 days</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#333333]">Most Badges</h3>
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img 
                        src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150" 
                        alt="Jessica R." 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm">Jessica R.</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm font-medium text-purple-600">
                      <Award className="h-3 w-3" />
                      <span>8 badges</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img 
                        src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150" 
                        alt="Michael T." 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm">Michael T.</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm font-medium text-purple-600">
                      <Award className="h-3 w-3" />
                      <span>7 badges</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <img 
                        src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150" 
                        alt="Emma S." 
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm">Emma S.</span>
                    </div>
                    <div className="flex items-center space-x-1 text-sm font-medium text-purple-600">
                      <Award className="h-3 w-3" />
                      <span>6 badges</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Badges */}
        {activeTab === 'badges' && (
          <motion.div
            key="badges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#333333]">Achievement Badges</h2>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search badges..."
                    className="pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all w-48 md:w-64"
                  />
                </div>
                <div className="relative">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all appearance-none"
                  >
                    <option value="all">All Badges</option>
                    <option value="earned">Earned</option>
                    <option value="unearned">Unearned</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredBadges.map((badge) => (
                <motion.div
                  key={badge.id}
                  whileHover={{ y: -5 }}
                  className={`bg-white rounded-xl p-5 shadow-sm border transition-all ${
                    badge.earned 
                      ? 'border-[#2A6F68] bg-[#2A6F68]/5' 
                      : 'border-gray-200 opacity-70'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      badge.earned 
                        ? badge.rarity === 'legendary' ? 'bg-gradient-to-br from-purple-400 to-pink-500' :
                          badge.rarity === 'epic' ? 'bg-gradient-to-br from-indigo-400 to-purple-500' :
                          badge.rarity === 'rare' ? 'bg-gradient-to-br from-blue-400 to-indigo-500' :
                          badge.rarity === 'uncommon' ? 'bg-gradient-to-br from-green-400 to-blue-500' :
                          'bg-gradient-to-br from-gray-400 to-gray-600'
                        : 'bg-gray-200'
                    }`}>
                      <div className="text-white">
                        {badge.icon}
                      </div>
                    </div>
                    {badge.earned && (
                      <div className="flex items-center space-x-1 bg-[#2A6F68] text-white px-2 py-0.5 rounded text-xs">
                        <CheckCircle className="h-3 w-3" />
                        <span>Earned</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-semibold text-[#333333] mb-1">{badge.name}</h3>
                  <p className="text-xs text-gray-600 mb-3">{badge.description}</p>
                  
                  <div className="flex justify-between items-center">
                    <div className={`text-xs px-2 py-0.5 rounded ${
                      badge.rarity === 'legendary' ? 'bg-purple-100 text-purple-800' :
                      badge.rarity === 'epic' ? 'bg-indigo-100 text-indigo-800' :
                      badge.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                      badge.rarity === 'uncommon' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-yellow-600">
                      <Zap className="h-3 w-3" />
                      <span>+{badge.xpAwarded} XP</span>
                    </div>
                  </div>
                  
                  {badge.earned && badge.date && (
                    <div className="mt-3 pt-3 border-t border-[#2A6F68]/20 text-xs text-gray-500 flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>Earned on {new Date(badge.date).toLocaleDateString()}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-[#2A6F68]/10 to-[#B76E79]/10 rounded-xl p-5 border border-[#2A6F68]/20">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#2A6F68] to-[#B76E79] rounded-lg flex items-center justify-center mt-1">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#333333] mb-2">Badge Rarity Guide</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Legendary: Exceptional achievements</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Epic: Difficult milestones</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Rare: Significant accomplishments</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">Uncommon: Notable progress</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full"></div>
                        <span className="text-sm text-gray-700">Common: Everyday achievements</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Collaboration */}
        {activeTab === 'collaboration' && (
          <motion.div
            key="collaboration"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#333333]">Multi-User Collaboration</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowInviteModal(true)}
                className="flex items-center space-x-2 bg-[#2A6F68] text-white px-3 py-2 rounded-lg hover:bg-[#235A54] transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                <span>Invite Collaborator</span>
              </motion.button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200 text-sm font-medium text-gray-500">
                <div className="col-span-5">Collaborator</div>
                <div className="col-span-3">Access Level</div>
                <div className="col-span-2 text-center">Added</div>
                <div className="col-span-2 text-center">Actions</div>
              </div>
              
              {collaborators.map((collaborator, index) => (
                <div 
                  key={collaborator.id}
                  className={`grid grid-cols-12 p-4 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <div className="col-span-5 flex items-center space-x-3">
                    <img 
                      src={collaborator.avatar} 
                      alt={collaborator.name} 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{collaborator.name}</div>
                      <div className="text-xs text-gray-500">{collaborator.email}</div>
                    </div>
                  </div>
                  
                  <div className="col-span-3 flex items-center">
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                      collaborator.accessLevel === 'full' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {collaborator.accessLevel === 'full' ? (
                        <ShieldCheck className="h-3 w-3" />
                      ) : (
                        <Lock className="h-3 w-3" />
                      )}
                      <span>
                        {collaborator.accessLevel === 'full' ? 'Full Access' : 'Limited Access'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="col-span-2 flex justify-center items-center text-sm text-gray-500">
                    {new Date(collaborator.dateAdded).toLocaleDateString()}
                  </div>
                  
                  <div className="col-span-2 flex justify-center items-center space-x-2">
                    <button className="p-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors">
                      <Settings className="h-4 w-4 text-gray-600" />
                    </button>
                    <button className="p-1 bg-red-100 rounded hover:bg-red-200 transition-colors">
                      <X className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-[#2A6F68]/10 rounded-lg flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-[#2A6F68]" />
                  </div>
                  <h3 className="font-semibold text-[#333333]">Access Levels</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center space-x-2 mb-1">
                      <ShieldCheck className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-800">Full Access</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Can view all financial data, edit goals, and manage transactions. Ideal for spouses or financial advisors.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center space-x-2 mb-1">
                      <Lock className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">Limited Access</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      Can view specific goals and limited financial data. Cannot edit or make changes. Good for accountability partners.
                    </p>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="flex items-center space-x-2 mb-1">
                      <Users className="h-4 w-4 text-purple-600" />
                      <span className="font-medium text-purple-800">View Only</span>
                    </div>
                    <p className="text-sm text-purple-700">
                      Can only view progress summaries and achievements. No access to sensitive financial details.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-[#B76E79]/10 rounded-lg flex items-center justify-center">
                    <Bell className="h-5 w-5 text-[#B76E79]" />
                  </div>
                  <h3 className="font-semibold text-[#333333]">Collaboration Settings</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-800">Notification Preferences</div>
                      <p className="text-xs text-gray-500">
                        Control when you receive alerts about collaborator activity
                      </p>
                    </div>
                    <button className="text-[#2A6F68] text-sm font-medium">
                      Configure
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-800">Privacy Controls</div>
                      <p className="text-xs text-gray-500">
                        Manage what information is shared with collaborators
                      </p>
                    </div>
                    <button className="text-[#2A6F68] text-sm font-medium">
                      Configure
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-800">Activity Log</div>
                      <p className="text-xs text-gray-500">
                        View a history of all collaborator actions
                      </p>
                    </div>
                    <button className="text-[#2A6F68] text-sm font-medium">
                      View Log
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invite Modal */}
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
              <div className="bg-gradient-to-r from-[#2A6F68] to-[#B76E79] p-4 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Invite to Collaborate</h2>
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Access Level
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="full-access" 
                        name="access-level" 
                        className="h-4 w-4 text-[#2A6F68] focus:ring-[#2A6F68]" 
                        defaultChecked 
                      />
                      <label htmlFor="full-access" className="text-sm text-gray-700">Full Access</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="limited-access" 
                        name="access-level" 
                        className="h-4 w-4 text-[#2A6F68] focus:ring-[#2A6F68]" 
                      />
                      <label htmlFor="limited-access" className="text-sm text-gray-700">Limited Access</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="view-only" 
                        name="access-level" 
                        className="h-4 w-4 text-[#2A6F68] focus:ring-[#2A6F68]" 
                      />
                      <label htmlFor="view-only" className="text-sm text-gray-700">View Only</label>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    placeholder="Add a personal message to your invitation..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all"
                  ></textarea>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleInviteSubmit}
                    disabled={!inviteEmail}
                    className="flex-1 bg-[#2A6F68] text-white px-4 py-3 rounded-lg hover:bg-[#235A54] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Send Invitation
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              <div className="bg-gradient-to-r from-[#2A6F68] to-[#B76E79] p-4 text-white">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Create Money Circle</h2>
                  <button
                    onClick={() => setShowCreateCircleModal(false)}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Circle Name *
                  </label>
                  <input
                    type="text"
                    value={newCircleData.name}
                    onChange={(e) => setNewCircleData({...newCircleData, name: e.target.value})}
                    placeholder="e.g., Family Budget Group"
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Circle Type
                  </label>
                  <select
                    value={newCircleData.type}
                    onChange={(e) => setNewCircleData({...newCircleData, type: e.target.value})}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all"
                  >
                    <option value="savings">Savings Group</option>
                    <option value="investment">Investment Club</option>
                    <option value="debt">Debt Payoff</option>
                    <option value="family">Family Finance</option>
                    <option value="friends">Friends Group</option>
                  </select>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newCircleData.description}
                    onChange={(e) => setNewCircleData({...newCircleData, description: e.target.value})}
                    placeholder="What's the purpose of this circle?"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2A6F68] focus:border-transparent transition-all"
                  ></textarea>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="private-circle" 
                      checked={newCircleData.isPrivate}
                      onChange={(e) => setNewCircleData({...newCircleData, isPrivate: e.target.checked})}
                      className="h-4 w-4 text-[#2A6F68] focus:ring-[#2A6F68] rounded" 
                    />
                    <label htmlFor="private-circle" className="text-sm text-gray-700">Make this circle private (invitation only)</label>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowCreateCircleModal(false)}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreateCircle}
                    disabled={!newCircleData.name}
                    className="flex-1 bg-[#2A6F68] text-white px-4 py-3 rounded-lg hover:bg-[#235A54] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Create Circle
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Custom badge icons
const PiggyBankIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z"></path>
    <path d="M2 9v1c0 1.1.9 2 2 2h1"></path>
    <path d="M16 11a2 2 0 0 0-2-2"></path>
  </svg>
);

const CalculatorIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2"></rect>
    <line x1="8" x2="16" y1="6" y2="6"></line>
    <line x1="16" x2="16" y1="14" y2="18"></line>
    <path d="M16 10h.01"></path>
    <path d="M12 10h.01"></path>
    <path d="M8 10h.01"></path>
    <path d="M12 14h.01"></path>
    <path d="M8 14h.01"></path>
    <path d="M12 18h.01"></path>
    <path d="M8 18h.01"></path>
  </svg>
);

const TrophyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
    <path d="M4 22h16"></path>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
  </svg>
);

const ChartIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v18h18"></path>
    <path d="m19 9-5 5-4-4-3 3"></path>
  </svg>
);

const TargetIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <circle cx="12" cy="12" r="6"></circle>
    <circle cx="12" cy="12" r="2"></circle>
  </svg>
);

const BookIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
  </svg>
);

const UsersIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const FlameIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
  </svg>
);

export default CommunityPage;