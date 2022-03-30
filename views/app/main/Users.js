import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import DataTable from "react-data-table-component";
import Switch from "react-switch";
import { getUsers, downloadUsersCSV } from "../../../utils/Thunk";
import Helper from "../../../utils/Helper";
import {
  setActiveModal,
  setResetPasswordUserData,
  setUsersTableStatus,
  showCanvas,
  hideCanvas,
} from "../../../redux/actions";

// eslint-disable-next-line no-undef
const moment = require("moment");

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
    globalSettings: state.global.globalSettings,
    usersTableStatus: state.table.usersTableStatus,
  };
};

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      page_id: 0,
      perPage: 30,
      sort_key: "users.first_name",
      sort_direction: "asc",
      users: [],
      total: 0,
      in_fund: false,
      columns: [],
    };
  }

  componentDidMount() {
    this.setState({ columns: this.renderColumns() });
    this.getUsers();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.usersTableStatus && this.props.usersTableStatus) {
      this.handlePageChange(1);
      this.props.dispatch(setUsersTableStatus(false));
    }

    if (prevState?.in_fund !== this.state?.in_fund) {
      this.setState({ columns: this.renderColumns() });
    }
  }

  getUsers() {
    const { page_id, loading, perPage, sort_key, sort_direction, in_fund } =
      this.state;

    if (loading) return;

    const params = {
      page_id,
      page_length: perPage,
      sort_key,
      sort_direction,
      in_fund: +in_fund,
    };

    this.props.dispatch(
      getUsers(
        params,
        () => {
          this.setState({ loading: true });
        },
        (res) => {
          const users = res.users || [];
          const total = res.total || 0;
          this.setState({ loading: false, total, users });
        }
      )
    );
  }

  handleSort = (column, direction) => {
    this.setState(
      { page_id: 1, sort_key: column.selector, sort_direction: direction },
      () => {
        this.getUsers();
      }
    );
  };

  handlePerRowsChange = (perPage) => {
    this.setState({ page_id: 1, perPage }, () => {
      this.getUsers();
    });
  };

  handlePageChange = (page_id) => {
    this.setState({ page_id }, () => {
      this.getUsers();
    });
  };

  clickResetPassword(row) {
    this.props.dispatch(setResetPasswordUserData(row));
    this.props.dispatch(setActiveModal("reset-user-password"));
  }

  handleChange = () => {
    const { in_fund } = this.state;
    this.setState({ page_id: 1, in_fund: !in_fund }, () => {
      this.getUsers();
    });
  };

  downloadCSV = () => {
    const { in_fund } = this.state;
    this.props.dispatch(
      downloadUsersCSV(
        { in_fund: +in_fund },
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          const url = window.URL.createObjectURL(new Blob([res]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "users.csv");
          document.body.appendChild(link);
          link.click();
          this.props.dispatch(hideCanvas());
        }
      )
    );
  };

  renderColumns = () => {
    const { in_fund } = this.state;
    const columns = [
      {
        name: "Name",
        selector: "users.first_name",
        cell: (row) => {
          return (
            <Link to={`/app/user/${row.id}`} className="font-size-14">
              {row.first_name} {row.last_name}
            </Link>
          );
        },
        sortable: true,
        compact: true,
        width: "150px",
      },
      {
        name: "Fund",
        cell: (row) => {
          return (
            <div className="font-size-14 nowrap">
              {row.in_fund ? "Yes" : "No"}
            </div>
          );
        },
        sortable: false,
        compact: true,
        width: "50px",
      },
      {
        name: "Total Tokens",
        selector: "users.balance",
        cell: (row) => {
          let balance = parseFloat(row.balance);
          balance = Helper.adjustNumericString(balance.toString(), 2);
          return (
            <div className="font-size-14">{Helper.formatNumber(balance)}</div>
          );
        },
        sortable: true,
        compact: true,
        width: "90px",
      },
      {
        name: in_fund ? "% of Fund Total" : "% of Total",
        cell: (row) => {
          const { globalSettings } = this.props;
          const balance = parseFloat(row.balance);
          let total_balance = in_fund
            ? globalSettings.real_total_infund || 0
            : globalSettings.real_total_balance || 0;
          total_balance = parseFloat(total_balance);
          if (total_balance == 0) return null;

          let percent = (balance / total_balance) * 100;
          percent = Helper.adjustNumericString(percent.toString(), 6);
          return (
            <div className="font-size-14">
              {Helper.formatNumber(percent) + "%"}
            </div>
          );
        },
        sortable: false,
        compact: true,
        width: "100px",
      },
      {
        name: "Withdraw Sum",
        cell: (row) => {
          return (
            <label className="font-size-14">
              {row.withdraw_sum
                ? Helper.formatNumber(row.withdraw_sum.toString())
                : "0"}
            </label>
          );
        },
        sortable: false,
        compact: true,
        width: "100px",
      },
      {
        name: "Last Withdraw",
        cell: (row) => {
          if (row.last_withdraw_date) {
            return (
              <label className="font-size-14 nowrap">
                {moment(row.last_withdraw_date + ".000Z")
                  .local()
                  .format("M/D/YYYY h:mm A")}
              </label>
            );
          }
          return null;
        },
        sortable: false,
        compact: true,
        width: "150px",
      },
      {
        name: "Total inflation",
        cell: (row) => {
          if (row.total_inflation) {
            let totalInflation = parseFloat(row.total_inflation);
            totalInflation = Helper.adjustNumericString(
              row.total_inflation.toString(),
              2
            );
            return (
              <div className="font-size-14 nowrap">
                {Helper.formatNumber(totalInflation)}
              </div>
            );
          }
          return null;
        },
        sortable: false,
        compact: true,
      },
      {
        name: "Action",
        cell: (row) => {
          return (
            <a
              onClick={() => this.clickResetPassword(row)}
              className="btn btn-primary btn-small nowrap"
            >
              Reset Password
            </a>
          );
        },
        sortable: false,
        compact: true,
      },
    ];

    return columns;
  };

  render() {
    const { users, loading, total, perPage, in_fund, columns } = this.state;
    const { authUser } = this.props;

    if (!authUser || authUser.role != "admin") return null;

    return (
      <div id="app-users-section" className="mt-5">
        <div id="app-users-sectionHeader">
          <div>
            <h3>Users</h3>
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
              <span>Fund Only</span>
            </label>
          </div>
          <div>
            <Link to={`/app/user/new`} className="btn btn-primary mr-3">
              <label className="font-size-14">Add User</label>
            </Link>
            <a className="btn btn-primary" onClick={this.downloadCSV}>
              <label className="font-size-14">Download CSV</label>
            </a>
          </div>
        </div>

        <div className="table-wrapper">
          <DataTable
            columns={columns}
            data={users}
            sortServer={true}
            onSort={this.handleSort}
            progressPending={loading}
            responsive
            noHeader
            striped={true}
            persistTableHead
            pagination
            paginationServer
            onChangeRowsPerPage={this.handlePerRowsChange}
            onChangePage={this.handlePageChange}
            paginationTotalRows={total}
            paginationPerPage={perPage}
            paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
          />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(Users));
