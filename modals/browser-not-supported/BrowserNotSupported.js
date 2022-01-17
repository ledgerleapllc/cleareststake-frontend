import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import { removeActiveModal } from "../../redux/actions";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class BrowserNotSupported extends Component {
  constructor(props) {
    super(props);
  }

  // Close Modal
  close = (e) => {
    if (e) e.preventDefault();
    this.props.dispatch(removeActiveModal());
  };

  render() {
    return (
      <div id="browser-not-supported-modal">
        <p className="font-size-14">
          CasperStake noticed you are using Brave browser, unfortunately
          CasperStake does not support Brave properly at this time.
        </p>
        <div id="browser-not-supported-modal__buttons">
          <a className="btn btn-primary" onClick={this.close}>
            OK
          </a>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(BrowserNotSupported));
