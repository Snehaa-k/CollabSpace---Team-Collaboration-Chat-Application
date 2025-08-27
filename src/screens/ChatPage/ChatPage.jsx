import React, { useState } from 'react';
import { Send, Search, MoreVertical, Phone, Video, Settings, Users, Smile, Paperclip, Mic, Plus, CheckSquare, Calendar, User, X, Bell } from 'lucide-react';

const mockUsers = [
  { id: 1, name: 'Sarah Johnson', avatar: 'SJ', status: 'online', lastSeen: 'Active now', role: 'Product Manager' },
  { id: 2, name: 'Mike Chen', avatar: 'MC', status: 'online', lastSeen: 'Active now', role: 'Lead Developer' },
  { id: 3, name: 'Emily Davis', avatar: 'ED', status: 'away', lastSeen: '5 min ago', role: 'UI Designer' },
  { id: 4, name: 'Alex Rodriguez', avatar: 'AR', status: 'offline', lastSeen: '2 hours ago', role: 'Data Analyst' }
];

const getRoomConversations = (roomId) => {
  const conversations = {
    1: [ // Marketing Team
      {
        id: 1,
        type: 'group',
        name: 'Marketing Team',
        avatar: 'MT',
        lastMessage: 'Campaign analytics are showing positive trends',
        timestamp: '15 min ago',
        unread: 0,
        members: 8
      },
      {
        id: 2,
        type: 'direct',
        name: 'Sarah Johnson',
        avatar: 'SJ',
        lastMessage: 'The project proposal looks great!',
        timestamp: '2 min ago',
        unread: 2,
        status: 'online'
      }
    ],
    2: [ // Development Team
      {
        id: 3,
        type: 'group',
        name: 'Development Team',
        avatar: 'DT',
        lastMessage: 'Emily: New feature branch ready for testing',
        timestamp: '3 hours ago',
        unread: 1,
        members: 12
      },
      {
        id: 4,
        type: 'direct',
        name: 'Mike Chen',
        avatar: 'MC',
        lastMessage: 'Backend optimization completed',
        timestamp: '1 hour ago',
        unread: 0,
        status: 'online'
      }
    ]
  };
  return conversations[roomId] || [];
};

const mockMessages = [
  {
    id: 1,
    sender: 'Sarah Johnson',
    avatar: 'SJ',
    content: 'Hey! I just reviewed the project proposal you sent. The client requirements analysis is thorough and well-structured.',
    timestamp: '10:30 AM',
    isOwn: false
  },
  {
    id: 2,
    sender: 'You',
    avatar: 'You',
    content: 'Great! What do you think about the timeline and resource allocation?',
    timestamp: '10:32 AM',
    isOwn: true
  },
  {
    id: 3,
    sender: 'Sarah Johnson',
    avatar: 'SJ',
    content: 'Submit the final report by Friday and send it to the client. Make sure to include the updated budget breakdown and risk assessment.',
    timestamp: '10:35 AM',
    isOwn: false,
    isTask: true
  },
  {
    id: 4,
    sender: 'Mike Chen',
    avatar: 'MC',
    content: 'Can someone review the code changes before deployment? I\'ve implemented the new authentication system.',
    timestamp: '10:38 AM',
    isOwn: false,
    isTask: true
  }
];

const mockTasks = [
  {
    id: 1,
    title: 'Submit final report',
    description: 'Submit the final report by Friday and send it to the client',
    assignee: 'You',
    dueDate: '2025-01-10',
    status: 'pending',
    priority: 'high',
    isShared: true,
    chatId: 1
  },
  {
    id: 2,
    title: 'Code review',
    description: 'Review the code changes before deployment',
    assignee: 'Sarah Johnson',
    dueDate: '2025-01-08',
    status: 'in-progress',
    priority: 'medium',
    isShared: true,
    chatId: 2
  }
];

export default function ChatPage({ userRooms = [], onRoomCreated }) {
  const allConversations = userRooms.flatMap(room => getRoomConversations(room.id));
  const [selectedChat, setSelectedChat] = useState(allConversations[0] || null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [tasks, setTasks] = useState(mockTasks);
  const [showTasks, setShowTasks] = useState(false);
  const [hoveredMessage, setHoveredMessage] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'JD'
  });
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [privateChats, setPrivateChats] = useState([]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleCreateTask = (messageContent) => {
    setSelectedMessage(messageContent);
    setShowTaskModal(true);
  };

  const handleSaveTask = (taskData) => {
    const newTask = {
      id: tasks.length + 1,
      ...taskData,
      chatId: selectedChat?.id,
      createdBy: 'You'
    };
    setTasks([...tasks, newTask]);
    setShowTaskModal(false);
    setSelectedMessage(null);
  };

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleProfileUpdate = (profileData) => {
    setUserProfile(profileData);
    setShowProfile(false);
  };

  const handleLogout = () => {
    window.location.reload();
  };

  const handleMemberClick = (member) => {
    const existingChat = [...allConversations, ...privateChats].find(conv => 
      conv.type === 'direct' && conv.name === member
    );
    
    if (existingChat) {
      setSelectedChat(existingChat);
    } else {
      const privateChat = {
        id: Date.now(),
        type: 'direct',
        name: member,
        avatar: member.substring(0, 2).toUpperCase(),
        lastMessage: 'Start a conversation...',
        timestamp: 'now',
        unread: 0,
        status: 'online'
      };
      setPrivateChats([...privateChats, privateChat]);
      setSelectedChat(privateChat);
    }
    setShowMembers(false);
  };

  const handleInviteUser = (user) => {
    const existingChat = [...allConversations, ...privateChats].find(conv => 
      conv.type === 'direct' && conv.name === user.name
    );
    
    if (!existingChat) {
      const privateChat = {
        id: Date.now(),
        type: 'direct',
        name: user.name,
        avatar: user.avatar,
        lastMessage: 'Invited to chat',
        timestamp: 'now',
        unread: 0,
        status: user.status
      };
      setPrivateChats([...privateChats, privateChat]);
      setSelectedChat(privateChat);
    } else {
      setSelectedChat(existingChat);
    }
    setShowInvite(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'in-progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-orange-50 text-orange-700 border-orange-200';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-lg font-semibold text-gray-900">CollabSpace</h1>
                <p className="text-xs text-gray-500">All conversations</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <Bell className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setShowProfile(true)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {[...allConversations, ...privateChats].map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setSelectedChat(conversation)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedChat?.id === conversation.id ? 'bg-blue-50 border-r-3 border-r-blue-500' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {conversation.avatar}
                  </div>
                  {conversation.type === 'direct' && conversation.status === 'online' && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 truncate text-sm">
                      {conversation.name}
                      {conversation.type === 'group' && (
                        <span className="ml-1 text-xs text-gray-500 font-normal">({conversation.members})</span>
                      )}
                    </h3>
                    <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                </div>
                
                {conversation.unread > 0 && (
                  <div className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {conversation.unread}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      {selectedChat.avatar}
                    </div>
                    {selectedChat.type === 'direct' && selectedChat.status === 'online' && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedChat.name}</h2>
                    <p className="text-sm text-gray-500">
                      {selectedChat.type === 'direct' 
                        ? `${selectedChat.status === 'online' ? 'Active now' : selectedChat.status}` 
                        : `${selectedChat.members} members`
                      }
                    </p>
                  </div>
                </div>
            
            <div className="flex items-center space-x-1">
              <button 
                onClick={() => setShowTasks(!showTasks)}
                className={`p-2 rounded-lg transition-colors ${
                  showTasks 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CheckSquare className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <Video className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setShowMembers(true)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Users className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {mockMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                  onMouseEnter={() => setHoveredMessage(msg.id)}
                  onMouseLeave={() => setHoveredMessage(null)}
                >
                  <div className={`flex items-end space-x-2 max-w-lg ${msg.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {!msg.isOwn && (
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                        {msg.avatar}
                      </div>
                    )}
                    
                    <div className="relative group">
                      <div className={`px-4 py-2.5 rounded-lg ${
                        msg.isOwn 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-white border border-gray-200 text-gray-900'
                      } ${msg.isTask ? 'border-l-4 border-l-orange-400' : ''}`}>
                        {msg.isTask && (
                          <div className="flex items-center space-x-1 mb-1">
                            <CheckSquare className="w-3 h-3 text-orange-500" />
                            <span className="text-xs font-medium text-orange-600">Task</span>
                          </div>
                        )}
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <p className={`text-xs mt-1 ${msg.isOwn ? 'text-blue-200' : 'text-gray-500'}`}>
                          {msg.timestamp}
                        </p>
                      </div>
                      
                      {hoveredMessage === msg.id && (
                        <button
                          onClick={() => handleCreateTask(msg.content)}
                          className="absolute -top-2 -right-2 bg-blue-600 text-white p-1.5 rounded-full text-xs hover:bg-blue-700 transition-colors shadow-lg"
                          title="Create Task"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <div className="flex items-center space-x-3">
                <button type="button" className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20 text-sm"
                  />
                  <div className="absolute right-3 top-2.5 flex items-center space-x-1">
                    <button type="button" className="p-1 text-gray-400 hover:text-gray-600 rounded">
                      <Smile className="w-4 h-4" />
                    </button>
                    <button type="button" className="p-1 text-gray-400 hover:text-gray-600 rounded">
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No chat selected</h3>
              <p className="text-gray-500 mb-6">Choose a conversation from the sidebar or start a new one</p>
              <div className="space-y-2">
                <button
                  onClick={() => setShowCreateRoom(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mr-2"
                >
                  Create Room
                </button>
                <button
                  onClick={() => setShowInvite(true)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Invite People
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tasks Sidebar */}
      {showTasks && (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckSquare className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">Tasks</h3>
                {tasks.filter(task => task.chatId === selectedChat?.id && task.assignee === 'You').length > 0 && (
                  <div className="w-2 h-2 bg-red-500 rounded-full" title="You have assigned tasks"></div>
                )}
              </div>
              <button 
                onClick={() => setShowTasks(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {tasks.filter(task => task.chatId === selectedChat?.id).map((task) => (
              <div key={task.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-sm text-gray-900">{task.title}</h4>
                    {task.assignee === 'You' && (
                      <div className="w-2 h-2 bg-red-500 rounded-full" title="Assigned to you"></div>
                    )}
                  </div>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className={`px-2 py-1 text-xs rounded-full border-0 cursor-pointer font-medium ${
                      task.status === 'completed' ? 'bg-green-100 text-green-800' :
                      task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                      task.status === 'deadline-over' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="deadline-over">Deadline Over</option>
                  </select>
                </div>
                <p className="text-xs text-gray-600 mb-3 leading-relaxed">{task.description}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {task.assignee}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {task.dueDate}
                  </span>
                </div>
                {task.createdBy && task.createdBy !== 'You' && (
                  <div className="mt-2 text-xs text-gray-500">
                    Created by: {task.createdBy}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Profile Settings</h3>
              <button 
                onClick={() => setShowProfile(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleProfileUpdate({
                name: formData.get('name'),
                email: formData.get('email'),
                avatar: userProfile.avatar
              });
            }} className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-2">
                  {userProfile.avatar}
                </div>
                <button type="button" className="text-sm text-blue-600 hover:text-blue-800">
                  Change Avatar
                </button>
              </div>
              
              <input
                name="name"
                type="text"
                placeholder="Full Name"
                defaultValue={userProfile.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              />
              
              <input
                name="email"
                type="email"
                placeholder="Email Address"
                defaultValue={userProfile.email}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              />
              
              <input
                name="currentPassword"
                type="password"
                placeholder="Current Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              
              <input
                name="newPassword"
                type="password"
                placeholder="New Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              
              <input
                name="confirmPassword"
                type="password"
                placeholder="Confirm New Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowProfile(false);
                    setShowCreateRoom(true);
                  }}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  Create Chat Room
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowProfile(false);
                    setShowInvite(true);
                  }}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                >
                  Invite People to Chat
                </button>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                >
                  Logout
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Room Modal */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Create Chat Room</h3>
              <button 
                onClick={() => setShowCreateRoom(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <CreateRoomForm onClose={() => setShowCreateRoom(false)} onRoomCreated={onRoomCreated} />

          </div>
        </div>
      )}

      {/* Members Modal */}
      {showMembers && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Room Members</h3>
              <button 
                onClick={() => setShowMembers(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-3">
              {selectedChat?.type === 'group' && mockUsers.map((member, index) => (
                <div 
                  key={index}
                  onClick={() => member !== 'You' && handleMemberClick(member)}
                  className={`flex items-center space-x-3 p-3 rounded-lg ${
                    member === 'You' ? 'bg-gray-50' : 'hover:bg-blue-50 cursor-pointer'
                  }`}
                >
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-medium">
                    {member.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{member}</h4>
                    <p className="text-sm text-gray-500">
                      {member === 'You' ? 'You' : 'Click to message privately'}
                    </p>
                  </div>
                  {member === 'You' && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">You</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Invite People Modal */}
      {showInvite && (
        <InviteModal 
          onClose={() => setShowInvite(false)}
          onInviteUser={handleInviteUser}
          allConversations={allConversations}
          privateChats={privateChats}
          userRooms={userRooms}
        />
      )}

      {/* Task Creation Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create Task</h3>
              <button 
                onClick={() => setShowTaskModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <input
                name="title"
                type="text"
                placeholder="Task title"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              />
              
              <textarea
                name="description"
                placeholder="Description"
                defaultValue={selectedMessage}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-20 resize-none text-sm"
                required
              />
              
              <div className="grid grid-cols-2 gap-3">
                <select
                  name="assignee"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                >
                  <option value="">Assignee</option>
                  <option value="You">You</option>
                  {mockUsers.map(user => (
                    <option key={user.id} value={user.name}>{user.name}</option>
                  ))}
                </select>
                
                <select
                  name="priority"
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  required
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <input
                name="dueDate"
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                required
              />
              
              <label className="flex items-center space-x-2">
                <input
                  name="isShared"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Share with channel</span>
              </label>
              
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const title = document.querySelector('input[name="title"]')?.value;
                    const description = document.querySelector('textarea[name="description"]')?.value;
                    const assignee = document.querySelector('select[name="assignee"]')?.value;
                    const dueDate = document.querySelector('input[name="dueDate"]')?.value;
                    const priority = document.querySelector('select[name="priority"]')?.value;
                    const isShared = document.querySelector('input[name="isShared"]')?.checked;
                    
                    if (title && description && assignee && dueDate && priority) {
                      handleSaveTask({
                        title,
                        description,
                        assignee,
                        dueDate,
                        priority,
                        status: 'pending',
                        isShared
                      });
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Create Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CreateRoomForm({ onClose, onRoomCreated }) {
  const [inviteEmails, setInviteEmails] = useState(['']);

  const addEmailField = () => {
    setInviteEmails([...inviteEmails, '']);
  };

  const removeEmailField = (index) => {
    setInviteEmails(inviteEmails.filter((_, i) => i !== index));
  };

  const updateEmail = (index, value) => {
    const updated = [...inviteEmails];
    updated[index] = value;
    setInviteEmails(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const validEmails = inviteEmails.filter(email => email.trim());
    
    const newRoom = {
      id: Date.now(),
      name: formData.get('roomName'),
      description: formData.get('description'),
      members: ['You', ...validEmails]
    };
    onRoomCreated(newRoom);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="roomName"
        type="text"
        placeholder="Room Name"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        required
      />
      
      <textarea
        name="description"
        placeholder="Room Description"
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none text-sm"
        required
      />
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Invite People (Email addresses)
        </label>
        {inviteEmails.map((email, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <input
              type="email"
              value={email}
              onChange={(e) => updateEmail(index, e.target.value)}
              placeholder="Enter email address"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            {inviteEmails.length > 1 && (
              <button
                type="button"
                onClick={() => removeEmailField(index)}
                className="p-2 text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addEmailField}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          + Add another email
        </button>
      </div>
      
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          Create & Invite
        </button>
      </div>
    </form>
  );
}

function InviteModal({ onClose, onInviteUser, allConversations, privateChats, userRooms }) {
  const [inviteType, setInviteType] = useState('personal'); // 'personal' or 'room'
  const [selectedRoom, setSelectedRoom] = useState('');
  const [inviteEmails, setInviteEmails] = useState(['']);

  const addEmailField = () => {
    setInviteEmails([...inviteEmails, '']);
  };

  const removeEmailField = (index) => {
    setInviteEmails(inviteEmails.filter((_, i) => i !== index));
  };

  const updateEmail = (index, value) => {
    const updated = [...inviteEmails];
    updated[index] = value;
    setInviteEmails(updated);
  };

  const handleEmailInvite = (e) => {
    e.preventDefault();
    const validEmails = inviteEmails.filter(email => email.trim());
    
    if (validEmails.length > 0) {
      if (inviteType === 'room' && selectedRoom) {
        console.log(`Inviting ${validEmails.join(', ')} to room: ${selectedRoom}`);
      } else {
        console.log(`Sending personal invites to: ${validEmails.join(', ')}`);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Invite People</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mb-4">
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setInviteType('personal')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                inviteType === 'personal' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Personal Chat
            </button>
            <button
              onClick={() => setInviteType('room')}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                inviteType === 'room' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              To Room
            </button>
          </div>
        </div>

        {inviteType === 'personal' ? (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 mb-4">
              Invite people to start personal conversations
            </p>
            {mockUsers.map((user) => {
              const hasExistingChat = [...allConversations, ...privateChats].some(conv => 
                conv.type === 'direct' && conv.name === user.name
              );
              
              return (
                <div 
                  key={user.id}
                  onClick={() => onInviteUser(user)}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-50 cursor-pointer"
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white font-medium">
                      {user.avatar}
                    </div>
                    {user.status === 'online' && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{user.name}</h4>
                    <p className="text-sm text-gray-500">{user.role}</p>
                  </div>
                  <div className="text-right">
                    {hasExistingChat ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</span>
                    ) : (
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Invite</span>
                    )}
                  </div>
                </div>
              );
            })}
            
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Or invite by email:</p>
              <form onSubmit={handleEmailInvite} className="space-y-3">
                {inviteEmails.map((email, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => updateEmail(index, e.target.value)}
                      placeholder="Enter email address"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    />
                    {inviteEmails.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeEmailField(index)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addEmailField}
                  className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                >
                  + Add another email
                </button>
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                >
                  Send Invites
                </button>
              </form>
            </div>
          </div>
        ) : (
          <form onSubmit={handleEmailInvite} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Room
              </label>
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                required
              >
                <option value="">Choose a room...</option>
                {userRooms.map((room) => (
                  <option key={room.id} value={room.name}>{room.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email addresses
              </label>
              {inviteEmails.map((email, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => updateEmail(index, e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    required
                  />
                  {inviteEmails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEmailField(index)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addEmailField}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Add another email
              </button>
            </div>
            
            <button
              type="submit"
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Invite to Room
            </button>
          </form>
        )}
      </div>
    </div>
  );
}