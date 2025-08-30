import React, { useState, useEffect } from 'react';
import { Send, Search, MoreVertical, Phone, Video, Settings, Users, Smile, Paperclip, X, Bell, Edit, UserPlus, UserMinus, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { createRoom, fetchRooms, deleteRoom } from '../../store/api/chatApi';
import { logout } from '../../store/slices/authSlice';

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
  }
];

export default function ChatPage({ onLogout }) {
  const dispatch = useDispatch();
  const { rooms = [], loading } = useSelector((state) => state.chat);
  const { user } = useSelector((state) => state.auth);


  // UI State
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [showProfile, setShowProfile] = useState(false);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showEditRoom, setShowEditRoom] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  
  console.log(rooms , "rooms");

  // Convert rooms to conversation format
  const roomConversations = rooms.map(room => ({
    id: room.id,
    type: 'group',
    name: room.name,
    avatar: room.name.substring(0, 2).toUpperCase(),
    lastMessage: room.description || 'Room created',
    timestamp: room.created_at
      ? new Date(room.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '',
    unread: 0,
    members: room.members?.length || 1,
    isOwner: room.created_by === user?.id,
    membersList: room.members || [],
    description: room.description
  }));

  useEffect(() => {
    if (user) {
      dispatch(fetchRooms());
    }
  }, [dispatch, user]);

  // Set initial selected chat when rooms are loaded
  useEffect(() => {
    if (roomConversations.length > 0 && !selectedChat) {
      setSelectedChat(roomConversations[0]);
    }
  }, [roomConversations, selectedChat]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      console.log('Sending message:', message);
      // TODO: Implement actual message sending
      setMessage('');
    }
  };

  const handleRoomCreated = async (roomData) => {
    try {
      await dispatch(createRoom(roomData)).unwrap();
      dispatch(fetchRooms());
      setShowCreateRoom(false);
    } catch (error) {
      console.error('Error creating room:', error);
    }
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setShowEditRoom(true);
  };

  const handleRoomUpdated = async (updatedRoomData) => {
    try {
      // TODO: Implement room update API call
      console.log('Updating room:', updatedRoomData);
      dispatch(fetchRooms());
      setShowEditRoom(false);
      setEditingRoom(null);
    } catch (error) {
      console.error('Error updating room:', error);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      try {
        await dispatch(deleteRoom(roomId)).unwrap();
        if (selectedChat?.id === roomId) {
          setSelectedChat(null);
        }
      } catch (error) {
        console.error('Error deleting room:', error);
      }
    }
  };



  const handleLogout = () => {
    dispatch(logout());
    onLogout();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading rooms...</p>
        </div>
      </div>
    );
  }

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
          
          <div className="space-y-3">
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
            
            <button 
              onClick={() => setShowCreateRoom(true)}
              className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Create Room</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {roomConversations
            .filter(conversation => 
              conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-colors hover:bg-gray-50 relative group ${
                selectedChat?.id === conversation.id ? 'bg-blue-50 border-r-3 border-r-blue-500' : ''
              }`}
            >
              <div 
                onClick={() => setSelectedChat(conversation)}
                className="flex items-center space-x-3"
              >
                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {conversation.avatar}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-gray-900 truncate text-sm">
                      {conversation.name}
                      <span className="ml-1 text-xs text-gray-500 font-normal">({conversation.members})</span>
                      {conversation.isOwner && (
                        <span className="ml-1 text-xs bg-green-100 text-green-800 px-1 rounded">Owner</span>
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
              
              {/* Action buttons for room owners */}
              {conversation.isOwner && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="flex items-center space-x-1 bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditRoom(conversation);
                      }}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-150"
                      title="Edit room"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-gray-200"></div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRoom(conversation.id);
                      }}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150"
                      title="Delete room"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))}
          
          {roomConversations.length === 0 && (
            <div className="p-4 text-center text-gray-500">
              <p>No rooms available</p>
              <button
                onClick={() => setShowCreateRoom(true)}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
              >
                Create your first room
              </button>
            </div>
          )}
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
                  <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {selectedChat.avatar}
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{selectedChat.name}</h2>
                    <p className="text-sm text-gray-500">{selectedChat.members} members</p>
                  </div>
                </div>
            
                <div className="flex items-center space-x-1">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                    <Phone className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                    <Video className="w-5 h-5" />
                  </button>
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                    <Users className="w-5 h-5" />
                  </button>
                  {selectedChat.isOwner && (
                    <button 
                      onClick={() => handleEditRoom(selectedChat)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                      title="Edit room"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                  )}
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
                >
                  <div className={`flex items-end space-x-2 max-w-lg ${msg.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {!msg.isOwn && (
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                        {msg.avatar}
                      </div>
                    )}
                    
                    <div className={`px-4 py-2.5 rounded-lg ${
                      msg.isOwn 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.isOwn ? 'text-blue-200' : 'text-gray-500'}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="bg-white border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                <button type="button" className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Paperclip className="w-5 h-5" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20 text-sm"
                  />
                  <div className="absolute right-3 top-2.5 flex items-center space-x-1">
                    <button type="button" className="p-1 text-gray-400 hover:text-gray-600 rounded">
                      <Smile className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
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
              <button
                onClick={() => setShowCreateRoom(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Room
              </button>
            </div>
          </div>
        )}
      </div>

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
            
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-2">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <h4 className="font-semibold text-gray-900">{user?.name || 'User'}</h4>
                <p className="text-sm text-gray-500">{user?.email || 'user@example.com'}</p>
              </div>
              
              <button
                onClick={() => {
                  setShowProfile(false);
                  setShowCreateRoom(true);
                }}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center justify-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>Create Chat Room</span>
              </button>
              

              
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
              >
                Logout
              </button>
            </div>
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
            
            <CreateRoomForm onClose={() => setShowCreateRoom(false)} onRoomCreated={handleRoomCreated} />
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {showEditRoom && editingRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Edit Room</h3>
              <button 
                onClick={() => {
                  setShowEditRoom(false);
                  setEditingRoom(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <EditRoomForm 
              room={editingRoom} 
              onClose={() => {
                setShowEditRoom(false);
                setEditingRoom(null);
              }} 
              onRoomUpdated={handleRoomUpdated} 
            />
          </div>
        </div>
      )}


    </div>
  );
}

function CreateRoomForm({ onClose, onRoomCreated }) {
  const [inviteEmails, setInviteEmails] = useState(['']);
  const [loading, setLoading] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const validEmails = inviteEmails.filter(email => email.trim());
    
    const roomData = {
      name: formData.get('roomName'),
      description: formData.get('description'),
      invitedUsers: validEmails
    };
    
    try {
      await onRoomCreated(roomData);
    } catch (error) {
      console.error('Failed to create room:', error);
    } finally {
      setLoading(false);
    }
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
          disabled={loading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
        >
          {loading ? 'Creating...' : 'Create & Invite'}
        </button>
      </div>
    </form>
  );
}

function EditRoomForm({ room, onClose, onRoomUpdated }) {
  const [roomName, setRoomName] = useState(room.name);
  const [description, setDescription] = useState(room.description || '');
  const [currentMembers, setCurrentMembers] = useState(room.membersList || []);
  const [newInviteEmails, setNewInviteEmails] = useState(['']);
  const [loading, setLoading] = useState(false);

  const addEmailField = () => {
    setNewInviteEmails([...newInviteEmails, '']);
  };

  const removeEmailField = (index) => {
    setNewInviteEmails(newInviteEmails.filter((_, i) => i !== index));
  };

  const updateEmail = (index, value) => {
    const updated = [...newInviteEmails];
    updated[index] = value;
    setNewInviteEmails(updated);
  };

  const removeMember = (memberToRemove) => {
    setCurrentMembers(currentMembers.filter(member => member.id !== memberToRemove.id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const validEmails = newInviteEmails.filter(email => email.trim());
    
    const updatedRoomData = {
      id: room.id,
      name: roomName,
      description,
      currentMembers,
      newInvites: validEmails
    };
    
    try {
      await onRoomUpdated(updatedRoomData);
    } catch (error) {
      console.error('Failed to update room:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Room Details */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Room Details</h4>
        <input
          type="text"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder="Room Name"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          required
        />
        
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Room Description"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none text-sm"
        />
      </div>

      {/* Current Members */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Current Members ({currentMembers.length})</h4>
        <div className="max-h-32 overflow-y-auto space-y-2">
          {currentMembers.map((member, index) => (
            <div key={member.id || index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs">
                  {member.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <span className="text-sm text-gray-900">{member.name || member.email}</span>
                {member.isOwner && (
                  <span className="text-xs bg-green-100 text-green-800 px-1 rounded">Owner</span>
                )}
              </div>
              {!member.isOwner && (
                <button
                  type="button"
                  onClick={() => removeMember(member)}
                  className="p-1 text-red-600 hover:text-red-800"
                  title="Remove member"
                >
                  <UserMinus className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Invite New Members */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Invite New Members</h4>
        {newInviteEmails.map((email, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="email"
              value={email}
              onChange={(e) => updateEmail(index, e.target.value)}
              placeholder="Enter email address"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            {newInviteEmails.length > 1 && (
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
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add another email</span>
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
          disabled={loading}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
        >
          {loading ? 'Updating...' : 'Update Room'}
        </button>
      </div>
    </form>
  );
}

