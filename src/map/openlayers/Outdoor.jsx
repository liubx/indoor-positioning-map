/* global window */
/* eslint no-undef: "error" */
import { Component } from 'react';
import TileLayer from 'ol/layer/Tile';
import PropTypes from 'prop-types';
import TileWMS from 'ol/source/TileWMS';
import { fromEvent } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { tap, filter, map, flatMap } from 'rxjs/operators';

class OlOutdoorLayer extends Component {
  componentDidMount() {
    this.layer = new TileLayer();
    this.layer.setZIndex(0);
    this.source = new TileWMS({
      url: 'http://dev.geoserver.reliablesense.cn/geoserver/indoor_map/wms',
      params: { LAYERS: 'indoor_map:indoor_map', TILED: true },
      serverType: 'geoserver'
    });
    this.context.map.addLayer(this.layer);
    this.layer.setSource(this.source);
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
        tap((data) => console.log(data.features))
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
