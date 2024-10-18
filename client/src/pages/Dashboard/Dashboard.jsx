import React, { useState } from "react";
import TransactionsTable from "../../components/TransactionsTable/TransactionsTable";
import Statistics from "../../components/Statistics/Statistics";
import BarChart from "../../components/BarChart/BarChart";

const Dashboard = () => {
  const [month, setMonth] = useState("March");

  const handleMonthChange = (e) => setMonth(e.target.value);

  return (
    <div>
      <h1>Transactions Dashboard</h1>

      <div className="row">
        <div className="col-4 mt-4 ">
          <label>Select Month :  </label>
          <select className="mx-2" value={month} onChange={handleMonthChange}>
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ]?.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className="col-8">
          <Statistics month={month} />
        </div>
      </div>

      <TransactionsTable month={month} setMonth={setMonth} />
      <BarChart month={month} />
    </div>
  );
};

export default Dashboard;
