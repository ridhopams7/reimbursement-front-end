import React, { Component } from 'react';
import {
  Row, Col,
  Label,
  Input,
  Container,
} from 'reactstrap';
import { connect } from 'react-redux';

class HeaderForm extends Component<any, any> {
  render() {
    const {
      roleData,
      roleDataId,
    } = this.props;

    return (
      <Container className="container-header">
        <Row className="row-header center">
          <Col md="2" lg="2" className="align-self-center">
            <Label className="font-size-13">Role Id</Label>
          </Col>
          <Col md="4" lg="4" className="align-self-center">
            <Input
              type="text"
              id="roleId"
              name="roleId"
              disabled={roleDataId ? true : false}
              value={roleData && roleData.roleId}
              onChange={e => this.props.handleChangeInputField(e)}
              placeholder="Enter Role Id..."
              autoComplete="current-roleId" />

          </Col>
        </Row>


        <Row className="row-header center">
          <Col md="2" lg="2" className="align-self-center">
            <Label className="font-size-13">Role Name</Label>
          </Col>
          <Col md="4" lg="4" className="align-self-center">
            <Input
              type="text"
              id="roleDesc"
              name="roleDesc"
              value={roleData && roleData.roleDesc}
              onChange={e => this.props.handleChangeInputField(e)}
              placeholder="Enter Role Name..."
              autoComplete="current-roleDesc" />

          </Col>
        </Row>


      </Container>
    );
  }
}

const mapStateToProps = (state: any) => ({
  resAuth: state.auth.res,
});

export default connect(mapStateToProps, null)(HeaderForm);
