import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, MessageIcon, SettingsIcon, MicIcon } from '../components/Icons';
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
      <div className="pt-8 pb-4 px-6 flex items-center justify-between sticky top-0 bg-[var(--color-bg-base)]/80 backdrop-blur-2xl z-20 border-b border-white/5">
        <div>
          <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] tracking-tight">Sevo</h1>
          <p className="text-[10px] text-[var(--color-primary)] uppercase tracking-[0.25em] font-bold opacity-80 mt-0.5">Encrypted Voice</p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center bg-[var(--color-surface)] border border-white/10 rounded-full px-3 py-1.5 ${showSearch ? 'w-56 opacity-100 shadow-[0_0_15px_rgba(65,209,255,0.1)]' : 'w-0 opacity-0'} transition-all duration-300 overflow-hidden`}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Find by email..."
              className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-white/30"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
            />
          </div>
          <button className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--color-surface-glass)] border border-white/5 text-white/70 hover:text-white hover:bg-white/10 transition-all active:scale-95" onClick={() => {
            setShowSearch(!showSearch);
            if (!showSearch) setTimeout(() => searchInputRef.current?.focus(), 50);
          }}>
            <SearchIcon size={18} />
          </button>

          <button
            onClick={() => navigate('/settings')}
            className="w-10 h-10 border-[1.5px] border-[var(--color-primary)]/40 rounded-full flex items-center justify-center p-[2px] transition-all hover:border-[var(--color-primary)] hover:scale-105 active:scale-95 shadow-[0_0_10px_rgba(65,209,255,0.2)]"
          >
            <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full flex items-center justify-center font-black text-sm text-white shadow-inner">
              {user.displayName?.[0]?.toUpperCase() || 'S'}
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
          <div className="animate-in slide-in-from-top-4 fade-in duration-300">
            <div className="flex items-center justify-between px-1 mb-3">
              <h3 className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-widest">Search Result</h3>
              <button onClick={() => setSearchResult(null)} className="text-[10px] text-white/40 hover:text-white uppercase tracking-wider">Clear</button>
            </div>
            <div
              onClick={() => startChat(searchResult._id)}
              className="glass-card p-4 flex items-center justify-between cursor-pointer border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 hover:bg-[var(--color-primary)]/10 hover:shadow-[0_4px_20px_rgba(65,209,255,0.1)] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform">
                  <span className="font-bold text-white text-lg">{searchResult.displayName[0]?.toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-bold text-base text-white">{searchResult.displayName}</p>
                  <p className="text-xs text-white/50">{searchResult.email}</p>
                </div>
              </div>
              <div className="w-10 h-10 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center group-hover:bg-[var(--color-primary)]/20 transition-colors">
                <MessageIcon size={20} className="text-[var(--color-primary)] group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </div>
        )}

        {/* Conversations List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Latest Conversations</h3>
            <span className="text-[10px] font-medium text-[var(--color-primary)] bg-[var(--color-primary)]/10 px-2 py-0.5 rounded-full">{conversations.length} total</span>
          </div>

          {conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-white/20 relative group">
              <div className="absolute inset-0 bg-[var(--color-secondary)]/5 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
              <MicIcon size={64} className="mb-6 opacity-30 transform group-hover:scale-110 transition-all duration-700" />
              <p className="mt-4 text-[13px] tracking-[0.2em] uppercase font-bold text-white/30">Silence is golden...</p>
              <p className="mt-2 text-xs text-white/20 max-w-[200px] text-center">Search for an email above to start a secure voice chat.</p>
            </div>
          ) : (
            <div className="grid gap-3 pb-8">
              {conversations.map(conv => {
                const other = conv.userA._id === user._id ? conv.userB : conv.userA;
                return (
                  <div
                    key={conv._id}
                    onClick={() => navigate(`/chat/${conv._id}`)}
                    className="group flex items-center gap-4 p-4 glass-card hover:bg-white/5 active:scale-[0.98] transition-all cursor-pointer border border-white/5 hover:border-[var(--color-primary)]/30"
                  >
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-tr from-[var(--color-surface)] to-[var(--color-bg-base)] border border-white/10 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden group-hover:border-[var(--color-primary)]/50 transition-colors">
                        <span className="font-bold text-xl text-white/80 group-hover:text-[var(--color-primary)] transition-colors">{other.displayName?.[0]?.toUpperCase() || '?'}</span>
                      </div>
                      {conv.unplayedCount > 0 && (
                        <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full border-[3px] border-[var(--color-bg-base)] flex items-center justify-center text-[10px] font-black text-white shadow-[0_0_10px_rgba(65,209,255,0.5)] animate-pulse-slow">
                          {conv.unplayedCount}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-bold text-[15px] truncate text-white">{other.displayName}</p>
                        <p className="text-[10px] text-white/30 font-semibold tracking-wide">
                          {new Date(conv.updatedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {conv.unplayedCount > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse"></span>
                            <span className="text-[12px] text-[var(--color-primary)] font-semibold truncate">Incoming voice message</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <MicIcon size={12} className="text-white/20" />
                            <span className="text-[12px] text-white/30 font-medium truncate">Message played</span>
                          </div>
                        )}
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
