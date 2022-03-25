/* eslint-disable no-undef */
/* global require */
import Helper from "./Helper";

const axios = require("axios");

const sendRequest = (
  url,
  params = {},
  method = "POST",
  requireAuth = false,
  responseType = null
) => {
  let headers = { "Content-Type": "application/json" };
  if (requireAuth) {
    const userData = Helper.fetchUser();
    const accessToken = userData.accessTokenAPI || "";

    headers = {
      ...headers,
      Authorization: `Bearer ${accessToken}`,
    };
  }

  // eslint-disable-next-line no-undef
  let apiUrl = process.env.NEXT_PUBLIC_BACKEND_URL + "api" + url;
  if (method == "GET") {
    const urlParams = [];
    for (let key in params) {
      if (key && params[key]) {
        urlParams.push(`${key}=${params[key]}`);
      }
    }
    if (urlParams.length) {
      apiUrl += `?${urlParams.join("&")}`;
    }
  }

  return new Promise((resolve) => {
    axios({
      method,
      headers,
      data: JSON.stringify(params),
      url: apiUrl,
      responseType: responseType || "json",
    })
      .then((res) => {
        if (res.data) {
          let data = res.data;

          if (!responseType) {
            if (!data.success && !data.message) {
              data = {
                ...data,
                message: "Please try again later",
              };
            }
            resolve(data);
          } else {
            resolve(data);
          }

          resolve(data);
        } else {
          resolve({
            success: false,
            message: "Please try again later",
          });
        }
      })
      .catch(() => {
        // Needs to login again
        Helper.removeUser();
        window.location.reload();

        resolve({
          success: false,
          message: "Please try again later",
        });
      });
  });
};

class API {
  // Login
  static login(email, password, ip) {
    const params = {
      email,
      password,
      ip,
    };
    return sendRequest("/login", params, "POST");
  }

  // Get Auth User
  static getMe() {
    return sendRequest("/me", {}, "GET", true);
  }

  // Get Invitation Data
  static getInvitationData(code) {
    return sendRequest(`/invitation/${code}`, {}, "GET");
  }

  // Finish Invitation Data
  static finishInvitation(params) {
    return sendRequest("/invitation", params, "PUT");
  }

  // Invite User
  static inviteUser(params) {
    return sendRequest("/user", params, "POST", true);
  }

  // Get Graph Info
  static getGraphInfo() {
    return sendRequest("/user/graph-info", {}, "GET", true);
  }

  // Change Email
  static changeEmail(params) {
    return sendRequest("/common/change-email", params, "POST", true);
  }

  // Change Password
  static changePassword(params) {
    return sendRequest("/common/change-password", params, "POST", true);
  }

  // Update Inflation - Admin
  static updateInflation(balance) {
    return sendRequest("/admin/balance", { balance }, "PUT", true);
  }

  // Withdraw - Admin
  static withdrawAdmin(params) {
    return sendRequest("/admin/withdraw", params, "PUT", true);
  }

  // Withdraw - Admin
  static depositAdmin(params) {
    return sendRequest("/admin/deposit", params, "PUT", true);
  }

  // Withdraw - User
  static withdrawUser(params) {
    return sendRequest("/user/withdraw", params, "PUT", true);
  }

  // Reset User Password - Admin
  static resetUserPassword(params) {
    return sendRequest("/admin/reset-user-password", params, "POST", true);
  }

  // Send Help Request - Common
  static sendHelpRequest(params) {
    return sendRequest("/common/send-help-request", params, "POST", true);
  }

  // Send Reset Email - Common
  static sendResetEmail(email) {
    return sendRequest("/common/send-reset-email", { email }, "POST");
  }

  // Reset Password - Common
  static resetPassword(params) {
    return sendRequest("/common/reset-password", params, "POST");
  }

  // Get Users - Admin
  static getUsers(params) {
    return sendRequest("/admin/users", params, "GET", true);
  }

  // Get Single User - Admin
  static getSingleUser(userId, params) {
    return sendRequest(`/admin/user/${userId}`, params, "GET", true);
  }

  // Get Logs - Common
  static getLogs(params) {
    return sendRequest("/common/logs", params, "GET", true);
  }

  // Get Transactions - Common
  static getTransactions(params) {
    return sendRequest("/common/transactions", params, "GET", true);
  }

  // Get All Users - Admin
  static getAllUsers() {
    return sendRequest("/admin/users/all", {}, "GET", true);
  }

  // Get Settings
  static getSettings() {
    return sendRequest("/common/settings", {}, "GET", true);
  }

  // Get Values - Admin
  static getValues() {
    return sendRequest("/admin/values", {}, "GET", true);
  }

  // Download Users CSV - Admin
  static downloadUsersCSV(params) {
    return sendRequest("/admin/users/export-csv", params, "GET", true, "blob");
  }

  // Download Users CSV - Admin
  static downloadTransactionsCSV(params) {
    return sendRequest(
      "/common/transactions/export-csv",
      params,
      "GET",
      true,
      "blob"
    );
  }

  static updateUserInFund(params) {
    return sendRequest(
      `/admin/user/${params.id}/fund`,
      params.body,
      "PUT",
      true
    );
  }

  static addFundSale(params) {
    return sendRequest(`/admin/fund-sale`, params, "POST", true);
  }

  // Download User Detail Transaction CSV - Admin
  static downloadSingleUserTransactionsCSV(params) {
    return sendRequest(
      `/admin/user/${params.id}/export-csv`,
      params.query,
      "GET",
      true,
      "blob"
    );
  }

  static getCSPRPrice(params) {
    return sendRequest("/admin/cspr-price", params, "GET", true);
  }
}

export default API;
