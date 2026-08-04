import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/utils";
import Player from "../../home/components/Player";
import useSong from "../../home/hooks/useSong";
import { useAuth } from "../../auth/hooks/useAuth";
import "../../home/styles/home.scss";

export default function FaceExpression() {
    const videoRef = useRef(null);
    const landmarkerRef = useRef(null);
    const streamRef = useRef(null);

    const [expression, setExpression] = useState("Detecting...");
    const [autoScan, setAutoScan] = useState(false);

    const { handleGetSong } = useSong();
    const { user, handleLogout } = useAuth();

    // Initialize MediaPipe Face Landmarker & Webcam
    useEffect(() => {
        init({ landmarkerRef, videoRef, streamRef });

        return () => {
            if (landmarkerRef.current) {
                landmarkerRef.current.close();
            }

            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject
                    .getTracks()
                    .forEach((track) => track.stop());
            }
        };
    }, []);

    // Manual or Auto Expression Detection handler
    const runDetection = () => {
        detect({ landmarkerRef, videoRef, setExpression });
    };

    // Auto-fetch song when detected expression changes to a valid mood
    useEffect(() => {
        let mood = null;
        if (expression.includes("Happy")) mood = "happy";
        else if (expression.includes("Sad")) mood = "sad";
        else if (expression.includes("Surprised")) mood = "surprised";
        else if (expression.includes("Neutral")) mood = "neutral";

        if (mood) {
            handleGetSong({ mood });
        }
    }, [expression]);

    // Continuous auto-scan loop if enabled
    useEffect(() => {
        let interval = null;
        if (autoScan) {
            interval = setInterval(() => {
                runDetection();
            }, 2000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoScan]);

    return (
        <div className="home-container">
            {/* Top Navigation Bar */}
            <header className="navbar">
                <div className="brand">
                    <div className="brand-icon">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#fff" strokeWidth="2.2">
                            <path d="M9 18V5l12-2v13" />
                            <circle cx="6" cy="18" r="3" />
                            <circle cx="18" cy="16" r="3" />
                        </svg>
                    </div>
                    <h1>Moodify AI</h1>
                </div>

                <div className="user-actions">
                    <div className="user-info">
                        <div className="avatar">
                            {(user?.username || user?.email || "U")[0].toUpperCase()}
                        </div>
                        <span>{user?.username || user?.email || "User"}</span>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </header>

            {/* Main Content Layout */}
            <main className="main-content">
                {/* AI Facial Scanner Panel */}
                <section className="webcam-section">
                    <div className="section-header">
                        <div className="title">
                            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                                <line x1="9" y1="9" x2="9.01" y2="9" strokeWidth="3" />
                                <line x1="15" y1="9" x2="15.01" y2="9" strokeWidth="3" />
                            </svg>
                            <span>AI Emotion Scanner</span>
                        </div>
                        <div className="pulse-dot" title="Live Camera Signal"></div>
                    </div>

                    <div className="video-wrapper">
                        <video ref={videoRef} playsInline />
                        <div className="hud-scanner">
                            <div className="corner top-left"></div>
                            <div className="corner top-right"></div>
                            <div className="corner bottom-left"></div>
                            <div className="corner bottom-right"></div>
                            <div className="scan-line"></div>
                        </div>
                    </div>

                    <div className="expression-display">
                        <div className="label">Current Facial Expression</div>
                        <div className="expression-value">{expression}</div>
                    </div>

                    <div className="action-buttons">
                        <button className="btn-detect" onClick={runDetection}>
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polygon points="23 7 16 12 23 17 23 7" />
                                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                            </svg>
                            Detect Expression
                        </button>
                        <button
                            className={`btn-auto ${autoScan ? 'active' : ''}`}
                            onClick={() => setAutoScan(!autoScan)}
                        >
                            {autoScan ? 'Auto-Scan ON' : 'Auto-Scan OFF'}
                        </button>
                    </div>
                </section>

                {/* Music Player UI Panel */}
                <section className="player-section">
                    <Player currentExpression={expression} />
                </section>
            </main>
        </div>
    );
}