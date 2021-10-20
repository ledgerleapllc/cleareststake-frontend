/* eslint-disable no-useless-escape */
const USER_KEY = "@casper_main_user";
const APPTYPE_KEY = "@casper_app_type";

var ssnBuffer;
var einBuffer;

String.prototype.replaceAt = function (index, character) {
  return (
    this.substr(0, index) + character + this.substr(index + character.length)
  );
};

class Helper {
  // Make App ID
  static makeAppId(length) {
    let result = "";
    const characters =
      "123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  // Get File Extension
  static getFileEXT(string) {
    const temp = string.split(".");
    const ext = temp[temp.length - 1].toLowerCase();
    return ext;
  }

  // Validate Email
  static validateEmail(value) {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(value.toLowerCase());
  }

  // Please use a password with at least 8 characters including at least one number, one letter and one symbol
  static checkPassword(password) {
    if (password.length < 8) return false;

    let re = /[0-9]/;
    if (!re.test(password)) return false;

    re = /[a-zA-Z]/;
    if (!re.test(password)) return false;

    re = /(?=.*[.,=+;:\_\-?()\[\]<>{}!@#$%^&*])^[^'"]*$/;

    if (!re.test(password)) return false;

    return true;
  }

  // Store User
  static storeUser(userData) {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  }

  // Remove User
  static removeUser() {
    localStorage.removeItem(USER_KEY);
  }

  // Fetch User
  static fetchUser() {
    const jsonData = localStorage.getItem(USER_KEY);
    if (jsonData) return JSON.parse(jsonData);
    return {};
  }

  // Store Application Type
  static storeAppType(type) {
    localStorage.setItem(APPTYPE_KEY, type);
  }

  // Fetch Application Type
  static fetchAppType() {
    const type = localStorage.getItem(APPTYPE_KEY);
    return type || "";
  }

  // Adjust Numeric String
  static adjustNumericString(string, digit = 0) {
    if (isNaN(string) || string.trim() == "") return "";
    const temp = string.split(".");
    if (temp.length > 1) {
      const suffix = temp[1].substr(0, digit);
      return `${temp[0]}.${suffix}`;
    } else return string;
  }

  // Validate IP Address
  static validateIPAddress(ipAddress) {
    if (
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        ipAddress
      )
    )
      return true;
    return false;
  }

  // Format String to Float String
  static formatNumber(string) {
    string = string?.toString().replaceAll(",", "");
    if (isNaN(string) || string.trim() == "") return "";
    const temp = string.split(".");
    if (temp.length > 1)
      return (
        new Intl.NumberFormat("en-US").format(parseInt(temp[0])) + "." + temp[1]
      );
    return new Intl.NumberFormat("en-US").format(parseInt(string));
  }

  // Unformat Float String
  static unformatNumber(string) {
    return string.toString().replaceAll(",", "");
  }

  // Mask EIN
  static maskEIN(res) {
    const transformDisplay = (val) => {
      // Strip all non numbers
      let displayVal = val.replace(/[^0-9|\\*]/g, "");
      displayVal = displayVal.substr(0, 9);

      // Inject dashes
      if (displayVal.length >= 3)
        displayVal = displayVal.slice(0, 2) + "-" + displayVal.slice(2);

      // Replace all numbers with astericks
      displayVal = displayVal.replace(/[0-9]/g, "*");

      return displayVal;
    };

    const transformValue = (val) => {
      if (typeof einBuffer !== "string") einBuffer = "";
      if (!val) {
        einBuffer = null;
        return;
      }

      let cleanVal = val.replace(/[^0-9|\\*]/g, "");
      cleanVal = cleanVal.substr(0, 9);

      for (let i = 0, l = cleanVal.length; i < l; i++) {
        if (/[0-9]/g.exec(cleanVal[i])) {
          einBuffer = einBuffer.replaceAt(i, cleanVal[i]);
        }
      }

      einBuffer = einBuffer.substr(0, cleanVal.length);
    };

    const displayVal = transformDisplay(res);
    transformValue(res);

    return [displayVal, einBuffer];
  }

  // Mask SSN
  static maskSSN(res) {
    const transformDisplay = (val) => {
      // Strip all non numbers
      let displayVal = val.replace(/[^0-9|\\*]/g, "");
      displayVal = displayVal.substr(0, 9);

      // Inject dashes
      if (displayVal.length >= 4)
        displayVal = displayVal.slice(0, 3) + "-" + displayVal.slice(3);

      if (displayVal.length >= 7)
        displayVal = displayVal.slice(0, 6) + "-" + displayVal.slice(6);

      // Replace all numbers with astericks
      displayVal = displayVal.replace(/[0-9]/g, "*");

      return displayVal;
    };

    const transformValue = (val) => {
      if (typeof ssnBuffer !== "string") ssnBuffer = "";
      if (!val) {
        ssnBuffer = null;
        return;
      }

      let cleanVal = val.replace(/[^0-9|\\*]/g, "");
      cleanVal = cleanVal.substr(0, 9);

      for (let i = 0, l = cleanVal.length; i < l; i++) {
        if (/[0-9]/g.exec(cleanVal[i])) {
          ssnBuffer = ssnBuffer.replaceAt(i, cleanVal[i]);
        }
      }

      ssnBuffer = ssnBuffer.substr(0, cleanVal.length);
    };

    const displayVal = transformDisplay(res);
    transformValue(res);

    return [displayVal, ssnBuffer];
  }

  static isBrave = async () => {
    return (navigator.brave && (await navigator.brave.isBrave())) || false;
  };
}

export default Helper;
