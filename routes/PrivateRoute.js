import React from "react";
import { Route, Redirect } from "react-router-dom";

export default function PrivateRoute({ children, auth, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth &&
        auth.id &&
        auth.profile &&
        auth.profile.twoFA_login &&
        auth.profile.twoFA_active ? (
          <Redirect to="/" />
        ) : auth && auth.id ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
