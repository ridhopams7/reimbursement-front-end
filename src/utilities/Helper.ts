export const isNumber = (val: any) => {
  if (!isNaN(val) && isFinite(val) && !/e/i.test(val)) return true;
  return false;
}

export const thousandSeparator = (val: number | string, maximumFractionDigits: number) => {
  let numb = val;
  if (typeof numb === 'string' && numb.includes(',')) numb = numb.replace(/,/g, '');
  return numb.toLocaleString('en', { maximumFractionDigits });
}

export const handleRedirectUser = (resAuth: any) => {
  try {
    const param = {
      type: 'error',
      title: 'Attention!',
      message: 'Unauthorized',
      confirmBtnText: 'Ok',
      confirmBtnBsStyle: 'primary',
      showCancel: false,
      showConfirm: true,
      focusConfirmBtn: false,
    };

    const list = ['AJ_View', 'V_View', 'R_GJ_View', 'R_GL_View', ];
    let modules = '';
    let url = '';
    for (const a in list) {
      const isRoleExist = resAuth.roles.find((obj: any) => obj.role === list[a]);
      if (isRoleExist) {
        modules = list[a];
        break;
      }
    }

    switch (modules) {
      case 'AJ_View':
        url = '/automatic-journal'
        break;
      case 'V_View':
        url = '/voucher'
        break;
      case 'R_GJ_View':
        url = '/report/general-journal'
        break;
      case 'R_GL_View':
        url = '/report/general-ledger'
        break;
      default:
        break;
    }

    const data: any = {
      param,
      url,
    }

    return data;
  } catch (e) {
    console.log(`error at handleRedirectUser with error: ${e}`);
  }
}