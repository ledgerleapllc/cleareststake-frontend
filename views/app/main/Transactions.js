import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import DataTable from "react-data-table-component";
import Switch from "react-switch";
import {
  setActiveModal,
  setTXTableStatus,
  showCanvas,
  hideCanvas,
} from "../../../redux/actions";
import { getTransactions, downloadTransactionsCSV } from "../../../utils/Thunk";
import Helper from "../../../utils/Helper";

// eslint-disable-next-line no-undef
const moment = require("moment");

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
    txTableStatus: state.table.txTableStatus,
  };
};

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      page_id: 0,
      perPage: 50,
      sort_key: "transactions.id",
      sort_direction: "desc",
      transactions: [],
      total: 0,
      columns: [],
      in_fund: false,
    };
  }

  componentDidMount() {
    const { authUser } = this.props;
    if (authUser && authUser.id) this.initValues();

    this.getTX();
  }

  componentDidUpdate(prevProps) {
    const { authUser } = this.props;
    if (
      (!prevProps.authUser || !prevProps.authUser.id) &&
      authUser &&
      authUser.id
    )
      this.initValues();

    if (!prevProps.txTableStatus && this.props.txTableStatus) {
      this.handlePageChange(1);
      this.props.dispatch(setTXTableStatus(false));
    }
  }

  initValues() {
    const { authUser } = this.props;
    let columns = [];

    if (authUser && authUser.role == "admin") {
      columns = [
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
          sortable: true,
          compact: true,
        },
        {
          name: "Transaction Type",
          selector: "transactions.action",
          cell: (row) => {
            return <label className="font-size-14">{row.action}</label>;
          },
          sortable: true,
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
          sortable: true,
          compact: true,
        },
        {
          name: "USD",
          selector: "transactions.usd",
          cell: (row) => {
            if (row.usd) {
              return (
                <label className="font-size-14">
                  ${Helper.formatNumber(row.usd)}
                </label>
              );
            } else {
              return <label className="font-size-14">$0</label>;
            }
          },
          sortable: true,
          compact: true,
        },
        {
          name: "User",
          selector: "transactions.user_id",
          cell: (row) => {
            return (
              <label className="font-size-14">
                {row.user.first_name} {row.user.last_name}
              </label>
            );
          },
          sortable: true,
          compact: true,
        },
      ];
    } else {
      columns = [
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
          sortable: true,
          compact: true,
        },
        {
          name: "Transaction Type",
          selector: "transactions.action",
          cell: (row) => {
            return <label className="font-size-14">{row.action}</label>;
          },
          sortable: true,
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
          sortable: true,
          compact: true,
        },
      ];
    }

    this.setState({ columns });
  }

  getTX() {
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
      getTransactions(
        params,
        () => {
          this.setState({ loading: true });
        },
        (res) => {
          const transactions = res.transactions || [];
          const total = res.total || 0;
          this.setState({ loading: false, total, transactions });
        }
      )
    );
  }

  // Handle Sort
  handleSort = (column, direction) => {
    this.setState(
      { page_id: 1, sort_key: column.selector, sort_direction: direction },
      () => {
        this.getTX();
      }
    );
  };

  // Handle Per Rows Change
  handlePerRowsChange = (perPage) => {
    this.setState({ page_id: 1, perPage }, () => {
      this.getTX();
    });
  };

  // Handle Page Change
  handlePageChange = (page_id) => {
    this.setState({ page_id }, () => {
      this.getTX();
    });
  };

  // Click Update
  clickUpdate = (e) => {
    e.preventDefault();
    this.props.dispatch(setActiveModal("update-inflation"));
  };

  // Click Process
  clickProcessWithdraw = (e) => {
    e.preventDefault();
    this.props.dispatch(setActiveModal("process-withdraw-admin"));
  };

  // Process Deposit
  clickProcessDeposit = (e) => {
    e.preventDefault();
    this.props.dispatch(setActiveModal("process-deposit-admin"));
  };

  handleChange = () => {
    const { in_fund } = this.state;
    this.setState({ page_id: 1, in_fund: !in_fund }, () => {
      this.getTX();
    });
  };

  downloadCSV = () => {
    const { in_fund } = this.state;
    this.props.dispatch(
      downloadTransactionsCSV(
        { in_fund: +in_fund },
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          const url = window.URL.createObjectURL(new Blob([res]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "transactions.csv");
          document.body.appendChild(link);
          link.click();
          this.props.dispatch(hideCanvas());
        }
      )
    );
  };

  clickProcessFundSale = (e) => {
    e.preventDefault();
    this.props.dispatch(setActiveModal("process-fund-sale"));
  };

  // Render
  render() {
    const { transactions, loading, total, perPage, columns, in_fund } =
      this.state;
    const { authUser } = this.props;

    if (!authUser || !authUser.id) return null;

    return (
      <div id="app-tx-section" className="mt-5">
        {authUser.role == "admin" ? (
          <div id="app-tx-sectionHeader">
            <div>
              <h3>Transactions</h3>
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
              <div>
                <a
                  id="update-inflation-btn"
                  className="btn btn-primary mr-3"
                  onClick={this.clickUpdate}
                >
                  <label className="font-size-14">Update for Inflation</label>
                </a>
                <a
                  id="process-deposit-btn"
                  className="btn btn-primary mr-3"
                  onClick={this.clickProcessDeposit}
                >
                  <label className="font-size-14">Process Deposit</label>
                </a>
                <a
                  id="process-withdraw-btn"
                  className="btn btn-primary mr-3"
                  onClick={this.clickProcessWithdraw}
                >
                  <label className="font-size-14">Process Withdraw</label>
                </a>
                <a className="btn btn-primary" onClick={this.downloadCSV}>
                  <label className="font-size-14">Download CSV</label>
                </a>
              </div>
              <div className="mt-md-3">
                <a
                  className="btn btn-primary mr-3"
                  onClick={this.clickProcessFundSale}
                >
                  <label className="font-size-14">Fund Sale</label>
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div id="app-tx-sectionHeader">
            <h3>Transactions</h3>
          </div>
        )}

        <div className="table-wrapper">
          <DataTable
            columns={columns}
            data={transactions}
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

export default connect(mapStateToProps)(withRouter(Transactions));
