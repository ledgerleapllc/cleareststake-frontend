import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { FormInputComponent } from "../../components";
import {
  removeActiveModal,
  setDeleteUserData,
  showAlert,
} from "../../redux/actions";

const mapStateToProps = (state) => {
  return {
    deleteUserData: state.modal.deleteUserData,
  };
};

class DeleteUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
    };
  }

  delete = (e) => {
    e.preventDefault();
    const { deleteUserData } = this.props;
    const { name } = this.state;
    if (!deleteUserData || !deleteUserData.id) return;

    if (name != "DELETE") {
      this.props.dispatch(showAlert("Please confirm the action"));
      return;
    }
  };

  close = (e) => {
    e.preventDefault();
    this.props.dispatch(removeActiveModal());
    this.props.dispatch(setDeleteUserData({}));
  };

  render() {
    const { deleteUserData } = this.props;
    const { name } = this.state;
    if (!deleteUserData || !deleteUserData.id) return null;

    return (
      <div id="delete-user-modal">
        <h3>{`Delete "${deleteUserData.first_name} ${deleteUserData.last_name}"`}</h3>
        <p className="mt-4">
          This action will permanently delete this user. There is no undo.
        </p>

        <label className="mt-4 d-block font-size-13">
          Type <b>DELETE</b> to confirm
        </label>
        <FormInputComponent
          value={name}
          onChange={(e) => this.setState({ name: e.target.value })}
          type="text"
          height="40px"
        />

        <div id="delete-user-modal__buttons">
          <a className="btn btn-danger" onClick={this.delete}>
            Delete User
          </a>
          <a className="btn btn-light" onClick={this.close}>
            Cancel
          </a>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(DeleteUser));
