import {
  SET_USERS_TABLE_STATUS,
  SET_ACCESS_GROUPS_TABLE_STATUS,
  SET_TX_TABLE_STATUS,
} from "../actions";

const initialState = {
  usersTableStatus: false,
  txTableStatus: false,
  accessGroupsTableStatus: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_TX_TABLE_STATUS: {
      const { txTableStatus } = action.payload;
      return {
        ...state,
        txTableStatus,
      };
    }
    case SET_ACCESS_GROUPS_TABLE_STATUS: {
      const { accessGroupsTableStatus } = action.payload;
      return {
        ...state,
        accessGroupsTableStatus,
      };
    }
    case SET_USERS_TABLE_STATUS: {
      const { usersTableStatus } = action.payload;
      return {
        ...state,
        usersTableStatus,
      };
    }
    default:
      return state;
  }
}
