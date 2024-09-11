import React from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

function PieChartCard({ data, colors }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-md font-semibold mb-2">Streaming sources</h3>
      <div className="h-48">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PieChartCard;
