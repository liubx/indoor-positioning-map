/* global window */
/* eslint no-undef: "error" */
import { Component } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import * as WMS from 'leaflet.wms';
import { BASE_MAP_URL, TIANDITU_URL } from '../constant';
import { OUTDOOR_MAX_ZOOM, OUTDOOR_MIN_ZOOM } from './config';
import { unproject } from './util';

class LlOutdoorLayer extends Component {
  componentDidMount() {
    this.loadTianDiTu();
    this.loadCustomMap();
    this.loadIndoorMaps();
    this.initPopup();

    window.hideOutdoorPopup = () => {
      this.popupLayer.setPosition(null);
    };

    window.showIndoorMap = () => {
      this.popupLayer.setPosition(null);
      window.loadIndoor(this.data.sort((a, b) => a.floor - b.floor));
    };
  }

  loadTianDiTu = () => {
    L.tileLayer(
      `${TIANDITU_URL.replace(
        '{0-7}',
        '{s}'
      )}/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=111b0cbae5ef2fb8ebdf06f937b12dd8`,
      {
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        maxZoom: OUTDOOR_MAX_ZOOM,
        minZoom: OUTDOOR_MIN_ZOOM,
        detectRetina: true,
        zIndex: -10
      }
    ).addTo(this.context.map);
    L.tileLayer(
      `${TIANDITU_URL.replace(
        '{0-7}',
        '{s}'
      )}/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=111b0cbae5ef2fb8ebdf06f937b12dd8`,
      {
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        maxZoom: OUTDOOR_MAX_ZOOM,
        minZoom: OUTDOOR_MIN_ZOOM,
        detectRetina: true,
        zIndex: -5
      }
    ).addTo(this.context.map);
  };

  loadCustomMap = () => {
    L.tileLayer(
      `http://39.105.217.228:9002/api/wmts/gettile/4b9006155b9946d5bf259dd750084f52/{z}/{x}/{y}`,
      {
        maxZoom: OUTDOOR_MAX_ZOOM,
        minZoom: OUTDOOR_MIN_ZOOM,
        detectRetina: true,
        bounds: [
          unproject(13574731.18887278, 3469919.836022329),
          unproject(13585338.647663247 + 100, 3478566.0198801826)
        ],
        zIndex: -9
      }
    ).addTo(this.context.map);
  };

  loadIndoorMaps = () => {
    WMS.default.Source.extend({
      ajax: function(url, callback) {
        console.log(111);
      },
      showFeatureInfo: function(latlng, info) {
        console.log(222);
      },
      getFeatureInfoParams: function(latlng, info) {
        console.log(333);
      }
    });
    const source = WMS.default.source(`${BASE_MAP_URL}/indoor_map/wms`, {
      layers: 'indoor_map:indoor_map',
      tiled: true,
      format: 'image/png',
      transparent: true,
      maxZoom: OUTDOOR_MAX_ZOOM,
      minZoom: OUTDOOR_MIN_ZOOM,
      continuousWorld: true,
      zIndex: -4
    });
    source.getLayer('indoor_map:indoor_map').addTo(this.context.map);
  };

  initPopup = () => {};

  showPopup = (data) => {};

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
