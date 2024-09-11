import React from "react";

const ArtistCover = () => {
  return (
    <img
      src="../assets/img/CoverArtist.jpg"
      alt="Artist Cover"
      className="absolute top-0 contrast-50 left-0 w-full h-4/5 object-cover rounded"
      style={{
        aspectRatio: "1/1",
        imageRendering: "auto",
      }}
    />
  );
};

export default ArtistCover;
