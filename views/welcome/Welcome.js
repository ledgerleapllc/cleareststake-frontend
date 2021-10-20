import React, { Component } from "react";
import { Redirect, withRouter } from "react-router-dom";

class Welcome extends Component {
  render() {
    const { auth: authUser } = this.props;
    if (authUser && authUser.id) return <Redirect to="/app" />;
    return <Redirect to="/login" />;
  }
}

export default withRouter(Welcome);
