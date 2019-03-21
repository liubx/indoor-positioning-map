/* global window */
/* eslint no-undef: "error" */
import React, { Component } from 'react';
import TileLayer from 'ol/layer/Tile';
import Overlay from 'ol/Overlay';
import PropTypes from 'prop-types';
import XYZ from 'ol/source/XYZ';
import TileWMS from 'ol/source/TileWMS';
import { fromEvent, from } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { tap, filter, map, flatMap, toArray } from 'rxjs/operators';
import { OUTDOOR_MIN_RESOLUTION } from './config';
import { BASE_MAP_URL, TIANDITU_URL } from '../constant';
import { get as getProjection } from 'ol/proj.js';
import popup from '../assets/img/popup.png';

class OlOutdoorLayer extends Component {
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
    this.context.map.addLayer(
      new TileLayer({
        source: new XYZ({
          url: `${TIANDITU_URL}/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=111b0cbae5ef2fb8ebdf06f937b12dd8`,
          projection: getProjection('EPSG:3857')
        }),
        zIndex: -10,
        minResolution: OUTDOOR_MIN_RESOLUTION
      })
    );
    this.context.map.addLayer(
      new TileLayer({
        source: new XYZ({
          url: `${TIANDITU_URL}/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=111b0cbae5ef2fb8ebdf06f937b12dd8`,
          projection: getProjection('EPSG:3857')
        }),
        zIndex: -5,
        minResolution: OUTDOOR_MIN_RESOLUTION
      })
    );
  };

  loadCustomMap = () => {
    this.context.map.addLayer(
      new TileLayer({
        source: new XYZ({
          url: `http://39.105.217.228:9002/api/wmts/gettile/4b9006155b9946d5bf259dd750084f52/{z}/{x}/{y}`,
          projection: getProjection('EPSG:3857')
        }),
        extent: [
          13574731.18887278,
          3469919.836022329,
          13585338.647663247,
          3478566.0198801826
        ],
        zIndex: -9,
        maxResolution: '19'
      })
    );
  };

  loadIndoorMaps = () => {
    this.source = new TileWMS({
      url: `${BASE_MAP_URL}/indoor_map/wms`,
      params: { LAYERS: 'indoor_map:indoor_map', TILED: true },
      serverType: 'geoserver'
    });
    this.context.map.addLayer(
      new TileLayer({
        source: this.source,
        zIndex: -4,
        minResolution: OUTDOOR_MIN_RESOLUTION
      })
    );
  };

  initPopup = () => {
    this.popupLayer = new Overlay({
      element: this.ref,
      positioning: 'bottom-center',
      offset: [0, -10]
    });
    this.context.map.addOverlay(this.popupLayer);

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
