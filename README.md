# Next.js Data Table

This is a Next.js project that demonstrates a dynamic and reusable Data Table component, capable of handling sorting, pagination, search, and full CRUD operations (Add, Edit, Delete).

## Features

- **Reusable Components**: The Data Table is built using modular components that can be reused across different parts of the application.
- **CRUD Operations**: Add, Edit, and Delete items directly from the table.
- **Sorting and Pagination**: Sort by columns and navigate through pages.
- **Search**: A debounced search functionality to filter data in real-time.

searching sorting  are serverside-----------

GET /data?_page=1&_limit=10&_sort=name&_order=asc 200 10.200 ms - -
GET /data?_page=1&_limit=10&_sort=name&_order=asc 200 7.264 ms - -
GET /data?_page=1&_limit=10&_sort=name&_order=asc 2000 11.812 ms -





## Reusable Components

### 1. `DataTable`
This is the main component that displays the data in a table format. It manages the sorting, pagination, and CRUD operations. It uses the following smaller components:
- `TableHeader`: Displays the column names and handles sorting.
- `TableRow`: Represents each row of data with edit and delete buttons.
- `Pagination`: Handles pagination with options to go to the next or previous page.
- `SearchBar`: Allows users to search through the data.

### 2. `TableHeader`
This component renders the header of the table, including column names and sort buttons. It ensures that sorting can be performed by clicking the column names.

### 3. `TableRow`
Represents a row in the table with data and provides edit and delete buttons for managing items.

### 4. `Pagination`
Handles pagination for the data table, allowing users to move between pages.

### 5. `SearchBar`
A search input that uses debounce to reduce the number of requests when filtering the data.

## Setup

To get started, clone this repository and install the dependencies:

```bash
git clone <repository-url>
cd <repository-folder>
npm install
# or
yarn install
