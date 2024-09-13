import React from "react";
import { Helmet } from "react-helmet";
import RowItems from "../../components/row_items/RowItems";
import GridItems from "../../components/grid_items/GridItems";
import GridGenreItems from "../../components/grid_items/GridGenreItems";
import Footer from "../../components/footer/Footer";


const data = {
  artist: [
    {
      id: 1,
      name: "Sơn Tùng MTP",
      image: "https://th.bing.com/th/id/OIP.fLnk_eILwplVquL4wn3t2gHaHa?rs=1&pid=ImgDetMain",
      title: "Artist",
    },
    {
      id: 2,
      name: "Hiếu Thứ Hai",
      image: "https://i.scdn.co/image/ab6761610000e5eb17e2d498df7cbd7c43bd5e6a",
      title: "Artist",
    },
    {
      id: 3,
      name: "GREY D",
      image: "https://th.bing.com/th/id/OIP.WshOb4R7xjxBCcmI-va5CAHaHa?rs=1&pid=ImgDetMain",
      title: "Artist",
    },
    {
      id: 4,
      name: "Wren Evans",
      image: "https://th.bing.com/th/id/OIP.YLbGsAe1-psdikDDn6zk-gHaHa?rs=1&pid=ImgDetMain",
      title: "Artist",
    },
    {
      id: 5,
      name: "Soobin",
      image:
        "https://i.scdn.co/image/ab6761610000e5ebb9c9e23c646125922719489e",
      title: "Artist",
    },
    {
      id: 6,
      name: "DaLab",
      image: "https://i.ytimg.com/vi/eb2JHVBVKhs/maxresdefault.jpg",
      title: "Artist",
    },
  ],
  album: [
    {
      id: 1,
      name: "Golden",
      image: "https://th.bing.com/th/id/OIP.WvBa5FEOB-eU1WcSRdmppQAAAA?w=474&h=474&rs=1&pid=ImgDetMain",
      title: "Jungkook",
    },
    {
      id: 2,
      name: "Đừng Làm Trái Tim Anh Đau",
      image:
        "https://bloganchoi.com/wp-content/uploads/2024/06/loi-bai-hat-dung-lam-trai-tim-anh-dau-lyrics-son-tung-mtp-5-1-696x870.jpg",
      title: "Sơn Tùng MTP",
    },
    {
      id: 3,
      name: "Ai Cũng Phải Bắt Đầu Từ Đâu Đó",
      image: "https://th.bing.com/th/id/OIP.a9y4ZYtf2szQO2xpWSZW4wAAAA?rs=1&pid=ImgDetMain",
      title: "Hiếu Thứ Hai",
    },
    {
      id: 4,
      name: "m-tp M-TP",
      image: "https://th.bing.com/th/id/R.507942273181bc5c5ee7d4383edbd47f?rik=bnaU0HuAKoX8cA&pid=ImgRaw&r=0",
      title: "Sơn Tùng MTP",
    },
    {
      id: 5,
      name: "99%",
      image: "https://th.bing.com/th/id/OIP.C43hoOrXpwjHKWbLg4bMBAHaHa?w=600&h=600&rs=1&pid=ImgDetMain",
      title: "MCK",
    },
    {
      id: 6,
      name: "Take Care",
      image: "https://th.bing.com/th/id/OIP.ZOO_GYv50IJq13htfEv_dwHaHf?rs=1&pid=ImgDetMain",
      title: "Drake",
    },
  ],
  radio: [
    {
      id: 1,
      name: "GolTV On The Radioden",
      image: "https://seeded-session-images.scdn.co/v2/img/122/secondary/artist/3HJIB8sYPyxrFGuwvKXSLR/en",
      title: "podcast",
    },
    {
      id: 2,
      name: "MT Joy",
      image: "https://seeded-session-images.scdn.co/v2/img/122/secondary/artist/69tiO1fG8VWduDl3ji2qhI/en",
      title: "podcast",
    },
    {
      id: 3,
      name: "Im Bo Yo",
      image: "https://seeded-session-images.scdn.co/v2/img/122/secondary/track/2PrGlRpPayQ4JFztXWTEx2/en",
      title: "podcast",
    },
    {
      id: 4,
      name: "Peekapoo",
      image: "https://seeded-session-images.scdn.co/v2/img/122/secondary/artist/4Ok1Cm5YX5StCQZgH0r2xF/en",
      title: "podcast",
    },
    {
      id: 5,
      name: "Feel like we alway go backwares",
      image: "https://seeded-session-images.scdn.co/v2/img/122/secondary/track/0LtOwyZoSNZKJWHqjzADpW/en",
      title: "podcast",
    },
    {
      id: 6,
      name: "If it not you",
      image: "https://seeded-session-images.scdn.co/v1/img/track/7ykaUgkdQWJLsMuOymTV2A/en",
      title: "podcast",
    },
  ],
};

const HomePage = () => {
  
  return (
    <div>
      <Helmet>
        <title>Home Page</title>
        <meta name="description" content="This is the home page of our music app." />
      </Helmet>
      <GridItems/>
      <RowItems
        title={"Popular artist"}
        data={data.artist}
      />
      <RowItems
        title={"Popular albums"}
        data={data.album}
      />
      <RowItems
        title={"Popular Radio"}
        data={data.radio}
      />
      <GridGenreItems/>

      {/* <RowItems
        title={"Featured charts"}
        data={data.artist}
      />
      <RowItems
        title={"Sportify playlists"}
        data={data.artist}
      />
      <RowItems
        title={"Trending episodes"}
        data={data.artist}
      /> */}
      <Footer />
    </div>
  );
};

export default HomePage;
