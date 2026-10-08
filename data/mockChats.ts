export const mockConversations = [
  {
    id: '1',
    name: 'Mary Johnson',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    lastMessage: 'I\'ll be there at 10:00 AM tomorrow',
    lastMessageTime: '2025-08-24T14:30:00',
    unreadCount: 2,
    isOnline: true
  },
  {
    id: '2',
    name: 'Mike Chen',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    lastMessage: 'Do you need me to bring any specific tools?',
    lastMessageTime: '2025-08-24T10:15:00',
    unreadCount: 0,
    isOnline: false
  },
  {
    id: '3',
    name: 'Alex Turner',
    avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    lastMessage: 'Your car looks great now! Thanks for the review',
    lastMessageTime: '2025-08-23T16:45:00',
    unreadCount: 0,
    isOnline: true
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    lastMessage: 'Remember to do those exercises we discussed',
    lastMessageTime: '2025-08-22T09:30:00',
    unreadCount: 1,
    isOnline: false
  },
  {
    id: '5',
    name: 'Sophie Lee',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    lastMessage: 'I can pick up your laundry on Thursday',
    lastMessageTime: '2025-08-21T11:20:00',
    unreadCount: 0,
    isOnline: true
  }
];

export const mockMessages = [
  {
    id: '1',
    conversationId: '1',
    senderId: 'provider',
    text: 'Hi there! I\'m confirming our house cleaning appointment for tomorrow at 10:00 AM',
    timestamp: '2025-08-24T14:15:00',
    read: true
  },
  {
    id: '2',
    conversationId: '1',
    senderId: 'user',
    text: 'Yes, that works perfectly. Will you bring your own cleaning supplies?',
    timestamp: '2025-08-24T14:20:00',
    read: true
  },
  {
    id: '3',
    conversationId: '1',
    senderId: 'provider',
    text: 'Yes, I\'ll bring everything needed. Do you have any specific areas you want me to focus on?',
    timestamp: '2025-08-24T14:25:00',
    read: true
  },
  {
    id: '4',
    conversationId: '1',
    senderId: 'provider',
    text: 'I\'ll be there at 10:00 AM tomorrow',
    timestamp: '2025-08-24T14:30:00',
    read: false
  }
];