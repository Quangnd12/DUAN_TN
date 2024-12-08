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


const HomePage = () => {
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



useEffect(() => {
  const fetchData = async () => {
    try {
      // Fetch Artists
      const { artists } = await getAllArtists();
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
      const albumsResponse = await getAlbums(1, 6); // Lấy 6 albums đầu tiên
      const formattedAlbums = albumsResponse.albums.map(album => ({
        id: album.id, // Chắc chắn rằng đây là ID chính xác của album
        name: album.title,
        image: album.image || '/images/default-album.jpg', 
        title: album.artistNames?.join(', ') || 'Unknown Artist',
       
      }));
      setAlbums(formattedAlbums);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  fetchData();
}, []);

// Giữ nguyên dữ liệu radio
const data = {
  radio: [
    {
      id: 1,
      name: "GolTV On The Radioden",
      image: "https://seeded-session-images.scdn.co/v2/img/122/secondary/artist/3HJIB8sYPyxrFGuwvKXSLR/en",
      title: "podcast",
    },
    // ... các radio khác giữ nguyên
  ]
};

if (loading) {
  return <div>Loading...</div>;
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
          title={"Popular artist"}
          data={artists}
          rowId="popular-artist"
          globalPlayingState={globalPlayingState}
          setGlobalPlayingState={setGlobalPlayingState}
        />
        <RowItems
          title={"Popular albums"}
          data={albums}
          rowId="popular-albums"
          globalPlayingState={globalPlayingState}
          setGlobalPlayingState={setGlobalPlayingState}
        />
        <RowItems
          title={"Popular Radio"}
          data={data.radio}
          rowId="popular-radio"
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