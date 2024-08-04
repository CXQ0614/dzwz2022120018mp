<template>
  <!-- 首页-->
  <view class="uni-content">
    <u-navbar
      title="订单详情"
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
    <view class="center">
      <view class="center-box">
        <view class="center-head">
          <image
            :src="`${host}` + model.infoModel.head_sculpture"
            mode="aspectFill"
            class="center-heads"
          ></image>
        </view>
        <view class="center-top">
          <view class="center-name">{{ model.infoModel.name }}</view>
          <image
            :src="`${staticHost}/images/consultant/woman.png`"
            v-if="model.infoModel.sex_id == 0"
            class="center-sex"
          ></image>
          <image
            :src="`${staticHost}/images/consultant/man.png`"
            v-if="model.infoModel.sex_id == 1"
            class="center-sex"
          ></image>
        </view>
        <view class="center-item">
          <view class="center-item-title">预约时间：</view>
          <view class="center-item-text"
            >{{ model.recentlyDate }} {{ model.startTime }}-{{
              model.endTime
            }}</view
          >
        </view>
        <view class="center-item two">
          <view class="center-item-title getTitleHeight">咨询原因：</view>
          <view
            class="center-item-texts getTextHeight"
            :class="{ show: textShow, sl: isMore }"
          >
            {{ model.infoModel.reason }}
          </view>
          <view class="center-item-more" v-if="isMore" @click="moreClick">{{
            moreText
          }}</view>
        </view>
      </view>
      <!-- 预约人信息 -->
      <view class="center-detail">
        <view class="detail-top">
          <view class="detail-top-line"></view>
          <view class="detail-top-title">预约人信息</view>
        </view>
        <view class="detail-bottom">
          <view class="detail-item">
            <view class="detail-item-title">预约编号</view>
            <view class="detail-item-text">2202301161992323</view>
          </view>
          <view class="detail-item">
            <view class="detail-item-title">客户姓名</view>
            <view class="detail-item-text">{{ model.infoModel.name }}</view>
          </view>
          <view class="detail-item">
            <view class="detail-item-title">联系电话</view>
            <view class="detail-item-text">{{
              model.infoModel.telephone
            }}</view>
          </view>
          <view class="detail-item">
            <view class="detail-item-title">出生日期</view>
            <view class="detail-item-text">{{
              model.infoModel.birthDate
            }}</view>
          </view>
          <view class="detail-item">
            <view class="detail-item-title">所在地</view>
            <view class="detail-item-text">{{ model.infoModel.location }}</view>
          </view>
          <view class="detail-item">
            <view class="detail-item-title">情感状态</view>
            <view class="detail-item-text">{{
              model.infoModel.emotionState
            }}</view>
          </view>
          <!-- <view class="detail-item">
						<view class="detail-item-title">心理咨询经历</view>
						<view class="detail-item-text">首次</view>
					</view> -->
          <view class="detail-item">
            <view class="detail-item-title">确诊/治疗过严重精神疾病</view>
            <view
              class="detail-item-text"
              v-if="model.infoModel.is_depressed == 1"
              >有</view
            >
            <view
              class="detail-item-text"
              v-if="model.infoModel.is_depressed == 0"
              >无</view
            >
          </view>
          <view class="detail-item">
            <view class="detail-item-title">自杀/自残的行为或计划</view>
            <view
              class="detail-item-text"
              v-if="model.infoModel.is_idioctonia == 1"
              >有</view
            >
            <view
              class="detail-item-text"
              v-if="model.infoModel.is_idioctonia == 0"
              >无</view
            >
          </view>
          <view class="detail-item">
            <view class="detail-item-title">是否有心理咨询经历</view>
            <view class="detail-item-text">{{
              model.infoModel.adviceState
            }}</view>
          </view>
          <view class="detail-item">
            <view class="detail-item-title">主要困扰</view>
            <view class="detail-item-text">
              {{ model.infoModel.plagueText }}
            </view>
          </view>
          <view class="detail-item">
            <view class="detail-item-title">是否本人预约</view>
            <view class="detail-item-text" v-if="model.infoModel.is_self == 1"
              >是</view
            >
            <view class="detail-item-text" v-if="model.infoModel.is_self == 0"
              >否</view
            >
          </view>
        </view>
      </view>
      <!-- 订单信息 -->
      <view class="center-detail">
        <view class="detail-top">
          <view class="detail-top-line"></view>
          <view class="detail-top-title">订单信息</view>
        </view>
        <view class="detail-bottom">
          <view class="detail-item">
            <view class="detail-item-title">订单状态</view>
            <view class="detail-item-text" v-if="model.order_state == 10"
              >订单完成</view
            >
            <view class="detail-item-text" v-if="model.order_state == 20"
              >订单取消</view
            >
            <view class="detail-item-text" v-if="model.order_state == 5"
              >待服务</view
            >
          </view>
          <view class="detail-item">
            <view class="detail-item-title">订单金额</view>
            <view class="detail-item-text"
              >¥ {{ formatPrice(model.payment_amount) }}</view
            >
          </view>
          <view class="detail-item">
            <view class="detail-item-title">订单编号</view>
            <view class="detail-item-text">{{ model.order_number }}</view>
          </view>
        </view>
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
      </view>

      <!-- 评价 -->
      <view
        class="center-detail"
        v-if="model.user_evaluate != '' && model.user_evaluate != null"
      >
        <view class="detail-top">
          <view class="detail-top-line"></view>
          <view class="detail-top-title">评价</view>
        </view>
        <view class="detail-bottom">
          <view class="detail-bottom-text">{{ model.user_evaluate }}</view>
        </view>
      </view>
      <!-- 咨询报告 -->
      <view class="center-detail" v-if="model.order_state == 10">
        <view class="detail-top">
          <view class="detail-top-line"></view>
          <view class="detail-top-title">咨询报告</view>
        </view>
        <view class="detail-bottom">
          <textarea
            class="detail-bottom-textarea"
            maxlength="-1"
            placeholder-style="color: #999DA5;"
            placeholder="请填写宝贵意见..."
            v-model="report"
          ></textarea>
        </view>
      </view>

      <!-- 按钮 -->
      <view class="center-button" v-if="model.order_state == 10">
        <view class="button-cancel" @click="cancelClick">取消</view>
        <view class="button-submit" @click="submitClick">提交评价</view>
      </view>
    </view>

    <!-- loading -->
    <u-loading-page
      fontSize="20"
      iconSize="30"
      loadingText="加载中..."
      loadingMode="spinner"
      :loading="loading"
      bg-color="rgba(0,0,0,0.3)"
      color="#fff"
      loading-color="#fff"
    ></u-loading-page>
  </view>
</template>

<script>
import { publicMixin } from '../../mixin/public.js'
export default {
  mixins: [publicMixin],
  data() {
    return {
      color: 'transparent', // 导航栏的背景颜色
      titleColor: '#fff', // 标题和箭头颜色
      loading: false, // 全局的loading

      id: '', // 详情id

      model: {}, // 列表传过来的详情
      timer: '',
      leftTime: 0,

      isMore: false, // 是否显示更多
      moreText: '更多', // 查看更多文字
      report: '', // 咨询报告
      textShow: false, // 是否查看更多咨询原因

      stateList: [], // 婚姻状态参数
      plagueList: [], // 困扰
      experienceList: [] // 咨询记录
    }
  },
  onLoad(option) {
    if (option.id) {
      this.id = option.id
    }

    // 详情接口
    this.postConsultanOrderApiDetails()
  },
  methods: {
    // 详情接口
    postConsultanOrderApiDetails() {
      var that = this
      let params = {
        id: this.id,
        Token: uni.getStorageSync('consultantToken')
      }
      this.$api.consultant.postConsultanOrderApiDetails(params).then((res) => {
        if (res.errcode == 0) {
          console.log(res)
          this.model = res.model
          this.report = this.model.notes

          var time2 = new Date().valueOf() //当前日期
          // 待咨询 判断是否开始咨询
          if (res.model.order_state == 5) {
            this.leftTime =
              (this.model.consultant_start_time * 1000 - time2) / 1000 //距离咨询开始剩余时间
            console.log('剩余秒数', this.leftTime)
            if (this.leftTime > 0) {
              clearInterval(this.timer)
              this.timer = null
              this.timer = setInterval(function () {
                if (this.leftTime > 0) {
                  this.leftTime--
                }
                if (this.leftTime <= 0) {
                  this.model.isStart = true
                  clearInterval(this.timer)
                  this.timer = null
                }
              }, 1000)
            } else {
              this.model.isStart = true
            }
          }

          // 信息参数
          this.postOrderMoreConditions()
          // 获取元素高度
          this.$nextTick(() => {
            that.getReasonHeight()
          })
        }
      })
    },
    // 信息参数
    postOrderMoreConditions() {
      let params = {}
      this.$api.order.postOrderMoreConditions(params).then((res) => {
        if (res.errcode == 0) {
          this.stateList = res.stateList
          this.plagueList = res.plagueList
          this.experienceList = res.experienceList

          // 情感状态
          for (let key in this.stateList) {
            if (
              this.model.infoModel.emotional_state == this.stateList[key].value
            ) {
              this.model.infoModel.emotionState = this.stateList[key].label
            }
          }
          // 困扰
          var newkrList = []
          var newkrText = ''
          for (let key in this.plagueList) {
            if (this.model.infoModel.main_troubles_id) {
              var krList = this.model.infoModel.main_troubles_id.split(',')
              krList.forEach((item, index) => {
                if (item == '') {
                  krList.splice(index, 1)
                }
              })
              for (var i = 0; i < krList.length; i++) {
                if (krList[i] == this.plagueList[key].value) {
                  newkrList.push(this.plagueList[key].label)
                  if (i == krList.length - 1) {
                    newkrText += this.plagueList[key].label
                  } else {
                    newkrText += this.plagueList[key].label + '、'
                  }
                }
              }
            }
          }
          this.model.infoModel.plagueList = newkrList
          this.model.infoModel.plagueText = newkrText
          // 咨询记录
          for (let key in this.experienceList) {
            if (
              this.model.infoModel.is_advice == this.experienceList[key].value
            ) {
              this.model.infoModel.adviceState = this.experienceList[key].label
            }
          }
        }
      })
    },
    // 提交备注
    postConsultanOrderApiNotes() {
      var self = this
      this.loading = true
      let params = {
        id: this.model.order_id,
        notes: this.report,
        Token: uni.getStorageSync('consultantToken')
      }
      this.$api.consultant.postConsultanOrderApiNotes(params).then((res) => {
        self.loading = false
        if (res.errcode == 0) {
          uni.showModal({
            title: '提示',
            content: '提交成功',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                uni.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
      })
    },
    // 根据咨询原因的高度显示查看更多
    getReasonHeight() {
      var that = this
      var titleHeight = ''
      uni
        .createSelectorQuery()
        .in(this)
        .select('.getTitleHeight')
        .boundingClientRect((data) => {
          titleHeight = data.height
        })
        .exec()

      uni
        .createSelectorQuery()
        .in(this)
        .select('.getTextHeight')
        .boundingClientRect((datas) => {
          if (datas.height > titleHeight * 2) {
            that.isMore = true
          }
        })
        .exec()
    },
    // 点击查看更多
    moreClick() {
      if (!this.textShow) {
        this.textShow = true
        this.moreText = '收起'
      } else {
        this.textShow = false
        this.moreText = '更多'
      }
    },
    // 点击取消
    cancelClick() {
      uni.navigateBack({
        delta: 1
      })
    },
    // 点击提交
    submitClick() {
      var self = this
      if (this.report == '') {
        uni.showToast({
          icon: 'none',
          title: '请填写宝贵意见...',
          duration: 1500
        })
        return false
      }

      // 提交备注
      this.postConsultanOrderApiNotes()
    },
    // 开启视频通话
    enterConsult() {
      var self = this
      console.log(' self.model', self.model);
      console.log('uni.getStorageSync(NickName)', self.model.name)
      console.log('self.getOpenId()', self.getOpenId())
      console.log('self.model.associationModel.nickname', self.model.main_title)
      console.log(
        'self.model.memberModel.open_id',
        self.model.memberModel.open_id
      )
      wx.setEnable1v1Chat({
        enable: true,
        success: (res) => {
          console.log(res, 'res')
          wx.join1v1Chat({
            caller: {
              nickname: self.model.main_title,
              openid: self.getOpenId()
            },
            listener: {
              nickname: self.model.name,
              openid: self.model.memberModel.open_id
            },
            success(res) {
              console.log('[呼叫成功]res', res)
              console.log('呼叫方：', self.getOpenId())
              console.log('接听方：', self.model.memberModel.open_id)
            },
            fail(err) {
              console.log('[呼叫失败]err', err)
            }
          })
        },
        fail: (err) => {
          console.log('err', err)
        }
      })
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
@import './detail.less';
</style>
