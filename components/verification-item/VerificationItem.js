import React, { Component, Fragment } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import * as Icon from "react-feather";

import "./verification-item.scss";

class VerificationItem extends Component {
  render() {
    const { title, content } = this.props;
    const { message, code, status } = content;

    return (
      <div className="verification-item">
        <div className="verification-itemHeader">
          <span>
            {status == "loading" ? (
              <ClipLoader size={16} color="#0376BC" />
            ) : status == "success" ? (
              <Icon.Check size={16} color="#42C27D" />
            ) : (
              <Icon.X size={16} color="#DE4A0B" />
            )}
          </span>
          <label>{title}</label>
        </div>
        {message || code ? (
          <div className="verification-itemBody">
            {message ? <p>{message}</p> : null}
            {code ? (
              <Fragment>
                <p className="mt-1">Reason Code:</p>
                <p>{code}</p>
              </Fragment>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
}

export default VerificationItem;
