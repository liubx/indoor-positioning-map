import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Map from './map/Map';

export default class ExampleComponent extends Component {
  static propTypes = {
    text: PropTypes.string
  };

  render() {
    const { text } = this.props;

    return (
      <div>
        Example Component: {text}
        <Map />
      </div>
    );
  }
}
