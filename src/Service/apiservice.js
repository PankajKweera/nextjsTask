import axios from "axios";

const API_URL = "http://localhost:3001/data";

export const fetchData = async (params) => {
  try {
    const response = await axios.get(`${API_URL}?${new URLSearchParams(params)}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Failed to fetch data");
  }
};

export const deleteItem = async (code, data) => {
  try {
    const updatedData = { ...data };
    delete updatedData[code];

    await axios.put(API_URL, updatedData);
    return updatedData;
  } catch (error) {
    console.error("Error deleting item:", error);
    throw new Error("Failed to delete item");
  }
};

export const addItem = async (newItem, data) => {
  try {
    const updatedData = { ...data, [newItem.code]: newItem };

    await axios.put(API_URL, updatedData);
    return updatedData;
  } catch (error) {
    console.error("Error adding item:", error);
    throw new Error("Failed to add item");
  }
};

export const editItem = async (editingItem, data) => {
  try {
    const updatedData = { ...data, [editingItem.code]: editingItem };

    await axios.put(API_URL, updatedData);
    return updatedData;
  } catch (error) {
    console.error("Error editing item:", error);
    throw new Error("Failed to edit item");
  }
};
