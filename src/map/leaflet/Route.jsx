/* eslint no-undef: "error" */
import { Component } from 'react';
import { of } from 'rxjs';
import {
  tap,
  filter,
  map,
  flatMap,
  pairwise,
  reduce,
  pluck,
  first
} from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import PropTypes from 'prop-types';
import { unproject } from './util';
import L from 'leaflet';
import { BASE_API_URL } from '../constant';
import routeEnd from '../assets/img/route_end.png';
import routeStart from '../assets/img/route_start.png';

class LlRouteLayer extends Component {
  componentDidMount() {
    this.layer = L.featureGroup().addTo(this.context.map);
    this.style = {
      stroke: true,
      color: '#0DC56E',
      weight: 5,
      dashArray: [6]
    };
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
      newProps.map !== this.props.map || newProps.routes !== this.props.routes
    );
  }

  componentWillUpdate(newProps) {
    this.loadRoutes(newProps.routes, newProps.map);
  }

  loadRoutes(routes, indoormap) {
    of(routes)
      .pipe(
        tap(() => this.layer.clearLayers()),
        filter(
          (routes) =>
            indoormap !== null &&
            indoormap !== undefined &&
            routes !== null &&
            routes !== undefined &&
            routes.source_floor &&
            routes.source_longitude &&
            routes.source_latitude &&
            routes.target_floor &&
            routes.target_longitude &&
            routes.target_latitude
        ),
        flatMap((routes) =>
          ajax({
            url:
              `${BASE_API_URL}/web/routing/routes?` +
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
        ),
        map((e) => e.response),
        first((json) => json !== null && json.code === 200),
        map((json) => json.result),
        flatMap((data) => data),
        filter((data) => data.floor === indoormap.floor),
        map((data) => data.geojsonRoutes),
        flatMap((data) => data),
        map((data) => JSON.parse(data)),
        pluck('coordinates'),
        pairwise(),
        reduce((acc, value) => {
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
        }, []),
        map((data) =>
          routes.source_floor === indoormap.floor
            ? [[routes.source_longitude, routes.source_latitude]].concat(data)
            : data
        ),
        map((data) =>
          routes.target_floor === indoormap.floor
            ? data.concat([[routes.target_longitude, routes.target_latitude]])
            : data
        ),
        flatMap((data) => data),
        pairwise(),
        map((data) =>
          data
            .map((coordinate) => unproject(coordinate[0], coordinate[1]))
            .map((coordinate) => [coordinate.lng, coordinate.lat])
        ),
        map((data) => ({
          type: 'LineString',
          coordinates: data
        })),
        map((data) =>
          L.geoJSON(data, {
            style: this.style
          })
        )
      )
      .subscribe(
        (feature) => feature.addTo(this.layer),
        () => {},
        () => {
          if (routes.source_floor === indoormap.floor) {
            this.createStartPoint(
              routes.source_longitude,
              routes.source_latitude
            ).addTo(this.layer);
          }
          if (routes.target_floor === indoormap.floor) {
            this.createEndPoint(
              routes.target_longitude,
              routes.target_latitude
            ).addTo(this.layer);
          }
        }
      );
  }

  createStartPoint = (longitude, latitude) => {
    if (
      longitude === null ||
      longitude === undefined ||
      latitude === null ||
      latitude === undefined
    ) {
      return null;
    }
    return L.marker(unproject(longitude, latitude), {
      icon: L.icon({
        iconUrl: routeStart,
        iconSize: [60 * 0.4, 79 * 0.4],
        iconAnchor: [60 * 0.5 * 0.4, 79 * 0.4]
      })
    });
  };

  createEndPoint = (longitude, latitude) => {
    if (
      longitude === null ||
      longitude === undefined ||
      latitude === null ||
      latitude === undefined
    ) {
      return null;
    }
    return L.marker(unproject(longitude, latitude), {
      icon: L.icon({
        iconUrl: routeEnd,
        iconSize: [59 * 0.4, 79 * 0.4],
        iconAnchor: [59 * 0.5 * 0.4, 79 * 0.4]
      })
    });
  };

  render() {
    return false;
  }
}

LlRouteLayer.defaultProps = {
  routes: null,
  map: null
};

LlRouteLayer.propTypes = {
  routes: PropTypes.object,
  map: PropTypes.object
};

LlRouteLayer.contextTypes = {
  map: PropTypes.object
};

export default LlRouteLayer;
