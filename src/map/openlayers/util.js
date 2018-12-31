import Feature from 'ol/Feature';
import Style from 'ol/style/Style';
import Point from 'ol/geom/Point';
import Icon from 'ol/style/Icon';
import {
  LAMP_LAYER,
  NODE_LAYER,
  NURSE_LAYER,
  SENIOR_LAYER,
  SUPPORTER_LAYER,
  TARGET_LAYER,
  USER_LAYER
} from '../constant';

import position from '../assets/img/position.png';
import positionWithDirection from '../assets/img/position_direction.png';
import lamp from '../assets/img/lamp.png';
import bluetooth from '../assets/img/bluetooth.png';
import target from '../assets/img/target.png';
import nurse from '../assets/img/nurse.png';
import senior from '../assets/img/senior.png';
import supporter from '../assets/img/supporter.png';
import user from '../assets/img/user.png';

export const createPositionLabel = (data) => {
  const feature = new Feature({
    geometry: new Point([data.longitude, data.latitude])
  });
  feature.data = data;
  feature.setStyle([
    new Style({
      image: new Icon({
        anchor: [0.5, 0.5],
        scale: 0.4,
        src: data.direction === undefined ? position : positionWithDirection,
        rotation:
          data.direction === undefined ? 0 : (data.direction * Math.PI) / 180
      })
    })
  ]);
  return feature;
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
  const feature = new Feature({
    geometry: new Point([data.longitude, data.latitude])
  });
  data.type = LAMP_LAYER;
  feature.data = data;
  feature.setStyle([
    new Style({
      image: new Icon({
        anchor: [0.5, 1],
        scale: 0.4,
        src: lamp
      })
    })
  ]);
  return feature;
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
  const feature = new Feature({
    geometry: new Point([data.longitude, data.latitude])
  });
  data.type = NODE_LAYER;
  feature.data = data;
  feature.setStyle([
    new Style({
      image: new Icon({
        anchor: [0.5, 0.5],
        scale: 0.8,
        src: bluetooth
      })
    })
  ]);
  return feature;
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

  const feature = new Feature({
    geometry: new Point([data.tag.longitude, data.tag.latitude])
  });
  data.type = NURSE_LAYER;
  feature.data = data;
  feature.setStyle([
    new Style({
      image: new Icon({
        anchor: [0.5, 1],
        scale: 0.4,
        src: nurse
      })
    })
  ]);
  return feature;
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

  const feature = new Feature({
    geometry: new Point([data.tag.longitude, data.tag.latitude])
  });
  data.type = SENIOR_LAYER;
  feature.data = data;
  feature.setStyle([
    new Style({
      image: new Icon({
        anchor: [0.5, 1],
        scale: 0.4,
        src: senior
      })
    })
  ]);
  return feature;
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
  const feature = new Feature({
    geometry: new Point([data.longitude, data.latitude])
  });
  data.type = TARGET_LAYER;
  feature.data = data;
  feature.setStyle([
    new Style({
      image: new Icon({
        anchor: [0.5, 0.5],
        scale: 0.4,
        src: target
      })
    })
  ]);
  return feature;
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
  const feature = new Feature({
    geometry: new Point([data.longitude, data.latitude])
  });
  data.type = SUPPORTER_LAYER;
  feature.data = data;
  feature.setStyle([
    new Style({
      image: new Icon({
        anchor: [0.5, 1],
        scale: 0.4,
        src: supporter
      })
    })
  ]);
  return feature;
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
  const feature = new Feature({
    geometry: new Point([data.longitude, data.latitude])
  });
  data.type = USER_LAYER;
  feature.data = data;
  feature.setStyle([
    new Style({
      image: new Icon({
        anchor: [0.5, 1],
        scale: 0.4,
        src: user
      })
    })
  ]);
  return feature;
};
