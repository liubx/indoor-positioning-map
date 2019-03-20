/* global window */
/* eslint no-undef: "error" */
import { Component } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import * as WMS from 'leaflet.wms';
import { BASE_MAP_URL } from '../constant';
import { OUTDOOR_MAX_ZOOM, OUTDOOR_MIN_ZOOM } from './config';

class LlOutdoorLayer extends Component {
  componentDidMount() {
    this.loadIndoorMaps();
    // WMS.default.Source.extend({
    //   ajax: function(url, callback) {
    //     console.log(url);
    //     // $.ajax(url, {
    //     //     'context': this,
    //     //     'success': function(result) {
    //     //         callback.call(this, result);
    //     //      }
    //     // });
    //   },
    //   showFeatureInfo: function(latlng, info) {
    //     console.log(info);
    //   }
    // });
  }

  loadIndoorMaps() {
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
    var source = WMS.default.Source(`${BASE_MAP_URL}/indoor_map/wms`, {
      layers: 'indoor_map:indoor_map',
      tiled: true,
      format: 'image/png',
      transparent: true,
      maxZoom: OUTDOOR_MAX_ZOOM,
      minZoom: OUTDOOR_MIN_ZOOM,
      continuousWorld: true
    });
    source.getLayer('indoor_map:indoor_map').addTo(this.context.map);
    
    // L.tileLayer
    //   .wms(`${BASE_MAP_URL}/indoor_map/wms`, {
    //     layers: 'indoor_map:indoor_map',
    //     tiled: true,
    //     format: 'image/png',
    //     transparent: true,
    //     maxZoom: OUTDOOR_MAX_ZOOM,
    //     minZoom: OUTDOOR_MIN_ZOOM,
    //     continuousWorld: true
    //   })
    //   .addTo(this.context.map);
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
