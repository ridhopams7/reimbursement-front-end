import React from 'react';
import ReactDOM from 'react-dom';
import Page404 from './Page404';

it('renders without crashing', () => {
  let mock: any = jest.fn();
  
  const div = document.createElement('div');
  ReactDOM.render(
    <Page404
      match = {mock}
      location = {mock}
      history= {mock}
    />,
  div);
  ReactDOM.unmountComponentAtNode(div);
});
