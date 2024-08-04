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
					<span class="symbol">¥</span>
					{{  formatPrice(model.price) }}
				</view>
				<view class="course-time">共{{ model.subject_number }}题丨约{{ model.duration }}分钟</view>
				<view class="course-person">{{ model.number }}人已测评</view>
			</view>
		</view>
		<view class="introduce">
			<view class="public-title">测评须知</view>
			<view class="introduce-bottom"><u-parse :content="model.contents" selectable></u-parse></view>
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
			color: 'transparent', // 导航栏的背景颜色
			bannerList: [],
			exchangeShow:false, // 客服
			model: {}
		};
	},
	onLoad(option) {
		if (option) {
			this.id = option.id;
		}

		// 详情接口
		this.postEvaluationDetails();
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
		postEvaluationDetails() {
			let params = {
				id: this.id
			};
			this.$api.test.postEvaluationDetails(params).then(res => {
				if (res.errcode == 0) {
					this.bannerList = res.bannerList;
					this.model = res.model;
				}
			});
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
				association_type: 3, // 1咨询 2课程 3测评
				association_id: this.id,
				isCollect: isCollect //  1 收藏 2取消
			};
			this.$api.collect.postCollectAdd(params).then(res => {
				if (res.errcode == 0) {
					self.model.isInterest = isCollect == 1 ? 1 : 0;
				}
			});
		},
		buy() {
			// 授权拦截
			var token = uni.getStorageSync('token') || '';
			var isExistUser = token != '';
			if (!isExistUser) { // 未授权
				// this.authoShow = true; // 显示弹窗
				this.$refs.authorize.getCode(); // 调用子组件的onshow方法 获取openid和sessionKey
				return false;
			}
			
			uni.navigateTo({
				url: '/pages/test/apply?id=' + this.model.evaluation_id
			});
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
	},
	onShareAppMessage(res) {
		if (res.from === 'button') { // 来自页面内分享按钮
			console.log(res.target)
		}
		return {
			title: '蓝鸟心理',
			path: '/pages/test/detail?id' + this.id
		}
	},
};
</script>

<style lang="less">
@import './detail.less';
</style>
