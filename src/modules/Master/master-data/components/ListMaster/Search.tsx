import React, { Component } from 'react';
import { Button, Col, Row, Form, FormGroup, Label, Input, Collapse, CardBody } from 'reactstrap';
import "react-datepicker/dist/react-datepicker.css";
import { connect } from 'react-redux';
import { const_masterData } from '../../../../../config';

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
      console.log(this.props);
      this.props.history.push('/master/master-data/create');
    } catch (e) {
      console.log('error at handleOpenCreate with error: ', e);
    }
  }
  render() {
    const { filter, combobox } = this.props;

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
                        <Label sm="100" htmlFor="txtSearch">Search</Label>
                      </Col>
                      <Col xs="12" md="3">
                        <Input
                          type="text"
                          id="txtSearch"
                          name="txtSearch"
                          value={filter && filter.txtSearch}
                          onChange={this.props.onHandleChange}
                          placeholder="Enter..."
                          autoComplete="current-txtSearch" />
                      </Col>

                      <Col md="1">
                      </Col>
                      <Col md="2">
                        <Label sm="100" htmlFor="masterId">Type</Label>
                      </Col>
                      <Col xs="12" md="3">
                        <Input
                          type="select"
                          name="masterId"
                          id="masterId"
                          value={filter.masterId}
                          onChange={this.props.onHandleChange}
                        >
                          {
                            combobox && combobox.MasterTypes.map((item: any, index: number) => {
                              const { id, name } = item;
                              return (
                                <option value={id} key={index}>{name}</option>
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
                this.props.resAuth && this.props.resAuth.menus.find((obj: any) => obj.menu === const_masterData.Master_Data_Entry) &&
                <Button type="submit" onClick={() => this.handleOpenCreate()} color="info"><i className="fa fa-plus"></i> Create</Button>
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
