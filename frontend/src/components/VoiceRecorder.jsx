import { useState, useRef, useEffect } from 'react';
import { MicIcon, SendIcon, XIcon, PlayIcon, PauseIcon } from './Icons';

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
  const isCancelledRef = useRef(false);
  const isInstantSendRef = useRef(false);
  const durationRef = useRef(0);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream?.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    if (isRecordingRef.current) return;

    isRecordingRef.current = true;
    isCancelledRef.current = false;
    isInstantSendRef.current = false;
    setIsRecording(true);
    setDuration(0);
    durationRef.current = 0;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // If user cancelled before stream resolved
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
        if (!isCancelledRef.current) {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
          if (isInstantSendRef.current) {
            onSend(blob, durationRef.current);
            handleCancel();
          } else {
            setAudioBlob(blob);
            setPreviewUrl(URL.createObjectURL(blob));
          }
        }
        isCancelledRef.current = false;
        isInstantSendRef.current = false;
      };

      mediaRecorderRef.current.start();

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        durationRef.current += 1;
        setDuration(durationRef.current);
      }, 1000);

    } catch (err) {
      console.error("Microphone access denied:", err);
      isRecordingRef.current = false;
      setIsRecording(false);
    }
  };

  const handleInstantSend = () => {
    if (!isRecordingRef.current) return;
    isInstantSendRef.current = true;
    stopInternal();
  };

  const pauseRecordingToPreview = () => {
    if (!isRecordingRef.current) return;
    stopInternal();
  };

  const handleCancelRecording = () => {
    if (!isRecordingRef.current) return;
    isCancelledRef.current = true;
    stopInternal();
    handleCancel();
  };

  const stopInternal = () => {
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
    durationRef.current = 0;
  };

  const handleSend = () => {
    if (audioBlob) {
      onSend(audioBlob, duration);
      handleCancel();
    }
    setIsPreviewPlaying(!isPreviewPlaying);
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
      {!isRecording && !audioBlob && (
        <>
          <div className="flex items-center gap-2.5 min-w-0 pl-2">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 bg-[var(--color-primary)] animate-pulse shadow-[0_0_8px_rgba(65,209,255,0.8)]" />
            <span className="text-sm tracking-wide font-medium truncate text-[var(--color-primary)]">Ready</span>
          </div>

          <div className="flex-1 text-center pr-4">
            <span className="text-xs text-white/30 uppercase tracking-[0.2em] font-bold">Tap to Speak</span>
          </div>

          <button
            onClick={startRecording}
            className="w-14 h-14 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300 ease-out active:scale-95 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-[0_4px_20px_rgba(189,52,254,0.3)] hover:scale-105"
          >
            <MicIcon size={28} />
          </button>
        </>
      )}

      {isRecording && !audioBlob && (
        <div className="flex items-center gap-3 w-full animate-in slide-in-from-right-4 fade-in duration-300">
          <button onClick={handleCancelRecording} className="w-12 h-12 flex flex-shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
            <XIcon size={22} />
          </button>

          <div className="flex-1 flex items-center justify-center gap-3 bg-[var(--color-bg-base)]/50 border border-red-500/30 p-2 rounded-full shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
            <div className="w-2 h-2 flex-shrink-0 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <span className="text-sm font-bold tracking-widest text-red-400 z-10 w-12 text-center">{Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</span>

            <button onClick={pauseRecordingToPreview} className="mx-2 w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10 hover:text-[var(--color-primary)]">
              <PauseIcon size={14} />
            </button>
          </div>

          <button
            onClick={handleInstantSend}
            className="w-12 h-12 flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-[0_4px_20px_rgba(65,209,255,0.4)] hover:scale-105 hover:shadow-[0_4px_25px_rgba(189,52,254,0.5)] active:scale-95 transition-all"
          >
            <SendIcon size={20} className="ml-0.5" />
          </button>
        </div>
      )}

      {audioBlob && (
        <div className="flex items-center gap-3 w-full animate-in slide-in-from-bottom-4 fade-in duration-300">
          <button onClick={handleCancel} className="w-10 h-10 flex flex-shrink-0 items-center justify-center rounded-full bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors">
            <XIcon size={20} />
          </button>

          <div className="flex-1 flex items-center gap-3 bg-[var(--color-bg-base)]/50 border border-white/5 p-2 pr-4 rounded-full shadow-inner">
            <button onClick={togglePreview} className="w-8 h-8 flex flex-shrink-0 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors">
              {isPreviewPlaying ? <PauseIcon size={14} /> : <PlayIcon size={14} className="ml-0.5" />}
            </button>
            <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden relative">
              <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] transition-all duration-300" style={{ width: '100%' }} />
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
            <span className="text-xs font-medium tracking-wider text-white/80">{Math.floor(duration / 60)}:{(duration % 60).toString().padStart(2, '0')}</span>
            <audio ref={audioPreviewRef} src={previewUrl} onEnded={() => setIsPreviewPlaying(false)} hidden />
          </div>

          <button
            onClick={handleSend}
            className="w-12 h-12 flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-white shadow-[0_4px_20px_rgba(65,209,255,0.4)] hover:scale-105 hover:shadow-[0_4px_25px_rgba(189,52,254,0.5)] active:scale-95 transition-all"
          >
            <SendIcon size={20} className="ml-0.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
