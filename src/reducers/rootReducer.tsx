/* ----------------------- SECTION node mudule import ----------------------- */
import { combineReducers } from 'redux';
import promptReducer, { IinitialPrompt } from './promptReducer';
import filesReducer, { IinitialFiles } from './filesReducer';
import blocReducer, { IinitialBloc } from './blocReducer';
import notificationReducer, { IinitialNotification } from './notificationReducer';
import searchableListReducer, { IinitialSearchableList } from './searchableListReducer';
import themeReducer, { Itheme } from './themeReducer';
/* ------------------------ SECTION regester reducer ------------------------ */
export interface IrootReducer {
    promptReducer: IinitialPrompt,
    filesReducer: IinitialFiles,
    blocReducer: IinitialBloc,
    notificationReducer: IinitialNotification,
    searchableListReducer: IinitialSearchableList,
    themeReducer: Itheme
}
const rootReducer = combineReducers<IrootReducer>({
    promptReducer,
    filesReducer,
    blocReducer,
    notificationReducer,
    themeReducer,
    searchableListReducer
});

export default rootReducer;