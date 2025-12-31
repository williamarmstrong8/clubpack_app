// Mock data for the application

export const USER = {
  id: 'u1',
  name: 'Alex Morgan',
  username: '@alexm',
  bio: 'Product Designer & Developer. Building digital experiences.',
  location: 'San Francisco, CA',
  joinedDate: 'September 2023',
  streakCount: 12,
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  stats: {
    posts: 42,
    followers: 890,
    following: 120,
    saved: 56
  }
};

export const HOME_FEED = [
  {
    id: 'f1',
    title: 'New Design System Launch',
    subtitle: 'Announcing our comprehensive UI kit v2.0',
    tag: 'Design',
    status: 'New',
    timestamp: '2h ago',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800',
    likes: 124,
    comments: 18
  },
  {
    id: 'f2',
    title: 'Quarterly Review',
    subtitle: 'Analyzing Q3 performance metrics',
    tag: 'Business',
    status: 'Trending',
    timestamp: '5h ago',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    likes: 89,
    comments: 12
  },
  {
    id: 'f3',
    title: 'Mobile Architecture',
    subtitle: 'Best practices for scalable React Native apps',
    tag: 'Dev',
    status: 'Popular',
    timestamp: '1d ago',
    imageUrl: 'https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&q=80&w=800',
    likes: 256,
    comments: 45
  },
  {
    id: 'f4',
    title: 'Remote Work Culture',
    subtitle: 'How to build connection in distributed teams',
    tag: 'Culture',
    status: 'Fresh',
    timestamp: '1d ago',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
    likes: 134,
    comments: 23
  }
];

export const FEATURES_LIST = [
  {
    id: 'feat1',
    name: 'Animated Cards',
    description: 'Smooth interactions and elevation changes on press.',
    icon: 'Layers',
    category: 'Components'
  },
  {
    id: 'feat2',
    name: 'Bottom Sheets',
    description: 'Draggable modal presentations for contextual actions.',
    icon: 'PanelBottom',
    category: 'Overlays'
  },
  {
    id: 'feat3',
    name: 'Interactive Charts',
    description: 'Visualizing data with animated paths and tooltips.',
    icon: 'PieChart',
    category: 'Data'
  },
  {
    id: 'feat4',
    name: 'Form Elements',
    description: 'Polished inputs, toggles, and sliders with validation.',
    icon: 'Type',
    category: 'Input'
  },
  {
    id: 'feat5',
    name: 'List Transitions',
    description: 'Staggered animations when loading new content.',
    icon: 'List',
    category: 'Animation'
  },
  {
    id: 'feat6',
    name: 'Dark Mode',
    description: 'First-class support for system themes.',
    icon: 'Moon',
    category: 'Theme'
  },
  {
    id: 'feat7',
    name: 'Haptic Feedback',
    description: 'Subtle vibrations for tactile interactions.',
    icon: 'Smartphone',
    category: 'Hardware'
  },
  {
    id: 'feat8',
    name: 'Settings Layout',
    description: 'Standardized grouping for configuration screens.',
    icon: 'Settings',
    category: 'Layout'
  }
];

export const DATA_METRICS = {
  kpi: [
    { id: 'k1', label: 'Total Revenue', value: '$42,593', change: '+12.5%', trend: 'up' },
    { id: 'k2', label: 'Active Users', value: '1,294', change: '+5.2%', trend: 'up' },
    { id: 'k3', label: 'Bounce Rate', value: '24.8%', change: '-2.1%', trend: 'down' }, // down is good for bounce rate but visual logic usually green=up
    { id: 'k4', label: 'Avg. Session', value: '4m 32s', change: '+0.8%', trend: 'neutral' }
  ],
  chartData: [
    { label: 'Mon', value: 45 },
    { label: 'Tue', value: 52 },
    { label: 'Wed', value: 38 },
    { label: 'Thu', value: 65 },
    { label: 'Fri', value: 48 },
    { label: 'Sat', value: 59 },
    { label: 'Sun', value: 62 }
  ],
  table: [
    { id: 't1', name: 'Project Alpha', status: 'Completed', date: 'Oct 24', budget: '$12k' },
    { id: 't2', name: 'Website Redesign', status: 'In Progress', date: 'Nov 02', budget: '$8.5k' },
    { id: 't3', name: 'Mobile App', status: 'In Progress', date: 'Nov 15', budget: '$24k' },
    { id: 't4', name: 'Marketing Campaign', status: 'Pending', date: 'Dec 01', budget: '$5k' },
    { id: 't5', name: 'Q4 Report', status: 'Review', date: 'Dec 05', budget: '$1.2k' },
    { id: 't6', name: 'Database Migration', status: 'Completed', date: 'Oct 12', budget: '$4k' },
    { id: 't7', name: 'User Research', status: 'In Progress', date: 'Nov 20', budget: '$6k' },
    { id: 't8', name: 'Logo Design', status: 'Pending', date: 'Dec 10', budget: '$2k' }
  ],
  insights: [
    { id: 'i1', title: 'Traffic Spike', description: '24% increase in traffic on weekends.', type: 'positive' },
    { id: 'i2', title: 'Retention Alert', description: 'User retention dropped by 3% last week.', type: 'negative' },
    { id: 'i3', title: 'Goal Reached', description: 'Q4 revenue target achieved ahead of schedule.', type: 'positive' }
  ]
};

export const NOTIFICATIONS = [
  { id: 'n1', title: 'New follower', body: 'Sarah Jenkins started following you', time: '2m ago', read: false, type: 'user' },
  { id: 'n2', title: 'System Update', body: 'Version 2.0 is now available', time: '1h ago', read: false, type: 'system' },
  { id: 'n3', title: 'Project Invite', body: 'You were added to "Mobile Redesign"', time: '3h ago', read: true, type: 'work' },
  { id: 'n4', title: 'Daily Summary', body: 'Your daily stats are ready to view', time: '1d ago', read: true, type: 'system' },
  { id: 'n5', title: 'Security Alert', body: 'New login detected from Mac OS', time: '2d ago', read: true, type: 'security' }
];
