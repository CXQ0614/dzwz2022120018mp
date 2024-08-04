<template>
  <!-- 课程-->
  <view class="uni-content">
    <image
      :src="`${staticHost}/images/shared/banner.png`"
      class="banner"
    ></image>
    <view class="course-page">
      <!-- 导航栏 -->
      <u-navbar
        title=" "
        :bgColor="color"
        :fixed="true"
        :safeAreaInsetTop="true"
        :placeholder="true"
      >
        <view class="u-nav-slot" slot="left"
          ><view class="banner-title">心理课程</view></view
        >
      </u-navbar>
      <!-- 输入框 -->
      <view class="banner-search-box">
        <view class="banner-search">
          <image
            :src="`${staticHost}/images/home/search.png`"
            class="search-icon"
          ></image>
          <u--input
            placeholder="输入内容关键词"
            placeholderClass="input-placeholder"
            :border="none"
            @change="searchChange"
            v-model="searchValue"
          ></u--input>
          <view class="search-button" @click="searchClick">搜索</view>
        </view>
      </view>
      <!-- 轮播图 -->
      <view class="banner-swiper">
        <u-swiper
          :list="bannerList"
          keyName="img"
          showTitle
          radius="20rpx"
          @click="swiperClick"
          @change="swiperChange"
          :autoplay="false"
        >
          <view slot="indicator" class="indicator">
            <view
              class="indicator-dot"
              :class="{ active: dotCurrent == index }"
              v-for="(item, index) in bannerList"
              :key="index"
            ></view>
          </view>
        </u-swiper>
      </view>

      <view class="tabs">
        <view class="tab-left">
          <u-tabs
            :list="tabList"
            :current="tabCurrent"
            @change="change"
            lineWidth="24"
            lineHeight="4"
            lineColor="linear-gradient(134deg, #149cff 0%, #0975e8 100%)"
            :activeStyle="{
              color: 'transparent',
              'font-size': '36rpx',
              'font-weight': 'bold',
              '-webkit-background-clip': 'text',
              'background-image':
                'linear-gradient(134deg, #149cff 0%, #0975e8 100%)'
            }"
            :inactiveStyle="{
              color: '#666A72',
              'font-size': '32rpx'
            }"
          ></u-tabs>
          <image
            :src="`${staticHost}/images/course/mask.png`"
            class="mask"
            mode="aspectFill"
          ></image>
        </view>
        <image
          :src="`${staticHost}/images/course/more.png`"
          class="tab-right"
          mode="aspectFill"
          @click="classShow = true"
        ></image>
      </view>
      <!-- 列表 -->
      <view class="list">
        <navigator
          hover-class="none"
          :url="'/pages/course/detail?id=' + item.info_id"
          class="list-item"
          v-for="(item, index) in list"
          :key="index"
        >
          <image
            :src="`${host}` + item.list_img_url"
            class="item-img"
            mode="aspectFill"
          ></image>
          <view class="item-right">
            <view class="item-titles">{{ item.main_title }}</view>
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
              <!-- <view class="item-price">
								<text>￥</text>
								{{ formatPrice(item.price)}}
							</view> -->
            </view>
          </view>
        </navigator>
      </view>
    </view>
    <view @click="exchangeShow = true" class="customer-icon"
      ><image
        :src="`${staticHost}/images/shared/customer-icon.png`"
        class="icon"
      ></image
    ></view>

    <u-popup
      :show="classShow"
      overlayOpacity="0.7"
      @close="classShow = false"
      bgColor="#e9edf5"
      round="20"
    >
      <view class="pop-class">
        <view class="pop-top">
          <view class="title">选择分类</view>
          <image
            class="close"
            :src="`${staticHost}/images/shared/close.png`"
            mode="widthFix"
            @click="classShow = false"
          ></image>
        </view>
        <view class="class-box">
          <view
            class="class-item"
            :class="{ active: index == temTabCurrent }"
            v-for="(item, index) in tabList"
            :key="index"
            @click="clikcClass(item, index)"
            >{{ item.name }}</view
          >
        </view>
        <view class="btn" @click="confirm">确定</view>
      </view>
    </u-popup>

    <!-- 底部tabbar栏 -->
    <public-tabbar ref="tabbar" :current="1"></public-tabbar>
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
      page: 1,
      pageSize: 10,
      flag: true, // 是否加载
      typeId: '', // 分类id

      color: 'transparent', // 导航栏的背景颜色
      searchValue: '', // 搜索内容
      classShow: false,
      dotCurrent: 0, // 当前swiper索引
      bannerList: [],
      tabCurrent: 0,
      temTabCurrent: 0,
      tabList: [], // 分类数据
      list: [],

      exchangeShow: false // 客服
    }
  },
  onLoad() {
    // 分类接口
    this.getCourseTypeList()
    // 列表接口
    this.postCourseList()
    // banner
    this.getBanner()
  },
  methods: {
    openExchange() {
      this.exchangeShow = true
    },
    closeExchange(e) {
      this.exchangeShow = e
    },
    // banner
    getBanner() {
      let params = {
        type: 'COURSE'
      }
      this.$api.advertise.GetAdvertisingSpaceList(params).then((res) => {
        if (res.errcode == 0) {
          var list = res.list
          list.forEach((item, index) => {
            item.img = this.host + item.img
          })
          this.bannerList = list
        }
      })
    },
    // 点击swiper 跳转
    swiperClick(e) {
      console.log(e)
      uni.navigateTo({
        url: this.bannerList[e].link
      })
    },
    // 分类接口
    getCourseTypeList() {
      let params = {}
      this.$api.course.getCourseTypeList(params).then((res) => {
        if (res.errcode == 0) {
          console.log(res)
          this.tabList = res.list
        }
      })
    },
    // 列表接口
    postCourseList() {
      let params = {
        page: this.page,
        pageSize: this.pageSize,
        class: this.typeId, // 分类
        keywords: this.searchValue
      }
      this.$api.course.postCourseList(params).then((res) => {
        if (res.errcode == 0) {
          if (res.list.length > 0) {
            let lists = res.list

            // 合并数组
            let newList = this.list.concat(lists)
            this.list = newList
            // 如果当前的列表总数等于接口返回的列表总数 则加载完成
            if (this.list.length == res.total) {
              this.flag = false
            }
          } else if (res.list.length == 0) {
            this.flag = false
          }
        }
      })
    },
    // 监听输入框
    searchChange(e) {
      console.log(e)
      if (e == '') {
        // 重置列表
        this.list = []
        this.page = 1
        this.flag = true
        this.postCourseList()
      }
    },
    // 搜索
    searchClick() {
      this.page = 1
      this.list = []
      this.flag = true
      // 列表
      this.postCourseList()
    },
    // 轮播图监听
    swiperChange(e) {
      this.dotCurrent = e.current
    },
    change(item) {
      this.temTabCurrent = item.index
      this.typeId = item.id

      // 重置列表
      this.list = []
      this.page = 1
      this.flag = true
      this.postCourseList()
    },
    clikcClass(item, index) {
      this.temTabCurrent = index
    },
    confirm() {
      this.tabCurrent = this.temTabCurrent
      this.classShow = false
      this.typeId = this.tabList[this.tabCurrent].id

      // 重置列表
      this.list = []
      this.page = 1
      this.flag = true
      this.postCourseList()
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
  },
  onReachBottom() {
    this.page++

    if (this.flag) {
      // 课程列表接口
      this.postCourseList()
    }
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内分享按钮
      console.log(res.target)
    }
    return {
      title: '蓝鸟心理',
      path: '/pages/course/index'
    }
  }
}
</script>

<style lang="less">
@import './index.less';
</style>
