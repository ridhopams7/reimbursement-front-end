import React from 'react';
import { Row, Col, Label, } from "reactstrap";

export default function ReportTitle(props: any) {
  return (
    <Row>
      <Col md={12} lg={12} xs={12} sm={12}>
        <Label className="report-title">{props.title}</Label>
      </Col>
    </Row>
  )
}
