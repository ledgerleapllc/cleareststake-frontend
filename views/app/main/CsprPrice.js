import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import DataTable from "react-data-table-component";
import { getCSPRPrice } from "../../../utils/Thunk";
import Helper from "../../../utils/Helper";
import { MONTH_NUMBER } from "../../../utils/Constant";

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
    globalSettings: state.global.globalSettings,
    usersTableStatus: state.table.usersTableStatus,
  };
};

class CsprPrice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      page_id: 0,
      perPage: 30,
      sort_key: "",
      sort_direction: "asc",
      prices: [],
      total: 0,
    };
    this.columns = [];
  }

  componentDidMount() {
    // Table Columns
    this.columns = [
      {
        name: "Year",
        selector: "prices.year",
        cell: (row) => {
          return <label className="font-size-14">{row.year}</label>;
        },
        sortable: false,
        compact: true,
      },
      {
        name: "Month",
        selector: "prices.month",
        cell: (row) => {
          return (
            <label className="font-size-14">{MONTH_NUMBER[row.month]}</label>
          );
        },
        sortable: false,
        compact: true,
      },
      {
        name: "Average Price",
        selector: "prices.average_price",
        cell: (row) => {
          return (
            <label className="font-size-14">
              {Helper.formatNumber(row.average_price.toFixed(4))}
            </label>
          );
        },
        sortable: false,
        compact: true,
      },
      {
        name: "Highest Price",
        selector: "prices.highest_price",
        cell: (row) => {
          return (
            <label className="font-size-14">
              {Helper.formatNumber(row.highest_price.toFixed(4))}
            </label>
          );
        },
        sortable: false,
        compact: true,
      },
      {
        name: "Lowest Price",
        selector: "prices.lowest_price",
        cell: (row) => {
          return (
            <label className="font-size-14">
              {Helper.formatNumber(row.lowest_price.toFixed(4))}
            </label>
          );
        },
        sortable: false,
        compact: true,
      },
    ];

    this.getCSPRPrice();
  }

  getCSPRPrice() {
    const { page_id, loading, perPage, sort_key, sort_direction } = this.state;

    if (loading) return;

    const params = {
      page_id,
      page_length: perPage,
      sort_key,
      sort_direction,
    };

    this.props.dispatch(
      getCSPRPrice(
        params,
        () => {
          this.setState({ loading: true });
        },
        (res) => {
          const prices = res.data || [];
          const total = res.total || 0;
          this.setState({ loading: false, total, prices });
        }
      )
    );
  }

  handleSort = (column, direction) => {
    this.setState(
      { page_id: 1, sort_key: column.selector, sort_direction: direction },
      () => {
        this.getCSPRPrice();
      }
    );
  };

  handlePerRowsChange = (perPage) => {
    this.setState({ page_id: 1, perPage }, () => {
      this.getCSPRPrice();
    });
  };

  handlePageChange = (page_id) => {
    this.setState({ page_id }, () => {
      this.getCSPRPrice();
    });
  };

  render() {
    const { prices, loading, total, perPage } = this.state;
    const { authUser } = this.props;

    if (!authUser || authUser.role != "admin") return null;

    return (
      <div id="app-users-section" className="mt-5">
        <div id="app-users-sectionHeader">
          <div>
            <h3>CSPR Price</h3>
          </div>
        </div>

        <div className="table-wrapper">
          <DataTable
            columns={this.columns}
            data={prices}
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

export default connect(mapStateToProps)(withRouter(CsprPrice));
