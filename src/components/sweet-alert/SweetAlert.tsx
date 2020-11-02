import React from 'react';
import BootStrapSweetAlert from 'react-bootstrap-sweetalert';

export default function SweetAlert(props: any) {
  const {
    type, title,
    confirmBtnText, confirmBtnBsStyle,
    cancelBtnText, cancelBtnBsStyle,
    focusConfirmBtn,
    showConfirm, showCancel,
    message,
  } = props.param;

  return (
    <BootStrapSweetAlert
      type={type}
      title={title}
      confirmBtnText={confirmBtnText || 'Yes'}
      confirmBtnBsStyle={confirmBtnBsStyle || 'default'}
      cancelBtnText={cancelBtnText || 'Cancel'}
      cancelBtnBsStyle={cancelBtnBsStyle || 'default'}
      focusConfirmBtn={focusConfirmBtn}
      showConfirm={showConfirm}
      showCancel={showCancel}
      allowEscape
      closeOnClickOutside
      onConfirm={() => props.onConfirm()}
      onCancel={() => props.onCancel()}
    >
      {message}
    </BootStrapSweetAlert>
  )
}
