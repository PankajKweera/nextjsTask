// "use client";

// import { useState, useEffect, useRef } from "react";

// export default function Home() {
//   const [data, setData] = useState([]);
//   const [results, setResults] = useState([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [sortBy, setSortBy] = useState("name"); // Default sort by name
//   const [sortOrder, setSortOrder] = useState("asc"); // Default ascending order
//   const [page, setPage] = useState(1); // Default to page 1
//   const [limit, setLimit] = useState(10); // Default items per page
//   const debounceTimeoutRef = useRef(null);

//   // Fetch data with sorting, filtering, and pagination
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const baseUrl = "http://localhost:3001/data";
//         let url = `${baseUrl}?_page=${page}&_limit=${limit}&_sort=${sortBy}&_order=${sortOrder}`;

//         // If there's a search query, include it in the URL
//         if (search.trim()) {
//           url += `&name_like=${encodeURIComponent(search)}`;
//         }

//         console.log("Fetching URL:", url); // Log to verify the URL

//         const response = await fetch(url);
//         const result = await response.json();

//         console.log("Received data:", result); // Log the fetched data

//         setData(result);
//         setResults(result);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError("Failed to fetch data. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [search, sortBy, sortOrder, page, limit]); // Re-fetch when any state changes

//   // Debounced search handler
//   const handleSearch = (pattern) => {
//     setSearch(pattern);

//     if (!pattern.trim()) {
//       setResults(data); // Reset to full data if no search query
//       return;
//     }
//   };

//   // Debounce search to avoid too many requests
//   useEffect(() => {
//     if (debounceTimeoutRef.current) {
//       clearTimeout(debounceTimeoutRef.current);
//     }

//     if (search.trim()) {
//       debounceTimeoutRef.current = setTimeout(() => {
//         handleSearch(search); // Trigger search after debounce
//       }, 300); // Delay (adjustable)
//     } else {
//       setResults(data); // Reset if search input is cleared
//     }

//     return () => clearTimeout(debounceTimeoutRef.current);
//   }, [search, data]);

//   // Handle sort change
//   const handleSort = (newSortBy) => {
//     if (newSortBy === sortBy) {
//       // Toggle sort order if the same column is clicked
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       // Change sort column and set to ascending order
//       setSortBy(newSortBy);
//       setSortOrder("asc");
//     }
//   };

//   // Handle pagination
//   const handlePagination = (newPage) => {
//     setPage(newPage);
//   };

//   return (
//     <div className="p-4">
//       <div className="mb-4">
//         <input
//           type="text"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           placeholder="Search by name..."
//           className="w-full p-2 border rounded"
//         />
//         <div className="text-sm text-gray-600 mt-1">
//           Searching for: {search || "showing all results"}
//         </div>
//       </div>

//       {loading ? (
//         <div>Loading...</div>
//       ) : error ? (
//         <div className="text-red-500">{error}</div>
//       ) : (
//         <>
//           <div className="mb-2">Found {results.length} result{results.length !== 1 && 's'}</div>

//           {results.length === 0 && <div>No results found</div>}

//           <table className="w-full border-collapse border">
//             <thead>
//               <tr>
//                 <th className="border p-2 bg-gray-50">
//                   <button onClick={() => handleSort("name")}>
//                     Name {sortBy === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
//                   </button>
//                 </th>
//                 <th className="border p-2 bg-gray-50">
//                   <button onClick={() => handleSort("age")}>
//                     Age {sortBy === "age" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
//                   </button>
//                 </th>
//                 <th className="border p-2 bg-gray-50">
//                   <button onClick={() => handleSort("location")}>
//                     Location {sortBy === "location" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
//                   </button>
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {results.map((item) => (
//                 <tr key={item.id} className="hover:bg-gray-50">
//                   <td className="border p-2">{item.name}</td>
//                   <td className="border p-2">{item.age}</td>
//                   <td className="border p-2">{item.location}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {/* Pagination Controls */}
//           <div className="mt-4">
//             <button
//               onClick={() => handlePagination(page - 1)}
//               disabled={page === 1}
//               className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
//             >
//               Prev
//             </button>
//             <button
//               onClick={() => handlePagination(page + 1)}
//               disabled={results.length < limit}
//               className="px-4 py-2 bg-blue-500 text-white rounded"
//             >
//               Next
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
"use client";

import { useState, useEffect, useRef } from "react";
import { getLocations, addLocation, updateLocation, deleteLocation } from '../src/Service/apiservice'

export default function Home() {
  const [data, setData] = useState([]);
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("name"); 
  const [sortOrder, setSortOrder] = useState("asc"); // Default ascending order
  const [page, setPage] = useState(1); // Default to page 1
  const [limit, setLimit] = useState(10); // Default items per page
  const debounceTimeoutRef = useRef(null);

  // Fetch data with sorting, filtering, and pagination
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const baseUrl = "http://localhost:3001/data"; 
        let url = `${baseUrl}?_page=${page}&_limit=${limit}&_sort=${sortBy}&_order=${sortOrder}`;

        // If there's a search query, include it in the URL
        if (search.trim()) {
          url += `&name_like=${encodeURIComponent(search)}`;
        }

        console.log("Fetching URL:", url); // Log to verify the URL

        const response = await fetch(url);
        const result = await response.json();

        console.log("Received data:", result);

        setData(result);
        setResults(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, sortBy, sortOrder, page, limit]); // Re-fetch when any state changes

  // Debounced search handler
  const handleSearch = (pattern) => {
    setSearch(pattern);

    if (!pattern.trim()) {
      setResults(data); // Reset to full data if no search query
      return;
    }
  };

  // Debounce search to avoid too many requests
  useEffect(() => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    if (search.trim()) {
      debounceTimeoutRef.current = setTimeout(() => {
        handleSearch(search); // Trigger search after debounce
      }, 300); // Delay (adjustable)
    } else {
      setResults(data); // Reset if search input is cleared
    }

    return () => clearTimeout(debounceTimeoutRef.current);
  }, [search, data]);

  // Handle sort change
  const handleSort = (newSortBy) => {
    if (newSortBy === sortBy) {
      // Toggle sort order if the same column is clicked
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Change sort column and set to ascending order
      setSortBy(newSortBy);
      setSortOrder("asc");
    }
  };

  // Handle pagination
  const handlePagination = (newPage) => {
    setPage(newPage);
  };

  // Handle items per page limit
  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page whenever limit is changed
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className="w-full p-2 border rounded"
        />
        <div className="text-sm text-gray-600 mt-1">
          Searching for: {search || "showing all results"}
        </div>
      </div>

      <div className="mb-4">
        {/* Limit per page */}
        <select
          value={limit}
          onChange={(e) => handleLimitChange(e.target.value)}
          className="p-2 border rounded"
        >
          <option value={10}>10 items per page</option>
          <option value={20}>20 items per page</option>
          <option value={30}>30 items per page</option>
        </select>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <>
          <div className="mb-2">Found {results.length} result{results.length !== 1 && 's'}</div>

          {results.length === 0 && <div>No results found</div>}

          <table className="w-full border-collapse border">
            <thead>
              <tr>
                <th className="border p-2 bg-gray-50">
                  <button onClick={() => handleSort("name")}>
                    Name {sortBy === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                  </button>
                </th>
                <th className="border p-2 bg-gray-50">
                  <button onClick={() => handleSort("city")}>
                    City {sortBy === "city" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                  </button>
                </th>
                <th className="border p-2 bg-gray-50">
                  <button onClick={() => handleSort("country")}>
                    Country {sortBy === "country" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                  </button>
                </th>
                <th className="border p-2 bg-gray-50">
                  <button onClick={() => handleSort("province")}>
                    Province {sortBy === "province" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                  </button>
                </th>
                <th className="border p-2 bg-gray-50">Timezone</th>
                <th className="border p-2 bg-gray-50">Coordinates</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item) => (
                <tr key={item.code} className="hover:bg-gray-50">
                  <td className="border p-2">{item.name}</td>
                  <td className="border p-2">{item.city}</td>
                  <td className="border p-2">{item.country}</td>
                  <td className="border p-2">{item.province}</td>
                  <td className="border p-2">{item.timezone}</td>
                  <td className="border p-2">
                    {item.coordinates ? `${item.coordinates[0]}, ${item.coordinates[1]}` : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="mt-4">
            <button
              onClick={() => handlePagination(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded mr-2"
            >
              Prev
            </button>
            <button
              onClick={() => handlePagination(page + 1)}
              disabled={results.length < limit}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
