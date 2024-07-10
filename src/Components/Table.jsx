import React, { useState, useEffect } from "react";
import API from "../Api";
import Statistics from "./Statistics";
import ChartComponent from "./ChartComponent ";
import "./Style.css";

const Table = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState({
    month: "",
    year: "",
  });
  const [searchTransaction, setSearchTransaction] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [isMonthDisabled, setIsMonthDisabled] = useState(true);

  const paginate = (pageNumber) => {
    const newPage = Math.max(1, Math.min(pageNumber, totalPages));
    setCurrentPage(newPage);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await API.get();
        setData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [data, search, searchTransaction, currentPage]);

  useEffect(() => {
    const pages = Math.ceil(filteredData.length / itemsPerPage);
    setTotalPages(pages > 0 ? pages : 1);
    setCurrentPage(1);
  }, [filteredData, itemsPerPage]);

  const months = [
    { name: "January", value: "01" },
    { name: "February", value: "02" },
    { name: "March", value: "03" },
    { name: "April", value: "04" },
    { name: "May", value: "05" },
    { name: "June", value: "06" },
    { name: "July", value: "07" },
    { name: "August", value: "08" },
    { name: "September", value: "09" },
    { name: "October", value: "10" },
    { name: "November", value: "11" },
    { name: "December", value: "12" },
  ];

  const filterData = () => {
    let filtered = data;

    // Filter by year
    if (search.year !== "") {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.dateOfSale);
        return itemDate.getFullYear() === parseInt(search.year);
      });
      setIsMonthDisabled(false);
    }

    // Filter by month
    if (search.month !== "") {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.dateOfSale);
        return itemDate.getMonth() + 1 === parseInt(search.month);
      });
    }

    if (searchTransaction !== "") {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTransaction.toLowerCase()) ||
          item.price
            .toString()
            .toLowerCase()
            .includes(searchTransaction.toLowerCase()) ||
          item.description
            .toLowerCase()
            .includes(searchTransaction.toLowerCase())
      );
      setCurrentPage(1);
    }

    setFilteredData(filtered);
  };

  const handleChangeSearch = (e) => {
    const { name, value } = e.target;
    if (name === "year") {
      setSearch({ ...search, [name]: value, month: "06" });
      setIsMonthDisabled(false);
      setCurrentPage(1);
    } else {
      setSearch({ ...search, [name]: value });
      setCurrentPage(1);
    }
  };

  const handleSearchTransactionChange = (e) => {
    setSearchTransaction(e.target.value);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div id="main-conatiner">
      <div className="search">
        <div className="searchWithName">
          <input
            type="text"
            placeholder="Search transaction"
            value={searchTransaction}
            onChange={handleSearchTransactionChange}
          />
        </div>
        <div className="searchWithMonth">
          <select name="year" onChange={handleChangeSearch} value={search.year}>
            <option value="">Select Year</option>
            {Array.from(
              { length: 10 },
              (_, index) => new Date().getFullYear() - index
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            name="month"
            onChange={handleChangeSearch}
            value={search.month}
            disabled={isMonthDisabled}
          >
            <option value="">Select Month</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {filteredData.length === 0 ? (
        <div className>No records found.</div>
      ) : (
        <div className="table">
          <table border="1" cellSpacing="0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Sold</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.title}</td>
                  <td>{item.description.slice(0,120)}</td>
                  <td>{Math.round(item.price)}</td>
                  <td>{item.category}</td>
                  <td>{item.sold ? "True" : "false"}</td>
                  <td>
                    <img
                      src={item.image}
                      alt={item.title}
                      width="20px"
                      height="20px"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>
              {" "}
              Page {currentPage} of {totalPages}{" "}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
      <Statistics filteredData={filteredData} selectMonth={search.month} />
      <ChartComponent filteredData={filteredData} selectMonth={search.month} />
    </div>
  );
};

export default Table;
