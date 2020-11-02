import React, { Component } from 'react';
import {
  PaginationItem, PaginationLink, InputGroup, InputGroupText, Input,
  Label, Row, Col, Pagination, FormGroup, InputGroupAddon, Form
} from 'reactstrap';


class Paginations extends Component<any, any> {

  render() {

    const { itemspage, request } = this.props;

    const isfirst = request.currentPage === 1;
    const islast = request.currentPage === request.totalPages;
    if (!request.pages || (itemspage && itemspage.totalElements === 0)) {

      return null;
    }

    return (

      <Row style={{ marginTop: 5 }}>
        <Col xs="4">
          {itemspage &&
            <nav>

              <Pagination>
                <PaginationItem disabled={isfirst}>
                  <PaginationLink onClick={() => this.props.onChangePage(1)} first tag="button">
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem disabled={isfirst}>
                  <PaginationLink onClick={() => this.props.onChangePage(request.currentPage - 1)} previous tag="button">
                  </PaginationLink>
                </PaginationItem>
                {request.pages.map((page: number, index: number) =>
                  <PaginationItem key={index} active={request.currentPage === page ? true : false}>
                    <PaginationLink onClick={() => this.props.onChangePage(page)} tag="button">{page}</PaginationLink>
                  </PaginationItem>
                )}
                <PaginationItem disabled={islast}>
                  <PaginationLink onClick={() => this.props.onChangePage(request.currentPage + 1)} next tag="button">
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem disabled={islast}>
                  <PaginationLink onClick={() => this.props.onChangePage(request.totalPages)} last tag="button">
                  </PaginationLink>
                </PaginationItem>

              </Pagination>
            </nav>
          }
        </Col>
        <Col xs="5">

        </Col>
        <Col xs="3">
          {itemspage &&
            <Form onSubmit={e => this.props.onChangePageSizeGo(e)}>

              <FormGroup className="float-right" style={{ minWidth: 200 }}>
                <InputGroup>
                  <Label sm="100" className="float-right">{itemspage.first}-{itemspage.last} of {itemspage.totalElements}</Label> &nbsp;&nbsp;
              <InputGroupAddon addonType="prepend">
                    <InputGroupText>Size</InputGroupText>
                  </InputGroupAddon>
                  <Input type="number" id="pageSize" min="1" max="100" onChange={this.props.onChangePageSize } value={request && request.pageSize} name="pageSize" />
                  <InputGroupAddon addonType="append">
                    <InputGroupText style={{ cursor: "pointer" }} onClick={e => this.props.onChangePageSizeGo(e)} ><strong>Go</strong></InputGroupText>
                  </InputGroupAddon>

                </InputGroup>
              </FormGroup>
            </Form>
          }
        </Col>
      </Row>
    );
  }
}
export default Paginations;
