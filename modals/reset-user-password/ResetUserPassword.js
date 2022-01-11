import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FormInputComponent } from "../../components";
import {
  hideCanvas,
  removeActiveModal,
  setResetPasswordUserData,
  showAlert,
  showCanvas,
} from "../../redux/actions";
import Helper from "../../utils/Helper";
import { resetUserPassword } from "../../utils/Thunk";

const mapStateToProps = (state) => {
  return {
    resetPasswordUserData: state.modal.resetPasswordUserData,
  };
};

class ResetUserPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      password_confirm: "",
    };
  }

  resetPassword = (e) => {
    e.preventDefault();
    const { resetPasswordUserData } = this.props;
    const { password, password_confirm } = this.state;
    if (!resetPasswordUserData || !resetPasswordUserData.id) return;

    if (!password || !password_confirm) {
      this.props.dispatch(showAlert("Please input password"));
      return;
    }

    if (password != password_confirm) {
      this.props.dispatch(showAlert("Password does not match"));
      return;
    }

    if (!Helper.checkPassword(password)) {
      this.props.dispatch(showAlert("Please input valid password"));
      return;
    }

    const params = {
      userId: resetPasswordUserData.id,
      password,
    };
    this.props.dispatch(
      resetUserPassword(
        params,
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          if (res && res.success) {
            this.props.dispatch(removeActiveModal());
            this.props.dispatch(setResetPasswordUserData({}));
          }
        }
      )
    );
  };

  close = (e) => {
    e.preventDefault();
    this.props.dispatch(removeActiveModal());
    this.props.dispatch(setResetPasswordUserData({}));
  };

  render() {
    const { resetPasswordUserData } = this.props;
    const { password, password_confirm } = this.state;
    if (!resetPasswordUserData || !resetPasswordUserData.id) return null;

    return (
      <div id="reset-user-password-modal">
        <h3>{`Reset "${resetPasswordUserData.first_name} ${resetPasswordUserData.last_name}" Password`}</h3>
        <label className="mt-4 mb-3 d-block font-size-13">
          Your password must have the following:
        </label>
        <ul>
          <li className="font-size-13">8 character minimum</li>
          <li className="font-size-13">1 uppercase letter</li>
          <li className="font-size-13">1 number</li>
          <li className="font-size-13">1 special character</li>
        </ul>

        <label className="mt-4 d-block">New Password</label>
        <FormInputComponent
          value={password}
          onChange={(e) => this.setState({ password: e.target.value })}
          type="password"
          height="40px"
        />

        <label className="mt-4 d-block">Confirm New Password</label>
        <FormInputComponent
          value={password_confirm}
          onChange={(e) => this.setState({ password_confirm: e.target.value })}
          type="password"
          height="40px"
        />

        <div id="reset-user-password-modal__buttons">
          <a className="btn btn-primary" onClick={this.resetPassword}>
            Reset Password
          </a>
          <a className="btn btn-light" onClick={this.close}>
            Cancel
          </a>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(ResetUserPassword));
