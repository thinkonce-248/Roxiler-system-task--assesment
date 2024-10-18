import React, { useState, useEffect } from "react";
import axios from "axios";
// import "./TransactionsTable.css";  // Might need this later

const TransactionsTable = ({ month, setMonth }) => {
  const [txns, setTxns] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [currPage, setCurrPage] = useState(1);
  const [numPages, setNumPages] = useState(1);
  console.log('searchInput', searchInput);


  useEffect(() => {
    fetchTransactions();
  }, [month, currPage]);

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/transactions`, {
        params: {
          month: month === "All Months" ? undefined : month,
          searchText: searchInput,
          page: currPage,
        },
      });
      setTxns(res.data.transactions);
      setNumPages(res.data.totalPages);
    } catch (err) {
      console.error("something went wrong", err);
    }
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
    setCurrPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    // setCurrPage(1);
  };

  const handleNextPage = () => {
    if (currPage < numPages) {
      setCurrPage(currPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currPage > 1) {
      setCurrPage(currPage - 1);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search transactions"
            value={searchInput}
            onChange={handleSearchChange}
          />
        </div>
        <div className="col-4">
          {/* <button className="btn btn-danger mx-2" onClick={() => { setSearchInput(""), fetchTransactions() }} >Cancel</button> */}
          <button className="btn btn-primary" onClick={fetchTransactions} >Search</button>
        </div>
      </div>

      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
            <th>Category</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {txns?.length > 0 ? (
            txns?.map((transaction) => (
              <tr key={transaction._id}>
                <td>{transaction.id}</td>
                <td>{transaction.title}</td>
                <td>{transaction.description}</td>
                <td>{transaction.price}</td>
                <td>{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                <td>{transaction.category}</td>
                <td>{transaction.sold ? "Yes" : "No"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No transactions found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="d-flex justify-content-between">
        <button
          className="btn btn-primary"
          onClick={handlePreviousPage}
          disabled={currPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currPage} of {numPages}
        </span>
        <button
          className="btn btn-primary"
          onClick={handleNextPage}
          disabled={currPage === numPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionsTable;
