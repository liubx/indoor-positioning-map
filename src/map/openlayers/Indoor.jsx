/* global window */
/* eslint no-undef: "error" */
import { Component } from 'react';
import { of } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import TileLayer from 'ol/layer/Tile';
import Projection from 'ol/proj/Projection';
import View from 'ol/View';
import WMTS from 'ol/source/WMTS';
import WMTSGrid from 'ol/tilegrid/WMTS';
import PropTypes from 'prop-types';
import { RESOLUTIONS, TILEMATRIX, TILEMATRIXSET } from './config';
import { BASE_URL } from '../constant';

class OlIndoorLayer extends Component {
  componentDidMount() {
    this.layer = new TileLayer();
    this.layer.setZIndex(0);
    this.context.map.addLayer(this.layer);
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
          this.layer.setSource(
            new WMTS({
              url: `${BASE_URL}:9010/geoserver/gwc/service/wmts`,
              layer: map.polygonLayerId,
              matrixSet: TILEMATRIXSET,
              format: 'image/png',
              projection: new Projection({
                code: 'EPSG:3857',
                units: 'm',
                axisOrientation: 'neu',
                global: true
              }),
              tileGrid: new WMTSGrid({
                tileSize: [256, 256],
                extent: [
                  -2.003750834e7,
                  -2.003750834e7,
                  2.003750834e7,
                  2.003750834e7
                ],
                origin: [-2.003750834e7, 2.003750834e7],
                resolutions: RESOLUTIONS,
                matrixIds: TILEMATRIX
              }),
              style: '',
              wrapX: true
            })
          );
          if (map.xmin && map.ymin && map.xmax && map.ymax) {
            this.layer.setExtent([map.xmin, map.ymin, map.xmax, map.ymax]);
          }
          this.context.map.setView(
            new View(
              Object.assign(
                this.context.map.getView().options_,
                {
                  center:
                    map.latitude !== null && map.longitude !== null
                      ? [map.longitude, map.latitude]
                      : [12957000, 4852000]
                },
                map.xmin && map.ymin && map.xmax && map.ymax
                  ? { extent: [map.xmin, map.ymin, map.xmax, map.ymax] }
                  : {}
              )
            )
          );
        })
      )
      .subscribe();
  }

  render() {
    return false;
  }
}

OlIndoorLayer.defaultProps = {
  map: null
};

OlIndoorLayer.propTypes = {
  map: PropTypes.object
};

OlIndoorLayer.contextTypes = {
  map: PropTypes.object
};

export default OlIndoorLayer;
