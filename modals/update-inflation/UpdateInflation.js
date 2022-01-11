import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FormInputComponent } from "../../components";
import {
  hideCanvas,
  removeActiveModal,
  setTXTableStatus,
  setUsersTableStatus,
  showAlert,
  showCanvas,
} from "../../redux/actions";
import Helper from "../../utils/Helper";
import { updateInflation } from "../../utils/Thunk";

const mapStateToProps = (state) => {
  return {
    globalSettings: state.global.globalSettings,
  };
};

class UpdateInflation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balance: "",
      errorMessage: "",
      disabled: true,
    };
  }

  checkError() {
    const { balance } = this.state;
    const { globalSettings } = this.props;

    let error = false;
    if (!balance || balance == "0") error = true;
    else if (
      parseFloat(balance) <= parseFloat(globalSettings.real_total_balance || 0)
    )
      error = true;

    if (error) {
      this.setState({
        errorMessage: "Error: new balance is less than current balance",
        disabled: true,
      });
    } else {
      this.setState({ errorMessage: "", disabled: false });
    }
  }

  inputBalance(e) {
    let value = e.target.value;
    value = Helper.unformatNumber(value);

    if (isNaN(value) || value == "") value = "";
    else value = parseInt(value).toString();

    this.setState({ balance: value, errorMessage: "" }, () => {
      this.checkError();
    });
  }

  submit = (e) => {
    e.preventDefault();
    const { balance } = this.state;
    if (!balance) {
      this.props.dispatch(showAlert("Please input balance"));
      return;
    }
    if (parseInt(balance) <= 0) {
      this.props.dispatch(showAlert("Please input valid balance"));
      return;
    }
    this.props.dispatch(
      updateInflation(
        balance,
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          if (res && res.success) {
            this.props.dispatch(removeActiveModal());
            this.props.dispatch(setUsersTableStatus(true));
            this.props.dispatch(setTXTableStatus(true));
          }
        }
      )
    );
  };

  close = (e) => {
    e.preventDefault();
    this.props.dispatch(removeActiveModal());
  };

  render() {
    const { globalSettings } = this.props;
    const { balance, disabled, errorMessage } = this.state;

    return (
      <div id="update-inflation-modal">
        <h4>
          The current balance recorded for the node is{" "}
          {Helper.formatNumber(globalSettings.real_total_balance || 0)}
        </h4>
        <p className="mt-4 mb-3 font-size-14">
          {`Please enter the new balance live from the Casper chain. Any tokens above the current balance will be credited to each user account pro rata with their share of the current total. Any updates should ALWAYS be more than the current balance. If it is not, please check all withdrawals are recorded.`}
        </p>
        {errorMessage ? (
          <p className="text-danger font-size-14 mb-3">{errorMessage}</p>
        ) : null}
        <form>
          <FormInputComponent
            value={Helper.formatNumber(balance)}
            onChange={(e) => this.inputBalance(e)}
            type="text"
            height="40px"
          />

          <div id="update-inflation-modal__buttons">
            <button
              onClick={this.submit}
              type="submit"
              className="btn btn-light"
              disabled={disabled}
            >
              Submit
            </button>
            <a className="btn btn-danger" onClick={this.close}>
              Cancel
            </a>
          </div>
        </form>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(UpdateInflation));
