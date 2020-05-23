/* ----------------------- SECTION node mudule import ----------------------- */
import { combineReducers } from 'redux';
import promptReducer, { IinitialPrompt } from './promptReducer';
import filesReducer, { IinitialFiles } from './filesReducer';
import blocReducer, { IinitialBloc } from './blocReducer';
import notificationReducer, { IinitialNotification } from './notificationReducer';
import searchableListReducer, { IinitialSearchableList } from './searchableListReducer';
/* ------------------------ SECTION regester reducer ------------------------ */
export interface IrootReducer {
    promptReducer: IinitialPrompt,
    filesReducer: IinitialFiles,
    blocReducer: IinitialBloc,
    notificationReducer: IinitialNotification,
    searchableListReducer: IinitialSearchableList
}
const rootReducer = combineReducers<IrootReducer>({
    promptReducer,
    filesReducer,
    blocReducer,
    notificationReducer,
    searchableListReducer
});

export default rootReducer;