import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const Progress = ({ level }) => {

  const maxLevel = 30;
  const limitedLevel = Math.min(level, maxLevel);  

  const color = limitedLevel > 15 ? "green" : limitedLevel > 5 ? "yellow" : "red";
  const textColor = color === "yellow" ? "black" : color;
  return (
    <div style={{ width: "70px", height: "70px" }}>
      <CircularProgressbar
        value={limitedLevel}
        maxValue={maxLevel} 
        text={`${limitedLevel} Day`}
        styles={buildStyles({
          textColor: textColor,
          pathColor: color,
          trailColor: "#d6d6d6", 
        })}
      />
    </div>
  );
};

export default Progress;
