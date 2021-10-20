import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import CardView from "./Card";
import UsersView from "./Users";
import TransactionsView from "./Transactions";
import CsprPriceView from "./CsprPrice";

import "./main.scss";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class Main extends Component {
  renderHeader() {
    const { authUser } = this.props;
    return (
      <div id="app-dashboard-pageHeader" className="mb-4">
        <h2>Hi, {authUser.first_name}</h2>
        <img src="/cleareststake.png" alt="" />
      </div>
    );
  }

  render() {
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;

    return (
      <div id="app-dashboard-page">
        <div className="c-container">
          {this.renderHeader()}
          <CardView />
          <UsersView />
          <TransactionsView />
          <CsprPriceView />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(Main));
