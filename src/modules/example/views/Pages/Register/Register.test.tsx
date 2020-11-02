import React from 'react';
import ReactDOM from 'react-dom';
import Register from './Register';

it('renders without crashing', () => {
  let mock: any = jest.fn();
  
  const div = document.createElement('div');
  ReactDOM.render(
    <Register
      match = {mock}
      location = {mock}
      history= {mock}
    />,
  div);
  ReactDOM.unmountComponentAtNode(div);
});
