import React, { Component } from 'react';
import { Button, Col, Row, Form, FormGroup, Label, Input, InputGroup, Collapse, CardBody } from 'reactstrap';
import "react-datepicker/dist/react-datepicker.css";
import { journalCategoryList } from '../../config/Constants';
import { connect } from 'react-redux';
import { voucherRoles } from '../../../../config';

class Search extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      collapse: false,
    };
  }
  toggle() {
    this.setState({ collapse: !this.state.collapse });
  }
  handleOpenCreate = () => {
    try {
      // this.props.history.push({
      //   pathname: '/voucher/create',
      //   state: {
      //     headerId: "",
      //   }
      // })
      this.props.history.push('/voucher/create');
    } catch (e) {
      console.log('error at handleOpenCreate with error: ', e);
    }
  }
  render() {
    const { filter, comboBoxList, disablecombobox, disableorganization, accountingPeriod } = this.props;

    return (

      <Row>
        <Col>

          <Row className="mar-bot-10">
            <Col>
              <Label className="report-title"><b><i className="fa fa-search"></i> Search Criteria</b></Label>
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
                          autoComplete="current-code" />
                      </Col>

                      <Col md="1">
                      </Col>
                      <Col md="2">
                        <Label sm="100" htmlFor="txtJournalCategory">Journal Category</Label>
                      </Col>
                      <Col xs="12" md="3">
                        <Input
                          type="select"
                          name="txtJournalCategory"
                          id="txtJournalCategory"
                          value={filter.txtJournalCategory}
                          onChange={this.props.onHandleChange}
                        >
                          {
                            journalCategoryList.map((item: any, index: number) => {
                              const { id, name } = item;
                              const id_ = id ? `${id} - ` : '';
                              return (
                                <option value={id} key={index}>{id_} {name}</option>
                              );
                            })
                          }

                        </Input>
                      </Col>


                    </FormGroup>
                    <FormGroup className="mar-bot-5" row>
                      <Col md="2">
                        <Label sm="100" htmlFor="ddlAccPeriod">Accounting Period</Label>
                      </Col>
                      <Col xs="12" md="3">
                        <Input type="select" name="ddlAccPeriod" value={filter && filter.ddlAccPeriod} onChange={this.props.onHandleChange} id="ddlAccPeriod">
                          {comboBoxList.AccountingPeriods.map((period: any) =>
                            <option key={period.id} value={period.id}>
                              {period.name}</option>)}
                        </Input>
                      </Col>
                      <Col md="1"></Col>
                      <Col md="2">
                        <Label sm="100" htmlFor="txtDescription">Description</Label>
                      </Col>
                      <Col xs="12" md="3">
                        <Input type="text" id="txtDescription" name="txtDescription"
                          value={filter.txtDescription} onChange={this.props.onHandleChange}
                          placeholder="Enter Description..." />
                      </Col>

                    </FormGroup>
                    <FormGroup className="mar-bot-5" row>
                      <Col md="2">
                        <Label sm="100" htmlFor="dtpAccDateFrom">Accounting Date</Label>
                      </Col>
                      <Col xs="12" md="4">

                        <InputGroup >
                          <Input type="date" id="dtpAccDateFrom" name="dtpAccDateFrom"
                            value={filter && filter.dtpAccDateFrom}
                            min={accountingPeriod.startDate} // yyyy-mm-dd
                            max={accountingPeriod.endDate} // yyyy-mm-dd
                            onChange={this.props.onHandleChange} placeholder="date" />
                          <Label htmlFor="dtpAccDateTo" sm="100">&nbsp;&nbsp;To&nbsp;&nbsp;</Label>
                          <Input type="date" id="dtpAccDateTo" name="dtpAccDateTo"
                            value={filter && filter.dtpAccDateTo}
                            min={accountingPeriod.startDate} // yyyy-mm-dd
                            max={accountingPeriod.endDate} // yyyy-mm-dd
                            onChange={this.props.onHandleChange} placeholder="date" />

                        </InputGroup>
                      </Col>

                      <Col md="2">
                        <Label sm="100" htmlFor="txtCreatedBy">Created By</Label>
                      </Col>
                      <Col xs="12" md="3">
                        <Input type="text" id="txtCreatedBy" name="txtCreatedBy"
                          value={filter && filter.txtCreatedBy} onChange={this.props.onHandleChange}
                          placeholder="Enter Create By..." autoComplete="current-createby" />
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
                      <Col md="2">

                      </Col>
                      <Col xs="12" md="2">
                        <Label sm="100" htmlFor="dtpCreatedDateFrom">Created Date</Label>
                      </Col>
                      <Col md="4">
                        <InputGroup >
                          <Input type="date" id="dtpCreatedDateFrom"
                            name="dtpCreatedDateFrom" value={filter && filter.dtpCreatedDateFrom}
                            onChange={this.props.onHandleChange} placeholder="date" />

                          <Label htmlFor="dtpCreatedDateTo" sm="100">&nbsp;&nbsp;To&nbsp;&nbsp;</Label>
                          <Input type="date" id="dtpCreatedDateTo" name="dtpCreatedDateTo"
                            value={filter && filter.dtpCreatedDateTo}
                            onChange={this.props.onHandleChange} placeholder="date" />

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
                          id="ddlOrganization">
                          {
                            comboBoxList.organizations.map((item: any, index: number) => {
                              const { id, name, code } = item;
                              const code_ = code ? `${code} - ` : '';
                              return (
                                <option key={index} value={id}> {code_} {name}</option>
                              );
                            })
                          }

                        </Input>

                      </Col>

                      <Col md="7">
                      </Col>

                    </FormGroup>
                    <FormGroup className="mar-bot-5" row>
                      <Col md="2">
                        <Label sm="100" htmlFor="ddlProduct">Product</Label>
                      </Col>
                      <Col xs="12" md="3">
                        <Input type="select" 
                        className={disablecombobox ? "back-col-dis" : ""}
                        name="ddlProduct"
                          disabled={disablecombobox} value={filter && filter.ddlProduct} onChange={this.props.onHandleChange}
                          id="ddlProduct">
                          {
                            comboBoxList.products.map((item: any, index: number) => {
                              const { id, name, code } = item;
                              const code_ = code ? `${code} - ` : '';
                              return (
                                <option key={index} value={id}> {code_} {name}</option>
                              );
                            })
                          }
                        </Input>

                      </Col>
                      <Col md="1"></Col>
                      <Col md="2">
                        <Label sm="100" htmlFor="ddlCostCenter">Cost Center</Label>
                      </Col>
                      <Col xs="12" md="3">
                        <Input type="select"  className={disablecombobox ? "back-col-dis" : ""} name="ddlCostCenter" disabled={disablecombobox}
                          value={filter && filter.ddlCostCenter} onChange={this.props.onHandleChange} id="ddlCostCenter">
                          {
                            comboBoxList.costcenters.map((item: any, index: number) => {
                              const { id, name, code } = item;
                              const code_ = code ? `${code} - ` : '';
                              return (
                                <option key={index} value={id}> {code_} {name}</option>
                              );
                            })
                          }

                        </Input>

                      </Col>
                    </FormGroup>
                    <FormGroup row>
                      <Col md="2">
                        <Label sm="100" htmlFor="ddlProject">Project</Label>
                      </Col>

                      <Col xs="12" md="3">
                        <Input type="select"  className={disablecombobox ? "back-col-dis" : ""} name="ddlProject" disabled={disablecombobox} value={filter && filter.ddlProject} onChange={this.props.onHandleChange} id="ddlProject">
                          {
                            comboBoxList.projects.map((item: any, index: number) => {
                              const { id, name, code } = item;
                              const code_ = code ? `${code} - ` : '';
                              return (
                                <option key={index} value={id}> {code_} {name}</option>
                              );
                            })
                          }

                        </Input>
                      </Col>
                      <Col md="1">

                      </Col>
                      <Col md="2">
                        <Label sm="100" htmlFor="ddlCustomer">Customer</Label>
                      </Col>
                      <Col xs="12" md="3">
                        <Input type="select"  className={disablecombobox ? "back-col-dis" : ""} name="ddlCustomer" disabled={disablecombobox} value={filter && filter.ddlCustomer} onChange={this.props.onHandleChange} id="ddlCustomer">
                          {
                            comboBoxList.customers.map((item: any, index: number) => {
                              const { id, name, code } = item;
                              const code_ = code ? `${code} - ` : '';
                              return (
                                <option key={index} value={id}> {code_} {name}</option>
                              );
                            })
                          }

                        </Input>
                      </Col>
                    </FormGroup>
                  </Form>
                </Col>
                <Col xs="12">
                  <Button type="submit" onClick={e => this.props.onSearch(e)} color="primary"><i className="fa fa-search"></i> Search</Button>&nbsp;&nbsp;
                  <Button type="submit" onClick={this.props.onClear} color="danger"><i className="fa fa-refresh"></i> Clear</Button>&nbsp;&nbsp;
                </Col>
              </CardBody>
            </Collapse>

            <Col xs="12">
              <Button onClick={() => this.toggle()} type="submit" color="primary">Filter&nbsp;&nbsp;{this.state.collapse ? <i className="fa fa-sort-asc"></i> :
                <i className="fa fa-sort-desc"></i>}</Button> &nbsp;&nbsp;
              {
                this.props.resAuth && this.props.resAuth.roles.find((obj: any) => obj.role === voucherRoles.V_Entry) &&
                <Button type="submit" onClick={() => this.handleOpenCreate()} color="info"><i className="fa fa-plus"></i> Create New Transaction </Button>
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
