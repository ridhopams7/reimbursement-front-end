import React from 'react';
import ReactDOM from 'react-dom';
import Page500 from './Page500';

it('renders without crashing', () => {
  let mock: any = jest.fn();

  const div = document.createElement('div');
  ReactDOM.render(
    <Page500
      match = {mock}
      location = {mock}
      history= {mock}
    />,
  div);
  ReactDOM.unmountComponentAtNode(div);
});
