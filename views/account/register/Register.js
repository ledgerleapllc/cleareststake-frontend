import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { FormInputComponent, FormSelectComponent } from "../../../components";
import { showAlert } from "../../../redux/actions";
import { COUNTRYLIST } from "../../../utils/Constant";
import Helper from "../../../utils/Helper";

import "./register.scss";

const mapStateToProps = () => {
  return {};
};

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      company_name: "",
      address: "",
      address2: "",
      city: "",
      country: "",
      state: "",
      zip: "",
      first_name: "",
      last_name: "",
      phone: "",
      ext: "",
      email: "",
      email_confirm: "",
      checked: false,
    };
  }

  getCountryOptions() {
    let options = {};
    COUNTRYLIST.forEach((item) => {
      options[item] = item;
    });
    return options;
  }

  inputField(e, key) {
    this.setState({ [key]: e.target.value });
  }

  setCheck = (e) => {
    const checked = e.target.checked;
    this.setState({ checked });
  };

  submit = (e) => {
    e.preventDefault();

    const {
      company_name,
      address,
      address2,
      city,
      country,
      state,
      zip,
      first_name,
      last_name,
      phone,
      ext,
      email,
      email_confirm,
      checked,
    } = this.state;

    if (!company_name.trim()) {
      this.props.dispatch(showAlert("Please input company name"));
      return;
    }

    if (!address.trim()) {
      this.props.dispatch(showAlert("Please input street address"));
      return;
    }

    if (!city.trim()) {
      this.props.dispatch(showAlert("Please input city"));
      return;
    }

    if (!country.trim()) {
      this.props.dispatch(showAlert("Please input country"));
      return;
    }

    if (!state.trim()) {
      this.props.dispatch(showAlert("Please input state"));
      return;
    }

    if (!zip.trim()) {
      this.props.dispatch(showAlert("Please input zip code"));
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

    if (!phone.trim()) {
      this.props.dispatch(showAlert("Please input phone number"));
      return;
    }

    if (!email.trim() || !email_confirm.trim()) {
      this.props.dispatch(showAlert("Please input work email"));
      return;
    }

    if (email.trim() != email_confirm.trim()) {
      this.props.dispatch(showAlert("Please confirm work email"));
      return;
    }

    if (!Helper.validateEmail(email.trim())) {
      this.props.dispatch(showAlert("Please input valid email address"));
      return;
    }

    if (!checked) {
      this.props.dispatch(showAlert("Please accept the terms & conditions"));
      return;
    }

    const params = {
      company: company_name.trim(),
      address: address.trim(),
      address_option: address2.trim(),
      city: city.trim(),
      country: country.trim(),
      state: state.trim(),
      zip: zip.trim(),
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      phone: phone.trim(),
      ext: ext.trim(),
      email: email.trim(),
      // eslint-disable-next-line no-undef
      url: process.env.NEXT_PUBLIC_MAIN_URL,
    };
    console.log(params);
  };

  render() {
    const {
      company_name,
      address,
      address2,
      city,
      country,
      state,
      zip,
      first_name,
      last_name,
      phone,
      ext,
      email,
      email_confirm,
      checked,
    } = this.state;

    return (
      <div id="register-page">
        <div className="white-box">
          <form method="post" action="" onSubmit={this.submit}>
            <div id="register-page__header">
              <span></span>
              <h3>Register an Account</h3>
            </div>

            <h4 className="mt-4">Business Information</h4>
            <div className="c-form-row">
              <label>Company Name</label>
              <FormInputComponent
                type="text"
                required={true}
                value={company_name}
                onChange={(e) => this.inputField(e, "company_name")}
              />
            </div>
            <div className="row">
              <div className="col-md-8">
                <div className="c-form-row">
                  <label>Street Address</label>
                  <FormInputComponent
                    type="text"
                    required={true}
                    value={address}
                    onChange={(e) => this.inputField(e, "address")}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="c-form-row">
                  <label>Suite, Unit, Floor, etc.</label>
                  <FormInputComponent
                    type="text"
                    value={address2}
                    onChange={(e) => this.inputField(e, "address2")}
                  />
                  <span>Optional</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4">
                <div className="c-form-row">
                  <label>City</label>
                  <FormInputComponent
                    type="text"
                    required={true}
                    value={city}
                    onChange={(e) => this.inputField(e, "city")}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <div className="c-form-row">
                  <label>Country</label>
                  <FormSelectComponent
                    value={country}
                    placeholder="Select..."
                    required={true}
                    onChange={(e) => this.inputField(e, "country")}
                    options={this.getCountryOptions()}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="c-form-row">
                  <label>State</label>
                  <FormInputComponent
                    type="text"
                    required={true}
                    value={state}
                    onChange={(e) => this.inputField(e, "state")}
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="c-form-row">
                  <label>ZIP Code</label>
                  <FormInputComponent
                    type="text"
                    required={true}
                    value={zip}
                    onChange={(e) => this.inputField(e, "zip")}
                  />
                </div>
              </div>
            </div>
            <div className="spacer my-4"></div>
            <h4>Account Information</h4>
            <div className="row">
              <div className="col-md-6">
                <div className="c-form-row">
                  <label>First Name</label>
                  <FormInputComponent
                    type="text"
                    required={true}
                    value={first_name}
                    onChange={(e) => this.inputField(e, "first_name")}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="c-form-row">
                  <label>Last Name</label>
                  <FormInputComponent
                    type="text"
                    required={true}
                    value={last_name}
                    onChange={(e) => this.inputField(e, "last_name")}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="c-form-row">
                  <label>Phone Number</label>
                  <FormInputComponent
                    type="text"
                    required={true}
                    value={phone}
                    onChange={(e) => this.inputField(e, "phone")}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div className="c-form-row">
                  <label>Ext.</label>
                  <FormInputComponent
                    type="text"
                    value={ext}
                    onChange={(e) => this.inputField(e, "ext")}
                  />
                  <span>Optional</span>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <div className="c-form-row">
                  <label>Work Email</label>
                  <FormInputComponent
                    type="email"
                    required={true}
                    value={email}
                    onChange={(e) => this.inputField(e, "email")}
                  />
                  <small>You will use this to log into FortifID portal.</small>
                </div>
              </div>
              <div className="col-md-6">
                <div className="c-form-row">
                  <label>Confirm Email Address</label>
                  <FormInputComponent
                    type="email"
                    required={true}
                    value={email_confirm}
                    onChange={(e) => this.inputField(e, "email_confirm")}
                  />
                </div>
              </div>
            </div>
            <div className="c-form-row">
              <div className="custom-form-control custom-form-control-checkbox">
                <input
                  id="agree-box"
                  type="checkbox"
                  checked={checked}
                  onChange={this.setCheck}
                />
                <label htmlFor="agree-box">
                  I accept the{" "}
                  <a
                    href="https://www.fortifid.com/terms-and-conditions"
                    target="_blank"
                    rel="noreferrer"
                  >
                    terms &amp; conditions
                  </a>
                </label>
              </div>
            </div>
            <div id="register-page_button">
              <p className="font-size-14">
                Already have an account? <Link to="/login">Login</Link>
              </p>
              <button type="submit" className="btn btn-primary">
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(Register));
