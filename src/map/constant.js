export const LEAFLET = 'leaflet';

export const OPENLAYERS = 'openlayers';

export const HEAT_MAP_LAYER = 'heatmap';

export const HISTORY_LAYER = 'history';

export const OUTDOOR_LAYER = 'outdoor';

export const INDOOR_LAYER = 'indoor';

export const POI_LAYER = 'poi';

export const ROUTE_LAYER = 'route';

export const POSITION_LAYER = 'position';

export const LABEL_SELECT_LAYER = 'label_select';

export const EVENT_LAYER = 'event';

export const TRIGGER_LAYER = 'trigger';

export const CONTROL_LAYER = 'control';

export const LAMP_LAYER = 'lamp';

export const NODE_LAYER = 'node';

export const NURSE_LAYER = 'nurse';

export const SENIOR_LAYER = 'senior';

export const TARGET_LAYER = 'target';

export const SUPPORTER_LAYER = 'supporter';

export const USER_LAYER = 'user';

export const BASE_MAP_URL = `${window.location.protocol}://${
  window.location.hostname !== 'localhost'
    ? window.location.hostname
    : 'map.reliablesense.cn'
}/geoserver`;

export const BASE_API_URL = `http://${
  window.location.hostname !== 'localhost'
    ? window.location.hostname
    : '101.200.36.227'
}:9000/api`;
