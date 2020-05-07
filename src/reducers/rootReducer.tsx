/* ----------------------- SECTION node mudule import ----------------------- */
import { combineReducers } from 'redux';
import promptReducer from './promptReducer';
import filesReducer from './filesReducer';
/* ------------------------ SECTION regester reducer ------------------------ */
const rootReducer = combineReducers({
    promptReducer,
    filesReducer
});

export default rootReducer;