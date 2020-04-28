/* ----------------------- SECTION node mudule import ----------------------- */
import { combineReducers } from 'redux';
import explorerReducer from './explorerReducer';
import promptReducer from './promptReducer';

/* ------------------------ SECTION regester reducer ------------------------ */
const rootReducer = combineReducers({
    explorerReducer,
    promptReducer
});

export default rootReducer;