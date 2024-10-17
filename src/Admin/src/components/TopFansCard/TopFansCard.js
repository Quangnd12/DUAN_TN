import React from "react";

function TopFansCard() {
  const fans = [
    { name: "Annette Watson", hours: 9.3 },
    { name: "Calvin Steward", hours: 8.9 },
    { name: "Ralph Richards", hours: 8.7 },
    { name: "Bernard Murphy", hours: 8.2 },
    { name: "Arlene Robertson", hours: 8.2 },
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-md font-semibold mb-2">Top users this week</h3>
      {fans.map((fan, index) => (
        <div key={index} className="flex justify-between items-center mb-1">
          <span>{fan.name}</span>
          <span>{fan.hours}h</span>
        </div>
      ))}
    </div>
  );
}

export default TopFansCard;
