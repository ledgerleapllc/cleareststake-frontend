/* global require */
import React, { Component } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const moment = require("moment");

class PopupAlert extends Component {
  onClose = () => {
    const { onClose } = this.props;
    if (onClose) onClose();
  };

  render() {
    const { shown, message, type, horizontal } = this.props;

    return (
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: horizontal || "right",
        }}
        open={shown || false}
        onClose={this.onClose}
        key={`popupalert_${moment().unix()}`}
        autoHideDuration={3000}
        style={{
          zIndex: 9999,
        }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={this.close}
          severity={type || "warning"}
        >
          {message || ""}
        </MuiAlert>
      </Snackbar>
    );
  }
}

export default PopupAlert;
