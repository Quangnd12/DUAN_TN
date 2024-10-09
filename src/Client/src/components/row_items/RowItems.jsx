import React from "react";
import { Link } from "react-router-dom";
import CircleCard from "../cards/CircleCard";
import RoundCard from "../cards/RoundCard";
import PlayPause from "../button/playPause";

const RowItems = ({
  title,
  data,
  rowId,
  globalPlayingState,
  setGlobalPlayingState,
}) => {
  const renderCard = (item, index, isArtist) => (
    <div key={item.id} className="relative group">
      <Link to={isArtist ? `/artist/${item.id}` : `/listalbum/${item.id}`}>
        {isArtist ? (
          <CircleCard image={item.image} name={item.name} title={item.title} />
        ) : (
          <RoundCard image={item.image} name={item.name} title={item.title} />
        )}
      </Link>
      <PlayPause
        rowId={rowId}
        index={index}
        globalPlayingState={globalPlayingState}
        setGlobalPlayingState={setGlobalPlayingState}
      />
    </div>
  );

  const artistItems = data.filter((item) => item.title === "Artist");
  const otherItems = data.filter((item) => item.title !== "Artist");

  const getShowAllLink = () => {
    if (title.toLowerCase().includes("artist")) {
      return "/artist";
    } else if (title.toLowerCase().includes("album")) {
      return "/allalbum";
    } else {
      return "/allsong";
    }
  };

  return (
    <div className="flex flex-col p-4 bg-zinc-900">
      <div className="flex justify-between mb-4">
        <h2 className="rowItemTitle">{title}</h2>
        <Link
          to={getShowAllLink()}
          className="rowItemSubTitle text-sky-500 font-bold cursor-pointer hover:text-white"
        >
          Show all
        </Link>
      </div>
      <div className="flex justify-between">
        {artistItems.map((item, index) => renderCard(item, index, true))}
        {otherItems.map((item, index) =>
          renderCard(item, index + artistItems.length, false)
        )}
      </div>
    </div>
  );
};

export default RowItems;
