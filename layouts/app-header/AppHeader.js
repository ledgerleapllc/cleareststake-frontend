/* eslint-disable no-undef */
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import * as Icon from "react-feather";
import { saveUser, showMenu, hideMenu } from "../../redux/actions";
import Helper from "../../utils/Helper";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
    menuShown: state.global.menuShown,
  };
};

const tabs = [
  {
    link: "/app",
    label: "Dashboard",
  },
];

const tabsAdmin = [
  {
    link: "/app",
    label: "Dashboard",
  },
  {
    link: "/app/settings",
    label: "Settings",
  },
  {
    link: "/app",
    label: "Log Out",
  },
];

class AppHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userClicked: false,
    };
  }

  componentDidMount() {
    document.body.addEventListener("click", (e) => {
      const { userClicked } = this.state;
      if (!userClicked) return;

      if (
        e.target &&
        e.target.classList &&
        e.target.classList.contains("clickMe")
      ) {
        // Do Nothing
      } else {
        this.setState({ userClicked: false });
      }
    });
  }

  // Click Tab
  clickTab = (e, tab) => {
    e.preventDefault();
    this.hideMenu();
    if (tab.label == "Log Out") this.logout(e);
    else {
      const { history } = this.props;
      history.push(tab.link);
    }
  };

  // Show Menu
  showMenu = () => {
    this.props.dispatch(showMenu());
  };

  // Hide Menu
  hideMenu = () => {
    this.props.dispatch(hideMenu());
  };

  // Logout
  logout = (e) => {
    e.preventDefault();
    this.setState({ userClicked: false });
    Helper.storeUser({});
    this.props.dispatch(saveUser({}));
  };

  // Check Class
  checkClass(tab, path) {
    if (tab.link == path) return "active";
    if (tab.pattern && path.includes(tab.pattern)) return "active";
    return "";
  }

  // Check Setting Class
  checkSettingClass() {
    const { history } = this.props;
    let path = "/app";
    if (history && history.location && history.location.pathname)
      path = history.location.pathname;

    if (path == "/app/settings" || path.includes("/app/setting"))
      return "active";
    return "";
  }

  // Check Profile Class
  checkProfileClass() {
    const { userClicked } = this.state;
    const { history } = this.props;
    let path = "/app";
    if (history && history.location && history.location.pathname)
      path = history.location.pathname;

    let className = userClicked ? "active clickMe" : "clickMe";
    if (path == "/app/profile") className += " highlighted";
    return className;
  }

  // Toggle User Icon
  toggleUserIcon = (e) => {
    e.preventDefault();
    const { userClicked } = this.state;
    this.setState({ userClicked: !userClicked });
  };

  // Render Tabs Admin
  renderTabsAdmin() {
    const items = [];
    const { history } = this.props;

    let path = "/app";
    if (history && history.location && history.location.pathname)
      path = history.location.pathname;

    tabsAdmin.forEach((tab, index) => {
      items.push(
        <li key={`tab_${index}`}>
          <a
            onClick={(e) => this.clickTab(e, tab)}
            className={this.checkClass(tab, path)}
          >
            {tab.label}
          </a>
        </li>
      );
    });
    return items;
  }

  // Render Tabs
  renderTabs() {
    const items = [];
    const { history } = this.props;

    let path = "/app";
    if (history && history.location && history.location.pathname)
      path = history.location.pathname;

    tabs.forEach((tab, index) => {
      items.push(
        <li key={`tab_${index}`}>
          <a
            onClick={(e) => this.clickTab(e, tab)}
            className={this.checkClass(tab, path)}
          >
            {tab.label}
          </a>
        </li>
      );
    });
    return items;
  }

  // Render Profile Info
  renderProfileInfo() {
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;

    if (authUser.role == "admin") {
      return (
        <div id="app-profile-tabItem">
          <p>
            <b>
              {authUser.first_name} {authUser.last_name}
            </b>
          </p>
          <label>
            <b>Admin</b>
          </label>
        </div>
      );
    }

    return (
      <div id="app-profile-tabItem">
        <p>
          <b>
            {authUser.first_name} {authUser.last_name}
          </b>
        </p>
        <label>
          <b>User</b>
        </label>
      </div>
    );
  }

  // Render Content
  render() {
    const { authUser, menuShown } = this.props;
    if (!authUser || !authUser.id) return null;

    return (
      <div id="app-header">
        <div id="app-headerInner">
          <Link to="/" id="top-logo">
            <label>Token Tracker</label>
          </Link>

          <div id="header-menu" className={menuShown ? "active" : ""}>
            <div id="header-menu-close" onClick={this.hideMenu}>
              <Icon.X />
            </div>
            <ul id="header-menu-desktop">{this.renderTabs()}</ul>
            <ul id="header-menu-mobile">{this.renderTabsAdmin()}</ul>
          </div>

          <div id="header-icons">
            <ul>
              <li className={this.checkSettingClass()}>
                <Link to="/app/settings">
                  <Icon.Settings color="#ffffff" />
                </Link>
              </li>
              <li className={this.checkProfileClass()}>
                <a onClick={this.toggleUserIcon} className="clickMe">
                  <Icon.User color="#ffffff" className="clickMe" />
                </a>
                <ul className="clickMe">
                  <li>{this.renderProfileInfo()}</li>
                  <li>
                    <a className="clickMe" onClick={this.logout}>
                      Log Out
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>

          <div id="mobile-burger" onClick={this.showMenu}>
            <Icon.Menu color="#ffffff" />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(AppHeader));
