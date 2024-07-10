import axios from "axios";

const API = axios.create({
  baseURL: "https://s3.amazonaws.com/roxiler.com/product_transaction.json",
});

export default API;
