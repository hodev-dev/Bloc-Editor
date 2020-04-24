/* ----------------------- SECTION node mudule import ----------------------- */
import { combineReducers } from 'redux';
import explorerReducer from './eplorerReducer';

/* ------------------------ SECTION regester reducer ------------------------ */
const rootReducer = combineReducers({
    explorerReducer
});

export default rootReducer;