import React from "react";
import CircleCard from "../cards/CircleCard";
import RoundCard from "../cards/RoundCard";
import { Link } from "react-router-dom";

const RowItems = ({ title, data }) => {
  return (
    <div className="flex flex-col p-4 bg-zinc-900">
      <div className="flex justify-between mb-4">
        <h2 className="rowItemTitle">{title}</h2>
        <Link to={"/artist"} className="rowItemSubTitle">Show all</Link>
      </div>
      <div className="flex justify-between">
        {data.map(item =>
          item.title === "Artist" ? (
            <Link key={item.id} to={`/artist/${item.id}`}>
              <CircleCard
                image={item.image}
                name={item.name}
                title={item.title}
              />
            </Link>
          ) : (
            <Link key={item.id} to={`/listalbum/${item.id}`}>
              <RoundCard
                image={item.image}
                name={item.name}
                title={item.title}
              />
            </Link>
          ),
        )}
      </div>
    </div>
  );
};

export default RowItems;
