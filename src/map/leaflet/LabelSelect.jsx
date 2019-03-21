/* global android */
/* eslint no-undef: "error" */
import { Component } from 'react';
import { from } from 'rxjs';
import { tap, filter } from 'rxjs/operators';
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
import popup from '../assets/img/popup.png';

class LlLabelSelectLayer extends Component {
  constructor(props) {
    super(props);
    this.feature = null;
    this.layers = [];
  }

  componentDidMount() {
    this.context.map.eachLayer((layer) => {
      this.layers.push(layer);
    });
    this.initPopup();
  }

  componentWillUpdate(newProps) {
    if (newProps.update !== this.props.update) {
      this.initPopup();
    }
  }

  initPopup = () => {
    this.layers = [];
    this.context.map.eachLayer((layer) => {
      this.layers.push(layer);
    });
    from(this.layers)
      .pipe(
        filter((layer) => layer.data !== undefined),
        tap((layer) => {
          switch (layer.data.type) {
            case NODE_LAYER:
              layer.bindPopup(this.showNodePopup(layer.data), {
                closeButton: false
              });
              break;
            case TARGET_LAYER:
              layer.bindPopup(this.showTargetPopup(layer.data), {
                closeButton: false
              });
              break;
            case LAMP_LAYER:
              layer.bindPopup(this.showLampPopup(layer.data), {
                closeButton: false
              });
              break;
            case SENIOR_LAYER:
              layer.bindPopup(this.showSeniorPopup(layer.data), {
                closeButton: false
              });
              break;
            case NURSE_LAYER:
              layer.bindPopup(this.showNursePopup(layer.data), {
                closeButton: false
              });
              break;
            case USER_LAYER:
              layer.bindPopup(this.showUserPopup(layer.data), {
                closeButton: false
              });
              break;
            case SUPPORTER_LAYER:
              layer.bindPopup(this.showSupporterPopup(layer.data), {
                closeButton: false
              });
              break;
            default:
              break;
          }
        })
      )
      .subscribe();
  };

  showNodePopup = (data) =>
    `<div class='popup' style='margin-left:50px;margin-bottom:-10px;background:url(${popup}) no-repeat'><span style='display:block;'><strong>蓝牙节点信息</strong></span><span style='display:block;'>地址:${
      data.mac_address ? data.mac_address : ''
    }</span><span style='display:block;'>经度:${data.longitude.toFixed(
      5
    )}</span><span style='display:block;'>纬度:${data.latitude.toFixed(
      5
    )}</span></div>`;

  showTargetPopup = (data) =>
    `<div class='popup' style='margin-left:50px;margin-bottom:-10px;background:url(${popup}) no-repeat'><span style='display:block;'><strong>目标信息</strong></span><span style='display:block;'>经度:${data.longitude.toFixed(
      5
    )}</span><span style='display:block;'>纬度:${data.latitude.toFixed(
      5
    )}</span></div>`;

  showLampPopup = (data) =>
    `<div class='popup' style='margin-left:50px;margin-bottom:-10px;background:url(${popup}) no-repeat'><span style='display:block;'><strong>定位灯信息</strong></span><span style='display:block;'>经度:${data.longitude.toFixed(
      5
    )}</span><span style='display:block;'>纬度:${data.latitude.toFixed(
      5
    )}</span></div>`;

  showSeniorPopup = (data) => {
    const btn =
      typeof android !== 'undefined' &&
      typeof android.showSenior !== 'undefined'
        ? `<span class='detail-btn' onclick={android.showSenior(${
            data.id
          })}>查看详情</span>`
        : '';
    return `<div class='popup' style='margin-left:50px;margin-bottom:-10px;background:url(${popup}) no-repeat'><span style='display:block;'><strong>老人信息</strong>${status}</span><span style='display:block;'>电话: xxxxxxx</span><br/><span style='display:block;'>位置: xxxxxxx</span><span style='display:block;'>其他: xxxxxxx</span>${btn}</div>`;
  };

  showNursePopup = (data) => {
    const btn =
      typeof android !== 'undefined' && typeof android.showNurse !== 'undefined'
        ? `<span class='detail-btn' onclick={android.showNurse(${
            data.id
          })}>查看详情</span>`
        : '';
    return `<div class='popup' style='margin-left:50px;margin-bottom:-10px;background:url(${popup}) no-repeat'><span style='display:block;'><strong>护士信息</strong>${status}<span style='display:block;'>电话: xxxxxxx</span><br/><span style='display:block;'>位置: xxxxxxx</span><span style='display:block;'>其他: xxxxxxx</span>${btn}</div>`;
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
    return `<div class='popup' style='margin-left:50px;margin-bottom:-10px;background:url(${popup}) no-repeat'><div><img src="${userAvatar}"/><span class='title'><strong>${
      data.name ? data.name : ''
    }</strong>${status}</span></div><div class='subtitle'>${
      data.company && data.company.name ? data.company.name : ''
    }</div><span class='subsubtitle'>${
      data.id ? data.id : ''
    }</span>${btn}</div>`;
  };

  /**
   * 显示运维人员信息的弹窗模板
   * @param data
   */
  showSupporterPopup = (data) => {
    const btn =
      typeof android !== 'undefined' &&
      typeof android.showSupporter !== 'undefined'
        ? `<span class='detail-btn' onclick={android.showSupporter(${
            data.id
          })}>查看详情</span>`
        : '';
    const status = this.getPopupStatus(data.updateTime);
    return `<div class='popup' style='margin-left:50px;background:url(${popup}) no-repeat'><div><img src="${supporterAvatar}"/><span class='title'><strong>${
      data.name
    }</strong>${status}</span></div><div class='subtitle'>${
      data.company && data.company.name ? data.company.name : ''
    }</div><span class='subsubtitle'>用户ID: ${data.id}</span>${btn}</div>`;
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
    return null;
  }
}

LlLabelSelectLayer.defaultProps = {
  update: false,
  select: null,
  onFeatureClick: () => true
};

LlLabelSelectLayer.propTypes = {
  update: PropTypes.bool,
  select: PropTypes.object,
  onFeatureClick: PropTypes.func
};

LlLabelSelectLayer.contextTypes = {
  map: PropTypes.object
};

export default LlLabelSelectLayer;
