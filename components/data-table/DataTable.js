/* eslint-disable react/display-name */
import React, { useEffect, useState } from "react";

import { useTable, usePagination, useRowSelect } from "react-table";

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

export default function DataTable({
  columns,
  data,
  loading,
  customClass,
  paginationTotalRows,
  isSelectAll,
  setIsSelectAll,
  onUpdateFundTotalSelected,
  onUpdateRowSelected,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    footerGroups,
    page,
    toggleAllPageRowsSelected,
    toggleRowSelected,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
    selectedFlatRows,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize: 10, pageIndex: 0 },
      autoResetSelectedRows: false,
      getRowId: (row) => row.id,
    },
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks?.visibleColumns?.push((columns) => [
        {
          id: "selection",
          Header: "Selling?",
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );
  const [isSelectAllRows, setIsSelectAllRows] = useState(null);
  const [notSelectedRows, setNotSelectRow] = useState([]);
  const [totalFund, setTotalFund] = useState(0);

  useEffect(() => {
    if (isSelectAll && !!data.length) {
      setIsSelectAllRows(true);
      toggleAllPageRowsSelected(true);
      setNotSelectRow([]);
      setTotalFund(100);

      const _data = data.map((item) => {
        item.isSelected = true;
        return item;
      });
      onUpdateRowSelected(_data);
    }
  }, [isSelectAll]);

  useEffect(() => {
    if (isSelectAllRows) {
      toggleAllPageRowsSelected(true);
      notSelectedRows.forEach((id) => {
        const isInCurrentPage = data.find((item) => item.id === id);
        if (isInCurrentPage) {
          toggleRowSelected(id, false);
        }
      });
    }
  }, [isSelectAllRows, pageIndex]);

  useEffect(() => {
    if (onUpdateFundTotalSelected) {
      if (onUpdateFundTotalSelected) {
        onUpdateFundTotalSelected(totalFund);
      }
    }
  }, [totalFund]);

  useEffect(() => {
    if (data.length && selectedFlatRows.length === data.length) {
      if (setTotalFund) {
        setTotalFund(100);
      }
      if (setIsSelectAll) {
        setIsSelectAll(true);
      }
    }
  }, [selectedFlatRows.length]);

  const rowCount = paginationTotalRows;
  const lastIndex = (pageIndex + 1) * pageSize;
  const firstIndex = lastIndex - pageSize + 1;
  const range =
    pageIndex === pageCount - 1
      ? `${firstIndex}-${rowCount} of ${rowCount}`
      : `${firstIndex}-${lastIndex} of ${rowCount}`;

  return (
    <div
      className={`data-table-wrapper${
        !data?.length && !loading ? " data-table-empty" : ""
      }`}
    >
      <div className={`data-table table-scroll ${customClass || ""}`}>
        <div className={`table-content ${loading ? "overflow-hidden" : ""}`}>
          <div className="table-scroll-head">
            <div className="table-scroll-head-inner">
              <table {...getTableProps()}>
                <thead>
                  {headerGroups.map((headerGroup, idx) => (
                    <tr key={idx} {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column, idx) => (
                        <th
                          key={idx}
                          {...column.getHeaderProps()}
                          className={`col-${idx + 1}`}
                        >
                          {column.render("Header")}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
              </table>
            </div>
          </div>
          {loading && <div className="table-loading">Loading...</div>}
          {!loading && !data?.length && (
            <p className="text-center py-4">There are no records to display</p>
          )}
          {!!data?.length && (
            <>
              <div className="table-scroll-body">
                <div className="table-scroll-body-inner">
                  <table>
                    <tbody {...getTableBodyProps()}>
                      {page.map((row, i) => {
                        prepareRow(row);
                        return (
                          <tr
                            key={row.original.id || i}
                            {...row.getRowProps({
                              onClick: (e) => {
                                if (e.target.type === "checkbox") {
                                  if (e.target.checked === false) {
                                    if (setIsSelectAll) {
                                      setIsSelectAll(false);
                                    }
                                    setNotSelectRow((pre) => {
                                      return [...pre, ...[row.original.id]];
                                    });
                                    setTotalFund(
                                      (pre) =>
                                        +pre -
                                        +row.original.percent_of_fund_total
                                    );
                                    const index = data.findIndex(
                                      (item) => +item.id === +row.original.id
                                    );
                                    if (index !== -1) {
                                      data[index].isSelected = false;
                                    }
                                    onUpdateRowSelected(data);
                                  }

                                  if (e.target.checked) {
                                    setTotalFund(
                                      (pre) =>
                                        +pre +
                                        +row.original.percent_of_fund_total
                                    );
                                    const index = data.findIndex(
                                      (item) => +item.id === +row.original.id
                                    );
                                    if (index !== -1) {
                                      data[index].isSelected = true;
                                    }
                                    onUpdateRowSelected(data);
                                  }
                                }
                              },
                            })}
                          >
                            {row.cells.map((cell, i) => {
                              return (
                                <td
                                  key={i}
                                  {...cell.getCellProps()}
                                  className={`col-${i + 1}`}
                                >
                                  {cell.render("Cell")}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="table-scroll-footer">
                <div className="table-scroll-footer-inner">
                  <table>
                    <tfoot>
                      {footerGroups.map((group, ind) => (
                        <tr
                          {...group.getFooterGroupProps()}
                          key={"footer" + ind}
                        >
                          {group.headers.map((column, ind) => (
                            <td
                              {...column.getFooterProps()}
                              key={"footer-header" + ind}
                              className={`col-${ind + 1}`}
                            >
                              {column.render("Footer")}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tfoot>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <div className="pagination">
        <div className="d-flex align-items-center">
          <span>Rows per page:</span>
          <div className="total-row-select">
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
              }}
            >
              {[3, 5, 10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path d="M7 10l5 5 5-5z"></path>
              <path d="M0 0h24v24H0z" fill="none"></path>
            </svg>
          </div>
        </div>
        <div className="range">
          <span>{range}</span>
        </div>
        <div className="actions d-flex">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              aria-hidden="true"
              role="presentation"
            >
              <path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"></path>
              <path fill="none" d="M24 24H0V0h24v24z"></path>
            </svg>
          </button>{" "}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              aria-hidden="true"
              role="presentation"
            >
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
              <path d="M0 0h24v24H0z" fill="none"></path>
            </svg>
          </button>{" "}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              aria-hidden="true"
              role="presentation"
            >
              <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path>
              <path d="M0 0h24v24H0z" fill="none"></path>
            </svg>
          </button>{" "}
          <button
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              aria-hidden="true"
              role="presentation"
            >
              <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"></path>
              <path fill="none" d="M0 0h24v24H0V0z"></path>
            </svg>
          </button>{" "}
        </div>
      </div>
    </div>
  );
}
