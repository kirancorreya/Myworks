import { combineReducers } from "redux";
import model from "./model/modelReducer";
import system from "./system/systemReducer";
import organisation from "./organisation/orgReducer";

export default combineReducers({
  model,
  system,
  organisation
});
