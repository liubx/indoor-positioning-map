import L from 'leaflet';
import {
  LAMP_LAYER,
  NODE_LAYER,
  NURSE_LAYER,
  POSITION_LAYER,
  SENIOR_LAYER,
  SUPPORTER_LAYER,
  TARGET_LAYER,
  USER_LAYER,
  PROJECTION_3857,
  PROJECTION_4326
} from '../constant';

import position from '../assets/img/position.png';
import positionWithDirection from '../assets/img/position_direction.png';
import lamp from '../assets/img/lamp.png';
import bluetooth from '../assets/img/bluetooth.png';
import nurse from '../assets/img/nurse.png';
import senior from '../assets/img/senior.png';
import supporter from '../assets/img/supporter.png';
import user from '../assets/img/user.png';
import 'leaflet-rotatedmarker';

export const unproject = (longitude, latitude) =>
  L.CRS.EPSG3857.unproject(new L.Point(longitude, latitude));

export const project = (longitude, latitude) =>
  L.CRS.EPSG3857.project(new L.LatLng(latitude, longitude));

export const createPositionLabel = (data) => {
  if (
    data === null ||
    data === undefined ||
    data.latitude === null ||
    data.latitude === undefined ||
    data.longitude === null ||
    data.longitude === undefined
  ) {
    return null;
  }
  if (data.projection && data.projection === PROJECTION_4326) {
    const point = project(data.longitude, data.latitude);
    data.longitude = point.x;
    data.latitude = point.y;
    data.projection = PROJECTION_3857;
  }
  data.type = POSITION_LAYER;
  const marker = L.marker(unproject(data.longitude, data.latitude), {
    icon: L.icon({
      iconUrl: data.direction === undefined ? position : positionWithDirection,
      iconSize: [73 * 0.4, 72 * 0.4],
      iconAnchor: [73 * 0.5 * 0.4, 72 * 0.5 * 0.4]
    }),
    rotationAngle: data.direction === undefined ? 0 : data.direction
  });
  marker.data = data;
  return marker;
};

export const createLampLabel = (data) => {
  if (
    data === null ||
    data === undefined ||
    data.latitude === null ||
    data.latitude === undefined ||
    data.longitude === null ||
    data.longitude === undefined
  ) {
    return null;
  }
  if (data.projection && data.projection === PROJECTION_4326) {
    const point = project(data.longitude, data.latitude);
    data.longitude = point.x;
    data.latitude = point.y;
    data.projection = PROJECTION_3857;
  }
  data.type = LAMP_LAYER;
  const marker = L.marker(unproject(data.longitude, data.latitude), {
    icon: L.icon({
      iconUrl: lamp,
      iconSize: [74 * 0.4, 82 * 0.4],
      iconAnchor: [74 * 0.5 * 0.4, 82 * 0.4]
    })
  });
  marker.data = data;
  return marker;
};

export const createNodeLabel = (data) => {
  if (
    data === null ||
    data === undefined ||
    data.latitude === null ||
    data.latitude === undefined ||
    data.longitude === null ||
    data.longitude === undefined
  ) {
    return null;
  }
  if (data.projection && data.projection === PROJECTION_4326) {
    const point = project(data.longitude, data.latitude);
    data.longitude = point.x;
    data.latitude = point.y;
    data.projection = PROJECTION_3857;
  }
  data.type = NODE_LAYER;
  const marker = L.marker(unproject(data.longitude, data.latitude), {
    icon: L.icon({
      iconUrl: bluetooth,
      iconSize: [25 * 0.8, 25 * 0.8],
      iconAnchor: [25 * 0.5 * 0.8, 25 * 0.5 * 0.8]
    })
  });
  marker.data = data;
  return marker;
};

export const createNurseLabel = (data) => {
  if (
    data === null ||
    data === undefined ||
    data.tag === null ||
    data.tag === undefined ||
    data.tag.latitude === null ||
    data.tag.latitude === undefined ||
    data.tag.longitude === null ||
    data.tag.longitude === undefined
  ) {
    return null;
  }
  if (data.tag.projection && data.tag.projection === PROJECTION_4326) {
    const point = project(data.tag.longitude, data.tag.latitude);
    data.tag.longitude = point.x;
    data.tag.latitude = point.y;
    data.tag.projection = PROJECTION_3857;
  }
  data.type = NURSE_LAYER;
  const marker = L.marker(unproject(data.tag.longitude, data.tag.latitude), {
    icon: L.icon({
      iconUrl: nurse,
      iconSize: [71 * 0.4, 82 * 0.4],
      iconAnchor: [71 * 0.5 * 0.4, 82 * 0.4]
    })
  });
  marker.data = data;
  return marker;
};

export const createSeniorLabel = (data) => {
  if (
    data === null ||
    data === undefined ||
    data.tag === null ||
    data.tag === undefined ||
    data.tag.latitude === null ||
    data.tag.latitude === undefined ||
    data.tag.longitude === null ||
    data.tag.longitude === undefined
  ) {
    return null;
  }
  if (data.tag.projection && data.tag.projection === PROJECTION_4326) {
    const point = project(data.tag.longitude, data.tag.latitude);
    data.tag.longitude = point.x;
    data.tag.latitude = point.y;
    data.tag.projection = PROJECTION_3857;
  }
  data.type = SENIOR_LAYER;
  const marker = L.marker(unproject(data.tag.longitude, data.tag.latitude), {
    icon: L.icon({
      iconUrl: senior,
      iconSize: [73 * 0.4, 82 * 0.4],
      iconAnchor: [73 * 0.5 * 0.4, 82 * 0.4]
    })
  });
  marker.data = data;
  return marker;
};

export const createTargetLabel = (data) => {
  if (
    data === null ||
    data === undefined ||
    data.latitude === null ||
    data.latitude === undefined ||
    data.longitude === null ||
    data.longitude === undefined
  ) {
    return null;
  }
  if (data.projection && data.projection === PROJECTION_4326) {
    const point = project(data.longitude, data.latitude);
    data.longitude = point.x;
    data.latitude = point.y;
    data.projection = PROJECTION_3857;
  }
  data.type = TARGET_LAYER;
  const marker = L.marker(unproject(data.longitude, data.latitude), {
    icon: L.icon({
      iconUrl: position,
      iconSize: [73 * 0.4, 72 * 0.4],
      iconAnchor: [73 * 0.5 * 0.4, 72 * 0.5 * 0.4]
    })
  });
  marker.data = data;
  return marker;
};

export const createSupporterLabel = (data) => {
  if (
    data === null ||
    data === undefined ||
    data.latitude === null ||
    data.latitude === undefined ||
    data.longitude === null ||
    data.longitude === undefined
  ) {
    return null;
  }
  if (data.projection && data.projection === PROJECTION_4326) {
    const point = project(data.longitude, data.latitude);
    data.longitude = point.x;
    data.latitude = point.y;
    data.projection = PROJECTION_3857;
  }
  data.type = SUPPORTER_LAYER;
  const marker = L.marker(unproject(data.longitude, data.latitude), {
    icon: L.icon({
      iconUrl: supporter,
      iconSize: [74 * 0.4, 82 * 0.4],
      iconAnchor: [74 * 0.5 * 0.4, 82 * 0.4]
    })
  });
  marker.data = data;
  return marker;
};

export const createUserLabel = (data) => {
  if (
    data === null ||
    data === undefined ||
    data.latitude === null ||
    data.latitude === undefined ||
    data.longitude === null ||
    data.longitude === undefined
  ) {
    return null;
  }
  if (data.projection && data.projection === PROJECTION_4326) {
    const point = project(data.longitude, data.latitude);
    data.longitude = point.x;
    data.latitude = point.y;
    data.projection = PROJECTION_3857;
  }
  data.type = USER_LAYER;
  const marker = L.marker(unproject(data.longitude, data.latitude), {
    icon: L.icon({
      iconUrl: user,
      iconSize: [74 * 0.4, 82 * 0.4],
      iconAnchor: [74 * 0.5 * 0.4, 82 * 0.4]
    })
  });
  marker.data = data;
  return marker;
};
