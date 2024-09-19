const initialState = {
  selectedOption: [
    { key: 'car', value: 'Parken' },
    { key: 'Charging-Stations', value: 'Laden' },
    { key: 'bike', value: 'Bike-Stations' },
  ],
};
function mapParkSelectSlice(state = initialState, action) {
  switch (action.type) {
    case 'SET_SELECTED_OPTION':
      return {
        ...state,
        selectedOption: action.payload, // update only the selectedOption
      };
    default:
      return state; // return current state for unknown action types
  }
}

module.exports = mapParkSelectSlice;
