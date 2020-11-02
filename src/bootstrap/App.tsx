import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
// import { renderRoutes } from 'react-router-config';
import { Persistor, Store } from './ReduxStore';
import '../scss/App.scss';
import { Layout, RouterNonContainer } from '../config';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

class App extends Component {
  render() {
    return (
      <Provider store={Store}>
        <PersistGate
          loading={null}
          persistor={Persistor}
        >
          <HashRouter>
            <React.Suspense fallback={loading()}>
              <Switch>
                {
                  RouterNonContainer.map((route, idx) => (route.component ? (
                    <Route
                      key={idx} // eslint-disable-line
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      render={(props: any) => (
                        <route.component {...props} />
                      )}
                    />
                  ) : (null)))
                }
                <Route path="/" render={props => <Layout {...props} />} />
              </Switch>
            </React.Suspense>
          </HashRouter>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
