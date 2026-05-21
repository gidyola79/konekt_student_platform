import { ResourceItem, MarketplaceItem, CommunityGroup, DirectMessage } from './types';

export const mockResources: ResourceItem[] = [
  {
    id: 'res-1',
    title: 'Calculus II Integration Techniques Summary Sheet',
    type: 'cheatsheet',
    subject: 'Mathematics',
    courseCode: 'MATH202',
    uploaderName: 'Sarah Jenkins',
    uploaderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    fileFormat: 'PDF',
    downloadsCount: 342,
    rating: 4.9,
    dateAdded: '2 days ago'
  },
  {
    id: 'res-2',
    title: 'Python Core Algorithms & Big-O Quick Cheat Sheet',
    type: 'cheatsheet',
    subject: 'Computer Science',
    courseCode: 'CS101',
    uploaderName: 'David Chen',
    uploaderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    fileFormat: 'PDF',
    downloadsCount: 512,
    rating: 5.0,
    dateAdded: '1 week ago'
  },
  {
    id: 'res-3',
    title: 'Organic Chemistry II Carbonyl Reaction Maps',
    type: 'study-guide',
    subject: 'Chemistry',
    courseCode: 'CHEM302',
    uploaderName: 'Elena Rostova',
    uploaderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
    fileFormat: 'PDF',
    downloadsCount: 198,
    rating: 4.8,
    dateAdded: '3 days ago'
  },
  {
    id: 'res-4',
    title: 'Intro to Macroeconomics Formulas & Core Graphs',
    type: 'exam-guide',
    subject: 'Economics',
    courseCode: 'ECON101',
    uploaderName: 'Liam O’Connor',
    uploaderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    fileFormat: 'ZIP',
    downloadsCount: 227,
    rating: 4.7,
    dateAdded: '5 days ago'
  },
  {
    id: 'res-5',
    title: 'Cognitive Science PSYCH204 Guided Lecture Notes',
    type: 'lecture-notes',
    subject: 'Psychology',
    courseCode: 'PSYCH204',
    uploaderName: 'Aisha Patel',
    uploaderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    fileFormat: 'DOCX',
    downloadsCount: 89,
    rating: 4.6,
    dateAdded: 'Yesterday'
  }
];

export const mockMarketplace: MarketplaceItem[] = [
  {
    id: 'market-1',
    title: 'Custom Dorm Neon LED Glow Signs',
    description: 'Custom handcrafted neon-like LED signboards. Safe low voltage, ultra-light layout, multiple colors available. Fits any dorm wall hook!',
    price: 49,
    sellerName: 'Marcus Miller (Junior, MechEng)',
    sellerAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120',
    category: 'crafts',
    rating: 4.9,
    likes: 84,
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=400',
    proximityMiles: 0.2,
    isCustomMade: true,
    isDigital: false,
    locationName: 'North Dorms Quad'
  },
  {
    id: 'market-2',
    title: '1-on-1 Fullstack React/Node.js Tutors',
    description: 'Struggling with web dev assignments or your side project? I provide customized, patient, 1-on-1 tutoring sessions on React, Git, deployment, and backend routing.',
    price: 30,
    sellerName: 'Zoe Vance (Senior, CS)',
    sellerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=120',
    category: 'tutoring',
    rating: 5.0,
    likes: 112,
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=400',
    isCustomService: true,
    proximityMiles: 0.8,
    isCustomMade: false,
    isDigital: true,
    locationName: 'CS Commons / Zoom'
  },
  {
    id: 'market-3',
    title: 'Custom Crochet Beanies & Mini Animals',
    description: 'Cute, soft crochet beanies, keychains, and study buddy plushies! Handcrafted over weekends with high quality yarn. Perfect for gifting.',
    price: 18,
    sellerName: 'Hana Sato (Sophomore, Arts)',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    category: 'crafts',
    rating: 4.8,
    likes: 47,
    imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&q=80&w=400',
    proximityMiles: 0.4,
    isCustomMade: true,
    isDigital: false,
    locationName: 'Student Union Plaza'
  },
  {
    id: 'market-4',
    title: 'Academic Proofreading & Essay Structure Review',
    description: 'Literature graduate student offering quick structural proofreads, citation edits (APA/Harvard/Chicago), and academic tone checks. Delivery under 24 hours!',
    price: 25,
    sellerName: 'James Henderson (Grad student)',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    category: 'services',
    rating: 4.9,
    likes: 93,
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=400',
    isCustomService: true,
    proximityMiles: 0.1,
    isCustomMade: false,
    isDigital: true,
    locationName: 'Library Quad Area'
  },
  {
    id: 'market-5',
    title: 'Dorm Room Coding Desk Setup Optimization',
    description: 'I will consult on and install perfect dual monitor mounts, implement hidden cable management strategies, and program customized lighting controls for your dorm workstation.',
    price: 35,
    sellerName: 'Ethan Wright (Junior, EE)',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    category: 'tech',
    rating: 4.7,
    likes: 31,
    imageUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=400',
    proximityMiles: 1.5,
    isCustomMade: true,
    isDigital: false,
    locationName: 'Engineering Quad'
  }
];

export const mockGroups: CommunityGroup[] = [
  {
    id: 'g-1',
    name: 'CS 220 Data Structures Core Study',
    description: 'For students tackling pointer operations, hash maps, BST structures, and algorithmic puzzle-solving. Weekly sample test teardowns.',
    membersCount: 128,
    category: 'academic',
    iconName: 'Code',
    activeTrend: 'Prepping for midterm review tomorrow'
  },
  {
    id: 'g-2',
    name: 'Campus Entrepreneurs & Innovators Network',
    description: 'Bringing together programmers, designers, and business minds. Pitch brainstorm sessions, team formations, and startup resources sharing.',
    membersCount: 94,
    category: 'career',
    iconName: 'Briefcase',
    activeTrend: 'Discussing local incubator grant details'
  },
  {
    id: 'g-3',
    name: 'North Campus Sunset Runners',
    description: 'A friendly group joggers meeting at the library steps every Tuesday & Saturday at 6:30 PM. 5-7k routes, always ending with drinks or ice cream.',
    membersCount: 204,
    category: 'social',
    iconName: 'Zap',
    activeTrend: 'Saturday park run mapped'
  },
  {
    id: 'g-4',
    name: 'Analog Audio & Indie Record Swap',
    description: 'For vinyl collectors, acoustic songwriters, and chord jam veterans coordinating dorm basement sessions and open-mic nights.',
    membersCount: 45,
    category: 'hobby',
    iconName: 'Music',
    activeTrend: 'Open mic signup spreadsheet shared'
  }
];

export const initialMockConversation: DirectMessage[] = [
  {
    id: 'msg-1',
    senderName: 'Elena Rostova',
    senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
    text: "Hi there! I saw you're selling the crochet turtle plushies on the Konekt Market. Are they still available?",
    timestamp: '2:15 PM',
    direction: 'in'
  },
  {
    id: 'msg-2',
    senderName: 'You',
    senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
    text: "Yes, they are! I make them every Saturday. I have one pink turtle and one mint-green turtle left in stock.",
    timestamp: '2:18 PM',
    direction: 'out'
  },
  {
    id: 'msg-3',
    senderName: 'Elena Rostova',
    senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
    text: "Oh fantastic, the mint-green one sounds perfect! Can I purchase it and pick it up near the Student Union building tomorrow?",
    timestamp: '2:20 PM',
    direction: 'in'
  }
];
