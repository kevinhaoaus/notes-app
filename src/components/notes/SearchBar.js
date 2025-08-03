'use client';

import React, { useState, useEffect } from 'react';
import { useNotes } from '../../hooks/useNotes';

export default function SearchBar() {
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { 
    searchTerm, 
    setSearchTerm, 
    sortBy, 
    sortOrder, 
    setSorting,
    selectedColor,
    setColorFilter,
    getAllTags
  } = useNotes();

  // Debounced search
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setSearchTerm(localSearchTerm);
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [localSearchTerm, setSearchTerm]);

  // Initialize local search term
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSortChange = (newSortBy) => {
    setSorting(newSortBy);
  };

  const sortOptions = [
    { value: 'updatedAt', label: 'Last Modified' },
    { value: 'createdAt', label: 'Date Created' },
    { value: 'title', label: 'Title' }
  ];

  const colorOptions = [
    { value: '', label: 'All colors' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'pink', label: 'Pink' },
    { value: 'purple', label: 'Purple' },
    { value: 'gray', label: 'Gray' }
  ];

  return (
    <div className="mb-6 space-y-4">
      {/* Search input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          placeholder="Search notes..."
          className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        
        {/* Clear search button */}
        {localSearchTerm && (
          <button
            onClick={() => setLocalSearchTerm('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filters and sorting */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
          </svg>
          <span>Filters</span>
          {showFilters && <span className="text-xs">(Open)</span>}
        </button>

        {/* Sort dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          {/* Sort order indicator */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
            <svg 
              className={`w-4 h-4 text-gray-400 transition-transform ${sortOrder === 'asc' ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Extended filters */}
      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Color filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Color
              </label>
              <select 
                value={selectedColor}
                onChange={(e) => setColorFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {colorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Available tags info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available Tags
              </label>
              <div className="text-sm text-gray-600 bg-white border border-gray-300 rounded-md px-3 py-2">
                {getAllTags().length > 0 ? (
                  <span>{getAllTags().slice(0, 3).join(', ')}{getAllTags().length > 3 ? '...' : ''}</span>
                ) : (
                  <span>No tags yet</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}