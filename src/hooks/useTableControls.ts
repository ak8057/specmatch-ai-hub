import { useState, useMemo, useCallback } from 'react';
import { SortConfig, SortDirection } from '@/types';

interface UseTableControlsOptions<T> {
  data: T[];
  initialSortKey?: string;
  initialSortDirection?: SortDirection;
  itemsPerPage?: number;
  searchKeys?: (keyof T)[];
}

export function useTableControls<T extends Record<string, any>>({
  data,
  initialSortKey,
  initialSortDirection = 'asc',
  itemsPerPage = 10,
  searchKeys = [],
}: UseTableControlsOptions<T>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(
    initialSortKey ? { key: initialSortKey, direction: initialSortDirection } : null
  );
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Filter data
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchQuery && searchKeys.length > 0) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item =>
        searchKeys.some(key => {
          const value = item[key];
          return value && String(value).toLowerCase().includes(query);
        })
      );
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter(item => item[key] === value);
      }
    });

    return result;
  }, [data, searchQuery, searchKeys, filters]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const comparison = aVal < bVal ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  // Reset page when filters change
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handleFilter = useCallback((key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback((key: string) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  }, []);

  // CSV Export
  const exportToCSV = useCallback((filename: string, columns: { key: keyof T; label: string }[]) => {
    const headers = columns.map(col => col.label).join(',');
    const rows = sortedData.map(item =>
      columns.map(col => {
        const value = item[col.key];
        // Escape commas and quotes in CSV
        const stringValue = String(value ?? '');
        if (stringValue.includes(',') || stringValue.includes('"')) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      }).join(',')
    );

    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
  }, [sortedData]);

  return {
    // State
    searchQuery,
    currentPage,
    sortConfig,
    filters,
    totalPages,
    totalItems: sortedData.length,
    
    // Data
    paginatedData,
    sortedData,
    filteredData,
    
    // Actions
    setSearchQuery: handleSearch,
    setCurrentPage,
    setFilter: handleFilter,
    handleSort,
    exportToCSV,
  };
}
