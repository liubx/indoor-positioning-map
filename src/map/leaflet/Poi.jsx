/* global window */
/* eslint no-undef: "error" */
import { Component } from 'react';
import Rx from 'rxjs/Rx';
import PropTypes from 'prop-types';
import * as L from 'leaflet';
import { BASE_URL } from '../constant';

class LlPoiLayer extends Component {
  componentDidMount() {
    this.layer = null;
    this.loadPoi(this.props.map);
  }

  shouldComponentUpdate(newProps) {
    return (
      ((this.props.map === null || this.props.map === undefined) &&
        newProps.map !== null) ||
      (newProps.map !== null && newProps.map !== this.props.map)
    );
  }

  componentWillUpdate(newProps) {
    this.loadPoi(newProps.map);
  }

  componentWillUnmount() {
    if (this.layer && this.context.map.hasLayer(this.layer)) {
      this.context.map.removeLayer(this.layer);
    }
  }

  loadPoi(map) {
    Rx.Observable.of(map)
      .filter(
        (map) =>
          map !== null &&
          map !== undefined &&
          map.poiLayerId !== null &&
          map.poiLayerId !== undefined
      )
      .do(
        (map) =>
          (this.layer = L.tileLayer
            .wms(
              `${BASE_URL}:9010/geoserver/${map.poiLayerId.split(':')[0]}/wms`,
              {
                layers: map.poiLayerId,
                tiled: true,
                format: 'image/png',
                transparent: true,
                maxZoom: 24,
                continuousWorld: true
              }
            )
            .addTo(this.context.map))
      )
      .subscribe();
  }

  render() {
    return false;
  }
}

LlPoiLayer.defaultProps = {
  map: null
};

LlPoiLayer.propTypes = {
  map: PropTypes.object
};

LlPoiLayer.contextTypes = {
  map: PropTypes.object
};

export default LlPoiLayer;
