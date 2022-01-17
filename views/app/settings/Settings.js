/* eslint-disable no-undef */
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FormInputComponent, HiddenFieldComponent } from "../../../components";
import { showAlert, showCanvas, hideCanvas } from "../../../redux/actions";
import Helper from "../../../utils/Helper";
import { changeEmail, changePassword } from "../../../utils/Thunk";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      new_password: "",
      new_password_confirm: "",
    };
  }

  componentDidMount() {
    const { authUser } = this.props;
    if (authUser && authUser.id) this.initValues();
  }

  componentDidUpdate(prevProps) {
    const { authUser } = this.props;
    const { authUser: authUserPrev } = prevProps;

    if ((!authUserPrev || !authUserPrev.id) && authUser && authUser.id)
      this.initValues();
  }

  // Init Values
  initValues() {
    const { authUser } = this.props;
    this.setState({ email: authUser.email });
  }

  // Input Field
  inputField(e, key) {
    this.setState({ [key]: e.target.value });
  }

  // Change Email
  changeEmail = (e) => {
    e.preventDefault();
    const { email } = this.state;
    const { authUser } = this.props;
    if (!Helper.validateEmail(email)) {
      this.props.dispatch(showAlert("Please input valid email address"));
      return;
    }

    if (email == authUser.email) {
      this.props.dispatch(showAlert("Please input different email address"));
      return;
    }

    const params = { email };
    this.props.dispatch(
      changeEmail(
        params,
        () => {
          this.props.dispatch(showCanvas());
        },
        () => {
          this.props.dispatch(hideCanvas());
        }
      )
    );
  };

  // Change Password
  changePassword = (e) => {
    e.preventDefault();
    const { password, new_password, new_password_confirm } = this.state;
    if (!password || !new_password || !new_password_confirm) {
      this.props.dispatch(showAlert("Please input all the password values"));
      return;
    }

    if (new_password != new_password_confirm) {
      this.props.dispatch(showAlert("New password does not match"));
      return;
    }

    if (
      !Helper.checkPassword(password) ||
      !Helper.checkPassword(new_password)
    ) {
      this.props.dispatch(
        showAlert(
          "Please use a password with at least 8 characters including at least one number, one letter and one symbol"
        )
      );
      return;
    }

    const params = { password, new_password };
    this.props.dispatch(
      changePassword(
        params,
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          if (res && res.success) {
            this.setState({
              password: "",
              new_password: "",
              new_password_confirm: "",
            });
          }
        }
      )
    );
  };

  render() {
    const { authUser } = this.props;
    const { email, password, new_password, new_password_confirm } = this.state;

    if (!authUser || !authUser.id) return null;

    return (
      <div id="app-settings-page">
        <div className="c-container small">
          <h2 className="mb-4">Settings</h2>

          <HiddenFieldComponent type="email" name="email" />
          <HiddenFieldComponent type="password" name="password" />

          <h3 className="mb-3">Change Email</h3>
          <div className="c-form-row">
            <div className="row">
              <div className="col-md-8">
                <label>Email Address</label>
                <FormInputComponent
                  type="email"
                  value={email}
                  onChange={(e) => this.inputField(e, "email")}
                  height="40px"
                  required={true}
                />
              </div>
            </div>
          </div>
          <div className="spacer mb-4"></div>
          <a className="btn btn-light" onClick={this.changeEmail}>
            Submit
          </a>

          <h3 className="mt-5 mb-3">Change Password</h3>
          <div className="c-form-row">
            <div className="row">
              <div className="col-md-8">
                <label>Current Password</label>
                <FormInputComponent
                  type="password"
                  value={password}
                  onChange={(e) => this.inputField(e, "password")}
                  height="40px"
                  required={true}
                />
              </div>
            </div>
          </div>
          <div className="c-form-row">
            <div className="row">
              <div className="col-md-8">
                <label>New Password</label>
                <FormInputComponent
                  type="password"
                  value={new_password}
                  onChange={(e) => this.inputField(e, "new_password")}
                  height="40px"
                  required={true}
                />
              </div>
            </div>
          </div>
          <div className="c-form-row">
            <div className="row">
              <div className="col-md-8">
                <label>Confirm New Password</label>
                <FormInputComponent
                  type="password"
                  value={new_password_confirm}
                  onChange={(e) => this.inputField(e, "new_password_confirm")}
                  height="40px"
                  required={true}
                />
              </div>
            </div>
          </div>
          <div className="spacer mb-4"></div>
          <a className="btn btn-light" onClick={this.changePassword}>
            Submit
          </a>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(Settings));
