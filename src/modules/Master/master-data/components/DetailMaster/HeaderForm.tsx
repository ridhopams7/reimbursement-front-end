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
      masterData,
      combobox
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
              value={masterData && masterData.code}
              onChange={e => this.props.handleChangeInputField(e)}
              placeholder="Enter code..."
              autoComplete="current-code" />

          </Col>
        </Row>
        <Row className="row-header center">
          <Col md="2" lg="2" className="align-self-center">
            <Label className="font-size-13">Master Type</Label>
          </Col>
          <Col md="4" lg="4" className="align-self-center">
            <Input
              type="select"
              name="masterId"
              className="font-size-13"
              onChange={e => this.props.handleChangeInputField(e)}
              value={masterData && masterData.masterId}
              // disabled={isViewTransDetailMode}
            >
              {
                combobox && combobox.MasterTypes.map((item: any, index: number) => {
                  const { id, codeName } = item;
                  return (
                    <option value={id} className="font-size-13" key={index}>{codeName}</option>
                  );
                })
              }
            </Input>

          </Col>
        </Row>
       
        <Row className="row-header center">
          <Col md="2" lg="2" className="align-self-center">
            <Label className="font-size-13">Name</Label>
          </Col>
          <Col md="4" lg="4" className="align-self-center">
            <Input
              type="text"
              id="value"
              name="value"
              value={masterData && masterData.value}
              onChange={e => this.props.handleChangeInputField(e)}
              placeholder="Enter value..."
              autoComplete="current-value" />

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
              value={masterData && masterData.description}
              onChange={e => this.props.handleChangeInputField(e)}
              className="font-size-13"
              //disabled={isViewTransDetailMode}
              maxLength={300}
            />

          </Col>
        </Row>
        <Row className="row-header center">
          <Col md="2" lg="2" className="align-self-center">
            <Label className="font-size-13">Parent</Label>
          </Col>
          <Col md="4" lg="4" className="align-self-center">
            <Input
              type="select"
              name="parentId"
              className="font-size-13"
              onChange={e => this.props.handleChangeInputField(e)}
              value={masterData && masterData.parentId}
            >
              {
                combobox && combobox.MasterDetails.map((item: any, index: number) => {
                  const { id, codeName } = item;
                  return (
                    <option value={id} className="font-size-13" key={index}>{codeName}</option>
                  );
                })
              }
            </Input>

          </Col>
        </Row>
       
        <Row className="row-header center">
          <Col md="2" lg="2" className="align-self-flex-start">
            <Label className="font-size-13">Sort</Label>
          </Col>
          <Col md="4" lg="4" className="align-self-center">
            <Input
              type="number"
              name="sort"
              id="sort"
              placeholder="sort"
              value={masterData && masterData.sort}
              onChange={e => this.props.handleChangeInputField(e)}
              className="font-size-13"
              //disabled={isViewTransDetailMode}
              maxLength={10}
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
