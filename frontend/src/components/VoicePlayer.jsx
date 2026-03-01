import { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon, LoaderIcon } from './Icons';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const VoicePlayer = ({ audioUrl, duration, onPlay }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [blobUrl, setBlobUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = useRef(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchAudio = async () => {
            if (!audioUrl || !user?.token) return;
            setIsLoading(true);
            try {
                const response = await axios.get(audioUrl, {
                    headers: { Authorization: `Bearer ${user.token}` },
                    responseType: 'blob'
                });
                const url = URL.createObjectURL(response.data);
                setBlobUrl(url);
            } catch (err) {
                console.error("Failed to fetch audio:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAudio();

        return () => {
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
            }
        };
    }, [audioUrl, user?.token]);

    const togglePlay = () => {
        if (!blobUrl) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
            if (onPlay) onPlay();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
            setProgress(currentProgress);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
    };

    return (
        <div className="flex items-center gap-3 p-2.5 pr-4 glass-card bg-[var(--color-surface)]/40 border border-white/5 w-full max-w-xs transition-all hover:bg-[var(--color-surface)]/60 hover:border-white/10 group shadow-[0_4px_20px_rgba(0,0,0,0.2)]">
            <button
                onClick={togglePlay}
                disabled={isLoading || !blobUrl}
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${isPlaying ? 'bg-white text-[var(--color-bg-base)] shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-[0_0_15px_rgba(65,209,255,0.2)] group-hover:shadow-[0_0_20px_rgba(189,52,254,0.4)]'} disabled:opacity-50 disabled:grayscale`}
            >
                {isLoading ? <LoaderIcon size={18} /> : (isPlaying ? <PauseIcon size={16} /> : <PlayIcon size={18} className="ml-1" />)}
            </button>
            <div className="flex-1 overflow-hidden flex flex-col justify-center">
                <div className="relative h-6 flex items-center">
                    {/* Simulated Waveform / Progress Track */}
                    <div className="absolute inset-0 flex items-center gap-0.5 opacity-30">
                        {Array.from({ length: 40 }).map((_, i) => (
                            <div key={i} className="flex-1 bg-white rounded-full bg-opacity-20" style={{ height: `${Math.max(2, Math.sin(i * 0.5) * 12 + 14)}px` }}></div>
                        ))}
                    </div>
                    {/* Active Progress */}
                    <div className="absolute inset-y-0 left-0 flex items-center gap-0.5 overflow-hidden transition-all duration-100 ease-linear" style={{ width: `${progress}%` }}>
                        <div className="flex items-center gap-0.5 w-[200px]">
                            {Array.from({ length: 40 }).map((_, i) => (
                                <div key={i} className="w-[3px] flex-shrink-0 bg-gradient-to-t from-[var(--color-primary)] to-[var(--color-secondary)] rounded-full" style={{ height: `${Math.max(2, Math.sin(i * 0.5) * 12 + 14)}px` }}></div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-white/50 font-medium tracking-wide">
                    <span>{Math.floor((audioRef.current?.currentTime || 0) / 60)}:{(Math.floor(audioRef.current?.currentTime || 0) % 60).toString().padStart(2, '0')}</span>
                    <span>{Math.floor(duration / 60)}:{(Math.floor(duration) % 60).toString().padStart(2, '0')}</span>
                </div>
            </div>
            {blobUrl && (
                <audio
                    ref={audioRef}
                    src={blobUrl}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={handleEnded}
                    hidden
                />
            )}
        </div>
    );
};

export default VoicePlayer;
