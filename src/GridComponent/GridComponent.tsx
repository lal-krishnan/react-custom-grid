import { Row, Column, GridOptions } from './types';
import React, { useState } from 'react';
import './GridComponent.css';
interface GridComponentProps {
  columns: Column[];
  rows: Row[];
  gridOptions?: GridOptions;
}
const GridComponent: React.FC<GridComponentProps> = ({ columns: initialColumns, rows: initialRows, gridOptions }) => {
  const [columns, setColumns] = useState(initialColumns);
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [sortConfig, setSortConfig] = useState<{ field: string; direction: 'asc' | 'desc' | null }>({ field: '', direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(0);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const pageSize = gridOptions?.pageSize || 10; // Default to 10 rows per page
  const totalPages = Math.ceil(rows.length / pageSize);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(Math.min(Math.max(newPage, 1), totalPages));
  };

  const currentRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleFilterChange = (field: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: value
    }));

    const filteredRows = initialRows.filter((row) =>
      columns.every((col) => {
        const filterValue = filters[col.field];
        return filterValue
          ? row[col.field].toString().toLowerCase().includes(filterValue.toLowerCase())
          : true;
      })
    );
    setRows(filteredRows);
    setCurrentPage(1); // Reset to the first page after filtering
  };

  const handleClearFilter = (field: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [field]: ''
    }));
    setRows(initialRows);
    setCurrentPage(1); // Reset to the first page after clearing filter
  };

  const handleSort = (field: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';

    if (sortConfig.field === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.field === field && sortConfig.direction === 'desc') {
      direction = null;
    }

    setSortConfig({ field, direction });

    if (direction) {
      const sortedRows = [...rows].sort((a, b) => {
        if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
        if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
        return 0;
      });
      setRows(sortedRows);
    } else {
      setRows(initialRows);
    }
  };

  const handleMouseDown = (e: React.MouseEvent, field: string, initialWidth: number) => {
    setResizingColumn(field);
    setStartX(e.clientX);
    setStartWidth(initialWidth);
    e.stopPropagation();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (resizingColumn) {
      const deltaX = e.clientX - startX;
      const newWidth = startWidth + deltaX;

      setColumns((prevColumns) =>
        prevColumns.map((col) =>
          col.field === resizingColumn ? { ...col, width: Math.max(newWidth, 50) } : col
        )
      );
    }
  };

  const handleMouseUp = () => {
    setResizingColumn(null);
  };

  React.useEffect(() => {
    if (resizingColumn) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingColumn]);
  const handleSelectRow = (rowId: number) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(rowId) ? prevSelected.filter(id => id !== rowId) : [...prevSelected, rowId]
    );
  };

  const handleSelectAllRows = () => {
    if (selectedRows.length === currentRows.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentRows.map(row => row.id));
    }
  };
  return (
    <div className="grid-container">
      {/* Grid Header with Sort, Filter, and Resize */}
      <div className="grid-header">
      <div className="grid-header-cell">
          <input
            type="checkbox"
            checked={selectedRows.length === currentRows.length && currentRows.length > 0}
            onChange={handleSelectAllRows}
          />
        </div>
        {columns.map((col, index) => {
          const isSortable = col.sortable ?? gridOptions?.sortable ?? false;
          const isFilterable = col.filterable ?? gridOptions?.filterable ?? false;

          return (
            <div
              className="grid-header-cell"
              key={index}
              style={{ width: col.width || 150 }}
              onClick={() => isSortable && handleSort(col.field)}
            >
              {col.headerName}
              {isSortable && sortConfig.field === col.field && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
              {isFilterable && (
                <div className="filter-container">
                  <input
                    type="text"
                    placeholder={`Filter ${col.headerName}`}
                    value={filters[col.field] || ''}
                    onChange={(e) => handleFilterChange(col.field, e.target.value)}
                    className="grid-filter-input"
                    onClick={(e) => e.stopPropagation()} // Stop the click event from propagating
                  />
                  <button onClick={() => handleClearFilter(col.field)} className="clear-filter-button">
                    Clear
                  </button>
                </div>
              )}
              <div
                className="resize-handle"
                onMouseDown={(e) => handleMouseDown(e, col.field, col.width || 150)}
              />
            </div>
          );
        })}
      </div>

      {/* Grid Rows */}
      <div className="grid-rows">
        {currentRows.map((row, rowIndex) => (
          <div  className={`grid-row ${selectedRows.includes(row.id) ? 'selected' : ''}`} key={rowIndex}>
            <div className="grid-cell">
              <input
                type="checkbox"
                checked={selectedRows.includes(row.id)}
                onChange={() => handleSelectRow(row.id)}
              />
            </div>
            {columns.map((col, colIndex) => (
              <div className="grid-cell" key={colIndex} style={{ width: col.width || 150 }}>
                {row[col.field]}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>First</button>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
        <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>Last</button>
      </div>
    </div>
  );
};

export default GridComponent;