"use client";
import { useState, useEffect, useRef } from "react";
import { fetchData, deleteItem, addItem, editItem } from '../Service/apiservice'

export default function DataTable() {
  const [data, setData] = useState({});
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState({});
  const debounceTimeoutRef = useRef(null);

  const handleSearch = (value) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      setSearch(value);
      setPage(1); 
    }, 300);
  };

  useEffect(() => {
    const fetchDataFromAPI = async () => {
      setLoading(true);
      setError(null);
      try {
        const queryParams = {
          _page: page,
          _limit: limit,
          _sort: sortBy,
          _order: sortOrder,
        };

        if (search.trim()) {
          queryParams.q = search.trim();
        }

        const data = await fetchData(queryParams);

        if (typeof data === "object" && !Array.isArray(data)) {
          const transformedData = Object.entries(data).map(([code, item]) => ({
            ...item,
            code,
          }));
          setData(data);
          setResults(transformedData);
        } else {
          setResults(data);
          const dataObject = data.reduce((acc, item) => {
            acc[item.code] = item;
            return acc;
          }, {});
          setData(dataObject);
        }
      } catch (error) {
        setError("Failed to fetch data. Please try again later.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataFromAPI();
  }, [search, sortBy, sortOrder, page, limit]);

  const handleDelete = async (code) => {
    setLoading(true);
    setError(null);
    try {
      const updatedData = await deleteItem(code, data);
      setData(updatedData);
      setResults(Object.keys(updatedData).map((key) => ({ ...updatedData[key], code: key })));
    } catch (error) {
      setError("Failed to delete item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    setLoading(true);
    setError(null);
    try {
      const updatedData = await addItem(newItem, data);
      setData(updatedData);
      setResults(Object.keys(updatedData).map((key) => ({ ...updatedData[key], code: key })));
      setNewItem({});
    } catch (error) {
      setError("Failed to add item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    setLoading(true);
    setError(null);
    try {
      const updatedData = await editItem(editingItem, data);
      setData(updatedData);
      setResults(Object.keys(updatedData).map((key) => ({ ...updatedData[key], code: key })));
      setEditingItem(null);
    } catch (error) {
      setError("Failed to edit item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (newSortBy) => {
    if (newSortBy === sortBy) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  const handlePagination = (newPage) => {
    if (newPage > 0) setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(parseInt(newLimit, 10));
    setPage(1); 
  };

  const handleEditChange = (e) => {
    setEditingItem({
      ...editingItem,
      [e.target.name]: e.target.value,
    });
  };

  const handleNewItemChange = (e) => {
    setNewItem({
      ...newItem,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-40">
      <div className="mb-20">
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search..."
          className="w-full p-2 border rounded"
        />
      </div>

      <div className="mb-4">
        <label className="mr-2">Items per page:</label>
        <select
          value={limit}
          onChange={(e) => handleLimitChange(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <div className="mb-2">
            Found {results.length} result{results.length !== 1 && "s"}
          </div>
          {results.length === 0 && <div>No results found</div>}

          <table className="w-full border-collapse border">
            <thead>
              <tr>
                {["name", "city", "country", "province"].map((field) => (
                  <th key={field} className="border p-2 bg-gray-50">
                    <button onClick={() => handleSort(field)}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}{" "}
                      {sortBy === field ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                    </button>
                  </th>
                ))}
                <th className="border p-2 bg-gray-50">Timezone</th>
                <th className="border p-2 bg-gray-50">Coordinates</th>
                <th className="border p-2 bg-gray-50">Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(results) && results.length > 0 ? (
                results.map((item) => (
                  <tr key={item.code} className="hover:bg-gray-50">
                    <td className="border p-2">{item.name}</td>
                    <td className="border p-2">{item.city}</td>
                    <td className="border p-2">{item.country}</td>
                    <td className="border p-2">{item.province}</td>
                    <td className="border p-2">{item.timezone}</td>
                    <td className="border p-2">
                      {item.coordinates ? `${item.coordinates[0]}, ${item.coordinates[1]}` : "N/A"}
                    </td>
                    <td className="border p-2">
                      <button
                        className="text-red-500"
                        onClick={() => handleDelete(item.code)}
                      >
                        Delete
                      </button>
                      <button
                        className="text-blue-500 ml-2"
                        onClick={() => setEditingItem(item)}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="border p-2 text-center">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-4">
            <button
              onClick={() => handlePagination(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded mr-2 disabled:opacity-50"
            >
              Prev
            </button>
            <span className="mx-2">Page {page}</span>
            <button
              onClick={() => handlePagination(page + 1)}
              disabled={results.length < limit}
              className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-xl mb-2">Add New Item</h2>
            <input
              type="text"
              name="code"
              value={newItem.code || ""}
              onChange={handleNewItemChange}
              placeholder="Code"
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              name="name"
              value={newItem.name || ""}
              onChange={handleNewItemChange}
              placeholder="Name"
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              name="city"
              value={newItem.city || ""}
              onChange={handleNewItemChange}
              placeholder="City"
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              name="country"
              value={newItem.country || ""}
              onChange={handleNewItemChange}
              placeholder="Country"
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              name="province"
              value={newItem.province || ""}
              onChange={handleNewItemChange}
              placeholder="Province"
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              name="timezone"
              value={newItem.timezone || ""}
              onChange={handleNewItemChange}
              placeholder="Timezone"
              className="w-full p-2 mb-2 border rounded"
            />
            <input
              type="text"
              name="coordinates"
              value={newItem.coordinates || ""}
              onChange={handleNewItemChange}
              placeholder="Coordinates"
              className="w-full p-2 mb-2 border rounded"
            />
            <button
              onClick={handleAdd}
              className="px-4 py-2 bg-green-500 text-white rounded mt-4"
            >
              Add Item
            </button>
          </div>

          {editingItem && (
            <div className="mt-6">
              <h2 className="text-xl mb-2">Edit Item</h2>
              <input
                type="text"
                name="name"
                value={editingItem.name || ""}
                onChange={handleEditChange}
                placeholder="Name"
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                name="city"
                value={editingItem.city || ""}
                onChange={handleEditChange}
                placeholder="City"
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                name="country"
                value={editingItem.country || ""}
                onChange={handleEditChange}
                placeholder="Country"
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                name="province"
                value={editingItem.province || ""}
                onChange={handleEditChange}
                placeholder="Province"
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                name="timezone"
                value={editingItem.timezone || ""}
                onChange={handleEditChange}
                placeholder="Timezone"
                className="w-full p-2 mb-2 border rounded"
              />
              <input
                type="text"
                name="coordinates"
                value={editingItem.coordinates || ""}
                onChange={handleEditChange}
                placeholder="Coordinates"
                className="w-full p-2 mb-2 border rounded"
              />
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-500 text-white rounded mt-4"
              >
                Save Changes
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
