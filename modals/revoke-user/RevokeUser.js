import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FormInputComponent } from "../../components";
import {
  removeActiveModal,
  setRevokeUserData,
  showAlert,
} from "../../redux/actions";

const mapStateToProps = (state) => {
  return {
    revokeUserData: state.modal.revokeUserData,
  };
};

class RevokeUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
    };
  }

  revoke = (e) => {
    e.preventDefault();
    const { revokeUserData } = this.props;
    const { name } = this.state;
    if (!revokeUserData || !revokeUserData.id) return;

    if (name != "REVOKE") {
      this.props.dispatch(showAlert("Please confirm the action"));
      return;
    }
  };

  close = (e) => {
    e.preventDefault();
    this.props.dispatch(removeActiveModal());
    this.props.dispatch(setRevokeUserData({}));
  };

  render() {
    const { revokeUserData } = this.props;
    const { name } = this.state;
    if (!revokeUserData || !revokeUserData.id) return null;

    return (
      <div id="revoke-user-modal">
        <h3>{`Revoke "${revokeUserData.first_name} ${revokeUserData.last_name}" Access`}</h3>
        <p className="mt-4">
          This user will no longer have access to FortifID portal.
        </p>

        <label className="mt-4 d-block font-size-13">
          Type <b>REVOKE</b> to confirm
        </label>
        <FormInputComponent
          value={name}
          onChange={(e) => this.setState({ name: e.target.value })}
          type="text"
          height="40px"
        />

        <div id="revoke-user-modal__buttons">
          <a className="btn btn-danger" onClick={this.revoke}>
            Revoke Access
          </a>
          <a className="btn btn-light" onClick={this.close}>
            Cancel
          </a>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(RevokeUser));
