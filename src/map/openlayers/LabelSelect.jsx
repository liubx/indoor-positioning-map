/* global android */
/* eslint no-undef: "error" */
import React, { Component } from 'react';
import { of, fromEvent } from 'rxjs';
import { tap, filter, flatMap, map } from 'rxjs/operators';
import Overlay from 'ol/Overlay';
import Style from 'ol/style/Style';
import PropTypes from 'prop-types';
import {
  LAMP_LAYER,
  NODE_LAYER,
  NURSE_LAYER,
  SENIOR_LAYER,
  SUPPORTER_LAYER,
  TARGET_LAYER,
  USER_LAYER
} from '../constant';
import supporterAvatar from '../assets/img/supporter_avatar.png';
import userAvatar from '../assets/img/user_avatar.png';

class OlLabelSelectLayer extends Component {
  constructor(props) {
    super(props);
    this.feature = null;
  }

  componentDidMount() {
    this.layer = new Overlay({
      element: this.ref,
      positioning: 'bottom-center',
      offset: [0, -10]
    });
    this.context.map.addOverlay(this.layer);

    fromEvent(this.context.map, 'singleclick')
      .pipe(
        filter((e) => !e.dragging),
        map((e) => this.context.map.getEventPixel(e.originalEvent)),
        map((pixel) =>
          this.context.map.forEachFeatureAtPixel(pixel, (feature) => feature)
        ),
        filter((feature) => feature && feature),
        tap((feature) => {
          if (
            typeof android !== 'undefined' &&
            typeof android.clickFeature !== 'undefined'
          ) {
            android.clickFeature(
              feature && feature.data ? JSON.stringify(feature.data) : ''
            );
          }
        }),
        tap((feature) => {
          if (this.props.onFeatureClick(feature.data)) {
            this.loadSelect(feature.data);
          }
        })
      )
      .subscribe();
    this.loadSelect(this.props.select);
  }

  shouldComponentUpdate(newProps) {
    return (
      newProps.select !== this.props.select ||
      (newProps !== null && this.props.select !== null)
    );
  }

  componentWillUpdate(newProps) {
    this.loadSelect(newProps.select);
  }

  loadSelect(select) {
    of(select)
      .pipe(
        tap(() => {
          if (this.feature) {
            this.unselectFeature(this.feature);
            this.layer.setPosition(undefined);
          }
        }),
        filter((select) => select !== null && select !== undefined),
        map(() => this.context.map.getLayers().getArray()),
        flatMap((data) => data),
        filter((data) => data.getType() === 'VECTOR'),
        flatMap((data) => data.getSource().getFeatures()),
        filter((feature) => feature.data),
        filter((feature) =>
          Object.keys(feature.data)
            .filter((key) => key !== 'type')
            .every(
              (key) =>
                JSON.stringify(feature.data[key]) ===
                JSON.stringify(select[key])
            )
        ),
        tap((feature) => {
          this.showPopup(feature);
          this.context.map.getView().animate({
            center: feature.getGeometry().getCoordinates(),
            duration: 800
          });
        })
      )
      .subscribe();
  }

  selectFeature = (feature) => {
    if (feature) {
      const image = feature.getStyle()[0].getImage();
      switch (feature.data.type) {
        case LAMP_LAYER:
        case SENIOR_LAYER:
        case NURSE_LAYER:
        case USER_LAYER:
        case SUPPORTER_LAYER:
          image.setScale(0.5);
          feature.setStyle([
            new Style({
              image
            })
          ]);
          break;
        default:
          break;
      }
    }
  };

  unselectFeature = (feature) => {
    if (feature) {
      const image = feature.getStyle()[0].getImage();
      switch (feature.data.type) {
        case LAMP_LAYER:
        case SENIOR_LAYER:
        case NURSE_LAYER:
        case USER_LAYER:
        case SUPPORTER_LAYER:
          image.setScale(0.4);
          feature.setStyle([
            new Style({
              image
            })
          ]);
          break;
        default:
          break;
      }
    }
  };

  showPopup = (feature) => {
    this.unselectFeature(this.feature);
    if (feature && feature.data) {
      switch (feature.data.type) {
        case NODE_LAYER:
          this.selectFeature(feature);
          this.feature = feature;
          this.showNodePopup(feature.data);
          break;
        case TARGET_LAYER:
          this.selectFeature(feature);
          this.feature = feature;
          this.showTargetPopup(feature.data);
          break;
        case LAMP_LAYER:
          this.selectFeature(feature);
          this.feature = feature;
          this.showLampPopup(feature.data);
          break;
        case SENIOR_LAYER:
          this.selectFeature(feature);
          this.feature = feature;
          this.showSeniorPopup(feature.data);
          break;
        case NURSE_LAYER:
          this.selectFeature(feature);
          this.feature = feature;
          this.showNursePopup(feature.data);
          break;
        case USER_LAYER:
          this.selectFeature(feature);
          this.feature = feature;
          this.showUserPopup(feature.data);
          break;
        case SUPPORTER_LAYER:
          this.selectFeature(feature);
          this.feature = feature;
          this.showSupporterPopup(feature.data);
          break;
        default:
          this.feature = null;
          break;
      }
    } else {
      this.layer.setPosition(undefined);
      this.feature = null;
    }
  };

  showNodePopup = (data) => {
    this.ref.innerHTML = `<div class='ol-popup'><span style='display:block;'><strong>蓝牙节点信息</strong></span><span style='display:block;'>地址:${
      data.mac_address
    }</span><span style='display:block;'>经度:${data.longitude.toFixed(
      5
    )}</span><span style='display:block;'>纬度:${data.latitude.toFixed(
      5
    )}</span></div>`;
    this.layer.setPosition([data.longitude, data.latitude]);
  };

  showTargetPopup = (data) => {
    const status = this.getPopupStatus(data.updateTime);
    this.ref.innerHTML = `<div class='ol-popup'><span style='display:block;'><strong>目标信息</strong>${status}</span><span style='display:block;'>经度:${data.longitude.toFixed(
      5
    )}</span><span style='display:block;'>纬度:${data.latitude.toFixed(
      5
    )}</span></div>`;
    this.layer.setPosition([data.longitude, data.latitude]);
  };

  showLampPopup = (data) => {
    this.ref.innerHTML = `<div class='ol-popup'><span style='display:block;'><strong>定位灯信息</strong></span><span style='display:block;'>经度:${data.longitude.toFixed(
      5
    )}</span><span style='display:block;'>纬度:${data.latitude.toFixed(
      5
    )}</span></div>`;
    this.layer.setPosition([data.longitude, data.latitude]);
  };

  showSeniorPopup = (data) => {
    const btn =
      typeof android !== 'undefined' &&
      typeof android.showSenior !== 'undefined'
        ? `<span class='detail-btn' onclick={android.showSenior(${
            data.id
          })}>查看详情</span>`
        : '';
    const status = this.getPopupStatus(data.updateTime);
    this.ref.innerHTML = `<div class='ol-popup'><span style='display:block;'><strong>老人信息</strong>${status}</span><span style='display:block;'>电话: xxxxxxx</span><br/><span style='display:block;'>位置: xxxxxxx</span><span style='display:block;'>其他: xxxxxxx</span>${btn}</div>`;
    this.layer.setPosition([data.tag.longitude, data.tag.latitude]);
  };

  showNursePopup = (data) => {
    const btn =
      typeof android !== 'undefined' && typeof android.showNurse !== 'undefined'
        ? `<span class='detail-btn' onclick={android.showNurse(${
            data.id
          })}>查看详情</span>`
        : '';
    const status = this.getPopupStatus(data.updateTime);
    this.ref.innerHTML = `<div class='ol-popup'><span style='display:block;'><strong>护士信息</strong>${status}<span style='display:block;'>电话: xxxxxxx</span><br/><span style='display:block;'>位置: xxxxxxx</span><span style='display:block;'>其他: xxxxxxx</span>${btn}</div>`;
    this.layer.setPosition([data.tag.longitude, data.tag.latitude]);
  };

  /**
   * 显示用户信息的弹窗模板
   * @param data
   */
  showUserPopup = (data) => {
    const btn =
      typeof android !== 'undefined' && typeof android.showUser !== 'undefined'
        ? `<span class='detail-btn' onclick={android.showUser(${
            data.id
          })}>查看详情</span>`
        : '';
    const status = this.getPopupStatus(data.updateTime);
    this.ref.innerHTML = `<div class='ol-popup-shadow'><div><img src="${userAvatar}"/><span class='title'><strong>${
      data.name
    }</strong>${status}</span></div><div class='subtitle'>${
      data.company.name
    }</div><span class='subsubtitle'>${data.id}</span>${btn}</div>`;
    this.layer.setPosition([data.longitude, data.latitude]);
  };

  /**
   * 显示运维人员信息的弹窗模板
   * @param data
   */
  showSupporterPopup = (data) => {
    const btn =
      typeof android !== 'undefined' && typeof android.showUser !== 'undefined'
        ? `<span class='detail-btn' onclick={android.showUser(${
            data.id
          })}>查看详情</span>`
        : '';
    const status = this.getPopupStatus(data.updateTime);
    this.ref.innerHTML = `<div class='ol-popup-shadow'><div><img src="${supporterAvatar}"/><span class='title'><strong>${
      data.name
    }</strong>${status}</span></div><div class='subtitle'>${
      data.company ? data.company.name : ''
    }</div><span class='subsubtitle'>用户ID: ${data.id}</span>${btn}</div>`;
    this.layer.setPosition([data.longitude, data.latitude]);
  };

  getPopupStatus = (time) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(time).getTime()) / 1000
    );
    if (seconds > 0 && seconds < 5) {
      return '<span class="dot-green"></span>';
    } else if (seconds < 300) {
      return '<span class="dot-orange"></span>';
    } else if (seconds < 1800) {
      return '<span class="dot-red"></span>';
    } else if (seconds < 3600) {
      return '<span class="dot-grey"></span>';
    } else {
      return '';
    }
  };

  render() {
    return <div ref={(el) => (this.ref = el)} />;
  }
}

OlLabelSelectLayer.defaultProps = {
  select: null,
  onFeatureClick: () => true
};

OlLabelSelectLayer.propTypes = {
  select: PropTypes.object,
  onFeatureClick: PropTypes.func
};

OlLabelSelectLayer.contextTypes = {
  map: PropTypes.object
};

export default OlLabelSelectLayer;
