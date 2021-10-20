import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import * as Icon from "react-feather";

import "./mfa.scss";

const mapStateToProps = () => {
  return {};
};

class MFA extends Component {
  render() {
    return (
      <div id="mfa-success-page">
        <div className="white-box">
          <Link to="/">
            <img src="/logo3x.png" className="img-fluid" alt="" />
          </Link>
          <div className="mt-5 mb-4">
            <Icon.CheckCircle color="#42C27D" size={100} />
          </div>
          <h2 className="text-center">Phone number successfully verified</h2>
          <p className="mt-4 mb-4 text-center">
            Thank you for verifying your phone number. You can close this window
            now.
          </p>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(MFA));
