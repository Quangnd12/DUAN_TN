import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMixes, deleteMix } from '../../../../services/mixService';
import {
    Typography, Button, IconButton, Container, Box,
    CircularProgress, Snackbar, Alert, Fade, useTheme
} from '@mui/material';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Add as AddIcon,
    Favorite as FavoriteIcon,
    Share as ShareIcon,
} from '@mui/icons-material';

const MixCard = ({ mix, onDelete, deleteLoading, onDetail }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <Box
            onClick={onDetail}
            sx={{
                position: 'relative',
                borderRadius: 4,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)',
                transition: 'all 0.3s ease',
                transform: isHovered ? 'scale(1.02)' : 'scale(1)',
                '&:hover': {
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    cursor: 'pointer'
                }
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Box
                sx={{
                    height: 200,
                    background: `linear-gradient(45deg, ${mix.id % 2 === 0 ? '#ff4081' : '#7c4dff'} 0%, ${mix.id % 2 === 0 ? '#ff9100' : '#448aff'} 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        color: 'white',
                        fontSize: '72px',
                        fontWeight: 900,
                        opacity: 0.3,
                        textTransform: 'uppercase',
                        letterSpacing: '-2px'
                    }}
                >
                    MIX
                </Typography>
            </Box>

            <Box sx={{ p: 2, color: 'white' }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
                    {mix.title}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.7, mb: 2 }}>
                    {mix.songs?.length || 0} tracks • Created {new Date(mix.created_at).toLocaleDateString()}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                            size="small" 
                            sx={{ color: 'white' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <FavoriteIcon />
                        </IconButton>
                        <IconButton 
                            size="small" 
                            sx={{ color: 'white' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <ShareIcon />
                        </IconButton>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                            disabled={deleteLoading}
                            sx={{ color: 'white' }}
                        >
                            {deleteLoading ? (
                                <CircularProgress size={20} sx={{ color: 'white' }} />
                            ) : (
                                <DeleteIcon />
                            )}
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

const MixList = () => {
    const navigate = useNavigate();
    
    const [mixes, setMixes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit] = useState(12);
    const [error, setError] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [deleteLoading, setDeleteLoading] = useState(null);

    // Load mixes with error handling
    const loadMixes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getMixes(page, limit);
            setMixes(data);
        } catch (error) {
            setError('Failed to load mixes. Please try again.');
            setSnackbar({
                open: true,
                message: 'Error loading mixes',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    }, [page, limit]);

    useEffect(() => {
        loadMixes();
    }, [loadMixes]);

    // Handle mix deletion
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this mix? This action cannot be undone.')) {
            try {
                setDeleteLoading(id);
                await deleteMix(id);
                setSnackbar({
                    open: true,
                    message: 'Mix deleted successfully',
                    severity: 'success'
                });
                loadMixes();
            } catch (error) {
                setSnackbar({
                    open: true,
                    message: 'Error deleting mix',
                    severity: 'error'
                });
            } finally {
                setDeleteLoading(null);
            }
        }
    };

    // Handle navigation to detail page
    const handleDetail = (mixId) => {
        navigate(`/mixes/mixDetail/${mixId}`);
    };

    return (
        <Box sx={{ 
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #121212 0%, #1e1e1e 100%)',
            pt: 4,
            pb: 8
        }}>
            <Container maxWidth="xl">
                {/* Header Section */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 6,
                    flexWrap: 'wrap',
                    gap: 2
                }}>
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            fontWeight: 900,
                            background: 'linear-gradient(45deg, #ff4081 30%, #7c4dff 90%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            letterSpacing: '-1px'
                        }}
                    >
                        Your Mix Universe
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/mixes/add')}
                        sx={{
                            borderRadius: 3,
                            textTransform: 'none',
                            background: 'linear-gradient(45deg, #ff4081 30%, #7c4dff 90%)',
                            px: 4,
                            py: 1.5,
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #ff4081 60%, #7c4dff 90%)',
                            }
                        }}
                    >
                        Create Mix
                    </Button>
                </Box>

                {/* Mix Grid */}
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress sx={{ color: 'white' }} />
                    </Box>
                ) : (
                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: 4,
                        mb: 4
                    }}>
                        {mixes.map((mix) => (
                            <MixCard
                                key={mix.id}
                                mix={mix}
                                onDelete={() => handleDelete(mix.id)}
                                deleteLoading={deleteLoading === mix.id}
                                onDetail={() => handleDetail(mix.id)}
                            />
                        ))}
                    </Box>
                )}

                {/* Empty State */}
                {!loading && mixes.length === 0 && (
                    <Box sx={{ 
                        textAlign: 'center',
                        py: 8,
                        color: 'white'
                    }}>
                        <Typography variant="h5" sx={{ mb: 2 }}>
                            No mixes found
                        </Typography>
                        <Typography variant="body1" sx={{ opacity: 0.7 }}>
                            Start creating your first mix!
                        </Typography>
                    </Box>
                )}

                {/* Pagination */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: 2,
                    mt: 4
                }}>
                    <Button
                        variant="outlined"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                        sx={{
                            color: 'white',
                            borderColor: 'rgba(255,255,255,0.3)',
                            '&:hover': {
                                borderColor: 'white',
                                backgroundColor: 'rgba(255,255,255,0.1)'
                            }
                        }}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => setPage(p => p + 1)}
                        disabled={mixes.length < limit || loading}
                        sx={{
                            color: 'white',
                            borderColor: 'rgba(255,255,255,0.3)',
                            '&:hover': {
                                borderColor: 'white',
                                backgroundColor: 'rgba(255,255,255,0.1)'
                            }
                        }}
                    >
                        Next
                    </Button>
                </Box>
            </Container>

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                TransitionComponent={Fade}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert 
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                    elevation={6}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default MixList;