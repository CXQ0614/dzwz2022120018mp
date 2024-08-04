<template>
  <!-- 个人中心-->
  <view class="uni-content">
    <!-- <u-navbar title=" " bgColor="transparent" :fixed="true" :safeAreaInsetTop="true" :placeholder="true">
			<view class="u-nav-slot" slot="left"><view class="banner-title">个人中心</view></view>
		</u-navbar> -->
    <u-navbar
      title="个人中心"
      :leftIconColor="titleColor"
      :titleStyle="'color: ' + titleColor + ';'"
      :bgColor="color"
      :fixed="true"
      :safeAreaInsetTop="true"
      :placeholder="true"
    ></u-navbar>
    <image
      :src="`${staticHost}/images/center/balance-bg.png`"
      class="banner"
    ></image>
    <view class="center">
      <view class="center-box">
        <view class="center-head"
          ><image
            :src="`${host}` + model.img_url"
            mode="aspectFill"
            class="center-heads"
          ></image
        ></view>
        <view class="center-top">
          <view class="center-name">{{ model.main_title }}</view>
          <image
            :src="`${staticHost}/images/consultant/man.png`"
            v-if="model.sex_id == 1"
            class="center-sex"
          ></image>
          <image
            :src="`${staticHost}/images/consultant/woman.png`"
            v-if="model.sex_id == 0"
            class="center-sex"
          ></image>
        </view>
        <view class="center-text">{{ model.subtitle }}</view>
        <navigator
          hover-class="none"
          url="/pages/consultant/calendar"
          class="center-edit"
        >
          <image
            :src="`${staticHost}/images/consultant/edit.png`"
            class="edit-icon"
          ></image>
          <view class="edit-title">编辑排班日历</view>
        </navigator>
        <view class="btn-box">
          <view class="btn" @click="exchangeShow = true">开启订阅提醒</view>
          <navigator
            :url="'/pages/webview/index?userType=CONSULTANT'"
            open-type="redirect"
            hover-class="none"
            class="btn"
            >关注公众号</navigator
          >
        </view>
      </view>
      <view class="center-detail">
        <view class="center-content">
          <view class="center-content-left">
            <view class="center-content-line"></view>
            <view class="center-content-title">我的订单</view>
          </view>
          <navigator
            hover-class="none"
            url="/pages/consultant/list"
            class="center-content-right"
          >
            <view class="center-content-date">更多</view>
            <image
              :src="`${staticHost}/images/home/arrow.png`"
              class="center-content-arrow"
            ></image>
          </navigator>
        </view>
        <view class="center-group">
          <navigator
            hover-class="none"
            :url="'/pages/consultant/detail?id=' + item.order_id"
            class="center-item"
            v-for="(item, index) in list"
            :key="index"
          >
            <view class="center-item-state" v-if="item.order_state == 10"
              >订单完成</view
            >
            <view class="center-item-state red" v-if="item.order_state == 20"
              >订单取消</view
            >
            <view class="center-item-state orange" v-if="item.order_state == 5"
              >待服务</view
            >
            <view class="center-item-top">
              <image
                :src="`${host}` + item.infoModel.head_sculpture"
                class="center-item-head"
              ></image>
              <view class="center-item-right">
                <view class="center-right-top">
                  <view class="center-item-name">{{
                    item.infoModel.name
                  }}</view>
                  <view class="center-item-text">
                    <text v-if="item.infoModel.sex_id == 1">男</text>
                    <text v-if="item.infoModel.sex_id == 0">女</text>
                    丨{{ item.infoModel.age }}岁
                  </view>
                </view>
                <view class="center-right-bottom">
                  <view
                    class="center-right-tip"
                    v-if="
                      item.infoModel.emotionState &&
                      item.infoModel.emotionState != ''
                    "
                    >{{ item.infoModel.emotionState }}</view
                  >
                  <view
                    class="center-right-tip"
                    v-for="(items, indexs) in item.infoModel.plagueList"
                    :key="indexs"
                    >{{ items }}</view
                  >
                </view>
              </view>
            </view>
            <view class="center-item-bottom">
              <image
                :src="`${staticHost}/images/consultant/time.png`"
                class="center-item-time"
              ></image>
              <view class="center-time-text">
                预约咨询时间：
                <text
                  >{{ item.recentlyDate }} {{ item.startTime }}-{{
                    item.endTime
                  }}</text
                >
              </view>
            </view>
          </navigator>
        </view>
      </view>
    </view>
    <!-- 订单弹窗 -->
    <view class="apply-modal">
      <u-popup
        :show="showApply"
        @close="closeApply"
        mode="center"
        round="10"
        :closeOnClickOverlay="true"
        overlayOpacity="0.7"
        bgColor="transparent"
      >
        <view class="scan">
          <image
            :src="`${staticHost}/images/shared/login-close.png`"
            @click="closeApply"
            class="close"
          ></image>
          <view class="scan-title">您有24小时内的咨询订单，</view>
          <view class="scan-title">请注意咨询时间</view>
        </view>
      </u-popup>
    </view>

    <!-- 公众号 -->
    <exchange
      :show="exchangeShow"
      :follow="true"
      :userType="'CONSULTANT'"
      v-on:closeExchange="closeExchange"
    ></exchange>
  </view>
</template>

<script>
import { setTimeout } from 'timers'
import { publicMixin } from '../../mixin/public.js'
import { baseUrl } from '../../utils/request'
export default {
  mixins: [publicMixin],
  data() {
    return {
      color: 'transparent', // 导航栏的背景颜色
      titleColor: '#fff', // 标题和箭头颜色
      page: 1,
      pageSize: 10,
      flag: true, // 是否加载
      list: [],
      model: {}, // 咨询师信息

      stateList: [], // 婚姻状态参数
      plagueList: [], // 困扰

      showApply: false, //订单弹窗
      exchangeShow: false, //公众号弹窗

      baseUrl:'',
    }
  },
  onLoad() {
    this.baseUrl= baseUrl
    // 信息参数
    this.postOrderMoreConditions()
    //咨询师端咨询师详情
    this.postConsultanLogoApiUserInfo()
    var callPermissions = uni.getStorageSync('callPermissions') //摄像头、麦克风权限
    console.log('callPermissions', callPermissions)

    if (!callPermissions) {
      uni.showModal({
        title: '提示',
        content: '与客户通话需要授权摄像头、麦克风权限，是否同意',
        success: function (res) {
          if (res.confirm) {
            wx.setEnable1v1Chat({
              enable: true,
              success: (res) => {
                console.log(res, 'res')
                uni.setStorageSync('callPermissions', true)
              },
              fail: (err) => {
                console.log('err', err)
              }
            })
          }
        }
      })
    }
  },
  methods: {
    closeApply() {
      this.showApply = false
    },
    closeExchange(e) {
      this.exchangeShow = e
    },
    // 咨询师端咨询师详情
    postConsultanLogoApiUserInfo() {
      let params = {
        Token: uni.getStorageSync('consultantToken')
      }
      this.$api.consultant.postConsultanLogoApiUserInfo(params).then((res) => {
        if (res.errcode == 0) {
          this.model = res.model
          uni.setStorageSync('consultant_id', res.model.consultant_id)
          if (res.count > 0) {
            this.showApply = true
          }
        }
      })
    },
    // 信息参数
    postOrderMoreConditions() {
      let params = {
        association_type: 1
      }
      this.$api.order.postOrderMoreConditions(params).then((res) => {
        if (res.errcode == 0) {
          this.stateList = res.stateList
          this.plagueList = res.plagueList
          // 我的订单列表
          this.postConsultanOrderApiList()
        }
      })
    },
    // 我的订单列表
    postConsultanOrderApiList() {
      var that = this
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        Token: uni.getStorageSync('consultantToken')
      }
      this.$api.consultant.postConsultanOrderApiList(params).then((res) => {
        if (res.errcode == 0) {
          if (res.list.length > 0) {
            let lists = res.list

            lists.forEach((item, index) => {
              // 情感状态
              for (let key in this.stateList) {
                if (
                  item.infoModel.emotional_state == this.stateList[key].value
                ) {
                  item.infoModel.emotionState = this.stateList[key].label
                }
              }
              // 困扰
              var newkrList = []
              for (let key in this.plagueList) {
                if (item.infoModel.main_troubles_id) {
                  var krList = item.infoModel.main_troubles_id.split(',')
                  for (var i = 0; i < krList.length; i++) {
                    if (krList[i] == this.plagueList[key].value) {
                      newkrList.push(this.plagueList[key].label)
                    }
                  }
                }
              }
              item.infoModel.plagueList = newkrList
            })

            // 合并数组
            let newList = this.list.concat(lists)
            this.list = newList
            console.log(this.list)
            // 如果当前的列表总数等于接口返回的列表总数 则加载完成
            if (this.list.length == res.total) {
              this.flag = false
            }
          } else if (res.list.length == 0) {
            this.flag = false
          }
        }
      })
    }
  },
  computed: {},
  //控制导航栏背景颜色
  onPageScroll: function (e) {
    if (e.scrollTop > 50) {
      this.color = '#ffffff'
      this.titleColor = '#000'
    } else {
      this.color = 'transparent'
      this.titleColor = '#fff'
    }
  },
  onReachBottom() {
    this.page++

    if (this.flag) {
      // 我的订单接口
      this.postConsultanOrderApiList()
    }
  }
}
</script>

<style lang="less">
@import './center.less';
</style>
