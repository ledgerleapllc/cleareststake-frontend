import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";
import PublicRoute from "./PublicRoute";

const WelcomeView = lazy(() => import("../views/welcome/Welcome"));
const LoginView = lazy(() => import("../views/account/login/Login"));
const RegisterView = lazy(() => import("../views/account/register/Register"));
const InvitationView = lazy(() =>
  import("../views/account/invitation/Invitation")
);
const ForgotPasswordView = lazy(() =>
  import("../views/account/forgot-password/ForgotPassword")
);
const ResetPasswordView = lazy(() =>
  import("../views/account/reset-password/ResetPassword")
);
const MFASuccessView = lazy(() => import("../views/mfa/MFA"));

export default function LandingRoutes({ auth }) {
  return (
    <Suspense fallback={null}>
      <Switch>
        <Route exact path="/">
          <WelcomeView auth={auth} />
        </Route>
        <PublicRoute auth={auth} exact path="/login">
          <LoginView />
        </PublicRoute>
        <PublicRoute auth={auth} exact path="/register">
          <RegisterView />
        </PublicRoute>
        <PublicRoute auth={auth} exact path="/forgot-password">
          <ForgotPasswordView />
        </PublicRoute>
        <PublicRoute auth={auth} exact path="/password/reset/:token">
          <ResetPasswordView />
        </PublicRoute>
        <PublicRoute auth={auth} exact path="/invitation/:code">
          <InvitationView />
        </PublicRoute>
        <Route exact path="/mfa" component={MFASuccessView} />
        <Route>
          <h2 className="text-center mt-4 mb-3">Not Found</h2>
        </Route>
      </Switch>
    </Suspense>
  );
}
