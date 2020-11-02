import React, { Component, Fragment } from 'react';
import { Button, Col, Row } from 'reactstrap';
import PDFViewer from 'mgr-pdf-viewer-react';
import download from 'downloadjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

export default class PdfViewer extends Component<any, any> {
  render() {
    const { pdf, pdfSrc } = this.props;
    return (
      <Fragment>
        <Row style={{ paddingTop: 10, paddingBottom: 10 }}>
          <Col>
            <PDFViewer
              document={{
                binary: pdf,
              }}
            />
          </Col>
        </Row>

        <Row style={{ paddingTop: 10, paddingBottom: 10 }}>
          <Col md="2" lg="2">
            <Button
              type="button"
              color="primary"
              style={{ color: 'white', width: '100%' }}
              onClick={() => { download(pdfSrc.src, pdfSrc.fileName, pdfSrc.contentType) }}
            >
              <FontAwesomeIcon icon={faDownload} />
              &nbsp;
              Download
            </Button>
          </Col>
        </Row>
      </Fragment>
    )
  }
}
