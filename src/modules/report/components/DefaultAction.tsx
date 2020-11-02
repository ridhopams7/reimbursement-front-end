import React, { Component, Fragment } from 'react';
import {
  Button, Col, Row,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';

export default class DefaultAction extends Component<any, any> {
  render() {
    return (
      <Fragment>
        <Row className="pad-top-3 pad-bot-3">
          <Col md="2" lg="2">
            <Button
              type="button"
              color="primary"
              className="report-button"
              onClick={this.props.handleGenerateReport}
            >
              <FontAwesomeIcon icon={faPrint} />
              &nbsp;
              Generate Report
            </Button>
          </Col>

          <Col md="2" lg="2">
            <Button
              type="button"
              color="danger"
              className="report-button"
              onClick={this.props.handleClearForm}
            >
              <i className="icon-close" /> &nbsp;
              Clear
            </Button>
          </Col>
        </Row>
      </Fragment>
    )
  }
}
