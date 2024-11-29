import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const DancingChibi = ({ isPlaying }) => {
    // Enhanced color palette with more vibrant and harmonious colors
    const colors = useMemo(() => ({
        primary: {
            light: '#FFB5E8',
            main: '#FF69B4',
            dark: '#FF1493'
        },
        secondary: {
            light: '#9370DB',
            main: '#8A2BE2',
            dark: '#4B0082'
        },
        accent: {
            light: '#FFD700',
            main: '#FFA500',
            dark: '#FF4500'
        },
        background: {
            start: '#E6E6FA',
            middle: '#DDA0DD',
            end: '#DB7093'
        }
    }), []);

    // State management with more dynamic elements
    const [danceStep, setDanceStep] = useState(0);
    const [musicalNotes, setMusicalNotes] = useState([]);
    const [audioWaves, setAudioWaves] = useState([]);
    const [particleEffects, setParticleEffects] = useState([]);
    const [showSpotlight, setShowSpotlight] = useState(false);
    
    useEffect(() => {
        let timeoutId;
        if (isPlaying) {
            // Ngẫu nhiên thời điểm xuất hiện spotlight
            timeoutId = setTimeout(() => {
                setShowSpotlight(true);

                // Tự động tắt sau 1-2 giây
                setTimeout(() => {
                    setShowSpotlight(false);
                }, Math.random() * 1000 + 1000);
            }, Math.random() * 2000);
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isPlaying]);
   

    // Memoized gradient function for performance
    const getGradient = useCallback(() => {
        return isPlaying
            ? { start: colors.primary.light, end: colors.primary.dark }
            : { start: colors.secondary.light, end: colors.secondary.main };
    }, [isPlaying, colors]);

    useEffect(() => {
        const intervals = [];

        if (isPlaying) {
            // Dance step animation
            intervals.push(setInterval(() => {
                setDanceStep(prev => (prev + 1) % 4);
            }, 300));

            // Musical notes with more variety
            intervals.push(setInterval(() => {
                const colorSchemes = [colors.primary, colors.secondary, colors.accent];
                const selectedScheme = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];

                const newNote = {
                    id: Date.now(),
                    type: ['♩', '♪', '♫', '♬'][Math.floor(Math.random() * 4)],
                    x: Math.random() * 300 - 150,
                    y: -150 + Math.random() * 50,
                    color: selectedScheme.main,
                    size: Math.random() * 25 + 15,
                    rotation: Math.random() * 360
                };
                setMusicalNotes(prev => [...prev.slice(-10), newNote]);
            }, 250));

            // Enhanced audio wave effects
            intervals.push(setInterval(() => {
                const newWave = {
                    id: Date.now(),
                    width: Math.random() * 150 + 100,
                    color: `rgba(${Math.random() * 255}, 64, 129, 0.3)`,
                    duration: Math.random() * 2.5 + 1.5,
                    delay: Math.random() * 0.7
                };
                setAudioWaves(prev => [...prev.slice(-7), newWave]);
            }, 700));

            // New particle effects
            intervals.push(setInterval(() => {
                const newParticle = {
                    id: Date.now(),
                    color: colors.accent.light,
                    x: Math.random() * 400 - 200,
                    y: Math.random() * 400 - 200,
                    size: Math.random() * 10 + 5
                };
                setParticleEffects(prev => [...prev.slice(-20), newParticle]);
            }, 500));
        } else {
            // Reset states when not playing
            setDanceStep(0);
            setMusicalNotes([]);
            setAudioWaves([]);
            setParticleEffects([]);
        }

        return () => intervals.forEach(clearInterval);
    }, [isPlaying, colors]);

    // Rendering with advanced animations and effects
    return (
        <motion.div
            className="relative w-[600px] h-[600px] overflow-hidden"
            style={{
                position: 'relative'
            }}
        >
            {showSpotlight && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '200px',
                        height: '600px',
                        background: 'linear-gradient(rgba(255,255,255,0.3), rgba(255,255,255,0) 80%)',
                        zIndex: 10,
                        pointerEvents: 'none',
                        animation: 'spotlightFade 1s ease-in-out'
                    }}
                />
            )}
            {/* Particle Effects */}
            <AnimatePresence>
                {particleEffects.map(particle => (
                    <motion.div
                        key={particle.id}
                        className="absolute rounded-full"
                        style={{
                            width: particle.size,
                            height: particle.size,
                            backgroundColor: particle.color,
                            left: '50%',
                            top: '50%'
                        }}
                        initial={{
                            x: particle.x,
                            y: particle.y,
                            scale: 0,
                            opacity: 0.7
                        }}
                        animate={{
                            x: particle.x + (Math.random() * 100 - 50),
                            y: particle.y + 300,
                            scale: [0, 1.2, 0],
                            opacity: 0
                        }}
                        transition={{
                            duration: 2.5,
                            ease: "easeOut"
                        }}
                    />
                ))}
            </AnimatePresence>

            {/* Audio Waves */}
            <AnimatePresence>
                {audioWaves.map(wave => (
                    <motion.div
                        key={wave.id}
                        className="absolute rounded-full border-2"
                        style={{
                            borderColor: wave.color,
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}
                        initial={{ width: 0, height: 0, opacity: 0.8 }}
                        animate={{
                            width: wave.width,
                            height: wave.width,
                            opacity: 0
                        }}
                        transition={{
                            duration: wave.duration,
                            delay: wave.delay,
                            ease: "easeOut"
                        }}
                    />
                ))}
            </AnimatePresence>

            {/* Musical Notes */}
            <AnimatePresence>
                {musicalNotes.map(note => (
                    <motion.div
                        key={note.id}
                        className="absolute text-4xl font-bold"
                        style={{
                            color: note.color,
                            textShadow: `0 0 10px ${note.color}40`,
                            left: '50%',
                            top: '20%'
                        }}
                        initial={{
                            x: note.x,
                            y: note.y,
                            scale: 0,
                            opacity: 0,
                            rotate: 0
                        }}
                        animate={{
                            x: [note.x, note.x + (Math.random() * 100 - 50)],
                            y: [note.y, note.y + 300],
                            scale: [0, 1.2, 0],
                            opacity: [0, 0.8, 0],
                            rotate: [0, note.rotation]
                        }}
                        transition={{
                            duration: 2,
                            ease: "easeOut"
                        }}
                    >
                        {note.type}
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* Main Chibi Character */}
            <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                    y: isPlaying ? [0, -20, 0, 20, 0] : 0,
                    rotate: isPlaying ? [-5, 5, -5] : 0,
                    scale: isPlaying ? [1, 1.1, 1, 0.9, 1] : 1
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <svg viewBox="0 0 200 200" className="w-[400px] h-[400px]">
                    {/* Gradient and Effect Definitions */}
                    <defs>
                        <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor={getGradient().start} />
                            <stop offset="100%" stopColor={getGradient().end} />
                        </linearGradient>
                        <filter id="glowEffect">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <linearGradient id="headphoneGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#8A9099" />
                            <stop offset="100%" stopColor="#5A5E6B" />
                        </linearGradient>
                    </defs>

                    {/* Body and Head */}
                    <path
                        d="M100 140 C50 140 30 110 30 70 C30 20 170 20 170 70 C170 110 150 140 100 140Z"
                        fill="url(#bodyGradient)"
                        filter="url(#glowEffect)"
                    />
                    <circle cx="100" cy="70" r="40" fill="url(#bodyGradient)" filter="url(#glowEffect)" />

                    {/* Headphones */}
                    <g>
                        <path
                            d="M60 70 C60 40 140 40 140 70"
                            stroke="url(#headphoneGradient)"
                            strokeWidth="5"
                            fill="none"
                        />
                        <circle cx="60" cy="70" r="12" fill="url(#headphoneGradient)" />
                        <circle cx="140" cy="70" r="12" fill="url(#headphoneGradient)" />
                        <circle cx="60" cy="70" r="8" fill="#2A2E3D" />
                        <circle cx="140" cy="70" r="8" fill="#2A2E3D" />

                        {/* Pulsing effect on headphones when playing */}
                        {isPlaying && (
                            <>
                                <circle
                                    cx="60" cy="70" r="4"
                                    fill="#3498db"
                                    opacity="0.6"
                                >
                                    <animate
                                        attributeName="opacity"
                                        values="0.6;0.2;0.6"
                                        dur="1s"
                                        repeatCount="indefinite"
                                    />
                                </circle>
                                <circle
                                    cx="140" cy="70" r="4"
                                    fill="#3498db"
                                    opacity="0.6"
                                >
                                    <animate
                                        attributeName="opacity"
                                        values="0.6;0.2;0.6"
                                        dur="1s"
                                        repeatCount="indefinite"
                                    />
                                </circle>
                            </>
                        )}
                    </g>

                    {/* Face Expressions */}
                    <g>
                        {isPlaying ? (
                            <>
                                <path
                                    d="M80 60 Q87 67 94 60"
                                    stroke="#444"
                                    strokeWidth="3"
                                    fill="none"
                                />
                                <path
                                    d="M106 60 Q113 67 120 60"
                                    stroke="#444"
                                    strokeWidth="3"
                                    fill="none"
                                />
                                <circle
                                    cx="85" cy="58" r="2"
                                    fill="#fff"
                                >
                                    <animate
                                        attributeName="r"
                                        values="2;1.5;2"
                                        dur="0.5s"
                                        repeatCount="indefinite"
                                    />
                                </circle>
                                <circle
                                    cx="115" cy="58" r="2"
                                    fill="#fff"
                                >
                                    <animate
                                        attributeName="r"
                                        values="2;1.5;2"
                                        dur="0.5s"
                                        repeatCount="indefinite"
                                    />
                                </circle>
                            </>
                        ) : (
                            <>
                                <circle cx="87" cy="65" r="6" fill="#444" />
                                <circle cx="113" cy="65" r="6" fill="#444" />
                                <circle cx="89" cy="63" r="2" fill="#fff" />
                                <circle cx="115" cy="63" r="2" fill="#fff" />
                            </>
                        )}

                        {/* Cheeks */}
                        <g opacity={isPlaying ? "0.8" : "0.6"}>
                            <circle
                                cx="75" cy="75" r="8"
                                fill={colors.accent.light}
                            />
                            <circle
                                cx="125" cy="75" r="8"
                                fill={colors.accent.light}
                            />
                        </g>

                        {/* Mouth */}
                        <path
                            d={isPlaying
                                ? "M90 80 Q100 90 110 80"
                                : "M90 80 Q100 85 110 80"
                            }
                            stroke="#444"
                            strokeWidth="3"
                            fill="none"
                        />
                    </g>
                </svg>
            </motion.div>
        </motion.div>
    );
};

export default DancingChibi;