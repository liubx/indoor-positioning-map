import React from 'react';
import PropTypes from 'prop-types';
import 'ol/ol.css';
import OlPoiLayer from './Poi';
import OlLabelLayer from './Label';
import OlRouteLayer from './Route';
import OlPositionLayer from './Position';
import OlLabelSelect from './LabelSelect';
import OlEventLayer from './Event';
import OlTriggerLayer from './Trigger';
import OlControlLayer from './Control';
import OlMapLayer from './Map';
import OlIndoorLayer from './Indoor';

import {
  createLampLabel,
  createNodeLabel,
  createNurseLabel,
  createSeniorLabel,
  createSupporterLabel,
  createTargetLabel,
  createUserLabel
} from './util';
import {
  CONTROL_LAYER,
  EVENT_LAYER,
  HEAT_MAP_LAYER,
  HISTORY_LAYER,
  INDOOR_LAYER,
  LABEL_SELECT_LAYER,
  LAMP_LAYER,
  NODE_LAYER,
  NURSE_LAYER,
  POI_LAYER,
  POSITION_LAYER,
  ROUTE_LAYER,
  SENIOR_LAYER,
  SUPPORTER_LAYER,
  TARGET_LAYER,
  TRIGGER_LAYER,
  USER_LAYER
} from '../constant';
import OlHeatmapLayer from './Heatmap';
import OlHistoryLayer from './History';

const Openlayers = (props) => (
  <OlMapLayer maxZoom={props.maxZoom} minZoom={props.minZoom} zoom={props.zoom}>
    <OlIndoorLayer map={props.map} key={INDOOR_LAYER} />
    {props.showPoi ? <OlPoiLayer map={props.map} key={POI_LAYER} /> : null}
    <OlLabelLayer
      data={props.lamps.filter(
        (data) =>
          !props.map ||
          (props.map && props.map.floor && data.floor === props.map.floor)
      )}
      key={LAMP_LAYER}
      createLabel={createLampLabel}
    />
    <OlLabelLayer
      data={props.nodes.filter(
        (data) =>
          !props.map ||
          (props.map && props.map.floor && data.floor === props.map.floor)
      )}
      key={NODE_LAYER}
      createLabel={createNodeLabel}
    />
    <OlLabelLayer
      data={props.targets.filter(
        (data) =>
          !props.map ||
          (props.map && props.map.floor && data.floor === props.map.floor)
      )}
      key={TARGET_LAYER}
      createLabel={createTargetLabel}
    />
    <OlLabelLayer
      data={props.nurses.filter(
        (data) =>
          !props.map ||
          (props.map && props.map.floor && data.tag.floor === props.map.floor)
      )}
      key={NURSE_LAYER}
      createLabel={createNurseLabel}
    />
    <OlLabelLayer
      data={props.seniors.filter(
        (data) =>
          !props.map ||
          (props.map && props.map.floor && data.tag.floor === props.map.floor)
      )}
      key={SENIOR_LAYER}
      createLabel={createSeniorLabel}
    />
    <OlLabelLayer
      data={props.supporters.filter(
        (data) =>
          !props.map ||
          (props.map && props.map.floor && data.floor === props.map.floor)
      )}
      key={SUPPORTER_LAYER}
      createLabel={createSupporterLabel}
    />
    <OlLabelLayer
      data={props.users.filter(
        (data) =>
          !props.map ||
          (props.map && props.map.floor && data.floor === props.map.floor)
      )}
      key={USER_LAYER}
      createLabel={createUserLabel}
    />
    <OlRouteLayer routes={props.routes} map={props.map} key={ROUTE_LAYER} />
    <OlPositionLayer
      position={
        !props.map ||
        (props.map &&
          props.map.floor &&
          props.position &&
          props.position.floor === props.map.floor)
          ? props.position
          : null
      }
      key={POSITION_LAYER}
    />
    <OlLabelSelect
      key={LABEL_SELECT_LAYER}
      onFeatureClick={props.onFeatureClick}
      select={
        props.select && props.select.floor === props.map.floor
          ? props.select
          : null
      }
    />
    <OlEventLayer
      key={EVENT_LAYER}
      onSingleClick={props.onSingleClick}
      onDoubleClick={props.onDoubleClick}
    />
    <OlTriggerLayer
      position={props.position}
      map={props.map}
      key={TRIGGER_LAYER}
    />
    <OlHeatmapLayer heatmap={props.heatmap} key={HEAT_MAP_LAYER} />
    <OlHistoryLayer history={props.history} key={HISTORY_LAYER} />
    <OlControlLayer
      position={props.position}
      map={props.map}
      key={CONTROL_LAYER}
    />
  </OlMapLayer>
);

Openlayers.defaultProps = {
  map: null,
  heatmap: null,
  history: null,
  showPoi: true,
  routes: null,
  position: null,
  lamps: [],
  nodes: [],
  targets: [],
  nurses: [],
  seniors: [],
  supporters: [],
  users: [],
  select: null,
  zoom: 21,
  maxZoom: 24,
  minZoom: 18,
  onFeatureClick: () => true,
  onSingleClick: () => false,
  onDoubleClick: () => false
};

Openlayers.propTypes = {
  map: PropTypes.object,
  heatmap: PropTypes.object,
  history: PropTypes.object,
  showPoi: PropTypes.bool,
  lamps: PropTypes.array,
  nodes: PropTypes.array,
  targets: PropTypes.array,
  nurses: PropTypes.array,
  seniors: PropTypes.array,
  supporters: PropTypes.array,
  users: PropTypes.array,
  routes: PropTypes.object,
  position: PropTypes.object,
  select: PropTypes.object,
  zoom: PropTypes.number,
  minZoom: PropTypes.number,
  maxZoom: PropTypes.number,
  onFeatureClick: PropTypes.func,
  onSingleClick: PropTypes.func,
  onDoubleClick: PropTypes.func
};

export default Openlayers;
