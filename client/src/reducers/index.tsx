import { combineReducers, Reducer } from 'redux';
import newUsers from './newUsers';
import userStatus from './userStatus';
import categories from './categories';
import userProducts from './userProducts';

interface RootState {
  newUsers: NewUsersState;
  userStatus: UserStatusState;
  categories: CategoriesState;
  userProducts: UserProductsState;
}

const rootReducer: Reducer<RootState> = combineReducers<RootState>({
  newUsers,
  userStatus,
  categories,
  userProducts
});

export default rootReducer;