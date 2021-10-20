import React, { Component } from "react";
import { Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  removeActiveModal,
  setTXTableStatus,
  setUsersTableStatus,
  showAlert,
  showCanvas,
  hideCanvas,
} from "../../redux/actions";
import Helper from "../../utils/Helper";
import { withdrawUser } from "../../utils/Thunk";

import "./process-withdraw.scss";

// eslint-disable-next-line no-undef
const moment = require("moment");

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class ProcessWithdraw extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: "",
      showConfirm: false,
    };
  }

  // Submit Form
  submit = (e) => {
    e.preventDefault();
    const { authUser } = this.props;
    const { amount } = this.state;

    if (!authUser || !authUser.id) return null;

    if (!amount || parseInt(amount) <= 0) {
      this.props.dispatch(showAlert("Please input amount"));
      return;
    }

    if (parseInt(amount) > parseInt(authUser.balance)) {
      this.props.dispatch(
        showAlert(`You have ${authUser.balance} tokens available`)
      );
      return;
    }

    this.props.dispatch(
      withdrawUser(
        { amount },
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          if (res && res.success) {
            this.props.dispatch(setUsersTableStatus(true));
            this.props.dispatch(setTXTableStatus(true));
            this.setState({ showConfirm: true });
          }
        }
      )
    );
  };

  // Close
  close = (e) => {
    e.preventDefault();
    this.props.dispatch(removeActiveModal());
  };

  // Input Amount
  inputAmount = (e) => {
    let value = e.target.value;
    value = Helper.unformatNumber(value);

    if (isNaN(value) || value == "") value = "";
    else value = parseInt(value).toString();

    this.setState({ amount: value });
  };

  // Render Content
  renderContent() {
    const { amount } = this.state;
    const { authUser } = this.props;

    return (
      <Fragment>
        <label className="font-size-14 d-block mt-4">
          You have {Helper.formatNumber(authUser.balance)} tokens available.
          <br />
          {`Please enter the amount of tokens you would like to withdraw. This
          will alert an admin who will contact you to facilitate this transaction.`}
        </label>
        <input
          type="text"
          onChange={this.inputAmount}
          className="custom-form-control"
          value={Helper.formatNumber(amount)}
        />
      </Fragment>
    );
  }

  // Render
  render() {
    const { authUser } = this.props;
    const { showConfirm } = this.state;

    let last_withdraw_request = authUser.last_withdraw_request;
    if (last_withdraw_request) {
      let diff = moment().diff(
        moment(last_withdraw_request + ".000Z"),
        "seconds"
      );
      if (diff < 2 * 24 * 60 * 60 && !showConfirm) {
        return (
          <div id="process-withdraw-modal">
            <h3>You already have an active withdrawal request.</h3>
            <p className="font-size-14 mt-3">{`Please allow the portal admin up to 2 days to get in touch with you.`}</p>
            <div id="process-withdraw-modal__buttons">
              <a className="btn btn-light" onClick={this.close}>
                Close
              </a>
            </div>
          </div>
        );
      }
    }

    if (showConfirm) {
      return (
        <div id="process-withdraw-modal">
          <h3>Thank you, your request is confirmed!</h3>
          <p className="font-size-14 mt-3">{`An admin will review your request and reach out to you within 2 business days.`}</p>
          <p className="font-size-14 mt-3">{`Please keep in mind a couple points:`}</p>
          <ul className="mt-1" style={{ paddingLeft: "14px" }}>
            <li className="font-size-12">{`Withdrawals can take up to 14 days to process.`}</li>
            <li className="font-size-12">{`Tokens withdrawn from the platform will no longer earn staking rewards.`}</li>
            <li className="font-size-12">{`You will need a Casper wallet for transferring tokens from the platform to your own custody.`}</li>
          </ul>
          <div id="process-withdraw-modal__buttons">
            <a className="btn btn-light" onClick={this.close}>
              Close
            </a>
          </div>
        </div>
      );
    }

    return (
      <div id="process-withdraw-modal">
        <h3>Request Withdraw</h3>
        {this.renderContent()}
        <div id="process-withdraw-modal__buttons">
          <a className="btn btn-primary" onClick={this.submit}>
            Submit
          </a>
          <a className="btn btn-light" onClick={this.close}>
            Cancel
          </a>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(ProcessWithdraw));
