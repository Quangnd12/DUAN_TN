import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMixById } from '../../../../services/mixService';
import DancingChibi from './DancingChibi';
import {
    PlayCircleRounded,
    PauseCircleRounded
} from '@mui/icons-material';
import {
    Button,
    Typography,
    Box,
    CircularProgress,
    Container,
    IconButton,
    Fade,
} from '@mui/material';
import {
    ArrowBack,
    Edit,
    MusicNote,
    PlayArrow,
    Pause,
    VolumeUp,
    AccessTime
} from '@mui/icons-material';

const SongCard = ({ song, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Box
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
                background: 'linear-gradient(135deg, rgba(30,30,30,0.8) 0%, rgba(45,45,45,0.8) 100%)',
                borderRadius: 2,
                p: 3,
                mb: 2,
                transition: 'all 0.3s ease',
                transform: isHovered ? 'translateX(10px)' : 'translateX(0)',
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '4px',
                    height: '100%',
                    background: 'linear-gradient(45deg, #ff4081 30%, #7c4dff 90%)',
                    opacity: isHovered ? 1 : 0.5,
                    transition: 'opacity 0.3s ease'
                }
            }}
        >
            <Box display="flex" alignItems="center" gap={2}>
                <Typography
                    variant="h5"
                    sx={{
                        color: 'rgba(255,255,255,0.3)',
                        fontWeight: 900,
                        width: '40px'
                    }}
                >
                    {String(index + 1).padStart(2, '0')}
                </Typography>

                <Box flexGrow={1}>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'white',
                            fontWeight: 'bold',
                            mb: 1
                        }}
                    >
                        {song.title}
                    </Typography>

                    <Box display="flex" gap={3} sx={{ color: 'rgba(255,255,255,0.6)' }}>
                        <Box display="flex" alignItems="center" gap={1}>
                            <VolumeUp fontSize="small" />
                            <Typography variant="body2">
                                Volume: {song.volume}%
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                            <AccessTime fontSize="small" />
                            <Typography variant="body2">
                                Sequence: {song.sequence}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

const MixDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [mix, setMix] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioRef] = useState(new Audio());

    useEffect(() => {
        const loadMix = async () => {
            try {
                const data = await getMixById(id);
                setMix(data);
                if (data.file_path) {
                    audioRef.src = data.file_path;
                }
            } catch (error) {
                console.error('Error loading mix:', error);
                setError('Failed to load mix details');
            } finally {
                setLoading(false);
            }
        };

        loadMix();

        return () => {
            audioRef.pause();
            audioRef.src = '';
        };
    }, [id]);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.pause();
        } else {
            audioRef.play();
        }
        setIsPlaying(!isPlaying);
    };

    if (loading) {
        return (
            <Box 
            sx={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
                pt: 4,
                pb: 8,
                position: 'relative', 
                overflow: 'hidden' 
            }}
        >
                <CircularProgress sx={{ color: 'white' }} />
            </Box>
        );
    }

    if (error || !mix) {
        return (
            <Container maxWidth="xl" sx={{ pt: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        color: 'white',
                        textAlign: 'center',
                        mb: 2
                    }}
                >
                    {error || 'Mix not found'}
                </Typography>
                <Box sx={{ textAlign: 'center' }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate('/mix')}
                        sx={{ color: 'white', borderColor: 'white' }}
                    >
                        Back to List
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
            pt: 4,
            pb: 8
        }}>
          {isPlaying && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: `
                            radial-gradient(circle at 30% 50%, rgba(255,64,129,0.2) 0%, transparent 50%),
                            radial-gradient(circle at 70% 50%, rgba(64,129,255,0.2) 0%, transparent 50%)
                        `,
                        animation: 'lightPulse 4s infinite',
                        pointerEvents: 'none',
                        '@keyframes lightPulse': {
                            '0%, 100%': { opacity: 0.1 },
                            '50%': { opacity: 0.4 }
                        }
                    }}
                />
            )}

             <Container maxWidth="xl">
                <Box sx={{ position: 'relative', mb: 6 }}>
                    <Box
                        sx={{
                            height: '300px',
                            background: `linear-gradient(45deg, #ff4081 0%, #7c4dff 100%)`,
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            position: 'relative',
                            overflow: 'hidden',
                            mb: 4
                        }}
                    >
                        <DancingChibi isPlaying={isPlaying} />
                        <Typography

                            variant="h1"
                            sx={{
                                color: 'white',
                                fontSize: '120px',
                                fontWeight: 900,
                                opacity: 0.3,
                                textTransform: 'uppercase',
                                letterSpacing: '-4px'
                            }}
                        >
                            MIX
                        </Typography>

                        {mix.file_path && (
                            <IconButton
                                onClick={togglePlay}
                                sx={{
                                    position: 'absolute',
                                    backgroundColor: 'rgba(255,255,255,0.2)',
                                    backdropFilter: 'blur(10px)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.3)',
                                        transform: 'scale(1.1)'
                                    },
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                }}
                            >
                                {isPlaying ? (
                                    <PauseCircleRounded
                                        sx={{
                                            color: 'white',
                                            fontSize: 64,
                                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                                        }}
                                    />
                                ) : (
                                    <PlayCircleRounded
                                        sx={{
                                            color: 'white',
                                            fontSize: 64,
                                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                                        }}
                                    />
                                )}
                            </IconButton>
                        )}
                    </Box>

                    <Typography
                        variant="h3"
                        sx={{
                            color: 'white',
                            fontWeight: 900,
                            mb: 2,
                            textAlign: 'center'
                        }}
                    >
                        {mix.title}
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: 'rgba(255,255,255,0.6)',
                            textAlign: 'center',
                            mb: 4
                        }}
                    >
                        {mix.songs.length} tracks • Created {new Date(mix.created_at).toLocaleDateString()}
                    </Typography>
                </Box>

                {/* Songs List */}
                <Box sx={{ mb: 6 }}>
                    {mix.songs.map((song, index) => (
                        <Fade in={true} timeout={500 + index * 100} key={song.id}>
                            <Box>
                                <SongCard song={song} index={index} />
                            </Box>
                        </Fade>
                    ))}
                </Box>

                {/* Actions */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 2,
                        mt: 4
                    }}
                >
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() => navigate('/mix')}
                        sx={{
                            color: 'white',
                            borderColor: 'rgba(255,255,255,0.3)',
                            '&:hover': {
                                borderColor: 'white',
                                backgroundColor: 'rgba(255,255,255,0.1)'
                            }
                        }}
                    >
                        Back to List
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Edit />}
                        onClick={() => navigate(`/mixes/add`)}
                        sx={{
                            background: 'linear-gradient(45deg, #ff4081 30%, #7c4dff 90%)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #ff4081 60%, #7c4dff 90%)',
                            }
                        }}
                    >
                        Add mix
                    </Button>
                </Box>
            </Container>
        </Box>
    );
};

export default MixDetail;