import axios from 'axios';
const API_URL = 'http://localhost:3001/data';
export const getLocations = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log('Checkkk->>>>>>>>>>>>>>>>>>>>>>>..',response);
    return response.data; 
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};


export const addLocation = async (newLocation) => {
  try {
    const response = await axios.post(API_URL, newLocation);
    return response.data;
  } catch (error) {
    console.error('Error adding location:', error);
    throw error;
  }
};


export const updateLocation = async (code, updatedLocation) => {
  try {
    const response = await axios.put(`${API_URL}/${code}`, updatedLocation);
    console.log('RESPonse-----------------')
    return response.data;
  } catch (error) {
    console.error('Error updating location:', error);
    throw error;
  }
};


export const deleteLocation = async (code) => {
  try {
    await axios.delete(`${API_URL}/${code}`);
  } catch (error) {
    console.error('Error deleting location:', error);
    throw error;
  }
};
