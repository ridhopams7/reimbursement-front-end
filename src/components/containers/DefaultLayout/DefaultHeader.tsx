import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Nav, NavItem, NavLink,
} from 'reactstrap';
import PropTypes from 'prop-types';

import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import { CompanyName } from '../../../config';

import logo from '../../../assets/img/brand/ecom.png';
// import logo from '../../../assets/img/brand/logo-by-telkom.svg';
import sygnet from '../../../assets/img/brand/sygnet.svg';

const propTypes = {
  children: PropTypes.node, // eslint-disable-line
};

const defaultProps = {};

class DefaultHeader extends Component<any, any> {
  static propTypes: { children: PropTypes.Requireable<PropTypes.ReactNodeLike>; };
  static defaultProps: {};

  render() {
    // eslint-disable-next-line
    const { children, userName, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand tag={Link} to={"/"}
          full={{
            src: logo, width: 150, height: 30, alt: CompanyName, 
          }}
          minimized={{
            src: sygnet, width: 30, height: 30, alt: CompanyName,
          }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
       
          <NavItem className="px-3">
            <NavLink to="#" className="nav-link"> Welcome {userName}</NavLink>
          </NavItem>
          {/* <NavItem className="px-3">
            <Link to="/users" className="nav-link">Users</Link>
          </NavItem>
          <NavItem className="px-3">
            <NavLink to="#" className="nav-link">Settings</NavLink>
          </NavItem> */}
        </Nav>
        <Nav className="ml-auto" navbar>
          <NavItem className="d-md-down-none">
            {/* <Link to="/users" className="nav-link">Users</Link> */}
              <Link to="#"  style={{ right: 'auto', paddingRight: 20 }}  onClick={e => this.props.onLogout(e)} className="nav-link">Logout <i className="fa fa-lock" /></Link>
            {/* <NavLink onClick={e => this.props.onLogout(e)} className="nav-link"><i className="fa fa-lock" /> Welcome {this.props.userName}</NavLink> */}
          </NavItem>
          {/* <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-bell" /><Badge pill color="danger">5</Badge></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-list" /></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-location-pin" /></NavLink>
          </NavItem>
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <img src="../../assets/img/avatars/6.jpg" className="img-avatar" alt="admin@bootstrapmaster.com" />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
              <DropdownItem><i className="fa fa-bell-o" /> Updates<Badge color="info">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-envelope-o" /> Messages<Badge color="success">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-tasks" /> Tasks<Badge color="danger">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-comments" /> Comments<Badge color="warning">42</Badge></DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
              <DropdownItem><i className="fa fa-user" /> Profile</DropdownItem>
              <DropdownItem><i className="fa fa-wrench" /> Settings</DropdownItem>
              <DropdownItem><i className="fa fa-usd" /> Payments<Badge color="secondary">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-file" /> Projects<Badge color="primary">42</Badge></DropdownItem>
              <DropdownItem divider />
              <DropdownItem><i className="fa fa-shield" /> Lock Account</DropdownItem>
              <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-lock" /> Logout</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown> */}
        </Nav>
        {/* <AppAsideToggler className="d-md-down-none" /> */}
        {/* <AppAsideToggler className="d-lg-none" mobile /> */}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
