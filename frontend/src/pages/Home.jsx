import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Settings as SettingsIcon, LogOut, User as UserIcon, MessageSquare, Mic } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import VoiceRecorder from '../components/VoiceRecorder';
import { API_BASE_URL, SOCKET_URL } from '../config';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const socket = useRef(null);

  const API_URL = `${API_BASE_URL}/api`;

  useEffect(() => {
    // Personal room for refresh events
    socket.current = io(SOCKET_URL);
    socket.current.emit('join_personal', user._id);

    socket.current.on('refresh_conversations', () => {
        fetchConversations();
    });

    fetchConversations();
    return () => socket.current.disconnect();
  }, []);

  const fetchConversations = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/conversations`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setConversations(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchEmail) return;
    setIsSearching(true);
    setSearchResult(null);
    try {
      const { data } = await axios.get(`${API_URL}/users/search?email=${searchEmail}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setSearchResult(data);
    } catch (err) {
      alert('User not found or opt-out of search');
    } finally {
      setIsSearching(false);
    }
  };

  const startChat = async (targetUserId) => {
    try {
      const { data } = await axios.post(`${API_URL}/conversations`, { otherUserId: targetUserId }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      navigate(`/chat/${data._id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0d1117] text-white max-w-lg mx-auto border-x border-white/10 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-6 flex items-center justify-between glass-navbar">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 primary-gradient rounded-full flex items-center justify-center font-bold text-lg">
            {user.displayName?.[0] || 'S'}
          </div>
          <div>
            <h1 className="text-xl font-bold">Sevo</h1>
            <p className="text-xs text-white/50">Welcome back, {user.displayName}</p>
          </div>
        </div>
        <div className="flex gap-2">
            <button onClick={() => navigate('/settings')} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <SettingsIcon size={20} className="text-white/70" />
            </button>
            <button onClick={logout} className="p-2 hover:bg-red-500/10 rounded-full transition-colors group">
                <LogOut size={20} className="text-white/70 group-hover:text-red-400" />
            </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Search */}
        <div className="space-y-4">
            <form onSubmit={handleSearch} className="relative">
                <input 
                    type="text" 
                    placeholder="Find user by email..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:border-[#41D1FF] transition-colors"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                <button type="submit" hidden disabled={isSearching}>Search</button>
            </form>

            {searchResult && (
                <div 
                    onClick={() => startChat(searchResult._id)}
                    className="glass-card p-4 flex items-center justify-between cursor-pointer hover:bg-white/10 border-[#41D1FF]/30 animate-in fade-in slide-in-from-top-2"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                            <UserIcon size={20} />
                        </div>
                        <div>
                            <p className="font-semibold">{searchResult.displayName}</p>
                            <p className="text-xs text-white/40">{searchResult.email}</p>
                        </div>
                    </div>
                    <MessageSquare size={18} className="text-[#41D1FF]" />
                </div>
            )}
        </div>

        {/* Conversations List */}
        <div className="space-y-3">
            <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest px-1">Recent Chats</h3>
            {conversations.length === 0 ? (
                <div className="text-center py-10 opacity-30">
                    <Mic size={48} className="mx-auto mb-3" />
                    <p>No messages yet. Start a new chat!</p>
                </div>
            ) : (
                conversations.map(conv => {
                    const other = conv.userA._id === user._id ? conv.userB : conv.userA;
                    return (
                        <div 
                            key={conv._id} 
                            onClick={() => navigate(`/chat/${conv._id}`)}
                            className="glass-card p-4 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                                    <span className="font-bold text-lg text-white/80">{other.displayName?.[0] || '?'}</span>
                                </div>
                                <div>
                                    <p className="font-semibold">{other.displayName}</p>
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${conv.unplayedCount > 0 ? 'bg-[#41D1FF]' : 'bg-white/10'}`} />
                                        <p className={`text-xs ${conv.unplayedCount > 0 ? 'text-[#41D1FF]' : 'text-white/40'}`}>
                                            {conv.unplayedCount > 0 ? `${conv.unplayedCount} new message${conv.unplayedCount > 1 ? 's' : ''}` : 'All played'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-white/30">{new Date(conv.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</p>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
      </div>
    </div>
  );
};

export default Home;
