/* global window */
/* eslint no-undef: "error" */
import React, { Component } from 'react';
import TileLayer from 'ol/layer/Tile';
import Overlay from 'ol/Overlay';
import PropTypes from 'prop-types';
import TileWMS from 'ol/source/TileWMS';
import { fromEvent, from } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { tap, filter, map, flatMap, toArray } from 'rxjs/operators';
import { OUTDOOR_MIN_RESOLUTION } from './config';
import { BASE_MAP_URL } from '../constant';
import popup from '../assets/img/popup.png';

class OlOutdoorLayer extends Component {
  componentDidMount() {
    this.layer = new TileLayer();
    this.layer.setZIndex(0);
    this.context.map.addLayer(this.layer);
    this.popupLayer = new Overlay({
      element: this.ref,
      positioning: 'bottom-center',
      offset: [0, -10]
    });
    this.context.map.addOverlay(this.popupLayer);
    this.loadIndoorMaps();

    fromEvent(this.context.map, 'singleclick')
      .pipe(
        filter((e) => !e.dragging),
        tap(() => this.popupLayer.setPosition(null)),
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
        filter((data) => data),
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
              // window.loadIndoor(features.sort((a, b) => a.floor - b.floor))
              this.showPopup(features)
            )
          )
        )
      )
      .subscribe();

    window.hideOutdoorPopup = () => {
      this.popupLayer.setPosition(null);
    };

    window.showIndoorMap = () => {
      this.popupLayer.setPosition(null);
      window.loadIndoor(this.data.sort((a, b) => a.floor - b.floor));
    };
  }

  loadIndoorMaps = () => {
    this.source = new TileWMS({
      url: `${BASE_MAP_URL}/indoor_map/wms`,
      params: { LAYERS: 'indoor_map:indoor_map', TILED: true },
      serverType: 'geoserver'
    });
    this.layer.setSource(this.source);
    this.layer.setMinResolution(OUTDOOR_MIN_RESOLUTION);
  };

  showPopup = (data) => {
    this.data = data;
    this.ref.innerHTML = `<div class='ol-popup' style='background:url(${popup}) no-repeat'><span style='display:block;'><strong>室内地图提示</strong></span><span style='display:block;margin-top: 20px;'>
    是否进入该室内地图
    </span>
    <div style="margin-top: 20px;float: right;"><span style='color: #0060B6;cursor:pointer;' onclick="window.hideOutdoorPopup()">取消</span><span style='margin-left:20px;margin-right:50px;color: #0060B6;cursor:pointer;'  onclick="window.showIndoorMap()">确定</span></div></div>`;
    this.popupLayer.setPosition([data[0].longitude, data[0].latitude]);
  };

  render() {
    return <div ref={(el) => (this.ref = el)} />;
  }
}

OlOutdoorLayer.defaultProps = {};

OlOutdoorLayer.propTypes = {};

OlOutdoorLayer.contextTypes = {
  map: PropTypes.object
};

export default OlOutdoorLayer;
