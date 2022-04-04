/* eslint-disable no-undef */
import "./commands";

Cypress.Cookies.defaults({
  preserve: ["XSRF-TOKEN", "myapp_session", "remember_token"],
});
