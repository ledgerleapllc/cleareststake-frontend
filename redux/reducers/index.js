import { combineReducers } from "redux";
import global from "./global";
import modal from "./modal";
import table from "./table";

export default combineReducers({ global, modal, table });
