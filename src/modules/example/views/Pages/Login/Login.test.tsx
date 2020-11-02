import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import Login from './Login';

it('renders without crashing', () => {
  let mock: any = jest.fn();

  const div = document.createElement('div');
  ReactDOM.render(
    <MemoryRouter>
      <Login
        match = {mock}
        location = {mock}
        history= {mock}
      />
    </MemoryRouter>,
  div);
  ReactDOM.unmountComponentAtNode(div);
});
