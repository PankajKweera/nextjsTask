"use client"; 
import React, { useState, useEffect } from 'react';
import { getLocations, addLocation, updateLocation, deleteLocation } from '../Service/apiservice';

const DataTable = () => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [province, setProvince] = useState('');
  const [country, setCountry] = useState('');
  const [code, setCode] = useState('');
  const [editCode, setEditCode] = useState(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);

  const [sortConfig, setSortConfig] = useState({
    key: 'name', 
    direction: 'asc', 
  });
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLocations = filteredLocations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLocations.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const sortData = (locations) => {
    const { key, direction } = sortConfig;
    return [...locations].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  const handleSort = (column) => {
    let direction = 'asc';
    if (sortConfig.key === column && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key: column, direction });
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocations();
        const locationsArray = Object.keys(data).map(key => ({
          ...data[key], 
          code: key 
        }));
        setLocations(locationsArray);
        setFilteredLocations(locationsArray);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const filtered = Array.isArray(locations)
      ? locations.filter(location => 
          location.name.toLowerCase().includes(search.toLowerCase()) || 
          location.city.toLowerCase().includes(search.toLowerCase()) ||
          location.province.toLowerCase().includes(search.toLowerCase()) ||
          location.country.toLowerCase().includes(search.toLowerCase()) ||
          location.code.includes(search)
        )
      : [];
    setFilteredLocations(filtered);
  }, [search, locations]);

  const handleAddLocation = async () => {
    const newLocation = { name, city, province, country, code };
    try {
      const addedLocation = await addLocation(newLocation);
      setLocations([...locations, addedLocation]);
      setFilteredLocations([...filteredLocations, addedLocation]);
      clearForm();
    } catch (error) {
      console.error("Error adding location:", error);
    }
  };

  const handleUpdateLocation = async () => {
    const updatedLocation = { name, city, province, country, code };
    try {
      const updated = await updateLocation(editCode, updatedLocation); 
      setLocations(locations.map(loc => loc.code === editCode ? updated : loc));
      setFilteredLocations(filteredLocations.map(loc => loc.code === editCode ? updated : loc));
      clearForm();
      setEditCode(null);  
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  const handleDeleteLocation = async (code) => {
    try {
      await deleteLocation(code);
      setLocations(locations.filter(loc => loc.code !== code));
      setFilteredLocations(filteredLocations.filter(loc => loc.code !== code));
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  const handleEditLocation = (location) => {
    setName(location.name);
    setCity(location.city);
    setProvince(location.province);
    setCountry(location.country);
    setCode(location.code);
    setEditCode(location.code);
  };

  const clearForm = () => {
    setName('');
    setCity('');
    setProvince('');
    setCountry('');
    setCode('');
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Location Management</h1>
      <div style={styles.tableSearchContainer}>
        <input
          type="text"
          placeholder="Search locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      <div style={styles.tableBody}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.tableHeader} onClick={() => handleSort('name')}>Name</th>
              <th style={styles.tableHeader} onClick={() => handleSort('city')}>City</th>
              <th style={styles.tableHeader} onClick={() => handleSort('province')}>Province</th>
              <th style={styles.tableHeader} onClick={() => handleSort('country')}>Country</th>
              <th style={styles.tableHeader} onClick={() => handleSort('code')}>Code</th>
              <th style={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredLocations) && filteredLocations.length > 0 ? (
              sortData(currentLocations).map((location, index) => (
                <tr key={index} style={styles.tableRow}>
                  <td style={styles.tableData}>{location.name}</td>
                  <td style={styles.tableData}>{location.city}</td>
                  <td style={styles.tableData}>{location.province}</td>
                  <td style={styles.tableData}>{location.country}</td>
                  <td style={styles.tableData}>{location.code}</td>
                  <td style={styles.tableData}>
                    <button onClick={() => handleEditLocation(location)} style={styles.actionButton}>Edit</button>
                    <button onClick={() => handleDeleteLocation(location.code)} style={styles.actionButton}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={styles.noLocations}>No locations found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.paginationContainer}>
        <button 
          onClick={() => paginate(currentPage - 1)} 
          disabled={currentPage === 1}
          style={styles.paginationButton}
        >
          Prev
        </button>
        <span style={styles.pageNumber}>{currentPage} of {totalPages}</span>
        <button 
          onClick={() => paginate(currentPage + 1)} 
          disabled={currentPage === totalPages}
          style={styles.paginationButton}
        >
          Next
        </button>
      </div>

      <div style={styles.formContainer}>
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} style={styles.input} />
        <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} style={styles.input} />
        <input type="text" placeholder="Province" value={province} onChange={(e) => setProvince(e.target.value)} style={styles.input} />
        <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} style={styles.input} />
        <input type="text" placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} style={styles.input} />
        <button onClick={editCode ? handleUpdateLocation : handleAddLocation} style={styles.button}>
          {editCode ? 'Update' : 'Add'} Location
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '100%',
    height: '100%',
    overflow: scroll,

  },
  heading: {
    textAlign: 'center',
    color: '#333',
  
  },
  tableSearchContainer: {
    textAlign: 'center',
    maxWidth: '100%',
    marginBottom: '20px',
  },
  
  searchContainer: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  tableBody: {
    display: 'block', 
    maxHeight: '300px', 
    overflowY: 'auto', 
  },
  searchInput: {
    padding: '10px',
    fontSize: '16px',
    width: '100%',  // Make search input full width on mobile
    maxWidth: '600px',  // Set a max-width for larger screens
    borderRadius: '4px',
    border: '1px solid #ddd',
    margin: '0 auto',  // Center it on mobile screens
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
    alignItems: 'center',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    width: '100%',  
    maxWidth: '400px',  // Set a max-width for larger screens
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    width: '100%',
    maxWidth: '200px',  // Set a max-width for the button
    marginTop: '10px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  tableHeader: {
    padding: '10px',
    backgroundColor: '#f4f4f4',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
  },
  tableRow: {
    borderBottom: '1px solid #ddd',
  },
  tableData: {
    padding: '10px',
  },
  actionButton: {
    margin: '0 5px',
    padding: '5px 10px',
    backgroundColor: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  noLocations: {
    textAlign: 'center',
    padding: '10px',
    color: '#888',
  },
  paginationContainer: {

    textAlign: 'center',

    marginTop: '20px',

  },

  paginationButton: {

    padding: '10px 20px',

    backgroundColor: '#4CAF50',

    color: '#fff',

    border: 'none',

    borderRadius: '4px',

    cursor: 'pointer',

    margin: '0 10px',

  },

  pageNumber: {

    fontSize: '16px',

    margin: '0 10px',

  },
};

export default DataTable;

app/page.tsx
