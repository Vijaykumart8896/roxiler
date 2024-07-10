import { useState, useEffect } from "react";

const Statistics = ({ filteredData, selectMonth, selectYear }) => {
  const [saleCount, setSaleCount] = useState(0);
  const [notSaleCount, setNotSaleCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [monthName, setMonthName] = useState("");


  useEffect(() => {
    if (selectMonth && selectMonth.value !== "") {
      setMonthName(getMonthName(selectMonth));
    }
  
  }, [selectMonth]);

  useEffect(() => {
    let sale = 0;
    let notSale = 0;
    let totalPrice = 0;

    filteredData.forEach((item) => {
      if (item.sold) {
        sale++;
      } else {
        notSale++;
      }
      totalPrice += item.price;
    });

    setSaleCount(sale);
    setNotSaleCount(notSale);
    setTotalPrice(totalPrice);
  }, [filteredData]);

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

  return (
    <div>
      <h1>Statistics</h1>
      <h2>
       {monthName} 
      </h2>
      <h2>Total Price: {Math.round(totalPrice)}</h2>
      <h2>Total Sold: {saleCount}</h2>
      <h2>Total Not Sold: {notSaleCount}</h2>
    </div>
  );
};

export default Statistics;
