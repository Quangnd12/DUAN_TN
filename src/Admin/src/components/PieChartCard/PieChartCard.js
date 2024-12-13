import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function PieChartCard({ data, colors, title, loading }) {
  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-md font-semibold mb-2">{title}</h3>
        <div className="h-48 flex items-center justify-center">
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  const renderLegend = (props) => {
    const { payload } = props;
    return (
      <div className="flex flex-wrap justify-center gap-2 text-xs">
        {payload.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center">
            <div
              className="w-3 h-3 mr-1"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-md font-semibold mb-2">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={60}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend content={renderLegend} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-5 text-sm">
        <p className="text-gray-600">Total Genres: {data.length}</p>
        <p className="text-gray-600">
          Most Popular: {data[0]?.name || "N/A"} ({data[0]?.value || 0} songs)
        </p>
      </div>
    </div>
  );
}

export default PieChartCard;
