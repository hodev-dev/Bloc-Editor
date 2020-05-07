/* ----------------------- SECTION node mudule import ----------------------- */
import { combineReducers } from 'redux';
import promptReducer from './promptReducer';
import filesReducer from './filesReducer';
import blocReducer from './blocReducer';
/* ------------------------ SECTION regester reducer ------------------------ */
const rootReducer = combineReducers({
    promptReducer,
    filesReducer,
    blocReducer
});

export default rootReducer;