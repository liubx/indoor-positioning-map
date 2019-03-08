/* global window */
/* eslint no-undef: "error" */
import { Component } from 'react';
import Rx from 'rxjs/Rx';
import PropTypes from 'prop-types';
import * as L from 'leaflet';
import { unproject } from './util';
import { BASE_MAP_URL } from '../constant';

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
    Rx.Observable.of(map)
      .filter((map) => map !== null && map !== undefined)
      .do((map) => {
        L.tileLayer
          .wms(
            `${BASE_MAP_URL}/${map.polygonLayerId.split(':')[0]}/wms`,
            {
              layers: map.polygonLayerId,
              tiled: true,
              format: 'image/png',
              transparent: true,
              maxZoom: 24,
              continuousWorld: true
            }
          )
          .addTo(this.context.map);
        this.context.map.setView(
          map.latitude !== null && map.longitude !== null
            ? unproject(map.longitude, map.latitude)
            : unproject(12957000, 4852000),
          20
        );
        this.context.map.options.minZoom = 18;
        this.context.map.options.maxZoom = 24;
        if (map.xmin && map.ymin && map.xmax && map.ymax) {
          this.context.map.setMaxBounds([
            unproject(map.xmin - 100, map.ymin - 100),
            unproject(map.xmax + 100, map.ymax + 100)
          ]);
        }
      })
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
