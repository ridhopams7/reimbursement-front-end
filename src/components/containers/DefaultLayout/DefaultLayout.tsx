import React, { Component, Suspense } from 'react';
import * as RouterDom from 'react-router-dom';
import { connect } from 'react-redux';
import { Container } from 'reactstrap';
import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from './_nav';
import navigationExample from '../../../modules/example/_nav';
// routes config
import { RouterContainer } from '../../../config';
import { userLogout } from '../../../modules/auth/redux/ActionAuth';

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      resAuth: props.resAuth,
      appUpdateAvailable: false,
      appGetOffline: false,
      sideNav: JSON.parse(JSON.stringify(navigation)),
    };
  }
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  signOut(e: any) {
    e.preventDefault();
    this.props.onLogout();
    this.props.history.push('/login');
  }

  componentWillMount() {
    if (!this.state.resAuth) {
      this.props.history.push('/login');
    }
  }

  componentDidMount() {
    try {
      const { resAuth } = this.state;
      const sideNav: any = JSON.parse(JSON.stringify(navigation));

      const listMenu: any = [...resAuth.menus];

      const isAccessFound = (access: string) => listMenu.find((obj: any) => obj.menu === access);

      for (const index in sideNav.items) {
        if (!Object.keys(sideNav.items[index]).includes('accessCode')) {
          continue;
        }

        const children = sideNav.items[index].children;
        let access = sideNav.items[index].accessCode;

        if (!children) {
          if (!isAccessFound(access)) {
            sideNav.items[index].attributes = { hidden: true };
          }
          continue;
        }

        if (children) {
          if (!isAccessFound(access)) {
            sideNav.items[index].attributes = { hidden: true };

            for (let i = 0; i < children.length; i += 1) {
              children[i].attributes = { hidden: true };
            }
            continue;
          }

          for (let i = 0; i < children.length; i += 1) {
            access = children[i].accessCode;
            if (!isAccessFound(access)) {
              children[i].attributes = { hidden: true };
            }
          }
        }
      }

      this.setState({ sideNav });
    } catch (e) {
      console.log(`error did mount default layout with error: ${e}`);
    }
  }

  render() {
    window.addEventListener("appUpdateAvailable", () => {
      this.setState({
        appUpdateAvailable: true
      });
    });
    window.addEventListener("appGetOffline", () => {
      this.setState({
        appGetOffline: true
      });
    });
    const { appUpdateAvailable, appGetOffline, sideNav } = this.state;

    let navData = null;
    const checkRoute = this.props.location.pathname.match(/\/example/gm);
    if (checkRoute !== null) {
      navData = navigationExample;
    } else {
      navData = sideNav;
    }

    const { resAuth } = this.state;

    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense fallback={this.loading()}>
            <DefaultHeader onLogout={(e: any) => this.signOut(e)} userName={(resAuth) ? resAuth.userName : ''} />
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense fallback={this.loading()}>
              <AppSidebarNav navConfig={navData} {...this.props} router={RouterDom} />
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            {
              appUpdateAvailable &&
              <div className="d-block p-3 bg-success text-center text-white font-weight-bold">
                New content is available, please close this tab, and re-open.
                </div>
            }
            {
              appGetOffline &&
              <div className="d-block p-3 bg-warning text-center text-white font-weight-bold">
                No internet connection found. App is running in offline mode.
                </div>
            }
            <AppBreadcrumb appRoutes={RouterContainer} router={RouterDom} />
            <Container fluid>
              <Suspense fallback={this.loading()}>
                <RouterDom.Switch>
                  {RouterContainer.map((route, idx) => (route.component ? (
                    <RouterDom.Route
                      key={idx} // eslint-disable-line
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      render={(props: any) => (
                        <route.component {...props} />
                      )}
                    />
                  ) : (null)))}
                  <RouterDom.Redirect from="/" to="/login" />
                  {/* should redirect to 404 from **.  */}
                </RouterDom.Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside>
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  resAuth: state.auth.res,
});

const mapDispatchToProps = (dispatch: any) => ({
  onLogout: () => dispatch(userLogout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DefaultLayout);
