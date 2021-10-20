/* eslint-disable no-undef */
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import DataTable from "react-data-table-component";
import { getLogs } from "../../../../utils/Thunk";

const moment = require("moment");

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
  };
};

class Logs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: [],
      total: 0,
      loading: false,
      sort_key: "log.id",
      sort_direction: "desc",
      page_id: 0,
      perPage: 10,
      status: "",
    };

    this.columns = [];
  }

  componentDidMount() {
    // Table Columns
    this.columns = [
      {
        name: "Date",
        selector: "log.created_at",
        cell: (row) => {
          return (
            <label className="font-size-14">
              {moment(row.created_at).local().format("M/D/YYYY h:mm A")}
            </label>
          );
        },
        sortable: true,
        compact: true,
      },
      {
        name: "IP",
        selector: "log.ip",
        cell: (row) => {
          return <label className="font-size-14">{row.ip}</label>;
        },
        sortable: true,
        compact: true,
      },
    ];

    this.getLogs();
  }

  // Get Logs
  getLogs() {
    const { page_id, loading, perPage, sort_key, sort_direction } = this.state;
    const { userId } = this.props;
    if (loading) return;

    const paramsAPI = {
      page_id,
      page_length: perPage,
      sort_key,
      sort_direction,
      userId,
    };

    this.props.dispatch(
      getLogs(
        paramsAPI,
        () => {
          this.setState({ loading: true });
        },
        (res) => {
          const total = res.total || 0;
          const logs = res.logs || [];
          this.setState({ loading: false, total, logs });
        }
      )
    );
  }

  // Handle Sort
  handleSort = (column, direction) => {
    this.setState(
      { page_id: 1, sort_key: column.selector, sort_direction: direction },
      () => {
        this.getLogs();
      }
    );
  };

  // Handle Per Rows Change
  handlePerRowsChange = (perPage) => {
    this.setState({ page_id: 1, perPage }, () => {
      this.getLogs();
    });
  };

  // Handle Page Change
  handlePageChange = (page_id) => {
    this.setState({ page_id }, () => {
      this.getLogs();
    });
  };

  // Render Content
  render() {
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;
    const { loading, logs, total, perPage } = this.state;

    return (
      <DataTable
        columns={this.columns}
        data={logs}
        sortServer={true}
        progressPending={loading}
        responsive
        noHeader
        striped={true}
        persistTableHead
        onSort={this.handleSort}
        pagination
        paginationServer
        onChangeRowsPerPage={this.handlePerRowsChange}
        onChangePage={this.handlePageChange}
        paginationTotalRows={total}
        paginationPerPage={perPage}
        paginationRowsPerPageOptions={[10, 20, 30, 40, 50]}
      />
    );
  }
}

export default connect(mapStateToProps)(withRouter(Logs));
