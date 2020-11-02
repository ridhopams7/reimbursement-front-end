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
      menuData,
      menuDataId,
    } = this.props;

    return (
      <Container className="container-header">
        <Row className="row-header center">
          <Col md="2" lg="2" className="align-self-center">
            <Label className="font-size-13">Menu Id</Label>
          </Col>
          <Col md="4" lg="4" className="align-self-center">
            <Input
              type="text"
              id="menuId"
              name="menuId"
              disabled={menuDataId ? true : false}
              value={menuData && menuData.menuId}
              onChange={e => this.props.handleChangeInputField(e)}
              placeholder="Enter Menu Id..."
              autoComplete="current-menuId" />

          </Col>
        </Row>


        <Row className="row-header center">
          <Col md="2" lg="2" className="align-self-center">
            <Label className="font-size-13">Menu Name</Label>
          </Col>
          <Col md="4" lg="4" className="align-self-center">
            <Input
              type="text"
              id="menuDesc"
              name="menuDesc"
              value={menuData && menuData.menuDesc}
              onChange={e => this.props.handleChangeInputField(e)}
              placeholder="Enter Menu Name..."
              autoComplete="current-menuDesc" />

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
