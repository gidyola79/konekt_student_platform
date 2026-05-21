import { useState, useRef, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, FolderOpen, MessagesSquare, Users, Search, Plus, 
  Download, Loader2, ArrowRight, CornerDownLeft, Send, CheckCircle2, 
  ThumbsUp, Tag, ShieldCheck, ChevronRight, Sparkles, BookOpen, Star, HelpCircle,
  Pin, PinOff, Trash2, ShieldAlert, UserX, Crown, ChevronLeft, SlidersHorizontal,
  Check, CheckCheck, Clock, MessageSquare
} from 'lucide-react';
import { mockResources, mockMarketplace, mockGroups, initialMockConversation } from '../mockData';
import { ResourceItem, MarketplaceItem, CommunityGroup, DirectMessage, CirclePost, CircleMember, UserProfile } from '../types';
import CampusMap from './CampusMap';
import { MapPin } from 'lucide-react';

const INITIAL_CIRCLE_POSTS: CirclePost[] = [
  // CS 220 posts
  {
    id: 'p-1',
    groupId: 'g-1',
    authorName: 'Aisha Patel (Moderator)',
    authorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    text: '📢 WELCOME TO THE STUDY GROUP: Please keep threads strictly educational. Weekly exam reviews take place in Zoom on Tuesdays. Do not post unauthorized homework solutions!',
    timestamp: '2 hours ago',
    isPinned: true,
    likes: 18,
  },
  {
    id: 'p-2',
    groupId: 'g-1',
    authorName: 'Liam O’Connor',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    text: 'Hey coding squad, does anyone have a clear diagram detailing Red-Black Tree rotation cases? Pointer assignments are breaking my terminal.',
    timestamp: '1 hour ago',
    likes: 6,
  },
  {
    id: 'p-3',
    groupId: 'g-1',
    authorName: 'Spammy Steve',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
    text: '🚨 CHEAP TERM PAPERS! Pay 10 dollars to bypass all homework checks! Legit link here: draft-bypass-spam.xyz 🚨',
    timestamp: '15 mins ago',
    likes: 0,
  },
  
  // Entrepreneurs network posts
  {
    id: 'p-4',
    groupId: 'g-2',
    authorName: 'Zoe Vance (Creator)',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120',
    text: '📢 SUBMISSION MILESTONE: Seed grant applications for local student startups are due inside the incubator portal this Friday!',
    timestamp: '1 day ago',
    isPinned: true,
    likes: 29,
  },
  {
    id: 'p-5',
    groupId: 'g-2',
    authorName: 'Marcus Miller',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120',
    text: 'Just finished customized LED neon signboards for the demo workspace. PM if you want code templates.',
    timestamp: '4 hours ago',
    likes: 11,
  },

  // Sunset runners
  {
    id: 'p-6',
    groupId: 'g-3',
    authorName: 'North Campus Sunset Runners',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    text: '📢 RAIN SAFETY CHECK: Drizzle in forecast tonight! Bring bright reflective outerwear; we meet at 6:30 PM near the library steps anyway.',
    timestamp: '3 days ago',
    isPinned: true,
    likes: 15,
  }
];

const INITIAL_CIRCLE_MEMBERS: CircleMember[] = [
  // CS 220
  {
    id: 'm-1',
    groupId: 'g-1',
    name: 'Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    role: 'member',
    bio: 'Junior Chemistry major. Learning pointer structures for bioinformatics.',
    joinDate: 'Joined 1 week ago',
  },
  {
    id: 'm-2',
    groupId: 'g-1',
    name: 'Spammy Steve',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=85&w=120',
    role: 'member',
    bio: 'Looking to boost sales conversions 📈',
    joinDate: 'Joined yesterday',
  },
  {
    id: 'm-3',
    groupId: 'g-1',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
    role: 'admin',
    bio: 'CS Sophomore. Passionate about Haskell, functional patterns, and structural complexity.',
    joinDate: 'Joined 3 weeks ago',
  },
  {
    id: 'm-4',
    groupId: 'g-1',
    name: 'Liam O’Connor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    role: 'member',
    bio: 'Business analytics undergrad. Exploring quant models.',
    joinDate: 'Joined 5 days ago',
  },
  
  // Entrepreneurs
  {
    id: 'm-5',
    groupId: 'g-2',
    name: 'Marcus Miller',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120',
    role: 'member',
    bio: 'Mechanical engineering junior. Building neon-light signs.',
    joinDate: 'Joined 5 days ago',
  },
  {
    id: 'm-6',
    groupId: 'g-2',
    name: 'Zoe Vance',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120',
    role: 'creator',
    bio: 'Senior, full-stack dev looking for ambitious project associates.',
    joinDate: 'Joined 1 month ago',
  }
];

interface InteractiveMockupProps {
  userProfile?: UserProfile;
  onUpdateProfile?: (updated: UserProfile) => void;
  onAddNotification?: (notif: {
    type: 'message' | 'marketplace' | 'group' | 'resource';
    title: string;
    body: string;
    timestamp: string;
    avatar?: string;
    linkId?: string;
  }) => void;
}

export default function InteractiveMockup({ 
  userProfile, 
  onUpdateProfile,
  onAddNotification 
}: InteractiveMockupProps = {}) {
  const [activeTab, setActiveTab] = useState<'market' | 'resources' | 'groups' | 'chats'>('market');

  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const customEvent = event as CustomEvent<{ tab: 'market' | 'resources' | 'groups' | 'chats'; contact?: string }>;
      if (customEvent.detail && customEvent.detail.tab) {
        setActiveTab(customEvent.detail.tab);
        if (customEvent.detail.tab === 'chats' && customEvent.detail.contact) {
          const contactName = customEvent.detail.contact;
          let avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120';
          if (contactName === 'Elena Rostova') {
            avatar = 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120';
          } else if (contactName === 'Zoe Vance') {
            avatar = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120';
          }
          setCurrentChatUser({
            name: contactName,
            avatar
          });
          setShowMobileInbox(false);
        }
      }
    };
    window.addEventListener('konekt-navigate-tab', handleNavigate);
    return () => window.removeEventListener('konekt-navigate-tab', handleNavigate);
  }, []);
  
  // Marketplace States
  const [marketItems, setMarketItems] = useState<MarketplaceItem[]>(mockMarketplace);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchMarketQuery, setSearchMarketQuery] = useState('');
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  
  // Advanced Marketplace Filter States
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxProximity, setMaxProximity] = useState<number>(5.0); // max miles: 0.1 to 5.0 (5.0 means 'Anywhere')
  const [filterCustomMade, setFilterCustomMade] = useState<boolean>(false);
  const [filterDigital, setFilterDigital] = useState<boolean>(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  // Dynamic Campus Map States
  const [showCampusMap, setShowCampusMap] = useState(false);
  const [mapFilterLocation, setMapFilterLocation] = useState<string | null>(null);

  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    price: '',
    category: 'crafts' as 'services' | 'digital' | 'tutoring' | 'crafts' | 'tech',
    sellerName: 'You (Student Entrepreneur)',
    proximityMiles: '0.2',
    isCustomMade: false,
    isDigital: false,
    locationName: 'Student Union Plaza'
  });
  
  // Resource States
  const [resourcesList, setResourcesList] = useState<ResourceItem[]>(mockResources);
  const [searchResourceQuery, setSearchResourceQuery] = useState('');
  const [selectedResourceTypeFilter, setSelectedResourceTypeFilter] = useState<string>('all');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadedIds, setDownloadedIds] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newDoc, setNewDoc] = useState({
    title: '',
    courseCode: '',
    subject: '',
    type: 'cheatsheet' as 'cheatsheet' | 'exam-guide' | 'lecture-notes' | 'study-guide'
  });

  // Groups/Communities States
  const [groupsList, setGroupsList] = useState<CommunityGroup[]>(mockGroups);
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>(['g-1']); // Pre-join calculations
  const [groupFilter, setGroupFilter] = useState<string>('all');

  // Moderation / Group Details States
  const [selectedGroup, setSelectedGroup] = useState<CommunityGroup | null>(null);
  const [circlePosts, setCirclePosts] = useState<CirclePost[]>(INITIAL_CIRCLE_POSTS);
  const [circleMembers, setCircleMembers] = useState<CircleMember[]>(INITIAL_CIRCLE_MEMBERS);
  const [isAdminMode, setIsAdminMode] = useState<boolean>(true); // Role switch controller
  const [activeCircleTab, setActiveCircleTab] = useState<'feed' | 'members'>('feed');
  const [newPostText, setNewPostText] = useState('');
  const [newPostPin, setNewPostPin] = useState(false);

  // Chats / Messaging States
  const fallbackNick = 'QuantumCoder_102';
  const fallbackAvatar = 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=120';
  
  const myStudentNick = userProfile?.name || fallbackNick;
  const myAvatar = userProfile?.avatar || fallbackAvatar;

  const [threads, setThreads] = useState<Record<string, DirectMessage[]>>({
    'Elena Rostova': [
      {
        id: 'msg-1',
        senderName: 'Elena Rostova',
        senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
        text: "Hi there! I saw you're selling the crochet turtle plushies on the Konekt Market. Are they still available?",
        timestamp: '2:15 PM',
        direction: 'in',
        status: 'read'
      },
      {
        id: 'msg-2',
        senderName: 'You',
        senderAvatar: myAvatar,
        text: "Yes, they are! I make them every Saturday. I have one pink turtle and one mint-green turtle left in stock.",
        timestamp: '2:18 PM',
        direction: 'out',
        status: 'read',
        readAt: '2:19 PM'
      },
      {
        id: 'msg-3',
        senderName: 'Elena Rostova',
        senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
        text: "Oh fantastic, the mint-green one sounds perfect! Can I purchase it and pick it up near the Student Union building tomorrow?",
        timestamp: '2:20 PM',
        direction: 'in',
        status: 'read'
      }
    ],
    'Zoe Vance': [
      {
        id: 'msg-zv-1',
        senderName: 'Zoe Vance',
        senderAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120',
        text: "Hey, are you free for a React tutoring session this Thursday? I have some slots open.",
        timestamp: '11:05 AM',
        direction: 'in',
        status: 'read'
      }
    ],
    'Marcus Miller': [
      {
        id: 'msg-mm-1',
        senderName: 'Marcus Miller',
        senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120',
        text: "Hi! I got your inquiry about the custom Dorm Neon signs. What color and word were you thinking?",
        timestamp: 'Yesterday',
        direction: 'in',
        status: 'read'
      }
    ]
  });

  const [chatInputValue, setChatInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingContact, setTypingContact] = useState<string | null>(null);
  const [currentChatUser, setCurrentChatUser] = useState({
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120'
  });
  const [searchContactQuery, setSearchContactQuery] = useState('');
  const [showMobileInbox, setShowMobileInbox] = useState(false);
  const [activeClients, setActiveClients] = useState<string[]>([]);
  const [socketConnected, setSocketConnected] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);

  const conversations = threads[currentChatUser.name] || [];

  const setConversations = (update: DirectMessage[] | ((prev: DirectMessage[]) => DirectMessage[])) => {
    setThreads(prev => {
      const current = prev[currentChatUser.name] || [];
      const updatedMessages = typeof update === 'function' ? update(current) : update;
      return {
        ...prev,
        [currentChatUser.name]: updatedMessages
      };
    });
  };

  // Connect to actual WebSocket Server for real-time multi-tab Direct Messaging
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    let socket: WebSocket;
    let reconnectTimeout: any;

    const connect = () => {
      try {
        socket = new WebSocket(wsUrl);
        socketRef.current = socket;

        socket.onopen = () => {
          setSocketConnected(true);
          // Register this tab's profile
          socket.send(JSON.stringify({
            type: 'join',
            username: myStudentNick
          }));
          // Broadcast presence ping
          socket.send(JSON.stringify({
            type: 'ping',
            sender: myStudentNick,
            avatar: myAvatar
          }));
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.type === 'ping') {
              if (data.sender !== myStudentNick) {
                setActiveClients(prev => prev.includes(data.sender) ? prev : [...prev, data.sender]);
                setThreads(prev => {
                  if (prev[data.sender]) return prev;
                  return {
                    ...prev,
                    [data.sender]: []
                  };
                });
                // Reply with pong so they discover us
                socket.send(JSON.stringify({
                  type: 'pong',
                  sender: myStudentNick,
                  avatar: myAvatar,
                  recipient: data.sender
                }));
              }
            } else if (data.type === 'pong') {
              if (data.recipient === myStudentNick) {
                setActiveClients(prev => prev.includes(data.sender) ? prev : [...prev, data.sender]);
                setThreads(prev => {
                  if (prev[data.sender]) return prev;
                  return {
                    ...prev,
                    [data.sender]: []
                  };
                });
              }
            } else if (data.type === 'message') {
              if (data.recipientName === myStudentNick) {
                const newMsg: DirectMessage = {
                  id: data.id || `msg-live-${Date.now()}`,
                  senderName: data.senderName,
                  senderAvatar: data.senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
                  text: data.text,
                  timestamp: data.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  direction: 'in',
                  status: 'read'
                };

                setThreads(prev => {
                  const history = prev[data.senderName] || [];
                  if (history.some(m => m.id === newMsg.id)) return prev;
                  return {
                    ...prev,
                    [data.senderName]: [...history, newMsg]
                  };
                });

                // Reply with read acknowledgement
                socket.send(JSON.stringify({
                  type: 'read',
                  senderName: myStudentNick,
                  recipientName: data.senderName,
                  messageId: newMsg.id
                }));
              }
            } else if (data.type === 'typing') {
              if (data.recipient === myStudentNick) {
                setIsTyping(data.isTyping);
                setTypingContact(data.isTyping ? data.sender : null);
              }
            } else if (data.type === 'read') {
              if (data.recipientName === myStudentNick) {
                setThreads(prev => {
                  const history = prev[data.senderName] || [];
                  return {
                    ...prev,
                    [data.senderName]: history.map(msg => 
                      msg.direction === 'out' 
                        ? { ...msg, status: 'read' as const, readAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } 
                        : msg
                    )
                  };
                });
              }
            }
          } catch (err) {
            console.error('WS parse error:', err);
          }
        };

        socket.onclose = () => {
          setSocketConnected(false);
          reconnectTimeout = setTimeout(connect, 3000);
        };

        socket.onerror = () => {
          setSocketConnected(false);
        };
      } catch (err) {
        console.error('WS Connection error:', err);
        setSocketConnected(false);
      }
    };

    connect();

    return () => {
      if (socket) socket.close();
      clearTimeout(reconnectTimeout);
    };
  }, [myStudentNick]);

  // Track target client to send typing triggers
  useEffect(() => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'track',
        activeChatUser: currentChatUser.name
      }));
    }
  }, [currentChatUser.name]);

  // Notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Trigger Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Scroll chat to bottom when message arrives
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [threads, currentChatUser.name, isTyping]);

  // handle Marketplace Post Product
  const handleAddProduct = (e: FormEvent) => {
    e.preventDefault();
    if (!newProduct.title || !newProduct.price) {
      showToast('Please fill out key details');
      return;
    }
    const item: MarketplaceItem = {
      id: `custom-market-${Date.now()}`,
      title: newProduct.title,
      description: newProduct.description || 'Verified student-made product or service listed on campus.',
      price: Number(newProduct.price) || 5,
      sellerName: newProduct.sellerName === 'You (Student Entrepreneur)' ? `${myStudentNick} (Seller)` : newProduct.sellerName,
      sellerAvatar: myAvatar,
      category: newProduct.category,
      rating: 5.0,
      likes: 1,
      imageUrl: newProduct.category === 'tutoring' 
        ? 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400'
        : newProduct.category === 'crafts'
        ? 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=400'
        : 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=400',
      proximityMiles: Number(newProduct.proximityMiles) || 0.2,
      isCustomMade: newProduct.isCustomMade,
      isDigital: newProduct.isDigital,
      locationName: newProduct.locationName || 'Student Union Plaza'
    };
    setMarketItems([item, ...marketItems]);
    setShowAddProductModal(false);
    setNewProduct({
      title: '',
      description: '',
      price: '',
      category: 'crafts',
      sellerName: 'You (Student Entrepreneur)',
      proximityMiles: '0.2',
      isCustomMade: false,
      isDigital: false,
      locationName: 'Student Union Plaza'
    });
    showToast(`Successfully listed "${item.title}" to the marketplace!`);

    if (onAddNotification) {
      onAddNotification({
        type: 'marketplace',
        title: 'Your Product is Now Live!',
        body: `You listed: "${item.title}" for $${item.price} to Konekt Marketplace.`,
        timestamp: 'Just now',
        avatar: myAvatar,
        linkId: 'marketplace'
      });
    }
  };

  // handle Resource Downloading
  const triggerResourceDownload = (id: string, title: string) => {
    if (downloadingId) return;
    setDownloadingId(id);
    setDownloadProgress(0);
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadingId(null);
          setDownloadedIds(prevIds => [...prevIds, id]);
          showToast(`Downloaded: "${title}" successfully stored in learning files!`);
          return 100;
        }
        return prev + 10;
      });
    }, 150);
  };

  // handle Resource Upload
  const handleUploadResource = (e: FormEvent) => {
    e.preventDefault();
    if (!newDoc.title || !newDoc.courseCode) {
      showToast('Please enter title & course code');
      return;
    }
    const resource: ResourceItem = {
      id: `custom-res-${Date.now()}`,
      title: newDoc.title,
      type: newDoc.type,
      subject: newDoc.subject || 'All Classes',
      courseCode: newDoc.courseCode.toUpperCase(),
      uploaderName: `${myStudentNick} (Uploader)`,
      uploaderAvatar: myAvatar,
      fileFormat: 'PDF',
      downloadsCount: 0,
      rating: 5.0,
      dateAdded: 'Just now'
    };
    setResourcesList([resource, ...resourcesList]);
    setShowUploadModal(false);
    setNewDoc({
      title: '',
      courseCode: '',
      subject: '',
      type: 'cheatsheet'
    });
    showToast(`Shared "${resource.title}" with fellow students!`);

    if (onAddNotification) {
      onAddNotification({
        type: 'resource',
        title: 'New Resource Shared by You',
        body: `You shared "${resource.title}" with fellow students. Let the study sessions begin!`,
        timestamp: 'Just now',
        avatar: myAvatar,
        linkId: 'resources'
      });
    }
  };

  // Toggle joining circles
  const toggleJoinGroup = (id: string, groupName: string) => {
    if (joinedGroupIds.includes(id)) {
      setJoinedGroupIds(joinedGroupIds.filter(g => g !== id));
      setGroupsList(groupsList.map(g => g.id === id ? { ...g, membersCount: g.membersCount - 1 } : g));
      showToast(`Left group: ${groupName}`);
      if (selectedGroup && selectedGroup.id === id) {
        setSelectedGroup(null);
      }
    } else {
      setJoinedGroupIds([...joinedGroupIds, id]);
      setGroupsList(groupsList.map(g => g.id === id ? { ...g, membersCount: g.membersCount + 1 } : g));
      showToast(`Success: You are now a member of ${groupName}!`);

      if (onAddNotification) {
        onAddNotification({
          type: 'group',
          title: `Joined Circle: ${groupName}`,
          body: `Welcome! Active trends: "Discussing notes & prepping for reviews". Check out the group feed and chat.`,
          timestamp: 'Just now',
          avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
          linkId: id
        });
      }
    }
  };

  // Circle Moderation tool actions
  const handlePinCirclePost = (postId: string) => {
    setCirclePosts(prev => prev.map(post => {
      if (post.id === postId) {
        const nextPinned = !post.isPinned;
        showToast(nextPinned 
          ? `Group Alert: Pinned message! Crucial announcement is now featured on top.` 
          : `Group Alert: Announcement unpinned.`
        );
        return { ...post, isPinned: nextPinned };
      }
      return post;
    }));
  };

  const handleDeleteCirclePost = (postId: string, author: string) => {
    setCirclePosts(prev => prev.filter(post => post.id !== postId));
    showToast(`Content Removed: Moderated/deleted post by student ${author}.`);
  };

  const handleKickCircleMember = (memberId: string, name: string) => {
    setCircleMembers(prev => prev.filter(member => member.id !== memberId));
    
    // Decrement groups counts in state
    setGroupsList(prev => prev.map(g => {
      if (selectedGroup && g.id === selectedGroup.id) {
        return { ...g, membersCount: Math.max(1, g.membersCount - 1) };
      }
      return g;
    }));

    if (selectedGroup) {
      setSelectedGroup(prev => prev ? { ...prev, membersCount: Math.max(1, prev.membersCount - 1) } : null);
    }

    showToast(`Moderated: Kicked student "${name}" out of the circle.`);
  };

  const handleBanCircleMember = (memberId: string, name: string) => {
    setCircleMembers(prev => prev.filter(member => member.id !== memberId));
    
    // Decrement groups counts in state
    setGroupsList(prev => prev.map(g => {
      if (selectedGroup && g.id === selectedGroup.id) {
        return { ...g, membersCount: Math.max(1, g.membersCount - 1) };
      }
      return g;
    }));

    if (selectedGroup) {
      setSelectedGroup(prev => prev ? { ...prev, membersCount: Math.max(1, prev.membersCount - 1) } : null);
    }

    showToast(`👑 Severe Moderation: Banned "${name}" permanently of circle entry permissions.`);
  };

  const handleAddCirclePost = (e: FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() || !selectedGroup) return;

    const newPost: CirclePost = {
      id: `gp-custom-${Date.now()}`,
      groupId: selectedGroup.id,
      authorName: isAdminMode ? `${myStudentNick} (Circle Admin)` : `${myStudentNick}`,
      authorAvatar: myAvatar,
      text: newPostText,
      timestamp: 'Just now',
      isPinned: isAdminMode && newPostPin,
      likes: 0
    };

    setCirclePosts([newPost, ...circlePosts]);
    setNewPostText('');
    setNewPostPin(false);
    showToast(newPost.isPinned 
      ? `Pinned Announcement added successfully to the top!` 
      : 'Added post to group feed!'
    );

    if (onAddNotification) {
      onAddNotification({
        type: 'group',
        title: `Post Published in ${selectedGroup.name}`,
        body: `You posted: "${newPost.text}"`,
        timestamp: 'Just now',
        avatar: myAvatar,
        linkId: selectedGroup.id
      });
    }
  };

  const handleLikePost = (postId: string) => {
    setCirclePosts(prev => prev.map(p => p.id === postId ? { ...p, likes: p.likes + 1 } : p));
  };

  // Direct Message actions
  const sendChatMessage = (text: string) => {
    if (!text.trim()) return;
    
    const msgId = `msg-user-${Date.now()}`;
    const userMessage: DirectMessage = {
      id: msgId,
      senderName: 'You',
      senderAvatar: myAvatar,
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      direction: 'out',
      status: 'sending'
    };
    
    // Add msg optimistically to current chat
    setConversations(prev => [...prev, userMessage]);
    setChatInputValue('');

    // Send via socket if currentChatUser is a real connected client from another tab!
    const isRealLiveUser = currentChatUser.name.includes('_');
    if (isRealLiveUser && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'message',
        id: msgId,
        senderName: myStudentNick,
        recipientName: currentChatUser.name,
        text: text,
        timestamp: userMessage.timestamp,
        senderAvatar: myAvatar
      }));
    }

    // Trigger typing notification via socket if a real user is targeted
    if (isRealLiveUser && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'typing',
        sender: myStudentNick,
        recipient: currentChatUser.name,
        isTyping: true
      }));
      // Stop typing broadcast after 2 seconds
      setTimeout(() => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          socketRef.current.send(JSON.stringify({
            type: 'typing',
            sender: myStudentNick,
            recipient: currentChatUser.name,
            isTyping: false
          }));
        }
      }, 2000);
    }

    // Progression of receipt validations (Sending -> Sent -> Delivered -> Read)
    setTimeout(() => {
      setConversations(prev => prev.map(m => m.id === msgId ? { ...m, status: 'sent' } : m));
    }, 400);

    setTimeout(() => {
      setConversations(prev => prev.map(m => m.id === msgId ? { ...m, status: 'delivered' } : m));
    }, 800);

    // If talking to a simulated mockup bot, trigger simulated human behavior!
    if (!isRealLiveUser) {
      setTimeout(() => {
        setConversations(prev => prev.map(m => m.id === msgId ? { ...m, status: 'read', readAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : m));
      }, 1400);

      // Contact starts typing
      setTimeout(() => {
        setIsTyping(true);
        setTypingContact(currentChatUser.name);
      }, 2000);

      // Deliver mock reply with high precision
      setTimeout(() => {
        setIsTyping(false);
        setTypingContact(null);
        
        let replyText = "That sounds great! Let's arrange it. Let me check my weekly class schedule and verify.";
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('buy') || lowerText.includes('price') || lowerText.includes('available')) {
          replyText = `Awesome! Yes, it is fully active. Let's arrange a cash or cash-app handover. I am around the campus library every day after 3 PM.`;
        } else if (lowerText.includes('study') || lowerText.includes('midterm') || lowerText.includes('exam')) {
          replyText = `Totally down to study! Let's book a collaborative study cubicle in the main annex. I'll share my formula draft folder with you in the meantime.`;
        } else if (lowerText.includes('tutor') || lowerText.includes('react') || lowerText.includes('help')) {
          replyText = `Sure thing! I have slots open on Tuesday nights and Thursday afternoons. We can meet on Zoom or in-person. What project are you hacking on?`;
        }

        const replyMessage: DirectMessage = {
          id: `msg-reply-${Date.now()}`,
          senderName: currentChatUser.name,
          senderAvatar: currentChatUser.avatar,
          text: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          direction: 'in',
          status: 'read'
        };

        setConversations(prev => [...prev, replyMessage]);

        if (onAddNotification) {
          onAddNotification({
            type: 'message',
            title: `New Message from ${currentChatUser.name}`,
            body: `"${replyText}"`,
            timestamp: 'Just now',
            avatar: currentChatUser.avatar,
            linkId: currentChatUser.name
          });
        }
      }, 4000);
    }
  };

  // Transition from Marketplace "Contact seller" to chats Tab
  const initiateSellerContact = (sellerName: string, sellerAvatar: string, titleCode: string) => {
    setCurrentChatUser({
      name: sellerName,
      avatar: sellerAvatar
    });
    
    // Create pre-baked thread context if it doesn't already exist or override
    let wasNew = false;
    setThreads(prev => {
      const existing = prev[sellerName] || [];
      if (existing.length > 0) return prev;
      wasNew = true;
      return {
        ...prev,
        [sellerName]: [
          {
            id: `msg-con-init-${Date.now()}`,
            senderName: sellerName,
            senderAvatar: sellerAvatar,
            text: `Hey! I saw you spotted my listing for "${titleCode}". Let me know if you have any questions!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            direction: 'in',
            status: 'read'
          }
        ]
      };
    });

    setActiveTab('chats');
    setShowMobileInbox(false); // Open chat pane on mobile
    showToast(`Opened dynamic thread with ${sellerName}!`);

    if (wasNew && onAddNotification) {
      onAddNotification({
        type: 'message',
        title: `Message from ${sellerName}`,
        body: `"Hey! I saw you spotted my listing for "${titleCode}". Let me know if you have any questions!"`,
        timestamp: 'Just now',
        avatar: sellerAvatar,
        linkId: sellerName
      });
    }
  };

  const resetFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    setMinRating(0);
    setMaxProximity(5.0);
    setFilterCustomMade(false);
    setFilterDigital(false);
    setSelectedCategory('all');
    setSearchMarketQuery('');
    showToast('Marketplace search filters reset!');
  };

  const filteredMarketItems = marketItems.filter(item => {
    const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
    
    const query = searchMarketQuery.toLowerCase();
    const matchSearch = item.title.toLowerCase().includes(query) || 
                        item.description.toLowerCase().includes(query) ||
                        item.sellerName.toLowerCase().includes(query) ||
                        (item.locationName && item.locationName.toLowerCase().includes(query));
                        
    const matchMinPrice = minPrice === '' || item.price >= Number(minPrice);
    const matchMaxPrice = maxPrice === '' || item.price <= Number(maxPrice);
    
    const matchRating = item.rating >= minRating;
    
    const itemDistance = item.proximityMiles !== undefined ? item.proximityMiles : 0.5;
    const matchProximity = maxProximity === 5.0 || itemDistance <= maxProximity;
    
    const matchCustom = !filterCustomMade || item.isCustomMade === true;
    const matchDigital = !filterDigital || item.isDigital === true;
    
    const matchMapLocation = !mapFilterLocation || (item.locationName && item.locationName === mapFilterLocation);
    
    return matchCat && matchSearch && matchMinPrice && matchMaxPrice && matchRating && matchProximity && matchCustom && matchDigital && matchMapLocation;
  });

  const filteredResources = resourcesList.filter(res => {
    // 1. Filter by the interactive type filter pills (if not 'all')
    if (selectedResourceTypeFilter !== 'all' && res.type !== selectedResourceTypeFilter) {
      return false;
    }

    // 2. Filter by search input query (matching title, courseCode, subject, type, or normalized type)
    const query = searchResourceQuery.toLowerCase().trim();
    if (!query) return true;

    const normalizedType = res.type.toLowerCase().replace('-', ' ');
    return res.title.toLowerCase().includes(query) ||
           res.courseCode.toLowerCase().includes(query) ||
           res.subject.toLowerCase().includes(query) ||
           res.type.toLowerCase().includes(query) ||
           normalizedType.includes(query);
  });

  const getGroupLocation = (groupId: string): string => {
    switch (groupId) {
      case 'g-1': return 'Central Quad Library';
      case 'g-2': return 'Engineering Rotunda';
      case 'g-3': return 'Student Union Plaza';
      case 'g-4': return 'Academic Hall';
      default: return 'Student Union Plaza';
    }
  };

  const filteredGroups = groupsList.filter(g => {
    const matchCategory = groupFilter === 'all' || g.category === groupFilter;
    const matchMapLocation = !mapFilterLocation || getGroupLocation(g.id) === mapFilterLocation;
    return matchCategory && matchMapLocation;
  });

  return (
    <section id="interactive-demo" className="py-24 bg-transparent border-t border-slate-200 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Module Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-mono uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Interactive Sandbox
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-slate-900">
            Experience Konekt in Action
          </h2>
          <p className="mt-4 text-slate-650 text-base sm:text-lg">
            Click through our simulated student cockpit. Post a custom product, study with peers, download shared lecture assets, or send messaging inquiries in real-time.
          </p>
        </div>

        {/* Global Toast Notification */}
        <div className="fixed top-24 right-4 z-40 max-w-sm pointer-events-none">
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="pointer-events-auto flex items-center gap-3 p-4 rounded-2xl bg-slate-800 border border-slate-700 shadow-2xl text-white text-sm"
              >
                <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Outer Device Frame (MacBook Style) */}
        <div className="relative rounded-3xl bg-slate-950/80 border border-slate-800 shadow-2xl overflow-hidden p-2 sm:p-4 backdrop-blur-md">
          {/* Top Window Bar */}
          <div className="flex items-center justify-between px-4 pb-4 border-b border-slate-900">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-rose-500/90" />
              <span className="w-3.5 h-3.5 rounded-full bg-amber-500/90" />
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/90" />
              <span className="ml-4 text-xs font-mono text-slate-500 select-none hidden sm:inline">Konekt Platform Simulator v1.0.4</span>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono text-slate-400">Preview Engine Active</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row h-[600px] bg-slate-950 overflow-hidden">
            {/* App Sidebar controller */}
            <div className="w-full lg:w-64 border-b lg:border-r border-slate-900 bg-slate-950 py-4 flex flex-row lg:flex-col justify-start gap-1 p-2 overflow-x-auto lg:overflow-x-visible">
              
              {/* User Avatar Mini badge (sidebar heading) */}
              <div className="hidden lg:flex items-center gap-3 px-4 py-3 mb-4 rounded-xl bg-slate-900/40 border border-slate-900">
                <div className="relative shrink-0">
                  <img 
                    src={myAvatar} 
                    className="w-10 h-10 rounded-xl bg-slate-800 object-cover" 
                    alt={myStudentNick} 
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border border-slate-950" />
                </div>
                <div className="text-left font-sans min-w-0">
                  <div className="text-sm font-semibold text-white tracking-wide truncate">{myStudentNick}</div>
                  <div className="text-[10px] text-indigo-400 font-medium truncate font-mono">
                    {userProfile?.year || 'Junior'} • {userProfile?.major || 'CS'}
                  </div>
                </div>
              </div>

              {/* Sidebar Tabs */}
              <button
                onClick={() => setActiveTab('market')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full text-left shrink-0 lg:shrink cursor-pointer ${
                  activeTab === 'market' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <ShoppingBag className="w-4.5 h-4.5" />
                <span>Marketplace</span>
              </button>

              <button
                onClick={() => setActiveTab('resources')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full text-left shrink-0 lg:shrink cursor-pointer ${
                  activeTab === 'resources' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <FolderOpen className="w-4.5 h-4.5" />
                <span>Resources Vault</span>
              </button>

              <button
                onClick={() => setActiveTab('groups')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full text-left shrink-0 lg:shrink cursor-pointer ${
                  activeTab === 'groups' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Users className="w-4.5 h-4.5" />
                <span>Campus Circles</span>
              </button>

              <button
                onClick={() => setActiveTab('chats')}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all w-full text-left shrink-0 lg:shrink cursor-pointer ${
                  activeTab === 'chats' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <MessagesSquare className="w-4.5 h-4.5" />
                <span className="flex-1">Messenger</span>
                {conversations.length > 3 && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                )}
              </button>
            </div>

            {/* Inner Dashboard screen */}
            <div className="flex-1 bg-slate-900/20 flex flex-col h-full overflow-hidden">
              
              {/* TAB 1: Student Marketplace */}
              {activeTab === 'market' && (
                <div className="flex flex-col h-full p-4 overflow-hidden">
                  
                  {/* Top controller */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-4 border-b border-slate-900">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Search student neon lights, tutoring tutorials, essays review..."
                        value={searchMarketQuery}
                        onChange={e => setSearchMarketQuery(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 text-white pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setShowCampusMap(!showCampusMap);
                          if (showCampusMap) {
                            setMapFilterLocation(null);
                          }
                        }}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold inline-flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                          showCampusMap
                            ? 'bg-emerald-600/15 border-emerald-500/40 text-emerald-400 shadow-sm shadow-emerald-600/5'
                            : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        <MapPin className="w-4 h-4 text-emerald-400" />
                        <span>Campus Map</span>
                        {mapFilterLocation && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        )}
                      </button>

                      <button
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className={`rounded-xl px-4 py-2 text-sm font-semibold inline-flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                          showAdvancedFilters || minPrice !== '' || maxPrice !== '' || minRating > 0 || maxProximity < 5.0 || filterCustomMade || filterDigital
                            ? 'bg-indigo-600/15 border border-indigo-500/40 text-indigo-400'
                            : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
                        }`}
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>Filters</span>
                        {(minPrice !== '' || maxPrice !== '' || minRating > 0 || maxProximity < 5.0 || filterCustomMade || filterDigital) && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                        )}
                      </button>

                      <button
                        onClick={() => setShowAddProductModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2 text-sm font-semibold inline-flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Post Product</span>
                      </button>
                    </div>
                  </div>

                  {/* Category filters */}
                  <div className="flex gap-2 py-3 overflow-x-auto shrink-0 scrollbar-none">
                    {['all', 'crafts', 'tutoring', 'tech', 'services'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border uppercase transition-colors shrink-0 cursor-pointer ${
                          selectedCategory === cat
                            ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                            : 'bg-slate-950/40 text-slate-500 border-slate-800/80 hover:text-slate-300'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Advanced Filter UI Panel */}
                  <AnimatePresence>
                    {showAdvancedFilters && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden bg-slate-950 rounded-2xl border border-indigo-500/10 p-4 mb-4 shrink-0"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
                          {/* Col 1: Price Range */}
                          <div className="space-y-2">
                            <span className="block font-mono text-[10px] uppercase text-slate-400 font-bold">Price Range</span>
                            <div className="flex items-center gap-2">
                              <div className="relative flex-1">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                <input
                                  type="number"
                                  placeholder="Min"
                                  value={minPrice}
                                  onChange={e => setMinPrice(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                                  className="w-full bg-slate-900 border border-slate-800 text-white pl-5 pr-2 py-1.5 rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                                />
                              </div>
                              <span className="text-slate-500">—</span>
                              <div className="relative flex-1">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                                <input
                                  type="number"
                                  placeholder="Max"
                                  value={maxPrice}
                                  onChange={e => setMaxPrice(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                                  className="w-full bg-slate-900 border border-slate-800 text-white pl-5 pr-2 py-1.5 rounded-lg text-xs focus:outline-none focus:border-indigo-500"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Col 2: Min Rating */}
                          <div className="space-y-2">
                            <span className="block font-mono text-[10px] uppercase text-slate-400 font-bold">Seller Rating</span>
                            <div className="flex flex-wrap gap-1.5">
                              {[0, 4.0, 4.5, 4.8].map(ratingValue => (
                                <button
                                  key={ratingValue}
                                  onClick={() => setMinRating(ratingValue)}
                                  className={`px-2.5 py-1.5 rounded-lg border font-medium text-xs transition-colors cursor-pointer ${
                                    minRating === ratingValue
                                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-bold'
                                      : 'bg-slate-900 text-slate-400 border-slate-800/80 hover:text-white'
                                  }`}
                                >
                                  {ratingValue === 0 ? 'Any' : `${ratingValue} ★`}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Col 3: On-Campus Proximity */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-mono uppercase text-slate-400 font-bold">
                              <span>Max Distance</span>
                              <span className="text-cyan-400 lowercase">{maxProximity === 5.0 ? 'anywhere' : `< ${maxProximity} mi`}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="range"
                                min="0.1"
                                max="5.0"
                                step="0.1"
                                value={maxProximity}
                                onChange={e => setMaxProximity(Number(e.target.value))}
                                className="w-full h-1.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                              />
                            </div>
                            <div className="flex justify-between text-[9px] font-mono text-slate-500 mt-0.5">
                              <span>0.1 mi (Close)</span>
                              <span>Anywhere</span>
                            </div>
                          </div>

                          {/* Col 4: Types Flag Toggles */}
                          <div className="space-y-2">
                            <span className="block font-mono text-[10px] uppercase text-slate-400 font-bold">Item Classification</span>
                            <div className="flex flex-col gap-2">
                              <label className="flex items-center gap-2 text-xs text-slate-300 font-medium select-none cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={filterCustomMade}
                                  onChange={e => setFilterCustomMade(e.target.checked)}
                                  className="form-checkbox bg-slate-900 border-slate-800 text-indigo-600 focus:ring-0 rounded"
                                />
                                <span>Student Custom-Made / Crafts</span>
                              </label>
                              <label className="flex items-center gap-2 text-xs text-slate-300 font-medium select-none cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={filterDigital}
                                  onChange={e => setFilterDigital(e.target.checked)}
                                  className="form-checkbox bg-slate-900 border-slate-800 text-indigo-600 focus:ring-0 rounded"
                                />
                                <span>Digital Delivery Assets</span>
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Banner bottom: Active indicators status & Clear action */}
                        <div className="mt-4 pt-3 border-t border-slate-900/60 flex items-center justify-between text-[11px] text-slate-500">
                          <div>
                            Refined list matches <span className="text-white font-bold">{filteredMarketItems.length}</span> of {marketItems.length} sandbox listings
                          </div>
                          <button
                            onClick={resetFilters}
                            className="text-xs text-rose-450 hover:text-rose-400 font-bold transition-colors cursor-pointer flex items-center gap-1 bg-rose-950/20 px-2.5 py-1 rounded-lg border border-rose-900/10"
                          >
                            Reset Fields
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Campus Map Drawer */}
                  <AnimatePresence>
                    {showCampusMap && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginBottom: 16 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.25 }}
                        className="shrink-0 overflow-hidden"
                      >
                        <CampusMap 
                          activeTab="market"
                          currentFilterLocation={mapFilterLocation}
                          onFilterLocation={(locName) => setMapFilterLocation(locName)}
                          onSelectLocation={(locName) => {
                            setNewProduct(prev => ({ ...prev, locationName: locName }));
                            showToast(`Auto-assigned preferred spot "${locName}" inside list product form!`);
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Listings Grid (Scrollable) */}
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1 mt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredMarketItems.map(item => (
                        <div 
                          key={item.id}
                          className="rounded-2xl border border-slate-800/60 bg-slate-950 p-3 flex flex-col justify-between hover:border-slate-700 transition-colors"
                        >
                          <div>
                            {/* Listing Image */}
                            <div className="relative rounded-xl overflow-hidden aspect-video bg-slate-900">
                              <img 
                                src={item.imageUrl} 
                                className="w-full h-full object-cover" 
                                alt={item.title} 
                              />
                              <div className="absolute top-2 right-2 bg-slate-950/80 backdrop-blur-sm border border-slate-900 rounded-lg px-2 py-1 text-xs font-mono font-bold text-cyan-400">
                                ${item.price}
                              </div>

                              {/* Custom badges inside visual */}
                              <div className="absolute top-2 left-2 flex flex-col gap-1">
                                {item.isCustomMade && (
                                  <span className="bg-indigo-600/95 backdrop-blur-sm border border-indigo-500 rounded px-1.5 py-0.5 text-[8.5px] font-mono font-bold text-white uppercase tracking-wider">
                                    Handcrafted
                                  </span>
                                )}
                                {item.isDigital && (
                                  <span className="bg-cyan-600/95 backdrop-blur-sm border border-cyan-500 rounded px-1.5 py-0.5 text-[8.5px] font-mono font-bold text-white uppercase tracking-wider">
                                    Digital File
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Seller Tag */}
                            <div className="flex items-center gap-2 mt-3 mb-1.5">
                              <img src={item.sellerAvatar} className="w-5 h-5 rounded-full object-cover" alt={item.sellerName} />
                              <span className="text-[10px] text-slate-400 truncate max-w-[150px] font-medium">{item.sellerName}</span>
                            </div>

                            {/* Title & Desc */}
                            <h4 className="font-display font-semibold text-white text-sm line-clamp-1">{item.title}</h4>
                            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{item.description}</p>
                            
                            {/* Proximity / Location Info */}
                            {(item.proximityMiles !== undefined || item.locationName) && (
                              <div className="flex items-center gap-1 mt-2.5 text-[10px] text-slate-400 font-mono">
                                <span className="text-cyan-400">📍</span>
                                <span>{item.proximityMiles !== undefined ? `${item.proximityMiles} mi` : '0.2 mi'}</span>
                                {item.locationName && <span>•</span>}
                                <span className="truncate">{item.locationName || 'Main Campus Hub'}</span>
                              </div>
                            )}
                          </div>

                          {/* Controls */}
                          <div className="pt-3 border-t border-slate-900/60 mt-3 flex items-center justify-between font-sans">
                            <span className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                              <Star className="w-3 h-3 fill-amber-400" /> {item.rating}
                            </span>
                            
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => initiateSellerContact(item.sellerName, item.sellerAvatar, item.title)}
                                className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
                                title="Chat with Entrepreneur"
                              >
                                <MessagesSquare className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => showToast(`Simulated Order Created for "${item.title}"! Checking user balances and preparing secure delivery protocols...`)}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-2.5 py-1.5 text-xs font-semibold select-none transition-colors cursor-pointer"
                              >
                                Buy Now
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {filteredMarketItems.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-500 text-sm">
                          No products found matching filters. Be the first to add one!
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Resource Vault */}
              {activeTab === 'resources' && (
                <div className="flex flex-col h-full p-4 overflow-hidden">
                  
                  {/* Search and Upload bar */}
                  <div className="flex flex-col gap-3 pb-3 border-b border-slate-900">
                    <div className="flex gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          placeholder="Search by subject, course, or type (e.g., CS101, cheatsheet)..."
                          value={searchResourceQuery}
                          onChange={e => setSearchResourceQuery(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 text-white pl-9 pr-4 py-2 rounded-xl text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                      </div>
                      
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 py-2 text-sm font-semibold inline-flex items-center gap-2 transition-colors cursor-pointer shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Upload Notes</span>
                      </button>
                    </div>

                    {/* Filter Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[10px] uppercase tracking-wider font-mono text-slate-500 mr-1.5">Document Type:</span>
                      {[
                        { id: 'all', label: 'All Files' },
                        { id: 'cheatsheet', label: 'Cheatsheets' },
                        { id: 'exam-guide', label: 'Exam Guides' },
                        { id: 'lecture-notes', label: 'Lecture Notes' },
                        { id: 'study-guide', label: 'Study Guides' },
                      ].map(pill => {
                        const active = selectedResourceTypeFilter === pill.id;
                        return (
                          <button
                            key={pill.id}
                            type="button"
                            onClick={() => setSelectedResourceTypeFilter(pill.id)}
                            className={`px-3 py-1 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                              active
                                ? 'bg-indigo-650/40 text-cyan-400 border border-indigo-500/30 font-semibold'
                                  : 'bg-slate-950 border border-slate-850 text-slate-400 hover:text-white hover:border-slate-800'
                            }`}
                          >
                            {pill.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Main Resource List */}
                  <div className="flex-1 overflow-y-auto pr-1 mt-4 space-y-3">
                    {filteredResources.map(res => (
                      <div 
                        key={res.id}
                        className="p-3 sm:p-4 rounded-2xl bg-slate-950 border border-slate-850 hover:border-slate-800 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3">
                          {/* File logo box */}
                          <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 font-mono text-[10px] font-bold shrink-0">
                            {res.fileFormat}
                          </div>
                          
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 font-mono text-[10px] font-bold">
                                {res.courseCode}
                              </span>
                              <span className="text-[10px] text-slate-500 capitalize">{res.type.replace('-', ' ')}</span>
                            </div>
                            
                            <h4 className="font-display font-semibold text-white text-sm sm:text-base mt-1 line-clamp-1">{res.title}</h4>
                            
                            {/* Uploader tag */}
                            <div className="flex items-center gap-1.5 mt-1.5 text-xs text-slate-500">
                              <img src={res.uploaderAvatar} className="w-4 h-4 rounded-full object-cover" alt={res.uploaderName} />
                              <span>{res.uploaderName}</span>
                              <span>•</span>
                              <span>{res.downloadsCount} downloads</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions block */}
                        <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-900 gap-2">
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {res.rating}
                          </span>
                          
                          {downloadedIds.includes(res.id) ? (
                            <button className="flex items-center gap-1.5 text-emerald-400 font-medium text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 cursor-default">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Stored Ready</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => triggerResourceDownload(res.id, res.title)}
                              disabled={downloadingId !== null}
                              className={`flex items-center gap-1.5 text-white font-semibold text-xs px-3 py-2 rounded-lg transition-all cursor-pointer ${
                                downloadingId === res.id
                                  ? 'bg-slate-900 text-slate-400 cursor-wait border border-slate-800'
                                  : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-md'
                              }`}
                            >
                              {downloadingId === res.id ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  <span>Downloading {downloadProgress}%</span>
                                </>
                              ) : (
                                <>
                                  <Download className="w-3.5 h-3.5" />
                                  <span>Download</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {filteredResources.length === 0 && (
                      <div className="py-12 text-center text-slate-500 text-sm">
                        No reference guides found matching query. Add yours now to accumulate reputation!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: Campus Circles */}
              {activeTab === 'groups' && (
                <div className="flex flex-col h-full p-4 overflow-hidden">
                  {!selectedGroup ? (
                    // CLASSIC GROUPS LIST VIEW with Guidance Callout
                    <div className="flex flex-col h-full overflow-hidden">
                      {/* Guidance Tip */}
                      <div className="mb-4 p-3 rounded-xl bg-slate-950/60 border border-slate-900 flex items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-2.5 text-slate-400">
                          <Crown className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0 select-none animate-pulse" />
                          <span>
                            <strong>Moderator Guide:</strong> Join any circle and click <strong>"Manage Space"</strong> to test post pinning, member ejecting/banning, and live feed administration as an Administrator.
                          </span>
                        </div>
                      </div>

                      {/* Category options */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-900 select-none">
                        <div className="flex gap-2 overflow-x-auto shrink-0 scrollbar-none font-sans">
                          {['all', 'academic', 'career', 'social', 'hobby'].map(cat => (
                            <button
                              key={cat}
                              onClick={() => setGroupFilter(cat)}
                              className={`text-xs font-semibold px-3 py-1 bg-slate-950 rounded-lg border cursor-pointer capitalize transition-all shrink-0 ${
                                groupFilter === cat
                                  ? 'bg-indigo-600/15 border-indigo-500/40 text-indigo-400 font-bold'
                                  : 'border-slate-800 text-slate-500 hover:text-slate-300'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>

                        <button
                          onClick={() => {
                            setShowCampusMap(!showCampusMap);
                            if (showCampusMap) {
                              setMapFilterLocation(null);
                            }
                          }}
                          className={`rounded-xl px-4 py-2 text-xs font-semibold inline-flex items-center justify-center gap-2 border transition-all cursor-pointer shrink-0 ${
                            showCampusMap
                              ? 'bg-emerald-600/15 border border-emerald-500/40 text-emerald-400'
                              : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
                          }`}
                        >
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                          <span>Circle Meetups Map</span>
                          {mapFilterLocation && (
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                          )}
                        </button>
                      </div>

                      {/* Campus Map Drawer */}
                      <AnimatePresence>
                        {showCampusMap && (
                          <motion.div
                            initial={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: 12, marginBottom: 12 }}
                            exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                            transition={{ duration: 0.25 }}
                            className="shrink-0 overflow-hidden"
                          >
                            <CampusMap 
                              activeTab="groups"
                              currentFilterLocation={mapFilterLocation}
                              onFilterLocation={(locName) => setMapFilterLocation(locName)}
                              onSelectLocation={(locName) => {
                                showToast(`Selected "${locName}" as circle meetup reference point!`);
                              }}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* List of groups */}
                      <div className="flex-1 overflow-y-auto space-y-3.5 mt-4 pr-1">
                        {filteredGroups.map(group => {
                          const isJoined = joinedGroupIds.includes(group.id);
                          return (
                            <div 
                              key={group.id}
                              className="p-4 rounded-2xl bg-slate-950 border border-slate-850 hover:border-slate-850 transition-colors flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
                            >
                              <div className="flex items-start gap-4">
                                <div className="w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0 select-none">
                                  <Users className="w-5 h-5 text-indigo-400" />
                                </div>
                                
                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-900 border border-slate-850 text-slate-500">
                                      {group.category}
                                    </span>
                                    <span className="text-xs text-slate-400 font-semibold">{group.membersCount} students in circle</span>
                                  </div>
                                  
                                  <h4 className="font-display font-bold text-white text-base mt-2 line-clamp-1">{group.name}</h4>
                                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{group.description}</p>
                                  
                                  {group.activeTrend && (
                                    <div className="mt-3 flex items-center gap-1 text-[10px] text-cyan-400 font-medium">
                                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shrink-0" />
                                      <span>Live Trend: {group.activeTrend}</span>
                                    </div>
                                  )}

                                  <div className="mt-2.5 flex items-center gap-4 text-[10px] text-slate-400 font-mono">
                                    <span className="flex items-center gap-1">
                                      <span className="text-emerald-400">📍</span>
                                      <span>Primary Meetup: <strong className="text-white">{getGroupLocation(group.id)}</strong></span>
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Action controls */}
                              <div className="shrink-0 flex items-center gap-2 border-t md:border-t-0 border-slate-900 pt-3 md:pt-0">
                                <button
                                  onClick={() => toggleJoinGroup(group.id, group.name)}
                                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all w-full md:w-auto cursor-pointer flex items-center justify-center gap-1.5 ${
                                    isJoined
                                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20'
                                      : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                  }`}
                                >
                                  {isJoined ? (
                                    <>
                                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                                      <span>Member Joined</span>
                                    </>
                                  ) : (
                                    <span>Join Circle</span>
                                  )}
                                </button>
                                
                                {isJoined && (
                                  <button
                                    onClick={() => setSelectedGroup(group)}
                                    className="bg-indigo-600/10 hover:bg-indigo-600/25 border border-indigo-500/35 text-indigo-400 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1 shrink-0"
                                  >
                                    <span>Manage Space</span>
                                    <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    // SELECTED GROUP DETAILED MODERATION & FEED VIEW
                    <div className="flex flex-col h-full overflow-hidden">
                      {/* Circle Header */}
                      <div className="flex items-start sm:items-center justify-between pb-3 border-b border-slate-900 shrink-0 gap-3">
                        <button
                          onClick={() => setSelectedGroup(null)}
                          className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                          <span>All Circles</span>
                        </button>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-900 text-indigo-400 border border-indigo-500/10">
                            {selectedGroup.category}
                          </span>
                          <span className="text-xs font-mono text-slate-400">{selectedGroup.membersCount} students</span>
                        </div>
                      </div>

                      {/* Group and Moderation Specs Grid */}
                      <div className="flex-1 flex flex-col md:flex-row gap-4 mt-3 overflow-hidden">
                        
                        {/* LEFT COLUMN: Sidebar specifications for active group */}
                        <div className="w-full md:w-64 bg-slate-950 rounded-2xl p-4 border border-slate-900 flex flex-col justify-between shrink-0 gap-4 overflow-y-auto">
                          <div>
                            <h3 className="font-display font-black text-white text-base leading-tight tracking-wide">{selectedGroup.name}</h3>
                            <p className="text-[11px] text-slate-400 mt-2.5 leading-relaxed">{selectedGroup.description}</p>

                            {/* PING live indicator to simulate activity */}
                            {selectedGroup.activeTrend && (
                              <div className="mt-4 p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-800/10 text-[10px] text-cyan-400 leading-snug flex items-start gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping shrink-0 mt-1" />
                                <span><strong>Trend:</strong> {selectedGroup.activeTrend}</span>
                              </div>
                            )}
                          </div>

                          {/* Role Sandbox Controller / Switcher */}
                          <div className="pt-4 border-t border-slate-900">
                            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                              <ShieldAlert className="w-3.5 h-3.5 text-cyan-404" />
                              <span>Set Simulation Role:</span>
                            </div>
                            
                            <div className="grid grid-cols-2 bg-slate-900/60 p-1 rounded-xl border border-slate-850">
                              <button
                                onClick={() => {
                                  setIsAdminMode(false);
                                  showToast("Role Swapped: Standard Student view. Moderation buttons are hidden.");
                                }}
                                className={`text-[10px] py-1.5 font-bold rounded-lg transition-all cursor-pointer ${
                                  !isAdminMode 
                                    ? 'bg-indigo-600 text-white shadow' 
                                    : 'text-slate-400 hover:text-white hover:bg-slate-905'
                                }`}
                              >
                                Student
                              </button>
                              <button
                                onClick={() => {
                                  setIsAdminMode(true);
                                  showToast("Role Swapped: Creator & Administrator role. Content filters & ban actions unlocked.");
                                }}
                                className={`text-[10px] py-1.5 font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                                  isAdminMode 
                                    ? 'bg-amber-500 text-slate-950 shadow' 
                                    : 'text-slate-400 hover:text-white hover:bg-slate-905'
                                }`}
                              >
                                <Crown className="w-3 h-3 fill-slate-950" />
                                <span>Admin</span>
                              </button>
                            </div>
                            <p className="text-[9px] text-slate-500 mt-2 leading-relaxed text-center">
                              {isAdminMode 
                                ? "👑 Moderation tools (delete / pin / ban) are unlocked." 
                                : "🔒 View-only status. You cannot moderate others' posts."
                              }
                            </p>
                          </div>
                        </div>

                        {/* RIGHT COLUMN: Active Feed Content / Rosters with tabs */}
                        <div className="flex-1 flex flex-col overflow-hidden bg-slate-955 border border-slate-900 rounded-2xl p-3 sm:p-4">
                          
                          {/* Inner Tabs selectors */}
                          <div className="flex items-center gap-2.5 border-b border-slate-900 pb-3 shrink-0">
                            <button
                              onClick={() => setActiveCircleTab('feed')}
                              className={`text-[11px] font-bold tracking-wide uppercase px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                                activeCircleTab === 'feed'
                                  ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20'
                                  : 'text-slate-500 border-transparent hover:text-slate-300'
                              }`}
                            >
                              💬 Circle Feed & Announcements
                            </button>
                            <button
                              onClick={() => {
                                setActiveCircleTab('members');
                                showToast(`Loaded peer list for circle: ${selectedGroup.name}`);
                              }}
                              className={`text-[11px] font-bold tracking-wide uppercase px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                                activeCircleTab === 'members'
                                  ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/20'
                                  : 'text-slate-500 border-transparent hover:text-slate-300'
                              }`}
                            >
                              👥 Member Roster & Security
                            </button>
                          </div>

                          {/* Sub-tab 1: Group Feed Dashboard */}
                          {activeCircleTab === 'feed' && (
                            <div className="flex-1 flex flex-col overflow-hidden pt-3">
                              
                              {/* PINNED ANNOUNCEMENT BOX - Sticky at top */}
                              {circlePosts.filter(p => p.groupId === selectedGroup.id && p.isPinned === true).length > 0 && (
                                <div className="mb-3.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 shrink-0">
                                  <div className="flex items-center justify-between gap-2 mb-1">
                                    <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-amber-400">
                                      <Pin className="w-3.5 h-3.5 fill-amber-400" />
                                      <span>Sticky Announcement Alert</span>
                                    </div>
                                    
                                    {isAdminMode && (
                                      <button
                                        onClick={() => {
                                          const pinnedArray = circlePosts.filter(p => p.groupId === selectedGroup.id && p.isPinned === true);
                                          if (pinnedArray.length > 0) {
                                            handlePinCirclePost(pinnedArray[0].id);
                                          }
                                        }}
                                        className="text-[9px] text-rose-450 font-bold hover:underline cursor-pointer"
                                      >
                                        Unpin Sticky Note
                                      </button>
                                    )}
                                  </div>
                                  <p className="leading-relaxed">
                                    {circlePosts.filter(p => p.groupId === selectedGroup.id && p.isPinned === true)[0].text}
                                  </p>
                                </div>
                              )}

                              {/* Compose and publish message form */}
                              <form onSubmit={handleAddCirclePost} className="mb-4 bg-slate-950 rounded-xl p-3 border border-slate-900 shrink-0">
                                <div className="flex items-start gap-3">
                                  <img 
                                    src={myAvatar} 
                                    className="w-8 h-8 rounded-full object-cover shrink-0 bg-slate-800"
                                    alt="You"
                                  />
                                  <div className="flex-1">
                                    <textarea
                                      rows={1}
                                      value={newPostText}
                                      onChange={e => setNewPostText(e.target.value)}
                                      placeholder={`Post something in ${selectedGroup.name}...`}
                                      className="w-full bg-transparent text-xs text-white placeholder-slate-500 border-none focus:outline-none focus:ring-0 resize-none py-1"
                                      required
                                    />
                                    
                                    <div className="flex items-center justify-between pt-2 border-t border-slate-900/60 mt-1">
                                      {/* Only render pinning option if client acts as moderator */}
                                      {isAdminMode ? (
                                        <label className="inline-flex items-center gap-1.5 text-[10px] text-amber-400 font-semibold select-none cursor-pointer">
                                          <input 
                                            type="checkbox" 
                                            checked={newPostPin}
                                            onChange={e => setNewPostPin(e.target.checked)}
                                            className="form-checkbox bg-slate-950 border-slate-800 text-amber-500 focus:ring-0 focus:ring-offset-0 rounded"
                                          />
                                          <Crown className="w-3 h-3 text-amber-500" />
                                          <span>Pin as Announcement</span>
                                        </label>
                                      ) : (
                                        <span className="text-[10px] text-slate-500">Alex Rivers (Member)</span>
                                      )}

                                      <button
                                        type="submit"
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg px-3 py-1.5 text-xs font-semibold select-line transition-colors cursor-pointer inline-flex items-center gap-1"
                                      >
                                        <span>Share</span>
                                        <Send className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </form>

                              {/* Group Posts Stack */}
                              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-1">
                                {circlePosts.filter(p => p.groupId === selectedGroup.id && p.isPinned !== true).map(post => {
                                  return (
                                    <div 
                                      key={post.id}
                                      className={`p-3.5 rounded-xl border transition-colors ${
                                        post.text.includes('🚨 CHEAP') 
                                          ? 'bg-rose-950/20 border-rose-550/25' 
                                          : 'bg-slate-950 border-slate-900 hover:border-slate-850'
                                      }`}
                                    >
                                      <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-2.5">
                                          <img 
                                            src={post.authorAvatar} 
                                            className="w-7 h-7 rounded-full object-cover shrink-0 bg-slate-800" 
                                            alt={post.authorName} 
                                          />
                                          <div>
                                            <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                              <span>{post.authorName}</span>
                                              
                                              {/* Staff role flags */}
                                              {(post.authorName.includes('Moderator') || post.authorName.includes('Creator') || post.authorName.includes('Admin')) && (
                                                <span className="text-[8px] bg-amber-500/10 text-amber-400 font-bold border border-amber-500/20 rounded px-1.5 uppercase tracking-wide">
                                                  Staff
                                                </span>
                                              )}
                                            </div>
                                            <span className="text-[9px] text-slate-500">{post.timestamp}</span>
                                          </div>
                                        </div>

                                        {/* MODERATOR TOOLS ON INDIVIDUAL POSTS */}
                                        {isAdminMode && (
                                          <div className="flex items-center gap-1.5 shrink-0">
                                            <button
                                              onClick={() => handlePinCirclePost(post.id)}
                                              className="p-1 px-1.5 bg-slate-900 border border-slate-800 rounded text-slate-400 hover:text-amber-400 hover:border-amber-500/20 transition-colors cursor-pointer"
                                              title="Toggle announcement status"
                                            >
                                              <Pin className="w-3 h-3" />
                                            </button>
                                            
                                            <button
                                              onClick={() => handleDeleteCirclePost(post.id, post.authorName)}
                                              className="p-1 px-1.5 bg-rose-950/30 border border-rose-900/45 rounded text-rose-400 hover:bg-rose-900/40 transition-colors cursor-pointer"
                                              title="Moderate/Delete post content"
                                            >
                                              <Trash2 className="w-3 h-3" />
                                            </button>
                                          </div>
                                        )}
                                      </div>

                                      <p className="text-xs text-slate-300 mt-2.5 leading-relaxed whitespace-pre-wrap">
                                        {post.text}
                                      </p>

                                      <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-slate-900/50 text-[10px] text-slate-500">
                                        <button 
                                          onClick={() => handleLikePost(post.id)}
                                          className="flex items-center gap-1 text-slate-500 hover:text-indigo-400 transition-colors cursor-pointer"
                                        >
                                          <ThumbsUp className="w-3 h-3" />
                                          <span>Likes ({post.likes})</span>
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}

                                {circlePosts.filter(p => p.groupId === selectedGroup.id && p.isPinned !== true).length === 0 && (
                                  <div className="py-12 text-center text-slate-500 text-xs">
                                    No posts in group feed yet. Speak up or list references to build community momentum!
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Sub-tab 2: Members lists & Security tools */}
                          {activeCircleTab === 'members' && (
                            <div className="flex-1 flex flex-col overflow-hidden pt-3">
                              
                              <div className="flex items-center justify-between bg-slate-950 p-2.5 border border-slate-900 rounded-xl mb-3.5 text-[10px] font-mono text-slate-400 shrink-0">
                                <span className="flex items-center gap-1">
                                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                                  <span>Active circular member registry</span>
                                </span>
                                <span className="text-right text-indigo-400">{circleMembers.filter(m => m.groupId === selectedGroup.id).length} Active Students</span>
                              </div>

                              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                                {circleMembers.filter(m => m.groupId === selectedGroup.id).map(member => (
                                  <div 
                                    key={member.id}
                                    className="p-3 bg-slate-950 border border-slate-900 rounded-xl flex items-center justify-between gap-3 hover:border-slate-850 transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      <img 
                                        src={member.avatar} 
                                        className="w-9 h-9 rounded-full object-cover shrink-0 bg-slate-800" 
                                        alt={member.name} 
                                      />
                                      <div>
                                        <div className="text-xs font-bold text-white flex items-center gap-1.5 flex-wrap">
                                          <span>{member.name}</span>
                                          <span className={`text-[8px] font-mono uppercase bg-slate-900 px-1.5 py-0.5 rounded border ${
                                            member.role === 'creator' 
                                              ? 'text-amber-400 border-amber-500/20 font-bold' 
                                              : member.role === 'admin' 
                                              ? 'text-indigo-300 border-indigo-400/20 font-bold' 
                                              : 'text-slate-500 border-slate-850'
                                          }`}>
                                            {member.role}
                                          </span>
                                        </div>
                                        <p className="text-[10px] text-slate-400 leading-snug line-clamp-1 mt-0.5">{member.bio}</p>
                                        <span className="text-[8px] text-slate-500 font-mono block mt-0.5">{member.joinDate}</span>
                                      </div>
                                    </div>

                                    {/* KICK/BAN MODERATION ACTION TOOLS */}
                                    {isAdminMode && member.role !== 'creator' && (
                                      <div className="flex items-center gap-1.5 shrink-0">
                                        <button
                                          onClick={() => handleKickCircleMember(member.id, member.name)}
                                          className="flex items-center gap-1 text-[10px] p-2 bg-slate-900 hover:bg-slate-800 hover:text-white text-slate-300 rounded-lg border border-slate-850 transition-colors cursor-pointer"
                                          title={`Kick ${member.name}`}
                                        >
                                          <UserX className="w-3.5 h-3.5 text-slate-400" />
                                          <span className="hidden sm:inline">Kick</span>
                                        </button>
                                        
                                        <button
                                          onClick={() => handleBanCircleMember(member.id, member.name)}
                                          className="flex items-center gap-1 text-[10px] p-2 bg-rose-950/20 hover:bg-rose-950/40 hover:text-rose-300 text-rose-400 rounded-lg border border-rose-900/40 transition-colors cursor-pointer font-bold"
                                          title={`Ban ${member.name}`}
                                        >
                                          <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                                          <span>Ban Account</span>
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                ))}

                                {circleMembers.filter(m => m.groupId === selectedGroup.id).length === 0 && (
                                  <div className="py-12 text-center text-slate-500 text-xs">
                                    This Circle has no active users left. Recruit classmates to begin studying!
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: Messenger Inbox */}
              {activeTab === 'chats' && (
                <div className="flex flex-1 h-full overflow-hidden divide-x divide-slate-950">
                  
                  {/* LEFT PANE: Directory of Inbox Threads */}
                  <div className={`flex flex-col h-full bg-slate-950 bg-opacity-40 shrink-0 ${
                    showMobileInbox ? 'w-full md:w-72' : 'hidden md:flex w-72'
                  }`}>
                    
                    {/* Filter contacts */}
                    <div className="p-3 border-b border-slate-950 bg-slate-950/40">
                      <div className="flex items-center justify-between mb-2 select-none">
                        <span className="text-[9px] tracking-wider uppercase font-mono font-bold text-slate-400">Direct Messages</span>
                        {socketConnected ? (
                          <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> Live Client
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-slate-500/10 text-slate-400 px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold">
                            Offline Sandbox
                          </span>
                        )}
                      </div>
                      
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search contacts..."
                          value={searchContactQuery}
                          onChange={e => setSearchContactQuery(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800/80 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 pl-8 transition-all"
                        />
                        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      </div>
                      
                      <div className="mt-2 text-[8px] text-slate-400 bg-indigo-500/10 border border-indigo-500/10 p-1.5 rounded-lg font-mono">
                        My Student Handle: <span className="text-indigo-300 font-bold">{myStudentNick}</span>
                      </div>
                    </div>

                    {/* Inbox listing */}
                    <div className="flex-1 overflow-y-auto divide-y divide-slate-950">
                      {Object.keys(threads)
                        .filter(name => name.toLowerCase().includes(searchContactQuery.toLowerCase()))
                        .map(name => {
                          const history = threads[name] || [];
                          const lastMsg = history[history.length - 1];
                          const isSelected = name === currentChatUser.name && !showMobileInbox;
                          
                          const contactAvatar = history[0]?.senderName === name 
                            ? history[0].senderAvatar 
                            : (name === 'Elena Rostova' 
                               ? 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120'
                               : name === 'Zoe Vance'
                               ? 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120'
                               : name === 'Marcus Miller'
                               ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120'
                               : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120');

                          const activeTyping = isTyping && typingContact === name;
                          const online = name === 'Elena Rostova' || name === 'Zoe Vance' || name.includes('_') || activeClients.includes(name);

                          return (
                            <button
                              key={name}
                              onClick={() => {
                                setCurrentChatUser({
                                  name,
                                  avatar: contactAvatar
                                });
                                setShowMobileInbox(false);
                                // Reset simulated unreads
                                setThreads(prev => ({
                                  ...prev,
                                  [name]: (prev[name] || []).map(m => m.direction === 'in' ? { ...m, status: 'read' as const } : m)
                                }));
                              }}
                              className={`w-full p-3 flex items-start gap-2.5 text-left border-l-2 hover:bg-slate-950/40 cursor-pointer transition-all ${
                                isSelected ? 'bg-indigo-600/10 border-indigo-500' : 'border-transparent'
                              }`}
                            >
                              <div className="relative shrink-0 mt-0.5">
                                <img src={contactAvatar} className="w-8 h-8 rounded-full object-cover bg-slate-850" alt={name} />
                                {online && (
                                  <span className="absolute -bottom-0.5 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse" style={{ animationDuration: '2s' }} />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="text-xs font-semibold text-white truncate">{name}</span>
                                    {online && (
                                      <span className="text-[9px] text-emerald-400 font-medium font-mono shrink-0">
                                        online
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[8px] text-slate-500 font-mono shrink-0">{lastMsg?.timestamp || ''}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                  {activeTyping ? (
                                    <span className="text-indigo-400 font-medium font-mono animate-pulse">typing...</span>
                                  ) : lastMsg ? (
                                    lastMsg.text
                                  ) : (
                                    'No messages yet'
                                  )}
                                </p>
                              </div>
                              {lastMsg && lastMsg.direction === 'in' && lastMsg.status !== 'read' && (
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 self-center shrink-0 ml-1.5 animate-pulse" />
                              )}
                            </button>
                          );
                        })}

                      {Object.keys(threads).length === 0 && (
                        <div className="py-12 px-4 text-center text-slate-500 text-xs">
                          No connected channels yet.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* RIGHT PANE: Message Thread Canvas */}
                  <div className={`flex-1 flex flex-col h-full overflow-hidden bg-slate-900/10 ${
                    showMobileInbox ? 'hidden' : 'flex'
                  }`}>
                    
                    {/* Active Header indicator */}
                    <div className="p-3 bg-slate-950 border-b border-slate-950 flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <button
                          onClick={() => setShowMobileInbox(true)}
                          className="md:hidden p-1.5 bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white rounded-lg border border-slate-800 transition-all cursor-pointer mr-1"
                          title="Back to inbox"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        
                        <div className="relative shrink-0">
                          <img 
                            src={currentChatUser.avatar} 
                            className="w-9 h-9 rounded-full object-cover bg-slate-800" 
                            alt={currentChatUser.name} 
                          />
                          {(currentChatUser.name === 'Elena Rostova' || currentChatUser.name === 'Zoe Vance' || currentChatUser.name.includes('_') || activeClients.includes(currentChatUser.name)) && (
                            <span className="absolute -bottom-0.5 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-950 rounded-full animate-pulse" style={{ animationDuration: '2s' }} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-white truncate">{currentChatUser.name}</div>
                          <div className="text-[9px] text-slate-500 font-mono flex items-center gap-1">
                            <span>
                              Status: {(currentChatUser.name === 'Elena Rostova' || currentChatUser.name === 'Zoe Vance' || currentChatUser.name.includes('_') || activeClients.includes(currentChatUser.name)) ? 'Online' : 'Offline'}
                            </span>
                            <span>•</span>
                            <span className="text-indigo-400">Response: 98%</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 bg-indigo-500/10 text-indigo-300 text-[10px] font-bold uppercase px-2 py-1 rounded-md border border-indigo-500/15">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Secure Konekt Link
                      </div>
                    </div>

                    {/* Message Bubbles list */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
                      {conversations.map(msg => (
                        <div 
                          key={msg.id}
                          className={`flex items-start gap-2 max-w-[85%] ${
                            msg.direction === 'out' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                          }`}
                        >
                          <img 
                            src={msg.senderAvatar} 
                            className="w-7 h-7 rounded-full object-cover bg-slate-800 shrink-0" 
                            alt={msg.senderName} 
                          />
                          
                          <div>
                            <div 
                              className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                                msg.direction === 'out'
                                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/10'
                                  : 'bg-slate-950 border border-slate-850 text-slate-100 rounded-tl-none'
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                            
                            {/* Read Receipt Tracker & Timer */}
                            {msg.direction === 'out' ? (
                              <div className="flex items-center gap-1.5 justify-end mt-1.5 text-[9px] font-mono select-none">
                                <span className="text-slate-500 font-medium">{msg.timestamp}</span>
                                <span className="text-slate-700/60 font-medium">•</span>
                                {msg.status === 'sending' && (
                                  <span className="inline-flex items-center gap-1 text-[8px] font-bold text-slate-400 bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded-full animate-pulse transition-all">
                                    <Clock className="w-2 h-2 animate-spin" />
                                    <span>SENDING</span>
                                  </span>
                                )}
                                {msg.status === 'sent' && (
                                  <span className="inline-flex items-center gap-1 text-[8px] font-bold text-slate-400 bg-slate-950/50 border border-slate-850 px-1.5 py-0.5 rounded-full transition-all">
                                    <Check className="w-2 h-2 text-slate-500" />
                                    <span>SENT</span>
                                  </span>
                                )}
                                {msg.status === 'delivered' && (
                                  <span className="inline-flex items-center gap-1 text-[8px] font-bold text-emerald-400 bg-emerald-950/30 border border-emerald-900/40 px-1.5 py-0.5 rounded-full transition-all">
                                    <CheckCheck className="w-2.5 h-2.5 text-emerald-400" />
                                    <span>DELIVERED</span>
                                  </span>
                                )}
                                {msg.status === 'read' && (
                                  <span className="inline-flex items-center gap-1 text-[8px] font-extrabold tracking-wider text-cyan-400 bg-cyan-950/30 border border-cyan-900/40 px-1.5 py-0.5 rounded-full transition-all" title={`Read at ${msg.readAt || msg.timestamp}`}>
                                    <CheckCheck className="w-2.5 h-2.5 text-cyan-400" />
                                    <span>READ</span>
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="block text-[9px] text-slate-500 mt-1 font-mono text-left select-none">
                                {msg.timestamp}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Typing state indicator code */}
                      {isTyping && typingContact === currentChatUser.name && (
                        <div className="flex items-center gap-2 max-w-[80%] mr-auto text-slate-500">
                          <img 
                            src={currentChatUser.avatar} 
                            className="w-6 h-6 rounded-full object-cover bg-slate-800" 
                            alt="Typing" 
                          />
                          <div className="bg-slate-950 border border-slate-850 px-3 py-1.5 rounded-2xl rounded-tl-none flex items-center max-w-sm gap-1 text-xs">
                            <span className="animate-bounce" style={{ animationDelay: '0ms' }}>•</span>
                            <span className="animate-bounce" style={{ animationDelay: '150ms' }}>•</span>
                            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>•</span>
                            <span className="text-[9px] font-medium text-slate-500 ml-1 font-mono">{currentChatUser.name} is typing...</span>
                          </div>
                        </div>
                      )}
                      
                      <div ref={chatBottomRef} />
                    </div>

                    {/* Interactive suggestions and writing triggers */}
                    <div className="p-2.5 bg-slate-950 border-t border-slate-950 shrink-0">
                      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none shrink-0 border-b border-slate-900/60 font-sans">
                        <span className="text-[9px] font-semibold font-mono text-slate-500 shrink-0 uppercase">Suggested replies:</span>
                        {[
                          `Is this available for close pick up today?`,
                          `Could we do structured tutoring this Friday?`,
                          `Let's coordinate a quick study spot at the hall.`
                        ].map((promptText, promptIdx) => (
                          <button
                            key={promptIdx}
                            onClick={() => sendChatMessage(promptText)}
                            className="text-[10px] font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-850 px-2.5 py-1.5 rounded-lg shrink-0 transition-all select-none duration-150 cursor-pointer"
                          >
                            "{promptText}"
                          </button>
                        ))}
                      </div>

                      {/* Message input elements */}
                      <form 
                        onSubmit={e => {
                          e.preventDefault();
                          sendChatMessage(chatInputValue);
                        }} 
                        className="flex items-center gap-2 mt-2"
                      >
                        <input
                          type="text"
                          placeholder={`Securely chat with ${currentChatUser.name}...`}
                          value={chatInputValue}
                          onChange={e => setChatInputValue(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                        <button
                          type="submit"
                          disabled={!chatInputValue.trim()}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl disabled:bg-slate-950 disabled:text-slate-600 disabled:cursor-default cursor-pointer transition-all active:scale-95 text-xs font-semibold"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MODAL 1: Post Marketplace Product */}
        <AnimatePresence>
          {showAddProductModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              {/* Back backdrop layout */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddProductModal(false)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
              />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl z-10"
              >
                <h3 className="font-display font-black text-xl text-white">List Your Student Product / Service</h3>
                <p className="text-slate-400 text-xs mt-1">Advertise on the secure Konekt sandbox to acquire initial user orders.</p>
                
                <form onSubmit={handleAddProduct} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-slate-400 font-bold mb-1">Product Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Personalized Dorm Nameplates"
                      value={newProduct.title}
                      onChange={e => setNewProduct({...newProduct, title: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-slate-400 font-bold mb-1">Price (USD)</label>
                      <input 
                        type="number" 
                        placeholder="25"
                        value={newProduct.price}
                        onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                        required
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-slate-400 font-bold mb-1">Category</label>
                      <select 
                        value={newProduct.category}
                        onChange={e => setNewProduct({...newProduct, category: e.target.value as any})}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="crafts">Crafts & Art</option>
                        <option value="tutoring">Tutoring</option>
                        <option value="tech">Tech & Support</option>
                        <option value="services">Services</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-slate-400 font-bold mb-1">Description / Meetup Specs</label>
                    <textarea 
                      placeholder="Detail what is included, lead times, and preferred delivery or pick up routes."
                      value={newProduct.description}
                      onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-sm text-white h-20 focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-slate-400 font-bold mb-1">Proximity (Miles)</label>
                      <input 
                        type="number" 
                        placeholder="0.2"
                        step="0.1"
                        min="0.1"
                        max="5.0"
                        value={newProduct.proximityMiles}
                        onChange={e => setNewProduct({...newProduct, proximityMiles: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-slate-400 font-bold mb-1">On-Campus Hub Spot</label>
                      <input 
                        type="text" 
                        placeholder="e.g., Student Union Plaza"
                        value={newProduct.locationName}
                        onChange={e => setNewProduct({...newProduct, locationName: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 p-2 rounded-xl bg-slate-950/60 border border-slate-850">
                    <label className="flex items-center gap-2 text-xs text-slate-300 font-medium select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newProduct.isCustomMade}
                        onChange={e => setNewProduct({...newProduct, isCustomMade: e.target.checked})}
                        className="form-checkbox bg-slate-900 border-slate-800 text-indigo-600 focus:ring-0 rounded"
                      />
                      <span>Handcrafted</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-300 font-medium select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newProduct.isDigital}
                        onChange={e => setNewProduct({...newProduct, isDigital: e.target.checked})}
                        className="form-checkbox bg-slate-900 border-slate-800 text-indigo-600 focus:ring-0 rounded"
                      />
                      <span>Digital Delivery</span>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setShowAddProductModal(false)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-xs font-bold"
                    >
                      Publish Product
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* MODAL 2: Upload Resource Notes */}
        <AnimatePresence>
          {showUploadModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowUploadModal(false)}
                className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" 
              />
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl z-10"
              >
                <h3 className="font-display font-black text-xl text-white">Share Academic File</h3>
                <p className="text-slate-400 text-xs mt-1">Contribute high-quality guidelines or reference sheets to gain peer credits.</p>
                
                <form onSubmit={handleUploadResource} className="space-y-4 mt-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono text-slate-400 font-bold mb-1">Document Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Organic Compounds Midterm Roadmap"
                      value={newDoc.title}
                      onChange={e => setNewDoc({...newDoc, title: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-slate-400 font-bold mb-1">Course Code</label>
                      <input 
                        type="text" 
                        placeholder="CHEM302"
                        value={newDoc.courseCode}
                        onChange={e => setNewDoc({...newDoc, courseCode: e.target.value})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm uppercase text-white focus:outline-none focus:border-indigo-500 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-mono text-slate-400 font-bold mb-1">Document Type</label>
                      <select 
                        value={newDoc.type}
                        onChange={e => setNewDoc({...newDoc, type: e.target.value as any})}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 transition-all"
                      >
                        <option value="cheatsheet">Cheatsheet</option>
                        <option value="exam-guide">Exam Prep Guide</option>
                        <option value="lecture-notes">Lecture Outlines</option>
                        <option value="study-guide">Reference Guide</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-mono text-slate-400 font-bold mb-1">Subject</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Chemistry"
                      value={newDoc.subject}
                      onChange={e => setNewDoc({...newDoc, subject: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>

                  {/* Drag and Drop simulated box */}
                  <div className="border border-dashed border-slate-800 rounded-2xl p-6 text-center bg-slate-950/80 hover:bg-slate-950 hover:border-slate-700 transition-colors">
                    <FolderOpen className="w-8 h-8 text-indigo-400 mx-auto" />
                    <p className="text-xs text-white mt-2 font-medium">Select lecture document or drag file</p>
                    <p className="text-[10px] text-slate-500 mt-1 font-mono">Accepts PDF, DOCX, ZIP files up to 10MB</p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => setShowUploadModal(false)}
                      className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2.5 rounded-xl text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-xs font-bold"
                    >
                      Upload & Share
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
