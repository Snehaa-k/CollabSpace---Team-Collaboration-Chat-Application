import React, { useState } from 'react';
import { Plus, Users, Send, X } from 'lucide-react';

export default function WelcomePage({ onRoomCreated, existingRooms = [], onRoomSelected }) {
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showInvitePersonal, setShowInvitePersonal] = useState(false);
  const [rooms, setRooms] = useState(existingRooms);

  const handleCreateRoom = (roomData) => {
    const newRoom = {
      id: rooms.length + 1,
      ...roomData,
      members: [roomData.creator, ...roomData.invitedUsers],
      createdAt: new Date().toISOString()
    };
    setRooms([...rooms, newRoom]);
    setShowCreateRoom(false);
    onRoomCreated(newRoom);
  };

  if (rooms.length > 0 || existingRooms.length > 0) {
    const allRooms = existingRooms.length > 0 ? existingRooms : rooms;
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Your Chat Rooms</h1>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCreateRoom(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                <span>Create Room</span>
              </button>
              <button
                onClick={() => setShowInvitePersonal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Send className="w-4 h-4" />
                <span>Invite People</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allRooms.map((room) => (
              <div key={room.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white font-semibold">
                    {room.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{room.name}</h3>
                    <p className="text-sm text-gray-500">{room.members.length} members</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{room.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {room.members.slice(0, 3).map((member, index) => (
                      <div key={index} className="w-8 h-8 bg-gray-400 rounded-full border-2 border-white flex items-center justify-center text-white text-xs">
                        {member.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    {room.members.length > 3 && (
                      <div className="w-8 h-8 bg-gray-300 rounded-full border-2 border-white flex items-center justify-center text-gray-600 text-xs">
                        +{room.members.length - 3}
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => onRoomSelected ? onRoomSelected(room) : onRoomCreated(room)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Enter Room
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showCreateRoom && (
          <CreateRoomModal 
            onClose={() => setShowCreateRoom(false)}
            onCreateRoom={handleCreateRoom}
          />
        )}
        
        {showInvitePersonal && (
          <InvitePersonalModal 
            onClose={() => setShowInvitePersonal(false)}
            onInviteSent={() => setShowInvitePersonal(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Users className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Welcome to CollabSpace!</h1>
        <p className="text-gray-600 mb-8">
          Get started by creating a chat room or inviting people directly to collaborate.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={() => setShowCreateRoom(true)}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Create Chat Room</span>
          </button>
          
          <button
            onClick={() => setShowInvitePersonal(true)}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Send className="w-5 h-5" />
            <span>Invite People Personally</span>
          </button>
        </div>
      </div>

      {showCreateRoom && (
        <CreateRoomModal 
          onClose={() => setShowCreateRoom(false)}
          onCreateRoom={handleCreateRoom}
        />
      )}
      
      {showInvitePersonal && (
        <InvitePersonalModal 
          onClose={() => setShowInvitePersonal(false)}
          onInviteSent={() => setShowInvitePersonal(false)}
        />
      )}
    </div>
  );
}

function CreateRoomModal({ onClose, onCreateRoom }) {
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
    
    onCreateRoom({
      name: formData.get('roomName'),
      description: formData.get('description'),
      creator: 'You',
      invitedUsers: validEmails
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Create Chat Room</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="roomName"
            type="text"
            placeholder="Room Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          
          <textarea
            name="description"
            placeholder="Room Description"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Send className="w-4 h-4 inline mr-2" />
              Create & Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InvitePersonalModal({ onClose, onInviteSent }) {
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
    const validEmails = inviteEmails.filter(email => email.trim());
    
    if (validEmails.length > 0) {
      // Simulate sending invites
      console.log('Sending personal invites to:', validEmails);
      onInviteSent();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Invite People Personally</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Send personal invitations to collaborate directly without creating a room.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
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
              className="text-purple-600 hover:text-purple-800 text-sm font-medium"
            >
              + Add another email
            </button>
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              <Send className="w-4 h-4 inline mr-2" />
              Send Invites
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}