import React, { Component } from "react";
import { Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import {
  removeActiveModal,
  showAlert,
  showCanvas,
  hideCanvas,
} from "../../redux/actions";
import { sendHelpRequest } from "../../utils/Thunk";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class GetHelp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
    };
  }

  submit = (e) => {
    e.preventDefault();
    const { authUser } = this.props;
    const { text } = this.state;

    if (!authUser || !authUser.id) return;
    if (!text) {
      this.props.dispatch(showAlert("Please input your question or request"));
      return;
    }

    const params = {
      text,
    };

    this.props.dispatch(
      sendHelpRequest(
        params,
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          if (res && res.success) this.close();
        }
      )
    );
  };

  // Close Modal
  close = (e) => {
    if (e) e.preventDefault();
    this.props.dispatch(removeActiveModal());
  };

  inputText = (e) => {
    this.setState({ text: e.target.value });
  };

  renderContent() {
    const { text } = this.state;

    return (
      <Fragment>
        <label className="font-size-14 d-block mt-4">
          {`Enter your question or request below. An admin will receive your comment and assist you within 2 business days.`}
        </label>
        <textarea value={text} onChange={this.inputText}></textarea>
      </Fragment>
    );
  }

  render() {
    return (
      <div id="get-help-modal">
        <h3>Get Help / Ask a Question</h3>
        {this.renderContent()}
        <div id="get-help-modal__buttons">
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

export default connect(mapStateToProps)(withRouter(GetHelp));
