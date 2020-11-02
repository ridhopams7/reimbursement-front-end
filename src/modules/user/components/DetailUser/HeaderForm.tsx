import React, { Component } from 'react';
import {
  Row, Col,
  Label,
  Input,
  Container,
} from 'reactstrap';
import { connect } from 'react-redux';
// import { RequiredMark } from '../../../../components';

class HeaderForm extends Component<any, any> {
  render() {
    const {
      userData,
      userId,
    } = this.props;

    return (
      <Container className="container-header">
        <Row className="row-header center">
          <Col md="2" lg="2" className="align-self-center">
            <Label className="font-size-13">User Name</Label>
          </Col>
          <Col md="4" lg="4" className="align-self-center">
            <Input
              type="text"
              id="userName"
              name="userName"
              value={userData && userData.userName}
              onChange={e => this.props.handleChangeInputField(e)}
              placeholder="Enter User Name..."
              autoComplete="current-userName" />

          </Col>
        </Row>
        <Row className="row-header center">
          <Col md="2" lg="2" className="align-self-center">
            <Label className="font-size-13">Full Name</Label>
          </Col>
          <Col md="4" lg="4" className="align-self-center">
            <Input
              type="text"
              id="fullName"
              name="fullName"
              value={userData && userData.fullName}
              onChange={e => this.props.handleChangeInputField(e)}
              placeholder="Enter Role Id..."
              autoComplete="current-fullName" />

          </Col>
        </Row>
        <Row className="row-header center">
          <Col md="2" lg="2" className="align-self-center">
            <Label className="font-size-13">Email</Label>
          </Col>
          <Col md="4" lg="4" className="align-self-center">
            <Input
              type="email"
              id="email"
              name="email"

              value={userData && userData.email}
              onChange={e => this.props.handleChangeInputField(e)}
              placeholder="Enter Email..."
              autoComplete="current-email" />

          </Col>
        </Row>

        {!userId &&
          <Row className="row-header center">
            <Col md="2" lg="2" className="align-self-center">
              <Label className="font-size-13">Password</Label>
            </Col>
            <Col md="4" lg="4" className="align-self-center">
              <Input
                type="password"
                id="password"
                name="password"
                value={userData && userData.password}
                onChange={e => this.props.handleChangeInputField(e)}
                placeholder="Enter Password..."
                autoComplete="current-password" />

            </Col>
          </Row>
        }{
          !userId &&
          <Row className="row-header center">
            <Col md="2" lg="2" className="align-self-center">
              <Label className="font-size-13">Confirm Password</Label>
            </Col>
            <Col md="4" lg="4" className="align-self-center">
              <Input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={userData && userData.confirmPassword}
                onChange={e => this.props.handleChangeInputField(e)}
                placeholder="Enter Password..."
                autoComplete="current-confirmpassword" />

            </Col>
          </Row>
        }


      </Container>
    );
  }
}

const mapStateToProps = (state: any) => ({
  resAuth: state.auth.res,
});

export default connect(mapStateToProps, null)(HeaderForm);
