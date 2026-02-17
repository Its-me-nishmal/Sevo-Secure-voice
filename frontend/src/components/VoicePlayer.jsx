import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

const VoicePlayer = ({ audioUrl, duration }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef(null);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(currentProgress);
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
    };

    // Auto-update progress even if duration is slightly off
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
            audioRef.current.addEventListener('ended', handleEnded);
        }
        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
                audioRef.current.removeEventListener('ended', handleEnded);
            }
        };
    }, []);

    return (
        <div className="flex items-center gap-3 p-3 glass-card bg-opacity-10 w-full max-w-xs">
            <button 
                onClick={togglePlay}
                className="p-2 rounded-full primary-gradient text-white hover:opacity-90 transition-opacity"
            >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
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
            <audio ref={audioRef} src={audioUrl} hidden />
        </div>
    );
};

export default VoicePlayer;
