// Mock messages data for exhibition - fully editable JSON format
export const messagesData = {
  // Current user info
  currentUser: {
    id: "current_user",
    firstName: "You",
    lastName: "",
    username: "current_user",
    profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100",
    role: "learner"
  },

  // All users in the system
  users: {
    "mike_j": {
      id: "mike_j",
      firstName: "Mike",
      lastName: "Johnson",
      username: "mike_j",
      profilePicture: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&h=100",
      role: "employer",
      company: "TechCorp",
      bio: "Senior Hiring Manager at TechCorp. Looking for talented developers to join our team."
    },
    "dr_sarah": {
      id: "dr_sarah",
      firstName: "Dr. Sarah",
      lastName: "Anderson",
      username: "dr_sarah",
      profilePicture: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=100&h=100",
      role: "instructor",
      company: "University",
      bio: "Computer Science Professor specializing in AI and Machine Learning. 10+ years teaching experience."
    },
    "emily_r": {
      id: "emily_r",
      firstName: "Emily",
      lastName: "Rodriguez",
      username: "emily_r",
      profilePicture: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&h=100",
      role: "learner",
      company: "Student",
      bio: "Full-stack developer passionate about React and Node.js. Always eager to learn new technologies."
    },
    "alex_c": {
      id: "alex_c",
      firstName: "Alex",
      lastName: "Chen",
      username: "alex_c",
      profilePicture: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100",
      role: "employer",
      company: "FinTech Startup",
      bio: "CTO at innovative startup. Building the future of fintech."
    },
    "maria_g": {
      id: "maria_g",
      firstName: "Maria",
      lastName: "Garcia",
      username: "maria_g",
      profilePicture: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=100&h=100",
      role: "instructor",
      company: "Design Academy",
      bio: "UX/UI Design instructor and consultant. Helping designers create amazing user experiences."
    }
  },

  // All conversations - each conversation has messages between current user and another user
  conversations: {
    "mike_j": {
      lastMessageTime: Date.now() - 5 * 60 * 1000, // 5 minutes ago
      unreadCount: 1,
      messages: [
        {
          id: "m1",
          senderId: "mike_j",
          recipientId: "current_user",
          content: "Thanks for connecting! I've been following your work on GitHub.",
          timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
          isRead: true
        },
        {
          id: "m2",
          senderId: "current_user",
          recipientId: "mike_j",
          content: "Thank you! I really appreciate the feedback on my React projects.",
          timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000,
          isRead: true
        },
        {
          id: "m3",
          senderId: "mike_j",
          recipientId: "current_user",
          content: "We actually have an opening that might be perfect for you. Would you be interested in hearing more?",
          timestamp: Date.now() - 6 * 24 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "m4",
          senderId: "current_user",
          recipientId: "mike_j",
          content: "Absolutely! I'd love to learn more about the role and your team.",
          timestamp: Date.now() - 6 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "m5",
          senderId: "mike_j",
          recipientId: "current_user",
          content: "Great! I reviewed your application and I'm really impressed. Your portfolio shows exactly the kind of React expertise we need.",
          timestamp: Date.now() - 2 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "m6",
          senderId: "current_user",
          recipientId: "mike_j",
          content: "Thank you so much! I'm really excited about the opportunity to work at TechCorp.",
          timestamp: Date.now() - 2 * 60 * 60 * 1000 + 5 * 60 * 1000,
          isRead: true
        },
        {
          id: "m7",
          senderId: "mike_j",
          recipientId: "current_user",
          content: "Perfect! Let's schedule a technical interview. Are you available this Thursday at 2 PM?",
          timestamp: Date.now() - 1 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "m8",
          senderId: "current_user",
          recipientId: "mike_j",
          content: "Thursday at 2 PM works perfectly for me. Should I prepare anything specific?",
          timestamp: Date.now() - 30 * 60 * 1000,
          isRead: true
        },
        {
          id: "m9",
          senderId: "mike_j",
          recipientId: "current_user",
          content: "Just be ready to discuss your React projects and maybe do some live coding. Looking forward to it! 🚀",
          timestamp: Date.now() - 5 * 60 * 1000,
          isRead: false
        }
      ]
    },
    "dr_sarah": {
      lastMessageTime: Date.now() - 1 * 60 * 60 * 1000, // 1 hour ago
      unreadCount: 0,
      messages: [
        {
          id: "s1",
          senderId: "dr_sarah",
          recipientId: "current_user",
          content: "Welcome to Advanced Machine Learning! I'm excited to have you in the program.",
          timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "s2",
          senderId: "current_user",
          recipientId: "dr_sarah",
          content: "Thank you, Dr. Anderson! I'm really looking forward to diving deep into neural networks.",
          timestamp: Date.now() - 14 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "s3",
          senderId: "dr_sarah",
          recipientId: "current_user",
          content: "I noticed you have a strong background in mathematics. That will serve you well in this course.",
          timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "s4",
          senderId: "current_user",
          recipientId: "dr_sarah",
          content: "I've always loved the mathematical foundations. Your lectures on gradient descent were particularly enlightening!",
          timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "s5",
          senderId: "dr_sarah",
          recipientId: "current_user",
          content: "Excellent work on your Machine Learning assignment! Your approach to the neural network optimization was particularly innovative.",
          timestamp: Date.now() - 3 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "s6",
          senderId: "current_user",
          recipientId: "dr_sarah",
          content: "Thank you! I really enjoyed working on that project. The optimization techniques you taught were game-changing.",
          timestamp: Date.now() - 2 * 60 * 60 * 1000 + 30 * 60 * 1000,
          isRead: true
        },
        {
          id: "s7",
          senderId: "dr_sarah",
          recipientId: "current_user",
          content: "I'm glad you found it valuable. Have you considered applying for our advanced AI research program?",
          timestamp: Date.now() - 2 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "s8",
          senderId: "current_user",
          recipientId: "dr_sarah",
          content: "I'd definitely be interested! Could you tell me more about the application process?",
          timestamp: Date.now() - 1 * 60 * 60 * 1000,
          isRead: true
        }
      ]
    },
    "emily_r": {
      lastMessageTime: Date.now() - 4 * 60 * 60 * 1000 + 55 * 60 * 1000,
      unreadCount: 0,
      messages: [
        {
          id: "e1",
          senderId: "emily_r",
          recipientId: "current_user",
          content: "Hey! I saw we're both taking the same React course. Want to be study buddies?",
          timestamp: Date.now() - 21 * 24 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "e2",
          senderId: "current_user",
          recipientId: "emily_r",
          content: "That sounds great! I'd love to have someone to discuss the concepts with.",
          timestamp: Date.now() - 21 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "e3",
          senderId: "emily_r",
          recipientId: "current_user",
          content: "Perfect! How are you finding the hooks section? I'm still wrapping my head around useEffect.",
          timestamp: Date.now() - 18 * 24 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "e4",
          senderId: "current_user",
          recipientId: "emily_r",
          content: "useEffect can be tricky! The dependency array is key. Want to do a video call to go through it together?",
          timestamp: Date.now() - 18 * 24 * 60 * 60 * 1000 + 1 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "e5",
          senderId: "emily_r",
          recipientId: "current_user",
          content: "That call was so helpful! Thanks for explaining the cleanup functions.",
          timestamp: Date.now() - 15 * 24 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "e6",
          senderId: "emily_r",
          recipientId: "current_user",
          content: "I saw you completed the Advanced React course! How did you find the Redux section?",
          timestamp: Date.now() - 5 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "e7",
          senderId: "current_user",
          recipientId: "emily_r",
          content: "It was challenging but really rewarding! The state management patterns finally clicked for me.",
          timestamp: Date.now() - 4 * 60 * 60 * 1000 + 30 * 60 * 1000,
          isRead: true
        },
        {
          id: "e8",
          senderId: "emily_r",
          recipientId: "current_user",
          content: "That's awesome! I'm struggling with the async actions part. Any tips?",
          timestamp: Date.now() - 4 * 60 * 60 * 1000 + 45 * 60 * 1000,
          isRead: true
        },
        {
          id: "e9",
          senderId: "current_user",
          recipientId: "emily_r",
          content: "Sure! The key is understanding middleware like Redux Thunk. Want to pair program sometime?",
          timestamp: Date.now() - 4 * 60 * 60 * 1000 + 50 * 60 * 1000,
          isRead: true
        },
        {
          id: "e10",
          senderId: "emily_r",
          recipientId: "current_user",
          content: "That would be amazing! I'm free this weekend if you are.",
          timestamp: Date.now() - 4 * 60 * 60 * 1000 + 55 * 60 * 1000,
          isRead: true
        }
      ]
    },
    "alex_c": {
      lastMessageTime: Date.now() - 6 * 60 * 60 * 1000,
      unreadCount: 0,
      messages: [
        {
          id: "a1",
          senderId: "alex_c",
          recipientId: "current_user",
          content: "I saw your presentation at the React meetup last month. Really impressive work on performance optimization!",
          timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "a2",
          senderId: "current_user",
          recipientId: "alex_c",
          content: "Thank you! I'm glad you found it useful. Performance has always been a passion of mine.",
          timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "a3",
          senderId: "alex_c",
          recipientId: "current_user",
          content: "We should grab coffee sometime. I'd love to pick your brain about some scaling challenges we're facing.",
          timestamp: Date.now() - 25 * 24 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "a4",
          senderId: "current_user",
          recipientId: "alex_c",
          content: "I'd be happy to help! Scaling is always an interesting challenge.",
          timestamp: Date.now() - 25 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "a5",
          senderId: "alex_c",
          recipientId: "current_user",
          content: "Hey! I've been thinking about our conversation. We actually have an opening that might be perfect for someone with your skills.",
          timestamp: Date.now() - 7 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "a6",
          senderId: "current_user",
          recipientId: "alex_c",
          content: "Hi Alex! Thank you for thinking of me. I'd love to learn more about the opportunity.",
          timestamp: Date.now() - 6 * 60 * 60 * 1000 + 30 * 60 * 1000,
          isRead: true
        },
        {
          id: "a7",
          senderId: "alex_c",
          recipientId: "current_user",
          content: "We're building a revolutionary fintech platform. Think crypto meets traditional banking. Interested in disrupting the industry? 💰",
          timestamp: Date.now() - 6 * 60 * 60 * 1000,
          isRead: true
        }
      ]
    },
    "maria_g": {
      lastMessageTime: Date.now() - 8 * 60 * 60 * 1000,
      unreadCount: 0,
      messages: [
        {
          id: "ma1",
          senderId: "maria_g",
          recipientId: "current_user",
          content: "I saw your frontend work in the showcase. Your attention to detail is impressive!",
          timestamp: Date.now() - 45 * 24 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "ma2",
          senderId: "current_user",
          recipientId: "maria_g",
          content: "Thank you so much! I really try to focus on user experience in my projects.",
          timestamp: Date.now() - 45 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "ma3",
          senderId: "maria_g",
          recipientId: "current_user",
          content: "That's exactly the mindset we need more of in development! Have you considered formal UX training?",
          timestamp: Date.now() - 40 * 24 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "ma4",
          senderId: "current_user",
          recipientId: "maria_g",
          content: "I've been thinking about it! I feel like understanding design principles would make me a better developer.",
          timestamp: Date.now() - 40 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "ma5",
          senderId: "maria_g",
          recipientId: "current_user",
          content: "Absolutely! The best developers I know understand both sides. Let me know if you want any book recommendations.",
          timestamp: Date.now() - 35 * 24 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "ma6",
          senderId: "maria_g",
          recipientId: "current_user",
          content: "I noticed you're taking more frontend courses. Have you considered learning UX/UI design to complement your development skills?",
          timestamp: Date.now() - 9 * 60 * 60 * 1000,
          isRead: true
        },
        {
          id: "ma7",
          senderId: "current_user",
          recipientId: "maria_g",
          content: "Actually, yes! I've been thinking about it more since our last conversation. Design and development seem to go hand in hand.",
          timestamp: Date.now() - 8 * 60 * 60 * 1000 + 30 * 60 * 1000,
          isRead: true
        },
        {
          id: "ma8",
          senderId: "maria_g",
          recipientId: "current_user",
          content: "Absolutely! I'm starting a new course next month: 'Design Systems for Developers'. Perfect for someone with your background! ✨",
          timestamp: Date.now() - 8 * 60 * 60 * 1000,
          isRead: true
        }
      ]
    }
  }
};

// Helper functions to manipulate the data
export const addMessage = (conversationId, senderId, content) => {
  const conversation = messagesData.conversations[conversationId];
  if (!conversation) return;

  const newMessage = {
    id: `msg_${Date.now()}`,
    senderId,
    recipientId: senderId === "current_user" ? conversationId : "current_user",
    content,
    timestamp: Date.now(),
    isRead: senderId === "current_user"
  };

  conversation.messages.push(newMessage);
  conversation.lastMessageTime = Date.now();
  
  if (senderId !== "current_user") {
    conversation.unreadCount += 1;
  }
};

export const markAsRead = (conversationId) => {
  const conversation = messagesData.conversations[conversationId];
  if (!conversation) return;

  conversation.messages.forEach(msg => {
    if (msg.recipientId === "current_user") {
      msg.isRead = true;
    }
  });
  conversation.unreadCount = 0;
};

export const getConversationsList = () => {
  return Object.keys(messagesData.conversations)
    .map(userId => {
      const conversation = messagesData.conversations[userId];
      const user = messagesData.users[userId];
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      
      return {
        id: userId,
        otherUserId: userId,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        profilePicture: user.profilePicture,
        role: user.role,
        content: lastMessage.content,
        createdAt: new Date(lastMessage.timestamp).toISOString(),
        unreadCount: conversation.unreadCount,
        isRead: lastMessage.isRead
      };
    })
    .sort((a, b) => messagesData.conversations[b.id].lastMessageTime - messagesData.conversations[a.id].lastMessageTime);
};

export const getMessages = (conversationId) => {
  const conversation = messagesData.conversations[conversationId];
  if (!conversation) return [];

  return conversation.messages.map(msg => ({
    id: msg.id,
    senderId: msg.senderId,
    recipientId: msg.recipientId,
    content: msg.content,
    createdAt: new Date(msg.timestamp),
    isRead: msg.isRead
  }));
};