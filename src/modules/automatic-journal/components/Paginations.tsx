import React, { Component } from 'react';
import {
  PaginationItem, PaginationLink, InputGroup, InputGroupText, Input,
  Label, Row, Col, Pagination, FormGroup, InputGroupAddon, Form
} from 'reactstrap';


class Paginations extends Component<any, any> {
  handlePageSizeChange = (event: any) => {
    const { pager } = this.props;
    const copyPager = { ...pager };
    const { name, value } = event.target;

    copyPager[name] = value;
    if (value > 100) copyPager[name] = 100;

    this.props.onChangePageSize(copyPager);
  }

  render() {

    const { journals, pager } = this.props;

    const isfirst = pager.currentPage === 1;
    const islast = pager.currentPage === pager.totalPages;
    if (!pager.pages || (journals && journals.totalElements === 0)) return null;

    return (
      <Row className="mar-top-5">
        <Col xs="4">
          {journals &&
            <nav>
              <Pagination>
                <PaginationItem disabled={isfirst}>
                  <PaginationLink onClick={() => this.props.onChangePage(1)} first tag="button">
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem disabled={isfirst}>
                  <PaginationLink onClick={() => this.props.onChangePage(pager.currentPage - 1)} previous tag="button">
                  </PaginationLink>
                </PaginationItem>
                {pager.pages.map((page: number, index: number) =>
                  <PaginationItem key={index} active={pager.currentPage === page ? true : false}>
                    <PaginationLink onClick={() => this.props.onChangePage(page)} tag="button">{page}</PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem disabled={islast}>
                  <PaginationLink onClick={() => this.props.onChangePage(pager.currentPage + 1)} next tag="button">
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem disabled={islast}>
                  <PaginationLink onClick={() => this.props.onChangePage(pager.totalPages)} last tag="button">
                  </PaginationLink>
                </PaginationItem>

              </Pagination>
            </nav>
          }
        </Col>
        <Col xs="5">

        </Col>
        <Col xs="3">
          {journals &&
            <Form onSubmit={e => this.props.onChangePageSizeGo(e)}>
              <FormGroup className="float-right min-width-200">
                <InputGroup>
                  <Label sm="100" className="float-right">{journals.first}-{journals.last} of {journals.totalElements}</Label> &nbsp;&nbsp;
              <InputGroupAddon addonType="prepend">
                    <InputGroupText>Size</InputGroupText>
                  </InputGroupAddon>
                  <Input type="number" id="pageSize" min="1" max="100" onChange={(e) => this.handlePageSizeChange(e)} value={pager && pager.pageSize} name="pageSize" />
                  <InputGroupAddon addonType="append">
                    <InputGroupText className="cursor-pointer" onClick={e => this.props.onChangePageSizeGo(e)} ><strong>Go</strong></InputGroupText>
                  </InputGroupAddon>

                </InputGroup>
              </FormGroup>
            </Form>
          }
          {/* <Label sm="100" className="float-right">{itemspage.first}-{itemspage.last} of {itemspage.totalElements}</Label> */}

        </Col>
      </Row>
    );
  }
}
export default Paginations;