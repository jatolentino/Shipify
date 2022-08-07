import { CATEGORIES } from "../../definitions/index";

export function categoriesAction(categories: string[] = []) {
    return {
        type: CATEGORIES,
        payload: categories
    };
}