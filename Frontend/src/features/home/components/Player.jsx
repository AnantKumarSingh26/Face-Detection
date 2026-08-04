import React, { useState, useRef, useEffect } from 'react';
import useSong from '../hooks/useSong';
import '../styles/player.scss';

const MOOD_OPTIONS = [
  { id: 'happy', label: 'Happy', emoji: '😄', color: '#ffb703' },
  { id: 'sad', label: 'Sad', emoji: '😢', color: '#4895ef' },
  { id: 'surprised', label: 'Surprised', emoji: '😲', color: '#b5179e' },
  { id: 'neutral', label: 'Neutral', emoji: '😐', color: '#4cc9f0' },
];

const Player = ({ currentExpression }) => {
  const { song, loading, handleGetSong, isPlaying, setIsPlaying } = useSong();
  const audioRef = useRef(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  // Synchronize poster and artist
  const posterUrl =
    song?.posterUrl ||
    song?.postedUrl ||
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop';
  const songTitle = song?.title || 'No Song Selected';
  const artistName = song?.artist || 'Moodify AI Beats';
  const songMood = song?.mood || 'happy';

  // Handle Play / Pause toggle
  const togglePlay = () => {
    if (!audioRef.current || !song?.url) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => setIsPlaying(true)).catch((err) => {
        console.warn("Autoplay blocked or playback error:", err);
        setIsPlaying(false);
      });
    }
  };

  // Audio event handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleEnded = () => {
    if (isRepeat) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else if (isShuffle) {
      const moods = ['happy', 'sad', 'surprised', 'neutral'];
      const randomMood = moods[Math.floor(Math.random() * moods.length)];
      handleGetSong({ mood: randomMood });
    } else {
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
    if (newVol > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  // Auto-play when song changes
  useEffect(() => {
    if (song?.url && audioRef.current) {
      audioRef.current.load();
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [song?.url]);

  // Format time mm:ss
  const formatTime = (secs) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Active mood info
  const activeMoodObj = MOOD_OPTIONS.find((m) => m.id === songMood.toLowerCase()) || MOOD_OPTIONS[0];

  return (
    <div className="music-player-card" style={{ '--accent-color': activeMoodObj.color }}>
      <audio
        ref={audioRef}
        src={song?.url}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
      />

      {/* Header Badge */}
      <div className="player-header">
        <div className="mood-badge" style={{ backgroundColor: `${activeMoodObj.color}22`, borderColor: activeMoodObj.color }}>
          <span className="mood-emoji">{activeMoodObj.emoji}</span>
          <span className="mood-text" style={{ color: activeMoodObj.color }}>
            {activeMoodObj.label} Mood Track
          </span>
        </div>
        {loading && <div className="loading-spinner" title="Fetching new track..."></div>}
      </div>

      {/* Center Artwork & Visualizer */}
      <div className="artwork-section">
        <div className={`poster-wrapper ${isPlaying ? 'playing' : ''}`}>
          <img src={posterUrl} alt={songTitle} className="album-art" />
          <div className="vinyl-groove"></div>
          {isPlaying && (
            <div className="equalizer-overlay">
              <span className="bar bar-1"></span>
              <span className="bar bar-2"></span>
              <span className="bar bar-3"></span>
              <span className="bar bar-4"></span>
            </div>
          )}
        </div>

        <div className="song-details">
          <h3 className="song-title">{songTitle}</h3>
          <p className="artist-name">{artistName}</p>
        </div>
      </div>

      {/* Seek Progress Bar */}
      <div className="progress-section">
        <div className="time-labels">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="seek-slider"
          style={{
            background: `linear-gradient(to right, ${activeMoodObj.color} ${
              duration ? (currentTime / duration) * 100 : 0
            }%, rgba(255, 255, 255, 0.1) 0%)`,
          }}
        />
      </div>

      {/* Main Playback Controls */}
      <div className="controls-section">
        <button
          className={`control-btn secondary ${isShuffle ? 'active' : ''}`}
          onClick={() => setIsShuffle(!isShuffle)}
          title="Toggle Shuffle"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" />
          </svg>
        </button>

        <button
          className="control-btn secondary"
          onClick={() => handleGetSong({ mood: songMood })}
          title="Previous Track"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
          </svg>
        </button>

        <button
          className="control-btn primary-play"
          onClick={togglePlay}
          style={{ backgroundColor: activeMoodObj.color }}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" width="26" height="26" fill="#121212">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="26" height="26" fill="#121212">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <button
          className="control-btn secondary"
          onClick={() => handleGetSong({ mood: songMood })}
          title="Next Track"
        >
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
          </svg>
        </button>

        <button
          className={`control-btn secondary ${isRepeat ? 'active' : ''}`}
          onClick={() => setIsRepeat(!isRepeat)}
          title="Toggle Repeat"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 1l4 4-4 4" />
            <path d="M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4" />
            <path d="M21 13v2a4 4 0 0 1-4 4H3" />
          </svg>
        </button>
      </div>

      {/* Volume Control & Mood Pills */}
      <div className="bottom-utility">
        <div className="volume-control">
          <button className="icon-btn" onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
            {isMuted || volume === 0 ? (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
              </svg>
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>

        {/* Mood Selector Buttons */}
        <div className="mood-pills">
          {MOOD_OPTIONS.map((m) => (
            <button
              key={m.id}
              className={`pill ${songMood.toLowerCase() === m.id ? 'active' : ''}`}
              style={{ '--pill-color': m.color }}
              onClick={() => handleGetSong({ mood: m.id })}
            >
              <span>{m.emoji}</span> {m.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Player;