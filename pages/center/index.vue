<template>
  <!-- 个人中心-->
  <view class="uni-content">
    <image
      :src="`${staticHost}/images/shared/banner.png`"
      class="banner"
    ></image>
    <view class="center-page">
      <!-- 导航栏 -->
      <u-navbar
        title=" "
        :bgColor="color"
        :fixed="true"
        :safeAreaInsetTop="true"
        :placeholder="true"
      >
        <view class="u-nav-slot" slot="left">
          <view class="banner-title">个人中心</view>
        </view>
      </u-navbar>
      <view class="avater-box">
        <!-- 无头像 -->
        <view class="avater-left" v-if="!isAutho">
          <image
            :src="`${staticHost}/images/center/gray-avater.png`"
            class="avater no"
            @click="login"
          ></image>
        </view>
        <!-- 有头像 -->
        <navigator
          hover-class="none"
          url="/pages/center/info"
          class="avater-left"
          v-if="isAutho"
        >
          <image
            :src="model.head_portrait"
            class="avater"
            v-if="
              isAutho &&
              model.head_portrait ==
                'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132'
            "
          >
          </image>
          <image
            :src="`${host}` + model.head_portrait"
            class="avater"
            v-if="
              isAutho &&
              model.head_portrait !=
                'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132'
            "
          >
          </image>
          <image
            :src="`${staticHost}/images/center/edit.png`"
            class="edit"
            v-if="isAutho"
          ></image>
        </navigator>
        <!-- 未登录 -->
        <view class="avater-center" @click="login" v-if="!isAutho">
          <view class="avater-title">点击授权信息</view>
          <view class="avater-text">欢迎使用蓝鸟心理小程序～</view>
        </view>
        <!-- 已登录 -->
        <view class="avater-center" v-if="isAutho">
          <view class="avater-title" v-if="model.name">{{ model.name }}</view>
          <view
            class="avater-title"
            v-if="model.name == null || model.name == ''"
            >微信用户</view
          >
          <view class="avater-sign">
            <image
              :src="`${staticHost}/images/center/icon.png`"
              class="icon"
            ></image>
            心有归巢，翼有蓝天
          </view>
          <view class="avater-text"
            >这是我们共同飞翔的第{{ model.diffDays }}天</view
          >
        </view>
        <view class="avater-right"  @click="openExchange">
          <image
            :src="`${staticHost}/images/center/phone.png`"
            class="phone"
          ></image>
          咨询
        </view>
      </view>
      <view
        class="account"
        :style="
          'background-image: url(' + `${staticHost}` + '/images/center/bg.png);'
        "
      >
        <view class="account-left">
          <view class="account-top" @click="see = !see">
            当前账户余额(蓝鸟币)
            <image
              :src="`${staticHost}/images/center/look.png`"
              class="look"
              v-if="see"
            ></image>
            <image
              :src="`${staticHost}/images/center/close.png`"
              class="close"
              v-else
            ></image>
          </view>
          <view class="account-money" v-if="see">
            <view v-if="!isAutho">---</view>
            <view v-if="isAutho"
              >
              <!-- <span class="symbol">¥ </span
              > -->
              {{ formatPrice(model.money) }}</view
            >
          </view>
          <view class="account-money" v-else> ****** </view>
        </view>
        <view
          @click="getAuthoPage('/pages/center/balance')"
          class="account-right"
        >
          查看详情
        </view>
      </view>
      <view class="center-tab">
        <view @click="getAuthoPage('/pages/order/index')" class="tab-item">
          <image
            :src="`${staticHost}/images/center/order.png?v=1.0`"
            class="tab-icon"
          ></image>
          <view class="tab-title">我的订单</view>
        </view>
        <view @click="getAuthoPage('/pages/collect/index')" class="tab-item">
          <image
            :src="`${staticHost}/images/center/collect.png?v=1.0`"
            class="tab-icon"
          ></image>
          <view class="tab-title">我的收藏</view>
        </view>
        <view @click="getAuthoPage('/pages/token/index')" class="tab-item">
          <image
            :src="`${staticHost}/images/center/token.png?v=1.0`"
            class="tab-icon"
          ></image>
          <view class="tab-title">我的券码</view>
        </view>
      </view>
      <view class="bottom-nav">
        <navigator hover-class="none" url="/pages/center/help" class="nav-item">
          <view class="nav-left">
            <image
              :src="`${staticHost}/images/center/help.png`"
              class="item-icon"
            ></image>
            <view class="item-title">帮助中心</view>
          </view>
          <image
            :src="`${staticHost}/images/center/arrow.png`"
            class="arrow"
          ></image>
        </navigator>
        <navigator
          hover-class="none"
          url="/pages/center/feedback"
          class="nav-item"
        >
          <view class="nav-left">
            <image
              :src="`${staticHost}/images/center/advice.png`"
              class="item-icon"
            ></image>
            <view class="item-title">建议反馈</view>
          </view>
          <image
            :src="`${staticHost}/images/center/arrow.png`"
            class="arrow"
          ></image>
        </navigator>
        <view class="nav-item">
          <button open-type="share" class="button"></button>
          <view class="nav-left">
            <image
              :src="`${staticHost}/images/center/invite.png`"
              class="item-icon"
            ></image>
            <view class="item-title">邀请好友</view>
          </view>
          <image
            :src="`${staticHost}/images/center/arrow.png`"
            class="arrow"
          ></image>
        </view>
        <navigator
          hover-class="none"
          url="/pages/center/about"
          class="nav-item"
        >
          <view class="nav-left">
            <image
              :src="`${staticHost}/images/center/about.png`"
              class="item-icon"
            ></image>
            <view class="item-title">关于我们</view>
          </view>
          <image
            :src="`${staticHost}/images/center/arrow.png`"
            class="arrow"
          ></image>
        </navigator>
      </view>
      <view @click="enterConsultant" v-if="isAutho" class="login"
        >咨询师端</view
      >
      <view class="login" @click="login" v-if="!isAutho">立即登录</view>
      <view class="login" @click="logout" v-if="isAutho">退出登录</view>
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

    <!-- 授权弹窗 -->
    <diy-authorize
      ref="authorize"
      v-on:closeMain="closeMain"
      :show="authoShow"
    ></diy-authorize>
    <!-- 客服 -->
    <exchange
      :show="exchangeShow"
      v-on:closeExchange="closeExchange"
    ></exchange>
    <!-- 底部tabbar栏 -->
    <public-tabbar ref="tabbar" :current="4"></public-tabbar>
  </view>
</template>

<script>
import { publicMixin } from '../../mixin/public.js'
export default {
  mixins: [publicMixin],
  data() {
    return {
      authoShow: false, // 授权弹窗显示
      see: false,
      color: 'transparent', // 导航栏的背景颜色
      model: {},

      isAutho: false, // 是否授权
      showApply: false, // 订单弹窗
      exchangeShow: false // 客服
    }
  },
  onLoad() {
    var token = uni.getStorageSync('token') || ''
    var isExistUser = token != ''
    if (!isExistUser) {
      // 未授权
      this.isAutho = false
    } else {
      // 授权
      this.isAutho = true
    }
  },
  onShow() {
    var token = uni.getStorageSync('token') || ''
    var isExistUser = token != ''
    if (!isExistUser) {
      // 未授权
    } else {
      // 授权
      // 用户信息接口
      this.getMemberApiUserInfo()
    }
  },
  methods: {
    openExchange() {
      this.exchangeShow = true
    },
    closeExchange(e) {
      this.exchangeShow = e
    },
    closeApply() {
      this.showApply = false
    },
    // 子组件向父组件传值
    closeMain(e) {
      this.authoShow = e
    },
    // 点击进入咨询师端
    enterConsultant() {
      if (uni.getStorageSync('consultantToken')) {
        uni.navigateTo({
          url: '/pages/consultant/center'
        })
      } else {
        uni.navigateTo({
          url: '/pages/consultant/login'
        })
      }
    },
    login() {
      var token = uni.getStorageSync('token') || ''
      var isExistUser = token != ''
      if (!isExistUser) {
        // this.authoShow = true; // 显示弹窗
        this.$refs.authorize.getCode() // 调用子组件的onshow方法 获取openid和sessionKey

        return false
      }
    },
    logout() {
      uni.showModal({
        title: '提示',
        content: '确认退出登录吗？',
        success: function (res) {
          if (res.confirm) {
            uni.clearStorageSync()
            uni.reLaunch({
              url: '/pages/home/index'
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    // 用户信息接口
    getMemberApiUserInfo() {
      let params = {}
      this.$api.center.getMemberApiUserInfo(params).then((res) => {
        if (res.errcode == 0) {
          this.model = res.model
          uni.setStorageSync('member_id', res.model.member_id)
          if (res.count > 0) {
            this.showApply = true
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
    } else {
      this.color = 'transparent'
    }
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内分享按钮
      console.log(res.target)
    }
    return {
      title: '蓝鸟心理咨询',
      path: '/pages/center/index'
    }
  }
}
</script>

<style lang="less">
@import './index.less';
</style>
