/* global window */
/* eslint no-undef: "error" */
import { Component } from 'react';
import TileLayer from 'ol/layer/Tile';
import PropTypes from 'prop-types';
import TileWMS from 'ol/source/TileWMS';
import { fromEvent, from } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { tap, filter, map, flatMap, toArray } from 'rxjs/operators';
import { OUTDOOR_MIN_RESOLUTION } from './config';
import { BASE_MAP_URL } from '../constant';

class OlOutdoorLayer extends Component {
  componentDidMount() {
    this.layer = new TileLayer();
    this.layer.setZIndex(0);
    this.source = new TileWMS({
      url: `${BASE_MAP_URL}/indoor_map/wms`,
      params: { LAYERS: 'indoor_map:indoor_map', TILED: true },
      serverType: 'geoserver'
    });
    this.context.map.addLayer(this.layer);
    this.layer.setSource(this.source);
    this.layer.setMinResolution(OUTDOOR_MIN_RESOLUTION);
    fromEvent(this.context.map, 'singleclick')
      .pipe(
        filter((e) => !e.dragging),
        map((e) => {
          return this.source.getGetFeatureInfoUrl(
            e.coordinate,
            this.context.map.getView().getResolution(),
            'EPSG:3857',
            { INFO_FORMAT: 'application/json', FEATURE_COUNT: '10' }
          );
        }),
        flatMap((url) => ajax(url)),
        map((e) => e.response),
        map((data) => data.features),
        filter((features) => features.length),
        filter((features) => {
          if (
            features.every(
              (item) =>
                features[0].properties.building === item.properties.building
            )
          ) {
            return true;
          } else {
            window.zoomIn(2);
            window.move(
              features[0].properties.longitude,
              features[0].properties.latitude
            );
            return false;
          }
        }),
        flatMap((features) =>
          from(features).pipe(
            map((feature) => {
              return {
                id: feature.id,
                floor: feature.properties.floor,
                latitude: feature.properties.latitude,
                longitude: feature.properties.longitude,
                polygonLayerId: feature.properties.polygon_layer,
                poiLayerId: feature.properties.poi_layer,
                routeLayerId: feature.properties.route_layer,
                xmin: feature.properties.map_xmin,
                ymin: feature.properties.map_ymin,
                xmax: feature.properties.map_xmax,
                ymax: feature.properties.map_ymax
              };
            }),
            toArray(),
            tap((features) =>
              window.loadIndoor(features.sort((a, b) => a.floor - b.floor))
            )
          )
        )
      )
      .subscribe();
  }

  render() {
    return false;
  }
}

OlOutdoorLayer.defaultProps = {};

OlOutdoorLayer.propTypes = {};

OlOutdoorLayer.contextTypes = {
  map: PropTypes.object
};

export default OlOutdoorLayer;
