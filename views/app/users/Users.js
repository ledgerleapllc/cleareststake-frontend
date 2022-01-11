import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import * as Icon from "react-feather";
import { BlockAlertComponent } from "../../../components";
import DataTable from "react-data-table-component";
import {
  setActiveModal,
  setBulkApplyAccessGroupUsersData,
  setBulkRemoveAccessGroupUsersData,
  setCancelInviteUserData,
  setDeleteUserData,
  setUsersTableStatus,
  setRevokeUserData,
  showAlert,
} from "../../../redux/actions";

const mapStateToProps = (state) => {
  return {
    blockAlertData: state.global.blockAlertData,
    bulkApplyAccessGroupUsersData: state.modal.bulkApplyAccessGroupUsersData,
    bulkRemoveAccessGroupUsersData: state.modal.bulkRemoveAccessGroupUsersData,
    usersTableStatus: state.table.usersTableStatus,
    authUser: state.global.authUser,
  };
};

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      page_id: 0,
      perPage: 10,
      sort_key: "users.first_name",
      sort_direction: "asc",
      search: "",
      users: [],
      total: 0,
      totalAll: 0,
      totalActive: 0,
      totalPending: 0,
      totalRevoked: 0,
      status: "",
      selected: [],
      role: "",
    };

    this.columns = [];
    this.timer = null;
  }

  componentDidMount() {
    const { authUser } = this.props;
    this.columns = [
      {
        name: "Name",
        selector: "users.first_name",
        cell: (row) => {
          return (
            <div className="user-name-box">
              <label>
                {row.first_name} {row.last_name}
              </label>
              <div>{this.renderActions(row)}</div>
            </div>
          );
        },
        sortable: true,
        compact: true,
      },
      {
        name: "Email Address",
        selector: "users.email",
        cell: (row) => {
          return <div className="overflow-text">{row.email}</div>;
        },
        sortable: true,
        compact: true,
        minWidth: "250px",
      },
      {
        name: "Status",
        selector: "users.status",
        cell: (row) => {
          if (row.status == "active") {
            return (
              <div className={`user-status-box ${row.status}`}>Active</div>
            );
          } else if (row.status == "pending") {
            return (
              <div className={`user-status-box ${row.status}`}>Pending</div>
            );
          }

          return <div className={`user-status-box ${row.status}`}>Revoked</div>;
        },
        sortable: true,
        compact: true,
      },
      {
        name: "Role",
        selector: "users.role",
        cell: (row) => {
          if (row.role == "supervisor") return "Supervisor";
          else if (row.role == "loanofficer") return "Loan Officer";
          return "";
        },
        sortable: true,
        compact: true,
      },
      {
        name: "Branch",
        selector: "users.branch_id",
        cell: (row) => {
          return row.branchName || "";
        },
        sortable: true,
        compact: true,
      },
      {
        name: "IP Access Group",
        selector: "users.access_group",
        cell: (row) => {
          return row.accessGroupName || "";
        },
        sortable: false,
        compact: true,
      },
    ];

    if (authUser && authUser.id) this.initValues();
  }

  componentDidUpdate(prevProps) {
    const { usersTableStatus, authUser } = this.props;
    if (!prevProps.usersTableStatus && usersTableStatus) {
      this.props.dispatch(setUsersTableStatus(false));
      this.setState({ selected: [] }, () => {
        this.handlePageChange(1);
      });
    }
    if (
      (!prevProps.authUser || !prevProps.authUser.id) &&
      authUser &&
      authUser.id
    )
      this.initValues();
  }

  initValues() {
    const urlParams = new URLSearchParams(window.location.search);
    const role = urlParams.get("role") || "";
    this.setState({ role }, () => {
      this.getUsers();
    });
  }

  clickForceRefresh = (e) => {
    e.preventDefault();
    this.setState({ selected: [] }, () => {
      this.handlePageChange(1);
    });
  };

  getUsers() {
    const {
      page_id,
      loading,
      perPage,
      sort_key,
      sort_direction,
      search,
      status,
      role,
    } = this.state;

    if (loading) return;

    const params = {
      page_id,
      page_length: perPage,
      sort_key,
      sort_direction,
      search,
      status,
      role,
    };
    console.log(params);
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

  checkRowSelected = (row) => {
    const { selected } = this.state;
    return selected.includes(row.id);
  };

  handleRowSelect = (row) => {
    const selected = [];
    if (row.selectedRows && row.selectedRows.length) {
      row.selectedRows.forEach((item) => {
        selected.push(item.id);
      });
    }
    this.setState({ selected });
  };

  handleInput = (e) => {
    e.preventDefault();
    this.setState({ search: e.target.value, page_id: 1 }, () => {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }

      this.timer = setTimeout(() => {
        this.getUsers();
      }, 500);
    });
  };

  changeSelect = (e) => {
    this.setState({ status: e.target.value, page_id: 1 }, () => {
      this.getUsers();
    });
  };

  changeRole = (e) => {
    this.setState({ role: e.target.value, page_id: 1 }, () => {
      this.getUsers();
    });
  };

  changeBulk = (e) => {
    const action = e.target.value;
    const { selected } = this.state;
    if (!selected || !selected.length) {
      this.props.dispatch(showAlert("Please select rows"));
      return;
    }

    if (action == "bulk-apply-access-group") {
      this.props.dispatch(setBulkApplyAccessGroupUsersData(selected));
      this.props.dispatch(setActiveModal(action));
    } else if (action == "bulk-remove-access-group") {
      this.props.dispatch(setBulkRemoveAccessGroupUsersData(selected));
      this.props.dispatch(setActiveModal(action));
    }
  };

  clickRevoke(row) {
    this.props.dispatch(setRevokeUserData(row));
    this.props.dispatch(setActiveModal("revoke-user"));
  }

  clickDelete(row) {
    this.props.dispatch(setDeleteUserData(row));
    this.props.dispatch(setActiveModal("delete-user"));
  }

  clickCancel(row) {
    this.props.dispatch(setCancelInviteUserData(row));
    this.props.dispatch(setActiveModal("cancel-user-invite"));
  }

  renderActions(row) {
    return (
      <Fragment>
        <Link to={`/app/user/${row.id}/edit`}>Edit</Link>
        {row.status == "active" ? (
          <a onClick={() => this.clickRevoke(row)}>Revoke</a>
        ) : row.status == "pending" ? (
          <a onClick={() => this.clickCancel(row)}>Cancel</a>
        ) : (
          <a onClick={() => this.clickDelete(row)}>Delete</a>
        )}
      </Fragment>
    );
  }

  renderAlert() {
    const { blockAlertData } = this.props;
    if (blockAlertData && blockAlertData.type == "user")
      return <BlockAlertComponent data={blockAlertData} />;

    return null;
  }

  renderTableHeader() {
    const { totalAll, totalActive, totalPending, totalRevoked, status, role } =
      this.state;
    const { authUser } = this.props;

    return (
      <Fragment>
        <div id="app-users-page__tableHeader">
          <select value={status} onChange={this.changeSelect}>
            <option value="">Filter By Status</option>
            <option value="all">All Users ({totalAll})</option>
            <option value="active">Active Users ({totalActive})</option>
            <option value="pending">Pending Users ({totalPending})</option>
            <option value="revoked">Revoked Users ({totalRevoked})</option>
          </select>
          {authUser.role == "admin" || authUser.role == "supervisor" ? (
            <select id="filter-role" value={role} onChange={this.changeRole}>
              <option value="">Filter By Role</option>
              <option value="all">All Roles</option>
              <option value="supervisor">Supervisor</option>
              <option value="loanofficer">Loan Officer</option>
            </select>
          ) : null}
          <a onClick={this.clickForceRefresh}>
            <Icon.RefreshCw />
          </a>
          <select value="" onChange={this.changeBulk}>
            <option value="">Bulk Actions</option>
            <option value="bulk-apply-access-group">Apply Access Group</option>
            <option value="bulk-remove-access-group">
              Remove Access Group
            </option>
          </select>
        </div>
      </Fragment>
    );
  }

  render() {
    const { users, loading, total, perPage, search } = this.state;
    return (
      <div id="app-users-page">
        <div id="app-users-pageHeader">
          <div className="c-container">
            <Link to={`/app/user/new`} className="btn btn-primary btn-icon">
              <Icon.Plus size={18} />
              <label className="font-size-14">Add User</label>
            </Link>

            <div>
              <input
                type="text"
                value={search}
                placeholder="Search by name, email or branch"
                onChange={this.handleInput}
              />
              <Icon.Search color="#B2C6CF" size={18} />
            </div>
          </div>
        </div>

        <div className="c-container">
          {this.renderAlert()}
          {this.renderTableHeader()}
          <div className="table-wrapper">
            <DataTable
              columns={this.columns}
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
              selectableRows
              selectableRowSelected={this.checkRowSelected}
              onSelectedRowsChange={this.handleRowSelect}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(Users));
