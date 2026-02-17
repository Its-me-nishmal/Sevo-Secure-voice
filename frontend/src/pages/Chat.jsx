import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Trash2, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import VoiceRecorder from '../components/VoiceRecorder';
import VoicePlayer from '../components/VoicePlayer';

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const socket = useRef(null);
  const scrollRef = useRef(null);

  const API_URL = 'http://localhost:5000/api';

  useEffect(() => {
    // Initialize Socket
    socket.current = io('http://localhost:5000');
    socket.current.emit('join_conversation', id);

    socket.current.on('new_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.current.on('message_played', ({ messageId }) => {
        setMessages(prev => prev.map(m => m._id === messageId ? { ...m, played: true } : m));
    });

    // Fetch Messages & Conversation Info
    fetchMessages();

    return () => socket.current.disconnect();
  }, [id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/messages/conversation/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMessages(data);
      
      // Rough way to get other user name from messages or list
      // In a real app, the conversation object would have this
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendVoice = async (blob, duration) => {
      const formData = new FormData();
      formData.append('voice', blob);
      formData.append('conversationId', id);
      formData.append('durationSeconds', duration);
      formData.append('expiryHours', 3); // Default

      try {
           await axios.post(`${API_URL}/messages/upload`, formData, {
              headers: { 
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${user.token}` 
              }
          });
          // Message will be received via socket
      } catch (err) {
          console.error("Upload failed", err);
      }
  };

  const markPlayed = async (messageId) => {
      try {
          await axios.put(`${API_URL}/messages/${messageId}/played`, {}, {
              headers: { Authorization: `Bearer ${user.token}` }
          });
      } catch (err) {
          console.error(err);
      }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0d1117] text-white overflow-hidden max-w-lg mx-auto border-x border-white/10 shadow-2xl">
      {/* Header */}
      <div className="p-4 flex items-center justify-between glass-navbar z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-white/10 rounded-full">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="font-semibold">Chat</h2>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Encrypted</p>
          </div>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-full">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === user._id;
          return (
            <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[85%] space-y-1">
                <VoicePlayer 
                    audioUrl={`${API_URL}/messages/${msg._id}/file`} 
                    duration={msg.durationSeconds}
                    onPlay={() => !isMe && !msg.played && markPlayed(msg._id)}
                />
                <div className={`flex items-center gap-2 px-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[10px] text-white/40">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.played && (
                        <span className="text-[10px] text-[#41D1FF] font-medium italic">Played</span>
                    )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gradient-to-t from-[#0d1117] to-transparent">
        <VoiceRecorder onSend={handleSendVoice} />
        <p className="text-center text-[10px] text-white/30 mt-3 flex items-center justify-center gap-1">
            <ShieldAlert size={12} /> Messages expire in 3 hours
        </p>
      </div>
    </div>
  );
};

export default Chat;
