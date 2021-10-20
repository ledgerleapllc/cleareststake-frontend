import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Fade } from "react-reveal";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Switch from "react-switch";

import { setActiveModal, showCanvas, hideCanvas } from "../../../redux/actions";
import Helper from "../../../utils/Helper";
import { getGraphInfo } from "../../../utils/Thunk";

import "./main.scss";

// eslint-disable-next-line no-undef
const moment = require("moment");

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
    globalSettings: state.global.globalSettings,
  };
};

class Card extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphData: [],
      fundOnlyChecked: false,
    };
  }

  componentDidMount() {
    const { authUser } = this.props;
    if (authUser && authUser.role == "user") this.getGraphInfo();
  }

  getGraphInfo() {
    this.props.dispatch(
      getGraphInfo(
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          const graphData = res.graphData || [];
          this.setState({ graphData });
        }
      )
    );
  }

  renderGraph() {
    const { authUser } = this.props;
    const { graphData } = this.state;
    if (!authUser || authUser.role != "user") return null;
    return (
      <ResponsiveContainer width="100%" height={450}>
        <LineChart data={graphData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Price" stroke="#142d53" />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  clickGetHelp = (e) => {
    e.preventDefault();
    this.props.dispatch(setActiveModal("get-help"));
  };

  // Withdraw Process - Admin
  clickProcessAdmin = (e) => {
    e.preventDefault();
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;
    this.props.dispatch(setActiveModal("process-withdraw-admin"));
  };

  // Withdraw Process
  clickProcess = (e) => {
    e.preventDefault();
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;
    this.props.dispatch(setActiveModal("process-withdraw"));
  };

  renderLastDate() {
    const { globalSettings } = this.props;
    if (globalSettings && globalSettings.last_inflation_date)
      return moment(globalSettings.last_inflation_date + ".000Z")
        .local()
        .format("M/D/YYYY");
    return "";
  }

  // Render Withdraw Button
  renderWithdrawButton() {
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;

    // Admin
    if (authUser.role == "admin") {
      return (
        <a className="font-size-14" onClick={this.clickProcessAdmin}>
          <u>{`Request Withdraw`}</u>
        </a>
      );
    }

    // User
    let last_withdraw_request = authUser.last_withdraw_request;
    if (!last_withdraw_request) {
      return (
        <a className="font-size-14" onClick={this.clickProcess}>
          <u>{`Request Withdraw`}</u>
        </a>
      );
    }

    let diff = moment().diff(
      moment(last_withdraw_request + ".000Z"),
      "seconds"
    );

    if (diff >= 2 * 24 * 60 * 60) {
      return (
        <a className="font-size-14" onClick={this.clickProcess}>
          <u>{`Request Withdraw`}</u>
        </a>
      );
    }

    return (
      <a
        style={{ color: "#666" }}
        className="font-size-14"
        onClick={this.clickProcess}
      >
        <u>{`Request Withdraw`}</u>
      </a>
    );
  }

  handleChange = () => {
    const { fundOnlyChecked } = this.state;
    this.setState({ fundOnlyChecked: !fundOnlyChecked });
  };

  renderContent() {
    const { globalSettings, authUser } = this.props;
    const { fundOnlyChecked } = this.state;

    let balance = fundOnlyChecked
      ? globalSettings.real_total_infund || 0
      : globalSettings.real_total_balance || 0;
    if (authUser && authUser.role == "user") balance = authUser.balance || 0;
    let usd = 0;
    if (balance) {
      balance = Helper.adjustNumericString(balance.toString(), 2);
      balance = parseFloat(balance);
      usd = balance * parseFloat(globalSettings.token_price || 0);
      usd = Helper.adjustNumericString(usd.toString(), 2);
    }
    return (
      <Fade delay={200} duration={500} bottom distance="20px">
        <div id="app-dashboard-info">
          <div>
            <div>
              <article>
                <h3>Casper Token Total Balance</h3>
                <div className="mt-1">
                  <a className="font-size-14" onClick={this.clickGetHelp}>
                    <u>{`Get help / ask question`}</u>
                  </a>
                </div>
                <div>{this.renderWithdrawButton()}</div>
              </article>
              <section>
                <h2>{Helper.formatNumber(balance)}</h2>
                <label>= {Helper.formatNumber(usd)} USD</label>
              </section>
            </div>
            {authUser?.role === "admin" && (
              <div>
                <label className="slick-label">
                  <Switch
                    onChange={this.handleChange}
                    checked={fundOnlyChecked}
                    uncheckedIcon={false}
                    checkedIcon={false}
                    height={25}
                    width={50}
                    onColor="#0376BC"
                  />
                  <span>Fund Only</span>
                </label>
              </div>
            )}
          </div>
          <div>
            <label className="d-block font-size-14 font-weight-700">
              Last Staking Reward Date:
            </label>
            <span className="d-block font-weight-700">
              {this.renderLastDate()}
            </span>
            <p className="mt-3 font-size-14">{`This is the last date inflation rewards were credited to balances.`}</p>
          </div>
        </div>
      </Fade>
    );
  }

  render() {
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;

    return (
      <div>
        <div id="app-dashboard-pageCards">{this.renderContent()}</div>
        <div id="app-dashboard-pageGraph">{this.renderGraph()}</div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(Card));
