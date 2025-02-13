import axios from 'axios';
const API_URL = 'http://localhost:3001/data';
export const getLocations = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log('Pppp->>>>>>>>>>>>>>>>>>>>>>>..',response);
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
};export const updateLocation = async (code, updatedLocation) => {
  try {
    console.log('Attempting to update location with code:', code); // Log the code to verify
    const response = await axios.put(`${API_URL}/${code}`, updatedLocation);
    console.log('Response received from server:', response); // Check the server response
    return response.data;
  } catch (error) {
    console.error('Error updating location:', error);
    throw new Error(`Error updating location: ${error.response ? error.response.data : error.message}`);
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



// import axios from 'axios';

// const API_URL = 'http://localhost:5000/locations';


// const transformResponseData = (data) => {
//   return Object.entries(data).map(([code, location]) => ({
//     ...location,
//     code: location.code || code // Use the location's code if available, otherwise use the key
//   }));
// };

// // Helper function to transform array data to nested format for POST/PUT
// const transformRequestData = (location) => {
//   const { code, ...locationData } = location;
//   return {
//     [code]: {
//       ...locationData,
//       code
//     }
//   };
// };

// export const getLocations = async (params = {}) => {
//   try {
//     const {
//       search = '',
//       page = 1,
//       limit = 15,
//       sortBy = 'name',
//       sortOrder = 'asc'
//     } = params;

//     const response = await axios.get(`${API_URL}`);
//     let locations = transformResponseData(response.data.locations);

//     // Client-side search (since we're using json-server)
//     if (search) {
//       const searchLower = search.toLowerCase();
//       locations = locations.filter(location => 
//         location.name?.toLowerCase().includes(searchLower) ||
//         location.city?.toLowerCase().includes(searchLower) ||
//         location.province?.toLowerCase().includes(searchLower) ||
//         location.country?.toLowerCase().includes(searchLower) ||
//         location.code?.toLowerCase().includes(searchLower)
//       );
//     }

//     // Client-side sorting
//     locations.sort((a, b) => {
//       const aValue = (a[sortBy] || '').toLowerCase();
//       const bValue = (b[sortBy] || '').toLowerCase();
//       return sortOrder === 'asc' 
//         ? aValue.localeCompare(bValue)
//         : bValue.localeCompare(aValue);
//     });

//     // Client-side pagination
//     const startIndex = (page - 1) * limit;
//     const endIndex = startIndex + limit;
//     const paginatedData = locations.slice(startIndex, endIndex);

//     return {
//       data: paginatedData,
//       pagination: {
//         total: locations.length,
//         totalPages: Math.ceil(locations.length / limit),
//         currentPage: page
//       }
//     };
//   } catch (error) {
//     throw new Error(`Error fetching locations: ${error.message}`);
//   }
// };

// export const addLocation = async (newLocation) => {
//   try {
//     const transformedData = transformRequestData(newLocation);
//     const response = await axios.post(API_URL, transformedData);
//     return response.data;
//   } catch (error) {
//     throw new Error(`Error adding location: ${error.message}`);
//   }
// };

// export const updateLocation = async (code, updatedLocation) => {
//   try {
//     const transformedData = transformRequestData({ ...updatedLocation, code });
//     const response = await axios.put(`${API_URL}/${code}`, transformedData);
//     return response.data;
//   } catch (error) {
//     throw new Error(`Error updating location: ${error.message}`);
//   }
// };

// export const deleteLocation = async (code) => {
//   try {
//     await axios.delete(`${API_URL}/${code}`);
//   } catch (error) {
//     throw new Error(`Error deleting location: ${error.message}`);
//   }
// };
