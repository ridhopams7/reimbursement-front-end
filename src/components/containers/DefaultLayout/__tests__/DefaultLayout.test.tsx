import React from 'react';
import ReactDOM from 'react-dom';
import { shallow } from 'enzyme/build';
import configureStore from 'redux-mock-store';
import { MemoryRouter, Route } from 'react-router-dom';
import DefaultLayout from '../DefaultLayout';
import { initialState } from '../../../../config';

const mockStore = configureStore();
let wrapper: any;
let store: any;

it('renders without crashing', () => {
  beforeEach(() => {
    store = mockStore(initialState);
    wrapper = shallow(<MemoryRouter><Route path="/" name="Home" component={DefaultLayout} store={store} /></MemoryRouter>);
  });
});

// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<MemoryRouter><Route path="/" name="Home" component={DefaultLayout} /></MemoryRouter>, div);
//   ReactDOM.unmountComponentAtNode(div);
// });
