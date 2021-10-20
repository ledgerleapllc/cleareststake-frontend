/* eslint-disable no-undef */
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  removeActiveModal,
  setCustomConfirmModalData,
} from "../../redux/actions";

import "./custom-confirm.scss";

const mapStateToProps = (state) => {
  return {
    customConfirmModalData: state.modal.customConfirmModalData,
  };
};

class CustomConfirm extends Component {
  clickOK = (e) => {
    e.preventDefault();
    const { customConfirmModalData } = this.props;
    const action = customConfirmModalData.action || "";
    const data = customConfirmModalData.data || {};

    if (action == "enable-twoFA") {
      //
    } else if (action == "disable-twoFA") {
      //
    } else if (action == "resend-invitation" && data && data.id) {
      //
    } else if (action == "restore" && data && data.id) {
      //
    } else this.closeModal();
  };

  closeModal() {
    this.props.dispatch(setCustomConfirmModalData({}));
    this.props.dispatch(removeActiveModal());
  }

  clickClose = (e) => {
    e.preventDefault();
    this.closeModal();
  };

  render() {
    const { customConfirmModalData } = this.props;
    if (JSON.stringify(customConfirmModalData) == "{}") return null;

    const buttonColor = customConfirmModalData.buttonColor || "primary";

    return (
      <div id="custom-confirm-modal">
        {customConfirmModalData.title ? (
          <h3>{customConfirmModalData.title}</h3>
        ) : null}
        {customConfirmModalData.body ? (
          <p className="mt-4">{customConfirmModalData.body}</p>
        ) : null}
        <div id="custom-confirm-modal__buttons">
          <a className={`btn btn-${buttonColor}`} onClick={this.clickOK}>
            OK
          </a>
          <a className="btn btn-light" onClick={this.clickClose}>
            Cancel
          </a>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(CustomConfirm));
