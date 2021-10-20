import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import "./applications-menu.scss";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class ApplicationsMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.tabs = [
      {
        label: "Credit Card",
        value: "Credit Card",
      },
      {
        label: "Personal Loan",
        value: "Personal Loan",
      },
      {
        label: "Small Business Loan",
        value: "Small Business Loan",
      },
    ];
  }

  clickTab(tab) {
    const { onClick } = this.props;
    if (onClick) onClick(tab.value);
  }

  renderTabs() {
    const { activeTab } = this.props;
    const items = [];
    this.tabs.forEach((tab, index) => {
      items.push(
        <li
          key={`tab_${index}`}
          className={activeTab == tab.value ? "active" : ""}
          onClick={() => this.clickTab(tab)}
        >
          <a>{tab.label}</a>
        </li>
      );
    });
    return items;
  }

  render() {
    return (
      <div id="app-applications-pageMenu">
        <div className="c-container">
          <ul>{this.renderTabs()}</ul>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(ApplicationsMenu));
