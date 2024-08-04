<template>
	<!-- 首页-->
	<view class="uni-content">
		<view class="home-banner" :style="'background-image: url(' + `${staticHost}` + '/images/shared/banner.png);'">
			<!-- 导航栏 -->
			<u-navbar title=" " :bgColor="color" :fixed="true" :safeAreaInsetTop="true" :placeholder="true">
				<view class="u-nav-slot" slot="left">
					<image :src="`${staticHost}/images/home/logo.png`" class="banner-logo"></image>
					<view class="banner-title">蓝鸟心理</view>
				</view>
			</u-navbar>
			<!-- 输入框 -->
			<!-- <view class="banner-search-box">
				<navigator hover-class="none" url="/pages/search/index" class="banner-search">
					<image :src="`${staticHost}/images/home/search.png`" class="search-icon"></image>
					<u--input placeholder="输入内容关键词" placeholderClass="input-placeholder" disabled :border="none"></u--input>
					<view class="search-button">搜索</view>
				</navigator>
			</view> -->
			<!-- 轮播图 -->
			<view class="banner-swiper">
				<u-swiper :list="bannerList" keyName="img" radius="20rpx" @change="swiperChange" :autoplay="false" @click="bannerClick">
					<view slot="indicator" class="indicator">
						<view class="indicator-dot" :class="{ active: dotCurrent == index }" v-for="(item, index) in bannerList" :key="index"></view>
					</view>
				</u-swiper>
				<image :src="`${staticHost}/images/home/banner-shadow.png`" class="banner-shadow" mode="aspectFill"></image>
			</view>
		</view>

		<!-- 金刚区 -->
		<view class="home-tab">
			<navigator hover-class="none" url="/pages/consult/index" class="tab-item">
				<image :src="`${staticHost}/images/home/tab-icon1.png`" class="tab-item-icon"></image>
				<view class="tab-item-title">心理咨询</view>
				<image :src="`${staticHost}/images/home/tab-shadow1.png`" class="tab-item-shadow"></image>
			</navigator>
			<navigator hover-class="none" url="/pages/test/index" class="tab-item">
				<image :src="`${staticHost}/images/home/tab-icon2.png`" class="tab-item-icon"></image>
				<view class="tab-item-title">心理测评</view>
				<image :src="`${staticHost}/images/home/tab-shadow2.png`" class="tab-item-shadow"></image>
			</navigator>
			<navigator hover-class="none" url="/pages/course/index" class="tab-item">
				<image :src="`${staticHost}/images/home/tab-icon3.png`" class="tab-item-icon"></image>
				<view class="tab-item-title">心理课程</view>
				<image :src="`${staticHost}/images/home/tab-shadow3.png`" class="tab-item-shadow"></image>
			</navigator>
		</view>

		<!-- 列表 -->
		<view class="list">
			<view class="list-item">
				<view class="list-item-top">
					<view class="list-top-title">心理咨询</view>
					<navigator hover-class="none" url="/pages/consult/index" class="list-top-right">
						<view class="list-top-more">更多</view>
						<image :src="`${staticHost}/images/home/arrow.png`" class="list-top-arrow"></image>
					</navigator>
				</view>
				<view class="list-item-bottom">
					<navigator hover-class="none" :url="'/pages/consult/detail?id=' + item.consultant_id" class="list-items" v-for="(item, index) in consultList" :key="index">
						<image :src="`${host}` + item.img_url" class="list-items-img" mode="aspectFill"></image>
						<view class="list-items-right">
							<view class="list-items-top">
								<view class="list-items-name">{{ item.main_title }}</view>
								<view class="list-items-intro">从业{{ item.working_year }}年</view>
							</view>
              <u-parse
                :content="item.subtitle"
                class="list-items-title"
              ></u-parse>
							<view class="list-items-text"><template v-for="(items,indexs) in item.classAll">{{ items }} <text v-if="indexs< item.classAll.length - 1" class="pd"> | </text></template></view>
							<view class="list-items-content">
								<view>
									<view class="list-items-time" v-if="item.recentlyTomorrow > 0">可预约{{ item.recentlyDate + ' ' + item.recentlyTime }}</view>
								</view>
								<!-- <view class="list-items-price">
									<text>￥</text>
									{{ formatPrice(item.price) }}
								</view> -->
							</view>
						</view>
					</navigator>
				</view>
			</view>
			<view class="list-item">
				<view class="list-item-top">
					<view class="list-top-title">心理测评</view>
					<navigator hover-class="none" url="/pages/test/index" class="list-top-right">
						<view class="list-top-more">更多</view>
						<image :src="`${staticHost}/images/home/arrow.png`" class="list-top-arrow"></image>
					</navigator>
				</view>
				<view class="list-item-bottom">
					<navigator hover-class="none" :url="'/pages/test/detail?id='+item.evaluation_id" class="list-items" v-for="(item, index) in testList" :key="index">
						<image :src="`${host}` + item.list_img_url" class="list-items-imgs" mode="aspectFill"></image>
						<view class="list-items-right">
							<view class="list-items-titles">{{ item.main_title }}</view>
							<view class="list-items-text">{{ item.subtitle }}</view>
							<view class="list-items-content">
								<view class="list-items-task">共{{ item.subject_number }}题</view>
								<!-- <view class="list-items-price">
									<text>￥</text>
									{{ formatPrice(item.price) }}
								</view> -->
							</view>
						</view>
					</navigator>
				</view>
			</view>

			<view class="list-item">
				<view class="list-item-top">
					<view class="list-top-title">心理课程</view>
					<navigator hover-class="none" url="/pages/course/index" class="list-top-right">
						<view class="list-top-more">更多</view>
						<image :src="`${staticHost}/images/home/arrow.png`" class="list-top-arrow"></image>
					</navigator>
				</view>
				<view class="list-item-bottom">
					<navigator hover-class="none" :url="'/pages/course/detail?id='+item.info_id" class="list-items" v-for="(item, index) in courseList" :key="index">
						<image :src="`${host}` + item.list_img_url" class="list-items-imgs" mode="aspectFill"></image>
						<view class="list-items-right">
							<view class="list-items-titles">{{ item.main_title }}</view>
							<view class="list-items-text">{{ item.subtitle }}</view>
							<view class="list-items-content">
								<view class="list-items-task">讲师：<template v-for="(items,indexs) in item.teacherList">{{ items.title }} <text v-if="indexs< item.teacherList.length - 1"> 、</text></template></view>
								<!-- <view class="list-items-price">
									<text>￥</text>
									{{ formatPrice(item.price)}}
								</view> -->
							</view>
						</view>
					</navigator>
				</view>
			</view>
		</view>
		<!-- 底部tabbar栏 -->
		<public-tabbar ref="tabbar" :current="0"></public-tabbar>
	</view>
</template>

<script>
import { publicMixin } from '../../mixin/public.js';
export default {
	mixins: [publicMixin],
	data() {
		return {
			color: 'transparent', // 导航栏的背景颜色
			dotCurrent: 0, // 当前swiper索引
			bannerList: [],
			consultList: [],
			testList: [],
			courseList: []
		};
	},
	onLoad() {
		// banner图
		this.getBanner();
		//咨询师列表
		this.getConsultanList()
		//课程列表
		this.getCourseList()
		//测评列表
		this.getEvaluationList()
	},
	methods: {
		// 轮播图监听
		swiperChange(e) {
			this.dotCurrent = e.current;
		},
		//点击banner
		bannerClick() {
			console.log(this.bannerList[this.dotCurrent].link);
			uni.navigateTo({
				url:this.bannerList[this.dotCurrent].link
			})
		},
		getBanner() {
			let params = {
				type: 'HOME'
			};
			this.$api.advertise.GetAdvertisingSpaceList(params).then(res => {
				if (res.errcode == 0) {
					var list = res.list
					list.forEach((item,index)=>{
						item.img = this.host+item.img 
					})
					this.bannerList = list;
				}
			});
		},
		//咨询师列表
		getConsultanList() {
			var self =this
			let params = {
				page: 1,
				pageSize: 3,
				isHome: 1, //是否首页 非首页不传
			};
			this.$api.consultant.postConsultanList(params).then(res => {
				if (res.errcode == 0) {
				  self.consultList = res.list
				}
			})
		},
		//课程列表
		getCourseList() {
			var self =this
			let params = {
				page: 1,
				pageSize: 3,
				isHome: 1, //是否首页 非首页不传
			};
			this.$api.course.postCourseList(params).then(res => {
				if (res.errcode == 0) {
				  self.courseList = res.list
				}
			})
		},
    //测评列表
    getEvaluationList() {
    	var self =this
    	let params = {
    		page: 1,
    		pageSize: 3,
    		isHome: 1, //是否首页 非首页不传
    	};
    	this.$api.test.postEvaluationList(params).then(res => {
    		if (res.errcode == 0) {
    		  self.testList = res.list
    		}
    	})
    }
	},
	computed: {},
	//控制导航栏背景颜色
	onPageScroll: function(e) {
		if (e.scrollTop > 50) {
			this.color = '#ffffff';
		} else {
			this.color = 'transparent';
		}
	},
	onShareAppMessage(res) {
		if (res.from === 'button') { // 来自页面内分享按钮
			console.log(res.target)
		}
		return {
			title: '蓝鸟心理',
			path: '/pages/home/index'
		}
	},
};
</script>

<style lang="less">
@import './index.less';
</style>
