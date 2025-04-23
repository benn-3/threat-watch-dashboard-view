
import { createSlice } from '@reduxjs/toolkit';

// Initial filters
const initialFilters = {
  severity: [],
  type: [],
  source: [],
  dateRange: {
    from: null,
    to: null,
  },
  searchQuery: '',
};

// Initial state
const initialState = {
  threats: [],
  filteredThreats: [],
  filters: initialFilters,
  selectedThreat: null,
  isLoading: false,
  error: null,
};

// Helper function to apply filters
const applyFilters = (threats, filters) => {
  return threats.filter(threat => {
    // Filter by severity
    if (filters.severity.length > 0 && !filters.severity.includes(threat.severity)) {
      return false;
    }

    // Filter by type
    if (filters.type.length > 0 && !filters.type.includes(threat.type)) {
      return false;
    }

    // Filter by source
    if (filters.source.length > 0 && !filters.source.includes(threat.source)) {
      return false;
    }

    // Filter by date range
    if (filters.dateRange.from && new Date(threat.dateAdded) < new Date(filters.dateRange.from)) {
      return false;
    }
    if (filters.dateRange.to && new Date(threat.dateAdded) > new Date(filters.dateRange.to)) {
      return false;
    }

    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      return (
        threat.indicator.toLowerCase().includes(query) ||
        threat.description.toLowerCase().includes(query) ||
        (threat.ip && threat.ip.toLowerCase().includes(query)) ||
        (threat.domain && threat.domain.toLowerCase().includes(query)) ||
        (threat.url && threat.url.toLowerCase().includes(query)) ||
        (threat.hash && threat.hash.toLowerCase().includes(query)) ||
        (threat.location?.country.toLowerCase().includes(query))
      );
    }

    return true;
  });
};

const threatSlice = createSlice({
  name: 'threats',
  initialState,
  reducers: {
    fetchThreatsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchThreatsSuccess: (state, action) => {
      state.isLoading = false;
      state.threats = action.payload;
      state.filteredThreats = action.payload;
    },
    fetchThreatsFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredThreats = applyFilters(state.threats, state.filters);
    },
    resetFilters: (state) => {
      state.filters = initialFilters;
      state.filteredThreats = state.threats;
    },
    selectThreat: (state, action) => {
      state.selectedThreat = state.threats.find(threat => threat.id === action.payload) || null;
    },
    clearSelectedThreat: (state) => {
      state.selectedThreat = null;
    }
  },
});

export const { 
  fetchThreatsStart, 
  fetchThreatsSuccess, 
  fetchThreatsFailure,
  setFilters,
  resetFilters,
  selectThreat,
  clearSelectedThreat
} = threatSlice.actions;

export default threatSlice.reducer;
