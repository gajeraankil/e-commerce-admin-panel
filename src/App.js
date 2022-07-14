import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Layout from "./Components/Layout";
import Product from "./Containers/Product";
import Order from "./Containers/Order";

const App = () => {
  return (
    <>
      <Layout>
        <Switch>
          <Route exact path="/product" component={Product} />
          <Route exact path="/order" component={Order} />
          <Redirect to="/product" />
        </Switch>
      </Layout>
    </>
  );
};

export default App;
