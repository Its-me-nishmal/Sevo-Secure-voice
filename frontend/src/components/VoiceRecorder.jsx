import { useState, useRef } from 'react';
import { Mic, Square, Send, X, Play, Pause } from 'lucide-react';

const VoiceRecorder = ({ onSend }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [duration, setDuration] = useState(0);
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioPreviewRef = useRef(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setPreviewUrl(URL.createObjectURL(blob));
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleCancel = () => {
    setAudioBlob(null);
    setPreviewUrl(null);
    setDuration(0);
  };

  const handleSend = () => {
    if (audioBlob) {
      onSend(audioBlob, duration);
      handleCancel();
    }
  };

  const togglePreview = () => {
      if(isPreviewPlaying) {
          audioPreviewRef.current.pause();
      } else {
          audioPreviewRef.current.play();
      }
      setIsPreviewPlaying(!isPreviewPlaying);
  };

  return (
    <div className="p-4 glass-card border-none shadow-xl flex items-center justify-between gap-4">
      {!audioBlob ? (
        <>
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`} />
            <span className="text-sm font-medium">{isRecording ? `${duration}s` : 'Ready to record'}</span>
          </div>
          
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={`p-4 rounded-full transition-all duration-300 ${isRecording ? 'primary-gradient scale-125 shadow-lg' : 'bg-white/10 hover:bg-white/20'}`}
          >
            {isRecording ? <Square size={24} fill="white" /> : <Mic size={24} />}
          </button>
          <span className="text-xs text-white/40">Hold to speak</span>
        </>
      ) : (
        <div className="flex items-center gap-4 w-full">
           <button onClick={handleCancel} className="p-2 text-white/60 hover:text-white"><X size={20} /></button>
           
           <div className="flex-1 flex items-center gap-3 glass-card bg-white/5 p-2 rounded-xl">
                <button onClick={togglePreview} className="text-white/80">
                    {isPreviewPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full primary-gradient" style={{width: '30%'}} /> {/* Mock progress */}
                </div>
                <span className="text-xs font-mono">{duration}s</span>
                <audio ref={audioPreviewRef} src={previewUrl} onEnded={() => setIsPreviewPlaying(false)} hidden />
           </div>

           <button 
                onClick={handleSend}
                className="p-3 rounded-full primary-gradient text-white shadow-lg hover:opacity-90"
            >
                <Send size={20} />
            </button>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
