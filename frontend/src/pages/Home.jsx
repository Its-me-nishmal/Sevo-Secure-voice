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
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef(null);
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
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="pt-8 pb-4 px-6 flex items-center justify-between sticky top-0 bg-[#0d1117]/80 backdrop-blur-md z-20">
        <div>
          <h1 className="text-2xl font-black bg-clip-text text-transparent primary-gradient">Sevo</h1>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">Encrypted Voice</p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`flex items-center bg-white/5 border border-white/10 rounded-lg px-2 py-1 ${showSearch ? 'w-48 opacity-100' : 'w-0 opacity-0'} transition-none overflow-hidden`}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-xs w-full"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
            />
          </div>
          <button className="text-white/60 hover:text-white" onClick={() => {
            setShowSearch(!showSearch);
            if (!showSearch) setTimeout(() => searchInputRef.current?.focus(), 10);
          }}>
            <Search size={20} />
          </button>
          <button className="text-white/60 hover:text-white" onClick={() => setSearchResult(null)}>
            <MessageSquare size={20} />
          </button>
          <button
            onClick={() => navigate('/settings')}
            className="w-9 h-9 border border-white/10 rounded-full flex items-center justify-center p-[2px] transition-none active:scale-95"
          >
            <div className="w-full h-full primary-gradient rounded-full flex items-center justify-center font-bold text-xs">
              {user.displayName?.[0] || 'S'}
            </div>
          </button>
        </div>
      </div>

      {/* Hero / Action */}
      <div className="px-6 mb-6">
        <div className="glass-card p-5 relative overflow-hidden group">
          <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-[#41D1FF]/10 blur-2xl rounded-full" />
          <div className="relative z-10">
            <h2 className="text-lg font-bold mb-1">Encrypted Audio</h2>
            <p className="text-xs text-white/50 leading-relaxed">Your voice messages are encrypted end-to-end and expire automatically.</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 space-y-6 flex-1">
        {/* Search Results */}
        {searchResult && (
          <div>
            <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-widest px-1 mb-3">Search Result</h3>
            <div
              onClick={() => startChat(searchResult._id)}
              className="glass-card p-4 flex items-center justify-between cursor-pointer border-[#41D1FF]/20 bg-[#41D1FF]/5 hover:bg-[#41D1FF]/10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 primary-gradient rounded-full flex items-center justify-center">
                  <span className="font-bold">{searchResult.displayName[0]}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">{searchResult.displayName}</p>
                  <p className="text-[10px] text-white/30">{searchResult.email}</p>
                </div>
              </div>
              <div className="w-8 h-8 bg-[#41D1FF]/20 rounded-lg flex items-center justify-center">
                <MessageSquare size={16} className="text-[#41D1FF]" />
              </div>
            </div>
          </div>
        )}

        {/* Conversations List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Latest Conversations</h3>
            <span className="text-[10px] text-white/20">{conversations.length} total</span>
          </div>

          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-20 grayscale">
              <Mic size={56} strokeWidth={1} />
              <p className="mt-4 text-sm tracking-wide">Silence is golden...</p>
            </div>
          ) : (
            <div className="grid gap-3 pb-8">
              {conversations.map(conv => {
                const other = conv.userA._id === user._id ? conv.userB : conv.userA;
                return (
                  <div
                    key={conv._id}
                    onClick={() => navigate(`/chat/${conv._id}`)}
                    className="group flex items-center gap-4 p-4 glass-card hover:bg-white/10 active:opacity-80 cursor-pointer"
                  >
                    <div className="relative">
                      <div className="w-12 h-12 primary-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-black/20 overflow-hidden">
                        <span className="font-bold text-lg text-white drop-shadow-md">{other.displayName?.[0] || '?'}</span>
                      </div>
                      {conv.unplayedCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#41D1FF] rounded-full border-2 border-[#0d1117] flex items-center justify-center text-[10px] font-black text-[#0d1117]">
                          {conv.unplayedCount}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <p className="font-bold text-sm truncate">{other.displayName}</p>
                        <p className="text-[9px] text-white/20 font-medium">
                          {new Date(conv.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`text-[11px] truncate ${conv.unplayedCount > 0 ? 'text-[#41D1FF] font-medium' : 'text-white/40 font-normal'}`}>
                          {conv.unplayedCount > 0 ? `Incoming voice message` : 'Message played'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
