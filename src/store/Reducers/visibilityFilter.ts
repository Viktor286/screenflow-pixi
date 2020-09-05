import { IReduxAction } from "../types";

interface IFilterAction extends IReduxAction {
  filter: "show_all" | "show_completed" | "show_active";
}

const initialState = "show_all";

const visibilityFilter = (state = initialState, action: IFilterAction) => {
  switch (action.type) {
    case "SET_VISIBILITY_FILTER":
      return action.filter;
    default:
      return state;
  }
};

export default visibilityFilter;
