import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "./BarChart.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const BarChart = ({ month }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Number of Items",
        data: [],
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "#4ff1f1",
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    fetchBarChartData();
  }, [month]);

  const fetchBarChartData = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/bar-chart`, {
        params: { month },
      });
      const data = {
        labels: Object.keys(res.data),
        datasets: [
          {
            label: "Number of Items",
            data: Object.values(res.data),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
        ],
      };
      setChartData(data);
    } catch (error) {
      console.error("Error fetching barchart data : ", error);
    }
  };

  return (
    <div className="p-5">
      <h2>{`Bar Chart Stats - ${month}`}</h2>
      {chartData.labels.length > 0 ? (
        <Bar data={chartData} />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default BarChart;
