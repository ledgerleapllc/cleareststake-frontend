import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FormInputComponent } from "../../components";
import { removeActiveModal, showAlert } from "../../redux/actions";
import Helper from "../../utils/Helper";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class ChangePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current_password: "",
      password: "",
      password_confirm: "",
    };
  }

  submit = (e) => {
    e.preventDefault();
    const { current_password, password, password_confirm } = this.state;

    if (!current_password || !password || !password_confirm) {
      this.props.dispatch(showAlert("Please input all the fields"));
      return;
    }

    if (password != password_confirm) {
      this.props.dispatch(showAlert("New password does not match"));
      return;
    }

    if (!Helper.checkPassword(password)) {
      this.props.dispatch(
        showAlert(
          `Please use a password with at least 8 characters including at least one number, one letter and one symbol`
        )
      );
      return;
    }

    const params = {
      current_password,
      new_password: password,
    };
    console.log(params);
  };

  close = (e) => {
    e.preventDefault();
    this.props.dispatch(removeActiveModal());
  };

  inputField(e, key) {
    this.setState({ [key]: e.target.value });
  }

  render() {
    const { current_password, password, password_confirm } = this.state;
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;

    return (
      <div id="change-password-modal">
        <h3 className="mb-3">Change Your Password</h3>
        <p className="font-size-13">Your password must have the following:</p>
        <ul>
          <li>{`8 character minimum`}</li>
          <li>{`1 uppercase letter`}</li>
          <li>{`1 number`}</li>
          <li>{`1 special character`}</li>
        </ul>

        <div className="c-form-row">
          <label>Current Password</label>
          <FormInputComponent
            value={current_password}
            type="password"
            onChange={(e) => this.inputField(e, "current_password")}
            height="40px"
          />
        </div>

        <div className="c-form-row">
          <label>New Password</label>
          <FormInputComponent
            value={password}
            type="password"
            onChange={(e) => this.inputField(e, "password")}
            height="40px"
          />
        </div>

        <div className="c-form-row">
          <label>Confirm New Password</label>
          <FormInputComponent
            value={password_confirm}
            type="password"
            onChange={(e) => this.inputField(e, "password_confirm")}
            height="40px"
          />
        </div>

        <div id="change-password-modal__buttons">
          <a className="btn btn-primary" onClick={this.submit}>
            Change Password
          </a>
          <a className="btn btn-light" onClick={this.close}>
            Close
          </a>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(ChangePassword));
