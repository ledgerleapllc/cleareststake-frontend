/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import { Fragment } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { showCanvas, hideCanvas, removeActiveModal } from "../../redux/actions";
import Helper from "../../utils/Helper";
import { getUsers, addFundSale } from "../../utils/Thunk";
import { FormInputComponent, DataTable } from "../../components";

// eslint-disable-next-line no-undef
const moment = require("moment");

const Styles = styled.div`
  .fund-sale-table {
    .col-1 {
      flex: 0 0 4% !important;
      max-width: 4% !important;
    }
    .col-2 {
      flex: 0 0 15% !important;
      max-width: 15% !important;
    }
    .col-3 {
      flex: 0 0 12% !important;
      max-width: 12% !important;
    }
    .col-4 {
      flex: 0 0 12% !important;
      max-width: 12% !important;
    }
    .col-5 {
      flex: 0 0 14.5% !important;
      max-width: 14.5% !important;
    }
    .col-6 {
      flex: 0 0 14.5% !important;
      max-width: 14.5% !important;
    }
    .col-7 {
      flex: 0 0 14.5% !important;
      max-width: 14.5% !important;
    }
    .col-8 {
      flex: 0 0 14.5% !important;
      max-width: 14.5% !important;
    }
  }

  .fund-sale-confirmation-table {
    .col-1 {
      flex: 0 0 10% !important;
      max-width: 10% !important;
    }
    .col-2 {
      flex: 0 0 25.5% !important;
      max-width: 25.5% !important;
    }
    .col-3 {
      flex: 0 0 25.5% !important;
      max-width: 25.5% !important;
    }
    .col-4 {
      flex: 0 0 25.5% !important;
      max-width: 25.5% !important;
    }
    .col-5 {
      flex: 0 0 25.5% !important;
      max-width: 25.5% !important;
    }
  }
`;

const mapStateToProps = (state) => {
  return {
    authUser: state.global.authUser,
    globalSettings: state.global.globalSettings,
  };
};

class FundSale extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      total: 0,
      loading: false,
      page_id: 1,
      perPage: 100000,
      sort_key: "users.first_name",
      sort_direction: "desc",
      token_sold_amount: null,
      token_sold_percent: 0,
      select_all: false,
      total_balance: 0,
      showConfirm: false,
      columns: [],
      errorMessage: "",
      disabled: true,
      selectedFundTotal: 0,
      actualTotalAmount: null,
      actualPercentOfTotalAmount: null,
      notAllocateToken: 0,
      moreAllocateToken: 0,
      selectedCount: 0,
      token_price: null,
      showRecord: false,
      transaction_date: "",
      columnsTableConfirmation: [],
    };

    this.columnsTableConfirmation = [];
  }

  componentDidMount() {
    this.setState({
      columns: this.renderColumns(),
      columnsTableConfirmation: this.renderColumnsTableConfirmation(),
    });
    this.getUsers();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState?.token_sold_amount !== this.state?.token_sold_amount ||
      prevState?.selectedFundTotal !== this.state?.selectedFundTotal
    ) {
      this.rerenderUsers();
      this.setState({ columns: this.renderColumns() });
    }

    if (prevState?.token_price !== this.state.token_price) {
      this.setState({
        columnsTableConfirmation: this.renderColumnsTableConfirmation(),
      });
    }
  }

  rerenderUsers = () => {
    const { users, selectedFundTotal, token_sold_amount, select_all } =
      this.state;

    const _users = users.map((item) => {
      let percent = selectedFundTotal
        ? (+item.percent_of_fund_total / +selectedFundTotal) * 100
        : 0;
      percent = percent ? Helper.adjustNumericString(percent.toString(), 4) : 0;
      let amountSold = token_sold_amount
        ? (token_sold_amount / 100) * percent
        : 0;
      amountSold = amountSold
        ? Helper.adjustNumericString(amountSold.toString(), 2)
        : 0;
      item.percent_of_sale = percent;
      item.amount_sold = amountSold;

      if (!item.actual_percent_of_sale || !item.isEdited) {
        item.actual_percent_of_sale = percent;
      }

      if (!item.actual_amount_sold || !item.isEdited) {
        item.actual_amount_sold = amountSold;
      }

      return item;
    });
    const selectedCount = _users.filter((item) => item.isSelected).length;
    this.setState({ users: _users, selectedCount });

    const actualAmountSold = this.calcActualAmountSold(users);
    const actualPercentOfAmountSold = this.calcActualPercentOfAmountSold(users);
    const notAllocateToken =
      token_sold_amount > Math.round(actualAmountSold)
        ? token_sold_amount - Math.round(actualAmountSold)
        : 0;
    const moreAllocateToken =
      token_sold_amount < Math.round(actualAmountSold)
        ? Math.round(actualAmountSold) - token_sold_amount
        : 0;
    this.setState(
      {
        actualTotalAmount: Math.round(actualAmountSold),
        actualPercentOfTotalAmount: Math.round(actualPercentOfAmountSold),
        notAllocateToken: notAllocateToken,
        moreAllocateToken: moreAllocateToken,
      },
      () => {
        document.getElementById("actual-amount-sold").innerHTML =
          Helper.formatNumber(Math.round(actualAmountSold));
        document.getElementById("actual-percent-of-amount-sold").innerHTML =
          select_all ? "100%" : Math.round(actualPercentOfAmountSold) + "%";
      }
    );
  };

  renderColumns = () => {
    const {
      token_sold_amount,
      selectedFundTotal,
      actualTotalAmount,
      actualPercentOfTotalAmount,
    } = this.state;

    const columns = [
      {
        Header: "User",
        accessor: "full_name",
        Cell: ({ cell: { value } }) => {
          return <p className="font-size-14">{value}</p>;
        },
        Footer: <></>,
      },
      {
        Header: "Current CSPR",
        accessor: "balance",
        Cell: ({ cell: { value } }) => {
          let balance = parseFloat(value);
          balance = Helper.adjustNumericString(balance.toString(), 2);
          return (
            <div className="font-size-14">{Helper.formatNumber(balance)}</div>
          );
        },
        Footer: <></>,
      },
      {
        Header: "% of Fund Now",
        accessor: "percent_of_fund_total",
        Cell: ({ cell: { value } }) => {
          return (
            <div className="font-size-14">
              {Helper.formatNumber(value) + "%"}
            </div>
          );
        },
        Footer: "100%",
      },
      {
        Header: "% of Sale if Divided Equally",
        accessor: "percent_of_sale",
        Cell: ({ cell: { value, row } }) => {
          if (selectedFundTotal && row.isSelected) {
            return (
              <label className="font-size-14">
                {Helper.formatNumber(Math.round(+value)) + "%"}
              </label>
            );
          } else {
            return null;
          }
        },
        Footer: selectedFundTotal ? "100%" : 0,
      },
      {
        Header: "CSPR Sold if Divided Equally",
        accessor: "amount_sold",
        Cell: ({ cell: { value, row } }) => {
          if (selectedFundTotal && row.isSelected && token_sold_amount) {
            return (
              <label className="font-size-14">
                {Helper.formatNumber(Math.round(value))}
              </label>
            );
          } else {
            return null;
          }
        },
        Footer: `${
          token_sold_amount ? Helper.formatNumber(token_sold_amount) : 0
        }`,
      },
      {
        Header: "Actual CSPR To Be Sold",
        accessor: (d) => d,
        Cell: ({ cell: { value, row } }) => {
          if (value.amount_sold && row.isSelected) {
            return (
              <div className="c-form-row my-2">
                <FormInputComponent
                  type="text"
                  value={Helper.formatNumber(
                    value.actual_amount_sold
                      ? Math.round(value.actual_amount_sold)
                      : Math.round(value.amount_sold)
                  )}
                  onChange={(e) => this.inputActualCSPR(e, row)}
                  width="70%"
                />
              </div>
            );
          } else {
            return null;
          }
        },
        Footer: () => {
          return (
            <div id="actual-amount-sold">
              {actualTotalAmount !== null
                ? Helper.formatNumber(Math.round(actualTotalAmount))
                : Helper.formatNumber(token_sold_amount) || 0}
            </div>
          );
        },
      },
      {
        Header: "Actual % of Total Sold",
        accessor: (d) => d,
        Cell: ({ cell: { value, row } }) => {
          if (value.percent_of_sale && row.isSelected) {
            return (
              <label className="font-size-14 percent-of-total-sold">
                {Helper.adjustNumericString(
                  Math.round(value.actual_percent_of_sale).toString(),
                  4
                )}{" "}
                %
              </label>
            );
          } else {
            return null;
          }
        },
        Footer: () => {
          return (
            <div id="actual-percent-of-amount-sold">
              {actualPercentOfTotalAmount !== null
                ? Helper.adjustNumericString(
                    actualPercentOfTotalAmount.toString(),
                    4
                  )
                : 0}{" "}
              %
            </div>
          );
        },
      },
    ];

    return columns;
  };

  getUsers() {
    const { page_id, loading, perPage } = this.state;

    if (loading) return;

    const params = {
      page_id,
      page_length: perPage,
      in_fund: 1,
    };

    this.props.dispatch(
      getUsers(
        params,
        () => {
          this.setState({ loading: true });
        },
        (res) => {
          let users = [];
          const { globalSettings } = this.props;

          if (res?.users?.length) {
            users = res.users.map((row) => {
              row.full_name = `${row.first_name} ${row.last_name}`;
              row.percent_of_fund_total = 0;
              const balance = parseFloat(row.balance);
              let total_balance = globalSettings.real_total_infund || 0;
              total_balance = parseFloat(total_balance);
              if (total_balance == 0) return null;
              let percent = (balance / total_balance) * 100;
              percent = Helper.adjustNumericString(percent.toString(), 4);
              row.percent_of_fund_total = percent;
              return row;
            });
          }
          const total = res.total || 0;
          const total_balance = res.total_balance || 0;
          this.setState({ loading: false, total, users, total_balance });
        }
      )
    );
  }

  selectAll = () => {
    this.setState({ select_all: true });
  };

  // Submit Form
  submit = (e) => {
    e.preventDefault();
    const { authUser } = this.props;

    if (!authUser || !authUser.id) return null;
    this.setState({ showConfirm: true });
  };

  // Close
  close = (e) => {
    e.preventDefault();
    this.props.dispatch(removeActiveModal());
  };

  checkError() {
    const { total_balance, token_sold_amount } = this.state;

    let error = "";
    if (!token_sold_amount || token_sold_amount == "0")
      error = "Please input the amount being sold.";
    else if (parseFloat(token_sold_amount) > parseFloat(total_balance || 0))
      error =
        "Error: The amount being sold is greater than current total tokens.";

    if (error) {
      this.setState({
        errorMessage: error,
        disabled: true,
      });
    } else {
      this.setState({ errorMessage: "", disabled: false });
    }
  }

  // Input Amount
  inputAmount = (e) => {
    const { total_balance } = this.state;

    let value = e.target.value;
    value = Helper.unformatNumber(value);

    if (isNaN(value) || value == "") value = "0";
    else value = parseInt(value).toString();

    if (total_balance == 0) return null;

    let percent = (value / Helper.unformatNumber(total_balance)) * 100;
    percent = Helper.adjustNumericString(percent.toString(), 4);

    this.setState(
      { token_sold_amount: value, token_sold_percent: percent },
      () => {
        this.checkError();
      }
    );
  };

  inputToken = (e) => {
    const { users } = this.state;
    let value = e.target.value;

    this.setState({ token_price: value }, () => {
      let sum = 0;
      users.map((item) => {
        const usd =
          value && item.actual_amount_sold
            ? value * item.actual_amount_sold
            : 0;
        item.total_sale_proceeds = usd;
        sum = sum + +usd;
        return item;
      });

      this.setState({ users, total_sale: sum });
    });
  };

  inputActualCSPR = (e, row) => {
    const { users, token_sold_amount } = this.state;

    let value = e.target.value;

    if (value && +value > row.original.balance) {
      value = row.original.balance;
    }

    value = Helper.unformatNumber(value);

    if (isNaN(value) || value == "") value = "0";
    else value = parseInt(value).toString();

    const otherUsers = users.filter((item) => +item.id !== +row.id);
    const index = users.findIndex((item) => +item.id === +row.id);
    const temp = users;
    const actualPercent = +value ? (+value * 100) / token_sold_amount : 0;

    if (index !== -1) {
      temp[index].actual_amount_sold = value;
      temp[index].actual_percent_of_sale = actualPercent;
      temp[index].isEdited = true;
    }
    let actualTotal = this.calcActualAmountSold(otherUsers);
    let actualPercentOfTotal = this.calcActualPercentOfAmountSold(otherUsers);
    actualTotal = +actualTotal + +value;
    actualPercentOfTotal = actualPercentOfTotal + actualPercent;
    const notAllocateToken =
      token_sold_amount > Math.round(actualTotal)
        ? token_sold_amount - Math.round(actualTotal)
        : 0;
    const moreAllocateToken =
      token_sold_amount < Math.round(actualTotal)
        ? Math.round(actualTotal) - token_sold_amount
        : 0;
    this.setState({
      users: temp,
      actualTotalAmount: actualTotal,
      notAllocateToken: notAllocateToken,
      moreAllocateToken: moreAllocateToken,
    });
    document.getElementById("actual-amount-sold").innerHTML =
      Helper.formatNumber(Math.round(actualTotal));
    document.getElementById("actual-percent-of-amount-sold").innerHTML =
      Math.round(+actualPercentOfTotal) + "%";
    document.getElementsByClassName("percent-of-total-sold")[index].innerHTML =
      actualPercent
        ? Helper.adjustNumericString(actualPercent.toString(), 4) + "%"
        : "0%";
  };

  updateSelectedFundTotal = (value) => {
    this.setState({ selectedFundTotal: value });
  };

  updateRowSelected = (data) => {
    this.setState({ users: data });
  };

  calcActualAmountSold = (data) => {
    const reducer = (accumulator, currentValue) => {
      if (currentValue.isSelected) {
        return accumulator + +currentValue?.actual_amount_sold;
      } else {
        return accumulator;
      }
    };
    let actualTotal = data.reduce(reducer, 0);
    return actualTotal;
  };

  calcActualPercentOfAmountSold = (data) => {
    const reducer = (accumulator, currentValue) => {
      if (currentValue.isSelected) {
        return accumulator + +currentValue?.actual_percent_of_sale;
      } else {
        return accumulator;
      }
    };
    let actualTotal = data.reduce(reducer, 0);
    return actualTotal;
  };

  doAddFundSale = () => {
    const { users } = this.state;

    let params = users.filter((item) => item.isSelected);
    params = params.map((item) => {
      return {
        user_id: item.id,
        amount: item.actual_amount_sold,
      };
    });

    this.props.dispatch(
      addFundSale(
        { fund_sale_list: params },
        () => {
          this.props.dispatch(showCanvas());
        },
        (res) => {
          this.props.dispatch(hideCanvas());
          if (res && res.success) {
            this.setState({
              showConfirm: false,
              showRecord: true,
              transaction_date: res.transaction_date,
            });
          }
        }
      )
    );
  };

  // Render Content
  renderContent() {
    const { authUser } = this.props;
    if (!authUser || !authUser.id) return null;
    const {
      loading,
      users,
      token_sold_amount,
      total,
      select_all,
      total_balance,
      token_sold_percent,
      columns,
      errorMessage,
      notAllocateToken,
      moreAllocateToken,
      selectedCount,
    } = this.state;

    return (
      <Fragment>
        <div>
          <p>
            The {users.length} fund users hold{" "}
            {Helper.formatNumber(total_balance) || 0} tokens.
          </p>
          <div className="c-form-row my-2">
            <FormInputComponent
              type="text"
              value={Helper.formatNumber(token_sold_amount)}
              onChange={(e) => this.inputAmount(e)}
              required={true}
              width="30rem"
              placeholder="Enter the amount being sold"
            />
            {errorMessage ? (
              <p className="text-danger font-size-11 mt-2">{errorMessage}</p>
            ) : null}
          </div>
          <p className="font-size-12">
            This equals {token_sold_percent || 0} percentage of current supply
            and has a value of {Helper.formatNumber(token_sold_amount) || 0}.
          </p>
        </div>
        <div className="mt-2">
          <p>Please select the users selling</p>
          <span className="text-link font-size-12" onClick={this.selectAll}>
            Select All
          </span>
        </div>
        <div id="app-users-section">
          <div className="table-wrapper">
            <Styles>
              <DataTable
                columns={columns}
                data={users}
                loading={loading}
                paginationTotalRows={total}
                customClass="fund-sale-table"
                isSelectAll={select_all}
                setIsSelectAll={(value) => this.setState({ select_all: value })}
                onUpdateFundTotalSelected={this.updateSelectedFundTotal}
                onUpdateRowSelected={this.updateRowSelected}
              />
            </Styles>
          </div>
        </div>
        <p>
          Based on your selections. {selectedCount} users are selling the{" "}
          {token_sold_amount || 0} from their pools.{" "}
        </p>
        {notAllocateToken ? (
          <p className="text-danger font-size-11 mt-2">
            Error: ${notAllocateToken} tokens are NOT allocated
          </p>
        ) : null}
        {moreAllocateToken ? (
          <p className="text-danger font-size-11 mt-2">
            Error: ${moreAllocateToken} tokens are MORE allocated
          </p>
        ) : null}
      </Fragment>
    );
  }

  renderColumnsTableConfirmation() {
    const { actualTotalAmount, total_sale } = this.state;

    return [
      {
        Header: "User",
        accessor: "full_name",
        Cell: ({ cell: { value } }) => {
          return <p className="font-size-14">{value}</p>;
        },
        Footer: <></>,
      },
      {
        Header: "Actual CSPR To Be Sold",
        accessor: (d) => d,
        Cell: ({ cell: { value, row } }) => {
          if (value.actual_amount_sold) {
            return (
              <div className="c-form-row my-2">
                {Helper.formatNumber(value.actual_amount_sold)}
              </div>
            );
          } else {
            return null;
          }
        },
        Footer: () => {
          return (
            <div id="actual-amount-sold">
              {actualTotalAmount !== null
                ? Helper.formatNumber(Math.round(actualTotalAmount))
                : 0}
            </div>
          );
        },
      },
      {
        Header: "Actual % of Total Sold",
        accessor: (d) => d,
        Cell: ({ cell: { value, row } }) => {
          if (value.actual_percent_of_sale) {
            return (
              <label className="font-size-14 percent-of-total-sold">
                {Helper.adjustNumericString(
                  Math.round(value.actual_percent_of_sale).toString(),
                  4
                )}{" "}
                %
              </label>
            );
          } else {
            return null;
          }
        },
        Footer: () => {
          return <div id="actual-percent-of-amount-sold">100%</div>;
        },
      },
      {
        Header: "Total sale proceeds",
        accessor: (d) => d,
        Cell: ({ cell: { value } }) => {
          if (value.total_sale_proceeds) {
            return (
              <div className="total-sale-proceeds-item">
                $
                {Helper.formatNumber(
                  Helper.adjustNumericString(
                    value.total_sale_proceeds.toString(),
                    2
                  )
                )}
              </div>
            );
          } else {
            return null;
          }
        },
        Footer: () => {
          if (total_sale) {
            return (
              <div id="total-sale-proceeds">
                $
                {Helper.formatNumber(
                  Helper.adjustNumericString(total_sale.toString(), 2)
                )}
              </div>
            );
          } else {
            return null;
          }
        },
      },
    ];
  }

  // Render
  render() {
    const {
      showConfirm,
      disabled,
      notAllocateToken,
      moreAllocateToken,
      selectedCount,
      token_sold_amount,
      token_price,
      users,
      showRecord,
      transaction_date,
      columnsTableConfirmation,
    } = this.state;

    if (showConfirm || showRecord) {
      return (
        <div id="process-fund-sale-modal">
          <h3 className="mb-3">
            {showConfirm && "Fund Sale Confirmation"}
            {showRecord && "Fund Sale Record"}
          </h3>
          <Fragment>
            {showConfirm && (
              <div>
                <p>
                  The {selectedCount} fund users are selling
                  {Helper.formatNumber(token_sold_amount) || 0} tokens.
                </p>
                <div className="c-form-row my-2">
                  <FormInputComponent
                    type="text"
                    value={Helper.formatNumber(token_price)}
                    onChange={(e) => this.inputToken(e)}
                    required={true}
                    width="30rem"
                    placeholder="Enter the price per CSPR"
                  />
                </div>
              </div>
            )}
            {showRecord && (
              <div>
                Transaction date:{" "}
                {moment(transaction_date).local().format("M/D/YYYY h:mm A")}
              </div>
            )}
            <div id="app-users-section">
              <div className="table-wrapper">
                <Styles>
                  <DataTable
                    columns={columnsTableConfirmation}
                    data={users.filter((item) => item.isSelected)}
                    paginationTotalRows={
                      users.filter((item) => item.isSelected).length
                    }
                    customClass="fund-sale-confirmation-table"
                  />
                </Styles>
              </div>
            </div>
          </Fragment>
          {showRecord && (
            <div id="process-fund-sale-modal__buttons">
              <button
                onClick={this.close}
                type="button"
                className="btn btn-primary"
              >
                Back
              </button>
            </div>
          )}
          {showConfirm && (
            <div id="process-fund-sale-modal__buttons">
              <a className="btn btn-light" onClick={this.close}>
                Cancel
              </a>
              <button
                onClick={this.doAddFundSale}
                type="button"
                className="btn btn-primary"
              >
                Confirm
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <div id="process-fund-sale-modal">
        <h3 className="mb-3">Fund Sale</h3>
        {this.renderContent()}
        <div id="process-fund-sale-modal__buttons">
          <a className="btn btn-light" onClick={this.close}>
            Cancel
          </a>
          <button
            onClick={this.submit}
            type="button"
            className="btn btn-primary"
            disabled={disabled || notAllocateToken || moreAllocateToken}
          >
            Next
          </button>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(withRouter(FundSale));
