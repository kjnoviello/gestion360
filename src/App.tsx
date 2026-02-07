import React from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { LoginPage } from "./pages/login";
import { Dashboard } from "./pages/dashboard";
import { ClientForm } from "./pages/client-form";
import { ClientDetails } from "./pages/client-details";
import { WorkForm } from "./pages/work-form";
import { WorkDetails } from "./pages/work-details";
import { useAuth } from "./hooks/use-auth";
import { ClientsList } from "./pages/clients-list";

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Router>
      <Switch>
        <Route exact path="/login">
          {isAuthenticated ? <Redirect to="/dashboard" /> : <LoginPage />}
        </Route>
        <PrivateRoute path="/dashboard" isAuthenticated={isAuthenticated}>
          <Dashboard />
        </PrivateRoute>
        <PrivateRoute path="/clients" isAuthenticated={isAuthenticated}>
          <ClientsList />
        </PrivateRoute>
        <PrivateRoute path="/client/new" isAuthenticated={isAuthenticated}>
          <ClientForm />
        </PrivateRoute>
        <PrivateRoute path="/client/edit/:id" isAuthenticated={isAuthenticated}>
          <ClientForm />
        </PrivateRoute>
        <PrivateRoute path="/client/:id" isAuthenticated={isAuthenticated}>
          <ClientDetails />
        </PrivateRoute>
        <PrivateRoute path="/work/new" isAuthenticated={isAuthenticated}>
          <WorkForm />
        </PrivateRoute>
        <PrivateRoute path="/work/new/:clientId" isAuthenticated={isAuthenticated}>
          <WorkForm />
        </PrivateRoute>
        <PrivateRoute path="/work/edit/:id" isAuthenticated={isAuthenticated}>
          <WorkForm />
        </PrivateRoute>
        <PrivateRoute path="/work/:id" isAuthenticated={isAuthenticated}>
          <WorkDetails />
        </PrivateRoute>
        <Route path="*">
          <Redirect to={isAuthenticated ? "/dashboard" : "/login"} />
        </Route>
      </Switch>
    </Router>
  );
};

interface PrivateRouteProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, isAuthenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
};

export default App;