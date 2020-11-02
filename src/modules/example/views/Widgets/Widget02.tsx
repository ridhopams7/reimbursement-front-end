import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, CardFooter } from 'reactstrap';
import classNames from 'classnames';
import { mapToCssModules } from 'reactstrap/lib/utils';

class Widget02 extends Component<any, any> {
  static propTypes: {
    header: PropTypes.Requireable<string>;
    mainText: PropTypes.Requireable<string>;
    icon: PropTypes.Requireable<string>;
    color: PropTypes.Requireable<string>;
    variant: PropTypes.Requireable<any>;
    footer: PropTypes.Requireable<boolean>;
    link: PropTypes.Requireable<string>;
    children: PropTypes.Requireable<any>,
    className: PropTypes.Requireable<string>,
    cssModule: PropTypes.Requireable<object>,
  };
  static defaultProps: {
    header: '$1,999.50',
    mainText: 'Income',
    icon: 'fa fa-cogs',
    color: 'primary',
    variant: '0',
    link: '#',
  };

  render() {
    const { className, cssModule, header, mainText, icon, color, footer, link, children, variant, ...attributes } = this.props;

    // demo purposes only
    const padding = (variant === '0' ? { card: 'p-3', icon: 'p-3', lead: 'mt-2' } : (variant === '1' ? {
      card: 'p-0', icon: 'p-4', lead: 'pt-3',
    } : { card: 'p-0', icon: 'p-4 px-5', lead: 'pt-3' }));

    const card = { style: 'clearfix', color: color, icon: icon, classes: '' };
    card.classes = mapToCssModules(classNames(className, card.style, padding.card), cssModule);

    const lead = { style: 'h5 mb-0', color: color, classes: '' };
    lead.classes = classNames(lead.style, 'text-' + card.color, padding.lead);

    const blockIcon = function (icon: any) {
      const classes = classNames(icon, 'bg-' + card.color, padding.icon, 'font-2xl mr-3 float-left');
      return (<i className={classes}></i>);
    };

    const cardFooter = function () {
      if (footer) {
        return (
          <CardFooter className="px-3 py-2">
            <a className="font-weight-bold font-xs btn-block text-muted" href={link}>View More
              <i className="fa fa-angle-right float-right font-lg"></i></a>
          </CardFooter>
        );
      }
    };

    return (
      <Card>
        <CardBody className={card.classes} {...attributes}>
          {blockIcon(card.icon)}
          <div className={lead.classes}>{header}</div>
          <div className="text-muted text-uppercase font-weight-bold font-xs">{mainText}</div>
        </CardBody>
        {cardFooter()}
      </Card>
    );
  }
}

export default Widget02;