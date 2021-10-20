import {
  SET_CLOSE_BRANCH_DATA,
  SET_REVOKE_USER_DATA,
  SET_RESET_PASSWORD_USER_DATA,
  SET_DELETE_USER_DATA,
  SET_CANCEL_INVITE_USER_DATA,
  SET_DELETE_ACCESS_GROUP_DATA,
  SET_BULK_APPLY_ACCESS_GROUP_USERS_DATA,
  SET_BULK_REMOVE_ACCESS_GROUP_USERS_DATA,
  SET_CUSTOM_CONFIRM_MODAL_DATA,
  SET_CUSTOM_GENERAL_MODAL_DATA,
} from "../actions";

const initialState = {
  closeBranchData: {},
  revokeUserData: {},
  resetPasswordUserData: {},
  deleteUserData: {},
  cancelInviteUserData: {},
  deleteAccessGroupData: {},
  bulkApplyAccessGroupUsersData: [],
  bulkRemoveAccessGroupUsersData: [],
  customConfirmModalData: {},
  customGeneralModalData: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CUSTOM_GENERAL_MODAL_DATA: {
      const { customGeneralModalData } = action.payload;
      return {
        ...state,
        customGeneralModalData,
      };
    }
    case SET_CUSTOM_CONFIRM_MODAL_DATA: {
      const { customConfirmModalData } = action.payload;
      return {
        ...state,
        customConfirmModalData,
      };
    }
    case SET_BULK_APPLY_ACCESS_GROUP_USERS_DATA: {
      const { bulkApplyAccessGroupUsersData } = action.payload;
      return {
        ...state,
        bulkApplyAccessGroupUsersData,
      };
    }
    case SET_BULK_REMOVE_ACCESS_GROUP_USERS_DATA: {
      const { bulkRemoveAccessGroupUsersData } = action.payload;
      return {
        ...state,
        bulkRemoveAccessGroupUsersData,
      };
    }
    case SET_DELETE_ACCESS_GROUP_DATA: {
      const { deleteAccessGroupData } = action.payload;
      return {
        ...state,
        deleteAccessGroupData,
      };
    }
    case SET_RESET_PASSWORD_USER_DATA: {
      const { resetPasswordUserData } = action.payload;
      return {
        ...state,
        resetPasswordUserData,
      };
    }
    case SET_DELETE_USER_DATA: {
      const { deleteUserData } = action.payload;
      return {
        ...state,
        deleteUserData,
      };
    }
    case SET_CANCEL_INVITE_USER_DATA: {
      const { cancelInviteUserData } = action.payload;
      return {
        ...state,
        cancelInviteUserData,
      };
    }
    case SET_CLOSE_BRANCH_DATA: {
      const { closeBranchData } = action.payload;
      return {
        ...state,
        closeBranchData,
      };
    }
    case SET_REVOKE_USER_DATA: {
      const { revokeUserData } = action.payload;
      return {
        ...state,
        revokeUserData,
      };
    }
    default:
      return state;
  }
}
