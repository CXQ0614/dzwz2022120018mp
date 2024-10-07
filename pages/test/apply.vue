<template>
  <!-- 心理测评-->
  <view class="uni-content">
    <u-navbar
      title="心理测评"
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
            <view class="item-type">共{{ model.subject_number }}题</view>
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
          <view class="pay-item" @click="payWayClick(1)">
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
          <view class="pay-item" @click="payWayClick(2)">
            <view class="pay-left">
              <image
                :src="`${staticHost}/images/shared/money.png`"
                class="pay-icon"
              ></image>
              余额支付<text class="money__count"> （余额：{{ money }}）</text>
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
          <view class="pay-item">
            <view class="pay-left">
              <image
                :src="`${staticHost}/images/shared/token.png`"
                class="pay-icon"
              ></image>
              抵用券支付
            </view>
            <view
              class="pay-checked"
              @click="tokenShow = true"
              v-if="tokenList && tokenList.length > 0"
            >
              <text v-if="payWay != 3">可使用抵用券</text>
              <text v-if="payWay == 3">已使用</text>
              <image
                :src="`${staticHost}/images/shared/blue-arrow.png`"
                class="arrow"
              ></image>
            </view>
            <view class="pay-checked" v-if="tokenList && tokenList.length <= 0">
              <text class="notoken">无可使用抵用券</text>
            </view>
          </view>
        </view>
      </view>
      <view class="tips">
        温馨提示：
        <br />
        您所购买的商品为虚拟内容服务，购买后不予退款、转让。如支付或使用过程遇到问题，请联系人工客服处理。
      </view>
      <view class="fix-bottom">
        <!-- <view class="fix-bottom-top">
					<image :src="`${staticHost}/images/shared/checked.png`" class="agreed" v-if="agree" @click="agree = !agree"></image>
					<view class="agree" v-else @click="agree = !agree"></view>
					<view class="agree-text">
						我已阅读并同意
						<span class="blue" @click="openAgreeMent">《测评购买协议》</span>
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
            <span class="money">{{ totalPrice }}</span>
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

    <u-popup
      :show="tokenShow"
      overlayOpacity="0.7"
      @close="tokenShow = false"
      round="20"
    >
      <view class="pop-token">
        <view class="pop-top">
          选择抵用券
          <view class="close-box" @click="tokenShow = false">
            <image
              class="close"
              :src="`${staticHost}/images/shared/close.png`"
              mode="widthFix"
            ></image>
          </view>
        </view>
        <view class="pop-center">
          <view
            class="token-item"
            v-for="(item, index) in tokenList"
            :key="index"
            @click="chooseToken(item, index)"
          >
            <view class="item-left">
              <image
                :src="`${staticHost}/images/test/token.png`"
                class="token"
              ></image>
              <view class="token-box">
                <view class="token-left">
                  <view class="token-title">{{
                    item.securitiesModel.main_title
                  }}</view>
                  <view class="token-date"
                    >有效期：{{ item.start_time }}至{{ item.end_time }}</view
                  >
                </view>
                <view class="token-right">
                  <view class="token-num">1次</view>
                  <view class="token-name">指定测评券</view>
                </view>
              </view>
            </view>
            <view class="item-right">
              <image
                :src="`${staticHost}/images/shared/checked.png`"
                class="item-checked"
                v-if="item.checked"
              ></image>
              <view class="item-check" v-else></view>
            </view>
          </view>
        </view>
        <view class="pop-bottom">
          <view class="gray-line"></view>
          <view class="btn" @click="confirmToken">确定</view>
        </view>
      </view>
    </u-popup>

    <!-- 协议 -->
    <agreement
      type="2"
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
      id: '', // 测评详情id
      tokenId: '', // 抵用券id
      tokenCode: '', // 抵用券code
      model: {}, // 测评详情
      totalPrice: '', // 合计显示的钱
      payFlag: true,
      order_id: 0, // 订单id
      order_number: '', // 订单编号
      color: 'transparent', // 导航栏的背景颜色
      tokenShow: false,
      agreementShow: false, //打开课程购买协议
      second: 10, // 阅读秒数
      payWay: 0, // 1 微信 2余额 3抵用券
      agree: false, //同意条款
      tokenList: [],
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
    this.postEvaluationDetails()
    // 兑换券列表
    this.postVoucherApiList()
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
    postEvaluationDetails() {
      let params = {
        id: this.id
      }
      this.$api.test.postEvaluationDetails(params).then((res) => {
        if (res.errcode == 0) {
          this.model = res.model
          this.totalPrice = this.formatPrice(this.model.price)
        }
      })
    },
    // 兑换券接口
    postVoucherApiList() {
      let params = {
        association_id: this.id
      }
      this.$api.order.postVoucherApiList(params).then((res) => {
        if (res.errcode == 0) {
          this.tokenList = res.availableList
          this.tokenList.forEach((item, index) => {
            item.checked = false
          })
          console.log(this.tokenList)
          console.log(this.tokenList.length)
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
        association_type: 3, // 1咨询 2课程 3测评
        association_id: this.id, // 详情id
        securities_item_id: this.tokenId, // 券id
        securities_code: this.tokenCode, // 券码
        pay_way: this.payWay // 支付方式value
      }
      this.$api.order.postOrderGenerateOrder(params).then((res) => {
        self.payFlag = true
        if (res.errcode == 0) {
          console.log(res)
          self.order_number = res.order_number
          self.order_id = parseInt(res.order_id)
          // 微信支付
          if (self.payWay == 1) {
            self.pay()
            return false
          }
          // 这里需要走支付 支付成功跳转到成功页 未成功跳转到订单详情页
          uni.redirectTo({
            url: '/pages/order/result?type=3&id=' + res.order_id
          })

          // uni.redirectTo({
          // 	url: '/pages/order/testDetail?id=' + res.order_id
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
                  url: '/pages/order/result?type=3&id=' + self.order_id
                })
              }
            },
            fail(payRes) {
              console.log(payRes)
              if (payRes.errMsg === 'requestPayment:fail cancel') {
                uni.redirectTo({
                  url: '/pages/order/testDetail?id=' + self.order_id
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
      // 		title: '请阅读并同意测评购买协议',
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
    },
    //选择优惠券
    chooseToken(item, index) {
      this.tokenList.forEach((items, indexs) => {
        var obj = this.tokenList[indexs]
        this.$set(this.tokenList, indexs, {
          ...obj,
          checked: false
        })
      })

      this.tokenList.forEach((items, indexs) => {
        var obj = this.tokenList[index]
        this.$set(this.tokenList, index, {
          ...obj,
          checked: true
        })
      })
    },
    // 切换支付方式
    payWayClick(e) {
      this.payWay = e
      this.tokenList.forEach((item, index) => {
        if (item.checked) {
          item.checked = false
        }
      })
      this.totalPrice = this.formatPrice(this.model.price)
    },
    // 点击确定使用抵用券
    confirmToken() {
      this.tokenShow = false
      this.tokenList.forEach((item, index) => {
        if (item.checked) {
          this.payWay = 3
          this.tokenId = item.id
          this.tokenCode = item.code
          this.totalPrice = '0.00'
        }
      })
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
