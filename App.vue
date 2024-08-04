<template>
  <!-- 订单弹窗 -->
  <view class="apply-modal">
    <u-popup :show="showApply" @close="closeApply" mode="center" round="10" :closeOnClickOverlay="true"
      overlayOpacity="0.7" bgColor="transparent">
      <view class="scan">
        <image :src="`${staticHost}/images/shared/login-close.png`" @click="closeApply" class="close"></image>
        <view class="scan-title">您有24小时内的咨询订单，</view>
        <view class="scan-title">请注意咨询时间</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        showApply: false, //订单弹窗
      };
    },
    onLaunch: function() {
      console.log('App Launch');
      //摄像头、麦克风权限
      uni.setStorageSync('callPermissions', false);
      if (uni.getStorageSync('token')) {
        let params = {}
        this.$api.center.getMemberApiUserInfo(params).then(res => {
          if (res.errcode == 0) {
            console.log(123);
            this.model = res.model
            if (res.count > 0) {
              this.showApply = true
            }
          }
        })
      }

    },
    onShow: function() {
      console.log('App Show');
    },
    onHide: function() {
      console.log('App Hide');
    },
    methods: {
      closeApply() {
        this.showApply = false
      },
    }
  };
</script>

<style>
  /*每个页面公共css */
</style>
<style lang="scss">
  /* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
  @import '@/uni_modules/uview-ui/index.scss';

  .scan {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80rpx 30rpx;
    width: 690rpx;
    background: #fff;
    border-radius: 40rpx;
    box-sizing: border-box;

    .close {
      position: absolute;
      right: 20rpx;
      top: 20rpx;
      width: 50rpx;
      height: 50rpx;
    }

    .scan-title {
      font-size: 36rpx;
      font-weight: 400;
      color: #000033;
      line-height: 48rpx;
    }

    .scan-blue-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #0076d6;
      line-height: 48rpx;
    }

    .qr {
      margin-top: 48rpx;
      width: 224rpx;
      height: 224rpx;
    }
  }
</style>