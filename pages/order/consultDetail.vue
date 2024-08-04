<template>
  <!-- 心理咨询 - 订单详情-->
  <view class="uni-content">
    <image
      :src="`${staticHost}/images/shared/banner.png`"
      class="banner"
    ></image>
    <view class="detail" v-if="model.order_id">
      <u-navbar
        title="订单详情"
        :bgColor="color"
        :fixed="true"
        :safeAreaInsetTop="true"
        :placeholder="true"
      ></u-navbar>
      <!-- 0 待支付 5 待咨询 10 已完成 已评价 20已取消 -->
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
      <!-- 待咨询 -->
      <template v-if="model.order_state == 5">
        <view class="pay-title">等待咨询</view>
        <view class="pay-tip">如有疑问，可随时联系在线客服</view>
      </template>
      <!-- 已完成 -->
      <template v-if="model.order_state == 10">
        <view class="pay-title">咨询已结束</view>
        <view class="pay-tip">如有疑问，可随时联系在线客服</view>
      </template>
      <!-- 已取消 -->
      <template v-if="model.order_state == 20">
        <view class="pay-title">咨询已取消</view>
        <view class="pay-tip">如有疑问，可随时联系在线客服</view>
      </template>

      <!-- 预约订单 -->
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
              :src="`${host}` + model.associationModel.img_url"
              class="item-img"
              mode="aspectFill"
            ></image>
            <view class="item-right">
              <view class="item-name"
                >咨询师：{{ model.associationModel.main_title }}</view
              >
              <view class="item-type"
                >视频咨询、{{ formatPrice(model.associationModel.price) }}元 /
                50分钟</view
              >
              <view class="item-content">
                <view class="item-price-title">咨询费用：</view>
                <view class="item-price">
                  <text>￥</text>
                  {{ formatPrice(model.payment_amount) }}
                </view>
              </view>
            </view>
          </view>
          <view
            class="detail-info-box"
            :class="{ noline: model.order_state == 10 }"
          >
            <view class="info-item">
              <view class="info-left">订单编号：</view>
              <view class="info-right">{{ model.order_number }}</view>
            </view>
            <view class="info-item">
              <view class="info-left">创建日期：</view>
              <view class="info-right">{{ model.create_time }}</view>
            </view>
            <!-- 已取消不显示 -->
            <view class="info-item" v-if="model.order_state != 20">
              <view class="info-left">预约时间：</view>
              <view class="info-right"
                >{{ model.recentlyDate }} ({{ model.recentlyWeek }})
                {{ model.startTime }}-{{ model.endTime }}</view
              >
            </view>
            <view class="info-item" v-if="model.order_state != 20">
              <view class="info-left">咨询协议：</view>
              <view class="info-right blue" @click="agreementShow = true">
                点击查看
                <image
                  :src="`${staticHost}/images/shared/blue-arrow.png`"
                  class="arrow"
                ></image>
              </view>
            </view>
            <!-- 已完成待评价 -->
            <view
              class="info-item block"
              v-if="model.order_state == 10 && model.is_evaluate == 0"
            >
              <view class="info-left">咨询评价：</view>
              <textarea
                v-model="evaluate"
                class="evaluate-box"
                :maxlength="-1"
              ></textarea>
            </view>
            <!-- 已完成已评价 -->
            <view
              class="info-item block"
              v-if="model.order_state == 10 && model.is_evaluate == 1"
            >
              <view class="info-left">咨询评价：</view>
              <view class="evaluate-box">{{ model.user_evaluate }}</view>
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
        <view class="btn" @click="openCancelShow">取消订单</view>
        <view class="btn pay" @clikc="pay">立即支付</view>
      </view>
      <!-- 待咨询 -->
      <view class="btns" v-if="model.order_state == 5">
        <navigator
          url=""
          hover-class="none"
          class="btn pay enter"
          @click="enterConsult"
          v-if="model.isStart"
          >进入咨询</navigator
        >
        <view class="btn enter gary" v-else>咨询未开始</view>
        <view
          class="btn"
          :class="{ whole: model.up_count != 0 }"
          @click="cancelReservation"
          >取消预约</view
        >
        <view class="btn" @click="changeOrder" v-if="model.up_count == 0"
          >更改预约</view
        >
      </view>
      <!-- 已完成 待评价-->
      <view
        class="btns"
        v-if="model.order_state == 10 && model.is_evaluate == 0"
      >
        <navigator
          url="/pages/order/index"
          open-type="redirect"
          hover-class="none"
          class="btn"
          >返回订单列表</navigator
        >
        <view class="btn pay" @click="addEvaluate">提交评价</view>
      </view>
      <!-- 已完成 已评价-->
      <view
        class="btns"
        v-if="model.order_state == 10 && model.is_evaluate == 1"
      >
        <navigator
          url="/pages/order/index"
          open-type="redirect"
          hover-class="none"
          class="btn whole"
          >返回订单列表</navigator
        >
      </view>
      <!-- 已取消 -->
      <view class="btns" v-if="model.order_state == 20">
        <navigator
          url="/pages/order/index"
          open-type="redirect"
          hover-class="none"
          class="btn"
          >返回订单列表</navigator
        >
        <navigator url="/pages/consult/index" hover-class="none" class="btn pay"
          >浏览更多咨询</navigator
        >
      </view>
    </view>

    <!-- 温馨提示 更改预约提示 -->
    <u-popup
      :show="changeShow"
      @close="closeChangeShow"
      bgColor="transparent"
      mode="center"
    >
      <view class="pop-box">
        <view class="pop pb">
          <view class="pop-title">温馨提示</view>
          <view class="pop-content">
            预约时间仅可修改一次，
            <br />
            您确定吗？
          </view>
          <view class="confirm" @click="closeChangeShow">不确定，再想想</view>
          <view class="change" @click="changeTime">更改预约时间</view>
        </view>
        <image
          :src="`${staticHost}/images/shared/round-close.png`"
          class="close"
          @click="closeChangeShow"
        ></image>
      </view>
    </u-popup>

    <!-- 温馨提示 更改预约时间不足24h-->
    <u-popup
      :show="changeTimeShow"
      @close="closeChangeTimeShow"
      bgColor="transparent"
      mode="center"
    >
      <view class="pop-box">
        <view class="pop">
          <view class="pop-title">温馨提示</view>
          <view class="pop-content">
            很抱歉，距预约时间不足24h，
            <br />
            已无法更改预约。
          </view>
          <view class="confirm" @click="closeChangeTimeShow">确定</view>
        </view>
        <image
          :src="`${staticHost}/images/shared/round-close.png`"
          class="close"
          @click="closeChangeTimeShow"
        ></image>
      </view>
    </u-popup>

    <!-- 温馨提示 取消预约成功弹框-->
    <u-popup
      :show="cancelSucessShow"
      @close="closeCancelSucessShow"
      bgColor="transparent"
      mode="center"
    >
      <view class="pop-box">
        <view class="pop">
          <view class="pop-title">温馨提示</view>
          <view class="pop-content">
            取消本次预约后可重新预约，
            <br />
            本次订单费用原路返回。
          </view>
          <view class="confirm" @click="refundOder">确定</view>
        </view>
        <image
          :src="`${staticHost}/images/shared/round-close.png`"
          class="close"
          @click="closeCancelSucessShow"
        ></image>
      </view>
    </u-popup>

    <!-- 温馨提示 取消预约时间不足24h-->
    <u-popup
      :show="cancelTimeShow"
      @close="closeCancelTimeShow"
      bgColor="transparent"
      mode="center"
    >
      <view class="pop-box">
        <view class="pop">
          <view class="pop-title">温馨提示</view>
          <view class="pop-content">
            很抱歉，距预约时间不足24小时，
            <br />
            订单无法更改或取消
          </view>
          <view class="confirm" @click="closeCancelTimeShow">确定</view>
        </view>
        <image
          :src="`${staticHost}/images/shared/round-close.png`"
          class="close"
          @click="closeCancelTimeShow"
        ></image>
      </view>
    </u-popup>

    <u-popup
      :show="timeShow"
      overlayOpacity="0.7"
      @close="closeTime"
      bgColor="#e9edf5"
      round="20"
    >
      <view class="pop-time">
        <view class="pop-top">
          <view class="time-title">选择咨询时段（北京时间）</view>
          <image
            class="close"
            :src="`${staticHost}/images/shared/close.png`"
            mode="widthFix"
            @click="closeTime"
          ></image>
        </view>
        <view class="month">
          <view
            class="arrow-buttons"
            :class="{ hide: year == currentYear && month == currentMonth }"
            @click="lastMonth"
          >
            <image
              class="arrow-button"
              :src="`${staticHost}/images/shared/arrow-left.png`"
              mode="widthFix"
            ></image>
          </view>
          <view class="text">{{ year + '年' + month + '月' }}</view>
          <view class="arrow-buttons" @click="nextMonth"
            ><image
              class="arrow-button"
              :src="`${staticHost}/images/shared/arrow-right.png`"
              mode="widthFix"
            ></image
          ></view>
        </view>
        <u-tabs
          ref="tabs"
          :list="dates"
          lineWidth="30"
          lineHeight="4"
          :lineColor="`linear-gradient(134deg, #149cff 0%, #0975e8 100%)`"
          :current="currentIndex"
          :activeStyle="{
            fontSize: '32rpx',
            lineHeight: '40rpx',
            color: '#0076d6',
            fontWeight: 'bold'
          }"
          :inactiveStyle="{
            fontSize: '32rpx',
            lineHeight: '40rpx',
            color: '#000033'
          }"
          itemStyle="padding: 24rpx 30rpx; height: 50rpx;"
          @click="changeDay"
        ></u-tabs>
        <view class="pop-bottom" v-if="dateList.length > 0">
          <view class="time-box">
            <view class="time-item">
              <!-- 	8-12  12-18  18-22 -->
              <view class="public-title">上午</view>
              <view class="time-bottom">
                <template v-for="(item, index) in dateList[currentIndex].list">
                  <!-- is_expire 0 未过期 1 已过期  is_occupy 0 可预约 1被占用 -->
                  <view
                    class="time-item"
                    :class="{
                      active: scheduling_id.indexOf(item.scheduling_id) != -1,
                      disable: item.is_occupy == 1 || item.is_expire == 1
                    }"
                    v-if="
                      textchangeNum(item.startHI, 2) >= 8 &&
                      textchangeNum(item.startHI, 2) < 12
                    "
                    @click="chooseTime(item, index)"
                  >
                    {{ item.time }}
                  </view>
                </template>
              </view>
            </view>
            <!-- 	8-12  12-18  18-22 -->
            <view class="time-item">
              <view class="public-title">下午</view>
              <view class="time-bottom">
                <template v-for="(item, index) in dateList[currentIndex].list">
                  <view
                    class="time-item"
                    :class="{
                      active: scheduling_id.indexOf(item.scheduling_id) != -1,
                      disable: item.is_occupy == 1 || item.is_expire == 1
                    }"
                    @click="chooseTime(item, index)"
                    v-if="
                      textchangeNum(item.startHI, 2) >= 12 &&
                      textchangeNum(item.startHI, 2) < 18
                    "
                  >
                    {{ item.time }}
                  </view>
                </template>
              </view>
            </view>
            <!-- 	8-12  12-18  18-22 -->
            <view class="time-item">
              <view class="public-title">晚上</view>
              <view class="time-bottom">
                <template v-for="(item, index) in dateList[currentIndex].list">
                  <view
                    class="time-item"
                    :class="{
                      active: scheduling_id.indexOf(item.scheduling_id) != -1,
                      disable: item.is_occupy == 1 || item.is_expire == 1
                    }"
                    @click="chooseTime(item, index)"
                    v-if="
                      textchangeNum(item.startHI, 2) >= 18 &&
                      textchangeNum(item.startHI, 2) < 22
                    "
                  >
                    {{ item.time }}
                  </view>
                </template>
              </view>
            </view>
          </view>
          <view class="time-tip">
            <view class="tip-item"
              >* 没有合适的时间段，可咨询400-123-12345；</view
            >
            <view class="tip-item">* 预约时段可多选，对应增减订单个数。</view>
          </view>
          <view class="gray-line"></view>
          <view class="pd">
            <view class="choose-time">
              <view class="choose-title">已选时间段：</view>
              <view class="choose-times" v-if="scheduling.length > 0">
                {{ scheduling[0].startYear }}-{{ scheduling[0].startMonth }}-{{
                  scheduling[0].startDay
                }}
                <span class="line">丨</span>
                <text v-if="scheduling.length == 1">{{
                  scheduling[0].time
                }}</text>
                <text v-if="scheduling.length == 2">{{
                  hourShowText(scheduling[0], scheduling[1])
                }}</text>
              </view>
              <view class="choose-times" v-else>
                {{ model.recentlyDate }}
                <span class="line">丨</span>
                {{ model.startTime }}-{{ model.endTime }}
              </view>
            </view>

            <view class="btn" @click="confirmTime">确定</view>
          </view>
        </view>
      </view>
    </u-popup>

    <!-- 取消按钮和确定是反的,所以是cancel -->
    <u-modal
      :show="cancelShow"
      content="订单还未付款，确认要取消吗？"
      confirmText="再考虑下"
      cancelText="取消订单"
      showCancelButton
      @confirm="closeCancelShow"
      @cancel="cancelOrder"
    ></u-modal>

    <!-- 授权弹窗 -->
    <diy-authorize
      ref="authorize"
      v-on:closeMain="closeMain"
      :show="authoShow"
    ></diy-authorize>

    <agreement
      :name="model.infoModel.name"
      :consultant="model.associationModel.main_title"
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
      Id: '', // 订单id
      authoShow: false, // 授权弹窗显示
      cancelShow: false, //取消订单
      changeShow: false, // 更改预约提示
      changeTimeShow: false, //更改预约时间不足弹框
      cancelSucessShow: false, //取消预约成功弹框
      cancelTimeShow: false, //取消预约时间不足弹框
      timeShow: false, // 更改预约时间段
      agreementShow: false, //打开课程购买协议
      cancelFlag: true,
      exchangeShow: false, // 客服

      year: '',
      month: '',
      currentYear: '', // 今年
      currentMonth: '', // 今月
      dateList: [],
      dates: [],
      old_scheduling_id: [],
      scheduling_id: [], // 时间id
      scheduling: [], // 选择时间 0 开始 1结束
      currentIndex: 0, // 咨询时间段选择index

      hour: 0.5, //剩余小时
      timeData: {},
      evaluate: '', // 评价内容
      model: {},
      timer: '',
      leftTime: 0,
      color: 'transparent' // 导航栏的背景颜色
    }
  },
  onLoad(option) {
    if (option) {
      this.Id = option.id
    }
    this.currentYear = new Date().getFullYear()
    this.currentMonth = new Date().getMonth() + 1
  },
  onShow() {
    this.getDetail()
  },
  onUnload() {
    console.log('onukk')
    clearInterval(this.timer)
    this.timer = null
  },
  onHide() {
    console.log('onHide')
    clearInterval(this.timer)
    this.timer = null
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
          // 待咨询 判断是否开始咨询
          if (res.model.order_state == 5) {
            self.leftTime =
              (self.model.consultant_start_time * 1000 - time2) / 1000 //距离咨询开始剩余时间
            console.log('剩余秒数', self.leftTime)
            if (self.leftTime > 0) {
              clearInterval(self.timer)
              self.timer = null
              self.timer = setInterval(function () {
                if (self.leftTime > 0) {
                  self.leftTime--
                }
                if (self.leftTime <= 0) {
                  self.model.isStart = true
                  clearInterval(self.timer)
                  self.timer = null
                }
              }, 1000)
            } else {
              self.model.isStart = true
            }
          }
          console.log('2', self.model)
          console.log('当前日期', time2)
          console.log('开始咨询日期', self.model.consultant_start_time * 1000)
          self.hour = time1 - time2 <= 0 ? 0 : time1 - time2
          self.scheduling_id = [] // 选择id
          self.old_scheduling_id = [] // 原始选择id
          self.scheduling = [] //起始
          self.model.itemList.forEach((item, index) => {
            self.scheduling_id.push(item.scheduling_id)
            self.old_scheduling_id.push(item.scheduling_id)
          })
          self.year = parseInt(self.model.recentlyDate.slice(0, 4))
          self.month = parseInt(self.model.recentlyDate.slice(5, 7))
        }
      })
    },
    //排期时间段
    getScheduling(callback) {
      var self = this
      var start
      var monthText = this.month >= 10 ? this.month : '0' + this.month
      if (this.year == this.currentYear && this.month == this.currentMonth) {
        start = this.getToday()
      } else {
        start = this.year + '-' + monthText + '-' + '01'
      }
      var end =
        this.year +
        '-' +
        monthText +
        '-' +
        this.getDaysInMonth(this.year, this.month)
      let params = {
        id: this.model.association_id, //关联咨询师详情id
        startDate: start, // 开始时间
        endDate: end // 时间
      }
      this.$api.consultant.postConsultanSchedulingList(params).then((res) => {
        if (res.errcode == 0) {
          var list = res.list
          self.dateList = []
          for (let i in list) {
            self.dateList.push(list[i])
          }
          var chooseIndex // 当前订单选中的index
          // 让自己占用的可选
          var chooseArray = []
          self.dates = []
          self.dateList.forEach((item, index) => {
            var obj = {
              name: item.date + item.week
            }
            self.dates.push(obj)
            item.list.forEach((listItem, listIndex) => {
              // 下单选的时间
              self.old_scheduling_id.forEach(
                (schedulingItem, schedulingIndex) => {
                  if (listItem.scheduling_id == schedulingItem) {
                    listItem.is_occupy = 0
                    chooseIndex = index
                  }
                }
              )
              // 更新时间
              self.scheduling_id.forEach((schedulingItem, schedulingIndex) => {
                if (listItem.scheduling_id == schedulingItem) {
                  chooseArray.push(listItem)
                }
              })
            })
          })
          self.scheduling = []
          if (chooseArray.length > 0) {
            if (chooseArray.length == 1) {
              self.scheduling.push(chooseArray[0])
            } else {
              self.scheduling.push(chooseArray[0])
              self.scheduling.push(chooseArray[chooseArray.length - 1])
            }
          }
          console.log('self.scheduling', self.scheduling)
          console.log('chooseArray', chooseArray)
          self.currentIndex = 0
          if (callback) {
            self.currentIndex = chooseIndex
          }
          self.$refs.tabs.init(true)
        }
      })
    },
    // 支付接口
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
                  url: '/pages/order/result?type=1&id=' + self.model.order_id
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
    // 开启视频通话
    enterConsult() {
      var self = this
      console.log('uni.getStorageSync(NickName)', self.model.name)
      console.log('self.getOpenId()', self.getOpenId())
      console.log('self.model.associationModel.nickname', self.model.main_title)
      console.log(
        'self.model.associationModel.open_id',
        self.model.associationModel.open_id
      )
      wx.setEnable1v1Chat({
        enable: true,
        success: (res) => {
          console.log(res, 'res')
          wx.join1v1Chat({
            caller: {
              nickname: self.model.name,
              openid: self.getOpenId()
            },
            listener: {
              nickname: self.model.main_title,
              openid: self.model.associationModel.open_id
            }
          })
        },
        fail: (err) => {
          console.log('err', err)
        }
      })
    },
    // 提交评价
    addEvaluate() {
      var self = this
      let params = {
        id: this.Id,
        evaluate: this.evaluate
      }
      this.$api.order.postOrderEvaluate(params).then((res) => {
        if (res.errcode == 0) {
          uni.showToast({
            icon: 'sucess',
            title: '提交成功',
            duration: 3000
          })
          self.getDetail(false)
        }
      })
    },
    //取消订单接口
    cancelOrder() {
      console.log('取消订单')
      if (!this.cancelFlag) {
        this.cancelFlag = false
      }
      var self = this
      let params = {
        id: this.Id
      }
      this.$api.order.postOrderCancellation(params).then((res) => {
        self.cancelFlag = true
        if (res.errcode == 0) {
          self.cancelShow = false
          uni.showToast({
            icon: 'sucess',
            title: '取消成功',
            duration: 3000
          })
          self.getDetail(false)
        }
      })
    },
    // 退款
    refundOder() {
      var self = this
      var params = {
        order_number: self.model.order_number
      }
      this.$api.order.postWeChatPayRefund(params).then((res) => {
        console.log(res)
        if (res.errcode == 0) {
          self.cancelSucessShow = false
          uni.showToast({
            icon: 'sucess',
            title: '取消成功',
            duration: 3000
          })
          self.getDetail(false)
        }
      })
    },
    // 取消预约
    cancelReservation() {
      var self = this
      // 小于24小时
      var timestamp = Date.parse(new Date()) / 1000
      console.log('当前时间', timestamp)
      console.log('当前时间加24小时', timestamp + 24 * 60 * 60)
      console.log('咨询开始时间', self.model.consultant_start_time)
      if (self.model.consultant_start_time < timestamp + 24 * 60 * 60) {
        this.cancelTimeShow = true
        return false
      }
      // 如果剩余时间大于24小时 走接口
      self.cancelSucessShow = true
    },
    // 点击更改预约
    changeOrder() {
      var self = this
      // 小于24小时
      var timestamp = Date.parse(new Date()) / 1000
      console.log('当前时间', timestamp)
      console.log('当前时间加24小时', timestamp + 24 * 60 * 60)
      console.log('咨询开始时间', self.model.consultant_start_time)
      if (self.model.consultant_start_time < timestamp + 24 * 60 * 60) {
        this.changeTimeShow = true
        return false
      }
      this.changeShow = true //更改预约提示
    },
    //更改预约时间
    changeTime() {
      this.changeShow = false //更改预约提示
      this.getScheduling(true)
      this.timeShow = true
    },
    // 确认更改预约时间
    confirmTime() {
      if (this.scheduling_id.length <= 0) {
        uni.showToast({
          icon: 'none',
          title: '请选择咨询时间段',
          duration: 3000
        })
        return false
      }
      var same = 0
      this.scheduling_id.forEach((item, index) => {
        this.old_scheduling_id.forEach((oldItem, oldIndex) => {
          if (item == oldItem) {
            same++
          }
        })
      })
      if (same >= this.old_scheduling_id.length) {
        uni.showToast({
          icon: 'none',
          title: '咨询时间段与之前一样，请重新选择',
          duration: 3000
        })
        return false
      }

      var self = this
      let params = {
        id: this.Id,
        scheduling_id: this.scheduling_id
      }
      this.$api.consultant.postOrderUpScheduling(params).then((res) => {
        if (res.errcode == 0) {
          uni.showToast({
            icon: 'sucess',
            title: '更改成功',
            duration: 3000
          })
          this.timeShow = false
          this.getDetail(false)
        }
      })
    },
    // 更改咨询时段日期
    changeDay(e) {
      this.currentIndex = e.index
    },
    //选择排期
    chooseTime(item, index) {
      if (item.is_occupy == 1 || item.is_expire == 1) {
        return false
      }
      var self = this
      var length = this.old_scheduling_id.length // 需要更改的课时数量

      var count = 0 // 可以选择的课程个数
      this.dateList[this.currentIndex].list.forEach((dateItem, dateIndex) => {
        if (dateIndex >= index && dateIndex < index + length) {
          if (dateItem.is_expire == 0 && dateItem.is_occupy == 0) {
            count++
          }
        }
      })
      // 可选择
      if (count >= length) {
        // 获取选中的时间id
        this.scheduling_id = []
        this.scheduling = []
        var chooseArray = []
        this.dateList[this.currentIndex].list.forEach((dateItem, dateIndex) => {
          if (dateIndex >= index && dateIndex < index + length) {
            self.scheduling_id.push(dateItem.scheduling_id)
            chooseArray.push(dateItem)
          }
        })
        if (chooseArray.length > 0) {
          if (chooseArray.length == 1) {
            self.scheduling.push(chooseArray[0])
          } else {
            self.scheduling.push(chooseArray[0])
            self.scheduling.push(chooseArray[chooseArray.length - 1])
          }
        }
        console.log('self.scheduling_id', self.scheduling_id)
        console.log('this.scheduling', this.scheduling)
      }
      // 不可选择
      else {
        uni.showToast({
          icon: 'none',
          title: '以此为开始时间的咨询时段不满足您的订单时段，请重新选择',
          duration: 3000
        })
      }
    },
    // 时间段显示
    hourShowText(obj1, obj2) {
      var startHour, endHour
      if (obj1.start_time >= obj2.start_time) {
        startHour = obj2.time.slice(0, 5)
        endHour = obj1.time.slice(-5)
      } else {
        startHour = obj1.time.slice(0, 5)
        endHour = obj2.time.slice(-5)
      }
      var text = startHour + '-' + endHour
      return text
    },
    //字符串转换数字
    textchangeNum(texts, length, reverse) {
      var text
      //截取后几位
      if (reverse) {
        text = texts.slice(-length)
      } else {
        text = texts.slice(0, length)
      }
      text = parseInt(text)
      return text
    },
    //下一个月
    nextMonth() {
      if (this.month + 1 > 12) {
        this.year++
        this.month = 1
      } else {
        this.month++
      }
      this.getScheduling()
    },
    //上一个月
    lastMonth() {
      if (this.month - 1 < 1) {
        // 选择年份大于今年，可到上一年
        if (this.year > this.currentYear) {
          this.year--
          this.month = 12
          this.getScheduling()
        }
      } else {
        // 选择年份大于今年，可到上一月
        if (this.year > this.currentYear) {
          this.month--
          this.getScheduling()
        }
        // 选择年份是今年，月份大于当月可到上一月
        else if (
          this.year == this.currentYear &&
          this.month > this.currentMonth
        ) {
          this.month--
          this.getScheduling()
        }
      }
    },
    openTime() {
      this.timeShow = true
    },
    // 关闭时间段
    closeTime() {
      this.currentIndex = 0
      this.scheduling_id = []
      this.old_scheduling_id.forEach((item, index) => {
        this.scheduling_id.push(item)
      })
      this.timeShow = false
    },
    openShow() {
      this.cancelShow = true
    },
    closeChangeShow() {
      this.changeShow = false
    },
    closeCancelShow() {
      this.cancelShow = false
    },
    openCancelShow() {
      this.cancelShow = true
    },
    // 关闭取消预约时间不足24h
    closeCancelTimeShow() {
      this.cancelTimeShow = false
    },
    // 关闭取消预约成功
    closeCancelSucessShow() {
      this.cancelSucessShow = false
    },
    // 更改预约时间不足24h
    closeChangeTimeShow() {
      this.changeTimeShow = false
    },
    closeAgreement(e) {
      this.agreementShow = e
    },
    // 子组件向父组件传值
    closeMain(e) {
      this.authoShow = e
    },
    onChange(e) {
      this.timeData = e
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
@import './consultDetail.less';
</style>
