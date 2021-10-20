// General
export const SHOW_ALERT = "SHOW_ALERT";
export const HIDE_ALERT = "HIDE_ALERT";
export const SHOW_CANVAS = "SHOW_CANVAS";
export const HIDE_CANVAS = "HIDE_CANVAS";
export const SHOW_MENU = "SHOW_MENU";
export const HIDE_MENU = "HIDE_MENU";

// User
export const SAVE_USER = "SAVE_USER";

// Table
export const SET_USERS_TABLE_STATUS = "SET_USERS_TABLE_STATUS";
export const SET_TX_TABLE_STATUS = "SET_TX_TABLE_STATUS";
export const SET_ACCESS_GROUPS_TABLE_STATUS = "SET_ACCESS_GROUPS_TABLE_STATUS";

// Modal
export const SET_ACTIVE_MODAL = "SET_ACTIVE_MODAL";
export const REMOVE_ACTIVE_MODAL = "REMOVE_ACTIVE_MODAL";
export const SET_CLOSE_BRANCH_DATA = "SET_CLOSE_BRANCH_DATA";
export const SET_REVOKE_USER_DATA = "SET_REVOKE_USER_DATA";
export const SET_RESET_PASSWORD_USER_DATA = "SET_RESET_PASSWORD_USER_DATA";
export const SET_DELETE_USER_DATA = "SET_DELETE_USER_DATA";
export const SET_CANCEL_INVITE_USER_DATA = "SET_CANCEL_INVITE_USER_DATA";
export const SET_DELETE_ACCESS_GROUP_DATA = "SET_DELETE_ACCESS_GROUP_DATA";
export const SET_BULK_APPLY_ACCESS_GROUP_USERS_DATA =
  "SET_BULK_APPLY_ACCESS_GROUP_USERS_DATA";
export const SET_BULK_REMOVE_ACCESS_GROUP_USERS_DATA =
  "SET_BULK_REMOVE_ACCESS_GROUP_USERS_DATA";
export const SET_CUSTOM_CONFIRM_MODAL_DATA = "SET_CUSTOM_CONFIRM_MODAL_DATA";
export const SET_CUSTOM_GENERAL_MODAL_DATA = "SET_CUSTOM_GENERAL_MODAL_DATA";
export const SET_GLOBAL_SETTINGS = "SET_GLOBAL_SETTINGS";

export const setGlobalSettings = (message) => ({
  type: SET_GLOBAL_SETTINGS,
  payload: {
    globalSettings: message,
  },
});

export const showMenu = () => ({
  type: SHOW_MENU,
  payload: {},
});

export const hideMenu = () => ({
  type: HIDE_MENU,
  payload: {},
});

export const setAccessGroupsTableStatus = (message) => ({
  type: SET_ACCESS_GROUPS_TABLE_STATUS,
  payload: {
    accessGroupsTableStatus: message,
  },
});

export const setTXTableStatus = (message) => ({
  type: SET_TX_TABLE_STATUS,
  payload: {
    txTableStatus: message,
  },
});

export const setUsersTableStatus = (message) => ({
  type: SET_USERS_TABLE_STATUS,
  payload: {
    usersTableStatus: message,
  },
});

export const setCustomGeneralModalData = (message) => ({
  type: SET_CUSTOM_GENERAL_MODAL_DATA,
  payload: {
    customGeneralModalData: message,
  },
});

export const setCustomConfirmModalData = (message) => ({
  type: SET_CUSTOM_CONFIRM_MODAL_DATA,
  payload: {
    customConfirmModalData: message,
  },
});

export const setBulkApplyAccessGroupUsersData = (message) => ({
  type: SET_BULK_APPLY_ACCESS_GROUP_USERS_DATA,
  payload: {
    bulkApplyAccessGroupUsersData: message,
  },
});

export const setBulkRemoveAccessGroupUsersData = (message) => ({
  type: SET_BULK_REMOVE_ACCESS_GROUP_USERS_DATA,
  payload: {
    bulkRemoveAccessGroupUsersData: message,
  },
});

export const setDeleteAccessGroupData = (message) => ({
  type: SET_DELETE_ACCESS_GROUP_DATA,
  payload: {
    deleteAccessGroupData: message,
  },
});

export const setResetPasswordUserData = (message) => ({
  type: SET_RESET_PASSWORD_USER_DATA,
  payload: {
    resetPasswordUserData: message,
  },
});

export const setDeleteUserData = (message) => ({
  type: SET_DELETE_USER_DATA,
  payload: {
    deleteUserData: message,
  },
});

export const setCancelInviteUserData = (message) => ({
  type: SET_CANCEL_INVITE_USER_DATA,
  payload: {
    cancelInviteUserData: message,
  },
});

export const setRevokeUserData = (message) => ({
  type: SET_REVOKE_USER_DATA,
  payload: {
    revokeUserData: message,
  },
});

export const setCloseBranchData = (message) => ({
  type: SET_CLOSE_BRANCH_DATA,
  payload: {
    closeBranchData: message,
  },
});

export const saveUser = (message) => ({
  type: SAVE_USER,
  payload: {
    authUser: message,
  },
});

export const showAlert = (message, type = "warning", horizontal = "right") => ({
  type: SHOW_ALERT,
  payload: {
    showAlertMessage: message,
    showAlertType: type,
    showAlertHorizontal: horizontal,
  },
});

export const hideAlert = () => ({
  type: HIDE_ALERT,
  payload: {},
});

export const showCanvas = () => ({
  type: SHOW_CANVAS,
  payload: {},
});

export const hideCanvas = () => ({
  type: HIDE_CANVAS,
  payload: {},
});

export const setActiveModal = (activeModal) => ({
  type: SET_ACTIVE_MODAL,
  payload: {
    activeModal,
  },
});

export const removeActiveModal = () => ({
  type: REMOVE_ACTIVE_MODAL,
  payload: {},
});
