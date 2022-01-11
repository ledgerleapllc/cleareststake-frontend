import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  BlockAlertComponent,
  FormInputComponent,
  FormSelectComponent,
} from "../../../components";
import {
  showAlert,
  setActiveModal,
  setCustomConfirmModalData,
} from "../../../redux/actions";
import { TIMEZONES } from "../../../utils/Constant";

const mapStateToProps = (state) => {
  return {
    blockAlertData: state.global.blockAlertData,
    authUser: state.global.authUser,
  };
};

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      timezone: "",
      twoFA_login: false,
      editable: false,
    };
  }

  inputField(e, key) {
    this.setState({ [key]: e.target.value });
  }

  toggleEdit = (e) => {
    e.preventDefault();
    const { editable } = this.state;
    this.setState({ editable: !editable });
  };

  showPasswordForm = (e) => {
    e.preventDefault();
    this.props.dispatch(setActiveModal("change-password"));
  };

  updateProfile = (e) => {
    e.preventDefault();

    const { first_name, last_name, email, timezone } = this.state;

    if (!first_name.trim()) {
      this.props.dispatch(showAlert("Please input first name"));
      return;
    }

    if (!last_name.trim()) {
      this.props.dispatch(showAlert("Please input last name"));
      return;
    }

    if (!email.trim()) {
      this.props.dispatch(showAlert("Please input email"));
      return;
    }

    if (!timezone.trim()) {
      this.props.dispatch(showAlert("Please input timezone"));
      return;
    }

    const params = {
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.trim(),
      timezone: timezone.trim(),
    };
    console.log(params);
  };

  turnOn = (e) => {
    e.preventDefault();
    this.props.dispatch(
      setCustomConfirmModalData({
        title: "Turn On Two-Factor Authentication",
        body: "Are you sure you want to turn on Two-Factor Authentication?",
        action: "enable-twoFA",
      })
    );
    this.props.dispatch(setActiveModal("custom-confirm"));
  };

  turnOff = (e) => {
    e.preventDefault();
    this.props.dispatch(
      setCustomConfirmModalData({
        title: "Turn Off Two-Factor Authentication",
        body: "Are you sure you want to turn off Two-Factor Authentication?",
        buttonColor: "danger",
        action: "disable-twoFA",
      })
    );
    this.props.dispatch(setActiveModal("custom-confirm"));
  };

  renderAlert() {
    const { blockAlertData } = this.props;
    if (blockAlertData && blockAlertData.type == "profile")
      return <BlockAlertComponent data={blockAlertData} />;

    return null;
  }

  render() {
    const { first_name, last_name, email, timezone, editable } = this.state;
    return (
      <div id="app-profile-page">
        <div className="c-container small">
          {this.renderAlert()}
          <h2 className="mb-4">Your Profile</h2>
          <form action="" method="POST" onSubmit={this.updateProfile}>
            <div className="row">
              <div className="col-md-6">
                <div className="c-form-row">
                  <label>First name</label>
                  {editable ? (
                    <FormInputComponent
                      value={first_name}
                      onChange={(e) => this.inputField(e, "first_name")}
                      type="text"
                      height="40px"
                      required={true}
                    />
                  ) : (
                    <span>{first_name}</span>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="c-form-row">
                  <label>Last name</label>
                  {editable ? (
                    <FormInputComponent
                      value={last_name}
                      onChange={(e) => this.inputField(e, "last_name")}
                      type="text"
                      height="40px"
                      required={true}
                    />
                  ) : (
                    <span>{last_name}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="c-form-row">
              <label>Work Email</label>
              {editable ? (
                <FormInputComponent
                  value={email}
                  onChange={(e) => this.inputField(e, "email")}
                  type="email"
                  height="40px"
                  required={true}
                />
              ) : (
                <span>{email}</span>
              )}
            </div>
            <div className="row">
              <div className="col-md-10">
                <div className="c-form-row">
                  <label>Time Zone</label>
                  {editable ? (
                    <Fragment>
                      <FormSelectComponent
                        value={timezone}
                        options={TIMEZONES}
                        onChange={(e) => this.inputField(e, "timezone")}
                        height="40px"
                        required={true}
                        placeholder="Select a timezone..."
                      />
                      <small>{`Select the time zone for your current  location. This will be displayed wherever time and date is displayed in the application.`}</small>
                    </Fragment>
                  ) : (
                    <span>{TIMEZONES[timezone]}</span>
                  )}
                </div>
              </div>
            </div>
          </form>
          <div className="spacer mt-4 mb-4"></div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(Profile));
