const initialState = {
  recentSearches: [],
  nearByPark: '',
  isBottomSheetVisibleSearch: false,
};
function searchPark(state = initialState, action) {
  switch (action.type) {
    case 'SET_RECENT_SEARCH':
      return {
        ...state,
        recentSearches: action.payload, // update only the selectedOption
      };
    case 'SET_NEAR_BY_PARK':
      return {
        ...state,
        nearByPark: action.payload,
      };
    case 'SET_VISIBLE_SEARCH_BOTTOM_SHEET':
      return {
        ...state,
        isBottomSheetVisibleSearch: action.payload,
      };
    default:
      return state; // return current state for unknown action types
  }
}

module.exports = searchPark;
