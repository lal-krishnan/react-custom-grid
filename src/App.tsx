import { useState } from 'react'
import GridComponent from "./GridComponent/GridComponent"
function App() {
  const columns = [
    { headerName: 'ID', field: 'id', sortable: true },
    { headerName: 'Name', field: 'name', filterable: true }, // Uses global options for sorting/filtering
    { headerName: 'Age', field: 'age', sortable: false }, // Overrides to disable sorting
    { headerName: 'City', field: 'city', filterable: true } // Overrides to enable filtering
  ];

  const rows = [
    { id: 1, name: 'John Doe', age: 28, city: 'New York' },
    { id: 2, name: 'Jane Smith', age: 34, city: 'San Francisco' },
    { id: 3, name: 'Sam Green', age: 22, city: 'Los Angeles' },
    { id: 11, name: 'John Doe', age: 28, city: 'New York' },
    { id: 12, name: 'Jane Smith', age: 34, city: 'San Francisco' },
    { id: 13, name: 'Sam Green', age: 22, city: 'Los Angeles' },
    { id: 21, name: 'John Doe', age: 28, city: 'New York' },
    { id: 22, name: 'Jane Smith', age: 34, city: 'San Francisco' },
    { id: 23, name: 'Sam Green', age: 22, city: 'Los Angeles' },
    { id: 31, name: 'John Doe', age: 28, city: 'New York' },
    { id: 32, name: 'Jane Smith', age: 34, city: 'San Francisco' },
    { id: 33, name: 'Sam Green', age: 22, city: 'Los Angeles' },
    { id: 41, name: 'John Doe', age: 28, city: 'New York' },
    { id: 42, name: 'Jane Smith', age: 34, city: 'San Francisco' },
    { id: 43, name: 'Sam Green', age: 22, city: 'Los Angeles' },
    { id: 51, name: 'John Doe', age: 28, city: 'New York' },
    { id: 52, name: 'Jane Smith', age: 34, city: 'San Francisco' },
    { id: 53, name: 'Sam Green', age: 22, city: 'Los Angeles' },
    { id: 61, name: 'John Doe', age: 28, city: 'New York' },
    { id: 62, name: 'Jane Smith', age: 34, city: 'San Francisco' },
    { id: 63, name: 'Sam Green', age: 22, city: 'Los Angeles' },
    { id: 71, name: 'John Doe', age: 28, city: 'New York' },
    { id: 72, name: 'Jane Smith', age: 34, city: 'San Francisco' },
    { id: 73, name: 'Sam Green', age: 22, city: 'Los Angeles' },
    
  ];

  const gridOptions = {
    sortable: true,
    filterable: false
  };
  return <>
      <GridComponent columns={columns} rows={rows} gridOptions={gridOptions} />
  </>
}

export default App
