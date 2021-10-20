/* eslint-disable no-unreachable */
import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { GlobalCanvasComponent, PopupAlertComponent } from "../components";
import {
  CancelUserInviteModal,
  ChangePasswordModal,
  DeleteUserModal,
  GetHelpModal,
  ProcessWithdrawAdminModal,
  ProcessDepositAdminModal,
  ProcessWithdrawModal,
  ResetUserPasswordModal,
  RevokeUserModal,
  UpdateInflationModal,
  FundSaleModal,
  BrowserNotSupportedModal,
} from "../modals";
import { hideAlert } from "../redux/actions";
import { getSettings } from "../utils/Thunk";
import Helper from "../utils/Helper";
import { setActiveModal } from "../redux/actions";

const mapStateToProps = (state) => {
  return {
    showAlert: state.global.showAlert,
    showAlertMessage: state.global.showAlertMessage,
    showAlertType: state.global.showAlertType,
    showAlertHorizontal: state.global.showAlertHorizontal,
    showCanvas: state.global.showCanvas,
    authUser: state.global.authUser,
    activeModal: state.global.activeModal,
  };
};

class Global extends Component {
  componentDidMount() {
    const { authUser } = this.props;
    if (authUser && authUser.id) this.props.dispatch(getSettings());

    Helper.isBrave().then((res) => {
      if (res) {
        this.props.dispatch(setActiveModal("browser-not-supported"));
      }
    });
  }

  componentDidUpdate(prevProps) {
    const { authUser } = this.props;
    const { authUser: authUserPrev } = prevProps;

    if ((!authUserPrev || !authUserPrev.id) && authUser && authUser.id)
      this.props.dispatch(getSettings());
  }

  hideAlert = () => {
    this.props.dispatch(hideAlert());
  };

  renderModal(modal) {
    if (modal == "change-password") return <ChangePasswordModal />;
    else if (modal == "revoke-user") return <RevokeUserModal />;
    else if (modal == "reset-user-password") return <ResetUserPasswordModal />;
    else if (modal == "cancel-user-invite") return <CancelUserInviteModal />;
    else if (modal == "delete-user") return <DeleteUserModal />;
    else if (modal == "update-inflation") return <UpdateInflationModal />;
    else if (modal == "process-withdraw-admin")
      return <ProcessWithdrawAdminModal />;
    else if (modal == "process-deposit-admin")
      return <ProcessDepositAdminModal />;
    else if (modal == "process-withdraw") return <ProcessWithdrawModal />;
    else if (modal == "process-fund-sale") return <FundSaleModal />;
    else if (modal == "get-help") return <GetHelpModal />;
    else if (modal == "browser-not-supported")
      return <BrowserNotSupportedModal />;
    else if (modal == "cancel-new-application") return null;
    return null;
  }

  render() {
    const {
      showCanvas,
      showAlert,
      showAlertMessage,
      showAlertType,
      showAlertHorizontal,
      activeModal,
    } = this.props;

    return (
      <Fragment>
        {showCanvas ? <GlobalCanvasComponent /> : null}

        {activeModal ? (
          <div className="custom-modals">{this.renderModal(activeModal)}</div>
        ) : null}

        <PopupAlertComponent
          onClose={this.hideAlert}
          shown={showAlert}
          message={showAlertMessage}
          type={showAlertType}
          horizontal={showAlertHorizontal}
        />
      </Fragment>
    );
  }
}

export default connect(mapStateToProps)(Global);
