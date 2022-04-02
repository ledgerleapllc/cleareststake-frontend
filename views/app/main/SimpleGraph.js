import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { format } from "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import DotLoader from "react-spinners/DotLoader";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
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
import { getGraphInfoWithParams } from "../../../utils/Thunk";
import { showAlert } from "../../../redux/actions";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
    globalSettings: state.global.globalSettings,
  };
};

class SimpleGraph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graphData: [],
      startDate: null,
      endDate: null,
      loading: false,
    };
  }

  componentDidMount() {
    const { authUser } = this.props;
    if (authUser && authUser.role == "user") this.getGraphInfo();
  }

  getGraphInfo() {
    const { startDate, endDate } = this.state;
    let params = {};
    if (startDate) {
      params = {
        ...params,
        startDate: format(new Date(startDate), "yyyy-MM-dd"),
      };
    }
    if (endDate) {
      params = {
        ...params,
        endDate: format(new Date(endDate), "yyyy-MM-dd"),
      };
    }
    this.props.dispatch(
      getGraphInfoWithParams(
        params,
        () => {
          this.setState({ loading: true });
        },
        (res) => {
          const graphData = res.graphData || [];
          this.setState({ graphData, loading: false });
        }
      )
    );
  }

  handleStartDate = (startDate) => {
    this.setState({ startDate });
  };

  handleEndDate = (endDate) => {
    this.setState({ endDate });
  };

  clickUpdate = (e) => {
    e.preventDefault();
    const { startDate, endDate } = this.state;
    if (startDate && endDate) {
      const time1 = new Date(startDate).getTime();
      const time2 = new Date(endDate).getTime();
      if (time1 > time2) {
        this.props.dispatch(
          showAlert("End date should be greater than start date")
        );
        return;
      }
    }
    this.getGraphInfo();
  };

  clickClear = (e) => {
    e.preventDefault();
    this.setState({ startDate: null, endDate: null }, () => {
      this.getGraphInfo();
    });
  };

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

  render() {
    const { authUser } = this.props;
    const { startDate, endDate, loading } = this.state;
    if (!authUser || !authUser.id) return null;

    return (
      <div id="app-dashboard-pageGraph__wrap">
        {loading ? (
          <div id="app-dashboard-pageGraph__loading">
            <DotLoader color="#0089D7" />
          </div>
        ) : null}
        <div id="app-dashboard-pageGraph">{this.renderGraph()}</div>
        <div id="app-dashboard-pageGraph__buttons">
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <div id="app-dashboard-pageGraph__pickerWrap">
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-start"
                label="Start Date"
                value={startDate}
                onChange={this.handleStartDate}
              />
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="MM/dd/yyyy"
                margin="normal"
                id="date-picker-end"
                label="End Date"
                value={endDate}
                onChange={this.handleEndDate}
              />
            </div>
          </MuiPickersUtilsProvider>
          <a
            id="gbtn-update"
            className="btn btn-primary"
            onClick={this.clickUpdate}
          >
            Update
          </a>
          <a
            id="gbtn-clear"
            className="btn btn-primary-outline"
            onClick={this.clickClear}
          >
            Clear
          </a>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(SimpleGraph));
