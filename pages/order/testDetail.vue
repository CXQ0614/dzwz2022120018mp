<template>
  <!-- 订单详情-->
  <view class="uni-content">
    <image
      :src="`${staticHost}/images/shared/banner.png`"
      class="banner"
    ></image>
    <view class="detail">
      <u-navbar
        title="订单详情"
        :bgColor="color"
        :fixed="true"
        :safeAreaInsetTop="true"
        :placeholder="true"
      ></u-navbar>
      <!--  0 待支付 5已购买 20 取消 -->
      <!-- 待支付 -->
      <template v-if="model.order_state == 0">
        <view class="pay-title">
          待支付，剩余
          <u-count-down
            :time="hour"
            format="mm:ss"
            autoStart
            millisecond
            @change="onChange"
            @finish="cancelOrder"
          >
            <view class="time">
              <text class="time__item"
                >{{
                  timeData.minutes >= 10
                    ? timeData.minutes
                    : '0' + timeData.minutes
                }}:</text
              >
              <text class="time__item">{{
                timeData.seconds >= 10
                  ? timeData.seconds
                  : '0' + timeData.seconds
              }}</text>
            </view>
          </u-count-down>
        </view>
        <view class="pay-tip">请您尽快支付，逾期后订单将自动关闭</view>
      </template>
      <!-- 已购买 -->
      <template v-if="model.order_state == 5 || model.order_state == 10">
        <view class="pay-title">订单已完成</view>
        <view class="pay-tip">如有疑问，可随时联系在线客服</view>
      </template>
      <!-- 已取消 -->
      <template v-if="model.order_state == 20">
        <view class="pay-title">订单已取消</view>
        <view class="pay-tip">如有疑问，可随时联系在线客服</view>
      </template>

      <view class="detail-box">
        <view class="detail-top">
          <image
            :src="`${staticHost}/images/home/logo.png`"
            class="logo"
          ></image>
          <view class="detail-title">蓝鸟心理</view>
        </view>
        <view class="detail-center">
          <view class="detail-item">
            <image
              :src="`${host}` + model.associationModel.list_img_url"
              class="item-img"
              mode="aspectFill"
            ></image>
            <view class="item-right">
              <view class="item-name">{{
                model.associationModel.main_title
              }}</view>
              <view class="item-type"
                >共{{ model.associationModel.subject_number }}题</view
              >
              <view class="item-content">
                <view class="item-price-title">应付金额：</view>
                <view class="item-price">
                  <text>￥</text>
                  {{ formatPrice(model.payment_amount) }}
                </view>
              </view>
            </view>
          </view>
          <view class="detail-info-box">
            <view class="info-item">
              <view class="info-left">订单编号：</view>
              <view class="info-right">{{ model.order_number }}</view>
            </view>
            <view class="info-item">
              <view class="info-left">创建日期：</view>
              <view class="info-right">{{ model.create_time }}</view>
            </view>
          </view>
          <view class="customer-box" @click="openExchange">
            <image
              :src="`${staticHost}/images/shared/customer.png`"
              class="customer"
            ></image>
            在线客服
          </view>
        </view>
      </view>

      <!-- 待支付 -->
      <view class="btns" v-if="model.order_state == 0">
        <view class="btn" @click="openShow">取消订单</view>
        <view class="btn pay" @click="pay">立即支付</view>
      </view>
      <!-- 已购买 未测评 -->
      <view class="btns" v-if="model.order_state == 5"
        ><navigator
          :url="'/pages/test/test?id=' + Id"
          hover-class="none"
          class="btn pay whole"
          >开始测评</navigator
        ></view
      >
      <!-- 已购买 已测评 -->
      <view class="btns" v-if="model.order_state == 10">
        <navigator url="/pages/consult/index" hover-class="none" class="btn"
          >咨询预约</navigator
        >
        <navigator
          :url="'/pages/test/report?id=' + Id"
          hover-class="none"
          class="btn pay"
          >查看测评报告</navigator
        >
      </view>
      <!-- 已取消 -->
      <view class="btns" v-if="model.order_state == 20">
        <navigator
          url="/pages/order/index?type=3"
          open-type="redirect"
          hover-class="none"
          class="btn"
          >返回订单列表</navigator
        >
        <navigator url="/pages/test/index" hover-class="none" class="btn pay"
          >浏览更多测评</navigator
        >
      </view>
    </view>

    <!-- 取消按钮和确定是反的,所以是cancel -->
    <u-modal
      :show="show"
      content="订单还未付款，确认要取消吗？"
      confirmText="再考虑下"
      cancelText="取消订单"
      showCancelButton
      @confirm="closeShow"
      @cancel="cancelOrder"
    ></u-modal>

    <!-- 授权弹窗 -->
    <diy-authorize
      ref="authorize"
      v-on:closeMain="closeMain"
      :show="authoShow"
    ></diy-authorize>

    <agreement
      :show="agreementShow"
      :second="0"
      :agree="true"
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
      Id: '',
      cancelFlag: true,
      authoShow: false, // 授权弹窗显示
      show: false,
      hour: 0.5, //剩余小时
      timeData: {},
      agreementShow: false, //打开课程购买协议
      exchangeShow: false, // 客服
      model: {},
      color: 'transparent' // 导航栏的背景颜色
    }
  },
  onLoad(option) {
    if (option) {
      this.Id = option.id
    }
  },
  onShow() {
    this.getDetail()
  },
  methods: {
    openExchange() {
      this.exchangeShow = true
    },
    closeExchange(e) {
      this.exchangeShow = e
    },
    getDetail(loading) {
      var self = this
      let params = {
        id: this.Id
      }
      this.$api.order.postOrderDetails(params, loading).then((res) => {
        if (res.errcode == 0) {
          self.model = res.model
          var time1 =
            new Date(self.model.create_time).valueOf() + 0.5 * 60 * 60 * 1000 //下单过期日期
          var AddDate = self.model.create_time.replace(/-/g, '/')
          if (isNaN(time1)) {
            var time1 = new Date(AddDate).valueOf() + 0.5 * 60 * 60 * 1000 //下单过期日期
          }
          var time2 = new Date().valueOf() //当前日期
          self.hour = time1 - time2 <= 0 ? 0 : time1 - time2
        }
      })
    },
    //支付
    pay() {
      var self = this
      var params = {
        order_number: self.model.order_number
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
                  url: '/pages/order/result?type=3&id=' + self.model.order_id
                })
              }
            },
            fail(payRes) {
              if (payRes.errMsg === 'requestPayment:fail cancel') {
                return
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
    //取消订单接口
    cancelOrder() {
      if (!this.cancelFlag || this.model.order_state == 20) {
        return false
      }
	  this.cancelFlag = false
      var self = this
      let params = {
        id: this.Id
      }
      this.$api.order.postOrderCancellation(params).then((res) => {
        self.cancelFlag = true
        if (res.errcode == 0) {
          self.show = false
          self.getDetail(false)
          uni.showToast({
            icon: 'sucess',
            title: '取消成功',
            duration: 3000
          })
        }
      })
    },
    openShow() {
      this.show = true
    },
    closeShow() {
      this.show = false
    },
    closeAgreement(e) {
      this.agreementShow = e
    },
    onChange(e) {
      this.timeData = e
    },
    // 子组件向父组件传值
    closeMain(e) {
      this.authoShow = e
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
@import './testDetail.less';
</style>
