<template>
  <view class="webview">
    <web-view :src="urls"></web-view>
  </view>
</template>

<script>
import {
  publicMixin
} from '../../mixin/public.js';
// import wx from 'weixin-js-sdk'
export default {
  mixins: [publicMixin],
  data () {
    return {
      urls: '',
      id: '',
      type: '', // MEMBER用户 CONSULTANT咨询师
      redirectUrl: 'http://dzwz2022120018.idea-source.net/index.html',
      // redirectUrl: 'https://www.lanniaoxl.com/index.html',
    };
  },
  onLoad (option) {
    this.redirectUrl = encodeURIComponent(this.redirectUrl)
    console.log(this.redirectUrl);
    if (option.userType) {
      this.type = option.userType
      console.log(' this.type', this.type);
      if (option.userType == 'MEMBER') {
        this.id = uni.getStorageSync('member_id')
        console.log('id', this.id);
      } else if (option.userType == 'CONSULTANT') {
        this.id = uni.getStorageSync('consultant_id')
        console.log('id', this.id);
      }
    }

    if (option.urls) {
      this.urls = option.urls
    } else {
      this.urls = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx3757e8d5b2b9229b&redirect_uri=${this.redirectUrl}&response_type=code&scope=snsapi_userinfo&state=${this.type}${this.id}#wechat_redirect`
    }

  },
  created () {

  }
};
</script>

<style lang="less">
</style>