import { useState, useEffect, FormEvent } from 'react';
import { 
  Menu, X, Share2, Orbit, User, GraduationCap, Save, CheckCircle2, 
  ShieldAlert, BadgeInfo, Bell, BookOpen, ShoppingBag, MessageSquare, 
  Users, CheckCheck, Trash2, Sparkles 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile, AppNotification } from '../types';

interface NavbarProps {
  userProfile: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150', // Aisha (Tech)
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=150', // Zoe (Creative Designer)
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150', // Marcus (Polymath)
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', // Innovator
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', // Analyst
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', // QuantumCoder
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'  // Liam (Mentees)
];

export default function Navbar({ 
  userProfile, 
  onUpdateProfile,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onRemove,
  onClearAll
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Notifications states
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<'all' | 'message' | 'marketplace' | 'group' | 'resource'>('all');

  // Profile modal editing states
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [tempProfile, setTempProfile] = useState<UserProfile>(userProfile);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // AI Bio Assistant states
  const [showBioAssistant, setShowBioAssistant] = useState(false);
  const [assistantKeywords, setAssistantKeywords] = useState('');
  const [assistantTone, setAssistantTone] = useState('Creative & Collaborative');
  const [isGeneratingBio, setIsGeneratingBio] = useState(false);
  const [generatedBios, setGeneratedBios] = useState<{ style: string; text: string }[]>([]);
  const [assistantError, setAssistantError] = useState('');
  const [assistantSuccessMessage, setAssistantSuccessMessage] = useState('');

  const generateStudentBios = async () => {
    setIsGeneratingBio(true);
    setAssistantError('');
    setAssistantSuccessMessage('');
    try {
      const response = await fetch('/api/gemini/generate-bio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: tempProfile.name,
          major: tempProfile.major,
          year: tempProfile.year,
          university: tempProfile.university,
          interests: assistantKeywords,
          customTone: assistantTone
        })
      });
      if (!response.ok) {
        throw new Error('Server responded with an error generating your bios.');
      }
      const data = await response.json();
      if (data && data.bios) {
        setGeneratedBios(data.bios);
        setAssistantSuccessMessage('Generated 3 stellar profile drafts!');
      } else {
        throw new Error('Unexpected format returned from the assistant server.');
      }
    } catch (err: any) {
      console.error(err);
      setAssistantError(err.message || 'Unable to connect to the profile AI tailor.');
    } finally {
      setIsGeneratingBio(false);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (n: AppNotification) => {
    onMarkRead(n.id);
    setShowNotifications(false);
    setIsOpen(false);
    
    // Jump to the demo interactive section
    const element = document.getElementById('interactive-demo');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    
    // Auto switch tabs based on notification's nature
    setTimeout(() => {
      let targetTab = 'market';
      if (n.type === 'message') targetTab = 'chats';
      else if (n.type === 'resource') targetTab = 'resources';
      else if (n.type === 'group') targetTab = 'groups';
      else if (n.type === 'marketplace') targetTab = 'market';

      window.dispatchEvent(new CustomEvent('konekt-navigate-tab', { 
        detail: { tab: targetTab, contact: n.linkId } 
      }));
    }, 450);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync state when props shift downstream
  useEffect(() => {
    setTempProfile(userProfile);
  }, [userProfile]);

  const initiateProfileEdit = () => {
    setTempProfile(userProfile);
    setCustomAvatarUrl(PRESET_AVATARS.includes(userProfile.avatar) ? '' : userProfile.avatar);
    setValidationError('');
    setShowProfileModal(true);
  };

  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    if (!tempProfile.name.trim()) {
      setValidationError('Student Nickname cannot be empty.');
      return;
    }
    if (tempProfile.name.length < 3) {
      setValidationError('Nickname must be at least 3 characters.');
      return;
    }
    const finalAvatar = customAvatarUrl.trim() ? customAvatarUrl.trim() : tempProfile.avatar;
    
    setIsSaving(true);
    setTimeout(() => {
      onUpdateProfile({
        ...tempProfile,
        avatar: finalAvatar
      });
      setIsSaving(false);
      setShowProfileModal(false);
    }, 500);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-250/80 shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/25 transition-transform group-hover:rotate-12 duration-300">
              <Orbit className="w-5.5 h-5.5 text-indigo-100" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-slate-900">
              Konekt<span className="text-indigo-600">.</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('features')}
              className={`${scrolled ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-700 hover:text-slate-900'} font-medium text-sm transition-colors cursor-pointer`}
            >
              Core Features
            </button>
            <button
              onClick={() => scrollToSection('marketplace')}
              className={`${scrolled ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-700 hover:text-slate-900'} font-medium text-sm transition-colors cursor-pointer`}
            >
              Marketplace
            </button>
            <button
              onClick={() => scrollToSection('resources')}
              className={`${scrolled ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-700 hover:text-slate-900'} font-medium text-sm transition-colors cursor-pointer`}
            >
              Resources Vault
            </button>
            <button
              onClick={() => scrollToSection('communities')}
              className={`${scrolled ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-700 hover:text-slate-900'} font-medium text-sm transition-colors cursor-pointer`}
            >
              Campus Clubs
            </button>
            <button
              onClick={() => scrollToSection('interactive-demo')}
              className={`${scrolled ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-700 hover:text-slate-900'} font-medium text-sm transition-colors cursor-pointer`}
            >
              Try Live Demo
            </button>
          </div>

          {/* Action & Dashboard Profile Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Centralized Notification Center Widget */}
            <div className="relative">
              <button
                type="button"
                id="notification-bell-btn"
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-2.5 rounded-xl border transition-all relative flex items-center justify-center cursor-pointer ${
                  showNotifications 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm' 
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 shadow-sm'
                }`}
              >
                <Bell className={`w-4.5 h-4.5 ${unreadCount > 0 ? 'animate-bounce' : ''}`} style={{ animationDuration: '3s' }} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-indigo-650 px-1 text-[9px] font-bold text-white ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    {/* Invisible Backdrop to close dropdown */}
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowNotifications(false)} 
                    />
                    
                    {/* Dropdown Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-3 w-[420px] bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 origin-top-right text-slate-705"
                    >
                      {/* Dropdown Header */}
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 select-none">
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                          <span className="text-xs font-bold text-slate-900 uppercase tracking-wide font-display">Notification Vault</span>
                          {unreadCount > 0 && (
                            <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {unreadCount} New
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono select-none">
                          {notifications.length > 0 && (
                            <>
                              <button 
                                type="button"
                                onClick={onMarkAllRead}
                                className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer inline-flex items-center gap-0.5 hover:underline"
                              >
                                <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                              </button>
                              <span className="text-slate-350">|</span>
                              <button 
                                type="button"
                                onClick={onClearAll}
                                className="text-slate-550 hover:text-slate-800 font-semibold cursor-pointer inline-flex items-center gap-0.5 hover:underline"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Clear
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Filter pills */}
                      <div className="px-3.5 py-2.5 bg-white border-b border-slate-100 flex items-center gap-1 overflow-x-auto scrollbar-none">
                        {[
                          { id: 'all', label: 'All' },
                          { id: 'message', label: 'Inbox' },
                          { id: 'marketplace', label: 'Crafts' },
                          { id: 'group', label: 'Circles' },
                          { id: 'resource', label: 'Vault' }
                        ].map(f => {
                          const active = notificationFilter === f.id;
                          const count = f.id === 'all' 
                            ? notifications.length 
                            : notifications.filter(n => n.type === f.id).length;
                          return (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => setNotificationFilter(f.id as any)}
                              className={`px-2.5 py-1 rounded-xl text-[11px] font-medium cursor-pointer transition-all shrink-0 ${
                                active 
                                  ? 'bg-indigo-600 text-white font-semibold shadow-sm' 
                                  : 'bg-slate-100 text-slate-650 hover:bg-slate-200 hover:text-slate-900'
                              }`}
                            >
                              {f.label} ({count})
                            </button>
                          );
                        })}
                      </div>

                      {/* Notifications List */}
                      <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100">
                        {notifications.length === 0 ? (
                          <div className="py-12 px-4 text-center select-none text-slate-400">
                            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-xs font-semibold">No alerts found here.</p>
                            <p className="text-[10px] text-slate-500 mt-1">Alerts for files, crafts, or chats show up right here.</p>
                          </div>
                        ) : notifications.filter(n => notificationFilter === 'all' || n.type === notificationFilter).length === 0 ? (
                          <div className="py-12 px-4 text-center select-none text-slate-400">
                            <p className="text-xs font-medium">No results for this category.</p>
                          </div>
                        ) : (
                          notifications
                            .filter(n => notificationFilter === 'all' || n.type === notificationFilter)
                            .map(n => {
                              // Category specific styling
                              let iconElement = <Bell className="w-4 h-4 text-indigo-550" />;
                              let iconBg = 'bg-indigo-50';
                              if (n.type === 'message') {
                                iconElement = <MessageSquare className="w-4 h-4 text-blue-500" />;
                                iconBg = 'bg-blue-50';
                              } else if (n.type === 'marketplace') {
                                iconElement = <ShoppingBag className="w-4 h-4 text-emerald-500" />;
                                iconBg = 'bg-emerald-50';
                              } else if (n.type === 'group') {
                                iconElement = <Users className="w-4 h-4 text-purple-500" />;
                                iconBg = 'bg-purple-50';
                              } else if (n.type === 'resource') {
                                iconElement = <BookOpen className="w-4 h-4 text-amber-505" />;
                                iconBg = 'bg-amber-50';
                              }

                              return (
                                <div 
                                  key={n.id}
                                  className={`group p-3.5 flex items-start gap-3 hover:bg-indigo-50/20 transition-colors select-none relative cursor-pointer ${
                                    !n.isRead ? 'bg-indigo-50/10' : ''
                                  }`}
                                  onClick={() => handleNotificationClick(n)}
                                >
                                  {/* Left Icon/Avatar */}
                                  <div className="relative shrink-0">
                                    {n.avatar ? (
                                      <img src={n.avatar} className="w-9 h-9 rounded-full object-cover bg-slate-100" alt={n.title} />
                                    ) : (
                                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
                                        {iconElement}
                                      </div>
                                    )}
                                    {!n.isRead && (
                                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-indigo-600 ring-1 ring-white" />
                                    )}
                                  </div>

                                  {/* Body Content */}
                                  <div className="flex-1 min-w-0 pr-4">
                                    <div className="flex items-center justify-between gap-1.5">
                                      <h4 className={`text-xs truncate ${!n.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                                        {n.title}
                                      </h4>
                                      <span className="text-[9px] font-mono text-slate-400 shrink-0">{n.timestamp}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-normal">
                                      {n.body}
                                    </p>
                                    {n.linkId && (
                                      <span className="text-[9px] text-indigo-600 hover:text-indigo-850 font-semibold inline-flex items-center gap-0.5 mt-1">
                                        Go to activity →
                                      </span>
                                    )}
                                  </div>

                                  {/* Clear/X button */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onRemove(n.id);
                                    }}
                                    className="absolute right-2 top-3 p-1 rounded-md text-slate-400 hover:text-slate-650 hover:bg-slate-100 opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                                    title="Dismiss alert"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              );
                            })
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Student Profile Widget */}
            <button
              id="profile-nav-trigger"
              onClick={initiateProfileEdit}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer relative group"
            >
              <img 
                src={userProfile.avatar} 
                className="w-7 h-7 rounded-lg object-cover bg-slate-100 ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/70 transition-all" 
                alt={userProfile.name} 
              />
              <div className="text-left leading-none max-w-[110px] select-none">
                <div className="text-[11px] text-slate-900 font-semibold font-mono truncate">{userProfile.name}</div>
                <div className="text-[9px] text-slate-500 truncate mt-0.5">{userProfile.major} • {userProfile.year}</div>
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            </button>

            <button
              onClick={() => scrollToSection('interactive-demo')}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs px-4.5 py-2 rounded-xl shadow-lg shadow-indigo-600/15 active:scale-95 transition-all cursor-pointer uppercase tracking-wider"
            >
              Sandbox App
            </button>
          </div>

          {/* Mobile menu button and Bell */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Bell Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setIsOpen(false); // Close mobile main menu
                }}
                className={`p-2 rounded-xl border transition-all relative flex items-center justify-center cursor-pointer ${
                  showNotifications 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600' 
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-550 hover:text-slate-900'
                }`}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-indigo-600 px-1 text-[8px] font-bold text-white ring-1 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40 bg-slate-950/60" onClick={() => setShowNotifications(false)} />
                    
                    {/* Mobile menu content card */}
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="fixed left-4 right-4 top-16 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 text-slate-705 max-h-[80vh] flex flex-col"
                    >
                      {/* Dropdown Header */}
                      <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-1.5 select-none text-slate-900 font-display">
                          <Sparkles className="w-4 h-4 text-indigo-600" />
                          <span className="text-xs font-bold uppercase tracking-wide">Notifications</span>
                          {unreadCount > 0 && (
                            <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] select-none font-mono">
                          {notifications.length > 0 && (
                            <>
                              <button 
                                type="button"
                                onClick={onMarkAllRead}
                                className="text-indigo-600 font-semibold cursor-pointer"
                              >
                                Mark all
                              </button>
                              <span className="text-slate-300">|</span>
                              <button 
                                type="button"
                                onClick={onClearAll}
                                className="text-slate-500 font-semibold cursor-pointer"
                              >
                                Clear all
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Filter pills */}
                      <div className="px-3.5 py-2.5 bg-white border-b border-slate-100 flex items-center gap-1 overflow-x-auto scrollbar-none shrink-0">
                        {[
                          { id: 'all', label: 'All' },
                          { id: 'message', label: 'Inbox' },
                          { id: 'marketplace', label: 'Crafts' },
                          { id: 'group', label: 'Circles' },
                          { id: 'resource', label: 'Vault' }
                        ].map(f => {
                          const active = notificationFilter === f.id;
                          return (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => setNotificationFilter(f.id as any)}
                              className={`px-3 py-1 rounded-xl text-[11px] font-medium transition-all cursor-pointer shrink-0 ${
                                active 
                                  ? 'bg-indigo-600 text-white font-semibold' 
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {f.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Notifications Scroll list */}
                      <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
                        {notifications.length === 0 ? (
                          <div className="py-16 px-4 text-center select-none text-slate-400">
                            <Bell className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-xs font-medium">No alerts found.</p>
                          </div>
                        ) : notifications.filter(n => notificationFilter === 'all' || n.type === notificationFilter).length === 0 ? (
                          <div className="py-16 px-4 text-center select-none text-slate-400">
                            <p className="text-xs font-medium">No results for this category.</p>
                          </div>
                        ) : (
                          notifications
                            .filter(n => notificationFilter === 'all' || n.type === notificationFilter)
                            .map(n => {
                              let iconElement = <Bell className="w-4 h-4 text-indigo-550" />;
                              let iconBg = 'bg-indigo-50';
                              if (n.type === 'message') {
                                iconElement = <MessageSquare className="w-4 h-4 text-blue-500" />;
                                iconBg = 'bg-blue-50';
                              } else if (n.type === 'marketplace') {
                                iconElement = <ShoppingBag className="w-4 h-4 text-emerald-500" />;
                                iconBg = 'bg-emerald-50';
                              } else if (n.type === 'group') {
                                iconElement = <Users className="w-4 h-4 text-purple-500" />;
                                iconBg = 'bg-purple-50';
                              } else if (n.type === 'resource') {
                                iconElement = <BookOpen className="w-4 h-4 text-amber-500" />;
                                iconBg = 'bg-amber-50';
                              }

                              return (
                                <div 
                                  key={n.id}
                                  onClick={() => handleNotificationClick(n)}
                                  className={`p-4 flex items-start gap-3 hover:bg-slate-50 relative cursor-pointer ${
                                    !n.isRead ? 'bg-indigo-50/10' : ''
                                  }`}
                                >
                                  <div className="relative shrink-0">
                                    {n.avatar ? (
                                      <img src={n.avatar} className="w-9 h-9 rounded-full object-cover bg-slate-100" alt={n.title} />
                                    ) : (
                                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconBg}`}>
                                        {iconElement}
                                      </div>
                                    )}
                                    {!n.isRead && (
                                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-indigo-600 ring-1 ring-white" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0 pr-4">
                                    <div className="flex items-center justify-between gap-1.5">
                                      <h4 className={`text-xs truncate ${!n.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                                        {n.title}
                                      </h4>
                                      <span className="text-[9px] font-mono text-slate-400">{n.timestamp}</span>
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-1 leading-normal line-clamp-2">
                                      {n.body}
                                    </p>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onRemove(n.id);
                                    }}
                                    className="absolute right-2 top-3 p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              );
                            })
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => {
                setIsOpen(!isOpen);
                setShowNotifications(false);
              }}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 animate-in fade-in slide-in-from-top-4 duration-200 shadow-xl">
          <div className="px-3 pt-2 pb-5 space-y-1.5 sm:px-4">
            
            {/* Mobile Profile Trigger Box */}
            <button
              onClick={() => {
                setIsOpen(false);
                initiateProfileEdit();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-205 hover:bg-slate-100 text-left cursor-pointer transition-colors mb-2"
            >
              <img src={userProfile.avatar} className="w-9 h-9 rounded-lg object-cover ring-2 ring-indigo-500/40" alt={userProfile.name} />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-800 truncate">{userProfile.name}</div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">{userProfile.university} • {userProfile.year}</div>
                <div className="text-[9px] text-indigo-600 font-semibold mt-0.5"> Tap to configure details</div>
              </div>
            </button>

            <button
              onClick={() => scrollToSection('features')}
              className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              Core Features
            </button>
            <button
              onClick={() => scrollToSection('marketplace')}
              className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              Marketplace
            </button>
            <button
              onClick={() => scrollToSection('resources')}
              className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              Resources Vault
            </button>
            <button
              onClick={() => scrollToSection('communities')}
              className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              Campus Clubs
            </button>
            <button
              onClick={() => scrollToSection('interactive-demo')}
              className="block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all"
            >
              Try Live Demo
            </button>
            
            <div className="pt-3 pb-1 border-t border-slate-100 flex flex-col gap-2.5">
              <button
                onClick={() => scrollToSection('interactive-demo')}
                className="w-full text-center py-2.5 rounded-xl bg-indigo-600 font-semibold text-white text-xs shadow-md shadow-indigo-600/10 transition-all uppercase tracking-wider"
              >
                Launch Sandbox App
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile modal wrapper animated with Motion */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop layer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfileModal(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />

            {/* Modal Body card */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col max-h-[90vh]"
            >
              
              {/* Profile Header */}
              <div className="p-5 border-b border-slate-100 bg-slate-50 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 tracking-wide">Edit Student Credentials</h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">Customize your peer representation, status & academic fields.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowProfileModal(false)}
                    className="p-1.5 bg-white hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Form Layout Scroll pane */}
              <form onSubmit={handleSaveProfile} className="flex-1 overflow-y-auto p-5 space-y-4">
                
                {/* Error Banner if any */}
                {validationError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-300 p-3 rounded-xl flex items-start gap-2 text-xs">
                    <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                    <span>{validationError}</span>
                  </div>
                )}

                {/* Avatar Selection Field */}
                <div>
                  <label className="block text-[10px] tracking-wider font-bold uppercase font-mono text-slate-400 mb-2">Select Student Avatar Asset</label>
                  
                  {/* Preset listing slider */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {PRESET_AVATARS.map((avatarImg, imgIdx) => {
                      const isSelected = tempProfile.avatar === avatarImg && !customAvatarUrl;
                      return (
                        <button
                          key={imgIdx}
                          type="button"
                          onClick={() => {
                            setTempProfile(prev => ({ ...prev, avatar: avatarImg }));
                            setCustomAvatarUrl('');
                          }}
                          className={`relative shrink-0 w-11 h-11 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                            isSelected ? 'border-indigo-500 scale-105 ring-2 ring-indigo-500/20' : 'border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <img src={avatarImg} className="w-full h-full object-cover" alt="Student Profile Selection" />
                          {isSelected && (
                            <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom avatar input selector */}
                  <div className="mt-2 relative">
                    <input
                      type="url"
                      placeholder="Or enter a custom Image URL link..."
                      value={customAvatarUrl}
                      onChange={(e) => {
                        setCustomAvatarUrl(e.target.value);
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors pl-8"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-[9px]">URL</span>
                  </div>
                </div>

                {/* Handle and university academic info */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] tracking-wider font-bold uppercase font-mono text-slate-500 mb-1.5">Student Handle</label>
                    <input
                      type="text"
                      placeholder="e.g. CampusSpecialist"
                      value={tempProfile.name}
                      onChange={e => setTempProfile({ ...tempProfile, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-wider font-bold uppercase font-mono text-slate-500 mb-1.5">Academic Year</label>
                    <select
                      value={tempProfile.year}
                      onChange={e => setTempProfile({ ...tempProfile, year: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-705 focus:outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option value="Freshman">Freshman</option>
                      <option value="Sophomore">Sophomore</option>
                      <option value="Junior">Junior</option>
                      <option value="Senior">Senior</option>
                      <option value="Graduate">Graduate</option>
                      <option value="Alumni">Alumni</option>
                    </select>
                  </div>
                </div>

                {/* Major and University inputs */}
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] tracking-wider font-bold uppercase font-mono text-slate-500 mb-1.5">Focus Major / Program</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Computer Science"
                        value={tempProfile.major}
                        onChange={e => setTempProfile({ ...tempProfile, major: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 pl-8 transition-colors"
                        required
                      />
                      <GraduationCap className="w-3.5 h-3.5 text-slate-450 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-wider font-bold uppercase font-mono text-slate-500 mb-1.5">University / Campus</label>
                    <input
                      type="text"
                      placeholder="e.g. Harvard University"
                      value={tempProfile.university}
                      onChange={e => setTempProfile({ ...tempProfile, university: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Academic Bio pane */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-[10px] tracking-wider font-bold uppercase font-mono text-slate-500">Student Status Bio</label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowBioAssistant(!showBioAssistant);
                        setAssistantError('');
                        setAssistantSuccessMessage('');
                      }}
                      className={`inline-flex items-center gap-1.5 text-[10px] font-bold font-mono uppercase cursor-pointer px-2 py-0.5 rounded-full border transition-all ${
                        showBioAssistant 
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 font-extrabold shadow-sm' 
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-indigo-600 hover:text-indigo-850'
                      }`}
                    >
                      <Sparkles className="w-3 h-3 text-indigo-550" /> AI Bio Assistant
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Describe your research, coding stacks, campus service offers, or general student experience..."
                    value={tempProfile.bio}
                    onChange={e => setTempProfile({ ...tempProfile, bio: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed"
                  />
                </div>

                {/* Expanded AI Bio Assistant panel */}
                <AnimatePresence>
                  {showBioAssistant && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-slate-50 border border-indigo-100 rounded-xl p-3.5 space-y-3.5 mt-2 text-slate-705 shadow-inner">
                        <div className="flex items-center justify-between border-b border-indigo-100/40 pb-2 select-none">
                          <div className="flex items-center gap-1.5 text-slate-900">
                            <Sparkles className="w-4 h-4 text-indigo-600" />
                            <span className="text-xs font-bold font-display tracking-tight text-indigo-950">Bio Assistant & Copywriter</span>
                          </div>
                          <span className="text-[9px] font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-md uppercase font-mono">
                            Power: Gemini 3.5
                          </span>
                        </div>
                        
                        {/* Configurable guidelines */}
                        <div className="grid grid-cols-2 gap-2.5">
                          <div className="col-span-2 sm:col-span-1">
                            <label className="block text-[9px] tracking-wider font-bold uppercase font-mono text-slate-500 mb-1">Passions, Skills & Hobbies</label>
                            <input
                              type="text"
                              placeholder="e.g. AI research, React, guitar, hiking"
                              value={assistantKeywords}
                              onChange={e => setAssistantKeywords(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-2 text-[11px] text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
                            />
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <label className="block text-[9px] tracking-wider font-bold uppercase font-mono text-slate-500 mb-1">Tone & Core Focus</label>
                            <select
                              value={assistantTone}
                              onChange={e => setAssistantTone(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-[11px] text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
                            >
                              <option value="Creative & Enthusiastic">Creative & Enthusiastic</option>
                              <option value="Professional & Technical">Professional & Technical</option>
                              <option value="Elite Academic">Elite Academic</option>
                              <option value="Casual & Friendly">Casual & Friendly</option>
                              <option value="Peer Tutor Style">Peer Tutor Style</option>
                              <option value="Short, Minimal & Punchy">Short, Minimal & Punchy</option>
                            </select>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-slate-150 shadow-sm select-none">
                          <p className="text-[10px] text-slate-450 italic leading-snug max-w-[65%]">
                            Combines your major, year, and selected tone!
                          </p>
                          <button
                            type="button"
                            disabled={isGeneratingBio}
                            onClick={generateStudentBios}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[10px] px-3.5 py-2 rounded-lg cursor-pointer disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                          >
                            {isGeneratingBio ? (
                              <>
                                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Working...
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3.5 h-3.5" /> Generate Ideas
                              </>
                            )}
                          </button>
                        </div>

                        {/* Banner for errors or notifications */}
                        {assistantError && (
                          <div className="text-[10px] font-bold text-red-700 bg-red-50 border border-red-100 p-2.5 rounded-lg flex items-start gap-1.5">
                            <span className="shrink-0">⚠️</span>
                            <span>{assistantError}</span>
                          </div>
                        )}

                        {assistantSuccessMessage && (
                          <div className="text-[10px] font-semibold text-emerald-855 bg-emerald-50/70 border border-emerald-100/60 p-2.5 rounded-lg flex items-center justify-between">
                            <span className="inline-flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-550" /> {assistantSuccessMessage}
                            </span>
                          </div>
                        )}

                        {/* Dynamic Bios Suggestions list */}
                        {generatedBios.length > 0 && (
                          <div className="space-y-2 pt-2 border-t border-indigo-100/40">
                            <label className="block text-[9px] tracking-wider font-bold uppercase font-mono text-slate-500 mb-1">Click any candidate draft to apply:</label>
                            <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
                              {generatedBios.map((bioOption, idx) => (
                                <div 
                                  key={idx}
                                  onClick={() => {
                                    setTempProfile({ ...tempProfile, bio: bioOption.text });
                                    setAssistantSuccessMessage(`Applied "${bioOption.style}" to your status bio!`);
                                  }}
                                  className={`text-left p-3 rounded-xl border transition-all flex flex-col gap-1 shadow-xs cursor-pointer ${
                                    tempProfile.bio === bioOption.text 
                                      ? 'border-indigo-500 bg-indigo-50 hover:bg-indigo-100/40' 
                                      : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/20'
                                  }`}
                                >
                                  <div className="flex items-center justify-between select-none">
                                    <span className="text-[9px] font-mono tracking-wide font-bold uppercase px-2 py-0.5 rounded-md bg-indigo-100/60 text-indigo-750">
                                      {bioOption.style}
                                    </span>
                                    {tempProfile.bio === bioOption.text ? (
                                      <span className="text-[9px] text-indigo-600 font-bold inline-flex items-center gap-0.5">
                                        Active <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                                      </span>
                                    ) : (
                                      <span className="text-[10px] text-indigo-600 font-semibold group-hover:underline transition-opacity">
                                        Use bio →
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-700 font-medium leading-relaxed font-sans mt-1">
                                    "{bioOption.text}"
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quick Info Tip */}
                <div className="bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-xl flex items-start gap-2.5 text-[10px] leading-relaxed text-indigo-300">
                  <BadgeInfo className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>Changing your student identity updates your direct threads, item uploaders, community profile counters, and active chat handles instantly across live terminals.</span>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2.5 pt-2 select-none shrink-0 border-t border-slate-100 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowProfileModal(false)}
                    className="flex-1 bg-white hover:bg-slate-50 text-slate-705 hover:text-slate-900 py-2.5 rounded-xl text-xs font-semibold cursor-pointer border border-slate-200 transition-all select-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-xs font-semibold cursor-pointer hover:shadow-lg hover:shadow-indigo-600/15 transition-all select-none flex items-center justify-center gap-1.5"
                  >
                    {isSaving ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Credentials</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}

