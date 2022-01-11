import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import ClipLoader from "react-spinners/ClipLoader";
import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Scatter,
  ResponsiveContainer,
} from "recharts";
import { getGraphInfo } from "../../../utils/Thunk";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: "Credit Card",
      rangeType: "week",
      graphData: [],
      graphInfo: {},
      loading: false,
    };
  }

  componentDidMount() {
    this.getGraphInfo();
  }

  setType(type) {
    this.setState({ type }, () => {
      this.getGraphInfo();
    });
  }

  setRangeType = (e) => {
    this.setState({ rangeType: e.target.value }, () => {
      this.getGraphInfo();
    });
  };

  getGraphInfo() {
    const { loading, type, rangeType } = this.state;
    if (loading) return;

    const params = {
      type,
      rangeType,
    };

    this.props.dispatch(
      getGraphInfo(
        params,
        () => {
          this.setState({ loading: true });
        },
        (res) => {
          let graphData = res && res.graphData ? res.graphData : [];
          let graphInfo = res && res.graphInfo ? res.graphInfo : {};
          this.setState({ graphData, graphInfo, loading: false });
        }
      )
    );
  }

  renderLoader() {
    const { loading } = this.state;
    if (loading) {
      return (
        <div id="app-dashboard-pageGraph__canvas">
          <ClipLoader color="#0376BC" />
        </div>
      );
    }
    return null;
  }

  renderHeader() {
    const { type } = this.state;
    return (
      <div id="app-dashboard-pageGraph__header">
        <a
          className={
            type == "Credit Card"
              ? "btn btn-primary btn-small"
              : "btn btn-primary-outline btn-small"
          }
          onClick={() => this.setType("Credit Card")}
        >
          Credit Card
        </a>
        <a
          className={
            type == "Personal Loan"
              ? "btn btn-primary btn-small"
              : "btn btn-primary-outline btn-small"
          }
          onClick={() => this.setType("Personal Loan")}
        >
          Personal Loan
        </a>
        <a
          className={
            type == "Small Business Loan"
              ? "btn btn-primary btn-small"
              : "btn btn-primary-outline btn-small"
          }
          onClick={() => this.setType("Small Business Loan")}
        >
          Small Business Loan
        </a>
      </div>
    );
  }

  renderGraphHeader() {
    const { rangeType, graphInfo, type } = this.state;
    return (
      <div id="app-dashboard-pageGraph__graphHeader">
        <div>
          <h3>Total Calls: {graphInfo.total_api_calls || 0}</h3>
          <FormControl variant="outlined">
            <Select value={rangeType} onChange={this.setRangeType}>
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="today">Today</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div>
          <label>
            Consumer Insights Calls ({graphInfo.consumer_insights_calls || 0})
          </label>
          <label>
            Income Insights Calls ({graphInfo.income_insights_calls || 0})
          </label>
          {type == "Small Business Loan" ? (
            <label>
              Small Business Insights Calls (
              {graphInfo.business_insights_calls || 0})
            </label>
          ) : null}
        </div>
      </div>
    );
  }

  renderGraphFooter() {
    const { graphInfo, type } = this.state;
    return (
      <ul>
        <li>
          <label>Verified</label>
          <span>{graphInfo.verified || 0}</span>
          <p>Results may take upto 78 hours to update</p>
        </li>
        <li>
          <label>Not Verified</label>
          <span>{graphInfo.not_verified || 0}</span>
          <Link to={`/app/applications/?status=Not Verified&type=${type}`}>
            View all not verified
          </Link>
        </li>
        <li>
          <label>Needs Review</label>
          <span>{graphInfo.needs_review || 0}</span>
          <Link to={`/app/applications?status=Needs Review&type=${type}`}>
            View all needs review
          </Link>
        </li>
        <li>
          <label>Action Required</label>
          <span>{graphInfo.action_required || 0}</span>
          <Link to={`/app/applications?status=Action Required&type=${type}`}>
            View all action required
          </Link>
        </li>
      </ul>
    );
  }

  render() {
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;
    const { graphData } = this.state;

    return (
      <div id="app-dashboard-pageGraph">
        {this.renderLoader()}
        {this.renderHeader()}
        {this.renderGraphHeader()}
        <ResponsiveContainer width="100%" height={450}>
          <ComposedChart data={graphData}>
            <CartesianGrid stroke="#C2D2D9" />
            <XAxis dataKey="name" scale="band" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Area
              dataKey="Total Applications"
              stroke="#00B0B5"
              fill="rgba(0, 176, 181, 0.2)"
            />
            <Bar dataKey="Verified" barSize={40} fill="#42C27D" />
            <Line type="monotone" dataKey="Not Verified" stroke="#DE4A0B" />
            <Line type="monotone" dataKey="Needs Review" stroke="#FFC400" />
            <Scatter dataKey="Action Required" fill="#0376BC" />
          </ComposedChart>
        </ResponsiveContainer>
        {this.renderGraphFooter()}
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(Graph));
