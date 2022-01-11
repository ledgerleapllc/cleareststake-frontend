import React, { Component } from "react";
import { Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  removeActiveModal,
  setTXTableStatus,
  setUsersTableStatus,
  showAlert,
  showCanvas,
  hideCanvas,
} from "../../redux/actions";
import Helper from "../../utils/Helper";
import { getAllUsers, depositAdmin } from "../../utils/Thunk";

const mapStateToProps = () => {
  return {};
};

class ProcessDepositAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 0,
      selectedUser: {},
      users: [],
      amount: "",
    };
  }

  componentDidMount() {
    this.props.dispatch(
      getAllUsers(
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          this.setState({
            users: res.users || [],
          });
        }
      )
    );
  }

  submit = (e) => {
    e.preventDefault();
    const { selectedUser, amount } = this.state;
    if (!selectedUser || !selectedUser.id) {
      this.props.dispatch(showAlert("Please select user"));
      return;
    }
    if (!amount || parseInt(amount) <= 0) {
      this.props.dispatch(showAlert("Please input amount"));
      return;
    }

    const params = {
      userId: selectedUser.id,
      amount,
    };

    this.props.dispatch(
      depositAdmin(
        params,
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          if (res && res.success) {
            this.props.dispatch(removeActiveModal());
            this.props.dispatch(setUsersTableStatus(true));
            this.props.dispatch(setTXTableStatus(true));
          }
        }
      )
    );
  };

  close = (e) => {
    e.preventDefault();
    this.props.dispatch(removeActiveModal());
  };

  inputAmount = (e) => {
    let value = e.target.value;
    value = Helper.unformatNumber(value);

    if (isNaN(value) || value == "") value = "";
    else value = parseInt(value).toString();

    this.setState({ amount: value });
  };

  changeUser = (e) => {
    const user = parseInt(e.target.value);
    this.setState({ user, amount: "" }, () => {
      const { users } = this.state;
      let selectedUser = {};
      for (let i in users) {
        if (users[i].id == user) {
          selectedUser = users[i];
          break;
        }
      }
      this.setState({ selectedUser });
    });
  };

  renderUsers() {
    const { users } = this.state;
    const items = [];
    if (users && users.length) {
      users.forEach((user, index) => {
        items.push(
          <option key={`option_${index}`} value={user.id}>
            {user.first_name} {user.last_name}
          </option>
        );
      });
    }
    return items;
  }

  renderSelectedUser() {
    const { selectedUser, amount } = this.state;
    if (!selectedUser || !selectedUser.id) return null;

    return (
      <Fragment>
        <label className="d-block mt-4">
          {selectedUser.first_name} {selectedUser.last_name} has{" "}
          {Helper.formatNumber(selectedUser.balance)} tokens available. How much
          has been deposited?
        </label>
        <input
          type="text"
          onChange={this.inputAmount}
          className="custom-form-control"
          value={Helper.formatNumber(amount)}
        />
      </Fragment>
    );
  }

  render() {
    const { user } = this.state;
    return (
      <div id="process-deposit-admin-modal">
        <h3>Record Deposit</h3>
        <label className="mt-4 d-block">
          Which user is depositing more tokens?
        </label>
        <select
          className="custom-form-control"
          value={user}
          onChange={this.changeUser}
        >
          <option value="0">Select User</option>
          {this.renderUsers()}
        </select>
        {this.renderSelectedUser()}
        <div id="process-deposit-admin-modal__buttons">
          <a className="btn btn-primary" onClick={this.submit}>
            Submit
          </a>
          <a className="btn btn-light" onClick={this.close}>
            Cancel
          </a>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(ProcessDepositAdmin));
