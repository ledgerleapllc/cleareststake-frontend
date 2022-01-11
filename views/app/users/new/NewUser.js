import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import {
  FormInputComponent,
  FormSelectComponent,
} from "../../../../components";
import { showAlert, showCanvas, hideCanvas } from "../../../../redux/actions";
import Helper from "../../../../utils/Helper";
import { inviteUser } from "../../../../utils/Thunk";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class NewUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: "",
      last_name: "",
      email: "",
      balance: "",
      in_fund: null,
    };
  }

  submit = (e) => {
    e.preventDefault();
    const { first_name, last_name, email, balance, in_fund } = this.state;

    if (!first_name.trim()) {
      this.props.dispatch(showAlert("Please input first name or company name"));
      return;
    }

    if (!email.trim() || !Helper.validateEmail(email.trim())) {
      this.props.dispatch(showAlert("Please input valid email"));
      return;
    }

    if (!balance || !balance.trim() || parseInt(balance) <= 0) {
      this.props.dispatch(showAlert("Please input valid balance"));
      return;
    }

    if (!in_fund) {
      this.props.dispatch(showAlert("Please input in fund"));
      return;
    }

    const params = {
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.trim(),
      balance: balance.trim(),
      in_fund: in_fund,
    };

    this.props.dispatch(
      inviteUser(
        params,
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          if (res && res.success) {
            const { history } = this.props;
            history.push("/");
          }
        }
      )
    );
  };

  inputField(e, key) {
    this.setState({ [key]: e.target.value });
  }

  inputIntField(e, key) {
    let value = e.target.value;
    value = Helper.unformatNumber(value);

    if (isNaN(value) || value == "") value = "";
    else value = parseInt(value).toString();

    this.setState({ [key]: value });
  }

  render() {
    const { first_name, last_name, email, balance, in_fund } = this.state;

    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;

    return (
      <div id="app-new-user-page">
        <div className="c-container small">
          <div className="app-page-header mb-3">
            <h2>Add User</h2>
          </div>

          <form action="" method="POST" onSubmit={this.submit}>
            <div className="row">
              <div className="col-md-8">
                <div className="c-form-row">
                  <label>First Name or Company</label>
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
            <div className="row">
              <div className="col-md-8">
                <div className="c-form-row">
                  <label>In Fund?</label>
                  <FormSelectComponent
                    value={in_fund}
                    placeholder="Select..."
                    required={true}
                    onChange={(e) => this.inputField(e, "in_fund")}
                    options={["No", "Yes"]}
                    height="40px"
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-8">
                <div className="c-form-row">
                  <label>Starting Balance</label>
                  <FormInputComponent
                    type="text"
                    value={Helper.formatNumber(balance)}
                    required={true}
                    height="40px"
                    onChange={(e) => this.inputIntField(e, "balance")}
                  />
                </div>
              </div>
            </div>
            <div className="spacer mt-4 mb-4"></div>
            <div id="app-new-user-page__buttons">
              <button type="submit" className="btn btn-primary">
                Save User
              </button>
              <Link to="/app" className="btn btn-light">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(NewUser));
