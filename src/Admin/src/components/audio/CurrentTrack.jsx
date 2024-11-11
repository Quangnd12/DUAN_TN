import React from "react";
import styled from "styled-components";
import Marquee from "react-fast-marquee";


export default function CurrentTrack({ title, image, artist }) {
  const shouldUseMarquee = title.length > 35;

  return (
    <Container>
      <div className="track">
        <div className="track__image">
          <img src={image} alt={title} 
           onError={(e) => e.target.src = '/images/music.png'}
          />
        </div>
        <div className="track__info">
          <div style={{ width: '350px' }}>
            {shouldUseMarquee ? (
              <Marquee style={{ width: '100%' }} gap={0}>
                <h4 className="track__info__track__name">{title}</h4>
              </Marquee>
            ) : (
              <h4 className="track__info__track__name">{title}</h4>
            )}
          </div>
          {shouldUseMarquee ? (
            <Marquee style={{ width: '100%' }} gap={0}>
              <h6 className="track__info__track__artists">{artist}</h6>
            </Marquee>
          ) : (
            <h6 className="track__info__track__artists whitespace-nowrap overflow-hidden text-ellipsis w-[280px]">{artist}</h6>
          )}
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  .track {
    display: flex;
    align-items: center;
    gap: 1rem;
    position: absolute;

    &__image {
      img {
        width: 70px;
        height: 70px;
        border-radius: 5px;
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
