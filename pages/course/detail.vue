<template>
	<!-- 心理咨询-->
	<view class="uni-content">
		<u-navbar title=" " :bgColor="color" :safeAreaInsetTop="true"></u-navbar>
		<!-- <image :src="`${host}` + bannerList[0].url" class="banner"></image> -->
		<swiper class="swiper" duration="500">
			<swiper-item class="swiper-item" v-for="(item,index) in bannerList" :key="index">
				<image :src="`${host}` + item.url" class="swiper-item-img"></image>
			</swiper-item>
		</swiper>
		<view class="detail-top">
			<view class="title-box">
				<view class="title">{{ model.main_title }}</view>
			  <view class="detail-right" v-if="model.isInterest == 1" @click="toCollect(2)">
			  	<image :src="`${staticHost}/images/order/collect.png`" class="collect-icon"></image>
			  	<view class="right-text">已收藏</view>
			  </view>
			  <view class="detail-right" v-else @click="toCollect(1)">
			  	<image :src="`${staticHost}/images/order/uncollect.png`" class="collect-icon"></image>
			  	<view class="right-text">收藏</view>
			  </view>
			</view>
			<view class="detail-content">{{ model.subtitle }}</view>
			<view class="detail-price">
				<view class="price">
					<span class="symbol">¥</span>{{ formatPrice(model.price) }}
				</view>
				<view class="course-time">共{{ model.class_hour }}课时</view>
			</view>
		</view>
		<view class="detail-box">
			<u-sticky :offset-top="navbarHeight" bgColor="fff" zIndex="10">
				<view class="detail-nav">
					<view class="nav-item" :class="{ active: current === 0 }" @click="changeTag(0)">主讲老师</view>
					<view class="nav-item" :class="{ active: current === 1 }" @click="changeTag(1)">课程介绍</view>
				</view>
			</u-sticky>
			<view class="teacher" id="teacher">
				<view class="public-title">主讲老师</view>
				<view class="teacher-bottom" v-for="(item,index) in teacherList" :key="index">
					<image :src="`${host}` + item.url" class="teacher-img"></image>
					<view class="teacher-right">
						<view class="teacher-title">{{ item.title }}</view>
						<view class="teacher-content">
							{{ item.subtitle }}
						</view>
					</view>
				</view>
			</view>
			<view class="line"></view>
			<view class="introduce" id="introduce">
				<view class="public-title">课程介绍</view>
				<view class="introduce-bottom"><u-parse :content="model.contents" selectable></u-parse></view>
			</view>
		</view>
		<view class="fix-bottom">
			<view class="customer-box" @click="openExchange">
				<image :src="`${staticHost}/images/order/customer.png`" class="customer"></image>
				<view class="customer-text">客服</view>
			</view>
			<view class="apply" @click="buy">立即购买</view>
		</view>
		
		<!-- 授权弹窗 -->
		<diy-authorize ref="authorize" v-on:closeMain="closeMain" :show="authoShow"></diy-authorize>
		<!-- 客服 -->
		<exchange :show="exchangeShow" v-on:closeExchange="closeExchange"></exchange>
	</view>
</template>

<script>
import { publicMixin } from '../../mixin/public.js';
export default {
	mixins: [publicMixin],
	data() {
		return {
			authoShow: false, // 授权弹窗显示
			id: '',
			top: ['', ''],
			current: 0,
			navbarHeight: 0, // 导航栏高度
			color: 'transparent', // 导航栏的背景颜色
			bannerList: [], // banner列表
			model: {}, // 详情
			exchangeShow:false, // 客服
			teacherList: [], // 主讲老师列表
		};
	},
	onLoad(option) {
		// 动态获取导航栏高度
		var self = this;
		uni.getSystemInfo({
			success: function(e) {
				self.navbarHeight = e.statusBarHeight + 44;
			}
		});
		if (option) {
			this.id = option.id;
		}
		this.getOffset();
		// 详情接口
		this.postCourseDetails()
	},
	methods: {
		openExchange(){
			this.exchangeShow = true;
		},
		closeExchange(e){
			this.exchangeShow = e;
		},
		// 子组件向父组件传值
		closeMain(e) {
			this.authoShow = e;
		},
		// 详情接口
		postCourseDetails() {
			let params = {
				"id": this.id,
			}
			this.$api.course.postCourseDetails(params).then(res => {
				if (res.errcode == 0) {
					this.bannerList = res.bannerList
					console.log('banner', this.bannerList[0])
					console.log('banner', this.bannerList[1])
					this.model = res.model
					this.teacherList = res.teacherList
				}
			})
		},
		// 收藏
		toCollect(isCollect) {
			// 授权拦截
			var token = uni.getStorageSync('token') || '';
			var isExistUser = token != '';
			if (!isExistUser) { // 未授权
				// this.authoShow = true; // 显示弹窗
				this.$refs.authorize.getCode(); // 调用子组件的onshow方法 获取openid和sessionKey
				return false;
			}
			
			var self = this;
			let params = {
				association_type: 2, // 1咨询 2课程 3测评
				association_id: this.id,
				isCollect: isCollect //  1 收藏 2取消
			};
			this.$api.collect.postCollectAdd(params).then(res => {
				if (res.errcode == 0) {
					self.model.isInterest = isCollect == 1 ? 1 : 0;
				}
			});
		},
		//切换标签
		changeTag(index) {
			uni.pageScrollTo({
				scrollTop: this.top[index] - 150,
				duration: 300
			});
		},
		//计算位置
		getOffset() {
			this.getTop('#teacher', 0);
			this.getTop('#introduce', 1);
		},
		getTop(ele, index) {
			let _this = this;
			const query = uni.createSelectorQuery();
			query.select(ele).boundingClientRect();
			query.selectViewport().scrollOffset();
			query.exec(function(res) {
				_this.top[index] = res[0].top + res[1].scrollTop;
			});
		},
		buy(){
			// 授权拦截
			var token = uni.getStorageSync('token') || '';
			var isExistUser = token != '';
			if (!isExistUser) { // 未授权
				// this.authoShow = true; // 显示弹窗
				this.$refs.authorize.getCode(); // 调用子组件的onshow方法 获取openid和sessionKey
				return false;
			}
			
			uni.navigateTo({
				url:'/pages/course/apply?id=' + this.model.info_id
			})
		}
	},
	computed: {},
	//控制导航栏背景颜色
	onPageScroll: function(e) {
		var scroll = e.scrollTop;
		if (scroll > 50) {
			this.color = '#ffffff';
		} else {
			this.color = 'transparent';
		}
		this.top.forEach((item, index) => {
			if (scroll + 150 >= item) {
				this.current = index;
				return false;
			}
		});
	},
	onShareAppMessage(res) {
		if (res.from === 'button') { // 来自页面内分享按钮
			console.log(res.target)
		}
		return {
			title: '蓝鸟心理',
			path: '/pages/course/detail?id' + this.id
		}
	},
};
</script>

<style lang="less">
@import './detail.less';
</style>
