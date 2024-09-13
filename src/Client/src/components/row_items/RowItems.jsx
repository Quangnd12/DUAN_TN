import React from "react";
import CircleCard from "../cards/CircleCard";
import RoundCard from "../cards/RoundCard";
// import { Link } from "react-router-dom";

const RowItems = ({ title, data }) => {
  return (
    <div className="flex flex-col p-4 bg-zinc-900 rounded-md">
      <div className="flex justify-between">
        <h2 className="rowItemTitle">{title}</h2>
        <span className="rowItemSubTitle">Show all</span>
      </div>
      <div className="flex justify-between">
        {data.map(item =>
          item.title === "Artist" ? (
            <CircleCard
              key={item.id}
              image={item.image}
              name={item.name}
              title={item.title}
            />
          ) : (
            <RoundCard
              key={item.id}
              image={item.image}
              name={item.name}
              title={item.title}
            />
          ),
        )}
      </div>
     
    </div>
  );
};

export default RowItems;
