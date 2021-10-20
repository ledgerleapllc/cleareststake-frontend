import {
  SHOW_ALERT,
  HIDE_ALERT,
  SHOW_CANVAS,
  HIDE_CANVAS,
  SET_ACTIVE_MODAL,
  REMOVE_ACTIVE_MODAL,
  SAVE_USER,
  SHOW_MENU,
  HIDE_MENU,
  SET_GLOBAL_SETTINGS,
} from "../actions";

const initialState = {
  showAlert: false,
  showAlertMessage: "",
  showAlertType: "",
  showAlertHorizontal: "",
  showCanvas: false,
  activeModal: "",
  authUser: {},
  menuShown: false,
  globalSettings: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_GLOBAL_SETTINGS: {
      const { globalSettings } = action.payload;
      return {
        ...state,
        globalSettings,
      };
    }
    case SHOW_MENU:
      return {
        ...state,
        menuShown: true,
      };
    case HIDE_MENU:
      return {
        ...state,
        menuShown: false,
      };
    case SAVE_USER: {
      const { authUser } = action.payload;
      return {
        ...state,
        authUser,
      };
    }
    case SHOW_ALERT: {
      const { showAlertMessage, showAlertType, showAlertHorizontal } =
        action.payload;
      return {
        ...state,
        showAlert: true,
        showAlertMessage,
        showAlertType,
        showAlertHorizontal,
      };
    }
    case HIDE_ALERT:
      return {
        ...state,
        showAlert: false,
        showAlertMessage: "",
        showAlertType: "",
        showAlertHorizontal: "",
      };
    case SHOW_CANVAS:
      return {
        ...state,
        showCanvas: true,
      };
    case HIDE_CANVAS:
      return {
        ...state,
        showCanvas: false,
      };
    case SET_ACTIVE_MODAL: {
      const { activeModal } = action.payload;
      return {
        ...state,
        activeModal,
      };
    }
    case REMOVE_ACTIVE_MODAL:
      return {
        ...state,
        activeModal: "",
      };
    default:
      return state;
  }
}
