/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeatureGrid from './components/FeatureGrid';
import InteractiveMockup from './components/InteractiveMockup';
import EntrepreneurSection from './components/EntrepreneurSection';
import AcademicSection from './components/AcademicSection';
import Footer from './components/Footer';
import { UserProfile, AppNotification } from './types';

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'message',
    title: 'New Message from Elena Rostova',
    body: '"Oh fantastic, the mint-green one sounds perfect! Can I purchase..."',
    timestamp: '2m ago',
    isRead: false,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
    linkId: 'Elena Rostova'
  },
  {
    id: 'notif-2',
    type: 'marketplace',
    title: 'New Custom Crafted Offer Posted',
    body: 'Sarah Jenkins listed an order slot: "Handmade Customized Study Planners" for $12.',
    timestamp: '15m ago',
    isRead: false,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'notif-3',
    type: 'resource',
    title: 'Resource Shared in CS220',
    body: 'David Chen uploaded a new PDF guide: "BST Traversal & Binary Tree Balancing Cheat Sheet".',
    timestamp: '1h ago',
    isRead: true,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 'notif-4',
    type: 'group',
    title: 'CS 220 Discussion Active',
    body: 'Marcus pinned a announcement: "Formed a group chat study review for tomorrow mid-term quiz."',
    timestamp: '2h ago',
    isRead: true,
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120'
  }
];

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('konekt-user-profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_) {}
    }
    // Dynamic default handle
    const nicks = ['QuantumCoder', 'CampusLlama', 'ByteSizeGrad', 'AcademicHustler', 'VeloRunner'];
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const defaultName = nicks[Math.floor(Math.random() * nicks.length)] + '_' + randomSuffix;

    return {
      name: defaultName,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
      bio: 'CS student exploring collaborative sandbox networks, peer tutoring and campus marketplace builds.',
      major: 'Computer Science',
      year: 'Junior',
      university: 'Konekt Campus'
    };
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('konekt-notifications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_) {}
    }
    return INITIAL_NOTIFICATIONS;
  });

  const saveNotifications = (newNotifs: AppNotification[]) => {
    setNotifications(newNotifs);
    localStorage.setItem('konekt-notifications', JSON.stringify(newNotifs));
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setUserProfile(updated);
    localStorage.setItem('konekt-user-profile', JSON.stringify(updated));
  };

  const handleMarkNotificationRead = (id: string) => {
    saveNotifications(
      notifications.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const handleMarkAllNotificationsRead = () => {
    saveNotifications(
      notifications.map(n => ({ ...n, isRead: true }))
    );
  };

  const handleRemoveNotification = (id: string) => {
    saveNotifications(
      notifications.filter(n => n.id !== id)
    );
  };

  const handleClearAllNotifications = () => {
    saveNotifications([]);
  };

  const handleAddNotification = (notif: Omit<AppNotification, 'id' | 'isRead'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: 'notif-' + Date.now() + Math.random().toString(36).substr(2, 4),
      isRead: false
    };
    saveNotifications([newNotif, ...notifications]);
  };

  const handleScrollToDemo = () => {
    const element = document.getElementById('interactive-demo');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] text-slate-800 font-sans selection:bg-indigo-600/10 selection:text-indigo-900 overflow-x-hidden antialiased">
      {/* Background decoration elements */}
      <div className="fixed top-0 left-0 right-0 z-0 h-screen pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full opacity-60 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.08),transparent_60%)]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Head */}
        <Navbar 
          userProfile={userProfile} 
          onUpdateProfile={handleUpdateProfile} 
          notifications={notifications}
          onMarkRead={handleMarkNotificationRead}
          onMarkAllRead={handleMarkAllNotificationsRead}
          onRemove={handleRemoveNotification}
          onClearAll={handleClearAllNotifications}
        />

        {/* Cinematic Presentation Header */}
        <Hero onExploreDemo={handleScrollToDemo} />

        {/* Feature Grid Core Pillars */}
        <FeatureGrid />

        {/* Core Interactive Showcase Sandbox Container */}
        <InteractiveMockup 
          userProfile={userProfile} 
          onUpdateProfile={handleUpdateProfile} 
          onAddNotification={handleAddNotification}
        />

        {/* Entrepreneur Platform Detail */}
        <EntrepreneurSection />

        {/* Academic Sharing Detail */}
        <AcademicSection />

        {/* Footer info blocks */}
        <Footer />
      </div>
    </div>
  );
}
