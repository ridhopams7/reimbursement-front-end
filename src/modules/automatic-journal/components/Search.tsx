import React, { Component } from 'react';
import { Button, Col, Row, Form, FormGroup, Label, Input, InputGroup, Collapse, CardBody } from 'reactstrap';
import "react-datepicker/dist/react-datepicker.css";
import { connect } from 'react-redux';

import { ajRoles } from '../../../config';

class Search extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      collapse: false,
    };
  }

  handleOpenCreate = () => {
    try {
      this.props.history.push('/automatic-journal/create');
    } catch (e) {
      console.log('error at handleOpenCreate with error: ', e);
    }
  }

  toggle = () => { this.setState({ collapse: !this.state.collapse }); }

  render() {
    const { filter, comboBoxList, disablecombobox, disableorganization } = this.props;

    return (
      <Row>
        <Col>
          <Row className="mar-bot-10">
            <Col>
              <Label className="search-title"><b><i className="fa fa-search"></i> Search Criteria</b></Label>
            </Col>
          </Row>

          <Row className="mar-bot-10">
            <Collapse isOpen={this.state.collapse} className="width-100-percent">
              <CardBody>
                <Col xs="12">
                  <Form onSubmit={e => this.props.onSearch(e)}>
                    <FormGroup className="mar-bot-5" row>
                      <Col md="2">
                        <Label sm="100" htmlFor="txtCode">Code</Label>
                      </Col>
                      <Col xs="12" md="3">
                        <Input
                          type="text"
                          id="txtCode"
                          name="txtCode"
                          value={filter && filter.txtCode}
                          onChange={this.props.onHandleChange}
                          placeholder="Enter code..."
                          autoComplete="current-code"
                        />
                      </Col>
                      <Col md="1" />
                      <Col md="2">
                        <Label sm="100" htmlFor="txtDescription">Description</Label>
                      </Col>
                      <Col xs="12" md="3">
                        <Input
                          type="text"
                          id="txtDescription"
                          name="txtDescription"
                          value={filter.txtDescription}
                          onChange={this.props.onHandleChange}
                          placeholder="Enter Description..."
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup className="mar-bot-5" row>
                      <Col md="2">
                        <Label sm="100" htmlFor="dtpAccDateFrom">Accounting Date</Label>
                      </Col>
                      <Col xs="12" md="4">
                        <InputGroup>
                          <Input
                            type="date"
                            id="dtpAccDateFrom"
                            name="dtpAccDateFrom"
                            value={filter && filter.dtpAccDateFrom}
                            onChange={this.props.onHandleChange}
                            placeholder="date"
                          />
                          <Label htmlFor="dtpAccDateTo" sm="100">&nbsp;&nbsp;To&nbsp;&nbsp;</Label>
                          <Input
                            type="date"
                            id="dtpAccDateTo"
                            name="dtpAccDateTo"
                            value={filter && filter.dtpAccDateTo}
                            onChange={this.props.onHandleChange}
                            placeholder="date"
                          />
                        </InputGroup>
                      </Col>
                      <Col md="2">
                        <Label sm="100" htmlFor="txtCreatedBy">Created By</Label>
                      </Col>
                      <Col xs="12" md="3">
                        <Input
                          type="text"
                          id="txtCreatedBy"
                          name="txtCreatedBy"
                          value={filter && filter.txtCreatedBy}
                          onChange={this.props.onHandleChange}
                          placeholder="Enter Create By..." autoComplete="current-createby"
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup className="mar-bot-5" row>
                      <Col md="2">
                        <Label sm="100" htmlFor="ddlPosting">Posting State </Label>
                      </Col>
                      <Col xs="12" md="2">
                        <Input type="select" name="ddlPosting" value={filter && filter.ddlPosting} onChange={this.props.onHandleChange} id="ddlPosting">
                          <option value="">Select State</option>
                          <option value="UP">UnPosted</option>
                          <option value="PS">Posted</option>
                        </Input>
                      </Col>
                      <Col md="2" />
                      <Col md="2">
                        <Label sm="100" htmlFor="dtpCreatedDateFrom">Created Date</Label>
                      </Col>
                      <Col xs="12" md="4">
                        <InputGroup >
                          <Input
                            type="date" id="dtpCreatedDateFrom"
                            name="dtpCreatedDateFrom"
                            value={filter && filter.dtpCreatedDateFrom}
                            onChange={this.props.onHandleChange}
                            placeholder="date"
                          />
                          <Label htmlFor="dtpCreatedDateTo" sm="100">&nbsp;&nbsp;To&nbsp;&nbsp;</Label>
                          <Input
                            type="date" id="dtpCreatedDateTo"
                            name="dtpCreatedDateTo"
                            value={filter && filter.dtpCreatedDateTo}
                            onChange={this.props.onHandleChange}
                            placeholder="date"
                          />
                        </InputGroup>
                      </Col>
                    </FormGroup>
                    <hr className="mar-bot-8 mar-top-8" />
                    <FormGroup className="mar-bot-5" row>
                      <Col md="2">
                        <Label sm="100" htmlFor="ddlOrganization">Organization </Label>
                      </Col>
                      <Col xs="12" md="3">
                        <Input
                          type="select"
                          name="ddlOrganization"
                          value={filter && filter.ddlOrganization}
                          onChange={this.props.onHandleChange}
                          disabled={disableorganization}
                          className={disableorganization ? "back-col-dis" : ""}
                          id="ddlOrganization"
                        >
                          {
                            comboBoxList.organizations.map((organization: any) =>
                              <option key={organization.id} value={organization.id}>
                                {organization.codeName}
                              </option>
                            )
                          }
                        </Input>
                      </Col>
                      <Col md="1" />
                      <Col md="2">
                        <Label sm="100" htmlFor="ddlCategory">Category</Label>
                      </Col>
                      <Col xs="12" md="4">
                        <InputGroup>
                          <Input
                            type="select"
                            className={disablecombobox ? "back-col-dis" : ""}
                            disabled={disablecombobox}
                            name="ddlCategory"
                            value={filter && filter.ddlCategory}
                            onChange={this.props.onHandleChange}
                            id="ddlCategory"
                          >
                            {
                              comboBoxList.transactioncategorys.map((transactioncategory: any) =>
                                <option key={transactioncategory.id} value={transactioncategory.id}>
                                  {transactioncategory.name}
                                </option>
                              )
                            }
                          </Input>
                          &nbsp;&nbsp;
                          <Input
                            type="select"
                            className={disablecombobox ? "back-col-dis" : ""}
                            disabled={disablecombobox}
                            name="ddlsubCategory"
                            value={filter && filter.ddlsubCategory}
                            onChange={this.props.onHandleChange}
                            id="ddlsubCategory"
                          >
                            {
                              comboBoxList.transactionsubcategorys.map((transactionsubcategory: any) =>
                                <option key={transactionsubcategory.id} value={transactionsubcategory.id}>
                                  {transactionsubcategory.name}
                                </option>
                              )
                            }
                          </Input>
                        </InputGroup>
                      </Col>
                    </FormGroup>
                    <FormGroup className="mar-bot-5" row>
                      <Col md="2">
                        <Label sm="100" htmlFor="ddlProduct">Product</Label>
                      </Col>
                      <Col xs="12" md="3">
                        <Input
                          type="select"
                          className={disablecombobox ? "back-col-dis" : ""}
                          name="ddlProduct"
                          disabled={disablecombobox}
                          value={filter && filter.ddlProduct}
                          onChange={this.props.onHandleChange}
                          id="ddlProduct"
                        >
                          {
                            comboBoxList.products.map((product: any) =>
                              <option key={product.id} value={product.id}>
                                {product.codeName}
                              </option>
                            )
                          }
                        </Input>
                      </Col>
                      <Col md="1" />
                      <Col md="2">
                        <Label sm="100" htmlFor="ddlCostCenter">Cost Center</Label>
                      </Col>
                      <Col xs="12" md="3">
                        <Input
                          type="select"
                          className={disablecombobox ? "back-col-dis" : ""}
                          name="ddlCostCenter"
                          disabled={disablecombobox}
                          value={filter && filter.ddlCostCenter}
                          onChange={this.props.onHandleChange}
                          id="ddlCostCenter"
                        >
                          {
                            comboBoxList.costcenters.map((costcenter: any) =>
                              <option key={costcenter.id} value={costcenter.id}>
                                {costcenter.codeName}
                              </option>
                            )
                          }
                        </Input>
                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="2">
                        <Label sm="100" htmlFor="ddlProject">Project</Label>
                      </Col>
                      <Col xs="12" md="3">
                        <Input
                          type="select"
                          className={disablecombobox ? "back-col-dis" : ""}
                          name="ddlProject" disabled={disablecombobox}
                          value={filter && filter.ddlProject}
                          onChange={this.props.onHandleChange}
                          id="ddlProject"
                        >
                          {
                            comboBoxList.projects.map((project: any) =>
                              <option key={project.id} value={project.id}>
                                {project.codeName}
                              </option>
                            )
                          }
                        </Input>
                      </Col>
                      <Col md="1" />
                      <Col md="2">
                        <Label sm="100" htmlFor="ddlCustomer">Customer</Label>
                      </Col>
                      <Col xs="12" md="3">
                        <Input
                          type="select"
                          className={disablecombobox ? "back-col-dis" : ""}
                          name="ddlCustomer" disabled={disablecombobox}
                          value={filter && filter.ddlCustomer}
                          onChange={this.props.onHandleChange}
                          id="ddlCustomer"
                        >
                          {
                            comboBoxList.customers.map((customer: any) =>
                              <option key={customer.id} value={customer.id}>
                                {customer.codeName}
                              </option>
                            )
                          }
                        </Input>
                      </Col>
                    </FormGroup>
                  </Form>
                </Col>
                <Col xs="12">
                  <Button
                    type="submit"
                    onClick={e => this.props.onSearch(e)}
                    color="primary"
                  >
                    <i className="fa fa-search"></i> Search
                  </Button>&nbsp;&nbsp;
                  <Button
                    type="submit"
                    onClick={this.props.onClear}
                    color="danger"
                  >
                    <i className="fa fa-refresh"></i> Clear
                  </Button>&nbsp;&nbsp;
                </Col>
              </CardBody>
            </Collapse>
            <Col xs="12">
              <Button
                onClick={() => this.toggle()}
                type="submit"
                color="primary"
              >
                Filter&nbsp;&nbsp;
                {this.state.collapse ? <i className="fa fa-sort-asc"></i> : <i className="fa fa-sort-desc"></i>}
              </Button> &nbsp;&nbsp;
              {
                this.props.resAuth && this.props.resAuth.roles.find((obj: any) => obj.role === ajRoles.AJ_Entry) && (
                  <Button
                    type="submit"
                    onClick={() => this.handleOpenCreate()}
                    color="info"
                  >
                    <i className="fa fa-plus"></i> Create New Transaction
                  </Button>
                )
              }
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = (state: any) => ({
  resAuth: state.auth.res,
});

export default connect(mapStateToProps)(Search);


