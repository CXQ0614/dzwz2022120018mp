<template>
  <!-- 咨询师预约-->
  <view class="uni-content">
    <u-navbar
      title="心理课程"
      :bgColor="color"
      :fixed="true"
      :safeAreaInsetTop="true"
      :placeholder="true"
    ></u-navbar>
    <image
      :src="`${staticHost}/images/shared/banner.png`"
      class="banner"
    ></image>

    <view class="order">
      <view class="order-info">
        <view class="public-title">订单信息</view>
        <view class="detail-item">
          <image
            :src="`${host}` + model.list_img_url"
            class="item-img"
            mode="aspectFill"
          ></image>
          <view class="item-right">
            <view class="item-name">{{ model.main_title }}</view>
            <view class="item-type">共{{ model.class_hour }}课时</view>
            <view class="item-content">
              <view class="item-price-title">应付金额：</view>
              <view class="item-price">
                <text>￥</text>
                {{ formatPrice(model.price) }}
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="pay-info">
        <view class="public-title">支付方式选择</view>
        <view class="pay-bottom">
          <view class="pay-item" @click="payWay = 1">
            <view class="pay-left">
              <image
                :src="`${staticHost}/images/shared/wechat.png`"
                class="pay-icon"
              ></image>
              微信支付
            </view>
            <view class="pay-checked">
              <image
                :src="`${staticHost}/images/shared/checked.png`"
                class="item-checked"
                v-if="payWay == 1"
              ></image>
              <view class="item-check" v-else></view>
            </view>
          </view>
          <view class="pay-item" @click="payWay = 2">
            <view class="pay-left">
              <image
                :src="`${staticHost}/images/shared/money.png`"
                class="pay-icon"
              ></image>
              余额支付 <text class="money__count"> （余额：{{ money }}）</text>
            </view>
            <view class="pay-checked">
              <image
                :src="`${staticHost}/images/shared/checked.png`"
                class="item-checked"
                v-if="payWay == 2"
              ></image>
              <view class="item-check" v-else></view>
            </view>
          </view>
        </view>
      </view>
      <view class="fix-bottom">
        <!-- <view class="fix-bottom-top">
					<image :src="`${staticHost}/images/shared/checked.png`" class="agreed" v-if="agree" @click="agree = !agree"></image>
					<view class="agree" v-else @click="agree = !agree"></view>
					<view class="agree-text">
						我已阅读并同意
						<span class="blue" @click="openAgreeMent">《课程购买协议》</span>
						。
					</view>
				</view> -->
        <view class="fix-bottoms">
          <!-- 	<view class="total">
							合计：
							<span class="red">---</span>
						</view> -->
          <view class="total">
            合计：
            <span class="symbol">¥</span>
            <span class="money">{{ formatPrice(model.price) }}</span>
          </view>
          <view class="pay-btn" @click="submitOrder">提交订单</view>
        </view>
      </view>
      <view @click="exchangeShow = true" class="customer-icon"
        ><image
          :src="`${staticHost}/images/shared/customer-icon.png`"
          class="icon"
        ></image
      ></view>
    </view>

    <!-- 协议 -->
    <agreement
      type="1"
      :show="agreementShow"
      :second="second"
      v-on:secondChange="secondChange"
      v-on:closeAgreement="closeAgreement"
    ></agreement>

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
      id: '', // 课程详情id
      model: {}, // 课程详情
      payFlag: true,
      order_id: 0, // 订单id
      order_number: '', // 订单编号
      color: 'transparent', // 导航栏的背景颜色
      agreementShow: false, //打开课程购买协议
      second: 10, // 阅读秒数
      payWay: 0, // 1 微信 2余额
      agree: false, //同意条款
      exchangeShow: false, // 客服
      money: ''
    }
  },
  onShow() {},
  onLoad(option) {
    if (option.id) {
      this.id = option.id
    }

    // 详情接口
    this.postCourseDetails()
    this.getMemberApiUserInfo()
  },
  methods: {
    // 用户信息接口
    getMemberApiUserInfo() {
      let params = {}
      this.$api.center.getMemberApiUserInfo(params).then((res) => {
        if (res.errcode == 0) {
          this.money = res.model.money
        }
      })
    },
    openExchange() {
      this.exchangeShow = true
    },
    closeExchange(e) {
      this.exchangeShow = e
    },
    // 详情接口
    postCourseDetails() {
      let params = {
        id: this.id
      }
      this.$api.course.postCourseDetails(params).then((res) => {
        if (res.errcode == 0) {
          this.model = res.model
        }
      })
    },
    // 下单接口
    postOrderGenerateOrder() {
      var self = this
      if (!self.payFlag) {
        return false
      }
      self.payFlag = false
      let params = {
        association_type: 2, // 1咨询 2课程 3测评
        association_id: this.id, // 详情id
        pay_way: this.payWay // 支付方式value
      }
      this.$api.order.postOrderGenerateOrder(params).then((res) => {
        self.payFlag = true
        if (res.errcode == 0) {
          console.log(res)
          self.order_number = res.order_number
          self.order_id = res.order_id
          // 微信支付
          if (self.payWay == 1) {
            self.pay()
            return false
          }
          // 余额支付
          // 这里需要走支付 支付成功跳转到成功页 未成功跳转到订单详情页
          uni.redirectTo({
            url: '/pages/order/result?type=2&id=' + res.order_id
          })

          // uni.redirectTo({
          // 	url: '/pages/order/courseDetail?id=' + res.order_id
          // })
        }
      })
    },
    pay() {
      var self = this
      var params = {
        order_number: self.order_number
      }
      this.$api.order.postWeChatPayPayment(params).then((res) => {
        console.log(res)
        if (res.errcode == 0) {
          uni.requestPayment({
            timeStamp: String(res.data.timeStamp),
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: res.data.signType,
            paySign: res.data.paySign,
            success(payRes) {
              console.log(payRes)
              //下单成功
              if (payRes.errMsg === 'requestPayment:ok') {
                uni.redirectTo({
                  url: '/pages/order/result?type=2&id=' + self.order_id
                })
              }
            },
            fail(payRes) {
              if (payRes.errMsg === 'requestPayment:fail cancel') {
                uni.redirectTo({
                  url: '/pages/order/courseDetail?id=' + self.order_id
                })
              } else {
                uni.showModal({
                  title: '提示',
                  content: payRes.errMsg,
                  showCancel: false
                })
              }
            }
          })
        }
      })
    },
    // 点击提交订单
    submitOrder() {
      if (this.payWay == 0) {
        uni.showToast({
          icon: 'none',
          title: '请选择支付方式',
          duration: 1500
        })
        return false
      }
      // if(!this.agree){
      // 	uni.showToast({
      // 		icon: 'none',
      // 		title: '请阅读并同意课程购买协议',
      // 		duration: 1500
      // 	})
      // 	return false
      // }

      // 下单接口
      this.postOrderGenerateOrder()
    },
    //阅读秒数变化
    secondChange(e) {
      this.second = e
    },
    //关闭协议
    closeAgreement(e) {
      this.agreementShow = e
    },
    openAgreeMent() {
      this.agreementShow = true
    }
  },
  computed: {},
  //控制导航栏背景颜色
  onPageScroll: function (e) {
    var scroll = e.scrollTop
    if (scroll > 50) {
      this.color = '#ffffff'
    } else {
      this.color = 'transparent'
    }
  }
}
</script>

<style lang="less">
@import './apply.less';
</style>
