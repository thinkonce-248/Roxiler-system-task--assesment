import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Statistics = ({ month }) => {
  const [statistics, setStatistics] = useState({
    totalSales: 0,
    soldItems: 0,
    notSoldItems: 0,
  });

  useEffect(() => {
    fetchStatistics();
  }, [month]);

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/statistics`, {
        params: { month },
      });
      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching statistics", error);
    }
  };

  return (
    <div
      className="card text-black mt-4"
      style={{ backgroundColor: "rgba(98, 212, 212, 0.6)" }}
    >
      <div className="card-body">
        <h5 className="card-title">Statistics for {month}</h5>
        <p className="card-text">Total Sales: {statistics.totalSales}</p>
        <p className="card-text">Sold Items: {statistics.soldItems}</p>
        <p className="card-text">Not Sold Items: {statistics.notSoldItems}</p>
      </div>
    </div>
  );
};

export default Statistics;
