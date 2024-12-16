import React, { useState, useEffect } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Box } from "@mui/material";
import RowItems from "../../components/row_items/RowItems";
import GridItems from "../../components/grid_items/GridItems";
import GridGenreItems from "../../components/grid_items/GridGenreItems";
import Footer from "../../components/footer/Footer";
import { getAllArtists } from "../../../../services/artist";
import { getAlbums } from "../../../../services/album"; // Import hàm getAlbums
import { useDispatch, useSelector } from "react-redux";
import { translations } from "../../utils/translations/translations";
import { useTheme } from "../../utils/ThemeContext";


const HomePage = () => {
  const { language } = useTheme();
  const [artists, setArtists] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useSelector((state) => state.auth);

  //Khởi tạo globalPlayingState bằng cách kiểm tra localStorage. Nếu có dữ liệu được lưu, sử dụng nó; nếu không, sử dụng giá trị mặc định.
  const [globalPlayingState, setGlobalPlayingState] = useState(() => {
    const savedState = localStorage.getItem("globalPlayingState");
    return savedState ? JSON.parse(savedState) : { rowId: null, index: null };
  });

  useEffect(() => {
    localStorage.setItem(
      "globalPlayingState",
      JSON.stringify(globalPlayingState)
    );
  }, [globalPlayingState]);



// Thêm state để kiểm soát việc component đã mount
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
  return () => setIsMounted(false);
}, []);

useEffect(() => {
  const fetchData = async () => {
    if (!isMounted) return;
    
    try {
      setLoading(true);
      // Fetch Artists
      const { artists } = await getAllArtists();
      if (!isMounted) return;

      const formattedArtists = artists
        .map(artist => ({
          id: artist._id,
          name: artist.name,
          image: artist.avatar || '/images/avatar-artist.jpg',
          title: "Artist"
        }))
        .slice(0, 6);
      setArtists(formattedArtists);

      // Fetch Albums
      const albumsResponse = await getAlbums(1, 6);
      if (!isMounted) return;

      const formattedAlbums = albumsResponse.albums.map(album => ({
        id: album.id,
        name: album.title,
        image: album.image || '/images/default-album.jpg',
        title: album.artistNames?.join(', ') || 'Unknown Artist',
      }));
      setAlbums(formattedAlbums);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  };

  fetchData();
}, [isMounted]);


if (loading) {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}
  return (
    <HelmetProvider>
      <Box sx={{ flexGrow: 1 }}>
        <Helmet>
          <title>Home Page</title>
          <meta
            name="description"
            content="This is the home page of our music app."
          />
        </Helmet>
        <GridItems />
        <RowItems
          title={translations[language].popularArtist}
          data={artists}
          rowId="popular-artist"
          globalPlayingState={globalPlayingState}
          setGlobalPlayingState={setGlobalPlayingState}
        />
        <RowItems
          title={translations[language].popularAlbums}
          data={albums}
          rowId="popular-albums"
          globalPlayingState={globalPlayingState}
          setGlobalPlayingState={setGlobalPlayingState}
        />
        <GridGenreItems />
        <Footer />
      </Box>
    </HelmetProvider>
  );
};

export default HomePage;