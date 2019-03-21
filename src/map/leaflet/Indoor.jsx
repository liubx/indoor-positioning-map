/* global window */
/* eslint no-undef: "error" */
import { Component } from 'react';
import { of } from 'rxjs';
import { tap, filter } from 'rxjs/operators';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { unproject } from './util';
import { BASE_MAP_URL } from '../constant';
import {
  INDOOR_MAX_ZOOM
} from './config';

class LlIndoorLayer extends Component {
  componentDidMount() {
    this.loadMap(this.props.map);
  }

  shouldComponentUpdate(newProps) {
    return (
      ((this.props.map === null || this.props.map === undefined) &&
        newProps.map !== null) ||
      (newProps.map !== null && newProps.map !== this.props.map)
    );
  }

  componentWillUpdate(newProps) {
    this.loadMap(newProps.map);
  }

  loadMap(map) {
    of(map)
      .pipe(
        filter((map) => map !== null && map !== undefined),
        tap((map) => {
          L.tileLayer
            .wms(`${BASE_MAP_URL}/wms`, {
              layers: map.polygonLayerId,
              tiled: true,
              format: 'image/png',
              maxZoom: INDOOR_MAX_ZOOM,
              continuousWorld: true
            })
            .addTo(this.context.map);

          if (map.latitude !== null && map.longitude !== null) {
            this.context.map.panTo(unproject(map.longitude, map.latitude), {
              duration: 0.8
            });
          }
          if (map.xmin && map.ymin && map.xmax && map.ymax) {
            this.context.map.setMaxBounds([
              unproject(map.xmin - 100, map.ymin - 100),
              unproject(map.xmax + 100, map.ymax + 100)
            ]);
          }
        })
      )
      .subscribe();
  }

  render() {
    return false;
  }
}

LlIndoorLayer.defaultProps = {
  map: null
};

LlIndoorLayer.propTypes = {
  map: PropTypes.object
};

LlIndoorLayer.contextTypes = {
  map: PropTypes.object
};

export default LlIndoorLayer;
