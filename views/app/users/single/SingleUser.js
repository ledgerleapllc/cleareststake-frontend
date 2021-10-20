/* eslint-disable no-undef */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import DataTable from "react-data-table-component";
import Switch from "react-switch";

import Helper from "../../../../utils/Helper";
import {
  getSingleUser,
  updateUserInFund,
  downloadSingleUserTransaction,
} from "../../../../utils/Thunk";
import { hideCanvas, showCanvas, showAlert } from "../../../../redux/actions";

import LogsTable from "./Logs";

import "./single-user.scss";

const moment = require("moment");

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class SingleUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      transactions: [],
      total: 0,
      loading: false,
      sort_key: "transactions.id",
      sort_direction: "desc",
      in_fund: false,
      usd_fund_total: 0,
      fund_total: 0,
    };

    this.columns = [];
  }

  componentDidMount() {
    const {
      match: { params },
    } = this.props;

    // Table Columns
    this.columns = [
      {
        name: "Date",
        selector: "transactions.created_at",
        cell: (row) => {
          return (
            <label className="font-size-14">
              {moment(row.created_at).local().format("M/D/YYYY h:mm A")}
            </label>
          );
        },
        sortable: false,
        compact: true,
      },
      {
        name: "Transaction Type",
        selector: "transactions.action",
        cell: (row) => {
          return <label className="font-size-14">{row.action}</label>;
        },
        sortable: false,
        compact: true,
      },
      {
        name: "Amount of Transaction",
        selector: "transactions.amount",
        cell: (row) => {
          return (
            <label className="font-size-14">
              {Helper.formatNumber(row.amount)}
            </label>
          );
        },
        sortable: false,
        compact: true,
      },
      {
        name: "USD",
        selector: "transactions.usd",
        cell: (row) => {
          return (
            <label className="font-size-14">
              {row.usd ? `$${Helper.formatNumber(row.usd)}` : "$0"}
            </label>
          );
        },
        sortable: false,
        compact: true,
      },
      {
        name: "Total",
        selector: "transactions.balance",
        cell: (row) => {
          return (
            <label className="font-size-14">
              {Helper.formatNumber(row.balance)}
            </label>
          );
        },
        sortable: true,
        compact: true,
      },
    ];

    const userId = params.userId;
    const { loading, sort_key, sort_direction } = this.state;

    if (loading) return;

    const paramsAPI = {
      sort_key,
      sort_direction,
    };

    this.props.dispatch(
      getSingleUser(
        userId,
        paramsAPI,
        () => {
          this.setState({ loading: true });
        },
        (res) => {
          const user = res.user || {};
          const transactions = res.transactions || [];
          const total = res.total || 0;
          const in_fund = res.user.in_fund || false;
          const usd_fund_total = res.usd_fund_total;
          const fund_total = res.fund_total;
          this.setState({
            loading: false,
            user,
            total,
            transactions,
            in_fund,
            usd_fund_total,
            fund_total,
          });
        }
      )
    );
  }

  handleChange = () => {
    const { in_fund, user } = this.state;

    if (in_fund && user.usd) {
      this.props.dispatch(
        showAlert(
          "User had fund sales and must stay in fund",
          "warning",
          "right"
        )
      );
      return;
    }

    const {
      match: { params },
    } = this.props;
    const userId = params.userId;
    const in_fund_temp = !in_fund;
    this.setState({ in_fund: in_fund_temp }, () => {
      this.props.dispatch(
        updateUserInFund(
          { id: userId, body: { in_fund: +in_fund_temp } },
          () => {
            this.props.dispatch(showCanvas());
          },
          () => {
            this.props.dispatch(hideCanvas());
          }
        )
      );
    });
  };

  downloadCSV = () => {
    const {
      match: { params },
    } = this.props;
    const userId = params.userId;
    this.props.dispatch(
      downloadSingleUserTransaction(
        { id: userId },
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          const url = window.URL.createObjectURL(new Blob([res]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "user_transactions.csv");
          document.body.appendChild(link);
          link.click();
          this.props.dispatch(hideCanvas());
        }
      )
    );
  };

  // Render Info
  renderInfo() {
    const { user, in_fund, usd_fund_total, fund_total } = this.state;
    if (!user || !user.id) return null;

    return (
      <div className="single-user-info">
        <div>
          <label className="d-block font-size-14">
            Name: {user.first_name} {user.last_name}
          </label>
          <label className="d-block font-size-14 mt-1">
            Email: {user.email}
          </label>
          <label className="d-block font-size-14 mt-1">
            Token Balance:{" "}
            {user.balance ? Helper.formatNumber(user.balance) : "0"}
          </label>
          <label className="d-block font-size-14 mt-1">
            USD Fund Sale Total:{" "}
            {usd_fund_total ? `$${Helper.formatNumber(usd_fund_total)}` : "$0"}
          </label>
          <label className="d-block font-size-14 mt-1">
            Withdraw and Fund Sale Total:{" "}
            {fund_total ? Helper.formatNumber(fund_total) : "0"}
          </label>
        </div>
        <div>
          <label className="slick-label">
            <Switch
              onChange={this.handleChange}
              checked={in_fund}
              uncheckedIcon={false}
              checkedIcon={false}
              height={25}
              width={50}
              onColor="#0376BC"
            />
            <span>In Fund</span>
          </label>
        </div>
      </div>
    );
  }

  // Render Content
  render() {
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;
    const { loading, user, transactions } = this.state;

    if (!loading && (!user || !user.id)) {
      return (
        <div id="app-single-user-page">
          <div className="c-container">
            <div className="app-page-header mb-3">
              <h2>Single User Detail</h2>
            </div>
            <p>No details found</p>
          </div>
        </div>
      );
    }

    return (
      <div id="app-single-user-page">
        <div className="c-container">
          <div className="app-page-header mb-3">
            <h2>Single User Detail</h2>
          </div>
          {this.renderInfo()}

          {user && user.id ? (
            <Fragment>
              <h3 className="mt-5">Logins</h3>
              <div className="table-wrapper mt-3">
                <LogsTable userId={user.id} />
              </div>
            </Fragment>
          ) : null}

          <div className="d-flex align-items-center justify-content-between mt-5">
            <h3>Transactions</h3>
            <a className="btn btn-primary" onClick={this.downloadCSV}>
              <label className="font-size-14">Download CSV</label>
            </a>
          </div>
          <div className="table-wrapper mt-3">
            <DataTable
              columns={this.columns}
              data={transactions}
              sortServer={true}
              progressPending={loading}
              responsive
              noHeader
              striped={true}
              persistTableHead
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(SingleUser));
