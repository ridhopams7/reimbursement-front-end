import React, { Component } from 'react';
import {
    PaginationItem, PaginationLink, Row, Col, Pagination,
} from 'reactstrap';


class Paginations extends Component<any, any> {
    render() {
        const { request } = this.props;
        const isfirst = request && request.page === 1;
        const islast = request &&  request.page === request.totalPages;
        if ((request && !request.pages) || (request && request.totalElements === 0)) {
            return null;
        }
        return (
            <Row style={{ marginTop: 5 }}>
                <Col xs="4">
                    {request &&
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
                                    <PaginationItem key={index} active={request.page === page ? true : false}>
                                        <PaginationLink onClick={() => this.props.onChangePage(index)} tag="button">{page}</PaginationLink>
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
            </Row>
        );
    }
}

export default Paginations;
