/* global window */
/* eslint no-undef: "error" */
import { Component } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { of } from 'rxjs';
import { tap, filter } from 'rxjs/operators';
import { BASE_MAP_URL } from '../constant';
import { INDOOR_MAX_ZOOM } from './config';

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
    of(map)
      .pipe(
        filter(
          (map) =>
            map !== null &&
            map !== undefined &&
            map.poiLayerId !== null &&
            map.poiLayerId !== undefined
        ),
        tap(
          (map) =>
            (this.layer = L.tileLayer
              .wms(`${BASE_MAP_URL}/wms`, {
                layers: map.poiLayerId,
                tiled: true,
                format: 'image/png',
                transparent: true,
                maxZoom: INDOOR_MAX_ZOOM,
                continuousWorld: true
              })
              .addTo(this.context.map))
        )
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
