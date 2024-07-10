import { useState, useEffect } from "react";
import Chart from "react-apexcharts";

const ChartComponent = ({ selectMonth, filteredData }) => {
  const [monthName, setMonthName] = useState("");

  useEffect(() => {
    if (selectMonth && selectMonth.value !== "") {
      setMonthName(getMonthName(selectMonth));
    }
  }, [selectMonth]);

  const getMonthName = (value) => {
    const Month = [
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

    const selectedMonth = Month.find((month) => month.value === value);
    return selectedMonth ? selectedMonth.name : "";
  };

  const [state, setState] = useState({
    options: {
      chart: {
        id: "basic-bar",
      },
      xaxis: {
        categories: [
          "0-100",
          "101-200",
          "201-300",
          "301-400",
          "401-500",
          "501-600",
          "601-700",
          "701-800",
          "801-900",
          "901 and above",
        ],
      },
    },
    series: [
      {
        name: "Price Range",
        data: [],
      },
    ],
  });

  useEffect(() => {
    if (filteredData && filteredData.length > 0) {
      const priceRanges = {
        "0-100": 0,
        "101-200": 0,
        "201-300": 0,
        "301-400": 0,
        "401-500": 0,
        "501-600": 0,
        "601-700": 0,
        "701-800": 0,
        "801-900": 0,
        "901 and above": 0,
      };

      filteredData.forEach((item) => {
        const priceRange = categorizePriceRange(item.price);
        priceRanges[priceRange] += 1;
      });

      const newData = {
        ...state,
        series: [
          {
            name: "Price Range",
            data: Object.values(priceRanges),
          },
        ],
      };

      setState(newData);
    }
  }, [filteredData]);

  const categorizePriceRange = (price) => {
    // Function to categorize price into ranges
    if (price >= 0 && price <= 100) {
      return "0-100";
    } else if (price > 100 && price <= 200) {
      return "101-200";
    } else if (price > 200 && price <= 300) {
      return "201-300";
    } else if (price > 300 && price <= 400) {
      return "301-400";
    } else if (price > 400 && price <= 500) {
      return "401-500";
    } else if (price > 500 && price <= 600) {
      return "501-600";
    } else if (price > 600 && price <= 700) {
      return "601-700";
    } else if (price > 700 && price <= 800) {
      return "701-800";
    } else if (price > 800 && price <= 900) {
      return "801-900";
    } else {
      return "901 and above";
    }
  };

  return (
    <div>
      <h1>BAR Chart</h1>
      <h2>{monthName}</h2>

      <Chart
        options={state.options}
        series={state.series}
        type="bar"
        width="500"
      />
    </div>
  );
};

export default ChartComponent;
