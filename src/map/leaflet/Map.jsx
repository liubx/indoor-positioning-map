/* global window */
/* eslint no-undef: "error" */
import React, { Component } from 'react';
import L from 'leaflet';
import PropTypes from 'prop-types';
import { unproject } from './util';
import { TIANDITU_URL } from '../constant';
import {
  DEFAULT_CENTER,
  DEFAULT_PROJECTION,
  OUTDOOR_DEFAULT_ZOOM,
  OUTDOOR_MAX_ZOOM,
  OUTDOOR_MIN_ZOOM
} from './config';

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
    const { zoom, minZoom, maxZoom } = this.props;
    this.map = L.map(this.ref, {
      attributionControl: false,
      zoomControl: false,
      center: unproject(DEFAULT_CENTER[0], DEFAULT_CENTER[1]),
      zoom,
      maxZoom,
      minZoom,
      crs: DEFAULT_PROJECTION
    });
    L.tileLayer(
      `${TIANDITU_URL.replace(
        '{0-7}',
        '{s}'
      )}/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=111b0cbae5ef2fb8ebdf06f937b12dd8`,
      {
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        maxZoom: maxZoom,
        minZoom: minZoom,
        detectRetina: true
      }
    ).addTo(this.map);
    L.tileLayer(
      `http://39.105.217.228:9002/api/wmts/gettile/4b9006155b9946d5bf259dd750084f52/{z}/{x}/{y}`,
      {
        maxZoom: maxZoom,
        minZoom: minZoom,
        detectRetina: true,
        bounds: [
          unproject(13574731.18887278, 3469919.836022329),
          unproject(13585338.647663247 + 100, 3478566.0198801826)
        ]
      }
    ).addTo(this.map);
    L.tileLayer(
      `${TIANDITU_URL.replace(
        '{0-7}',
        '{s}'
      )}/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=111b0cbae5ef2fb8ebdf06f937b12dd8`,
      {
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        maxZoom: maxZoom,
        minZoom: minZoom,
        detectRetina: true
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
  children: null,
  zoom: OUTDOOR_DEFAULT_ZOOM,
  maxZoom: OUTDOOR_MAX_ZOOM,
  minZoom: OUTDOOR_MIN_ZOOM
};

LlMapLayer.propTypes = {
  children: PropTypes.node,
  zoom: PropTypes.number,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number
};

LlMapLayer.childContextTypes = {
  map: PropTypes.object
};

export default LlMapLayer;
