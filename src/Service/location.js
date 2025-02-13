import fs from 'fs';
import path from 'path';

// Helper function to apply sorting, filtering, and pagination
const applyFilters = (data, { sortField, sortOrder, filter, page, limit }) => {
  // Filtering
  if (filter) {
    data = data.filter(location => 
      location.name.toLowerCase().includes(filter.toLowerCase()) ||
      location.city.toLowerCase().includes(filter.toLowerCase())
    );
  }

  // Sorting
  if (sortField) {
    data = data.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortField] < b[sortField] ? -1 : 1;
      }
      return a[sortField] > b[sortField] ? -1 : 1;
    });
  }

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedData = data.slice(startIndex, endIndex);

  return paginatedData;
};

export default function handler(req, res) {
  const filePath = path.resolve('data', 'locations.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Get query params
  const { filter = '', sortField = '', sortOrder = 'asc', page = 1, limit = 10 } = req.query;

  // Apply sorting, filtering, and pagination
  const filteredSortedPaginatedData = applyFilters(data, {
    filter,
    sortField,
    sortOrder,
    page: parseInt(page),
    limit: parseInt(limit),
  });

  // Send the filtered, sorted, and paginated data
  res.status(200).json({
    data: filteredSortedPaginatedData,
    total: data.length,
    page: parseInt(page),
    limit: parseInt(limit),
  });
}
