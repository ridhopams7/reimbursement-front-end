import React, { Component } from 'react';
import {
  Button, Card, CardBody, CardGroup,
  Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row,
} from 'reactstrap';
import { connect } from 'react-redux';
import SweetAlert from 'react-bootstrap-sweetalert';
import { userLoginFetch } from '../redux';
import {
  USERLOGINSUCCESS, USERLOGINFAILED,
} from '../config/ConstantsAuth';
import { handleRedirectUser } from '../../../utilities'
import {
  accountFetch,
  accPeriodAllFetch,
  accPeriodByStateFetch,
  accPeriodDateByStateFetch,
  currencyFetch,
  organizationAllFetch,
  costCenterAllFetch,
  customerAllFetch,
  productAllFetch,
  projectAllFetch,
} from '../../../modules/foundation/redux';

import logo from '../../../assets/img/brand/ecom.png';
// import logo from '../../../assets/img/brand/amoeba-logo-white.svg';

class Login extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      action: props.action,
      err: props.err,
      res: props.res,
      username: '',
      password: '',
      modalError: false,
    };

    this.toggleError = this.toggleError.bind(this);
  }

  static getDerivedStateFromProps(nextProps: any, prevState: any) {
    if (nextProps.action !== prevState.action) {
      let nextErr = prevState.err;
      if (nextProps.action === USERLOGINFAILED) nextErr = nextProps.err;

      let nextRes = prevState.res;
      if (nextProps.action === USERLOGINSUCCESS) nextRes = nextProps.res;


      return {
        action: nextProps.action,
        err: nextErr,
        res: nextRes,
      };
    }

    return null;
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevState.action !== this.state.action) {
      if (this.state.action === USERLOGINFAILED) {
        // console.log(this.state.err);
        this.toggleError();
      }
      if (this.state.action === USERLOGINSUCCESS) {
        console.log(this.state.res);
        this.props.history.push('/');
      }

    }
  }

  componentDidMount() {
    if (this.state.res) {
      const data = handleRedirectUser(this.state.res);

      const { url } = data;
      this.props.history.push(url);;
    }
  }

  handleSignIn = (e: any) => {
    const {
      password, username,
    } = this.state;

    e.preventDefault();

    const data = {
      username,
      password,
    };

    this.props.onLogin(data);
  }

  toggleError() {
    this.setState({
      modalError: !this.state.modalError,
    });
  }

  render() {
    const {
      username, password, err, modalError,
    } = this.state;

    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this.handleSignIn}>
                      <h1>Login</h1>
                      <p className="text-muted">Signs In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          placeholder="Username"
                          autoComplete="username"
                          value={username}
                          onChange={e => this.setState({ username: e.currentTarget.value })}
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          value={password}
                          onChange={e => this.setState({ password: e.currentTarget.value })}
                        />
                      </InputGroup>
                      <Row>
                        <Col xs="6">
                          <Button
                            color="info"
                            className="px-4"
                            onSubmit={this.handleSignIn}
                          >
                            Login
                          </Button>
                        </Col>
                        <Col xs="6" className="text-right">
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card className="text-white py-5 d-md-down-none container-logo">
                  <CardBody className="text-center col d-flex align-items-center justify-content-center">
                    <img className="img-fluid align-middle" src={logo} alt="Logo" />
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>

        <SweetAlert
          danger
          confirmBtnText="Dismiss"
          confirmBtnBsStyle="warning"
          title="Error"
          onConfirm={this.toggleError}
          show={modalError}
        >
          {err}
        </SweetAlert>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  fetch: state.auth.fetch,
  res: state.auth.res,
  err: state.auth.err,
  action: state.auth.action,
});

const mapDispatchToProps = (dispatch: any) => ({
  onLogin: (value: object) => dispatch(userLoginFetch(value)),
  getAccount: (value: object) => dispatch(accountFetch(value)),
  getAccPeriodAll: (value: object) => dispatch(accPeriodAllFetch(value)),
  getAccPeriodByState: (value: object) => dispatch(accPeriodByStateFetch(value)),
  getAccPeriodDateByState: (value: object) => dispatch(accPeriodDateByStateFetch(value)),
  getCurrency: (value: object) => dispatch(currencyFetch(value)),
  getOrganizationAll: (value: object) => dispatch(organizationAllFetch(value)),
  getCostCenterAll: (value: object) => dispatch(costCenterAllFetch(value)),
  getCustomerAll: (value: object) => dispatch(customerAllFetch(value)),
  getProductAll: (value: object) => dispatch(productAllFetch(value)),
  getProjectAll: (value: object) => dispatch(projectAllFetch(value)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
