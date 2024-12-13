import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getArtistSongs } from '../../../redux/slice/artistSongSlice';
import { getArtistAlbums } from '../../../redux/slice/artistAlbumSlice';
import { getSongs } from '../../../services/songs';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Button,
  Box,
  Container,
  LinearProgress
} from '@mui/material';
import { 
  MusicNote as MusicNoteIcon,
  Album as AlbumIcon,
  Analytics as AnalyticsIcon,
  CloudUpload as CloudUploadIcon,
  PlaylistAdd as PlaylistAddIcon,
  TrendingUp as TrendingUpIcon,
  Headphones as HeadphonesIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';
import ArtistHeader from '../../components/Header/Header';
import { useNavigate } from 'react-router-dom';


const ArtistDashboard = () => {
  const dispatch = useDispatch();
  const { artist } = useSelector((state) => state.artistAuth);
  const { pagination, songs } = useSelector((state) => state.artistSong);
  const { albums } = useSelector((state) => state.artistAlbum);
  const navigate = useNavigate();
  const [monthlyListeners, setMonthlyListeners] = useState(0);

  useEffect(() => {
    dispatch(getArtistSongs({ page: 1, limit: 10 }));
    dispatch(getArtistAlbums());

    const fetchSongs = async () => {
      const res = await getSongs();
      if (res && res.songs) {
        const artistSongs = res.songs.filter(song => song.artist === artist.stage_name);
        const totalListens = artistSongs.reduce((total, song) => total + (song.listens_count || 0), 0);
        setMonthlyListeners(totalListens);
      }
    };

    fetchSongs();
  }, [dispatch, artist]);

  const totalDuration = songs.reduce((total, song) => total + (song.duration || 0), 0);

  const dashboardStats = [
    {
      icon: <MusicNoteIcon sx={{ fontSize: 40 }} className="text-purple-400" />,
      title: 'Total Tracks',
      value: pagination?.total || 0,
      change: `Total Duration: ${Math.floor(totalDuration / 60)}:${(totalDuration % 60).toString().padStart(2, '0')}`,
      progress: 65,
    },
    {
      icon: <AlbumIcon sx={{ fontSize: 40 }} className="text-blue-400" />,
      title: 'Total Albums',
      value: albums?.length || 0,
      change: '+1 this month',
      progress: 45,
    },
    {
      icon: <HeadphonesIcon sx={{ fontSize: 40 }} className="text-green-400" />,
      title: 'Monthly Listeners',
      value: monthlyListeners,
      change: '+1 this week',
      progress: 78,
    },
    {
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} className="text-orange-400" />,
      title: 'Total Streams',
      value: 0,
      change: '+1.2k this month',
      progress: 85,
      overlay: true,
    }
  ];

  const quickActions = [
    {
      icon: <CloudUploadIcon />,
      title: 'Upload Track',
      description: 'Share your latest music',
      color: 'from-purple-500 to-blue-500',
      onClick: () => navigate('/artist-portal/songs')
    },
    {
      icon: <PlaylistAddIcon />,
      title: 'Create Album',
      description: 'Organize your music',
      color: 'from-blue-500 to-cyan-500',
      onClick: () => navigate('/artist-portal/albums')
    },
    {
      icon: <AnalyticsIcon />,
      title: 'View Analytics',
      description: 'Track your performance',
      color: 'from-green-500 to-emerald-500',
      overlay: true 
    },
    {
      icon: <ScheduleIcon />,
      title: 'Schedule Release',
      description: 'Plan your launches',
      color: 'from-orange-500 to-red-500',
      overlay: true 
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <ArtistHeader />
      
      <Container maxWidth="xl" className="pt-24 pb-8">
        {/* Welcome Section */}
        <Box className="mb-8">
          <Typography 
            variant="h4" 
            className="font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
          >
            Welcome back, {artist?.stage_name || 'Artist'}
          </Typography>
          <Typography variant="subtitle1" className="text-gray-400 mt-2">
            Here's what's happening with your music
          </Typography>
        </Box>

        {/* Stats Grid */}
        <Grid container spacing={4} className="mb-8">
          {dashboardStats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                className="h-full transform transition-all duration-300 hover:scale-105"
                sx={{
                  background: 'rgba(0,0,0,0.4)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <CardContent>
                  <Box className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-black/30">
                      {stat.icon}
                    </div>
                    <Typography variant="h4" className="font-bold text-white">
                      {stat.value}
                    </Typography>
                  </Box>
                  <Typography variant="h6" className="text-white/90 mb-1">
                    {stat.title}
                  </Typography>
                  <Typography variant="body2" className="text-gray-400 mb-2">
                    {stat.change}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={stat.progress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        background: 'linear-gradient(to right, #9333EA, #3B82F6)'
                      }
                    }}
                  />
                  {stat.overlay && ( // Hiển thị lớp phủ nếu có
                    <Box className="absolute inset-0 bg-black opacity-65 flex items-center justify-center">
                      <Typography variant="h6" className="text-white">Feature in Development</Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Quick Actions */}
        <Typography 
          variant="h5" 
          className="text-white/90 mb-6 font-semibold"
        >
          Quick Actions
        </Typography>
        <Grid container spacing={4}>
          {quickActions.map((action, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Button
                fullWidth
                onClick={action.onClick}
                className={`h-full normal-case bg-gradient-to-r ${action.color} 
                           hover:shadow-lg transform transition-all duration-300 hover:scale-105`}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '24px',
                  borderRadius: '16px',
                  color: 'white',
                  textAlign: 'left',
                  alignItems: 'flex-start',
                  position: 'relative'
                }}
              >
                <Box className="bg-white/20 p-2 rounded-lg mb-4">
                  {action.icon}
                </Box>
                <Typography variant="h6" className="mb-1">
                  {action.title}
                </Typography>
                <Typography variant="body2" className="text-white/70">
                  {action.description}
                </Typography>
                {action.overlay && ( // Hiển thị lớp phủ nếu có
                  <Box className="absolute inset-0 bg-black opacity-65 rounded-2xl flex items-center justify-center">
                    <Typography variant="h6" className="text-white">Feature in Development</Typography>
                  </Box>
                )}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default ArtistDashboard;