import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";

import "./app-settings-menu.scss";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class AppSettingsMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs: [],
    };
  }

  componentDidMount() {
    const { authUser } = this.props;
    if (authUser && authUser.id) this.initValues();
  }

  componentDidUpdate(prevProps) {
    const { authUser } = this.props;
    if (
      (!prevProps.authUser || !prevProps.authUser.id) &&
      authUser &&
      authUser.id
    )
      this.initValues();
  }

  initValues() {
    const { authUser } = this.props;
    const { role } = authUser;

    let tabs = [];
    if (role == "admin" || role == "supervisor") {
      tabs = [
        {
          link: "/app/settings",
          label: "Settings",
        },
        {
          link: "/app/settings/access-groups",
          label: "IP Access",
          pattern: "/app/settings/access-group",
        },
        {
          link: "/app/settings/activity-log",
          label: "Activity Log",
        },
      ];
    } else if (role == "loanofficer") {
      tabs = [
        {
          link: "/app/settings",
          label: "Settings",
        },
      ];
    }

    this.setState({ tabs });
  }

  checkClass(tab, path) {
    if (tab.link == path) return "active";
    if (tab.pattern && path.includes(tab.pattern)) return "active";
    return "";
  }

  renderTabs() {
    const items = [];
    const { history } = this.props;
    const { tabs } = this.state;

    let path = "/app";
    if (history && history.location && history.location.pathname)
      path = history.location.pathname;

    tabs.forEach((tab, index) => {
      items.push(
        <li key={`tab_${index}`} className={this.checkClass(tab, path)}>
          <Link to={tab.link}>{tab.label}</Link>
        </li>
      );
    });
    return items;
  }

  render() {
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;

    return (
      <div id="app-settings-pageMenu">
        <div className="c-container">
          <ul>{this.renderTabs()}</ul>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(AppSettingsMenu));
