import React, { Suspense, lazy } from "react";
import { Switch, Route } from "react-router-dom";

const MainView = lazy(() => import("../views/app/main/Main"));
const UsersView = lazy(() => import("../views/app/users/Users"));
// const EditUserView = lazy(() => import("../views/app/users/edit/EditUser"));
const NewUserView = lazy(() => import("../views/app/users/new/NewUser"));
const SingleUserView = lazy(() =>
  import("../views/app/users/single/SingleUser")
);
const ProfileView = lazy(() => import("../views/app/profile/Profile"));
const SettingsView = lazy(() => import("../views/app/settings/Settings"));
const ErrorView = lazy(() => import("../views/app/Error"));

export default function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Switch>
        <Route path="/app" exact component={MainView} />
        <Route path="/app/user/new" exact component={NewUserView} />
        <Route path="/app/users" exact component={UsersView} />
        <Route path="/app/user/:userId" exact component={SingleUserView} />
        <Route path="/app/profile" exact component={ProfileView} />
        <Route path="/app/settings" exact component={SettingsView} />
        <Route component={ErrorView}></Route>
      </Switch>
    </Suspense>
  );
}
