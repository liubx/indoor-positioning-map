import React from 'react';
import PropTypes from 'prop-types';
import {
  CONTROL_LAYER,
  EVENT_LAYER,
  INDOOR_LAYER,
  LAMP_LAYER,
  NODE_LAYER,
  NURSE_LAYER,
  POI_LAYER,
  LABEL_SELECT_LAYER,
  POSITION_LAYER,
  ROUTE_LAYER,
  SENIOR_LAYER,
  SUPPORTER_LAYER,
  TARGET_LAYER,
  TRIGGER_LAYER,
  USER_LAYER
} from '../constant';
import LlMapLayer from './Map';
import LlIndoorLayer from './Indoor';
import LlPoiLayer from './Poi';
import {
  createLampLabel,
  createNodeLabel,
  createNurseLabel,
  createSeniorLabel,
  createSupporterLabel,
  createTargetLabel,
  createUserLabel
} from './util';
import LlLabelLayer from './Label';
import LlPositionLayer from './Position';
import LlEventLayer from './Event';
import LlRouteLayer from './Route';
import LlControlLayer from './Control';
import LlTriggerLayer from './Trigger';
import LlLabelSelect from './LabelSelect';
import 'leaflet/dist/leaflet.css';

const Leaflet = (props) => (
  <LlMapLayer>
    <LlIndoorLayer map={props.map} key={INDOOR_LAYER} />
    {props.showPoi ? <LlPoiLayer map={props.map} key={POI_LAYER} /> : null}
    <LlLabelLayer
      data={props.lamps.filter((data) => data.floor === props.map.floor)}
      key={LAMP_LAYER}
      createLabel={createLampLabel}
    />
    <LlLabelLayer
      data={props.nodes.filter((data) => data.floor === props.map.floor)}
      key={NODE_LAYER}
      createLabel={createNodeLabel}
    />
    <LlLabelLayer
      data={props.targets.filter((data) => data.floor === props.map.floor)}
      key={TARGET_LAYER}
      createLabel={createTargetLabel}
    />
    <LlLabelLayer
      data={props.nurses.filter((data) => data.tag.floor === props.map.floor)}
      key={NURSE_LAYER}
      createLabel={createNurseLabel}
    />
    <LlLabelLayer
      data={props.seniors.filter((data) => data.tag.floor === props.map.floor)}
      key={SENIOR_LAYER}
      createLabel={createSeniorLabel}
    />
    <LlLabelLayer
      data={props.supporters.filter((data) => data.floor === props.map.floor)}
      key={SUPPORTER_LAYER}
      createLabel={createSupporterLabel}
    />
    <LlLabelLayer
      data={props.users.filter((data) => data.floor === props.map.floor)}
      key={USER_LAYER}
      createLabel={createUserLabel}
    />
    <LlPositionLayer
      position={
        props.position && props.position.floor === props.map.floor
          ? props.position
          : null
      }
      key={POSITION_LAYER}
    />
    <LlLabelSelect key={LABEL_SELECT_LAYER} />
    <LlRouteLayer routes={props.routes} map={props.map} key={ROUTE_LAYER} />
    <LlEventLayer key={EVENT_LAYER} />
    <LlControlLayer
      position={props.position}
      map={props.map}
      key={CONTROL_LAYER}
    />
    <LlTriggerLayer
      position={props.position}
      map={props.map}
      key={TRIGGER_LAYER}
    />
  </LlMapLayer>
);

Leaflet.defaultProps = {
  map: null,
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
  select: null
};

Leaflet.propTypes = {
  map: PropTypes.object,
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
  select: PropTypes.object
};

export default Leaflet;
