/* global window */
/* eslint no-undef: "error" */
import { Component } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { BASE_MAP_URL } from '../constant';
import { OUTDOOR_MAX_ZOOM, OUTDOOR_MIN_ZOOM } from './config';

class LlOutdoorLayer extends Component {
  componentDidMount() {
    this.loadIndoorMaps();
  }

  loadIndoorMaps() {
    L.tileLayer
      .wms(`${BASE_MAP_URL}/indoor_map/wms`, {
        layers: 'indoor_map:indoor_map',
        tiled: true,
        format: 'image/png',
        transparent: true,
        maxZoom: OUTDOOR_MAX_ZOOM,
        minZoom: OUTDOOR_MIN_ZOOM,
        continuousWorld: true
      })
      .addTo(this.context.map);
  }

  render() {
    return false;
  }
}

LlOutdoorLayer.defaultProps = {};

LlOutdoorLayer.propTypes = {};

LlOutdoorLayer.contextTypes = {
  map: PropTypes.object
};

export default LlOutdoorLayer;
