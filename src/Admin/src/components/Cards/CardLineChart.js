import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto"; // Sử dụng chart.js 3.x+

export default function CardLineChart() {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d");
      const config = {
        type: "line",
        data: {
          labels: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
          ],
          datasets: [
            {
              label: new Date().getFullYear(),
              backgroundColor: "#4c51bf",
              borderColor: "#4c51bf",
              data: [65, 78, 66, 44, 56, 67, 75],
              fill: false,
            },
            {
              label: new Date().getFullYear() - 1,
              fill: false,
              backgroundColor: "#fff",
              borderColor: "#fff",
              data: [40, 68, 86, 74, 56, 60, 87],
            },
          ],
        },
        options: {
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              labels: {
                color: "white",
              },
              align: "end",
              position: "bottom",
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
          },
          scales: {
            x: {
              ticks: {
                color: "rgba(255,255,255,.7)",
              },
              grid: {
                display: false,
                borderColor: "rgba(33, 37, 41, 0.3)",
                borderDash: [2],
                borderDashOffset: [2],
                color: "rgba(33, 37, 41, 0.3)",
                zeroLineColor: "rgba(0, 0, 0, 0)",
              },
            },
            y: {
              ticks: {
                color: "rgba(255,255,255,.7)",
              },
              grid: {
                borderColor: "rgba(255, 255, 255, 0.15)",
                borderDash: [3],
                borderDashOffset: [3],
                color: "rgba(255, 255, 255, 0.15)",
                zeroLineColor: "rgba(33, 37, 41, 0)",
                zeroLineBorderDash: [2],
                zeroLineBorderDashOffset: [2],
              },
            },
          },
        },
      };
      const myLineChart = new Chart(ctx, config);

      // Cleanup function to destroy the chart on component unmount
      return () => {
        if (myLineChart) {
          myLineChart.destroy();
        }
      };
    }
  }, []);

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700">
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h6 className="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
                Overview
              </h6>
              <h2 className="text-white text-xl font-semibold">Sales value</h2>
            </div>
          </div>
        </div>
        <div className="p-4 flex-auto">
          <div className="relative h-350-px">
            <canvas ref={chartRef}></canvas>
          </div>
        </div>
      </div>
    </>
  );
}
