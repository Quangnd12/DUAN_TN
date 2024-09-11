import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Body from "./Body";
import { useStateProvider } from "../../utils/StateProvider";
import { reducerCases } from "../../utils/Constants";

export default function Track() {
  const [{ token }, dispatch] = useStateProvider();
  const [navBackground, setNavBackground] = useState(false);
  const [headerBackground, setHeaderBackground] = useState(false);
  const bodyRef = useRef();

  const bodyScrolled = () => {
    setNavBackground(bodyRef.current.scrollTop >= 30);
    setHeaderBackground(bodyRef.current.scrollTop >= 268);
  };

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const { data } = await axios.get("https://api.spotify.com/v1/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const userInfo = {
          userId: data.id,
          userUrl: data.external_urls.spotify,
          name: data.display_name,
        };
        dispatch({ type: reducerCases.SET_USER, userInfo });
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    const getPlaybackState = async () => {
      try {
        const { data } = await axios.get("https://api.spotify.com/v1/me/player", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        dispatch({
          type: reducerCases.SET_PLAYER_STATE,
          playerState: data.is_playing,
        });
      } catch (error) {
        console.error("Error fetching playback state:", error);
      }
    };

    getUserInfo();
    getPlaybackState();
  }, [dispatch, token]);

  return (
    <Container>
      <div className="spotify__body">
        <div className="body" ref={bodyRef} onScroll={bodyScrolled}>
          <Navbar navBackground={navBackground} />
          <div className="body__contents">
            <Body headerBackground={headerBackground} />
          </div>
        </div>
      </div>
      <Footer />
    </Container>
  );
}

const Container = styled.div`
  max-width: 100vw;
  max-height: 100vh;
  overflow: hidden;
  display: grid;
  grid-template-rows: 85vh 15vh;
  .spotify__body {
    display: grid;
    grid-template-columns: 1fr;
    height: 100%;
    width: 100%;
    background: linear-gradient(transparent, rgba(0, 0, 0, 1));
    background-color: rgb(32, 70, 60);
    .body {
      height: 100%;
      width: 100%;
      overflow: auto;
      &::-webkit-scrollbar {
        width: 0.7rem;
      }
      &-thumb {
        background-color: rgba(255, 255, 255, 0.6);
      }
    }
  }
`;
