import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Loader2 } from 'lucide-react';
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
        <div className="flex items-center gap-3 p-3 glass-card bg-opacity-10 w-full max-w-xs transition-all hover:bg-white/5">
            <button 
                onClick={togglePlay}
                disabled={isLoading || !blobUrl}
                className="p-2 rounded-full primary-gradient text-white hover:opacity-90 transition-opacity disabled:opacity-50"
            >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : (isPlaying ? <Pause size={20} /> : <Play size={20} />)}
            </button>
            <div className="flex-1">
                <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div 
                        className="h-full primary-gradient transition-all duration-100" 
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <div className="flex justify-between mt-1 text-[10px] text-white/60">
                    <span>{Math.round(audioRef.current?.currentTime || 0)}s</span>
                    <span>{Math.round(duration)}s</span>
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
