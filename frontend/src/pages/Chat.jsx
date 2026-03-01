import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, MoreVerticalIcon, ShieldAlertIcon } from '../components/Icons';
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
    fetchConversationInfo();
    fetchMessages();

    return () => socket.current.disconnect();
  }, [id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  const fetchConversationInfo = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/conversations/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setOtherUser(data.userA._id === user._id ? data.userB : data.userA);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/messages/conversation/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setMessages(data);
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
      <div className="pt-8 pb-4 px-4 flex items-center justify-between sticky top-0 bg-[var(--color-bg-base)]/80 backdrop-blur-2xl z-30 border-b border-white/5 shadow-sm">
        <div className="flex items-center gap-1">
          <button onClick={() => navigate('/')} className="w-10 h-10 -ml-2 text-white/60 hover:text-white rounded-full flex items-center justify-center hover:bg-white/10 transition-colors active:scale-95">
            <ArrowLeftIcon size={22} className="ml-1" />
          </button>
          <div className="flex items-center gap-3 ml-1">
            <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center font-black text-white shadow-[0_0_15px_rgba(65,209,255,0.2)] border border-[var(--color-bg-base)]">
              {otherUser?.displayName?.[0]?.toUpperCase() || 'C'}
            </div>
            <div>
              <h2 className="font-bold text-[15px] leading-tight text-white mb-0.5 tracking-wide">{otherUser?.displayName || 'Secure Chat'}</h2>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full animate-pulse shadow-[0_0_8px_rgba(65,209,255,0.8)]" />
                <p className="text-[10px] text-[var(--color-primary)] uppercase tracking-widest font-bold">End-to-End</p>
              </div>
            </div>
          </div>
        </div>
        <button className="w-10 h-10 text-white/40 hover:text-white rounded-full flex items-center justify-center hover:bg-white/10 transition-colors">
          <MoreVerticalIcon size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-36 relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[80%] h-[30%] bg-[var(--color-primary)]/5 blur-[100px] rounded-full pointer-events-none" />

        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-10 relative group">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-primary)]/5 to-transparent blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
            <div className="w-20 h-20 rounded-full bg-[var(--color-bg-base)] border border-white/5 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,0,0,0.5)] z-10 group-hover:border-[var(--color-primary)]/20 transition-all">
              <ShieldAlertIcon size={32} className="text-[var(--color-primary)]/30 group-hover:text-[var(--color-primary)]/50 transition-colors" />
            </div>
            <p className="text-xs leading-relaxed uppercase tracking-[0.2em] font-bold text-white/30 z-10 w-full max-w-[250px]">This conversation is encrypted and will vanish shortly.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const isMe = msg.senderId === user._id;
            return (
              <div key={msg._id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
                <div className={`max-w-[85%] space-y-1.5 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                  <VoicePlayer
                    audioUrl={`${API_URL}/messages/${msg._id}/file`}
                    duration={msg.durationSeconds}
                    onPlay={() => !isMe && !msg.played && markPlayed(msg._id)}
                  />
                  <div className={`flex items-center gap-2 px-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[10px] text-white/30 font-medium tracking-wide">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    {msg.played && (
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-[var(--color-primary)] rounded-full shadow-[0_0_5px_rgba(65,209,255,0.8)]" />
                        <span className="text-[9px] text-[var(--color-primary)] font-black uppercase tracking-widest bg-[var(--color-primary)]/10 px-1.5 py-0.5 rounded-sm">Played</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={scrollRef} className="h-1" />
      </div>

      {/* Floating Input Area */}
      <div className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] left-0 right-0 z-40 px-4 w-full max-w-screen-md mx-auto">
        <VoiceRecorder onSend={handleSendVoice} />
        <p className="text-center text-[9px] text-white/30 mt-3 flex items-center justify-center gap-1.5 font-bold tracking-[0.2em] bg-[var(--color-bg-base)]/50 backdrop-blur-md py-1 rounded-full w-max mx-auto px-4 border border-white/5">
          <ShieldAlertIcon size={12} className="text-[var(--color-secondary)] opacity-80" /> AUTO-DESTRUCTS IN 3 HOURS
        </p>
      </div>
    </div>
  );
};

export default Chat;
