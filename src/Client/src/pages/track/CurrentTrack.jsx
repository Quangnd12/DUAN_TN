import React, { useEffect, useState } from "react";
import styled from "styled-components";

export default function CurrentTrack() {
  const [currentPlaying, setCurrentPlaying] = useState(null);

  useEffect(() => {
    // Simulate fetching current playing track
    const fetchCurrentTrack = () => {
      // Hardcoded track data
      const track = {
        id: "1",
        name: "Đi Về Nhà",
        artists: ["Đen", "JustaTee"],
        image: "https://i.scdn.co/image/ab67616d000048512a8efe3bfa6a605fcf863237",
      };
      setCurrentPlaying(track);
    };

    fetchCurrentTrack();
  }, []);

  return (
    <Container>
      {currentPlaying && (
        <div className="track">
          <div className="track__image">
            <img src={currentPlaying.image} alt="currentPlaying" />
          </div>
          <div className="track__info">
            <h4 className="track__info__track__name">{currentPlaying.name}</h4>
            <h6 className="track__info__track__artists">
              {currentPlaying.artists.join(", ")}
            </h6>
          </div>
        </div>
      )}
    </Container>
  );
}

const Container = styled.div`
  .track {
    display: flex;
    align-items: center;
    gap: 1rem;
    &__image {
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
    &__info {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
      &__track__name {
        color: white;
      }
      &__track__artists {
        color: #b3b3b3;
      }
    }
  }
`;
