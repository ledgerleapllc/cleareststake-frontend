import API from "./API";
import { saveUser, setGlobalSettings, showAlert } from "../redux/actions";
import Helper from "./Helper";

// Login
export function login(email, password, ip, start, completion) {
  return function (dispatch) {
    if (start) start();
    API.login(email, password, ip).then((res) => {
      if (!res.success) dispatch(showAlert(res.message, "warning", "center"));
      if (completion) completion(res);
      if (res.success && res.user) {
        const userData = res.user;
        Helper.storeUser(userData);
        dispatch(saveUser(userData));
      }
    });
  };
}

// Get Invitation Data
export function getInvitationData(code, start, completion) {
  return function () {
    if (start) start();
    API.getInvitationData(code).then((res) => {
      if (completion) completion(res);
    });
  };
}

// Get All Users
export function getAllUsers(start, completion) {
  return function () {
    if (start) start();
    API.getAllUsers().then((res) => {
      if (completion) completion(res);
    });
  };
}

// Get Logs - Common
export function getLogs(params, start, completion) {
  return function () {
    if (start) start();
    API.getLogs(params).then((res) => {
      if (completion) completion(res);
    });
  };
}

// Get Transactions - Common
export function getTransactions(params, start, completion) {
  return function () {
    if (start) start();
    API.getTransactions(params).then((res) => {
      if (completion) completion(res);
    });
  };
}

// Get Users
export function getUsers(params, start, completion) {
  return function () {
    if (start) start();
    API.getUsers(params).then((res) => {
      if (completion) completion(res);
    });
  };
}

// Get Single User
export function getSingleUser(userId, params, start, completion) {
  return function () {
    if (start) start();
    API.getSingleUser(userId, params).then((res) => {
      if (completion) completion(res);
    });
  };
}

// Get Me
export function getMe(start, completion, returnOnly = false) {
  return function (dispatch) {
    if (start) start();
    API.getMe().then((res) => {
      if (!returnOnly && res.me) {
        let userData = Helper.fetchUser();
        if (userData && userData.id) {
          userData = {
            ...res.me,
            accessTokenAPI: userData.accessTokenAPI,
          };

          Helper.storeUser(userData);
          dispatch(saveUser(userData));
        }
      }
      if (completion) completion(res);
    });
  };
}

// Invite User
export function inviteUser(params, start, completion) {
  return function (dispatch) {
    if (start) start();
    API.inviteUser(params).then((res) => {
      if (!res.success) {
        dispatch(showAlert(res.message, "warning", "center"));
        if (completion) completion(res);
      } else {
        dispatch(
          getSettings(
            () => {},
            () => {
              if (completion) completion(res);
            }
          )
        );
      }
    });
  };
}

// Finish Invitation
export function finishInvitation(params, start, completion) {
  return function (dispatch) {
    if (start) start();
    API.finishInvitation(params).then((res) => {
      if (!res.success) dispatch(showAlert(res.message, "warning", "center"));
      if (completion) completion(res);
      if (res.success && res.user) {
        const userData = res.user;
        Helper.storeUser(userData);
        dispatch(saveUser(userData));
      }
    });
  };
}

// Get Values
export function getValues(start, completion) {
  return function () {
    if (start) start();
    API.getValues().then((res) => {
      if (completion) completion(res);
    });
  };
}

// Get Graph Info
export function getGraphInfo(start, completion) {
  return function () {
    if (start) start();
    API.getGraphInfo().then((res) => {
      if (completion) completion(res);
    });
  };
}

// Get Settings
export function getSettings(start, completion) {
  return function (dispatch) {
    if (start) start();
    API.getSettings().then((res) => {
      const settings = res.settings || {};
      dispatch(setGlobalSettings(settings));
      if (completion) completion();
    });
  };
}

// Change Email - Common
export function changeEmail(params, start, completion) {
  return function (dispatch) {
    if (start) start();
    API.changeEmail(params).then((res) => {
      if (!res.success) dispatch(showAlert(res.message, "warning", "center"));
      if (completion) completion(res);
    });
  };
}

// Change Password - Common
export function changePassword(params, start, completion) {
  return function (dispatch) {
    if (start) start();
    API.changePassword(params).then((res) => {
      if (!res.success) dispatch(showAlert(res.message, "warning", "center"));
      if (completion) completion(res);
    });
  };
}

// Reset Password - Common
export function resetPassword(params, start, completion) {
  return function (dispatch) {
    if (start) start();
    API.resetPassword(params).then((res) => {
      if (res.success)
        dispatch(
          showAlert("You've successfully reset your password.", "success")
        );
      else dispatch(showAlert(res.message));
      if (completion) completion(res);
    });
  };
}

// Send Help Request - Common
export function sendHelpRequest(params, start, completion) {
  return function (dispatch) {
    if (start) start();
    API.sendHelpRequest(params).then((res) => {
      if (!res.success) dispatch(showAlert(res.message, "warning", "center"));
      if (completion) completion(res);
    });
  };
}

// Send Reset Email - Common
export function sendResetEmail(email, start, completion) {
  return function (dispatch) {
    if (start) start();
    API.sendResetEmail(email).then((res) => {
      if (!res.success) dispatch(showAlert(res.message, "warning", "center"));
      if (completion) completion(res);
    });
  };
}

// Reset User Password - Admin
export function resetUserPassword(params, start, completion) {
  return function (dispatch) {
    if (start) start();
    API.resetUserPassword(params).then((res) => {
      if (!res.success) dispatch(showAlert(res.message, "warning", "center"));
      if (completion) completion(res);
    });
  };
}

// Withdraw - User
export function withdrawUser(params, start, completion) {
  return function (dispatch) {
    if (start) start();
    API.withdrawUser(params).then((res) => {
      if (!res.success) {
        dispatch(showAlert(res.message, "warning", "center"));
        if (completion) completion(res);
      } else {
        dispatch(getSettings());
        dispatch(
          getMe(
            () => {},
            () => {
              if (completion) completion(res);
            }
          )
        );
      }
    });
  };
}

// Withdraw - Admin
export function withdrawAdmin(params, start, completion) {
  return function (dispatch) {
    if (start) start();
    API.withdrawAdmin(params).then((res) => {
      if (!res.success) {
        dispatch(showAlert(res.message, "warning", "center"));
        if (completion) completion(res);
      } else {
        dispatch(
          getSettings(
            () => {},
            () => {
              if (completion) completion(res);
            }
          )
        );
      }
    });
  };
}

// Deposit - Admin
export function depositAdmin(params, start, completion) {
  return function (dispatch) {
    if (start) start();
    API.depositAdmin(params).then((res) => {
      if (!res.success) {
        dispatch(showAlert(res.message, "warning", "center"));
        if (completion) completion(res);
      } else {
        dispatch(
          getSettings(
            () => {},
            () => {
              if (completion) completion(res);
            }
          )
        );
      }
    });
  };
}

// Update Inflation
export function updateInflation(balance, start, completion) {
  return function (dispatch) {
    if (start) start();
    API.updateInflation(balance).then((res) => {
      if (!res.success) {
        dispatch(showAlert(res.message, "warning", "center"));
        if (completion) completion(res);
      } else {
        dispatch(
          getSettings(
            () => {},
            () => {
              if (completion) completion(res);
            }
          )
        );
      }
    });
  };
}

// Download User - Admin
export function downloadUsersCSV(params, start, completion) {
  return function () {
    if (start) start();
    API.downloadUsersCSV(params).then((res) => {
      if (completion) completion(res);
    });
  };
}

export function downloadTransactionsCSV(params, start, completion) {
  return function () {
    if (start) start();
    API.downloadTransactionsCSV(params).then((res) => {
      if (completion) completion(res);
    });
  };
}

export function updateUserInFund(params, start, completion) {
  return function (dispatch) {
    if (start) start();
    API.updateUserInFund(params).then((res) => {
      if (!res.success) {
        dispatch(showAlert(res.message, "warning", "center"));
        if (completion) completion(res);
      } else {
        dispatch(
          getSettings(
            () => {},
            () => {
              if (completion) completion(res);
            }
          )
        );
      }
    });
  };
}

export function addFundSale(params, start, completion) {
  return function (dispatch) {
    if (start) start();
    API.addFundSale(params).then((res) => {
      if (!res.success) {
        dispatch(showAlert(res.message, "warning", "center"));
        if (completion) completion(res);
      } else {
        if (completion) completion(res);
      }
    });
  };
}

export function downloadSingleUserTransaction(params, start, completion) {
  return function () {
    if (start) start();
    API.downloadSingleUserTransactionsCSV(params).then((res) => {
      if (completion) completion(res);
    });
  };
}

export function getCSPRPrice(params, start, completion) {
  return function () {
    if (start) start();
    API.getCSPRPrice(params).then((res) => {
      if (completion) completion(res);
    });
  };
}
