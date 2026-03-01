import { useState, useRef, useEffect } from 'react';
import { MicIcon, StopIcon, SendIcon, XIcon, PlayIcon, PauseIcon } from './Icons';

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
  const isRecordingRef = useRef(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async (e) => {
    if (e && e.cancelable && e.type !== 'mousedown') e.preventDefault();
    if (isRecordingRef.current) return;

    isRecordingRef.current = true;
    setIsRecording(true);
    setDuration(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // If user released button before stream resolved
      if (!isRecordingRef.current) {
        stream.getTracks().forEach(track => track.stop());
        return;
      }

      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (evt) => {
        if (evt.data.size > 0) chunksRef.current.push(evt.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        setPreviewUrl(URL.createObjectURL(blob));
      };

      mediaRecorderRef.current.start();

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error("Microphone access denied:", err);
      isRecordingRef.current = false;
      setIsRecording(false);
    }
  };

  const stopRecording = (e) => {
    if (e && e.cancelable && e.type !== 'mouseup') e.preventDefault();
    if (!isRecordingRef.current) return;

    isRecordingRef.current = false;
    setIsRecording(false);

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
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
    if (isPreviewPlaying) {
      audioPreviewRef.current.pause();
    } else {
      audioPreviewRef.current.play();
    }
    setIsPreviewPlaying(!isPreviewPlaying);
  };

  return (
    <div className="p-2.5 glass-card bg-[var(--color-surface)]/60 backdrop-blur-2xl border border-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center justify-between gap-3 w-full rounded-3xl transition-all">
      {!audioBlob ? (
        <>
          <div className="flex items-center gap-2.5 min-w-0 pl-2">
            <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 transition-colors duration-300 ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white/20'}`} />
            <span className={`text-sm tracking-wide font-medium truncate transition-colors ${isRecording ? 'text-red-400' : 'text-white/60'}`}>{isRecording ? `0:${duration.toString().padStart(2, '0')}` : 'Ready'}</span>
          </div>

          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            className={`w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300 ease-out active:scale-95 ${isRecording ? 'bg-red-500 text-white shadow-[0_0_25px_rgba(239,68,68,0.5)] ring-4 ring-red-500/20 scale-110' : 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-[0_4px_20px_rgba(189,52,254,0.3)] hover:scale-105'}`}
          >
            {isRecording ? <StopIcon size={24} /> : <MicIcon size={28} />}
          </button>

          <div className="text-xs text-white/40 font-medium min-w-0 text-right pr-2 uppercase tracking-wider">
            {isRecording ? <span className="text-red-400/80 animate-pulse">Recording</span> : 'Hold & Speak'}
          </div>
        </>
      ) : (
        <div className="flex items-center gap-3 w-full animate-in slide-in-from-bottom-4 fade-in duration-300">
          <button onClick={handleCancel} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors"><XIcon size={20} /></button>

          <div className="flex-1 flex items-center gap-3 bg-[var(--color-bg-base)]/50 border border-white/5 p-2 pr-3 rounded-full shadow-inner">
            <button onClick={togglePreview} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
              {isPreviewPlaying ? <PauseIcon size={14} /> : <PlayIcon size={14} className="ml-0.5" />}
            </button>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] transition-all duration-300" style={{ width: '100%' }} />
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
            <span className="text-xs font-medium tracking-wider text-white/80">0:{duration.toString().padStart(2, '0')}</span>
            <audio ref={audioPreviewRef} src={previewUrl} onEnded={() => setIsPreviewPlaying(false)} hidden />
          </div>

          <button
            onClick={handleSend}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-[0_4px_20px_rgba(65,209,255,0.4)] hover:scale-105 hover:shadow-[0_4px_25px_rgba(189,52,254,0.5)] active:scale-95 transition-all"
          >
            <SendIcon size={20} className="ml-0.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
