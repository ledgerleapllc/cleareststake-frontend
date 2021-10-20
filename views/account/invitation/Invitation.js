import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { Fade } from "react-reveal";
import { FormInputComponent, HiddenFieldComponent } from "../../../components";
import { showCanvas, hideCanvas } from "../../../redux/actions";
import Helper from "../../../utils/Helper";
import { finishInvitation, getInvitationData } from "../../../utils/Thunk";

import "./invitation.scss";

const mapStateToProps = () => {
  return {};
};

class Invitation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "",
      user: {},
      password: "",
      password_confirm: "",
      errorMessage: "",
      verified: false,
    };
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;

    const code = params.code;
    this.props.dispatch(
      getInvitationData(
        code,
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          if (res && res.user) {
            this.setState({
              code,
              user: res.user,
              verified: res.verified || false,
            });
          }
        }
      )
    );
  }

  // Input Field
  inputField(e, key) {
    this.setState({ errorMessage: "", [key]: e.target.value });
  }

  // Submit Application
  submit = (e) => {
    e.preventDefault();
    this.setState({ errorMessage: "" }, () => {
      this.submitCore();
    });
  };

  // Submit Core
  submitCore() {
    const { password, password_confirm, user, code } = this.state;

    if (!password || !password_confirm) {
      this.setState({ errorMessage: "Please input password" });
      return;
    }

    if (password != password_confirm) {
      this.setState({ errorMessage: "Password doesn't match" });
      return;
    }

    if (!Helper.checkPassword(password)) {
      this.setState({
        errorMessage: `Please use a password with at least 8 characters including at least one number, one letter and one symbol`,
      });
      return;
    }

    // Params
    const params = {
      userId: user.id,
      code,
      password,
    };

    this.props.dispatch(
      finishInvitation(
        params,
        () => {
          this.props.dispatch(showCanvas());
        },
        () => {
          this.props.dispatch(hideCanvas());
        }
      )
    );
  }

  render() {
    const { user, password, password_confirm, errorMessage, verified } =
      this.state;
    if (!user || !user.id) return null;

    if (verified) {
      return (
        <div id="invitation-page">
          <p>
            This link has already been activated. Please{" "}
            <Link to="/login">log in</Link> instead.
          </p>
        </div>
      );
    }

    return (
      <div id="invitation-page">
        <div className="white-box">
          <form method="post" action="" onSubmit={this.submit}>
            <HiddenFieldComponent type="text" />
            <HiddenFieldComponent type="password" />

            <Fade delay={500} duration={1000} right distance="20px">
              <h2 className="text-center">{`You're Invited`}</h2>
            </Fade>

            <Fade delay={200} duration={500} bottom distance="20px">
              <h3 className="text-center mt-4 mb-3">
                {user.first_name} {user.last_name}
              </h3>
            </Fade>

            <Fade delay={200} duration={500} bottom distance="20px">
              <p className="text-center font-size-14 mb-4">
                Welcome to your Casper token tracking portal. This portal will
                help manage your balance of CSPR and its associated value.
                <br /> <br />
                Please enter a password below to claim your{" "}
                {Helper.formatNumber(user.balance)} CSPR token.
              </p>
            </Fade>

            <Fade delay={200} duration={500} bottom distance="20px">
              <div className="c-form-row">
                <FormInputComponent
                  type="password"
                  required={true}
                  placeholder="Password *"
                  value={password}
                  onChange={(e) => this.inputField(e, "password")}
                  height="40px"
                />
              </div>
            </Fade>

            <Fade delay={200} duration={500} bottom distance="20px">
              <div className="c-form-row">
                <FormInputComponent
                  type="password"
                  required={true}
                  placeholder="Confirm Password *"
                  value={password_confirm}
                  onChange={(e) => this.inputField(e, "password_confirm")}
                  height="40px"
                />
              </div>
            </Fade>

            {errorMessage ? (
              <p className="font-size-14 mt-3 text-danger">{errorMessage}</p>
            ) : null}

            <Fade delay={200} duration={500} bottom distance="20px">
              <button type="submit" className="btn btn-primary">
                Activate account &amp; claim my token
              </button>
            </Fade>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(Invitation));
