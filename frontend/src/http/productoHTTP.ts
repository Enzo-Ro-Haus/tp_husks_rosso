import axios from "axios";
import { IProducto } from "../types/IProducto";

const API_URL = "http://localhost:9000/public/producto";

export const getAllProductos = async () => {
  try {
    const response: any = await axios.get<IProducto>(API_URL);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
