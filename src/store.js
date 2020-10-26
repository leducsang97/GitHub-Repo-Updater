import thunk from 'redux-thunk';
import { applyMiddleware, createStore } from 'redux';

const SET_CHANGE = 'SET_CHANGE';

const INITIAL_STATE = {
	newChange: false
};
const setChange = newChange => {
	return {
		type: SET_CHANGE,
		newChange: newChange
	};
};
function useRepoActions() {
	return {
		setChange: setChange
	};
}

//REDUCER
function reducer(state = INITIAL_STATE, action) {
	let newState = { ...state };
	switch (action.type) {
		case SET_CHANGE:
			newState.newChange = action.newChange;
			break;
		default:
			break;
	}
	return newState;
}

const store = createStore(reducer, applyMiddleware(thunk));

export { reducer, store, useRepoActions };
