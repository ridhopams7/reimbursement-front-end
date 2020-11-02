import React, { Component } from 'react';
import {
  Row, Col,
  Label,
  Input,
  Container,
} from 'reactstrap';
import { connect } from 'react-redux';
// import { RequiredMark } from '../../../../../components';

class HeaderForm extends Component<any, any> {
  render() {
    const {
      masterType,
    } = this.props;

    return (
      <Container className="container-header">
        <Row className="row-header center">
          <Col md="2" lg="2" className="align-self-center">
            <Label className="font-size-13">Code</Label>
          </Col>
          <Col md="4" lg="4" className="align-self-center">
            <Input
              type="text"
              id="code"
              name="code"
              value={masterType && masterType.code}
              onChange={e => this.props.handleChangeInputField(e)}
              placeholder="Enter code..."
              autoComplete="current-code" />

          </Col>
        </Row>
       <Row className="row-header center">
          <Col md="2" lg="2" className="align-self-center">
            <Label className="font-size-13">Name</Label>
          </Col>
          <Col md="4" lg="4" className="align-self-center">
            <Input
              type="text"
              id="name"
              name="name"
              value={masterType && masterType.name}
              onChange={e => this.props.handleChangeInputField(e)}
              placeholder="Enter name..."
              autoComplete="current-name" />

          </Col>
        </Row>
        <Row className="row-header center">
          <Col md="2" lg="2" className="align-self-flex-start">
            <Label className="font-size-13">Description</Label>
          </Col>
          <Col md="4" lg="4" className="align-self-center">
            <Input
              type="textarea"
              name="description"
              id="description"
              rows="6"
              placeholder="Description"
              value={masterType && masterType.description}
              onChange={e => this.props.handleChangeInputField(e)}
              className="font-size-13"
              //disabled={isViewTransDetailMode}
              maxLength={300}
            />

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
