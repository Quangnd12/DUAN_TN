import React from "react";

function StatCard({ icon, value, label, color }) {
  return (
    <div className={`p-4 rounded-lg ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-gray-600">{label}</div>
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  );
}

export default StatCard;