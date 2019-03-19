/* global window */
/* eslint no-undef: "error" */
import React, { Component } from 'react';
import L from 'leaflet';
import PropTypes from 'prop-types';
import { unproject } from './util';

class LlMapLayer extends Component {
  constructor(props) {
    super(props);
    this.map = null;
    this.state = {
      loaded: false
    };
  }

  getChildContext() {
    return { map: this.map };
  }

  componentDidMount() {
    this.map = L.map(this.ref, {
      attributionControl: false,
      zoomControl: false,
      center: unproject(12957000, 4852000),
      zoom: 18,
      crs: L.CRS.EPSG3857
    });
    L.tileLayer(
      'http://t{s}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}',
      {
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        maxZoom: 24
      }
    ).addTo(this.map);
    this.setState({
      loaded: true
    });
  }

  render() {
    return (
      <div
        ref={(el) => (this.ref = el)}
        style={{ width: window.innerWidth, height: window.innerHeight }}
      >
        {this.props.children !== undefined && this.state.loaded
          ? this.props.children instanceof Array
            ? this.props.children
                .filter((child) => child !== null)
                .map((child) => React.cloneElement(child))
            : React.cloneElement(this.props.children)
          : null}
      </div>
    );
  }
}

LlMapLayer.defaultProps = {
  children: null
};

LlMapLayer.propTypes = {
  children: PropTypes.node
};

LlMapLayer.childContextTypes = {
  map: PropTypes.object
};

export default LlMapLayer;
