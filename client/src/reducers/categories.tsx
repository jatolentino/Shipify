import { CATEGORIES } from "../definitions/index";

interface CategoryState {
    categories: string[];
}

interface CategoryAction {
    type: string;
    payload: string;
}

const categories = (state: CategoryState = {
    categories: []
}, action: CategoryAction) => {
    switch (action.type) {
        case CATEGORIES:
            return { ...state, categories: [...state.categories, action.payload] };
    }
    return state;
};

export default categories;