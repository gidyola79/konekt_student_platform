export interface ResourceItem {
  id: string;
  title: string;
  type: 'cheatsheet' | 'exam-guide' | 'lecture-notes' | 'study-guide';
  subject: string;
  courseCode: string;
  uploaderName: string;
  uploaderAvatar: string;
  fileFormat: string;
  downloadsCount: number;
  rating: number;
  dateAdded: string;
}

export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  sellerName: string;
  sellerAvatar: string;
  category: 'services' | 'digital' | 'tutoring' | 'crafts' | 'tech';
  rating: number;
  likes: number;
  imageUrl: string;
  isCustomService?: boolean;
  proximityMiles?: number;   // Distance in miles from student center (e.g., 0.1 to 3.0)
  isCustomMade?: boolean;     // Handcrafted/customized by students
  isDigital?: boolean;        // Digital notes/code/pdf download
  locationName?: string;     // Specific campus location names (e.g. "Student Union", "Engineering Quad")
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  category: 'academic' | 'social' | 'hobby' | 'career';
  iconName: string;
  activeTrend?: string;
  isModerator?: boolean; // True if current user created or manages this group
}

export interface CirclePost {
  id: string;
  groupId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  timestamp: string;
  isPinned?: boolean;
  likes: number;
}

export interface CircleMember {
  id: string;
  groupId: string;
  name: string;
  avatar: string;
  role: 'creator' | 'admin' | 'member';
  bio: string;
  joinDate: string;
}

export interface DirectMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  direction: 'in' | 'out';
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  readAt?: string;
}

export interface UserProfile {
  name: string;
  avatar: string;
  bio: string;
  major: string;
  year: string;
  university: string;
}

export interface AppNotification {
  id: string;
  type: 'message' | 'marketplace' | 'group' | 'resource';
  title: string;
  body: string;
  timestamp: string; // e.g., 'Just now', '5m ago'
  isRead: boolean;
  avatar?: string;
  linkId?: string; // e.g., thread name or group ID/tab to navigate if clicked
}
