import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FormInputComponent } from "../../../components";
import { hideCanvas, showAlert, showCanvas } from "../../../redux/actions";
import Helper from "../../../utils/Helper";
import { sendResetEmail } from "../../../utils/Thunk";
import "./forgot-password.scss";

const mapStateToProps = () => {
  return {};
};

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
    };
  }

  inputField(e, key) {
    this.setState({ [key]: e.target.value });
  }

  submit = (e) => {
    e.preventDefault();
    const { email } = this.state;
    if (!email) return;

    if (!Helper.validateEmail(email)) {
      this.props.dispatch(showAlert("Input valid email address"));
      return;
    }

    this.props.dispatch(
      sendResetEmail(
        email,
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          if (res && res.success) {
            this.setState({ email: "" });
            this.props.dispatch(
              showAlert("Please check your inbox", "success")
            );
          }
        }
      )
    );
  };

  render() {
    const { email } = this.state;
    return (
      <div id="forgot-password-page">
        <div className="white-box">
          <form action="" method="POST" onSubmit={this.submit}>
            <h2>Forgot Password?</h2>
            <div className="c-form-row">
              <label>Email</label>
              <FormInputComponent
                type="email"
                value={email}
                onChange={(e) => this.inputField(e, "email")}
                required={true}
                height="3rem"
              />
            </div>
            <div id="forgot-password-page__button">
              <button type="submit" className="btn btn-primary">
                Continue
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(ForgotPassword));
