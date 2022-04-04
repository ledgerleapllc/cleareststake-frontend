/* eslint-disable no-undef */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import {
  FormInputComponent,
  FormSelectComponent,
} from "../../../../components";
import {
  showAlert,
  hideCanvas,
  setActiveModal,
  setRevokeUserData,
  setResetPasswordUserData,
  setCancelInviteUserData,
  setDeleteUserData,
  setCustomConfirmModalData,
} from "../../../../redux/actions";
import Helper from "../../../../utils/Helper";

const moment = require("moment");

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: "",
      first_name: "",
      last_name: "",
      email: "",
      branchKey: "",
      branches: [],
      user: {},
      userId: 0,
      accessGroupKey: "",
      accessGroups: [],
    };
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;

    const userId = params.userId;
    this.setState({ userId }, () => {
      this.getData();
    });
  }

  getData() {
    Promise.all([
      this.getBranches(),
      this.getAccessGroups(),
      this.getUser(),
    ]).then(() => {
      // All loaded
      this.props.dispatch(hideCanvas());
      const { user } = this.state;

      this.setState({
        role: user.role || "",
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
        branchKey: user.branch_id ? `branch_${user.branch_id}` : "",
        accessGroupKey: user.access_group_id
          ? `accessGroup_${user.access_group_id}`
          : "",
      });
    });
  }

  getUser() {
    const { userId } = this.state;
    console.log(userId);
  }

  getBranches() {
    //
  }

  getAccessGroups() {
    //
  }

  clickDelete = (e) => {
    e.preventDefault();
    const { user } = this.state;
    this.props.dispatch(setDeleteUserData(user));
    this.props.dispatch(setActiveModal("delete-user"));
  };

  clickResend = (e) => {
    e.preventDefault();
    const { user } = this.state;
    this.props.dispatch(
      setCustomConfirmModalData({
        title: `Resend an invitation to ${user.first_name} ${user.last_name}`,
        body: `This will send an invitation again to ${user.first_name} ${user.last_name}`,
        action: "resend-invitation",
        data: user,
      })
    );
    this.props.dispatch(setActiveModal("custom-confirm"));
  };

  clickCancelInvite = (e) => {
    e.preventDefault();
    const { user } = this.state;
    this.props.dispatch(setCancelInviteUserData(user));
    this.props.dispatch(setActiveModal("cancel-user-invite"));
  };

  clickResetPassword = (e) => {
    e.preventDefault();
    const { user } = this.state;
    this.props.dispatch(setResetPasswordUserData(user));
    this.props.dispatch(setActiveModal("reset-user-password"));
  };

  clickRevoke = (e) => {
    e.preventDefault();
    const { user } = this.state;
    this.props.dispatch(setRevokeUserData(user));
    this.props.dispatch(setActiveModal("revoke-user"));
  };

  clickRestore = (e) => {
    e.preventDefault();
    const { user } = this.state;
    this.props.dispatch(
      setCustomConfirmModalData({
        title: `Restore "${user.first_name} ${user.last_name}" Access`,
        body: `This will restore the access of ${user.first_name} ${user.last_name}`,
        action: "restore",
        data: user,
      })
    );
    this.props.dispatch(setActiveModal("custom-confirm"));
  };

  submit = (e) => {
    e.preventDefault();
    const { first_name, last_name, role, email, branchKey, accessGroupKey } =
      this.state;

    if (!role) {
      this.props.dispatch(showAlert("Please select role"));
      return;
    }

    if (!first_name.trim()) {
      this.props.dispatch(showAlert("Please input first name"));
      return;
    }

    if (!last_name.trim()) {
      this.props.dispatch(showAlert("Please input last name"));
      return;
    }

    if (!email.trim() || !Helper.validateEmail(email.trim())) {
      this.props.dispatch(showAlert("Please input valid email"));
      return;
    }

    if (!branchKey.trim()) {
      this.props.dispatch(showAlert("Please select branch"));
      return;
    }

    const branchId = parseInt(branchKey.replace("branch_", ""));

    let accessGroupId = 0;
    if (accessGroupKey)
      accessGroupId = parseInt(accessGroupKey.replace("accessGroup_", ""));

    const params = {
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      role,
      email: email.trim(),
      branchId,
      accessGroupId,
    };
    console.log(params);
  };

  setRole(e, role) {
    e.preventDefault();
    this.setState({ role });
  }

  inputField(e, key) {
    this.setState({ [key]: e.target.value });
  }

  renderButtons() {
    const { user } = this.state;
    return (
      <Fragment>
        {user.status == "active" ? (
          <a
            className="btn btn-danger-outline btn-small"
            onClick={this.clickRevoke}
          >
            Revoke Access
          </a>
        ) : user.status == "pending" ? (
          <a
            className="btn btn-light btn-small"
            onClick={this.clickCancelInvite}
          >
            Cancel Invite
          </a>
        ) : (
          <a
            className="btn btn-primary-outline btn-small"
            onClick={this.clickRestore}
          >
            Restore Access
          </a>
        )}
        <a
          className="btn btn-light btn-small"
          onClick={this.clickResetPassword}
        >
          Reset Password
        </a>
      </Fragment>
    );
  }

  renderStatus() {
    const { user } = this.state;
    return (
      <Fragment>
        <div className={`user-status-box ${user.status}`}>
          {user.status == "active"
            ? "Active"
            : user.status == "pending"
            ? "Pending"
            : "Revoked"}
        </div>
      </Fragment>
    );
  }

  renderExtraButton() {
    const { user } = this.state;
    if (user.status != "active")
      return (
        <a className="btn btn-danger-outline" onClick={this.clickDelete}>
          Delete User
        </a>
      );
    return null;
  }

  renderRoleSection() {
    const { role } = this.state;
    const { authUser } = this.props;

    if (authUser.role != "admin") return null;

    return (
      <div className="row">
        <div className="col-md-8">
          <div className="c-form-row">
            <label>Role (toggle/pill)</label>
            <select
              value={role}
              className="custom-form-control"
              style={{ height: "40px" }}
              onChange={(e) => this.inputField(e, "role")}
            >
              <option value="">Select a Role</option>
              <option value="supervisor">Supervisor</option>
              <option value="loanofficer">Loan Officer</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  renderBranchSection() {
    const { branches, branchKey } = this.state;
    const { authUser } = this.props;

    return (
      <Fragment>
        <h3 className="mb-3">Branch Information</h3>
        <div className="c-form-row">
          <label>Branch Name</label>
          {authUser.role == "admin" ? (
            <FormSelectComponent
              value={branchKey}
              required={true}
              height="40px"
              options={branches}
              placeholder="Select a Branch"
              onChange={(e) => this.inputField(e, "branchKey")}
            />
          ) : (
            <p>
              <b>{authUser.branch ? authUser.branch.name : ""}</b>
            </p>
          )}
        </div>
      </Fragment>
    );
  }

  renderLogs() {
    const { user } = this.state;
    const logs = [];
    if (user && user.logs) {
      user.logs.forEach((log, index) => {
        logs.push(
          <tr key={`log_${index}`}>
            <td>
              <p>
                {moment(log.created_at).local().format("M/D/YYYY")}
                <br />
                {moment(log.created_at).local().format("h:mm A")}
              </p>
            </td>
            <td>{log.ip}</td>
            <td>{log.event}</td>
          </tr>
        );
      });
    }
    return logs;
  }

  renderSidebar() {
    const { user } = this.state;
    if (user && user.status == "pending") {
      return (
        <Fragment>
          <label>Invitation</label>
          <p>Sent on {moment(user.created_at).local().format("M/D/YYYY")}</p>
          <div>
            <a
              className="btn btn-primary-outline btn-small"
              onClick={this.clickResend}
            >
              Resend
            </a>
            <a className="color-danger" onClick={this.clickCancelInvite}>
              Cancel
            </a>
          </div>
        </Fragment>
      );
    }
    return (
      <Fragment>
        <label>Activity Log</label>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>IP</th>
              <th>Event</th>
            </tr>
          </thead>
          <tbody>{this.renderLogs()}</tbody>
        </table>
      </Fragment>
    );
  }

  render() {
    const { first_name, last_name, email, accessGroupKey, accessGroups } =
      this.state;
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;

    return (
      <div id="app-edit-user-page">
        <div className="c-container">
          <div id="app-edit-user-page__content">
            <div id="app-edit-user-page__contentHeader">
              <h2>
                {first_name} {last_name}
              </h2>
              {this.renderStatus()}
            </div>

            <div id="app-edit-user-page__contentButtons">
              {this.renderButtons()}
            </div>

            <form action="" method="POST" onSubmit={this.submit}>
              <div className="app-page-header mb-3">
                <h3>Basic Info</h3>
              </div>
              <div className="row">
                <div className="col-md-8">
                  <div className="c-form-row">
                    <label>First Name</label>
                    <FormInputComponent
                      type="text"
                      value={first_name}
                      required={true}
                      height="40px"
                      onChange={(e) => this.inputField(e, "first_name")}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-8">
                  <div className="c-form-row">
                    <label>Last Name</label>
                    <FormInputComponent
                      type="text"
                      value={last_name}
                      required={true}
                      height="40px"
                      onChange={(e) => this.inputField(e, "last_name")}
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-8">
                  <div className="c-form-row">
                    <label>Email</label>
                    <FormInputComponent
                      type="email"
                      value={email}
                      required={true}
                      height="40px"
                      onChange={(e) => this.inputField(e, "email")}
                    />
                  </div>
                </div>
              </div>
              {this.renderRoleSection()}
              <div className="spacer mt-4 mb-4"></div>
              {this.renderBranchSection()}
              <div className="spacer mt-4 mb-4"></div>
              <h3 className="mb-3">Security</h3>
              <div className="c-form-row">
                <label>Access Group</label>
                <FormSelectComponent
                  value={accessGroupKey}
                  height="40px"
                  options={accessGroups}
                  placeholder="Select an access group"
                  onChange={(e) => this.inputField(e, "accessGroupKey")}
                />
              </div>
              <div className="spacer mt-4 mb-4"></div>
              <div id="app-edit-user-page__buttons">
                <button type="submit" className="btn btn-primary">
                  Update Info
                </button>
                <Link to="/app/users" className="btn btn-light">
                  Cancel
                </Link>
                {this.renderExtraButton()}
              </div>
            </form>
          </div>
          <div id="app-edit-user-page__sidebar">{this.renderSidebar()}</div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(EditUser));
