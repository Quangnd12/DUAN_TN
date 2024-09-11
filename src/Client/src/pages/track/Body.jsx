import React, { useEffect } from "react";
import styled from "styled-components";
import { useStateProvider } from "../../utils/StateProvider";
import { AiFillClockCircle } from "react-icons/ai";
import { reducerCases } from "../../utils/Constants";

export default function Body({ headerBackground }) {
  const [{ selectedPlaylist, selectedPlaylistId }, dispatch] = useStateProvider();

  useEffect(() => {
    const playlistData = {
      id: "37i9dQZF1DXcBWIGoYBM5M",
      name: "Today's Top Hits",
      description: "The biggest hits of today.",
      image: "https://i.scdn.co/image/ab67616d00001e0238881a83135ef5b4ace418ba",
      tracks: [
        {
          id: "3n3Ppam7vgaVa1iaRUc9Lp",
          name: "Blinding Lights",
          artists: ["The Weeknd"],
          image: "https://cdn.tgdd.vn/2020/08/content/cach-chen-nhac-va-loi-bai-hat-lyric-vao-anh-tren-dien-thoaia-12-490x1020.jpg",
          duration: 200040,
          album: "After Hours",
          context_uri: "spotify:album:4yP0hdKOZPNshxUOjY0cZj",
          track_number: 1,
        },
        {
          id: "7qiZfU4dY1lWllzX7mPBI3",
          name: "Watermelon Sugar",
          artists: ["Harry Styles"],
          image: "https://i.scdn.co/image/ab67616d00001e0277fdcfda6535601aff081b6a",
          duration: 174000,
          album: "Fine Line",
          context_uri: "spotify:album:2kRbbXj7AxXaqgL3JEr2F4",
          track_number: 2,
        },
        {
          id: "6LOfOUpXBkO59RjG9MTp3Q",
          name: "Good 4 U",
          artists: ["Olivia Rodrigo"],
          image: "https://i.scdn.co/image/ab67616d00001e02a91c10fe9472d9bd89802e5a",
          duration: 200000,
          album: "SOUR",
          context_uri: "spotify:album:1j9FefMwJszmJ5XzH7AfqH",
          track_number: 3,
        },
        {
          id: "1Xl8W4xZef4qjZISYbMQhb",
          name: "Levitating",
          artists: ["Dua Lipa"],
          image: "https://i.scdn.co/image/ab67616d00001e024bc66095f8a70bc4e6593f4f",
          duration: 203000,
          album: "Future Nostalgia",
          context_uri: "spotify:album:2M9THNSkB2AcdI8AWk6K9R",
          track_number: 4,
        },
        {
          id: "4aX14Hzt9JXnZwH6bPsw6y",
          name: "Save Your Tears",
          artists: ["The Weeknd"],
          image: "https://i.scdn.co/image/ab67616d00001e028863bc11d2aa12b54f5aeb36",
          duration: 215000,
          album: "After Hours",
          context_uri: "spotify:album:4aT5fZpZetXzJgwSgzRjb9",
          track_number: 5,
        },
      ],
    };

    dispatch({ type: reducerCases.SET_PLAYLIST, selectedPlaylist: playlistData });
  }, [dispatch, selectedPlaylistId]);

  const playTrack = (id, name, artists, image, context_uri, track_number) => {
    const currentPlaying = {
      id,
      name,
      artists,
      image,
    };
    dispatch({ type: reducerCases.SET_PLAYING, currentPlaying });
    dispatch({ type: reducerCases.SET_PLAYER_STATE, playerState: true });
  };

  const msToMinutesAndSeconds = (ms) => {
    var minutes = Math.floor(ms / 60000);
    var seconds = ((ms % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  };

  return (
    <Container headerBackground={headerBackground}>
      {selectedPlaylist && (
        <>
          <div className="playlist">
            <div className="image">
              <img src={selectedPlaylist.image} alt="selected playlist" />
            </div>
            <div className="details">
              <span className="type">PLAYLIST</span>
              <h1 className="title">{selectedPlaylist.name}</h1>
              <p className="description">{selectedPlaylist.description}</p>
            </div>
          </div>
          <div className="list">
            <div className="header-row">
              <div className="col">
                <span>#</span>
              </div>
              <div className="col">
                <span>TITLE</span>
              </div>
              <div className="col">
                <span>ALBUM</span>
              </div>
              <div className="col">
                <span>
                  <AiFillClockCircle />
                </span>
              </div>
            </div>
            <div className="tracks">
              {selectedPlaylist.tracks.map(
                (
                  {
                    id,
                    name,
                    artists,
                    image,
                    duration,
                    album,
                    context_uri,
                    track_number,
                  },
                  index
                ) => {
                  return (
                    <div
                      className="row"
                      key={id}
                      onClick={() =>
                        playTrack(
                          id,
                          name,
                          artists,
                          image,
                          context_uri,
                          track_number
                        )
                      }
                    >
                      <div className="col">
                        <span>{index + 1}</span>
                      </div>
                      <div className="col detail">
                        <div className="image">
                          <img src={image} alt="track" />
                        </div>
                        <div className="info">
                          <span className="name">{name}</span>
                          <span>{artists.join(", ")}</span>
                        </div>
                      </div>
                      <div className="col">
                        <span>{album}</span>
                      </div>
                      <div className="col">
                        <span>{msToMinutesAndSeconds(duration)}</span>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </>
      )}
    </Container>
  );
}

const Container = styled.div`
  .playlist {
    margin: 0 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    .image {
      img {
        height: 15rem;
        box-shadow: rgba(0, 0, 0, 0.25) 0px 25px 50px -12px;
      }
    }
    .details {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      color: #e0dede;
      .title {
        color: white;
        font-size: 4rem;
      }
    }
  }
  .list {
    .header-row {
      display: grid;
      grid-template-columns: 0.3fr 3fr 2fr 0.1fr;
      margin: 1rem 0 0 0;
      color: #dddcdc;
      position: sticky;
      top: 15vh;
      padding: 1rem 3rem;
      transition: 0.3s ease-in-out;
      background-color: ${({ headerBackground }) =>
    headerBackground ? "#000000dc" : "none"};
    }
    .tracks {
      margin: 0 2rem;
      display: flex;
      flex-direction: column;
      margin-bottom: 5rem;
      .row {
        padding: 0.5rem 1rem;
        display: grid;
        grid-template-columns: 0.3fr 3.1fr 2fr 0.1fr;
        &:hover {
          background-color: rgba(0, 0, 0, 0.7);
        }
        .col {
          display: flex;
          align-items: center;
          color: #dddcdc;
          img {
            height: 40px;
            width: 40px;
          }
        }
        .detail {
          display: flex;
          gap: 1rem;
          .info {
            display: flex;
            flex-direction: column;
          }
        }
      }
    }
  }
`;
