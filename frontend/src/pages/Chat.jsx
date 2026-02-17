import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Trash2, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import VoiceRecorder from '../components/VoiceRecorder';
import VoicePlayer from '../components/VoicePlayer';
import { API_BASE_URL, SOCKET_URL } from '../config';

const Chat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const socket = useRef(null);
  const scrollRef = useRef(null);

  const API_URL = `${API_BASE_URL}/api`;

  useEffect(() => {
    // Initialize Socket
    socket.current = io(SOCKET_URL);
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
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="pt-8 pb-4 px-4 flex items-center justify-between glass-navbar sticky top-0 z-30">
        <div className="flex items-center gap-1">
          <button onClick={() => navigate('/')} className="p-2 -ml-2 text-white/60 hover:text-white transition-colors">
            <ArrowLeft size={22} />
          </button>
          <div className="flex items-center gap-3 ml-2">
            <div className="w-10 h-10 primary-gradient rounded-xl flex items-center justify-center font-bold text-shadow">
              C
            </div>
            <div>
              <h2 className="font-bold text-sm leading-none mb-1">Secure Chat</h2>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-[#41D1FF] rounded-full animate-pulse" />
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">End-to-End</p>
              </div>
            </div>
          </div>
        </div>
        <button className="p-2 text-white/40 hover:text-white transition-colors">
          <MoreVertical size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scroll-smooth pb-32">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20 text-center px-10">
            <ShieldAlert size={48} strokeWidth={1} className="mb-4" />
            <p className="text-xs leading-relaxed uppercase tracking-widest font-bold">This conversation is encrypted and will vanish shortly.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === user._id;
            return (
              <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <div className={`max-w-[90%] space-y-1 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  <VoicePlayer
                    audioUrl={`${API_URL}/messages/${msg._id}/file`}
                    duration={msg.durationSeconds}
                    onPlay={() => !isMe && !msg.played && markPlayed(msg._id)}
                  />
                  <div className={`flex items-center gap-2 px-1 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[9px] text-white/30 font-medium">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.played && (
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-1 bg-[#41D1FF] rounded-full" />
                        <span className="text-[9px] text-[#41D1FF] font-bold uppercase tracking-tighter italic">Played</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef} />
      </div>

      {/* Floating Input Area */}
      <div className="absolute bottom-4 left-3 right-3 z-40">
        <div className="glass-card shadow-2xl p-2 bg-[#0d1117]/40 backdrop-blur-xl border-white/5">
          <VoiceRecorder onSend={handleSendVoice} />
        </div>
        <p className="text-center text-[9px] text-white/20 mt-3 flex items-center justify-center gap-1.5 font-medium tracking-wide">
          <ShieldAlert size={10} className="text-[#BD34FE]" /> AUTO-DESTRUCTS IN 3 HOURS
        </p>
      </div>
    </div>
  );
};

export default Chat;
