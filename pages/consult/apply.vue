<template>
  <!-- 咨询师预约-->
  <view class="uni-content">
    <u-navbar
      title="咨询师预约"
      :bgColor="color"
      :fixed="true"
      :safeAreaInsetTop="true"
      :placeholder="true"
    ></u-navbar>
    <image
      :src="`${staticHost}/images/shared/banner.png`"
      class="banner"
    ></image>
    <view class="apply-box">
      <view class="apply-top">
        <view class="apply-item" :class="{ active: step == 0 }">
          <view class="item-title">完善信息</view>
          <view class="item-line"></view>
          <image
            :src="`${staticHost}/images/order/white-arrow.png`"
            class="arrow"
          ></image>
        </view>
        <view class="apply-item" :class="{ active: step == 1 }">
          <view class="item-title">订单详情</view>
          <view class="item-line"></view>
          <image
            :src="`${staticHost}/images/order/white-arrow.png`"
            class="arrow"
          ></image>
        </view>
      </view>
      <view class="info" v-if="step == 0">
        <view class="info-top">
          <view class="public-title">咨询人信息</view>
          <view class="info-box">
            <view class="info-item">
              <view class="info-left">更改头像</view>
              <view class="info-right">
                <view class="info-img">
                  <button
                    class="head-btn"
                    open-type="chooseAvatar"
                    @chooseavatar="chooseavatar"
                  ></button>
                  <image
                    :src="order_info.head_sculpture"
                    class="head-img"
                  ></image>
                </view>
                <u-icon name="arrow-right" color="#C3C3CD"></u-icon>
              </view>
            </view>
            <view class="info-item">
              <view class="info-left">真实姓名</view>
              <view class="info-right"
                ><input
                  class="info-value"
                  v-model="order_info.name"
                  placeholder="请输入真实姓名"
                  placeholder-class="placeholder"
              /></view>
            </view>
            <view class="info-item">
              <view class="info-left">联系电话</view>
              <view class="info-right"
                ><input
                  class="info-value"
                  type="number"
                  v-model="order_info.telephone"
                  placeholder="请输入联系电话"
                  placeholder-class="placeholder"
              /></view>
            </view>
            <view class="info-item line">
              <view class="info-left">是否非本人预约</view>
              <view class="info-right">
                <view
                  class="radio-item"
                  :class="{ checked: order_info.is_self == '1' }"
                  @click="order_info.is_self = '1'"
                >
                  <view class="item-dot-box"
                    ><view class="item-dot"></view
                  ></view>
                  是
                </view>
                <view
                  class="radio-item"
                  :class="{ checked: order_info.is_self == '0' }"
                  @click="order_info.is_self = '0'"
                >
                  <view class="item-dot-box"
                    ><view class="item-dot"></view
                  ></view>
                  否
                </view>
              </view>
            </view>
            <view class="info-item" @click="birthDayShow = true">
              <view class="info-left">出生日期</view>
              <view class="info-right">
                {{ order_info.birth_date }}
                <view class="right-tip" v-if="order_info.birth_date == ''"
                  >请选择</view
                >
                <u-icon name="arrow-right" color="#C3C3CD"></u-icon>
              </view>
            </view>
            <view class="info-item">
              <view class="info-left">性别</view>
              <view class="info-right">
                <view
                  class="radio-item"
                  :class="{ checked: order_info.sex_id == item.value }"
                  @click="order_info.sex_id = item.value"
                  v-for="(item, index) in sexList"
                  :key="index"
                >
                  <view class="item-dot-box"
                    ><view class="item-dot"></view
                  ></view>
                  {{ item.label }}
                </view>
              </view>
            </view>
            <!-- 选择地区 -->
            <picker mode="region" @change="bindRegionChange">
              <view class="info-item">
                <view class="info-left">所在地</view>
                <view class="info-right">
                  {{ order_info.location }}
                  <view class="right-tip" v-if="order_info.location == ''"
                    >请选择</view
                  >
                  <u-icon name="arrow-right" color="#C3C3CD"></u-icon>
                </view>
              </view>
            </picker>
            <view class="info-item line pb0">
              <view class="info-left">情感状态</view>
              <view class="info-right">
                <view
                  class="checked-item"
                  :class="{ checked: order_info.emotional_state == item.value }"
                  @click="order_info.emotional_state = item.value"
                  v-for="(item, index) in stateList"
                >
                  {{ item.label }}
                </view>
              </view>
            </view>
            <view class="info-item line">
              <view class="info-left"
                >是否确诊过/正在治疗严重精神疾病(例如重度抑郁、精神分裂、人格障碍、双相障碍等)</view
              >
              <view class="info-right">
                <view
                  class="radio-item"
                  :class="{ checked: order_info.is_depressed == '0' }"
                  @click="order_info.is_depressed = '0'"
                >
                  <view class="item-dot-box"
                    ><view class="item-dot"></view
                  ></view>
                  沒有
                </view>
                <view
                  class="radio-item"
                  :class="{ checked: order_info.is_depressed == '1' }"
                  @click="order_info.is_depressed = '1'"
                >
                  <view class="item-dot-box"
                    ><view class="item-dot"></view
                  ></view>
                  有
                </view>
              </view>
            </view>
            <view class="info-item line">
              <view class="info-left"
                >近一个月内是否有自杀/自残的行为或计划</view
              >
              <view class="info-right">
                <view
                  class="radio-item"
                  :class="{ checked: order_info.is_idioctonia == '0' }"
                  @click="order_info.is_idioctonia = '0'"
                >
                  <view class="item-dot-box"
                    ><view class="item-dot"></view
                  ></view>
                  沒有
                </view>
                <view
                  class="radio-item"
                  :class="{ checked: order_info.is_idioctonia == '1' }"
                  @click="order_info.is_idioctonia = '1'"
                >
                  <view class="item-dot-box"
                    ><view class="item-dot"></view
                  ></view>
                  有
                </view>
              </view>
            </view>
            <view class="info-item line pb0">
              <view class="info-left">是否有心理咨询经历</view>
              <view class="info-right">
                <view
                  class="checked-item"
                  :class="{ checked: order_info.is_advice == item.value }"
                  @click="order_info.is_advice = item.value"
                  v-for="(item, index) in experienceList"
                >
                  {{ item.label }}
                </view>
              </view>
            </view>
            <view class="info-item line pb0">
              <view class="info-left">主要困扰（可多选）</view>
              <view class="info-right">
                <view
                  class="checked-item"
                  :class="{
                    checked:
                      order_info.mainTroublesIdList.indexOf(item.value) != -1
                  }"
                  @click="chooseQustion(item.value)"
                  v-for="(item, index) in plagueList"
                >
                  {{ item.label }}
                </view>
              </view>
            </view>
            <view class="info-item line">
              <view class="info-left">简述咨询原因</view>
              <view class="info-right">
                <textarea
                  maxlength="300"
                  class="info-textarea"
                  v-model="order_info.reason"
                ></textarea>
                <view class="info-length"
                  >({{ order_info.reason.length }}/300)</view
                >
              </view>
            </view>
          </view>
        </view>
        <view class="info-bottom">
          <view class="public-title">紧急联系人信息</view>
          <view class="info-box">
            <view class="info-item">
              <view class="info-left">联系人姓名</view>
              <view class="info-right"
                ><input
                  class="info-value"
                  v-model="order_info.emergency_contact"
                  placeholder="请输入联系人姓名"
                  placeholder-class="placeholder"
              /></view>
            </view>
            <view class="info-item">
              <view class="info-left">联系电话</view>
              <view class="info-right">
                <input
                  class="info-value"
                  type="number"
                  v-model="order_info.emergency_mobile"
                  placeholder="请输入联系电话"
                  placeholder-class="placeholder"
                />
              </view>
            </view>
            <view class="info-item line pb0">
              <view class="info-left">关系（单选）</view>
              <view class="info-right">
                <view
                  class="checked-item"
                  :class="{ checked: order_info.relationship == item.value }"
                  @click="order_info.relationship = item.value"
                  v-for="(item, index) in relationshipList"
                >
                  {{ item.label }}
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="next" @click="next">下一步</view>
      </view>
      <view class="order" v-else>
        <view class="person-info">
          <view class="person-top">
            <view class="public-title">预约人信息</view>
            <view class="edit" @click="changeStep(0)">
              修改信息
              <image
                :src="`${staticHost}/images/shared/blue-arrow.png`"
                class="arrow"
              ></image>
            </view>
          </view>
          <view class="person-bottom">
            <view class="person-item">
              <view class="item-key">姓名：</view>
              <view class="item-value">{{ order_info.name }}</view>
            </view>
            <view class="person-item">
              <view class="item-key">年龄：</view>
              <view class="item-value">{{ age }}岁</view>
            </view>
            <view class="person-item">
              <view class="item-key">电话：</view>
              <view class="item-value">{{ order_info.telephone }}</view>
            </view>
            <view class="person-item">
              <view class="item-key">性别：</view>
              <view class="item-value">{{ sex }}</view>
            </view>
          </view>
        </view>
        <view class="order-info">
          <view class="public-title">订单信息</view>
          <view class="detail-item">
            <image
              :src="`${host}` + model.img_url"
              class="item-img"
              mode="aspectFill"
            ></image>
            <view class="item-right">
              <view class="item-name">咨询师：{{ model.main_title }}</view>
              <view class="item-type"
                >视频咨询、{{ formatPrice(model.price) }}元 / 50分钟</view
              >
              <view class="item-content">
                <view class="item-price-title">咨询费用：</view>
                <view class="item-price">
                  <text>￥</text>
                  {{ formatPrice(model.price) }}
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="apply-info">
          <view class="public-title">预约信息</view>
          <view class="apply-info-bottom">
            <view class="info-bottom-item" @click="openTime">
              <view class="bottom-item-left">预约时间：</view>
              <view class="bottom-item-choose" v-if="scheduling.length <= 0">
                请选择预约时间
                <image
                  :src="`${staticHost}/images/shared/blue-arrow.png`"
                  class="arrow"
                ></image>
              </view>
              <view class="bottom-item-checked" v-else>
                {{ scheduling[0].startYear }}-{{ scheduling[0].startMonth }}-{{
                  scheduling[0].startDay
                }}
                ({{ week }})
                <text v-if="scheduling.length == 1">{{
                  scheduling[0].time
                }}</text>
                <text v-if="scheduling.length >= 2">{{
                  hourShowText(scheduling[0], scheduling[scheduling.length - 1])
                }}</text>
                <image
                  :src="`${staticHost}/images/shared/black-arrow.png`"
                  class="arrow"
                ></image>
              </view>
            </view>
            <view class="info-bottom-item">
              <view class="bottom-item-left">咨询方式：</view>
              <view class="bottom-item-right">视频咨询</view>
            </view>
          </view>
        </view>
        <view class="pay-info">
          <view class="public-title">支付方式选择</view>
          <view class="pay-bottom">
            <view class="pay-item" @click="pay_way = 1">
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
                  v-if="pay_way == 1"
                ></image>
                <view class="item-check" v-else></view>
              </view>
            </view>
            <view class="pay-item" @click="pay_way = 2">
              <view class="pay-left">
                <image
                  :src="`${staticHost}/images/shared/money.png`"
                  class="pay-icon"
                ></image>
                余额支付
                <text class="money__count"> （余额：{{ money }}）</text>
              </view>
              <view class="pay-checked">
                <image
                  :src="`${staticHost}/images/shared/checked.png`"
                  class="item-checked"
                  v-if="pay_way == 2"
                ></image>
                <view class="item-check" v-else></view>
              </view>
            </view>
          </view>
        </view>
        <view class="fix-bottom">
          <view class="fix-bottom-top">
            <image
              :src="`${staticHost}/images/shared/checked.png`"
              class="agreed"
              v-if="agree"
              @click="agree = !agree"
            ></image>
            <view class="agree" v-else @click="agree = !agree"></view>
            <view class="agree-text">
              我已阅读并同意
              <span class="blue" @click="openAgreeMent">《咨询服务协议》</span
              >。
            </view>
          </view>
          <view class="fix-bottoms">
            <view class="total" v-if="scheduling_id.length <= 0">
              合计：
              <span class="red">---</span>
            </view>
            <view class="total" v-else>
              合计：
              <span class="symbol">¥</span>
              <span class="money">{{
                formatPrice(multiply(model.price, scheduling_id.length))
              }}</span>
            </view>
            <view class="pay-btn" @click="createOrder">提交订单</view>
          </view>
        </view>
        <view @click="openExchange()" class="customer-icon"
          ><image
            :src="`${staticHost}/images/shared/customer-icon.png`"
            class="icon"
          ></image
        ></view>
      </view>
      <!-- 选择出生日期 -->
      <u-datetime-picker
        :minDate="-2209017943000"
        ref="datetimePicker"
        :show="birthDayShow"
        v-model="date"
        mode="date"
        :formatter="formatter"
        @cancel="birthDayShow = false"
        @confirm="dateConfirm"
      ></u-datetime-picker>
    </view>

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
                <text v-if="scheduling.length >= 2">{{
                  hourShowText(scheduling[0], scheduling[scheduling.length - 1])
                }}</text>
              </view>
            </view>
            <view class="btn" @click="confirmTime">确定</view>
          </view>
        </view>
      </view>
    </u-popup>

    <!-- 咨询服务协议 -->
    <agreement
      :name="order_info.name"
      :consultant="model.main_title"
      type="0"
      :show="agreementShow"
      :second="agreeSecond"
      v-on:secondChange="agreeSecondChange"
      v-on:closeAgreement="closeAgreement"
      v-on:agreeAgreement="agreeAgreement"
    ></agreement>

    <!-- 知情同意 -->
    <agreement
      :name="order_info.name"
      type="3"
      :show="kownShow"
      :second="kownSecond"
      v-on:secondChange="kownSecondChange"
      v-on:closeAgreement="closeKown"
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
      color: 'transparent', // 导航栏的背景颜色
      step: 0,
      agreementShow: false, //打开咨询服务协议
      kownShow: false, //打开知情同意协议
      agreeSecond: 10, // 咨询服务协议阅读秒数
      kownSecond: 10, // 知情同意阅读秒数
      timeShow: false, // 选择时间段
      birthDayShow: false,
      payFlag: true,
      order_id: 0, // 订单id
      order_number: '', // 订单编号

      year: '', // 选择咨询日期的年
      month: '', // 选择咨询日期的月
      currentYear: '', // 今年
      currentMonth: '', // 今月
      date: Number(new Date()),
      maxDate: 0, // 最大日期时间戳
      currentIndex: 0, // 咨询时间段选择index

      model: {},
      dateList: [],
      dates: [],

      age: 0, // 年龄
      sex: '', // 性别
      pay_way: -1, // 1 微信 2余额
      agree: false, //同意条款

      scheduling_id: [], // 时间id
      scheduling: [], // 时间 0 开始 1结束
      week: '', //周几

      sexList: [], // 性别列表
      stateList: [], // 情感状态
      experienceList: [], //是否有心理咨询经历
      plagueList: [], //主要困扰
      relationshipList: [], //关系
      order_id: 0,
      order_info: {
        head_sculpture: '/images/order/avater.png',
        name: '',
        is_self: '1',
        birth_date: '',
        sex_id: '0',
        location: '',
        emotional_state: '',
        is_depressed: '0', //正在治疗严重精神疾病
        is_idioctonia: '0', //自残的行为或计划
        is_advice: '', // 是否有心理咨询经历
        mainTroublesIdList: [], //主要困扰
        reason: '',
        emergency_contact: '', //紧急联系人姓名
        emergency_mobile: '', //紧急联系人电话
        relationship: '' //紧急联系人关系
      },
      exchangeShow: false, // 客服
      money: ''
    }
  },
  onShow() {
    this.$refs.datetimePicker.setFormatter(this.formatter)
    this.maxDate = new Date().valueOf()
  },
  onLoad(option) {
    this.year = new Date().getFullYear()
    this.month = new Date().getMonth() + 1
    this.currentYear = this.year
    this.currentMonth = this.month
    if (option) {
      this.Id = option.id
    }
    //咨询师详情
    this.getDetail()
    //获取用户信息
    this.getUserIofo()
    //下单 信息所用参数
    this.postOrderMoreConditions()
    //排期时间段
    this.getScheduling()
  },
  methods: {
    openExchange() {
      this.exchangeShow = true
    },
    closeExchange(e) {
      this.exchangeShow = e
    },
    //获取用户信息
    getUserIofo() {
      var self = this
      let params = {}
      this.$api.user.getUserInfo(params).then((res) => {
        if (res.errcode == 0) {
          if (res.model.head_portrait) {
            self.order_info.head_sculpture = res.model.head_portrait // 头像
          }
          if (res.model.name) {
            self.order_info.name = res.model.name // 姓名
          }
          self.order_info.telephone = res.model.mobile
          if (res.model.address) {
            self.order_info.location = res.model.address
          }
          if (res.model.birthDate) {
            self.date = Number(new Date(res.model.birthDate))
            console.log(Number(new Date(res.model.birthDate)))
            console.log(Number(new Date()))
            self.order_info.birth_date = res.model.birthDate
            var ageObj = self.getAge(res.model.birthDate)
            self.age = ageObj.year // 年龄
          }
          self.order_info.sex_id = res.model.sex_id
          if (res.model.emergency_contact) {
            self.order_info.emergency_contact = res.model.emergency_contact //紧急联系人姓名
          }
          if (res.model.emergency_mobile) {
            self.order_info.emergency_mobile = res.model.emergency_mobile //紧急联系人电话
          }
          self.order_info.relationship = res.model.relationship //紧急联系人关系
          self.money = res.model.money
        }
      })
    },
    //下单 信息所用参数
    postOrderMoreConditions() {
      var self = this
      let params = {
        association_type: 1 // 1咨询 2课程 3测评
      }
      this.$api.order.postOrderMoreConditions(params).then((res) => {
        if (res.errcode == 0) {
          self.sexList = res.sexList
          self.stateList = res.stateList
          self.experienceList = res.experienceList
          self.plagueList = res.plagueList
          self.relationshipList = res.relationshipList
        }
      })
    },
    //咨询师详情
    getDetail() {
      var self = this
      let params = {
        id: this.Id
      }
      this.$api.consultant.postConsultanDetails(params).then((res) => {
        if (res.errcode == 0) {
          self.model = res.model
        }
      })
    },
    //下单
    createOrder() {
      if (this.scheduling_id.length <= 0) {
        uni.showToast({
          icon: 'none',
          title: '请选择预约时间',
          duration: 3000
        })
        return false
      }
      if (this.pay_way == -1) {
        uni.showToast({
          icon: 'none',
          title: '请选择支付方式',
          duration: 3000
        })
        return false
      }
      if (!this.agree) {
        uni.showToast({
          icon: 'none',
          title: '请同意《咨询服务协议》和《知情同意》',
          duration: 3000
        })
        return false
      }
      if (!this.payFlag) {
        return false
      }
      var self = this
      let params = {
        association_type: 1, // 关联类型 1咨询 2课程 3测评
        association_id: this.Id, //关联详情id
        scheduling_id: this.scheduling_id, // 时间
        pay_way: this.pay_way, //支付方式
        order_info: this.order_info
      }
      this.$api.order.postOrderGenerateOrder(params).then((res) => {
        self.payFlag = true
        if (res.errcode == 0) {
          console.log(res)
          self.order_number = res.order_number
          self.order_id = res.order_id
          // 微信支付
          if (self.pay_way == 1) {
            self.pay()
            return false
          }

          // 这里需要走支付 支付成功跳转到成功页 未成功跳转到订单详情页
          uni.redirectTo({
            url: '/pages/order/result?type=1&id=' + res.order_id
          })

          // uni.redirectTo({
          // 	url: '/pages/order/consultDetail?id=' + res.order_id
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
                  url: '/pages/order/result?type=1&id=' + res.order_id
                })
              }
            },
            fail(payRes) {
              if (payRes.errMsg === 'requestPayment:fail cancel') {
                uni.redirectTo({
                  url: '/pages/order/courseDetail?id=' + res.order_id
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
    //排期时间段
    getScheduling() {
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
        id: this.Id, //关联详情id
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
          self.dates = []
          self.dateList.forEach((item, index) => {
            var obj = {
              name: item.date + item.week
            }
            self.dates.push(obj)
          })
          self.currentIndex = 0
          self.scheduling = []
          self.scheduling_id = []
        }
      })
    },
    //选择排期
    chooseTime(item, index) {
      // 已过期或者被占用不可选择
      if (item.is_occupy == 1 || item.is_expire == 1) {
        return false
      }
      var self = this
      var indexOf = -1 // 用于判断是否已选择
      this.scheduling.forEach((schedulingItem, schedulingIndex) => {
        if (schedulingItem.scheduling_id == item.scheduling_id) {
          indexOf = schedulingIndex
        }
      })

      // 获取开始时间 结束时间 index
      var arrayIndex = []
      this.dateList[this.currentIndex].list.forEach((dateItem, dateIndex) => {
        this.scheduling.forEach((schedulingItem, schedulingIndex) => {
          if (dateItem.scheduling_id == schedulingItem.scheduling_id) {
            arrayIndex.push(dateIndex)
          }
        })
      })

      // 未选择过
      if (arrayIndex.length == 0) {
        this.scheduling.push(item)
      } else {
        // 取消选择
        if (indexOf != -1) {
          if (arrayIndex.length == 1) {
            this.scheduling = []
          } else {
            //取消第一个
            if (index == arrayIndex[0]) {
              this.scheduling.shift()
            }
            //取消最后一个
            else if (index == arrayIndex[arrayIndex.length - 1]) {
              this.scheduling.pop()
            } else {
              uni.showToast({
                icon: 'none',
                title: '咨询时间段必须连续',
                duration: 3000
              })
            }
          }
        } else {
          var startIndex, endIndex
          if (arrayIndex.length == 1) {
            if (index > arrayIndex[0]) {
              startIndex = arrayIndex[0]
              endIndex = index
            }
            if (index < arrayIndex[0]) {
              startIndex = index
              endIndex = arrayIndex[0]
            }
          } else {
            if (index > arrayIndex[arrayIndex.length - 1]) {
              startIndex = arrayIndex[0]
              endIndex = index
            }
            if (index < arrayIndex[0]) {
              startIndex = index
              endIndex = arrayIndex[arrayIndex.length - 1]
            }
          }
          // 获取中间是否被占用 或过期
          var is_occupy = false
          this.dateList[this.currentIndex].list.forEach(
            (dateItem, dateIndex) => {
              if (dateIndex >= startIndex && dateIndex <= endIndex) {
                if (dateItem.is_occupy == 1 || dateItem.is_expire == 1) {
                  is_occupy = true
                }
              }
            }
          )
          this.scheduling = []
          // 被占用选择最后一个
          if (is_occupy) {
            this.scheduling.push(item)
          } else {
            this.dateList[this.currentIndex].list.forEach(
              (dateItem, dateIndex) => {
                if (dateIndex >= startIndex && dateIndex <= endIndex) {
                  this.scheduling.push(dateItem)
                }
              }
            )
          }
        }
      }

      // 获取选中的时间id
      this.scheduling_id = []
      this.scheduling.forEach((dateItem, dateIndex) => {
        self.scheduling_id.push(dateItem.scheduling_id)
      })
      this.week = this.dateList[this.currentIndex].week
      console.log('self.scheduling_id', self.scheduling_id)
      console.log('this.scheduling', this.scheduling)
    },
    next() {
      if (
        this.order_info.head_sculpture == '' ||
        this.order_info.head_sculpture ==
          'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132'
      ) {
        uni.showToast({
          icon: 'none',
          title: '请上传头像',
          duration: 3000
        })
        return false
      }
      if (this.order_info.name == '') {
        uni.showToast({
          icon: 'none',
          title: '请输入真实姓名',
          duration: 3000
        })
        return false
      }
      if (this.order_info.telephone == '') {
        uni.showToast({
          icon: 'none',
          title: '请输入联系电话',
          duration: 3000
        })
        return false
      }
      if (this.order_info.birth_date == '') {
        uni.showToast({
          icon: 'none',
          title: '请选择出生日期',
          duration: 3000
        })
        return false
      }
      if (this.order_info.sex_id === '') {
        uni.showToast({
          icon: 'none',
          title: '请选择性别',
          duration: 3000
        })
        return false
      }
      if (this.order_info.location == '') {
        uni.showToast({
          icon: 'none',
          title: '请选择所在地',
          duration: 3000
        })
        return false
      }
      if (this.order_info.emotional_state == '') {
        uni.showToast({
          icon: 'none',
          title: '请选择情感状态',
          duration: 3000
        })
        return false
      }
      if (this.order_info.is_advice == '') {
        uni.showToast({
          icon: 'none',
          title: '请选择是否有心理咨询经历',
          duration: 3000
        })
        return false
      }
      if (this.order_info.mainTroublesIdList.length == 0) {
        uni.showToast({
          icon: 'none',
          title: '请选择主要困扰',
          duration: 3000
        })
        return false
      }
      if (this.order_info.reason == '') {
        uni.showToast({
          icon: 'none',
          title: '请填写咨询原因',
          duration: 3000
        })
        return false
      }
      if (this.order_info.emergency_contact == '') {
        uni.showToast({
          icon: 'none',
          title: '请输入联系人姓名',
          duration: 3000
        })
        return false
      }
      if (this.order_info.emergency_mobile == '') {
        uni.showToast({
          icon: 'none',
          title: '请输入联系人联系电话',
          duration: 3000
        })
        return false
      }
      if (this.order_info.relationship == '') {
        uni.showToast({
          icon: 'none',
          title: '请选择联系人关系',
          duration: 3000
        })
        return false
      }
      console.log(this.order_info)
      this.changeStep(1)
    },
    changeStep(step) {
      this.step = step
      this.sexList.forEach((item, index) => {
        if (this.order_info.sex_id == item.value) {
          this.sex = item.label
        }
      })
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
    },
    //选择困扰
    chooseQustion(id) {
      var index = this.order_info.mainTroublesIdList.indexOf(id)
      if (index == -1) {
        this.order_info.mainTroublesIdList.push(id)
      } else {
        this.order_info.mainTroublesIdList.splice(index, 1)
      }
    },
    //点击调用手机相册/拍照
    chooseavatar: function (e) {
      var self = this
      console.log(e)
      this.uploadImg(e.detail.avatarUrl, function (res) {
        self.order_info.head_sculpture = res
        console.log('上传头像地址', res)
      })

      // oss获取Sign 每次传图传视频都调用一次
      // this.getStoreOssSign(function() {
      // 	// // 上传oss 0是图片 1是视频
      // 	self.uploadOss(0, e.detail.avatarUrl, function(res) {
      // 		console.log('123', res);
      // 		self.info.avater = res;
      // 	});
      // });
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
    bindRegionChange(e) {
      this.order_info.location =
        e.detail.value[0] + e.detail.value[1] + e.detail.value[2]
    },
    //阅读秒数变化
    agreeSecondChange(e) {
      this.agreeSecond = e
    },
    kownSecondChange(e) {
      this.kownSecond = e
    },
    //关闭协议
    closeAgreement(e) {
      this.agreementShow = e
    },
    agreeAgreement(e) {
      this.agree = e
    },
    closeKown(e) {
      this.kownShow = e
    },
    openAgreeMent() {
      this.agreementShow = true
    },
    openKown() {
      this.kownShow = true
    },
    openTime() {
      this.timeShow = true
    },
    // 关闭时间段
    closeTime() {
      this.timeShow = false
    },
    // 确认时间段
    confirmTime() {
      if (this.scheduling_id.length <= 0) {
        uni.showToast({
          icon: 'none',
          title: '请选择咨询时间段',
          duration: 3000
        })
        return false
      }
      this.timeShow = false
    },
    // 更改咨询时段日期
    changeDay(e) {
      this.currentIndex = e.index
      this.scheduling = []
      this.scheduling_id = []
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
    // 格式化
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`
      }
      if (type === 'month') {
        return `${value}月`
      }
      if (type === 'day') {
        return `${value}日`
      }
      return value
    },
    dateConfirm(e) {
      this.birthDayShow = false
      const timeFormat = uni.$u.timeFormat // 格式化
      let dates = timeFormat(e.value, 'yyyy-mm-dd')
      this.order_info.birth_date = dates
      console.log(dates)
      var ageObj = this.getAge(dates)
      this.age = ageObj.year // 年龄
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
