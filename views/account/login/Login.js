/* eslint-disable no-undef */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { FormInputComponent } from "../../../components";
import { showCanvas, hideCanvas } from "../../../redux/actions";
import { login } from "../../../utils/Thunk";

const mapStateToProps = () => {
  return {};
};

const axios = require("axios");

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
  }

  inputField(e, key) {
    this.setState({ [key]: e.target.value });
  }

  submit = async (e) => {
    e.preventDefault();
    const { email, password } = this.state;
    if (!email || !password) return;

    this.props.dispatch(showCanvas());

    let ip = "";
    const response = await axios.get("https://api.ipify.org?format=json");
    if (response && response.data && response.data.ip) ip = response.data.ip;

    this.props.dispatch(
      login(
        email,
        password,
        ip,
        () => {},
        () => {
          this.props.dispatch(hideCanvas());
        }
      )
    );
  };

  render() {
    const { email, password } = this.state;
    return (
      <div id="login-page">
        <div className="white-box">
          <form action="" method="POST" onSubmit={this.submit}>
            <img src="/cleareststake.png" alt="" />
            <h2>Sign In</h2>
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
            <div className="c-form-row">
              <label>Password</label>
              <FormInputComponent
                type="password"
                value={password}
                onChange={(e) => this.inputField(e, "password")}
                required={true}
                height="3rem"
              />
            </div>
            <div id="login-page__button">
              <div>
                <p className="font-size-14">
                  <Link to="/forgot-password">Forgot Password?</Link>
                </p>
              </div>
              <button type="submit" className="btn btn-primary">
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(Login));
