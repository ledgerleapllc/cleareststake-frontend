import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  removeActiveModal,
  setCancelInviteUserData,
} from "../../redux/actions";

import "./cancel-user-invite.scss";

const mapStateToProps = (state) => {
  return {
    cancelInviteUserData: state.modal.cancelInviteUserData,
  };
};

class ResetUserPassword extends Component {
  proceed = (e) => {
    e.preventDefault();
    const { cancelInviteUserData } = this.props;
    if (!cancelInviteUserData || !cancelInviteUserData.id) return;
  };

  close = (e) => {
    e.preventDefault();
    this.props.dispatch(removeActiveModal());
    this.props.dispatch(setCancelInviteUserData({}));
  };

  render() {
    const { cancelInviteUserData } = this.props;
    if (!cancelInviteUserData || !cancelInviteUserData.id) return null;

    return (
      <div id="cancel-user-invite-modal">
        <h3>{`Cancel Invite`}</h3>
        <label className="mt-4 mb-3 d-block font-size-13">
          This will cancel the invitation sent to{" "}
          <b>
            {cancelInviteUserData.first_name} {cancelInviteUserData.last_name}
          </b>
        </label>

        <div id="cancel-user-invite-modal__buttons">
          <a className="btn btn-primary" onClick={this.proceed}>
            Proceed
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
