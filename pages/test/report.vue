<template>
  <!-- 首页-->
  <view class="uni-content">
    <u-navbar
      title="测评报告"
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
    <view class="report">
      <view class="report-box">
        <image :src="`${staticHost}/images/test/bird.png`" class="bird"></image>
        <view class="report-inner">
          <view class="report-title">
            <view class="report-dot-box">
              <view class="dot one"></view>
              <view class="dot two"></view>
              <view class="dot three"></view>
            </view>
            <view class="title">{{ model.orderModel.main_title }}</view>
            <view class="report-dot-box">
              <view class="dot three"></view>
              <view class="dot two"></view>
              <view class="dot one"></view>
            </view>
          </view>
          <view class="result">
            <view class="public-title">测评简介</view>
            <view class="content">
              {{ model.evaluationModel.subtitle }}
            </view>
          </view>
          <view class="result">
            <view class="public-title">测评结果分析</view>
            <block v-for="(item, index) in model.dimensionList" :key="index">
              <view class="content">
                <view class="content-text">
                  {{ item.dimension_name }}: {{ item.score }}
                </view>
                {{ item.describe }}
              </view>
            </block>
          </view>
          <!-- <view class="recommend">
						<view class="public-title">改善推荐</view>
						<view class="content">
							常见问题字段占位常见问题字段占位,常见问题字段占位常见问题字段占位,常见问题字段占位常见问题字段占位。
							<br />
							常见问题字段占位常见问题字段占位常见问题字段占位常见问题常见问题字段占位常见问题常见问题字段占位常见问题常见问题字段占位。
							常见问题常见问题字段占位常见问题常见问题字段占位常见问题常见问题字段占位常见问题。
							<br />
							常见问题字段占位常见问题字段占位常见问题字段占位常见问题常见问题字段占位常见问题常见问题字段占位常见问题常见问题字段占位。
						</view>
					</view> -->
        </view>
      </view>
    </view>
    <view class="fix-bottom"
      ><view class="btn" @click="donwload">下载报告</view></view
    >
    <view @click="exchangeShow = true" class="customer-icon"
      ><image
        :src="`${staticHost}/images/shared/customer-icon.png`"
        class="icon"
      ></image
    ></view>
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
  </view>
</template>

<script>
import { publicMixin } from '../../mixin/public.js'
export default {
  mixins: [publicMixin],
  data() {
    return {
      Id: '',
      model: {},
      authoShow: false, // 授权弹窗显示
      color: 'transparent', // 导航栏的背景颜色
      titleColor: '#fff', // 标题和箭头颜色
      exchangeShow: false // 客服显示
    }
  },
  onLoad(option) {
    if (option) {
      this.Id = option.id
    }
    this.getDetail()
  },
  methods: {
    // 报告详情
    getDetail() {
      var self = this
      let params = {
        id: this.Id
      }
      this.$api.test.postEvaluationAnswerResult(params).then((res) => {
        if (res.errcode == 0) {
          self.model = res
        }
      })
    },
    donwload(url) {
      uni.downloadFile({
        url: url,
        success: (res) => {
          if (res.statusCode === 200) {
            console.log('下载成功')
          }
        }
      })
    },
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
      this.titleColor = '#000'
    } else {
      this.color = 'transparent'
      this.titleColor = '#fff'
    }
  }
}
</script>

<style lang="less">
@import './report.less';
</style>
