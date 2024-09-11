import React from "react";
import styled from "styled-components";


export default function CurrentTrack({ title,image,artist}) {

  return (
    <Container>
      <div className="track">
        <div className="track__image">
          <img src={image} alt={title} />
        </div>
        <div className="track__info">
          <h4 className="track__info__track__name">{title}</h4>
          <h6 className="track__info__track__artists">{artist}</h6>
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
