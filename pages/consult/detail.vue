<template>
  <!-- 心理咨询-->
  <view class="uni-content">
    <u-navbar title=" " :bgColor="color" :safeAreaInsetTop="true"></u-navbar>
    <image :src="`${host}` + bannerList[0].url" class="banner"></image>
    <view class="detail-top">
      <view class="detail__title">
        <view class="left-title">{{ model.main_title }}</view>
        <view
          class="detail-right"
          v-if="model.isInterest == 1"
          @click="toCollect(2)"
        >
          <image
            :src="`${staticHost}/images/order/collect.png`"
            class="collect-icon"
          ></image>
          <view class="right-text">已收藏</view>
        </view>
        <view class="detail-right" v-else @click="toCollect(1)">
          <image
            :src="`${staticHost}/images/order/uncollect.png`"
            class="collect-icon"
          ></image>
          <view class="right-text">收藏</view>
        </view>
      </view>
      <u-parse :content="model.subtitle" class="left-content"></u-parse>
      <!-- <view class="left-content">{{ model.subtitle }}</view> -->
      <view class="left-time" v-if="model.recentlyTomorrow > 0"
        >可预约{{ model.recentlyDate + ' ' + model.recentlyTime }}</view
      >
    </view>
    <view class="detail-box">
      <u-sticky :offset-top="navbarHeight" bgColor="fff" zIndex="10">
        <view class="detail-nav">
          <view
            class="nav-item"
            :class="{ active: current === 0 }"
            @click="changeTag(0)"
            >咨询</view
          >
          <view
            class="nav-item"
            :class="{ active: current === 1 }"
            @click="changeTag(1)"
            >简介</view
          >
          <view
            class="nav-item"
            :class="{ active: current === 2 }"
            @click="changeTag(2)"
            >擅长</view
          >
          <view
            class="nav-item"
            :class="{ active: current === 3 }"
            @click="changeTag(3)"
            >排班</view
          >
          <view
            class="nav-item"
            :class="{ active: current === 4 }"
            @click="changeTag(4)"
            v-if="list.length > 0"
            >课程</view
          >
        </view>
      </u-sticky>
      <view class="service" id="service">
        <view class="public-title">咨询服务</view>
        <view class="service-bottom">
          <view class="service-left">
            <image
              :src="`${staticHost}/images/order/video.png`"
              class="video-icon"
            ></image>
            <view class="service-title">视频咨询</view>
            <view class="service-price">
              ¥
              <span class="bold">{{ formatPrice(model.price) }}</span>
              /次
            </view>
          </view>
          <view class="service-btn" @click="buy" v-if="model.isReservation"
            >立即预约</view
          >
          <view class="service-btn disable" v-else>立即预约</view>
        </view>
      </view>
      <view class="line"></view>
      <view class="introduce" id="introduce">
        <view class="introduce-top">
          <view class="public-title">咨询师简介</view>
          <!-- <view class="more" :class="{ active: showIntroduce }" @click="clickMore('showIntroduce')">
						<text v-if="showIntroduce">收起</text>
						<text v-else>更多</text>
						<image :src="`${staticHost}/images/home/arrow.png`" class="arrow-icon"></image>
					</view> -->
        </view>
        <view class="introduce-bottom">
          <u-parse :content="model.contents"></u-parse>            
        </view>
      </view>
      <view class="line"></view>
      <view class="good" id="good">
        <view class="public-title">擅长领域</view>
        <view class="good-bottom">
          <view class="good-item" v-for="(item, index) in model.classAll">{{
            item
          }}</view>
        </view>
      </view>
      <view class="line"></view>
      <view class="calendar" id="calendar">
        <view class="calendar-top">
          <view class="public-title">排班日历</view>
          <view
            class="more"
            :class="{ active: showCalendar }"
            @click="clickMore('showCalendar')"
          >
            <text v-if="showCalendar">收起</text>
            <text v-else>更多</text>
            <image
              :src="`${staticHost}/images/home/arrow.png`"
              class="arrow-icon"
            ></image>
          </view>
        </view>
        <view class="calendar-bottom" :class="{ active: showCalendar }">
          <view
            class="calendar-item"
            :class="{ full: item.is_reservation == 0 }"
            v-for="(item, index) in dateList"
            :key="index"
          >
            <view class="item-weekday">{{ item.week }}</view>
            <view class="item-date">{{ item.date }}</view>
            <view
              class="item-state"
              v-if="item.is_reservation == 1"
              @click="buy"
              >可预约</view
            >
            <view class="item-state" v-else>已约满</view>
          </view>
        </view>
      </view>
      <view class="line"></view>
      <view class="course" id="course" v-if="list.length > 0">
        <view class="course-top">
          <view class="public-title">相关课程推荐</view>
          <navigator url="/pages/course/index" hover-class="none" class="more">
            更多
            <image
              :src="`${staticHost}/images/home/arrow.png`"
              class="arrow-icon"
            ></image>
          </navigator>
        </view>
        <view class="course-bottom">
          <navigator
            :url="'/pages/course/detail?id=' + item.info_id"
            hover-class="none"
            class="list-item"
            v-for="(item, index) in list"
          >
            <image
              :src="`${host}` + item.list_img_url"
              class="item-img"
              mode="aspectFill"
            ></image>
            <view class="item-right">
              <view class="item-title">{{ item.main_title }}</view>
              <view class="item-text">{{ item.subtitle }}</view>
              <view class="item-content">
                <view class="item-task">
                  <text>讲师：</text>
                  <text
                    v-for="(items, indexs) in item.teacherList"
                    :key="indexs"
                    class="teachers"
                    >{{ items.title }}</text
                  >
                </view>
                <view class="item-price">
                  <text>￥</text>
                  {{ formatPrice(item.price) }}
                </view>
              </view>
            </view>
          </navigator>
        </view>
      </view>
    </view>
    <view class="fix-bottom">
      <view class="customer-box" @click="openExchange">
        <image
          :src="`${staticHost}/images/order/customer.png`"
          class="customer"
        ></image>
        <view class="customer-text">客服</view>
      </view>
      <view class="apply" @click="buy" v-if="model.isReservation"
        >立即预约</view
      >
      <view class="apply disable" v-else>立即预约</view>
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
  </view>
</template>

<script>
import { publicMixin } from '../../mixin/public.js'
export default {
  mixins: [publicMixin],
  data() {
    return {
      authoShow: false, // 授权弹窗显示
      Id: '',
      top: ['', '', '', '', ''],
      model: {},
      current: 0,
      navbarHeight: 0, // 导航栏高度
      color: 'transparent', // 导航栏的背景颜色
      showIntroduce: false, //简介显示
      showCalendar: false, // 日历显示
      exchangeShow: false, // 客服
      dateList: [],
      bannerList: [],
      list: []
    }
  },
  onLoad(option) {
    // 动态获取导航栏高度
    var self = this
    uni.getSystemInfo({
      success: function (e) {
        self.navbarHeight = e.statusBarHeight + 44
      }
    })
    if (option) {
      this.Id = parseInt(option.id)
    }
    this.getOffset()
    //详情
    this.getDetail()
    //推荐课程
    this.getRecommend()
  },
  methods: {
    openExchange() {
      this.exchangeShow = true
    },
    closeExchange(e) {
      this.exchangeShow = e
    },
    // 子组件向父组件传值
    closeMain(e) {
      this.authoShow = e
    },
    getDetail() {
      var self = this
      let params = {
        id: this.Id
      }
      this.$api.consultant.postConsultanDetails(params).then((res) => {
        if (res.errcode == 0) {
          self.model = res.model
          self.dateList = res.dateList
          self.bannerList = res.bannerList
        }
      })
    },
    //推荐课程
    getRecommend() {
      var self = this
      let params = {
        page: 1,
        pageSize: 3,
        consultantId: this.Id
      }
      this.$api.consultant.getConsultanAssociationList(params).then((res) => {
        if (res.errcode == 0) {
          self.list = res.list
        }
      })
    },
    // 收藏
    toCollect(isCollect) {
      // 授权拦截
      var token = uni.getStorageSync('token') || ''
      var isExistUser = token != ''
      if (!isExistUser) {
        // 未授权
        // this.authoShow = true; // 显示弹窗
        this.$refs.authorize.getCode() // 调用子组件的onshow方法 获取openid和sessionKey
        return false
      }

      var self = this
      let params = {
        association_type: 1, // 1咨询 2课程 3测评
        association_id: this.Id,
        isCollect: isCollect //  1 收藏 2取消
      }
      this.$api.collect.postCollectAdd(params).then((res) => {
        if (res.errcode == 0) {
          self.model.isInterest = isCollect == 1 ? 1 : 0
        }
      })
    },
    //切换标签
    changeTag(index) {
      this.current = index
      uni.pageScrollTo({
        scrollTop: this.top[index] - 150,
        duration: 300
      })
      this.getOffset()
    },
    //点击更多
    clickMore(ele) {
      if (ele == 'showCalendar') {
        this.showCalendar = !this.showCalendar
      } else {
        this.showIntroduce = !this.showIntroduce
      }
      this.getOffset()
    },
    //计算位置
    getOffset() {
      this.getTop('#service', 0)
      this.getTop('#introduce', 1)
      this.getTop('#good', 2)
      this.getTop('#calendar', 3)
      if (this.list.length > 0) {
        this.getTop('#course', 4)
      }
    },
    getTop(ele, index) {
      let _this = this
      const query = uni.createSelectorQuery()
      query.select(ele).boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
        console.log('res', res)
        _this.top[index] = res[0].top + res[1].scrollTop
      })
    },
    buy() {
      // 授权拦截
      var token = uni.getStorageSync('token') || ''
      var isExistUser = token != ''
      if (!isExistUser) {
        // 未授权
        // this.authoShow = true; // 显示弹窗
        this.$refs.authorize.getCode() // 调用子组件的onshow方法 获取openid和sessionKey
        return false
      }

      uni.navigateTo({
        url: '/pages/consult/apply?id=' + this.Id
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
    // this.top.forEach((item, index) => {
    //   if (scroll + 150 >= item) {
    //     this.current = index
    //     return false
    //   }
    // })
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内分享按钮
      console.log(res.target)
    }
    return {
      title: '蓝鸟心理',
      path: '/pages/consult/detail?id=' + this.Id
    }
  }
}
</script>

<style lang="less">
@import './detail.less';
</style>
