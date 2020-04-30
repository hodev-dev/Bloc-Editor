/* ----------------------- SECTION node mudule import ----------------------- */
import { combineReducers } from 'redux';
import explorerReducer from './explorerReducer';
import promptReducer from './promptReducer';
import filesReducer from './filesReducer';
/* ------------------------ SECTION regester reducer ------------------------ */
const rootReducer = combineReducers({
    explorerReducer,
    promptReducer,
    filesReducer
});

export default rootReducer;