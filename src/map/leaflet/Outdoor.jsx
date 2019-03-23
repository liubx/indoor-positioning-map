/* global window */
/* eslint no-undef: "error" */
import { Component } from 'react';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { from } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { tap, filter, map, flatMap, toArray } from 'rxjs/operators';
import * as WMS from 'leaflet.wms';
import { BASE_MAP_URL, TIANDITU_URL } from '../constant';
import { OUTDOOR_MAX_ZOOM, OUTDOOR_MIN_ZOOM } from './config';
import { unproject } from './util';
import popup from '../assets/img/popup.png';

class LlOutdoorLayer extends Component {
  componentDidMount() {
    this.loadTianDiTu();
    this.loadCustomMap();
    this.loadIndoorMaps();
    this.initPopup();

    window.hideOutdoorPopup = () => {
      this.popupLayer.remove();
    };

    window.showIndoorMap = () => {
      this.popupLayer.remove();
      window.loadIndoor(this.data.sort((a, b) => a.floor - b.floor));
    };
  }

  loadTianDiTu = () => {
    L.tileLayer(
      `${TIANDITU_URL.replace(
        '{0-7}',
        '{s}'
      )}/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=111b0cbae5ef2fb8ebdf06f937b12dd8`,
      {
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        maxZoom: OUTDOOR_MAX_ZOOM,
        minZoom: OUTDOOR_MIN_ZOOM,
        detectRetina: true,
        zIndex: -10
      }
    ).addTo(this.context.map);
    L.tileLayer(
      `${TIANDITU_URL.replace(
        '{0-7}',
        '{s}'
      )}/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=111b0cbae5ef2fb8ebdf06f937b12dd8`,
      {
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
        maxZoom: OUTDOOR_MAX_ZOOM,
        minZoom: OUTDOOR_MIN_ZOOM,
        detectRetina: true,
        zIndex: -5
      }
    ).addTo(this.context.map);
  };

  loadCustomMap = () => {
    L.tileLayer(
      `http://39.105.217.228:9002/api/wmts/gettile/4b9006155b9946d5bf259dd750084f52/{z}/{x}/{y}`,
      {
        maxZoom: OUTDOOR_MAX_ZOOM,
        minZoom: OUTDOOR_MIN_ZOOM,
        detectRetina: true,
        bounds: [
          unproject(13574731.18887278, 3469919.836022329),
          unproject(13585338.647663247 + 100, 3478566.0198801826)
        ],
        zIndex: -9
      }
    ).addTo(this.context.map);
  };

  loadIndoorMaps = () => {
    const Source = WMS.default.Source.extend({
      ajax: function(url, callback) {
        ajax(`${url}&INFO_FORMAT=application/json&FEATURE_COUNT=10`)
          .pipe(
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
                  callback.call(this, features)
                )
              )
            )
          )
          .subscribe();
      },
      showWaiting: () => {},
      // hideWaiting: () => {},
      showFeatureInfo: (latlng, result) => {
        this.data = result;
        this.popupLayer = L.popup({
          closeButton: false,
          autoClose: true,
          closeOnClick: true
        })
          .setLatLng(latlng)
          .setContent(
            `<div class='popup' style='margin-left:50px;margin-bottom:-10px;background:url(${popup}) no-repeat'><span style='display:block;'><strong>室内地图提示</strong></span><span style='display:block;margin-top: 20px;'>
          是否进入该室内地图
          </span>
          <div style="margin-top:20px;float: right;"><span style='color: #0060B6;cursor:pointer;' onclick="window.hideOutdoorPopup()">取消</span><span style='margin-left:20px;margin-right:50px;color: #0060B6;cursor:pointer;'  onclick="window.showIndoorMap()">确定</span></div></div>`
          )
          .openOn(this.context.map);
      }
    });

    const source = new Source(`${BASE_MAP_URL}/indoor_map/wms`, {
      layers: 'indoor_map:indoor_map',
      tiled: true,
      format: 'image/png',
      transparent: true,
      maxZoom: OUTDOOR_MAX_ZOOM,
      minZoom: OUTDOOR_MIN_ZOOM,
      continuousWorld: true,
      zIndex: -4
    });
    source.getLayer('indoor_map:indoor_map').addTo(this.context.map);
  };

  initPopup = () => {};

  showPopup = (data) => {};

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
