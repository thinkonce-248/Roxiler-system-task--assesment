const axio = require("axios");
const Sell = require("../models/SellsModel");
const moment = require("moment");

const dbInit = async (req, res) => {
  try {
    const resp = await axio.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    await Sell.deleteMany();
    await Sell.insertMany(resp.data);
    res.send("DB init done");
  } catch (er) {
    res.send("DB init error");
  }
};

const listTransactions = async (req, res) => {
  const { page, perPage = 10, searchText, month } = req.query;
  console.log('searchText', searchText);


  try {
    let transactions = await Sell.find();

    if (month) {
      const monthIndex = moment().month(month).month();
      if (!isNaN(monthIndex)) {
        transactions = transactions.filter((transaction) => {
          const date = moment(transaction.dateOfSale);
          return date.month() === monthIndex;
        });
      } else {
        return res.status(400).json({ error: "Invalid month format" });
      }
    }

    if (searchText) {
      const searchRegex = new RegExp(searchText, "i");
      transactions = transactions.filter((transaction) => {
        return (
          searchRegex.test(transaction.title) ||
          searchRegex.test(transaction.description) ||
          searchRegex.test(transaction.price.toString())
        );
      });
    }

    const totalCount = transactions.length;
    const totalPages = Math.ceil(totalCount / perPage);
    const paginatedTransactions = transactions.slice(
      (page - 1) * perPage,
      page * perPage
    );

    res.status(200).json({
      totalCount,
      totalPages,
      currentPage: Number(page),
      perPage: Number(perPage),
      transactions: paginatedTransactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching transactions" });
  }
};


const getStatistics = async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: "Month parameter is required" });
  }

  try {
    const transactions = await Sell.find();

    const targetMonth = moment().month(month).format("MMMM");

    const filteredTransactions = transactions.filter((transaction) => {
      const transactionMonth = moment(transaction.dateOfSale).format("MMMM");
      return transactionMonth === targetMonth;
    });

    const totalSales = filteredTransactions.reduce(
      (sum, t) => sum + t.price,
      0
    );
    const soldItems = filteredTransactions.filter((t) => t.sold).length;
    const notSoldItems = filteredTransactions.length - soldItems;

    res.status(200).json({
      totalSales,
      soldItems,
      notSoldItems,
    });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching statistics",
      details: error.message,
    });
  }
};

const getBarChart = async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: "Month parameter is required" });
  }

  try {
    const allTransactions = await Sell.find();

    const targetMonth = moment().month(month).format("MMMM");

    const filteredTransactions = allTransactions.filter((t) => {
      const saleMonth = moment(t.dateOfSale).format("MMMM");
      return saleMonth.toLowerCase() === targetMonth.toLowerCase();
    });

    const ranges = {
      "0-100": 0,
      "101-200": 0,
      "201-300": 0,
      "301-400": 0,
      "401-500": 0,
      "501-600": 0,
      "601-700": 0,
      "701-800": 0,
      "801-900": 0,
      "901-above": 0,
    };

    filteredTransactions.forEach((t) => {
      if (t.price <= 100) ranges["0-100"]++;
      else if (t.price <= 200) ranges["101-200"]++;
      else if (t.price <= 300) ranges["201-300"]++;
      else if (t.price <= 400) ranges["301-400"]++;
      else if (t.price <= 500) ranges["401-500"]++;
      else if (t.price <= 600) ranges["501-600"]++;
      else if (t.price <= 700) ranges["601-700"]++;
      else if (t.price <= 800) ranges["701-800"]++;
      else if (t.price <= 900) ranges["801-900"]++;
      else ranges["901-above"]++;
    });

    res.status(200).json(ranges);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching bar chart data",
      details: error.message,
    });
  }
};

const getPieChart = async (req, res) => {
  const { month } = req.query;

  if (!month) {
    return res.status(400).json({ error: "Month parameter is required" });
  }

  try {
    const allTransactions = await Sell.find();

    const targetMonth = moment().month(month).format("MMMM");

    const filteredTransactions = allTransactions.filter((t) => {
      const saleMonth = moment(t.dateOfSale).format("MMMM");
      return saleMonth.toLowerCase() === targetMonth.toLowerCase();
    });

    const categories = {};
    filteredTransactions.forEach((t) => {
      if (categories[t.category]) {
        categories[t.category]++;
      } else {
        categories[t.category] = 1;
      }
    });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching pie chart data",
      details: error.message,
    });
  }
};

const getCombinedData = async (req, res) => {
  const { month } = req.query;
  console.log("month", month);

  try {
    const statisticsResponse = await axios.get(
      `http://localhost:3000/api/statistics?month=${month}`
    );
    const barChartResponse = await axios.get(
      `http://localhost:3000/api/bar-chart?month=${month}`
    );
    const pieChartResponse = await axios.get(
      `http://localhost:3000/api/pie-chart?month=${month}`
    );

    const combinedData = {
      statistics: statisticsResponse.data,
      barChart: barChartResponse.data,
      pieChart: pieChartResponse.data,
    };

    res.status(200).json(combinedData);
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while fetching combined data",
      details: error.message,
    });
  }
};

module.exports = {
  dbInit,
  listTransactions,
  getBarChart,
  getPieChart,
  getCombinedData,
  getStatistics,
};
