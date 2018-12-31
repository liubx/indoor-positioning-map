/* global window */
/* eslint no-undef: "error" */
import { Component } from 'react';
import Rx from 'rxjs/Rx';
import _ from 'lodash';
import VectorSource from 'ol/source/Vector';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import Icon from 'ol/style/Icon';
import LineString from 'ol/geom/LineString';
import PropTypes from 'prop-types';
import { BASE_URL } from '../constant';
import routeEnd from '../assets/img/route_end.png';
import routeStart from '../assets/img/route_start.png';

class OlRouteLayer extends Component {
  componentDidMount() {
    this.source = new VectorSource();
    const layer = new VectorLayer({
      source: this.source,
      style: new Style({
        stroke: new Stroke({
          color: '#0DC56E',
          lineDash: [6],
          width: 5
        })
      })
    });
    this.context.map.addLayer(layer);
    this.loadRoutes(this.props.routes, this.props.map);
  }

  shouldComponentUpdate(newProps) {
    if (this.props.map === null || this.props.map === undefined) {
      return true;
    }

    if (this.props.routes === null || this.props.routes === undefined) {
      return true;
    }
    if (newProps.routes === null && newProps.map === null) {
      return false;
    }
    return (
      newProps.map !== this.props.map ||
      !_.isEqual(this.props.routes, newProps.routes)
    );
  }

  componentWillUpdate(newProps) {
    this.loadRoutes(newProps.routes, newProps.map);
  }

  loadRoutes(routes, map) {
    Rx.Observable.of(routes)
      .do(() => this.source.clear())
      .filter(
        (routes) =>
          map !== null &&
          map !== undefined &&
          routes !== null &&
          routes !== undefined &&
          routes.source_floor &&
          routes.source_longitude &&
          routes.source_latitude &&
          routes.target_floor &&
          routes.target_longitude &&
          routes.target_latitude
      )
      .flatMap((routes) =>
        Rx.Observable.ajax({
          url:
            `${BASE_URL}:9000/api/web/routing/routes?` +
            `sourceFloor=${routes.source_floor}&sourceLongitude=${
              routes.source_longitude
            }&sourceLatitude=${routes.source_latitude}&targetFloor=${
              routes.target_floor
            }&targetLongitude=${routes.target_longitude}&targetLatitude=${
              routes.target_latitude
            }`,
          crossDomain: true,
          headers: {
            Authorization:
              'eyJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJyZWxpYWJsZXNlbnNlLmNvbSIsImlhdCI6MTUyODA0MTA5MSwidXNlcklkIjoxLCJ1c2VyVHlwZSI6IlNVUEVSX0FETUlOIiwidXNlck5hbWUiOiJhZG1pbiJ9.oXUEj0oXLi5rKnGjC8o1FlTWDie5bkgs0zsGSLnGeyI',
            'Content-Type': 'application/json',
            Accept: 'application/json, text/plain, */*'
          }
        })
      )
      .map((e) => e.response)
      .first((json) => json !== null && json.code === 200)
      .map((json) => json.result)
      .flatMap((data) => data)
      .filter((data) => data.floor === map.floor)
      .map((data) => data.geojsonRoutes)
      .flatMap((data) => data)
      .map((data) => JSON.parse(data))
      .pluck('coordinates')
      .pairwise()
      .reduce((acc, value) => {
        const first = value[0];
        const second = value[1];
        const num = first
          .filter(
            (item) =>
              JSON.stringify(second[0]) === JSON.stringify(item) ||
              JSON.stringify(second[1]) === JSON.stringify(item)
          )
          .shift();
        return acc.length > 0
          ? acc.concat(
              second.filter(
                (item) => JSON.stringify(item) !== JSON.stringify(num)
              )
            )
          : acc.concat(
              first.filter(
                (item) => JSON.stringify(item) !== JSON.stringify(num)
              ),
              [num],
              second.filter(
                (item) => JSON.stringify(item) !== JSON.stringify(num)
              )
            );
      }, [])
      .map((data) =>
        routes.source_floor === map.floor
          ? [[routes.source_longitude, routes.source_latitude]].concat(data)
          : data
      )
      .map((data) =>
        routes.target_floor === map.floor
          ? data.concat([[routes.target_longitude, routes.target_latitude]])
          : data
      )
      .flatMap((data) => data)
      .pairwise()
      .map((data) => ({
        geometry: new LineString(data)
      }))
      .map((data) => new Feature(data))
      .subscribe(
        (feature) => this.source.addFeature(feature),
        () => {},
        () => {
          if (routes.source_floor === map.floor) {
            this.source.addFeature(
              this.createStartPoint(
                routes.source_longitude,
                routes.source_latitude
              )
            );
          }

          if (routes.target_floor === map.floor) {
            this.source.addFeature(
              this.createEndPoint(
                routes.target_longitude,
                routes.target_latitude
              )
            );
          }
        }
      );
  }

  createStartPoint = (longitude, latitude) => {
    const feature = new Feature({
      geometry: new Point([longitude, latitude])
    });
    feature.setStyle([
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          scale: 0.4,
          src: routeStart
        })
      })
    ]);
    return feature;
  };

  createEndPoint = (longitude, latitude) => {
    const feature = new Feature({
      geometry: new Point([longitude, latitude])
    });
    feature.setStyle([
      new Style({
        image: new Icon({
          anchor: [0.5, 1],
          scale: 0.4,
          src: routeEnd
        })
      })
    ]);
    return feature;
  };

  render() {
    return false;
  }
}

OlRouteLayer.defaultProps = {
  routes: null,
  map: null
};

OlRouteLayer.propTypes = {
  routes: PropTypes.object,
  map: PropTypes.object
};

OlRouteLayer.contextTypes = {
  map: PropTypes.object
};

export default OlRouteLayer;
