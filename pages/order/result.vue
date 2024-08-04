<template>
  <!-- 订单详情-->
  <view class="uni-content">
    <image
      :src="`${staticHost}/images/shared/banner.png`"
      class="banner"
    ></image>
    <view class="detail">
      <u-navbar
        :title="title"
        :bgColor="color"
        :fixed="true"
        :safeAreaInsetTop="true"
        :placeholder="true"
      ></u-navbar>
      <view class="detail-box">
        <image
          :src="`${staticHost}/images/order/sucess.png`"
          class="sucess-icon"
        ></image>
        <div class="state">支付成功</div>
        <div class="tip">如有任何问题，可随时联系在线客服~</div>
        <view class="btns">
          <navigator
            url="/pages/home/index"
            hover-class="none"
            open-type="redirect"
            class="btn"
            >返回首页</navigator
          >
          <!-- 咨询师订单 -->
          <navigator
            :url="'/pages/order/consultDetail?id=' + id"
            v-if="type == 1"
            open-type="redirect"
            hover-class="none"
            class="btn pay"
            >查看订单</navigator
          >
          <!-- 课程订单 -->
          <navigator
            :url="'/pages/order/courseDetail?id=' + id"
            v-if="type == 2"
            open-type="redirect"
            hover-class="none"
            class="btn pay"
            >查看订单</navigator
          >
          <!-- 测评订单 -->
          <navigator
            :url="'/pages/order/testDetail?id=' + id"
            v-if="type == 3"
            open-type="redirect"
            hover-class="none"
            class="btn pay"
            >查看订单</navigator
          >
          <view class="btn green" @click="exchangeShow = true" v-if="type == 1"
            >开启订阅提醒</view
          >
          <navigator
            :url="'/pages/webview/index?urls=' + id"
            v-if="type == 1"
            open-type="redirect"
            hover-class="none"
            class="btn green"
            >关注公众号</navigator
          >
        </view>
      </view>
      <!-- 心理课程有 -->
      <view class="scan" v-if="type == 2">
        <view class="scan-title">扫码添加课程班主任</view>
        <view class="scan-blue-title">兑换已购课程并领取相关福利</view>
        <image :src="`${staticHost}/images/shared/qr.png`" class="qr"></image>
      </view>
      <!-- 心理测评有 -->
      <view class="scan" v-if="type == 3">
        <view class="scan-title">扫码添加客服微信</view>
        <view class="scan-blue-title">了解更多心理测评信息</view>
        <image :src="`${staticHost}/images/shared/qr.png`" class="qr"></image>
      </view>
    </view>
    <!-- 授权弹窗 -->
    <diy-authorize
      ref="authorize"
      v-on:closeMain="closeMain"
      :show="authoShow"
    ></diy-authorize>

    <!-- 公众号 -->
    <exchange
      :show="exchangeShow"
      :userType="'MEMBER'"
      :follow="true"
      v-on:closeExchange="closeExchange"
    ></exchange>
  </view>
</template>

<script>
import { publicMixin } from '../../mixin/public.js'
export default {
  mixins: [publicMixin],
  data() {
    return {
      id: '', // 订单id
      type: '', // 订单类型  1咨询 2课程 3测评
      authoShow: false, // 授权弹窗显示
      title: '咨询师预约',
      color: 'transparent', // 导航栏的背景颜色
      exchangeShow: false // 公众号弹窗
    }
  },
  onLoad(option) {
    if (option.id) {
      this.id = option.id
    }
    if (option.type) {
      this.type = option.type
      if (option.type == 1) {
        this.title = '咨询师预约'
      } else if (option.type == 2) {
        this.title = '课程购买'
      } else if (option.type == 3) {
        this.title = '测评购买'
      }
    }
  },
  methods: {
    // 子组件向父组件传值
    closeMain(e) {
      this.authoShow = e
    },
    closeExchange(e) {
      this.exchangeShow = e
    }
  },
  computed: {},
  //控制导航栏背景颜色
  onPageScroll: function (e) {
    if (e.scrollTop > 50) {
      this.color = '#ffffff'
    } else {
      this.color = 'transparent'
    }
  }
}
</script>

<style lang="less">
@import './result.less';
</style>
