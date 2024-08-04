<template>
	<!-- 心理测评-->
	<view class="uni-content">
		<image :src="`${staticHost}/images/shared/banner.png`" class="banner"></image>
		<view class="test-page">
			<!-- 导航栏 -->
			<u-navbar title=" " :bgColor="color" :fixed="true" :safeAreaInsetTop="true" :placeholder="true">
				<view class="u-nav-slot" slot="left"><view class="banner-title">心理测评</view></view>
			</u-navbar>
			<!-- 输入框 -->
			<view class="banner-search-box">
				<navigator hover-class="none" url="/pages/test/list" class="banner-search">
					<image :src="`${staticHost}/images/home/search.png`" class="search-icon"></image>
					<u--input placeholder="输入内容关键词" disabled placeholderClass="input-placeholder" :border="none"></u--input>
					<view class="search-button">搜索</view>
				</navigator>
			</view>
			<view class="test-tab">
				<block v-for="(item, index) in tabs" :key="index">
					<navigator v-if="index < 9" hover-class="none" :url="'/pages/test/list?index=' + index" class="tab-item">
						<image :src="`${host}` + item.img" class="tab-icon"></image>
						<view class="tab-title">{{ item.name }}</view>
					</navigator>
				</block>
				<block>
					<navigator hover-class="none" url="/pages/test/list" class="tab-item">
						<image :src="`${staticHost}/images/test/icon10.png`" class="tab-icon"></image>
						<view class="tab-title">更多</view>
					</navigator>
				</block>
			</view>
			<view class="recommend" v-if="recommendList && recommendList.length > 0">
				<view class="public-title">精选推荐</view>
				<view class="recommend-bottom">
					<view class="recommend-box">
						<navigator hover-class="none" :url="'/pages/test/detail?id=' + item.evaluation_id" class="recommend-item" v-for="(item, index) in recommendList" :key="index">
							<image :src="`${host}` + item.list_img_url" class="item-img" mode="aspectFill"></image>
							<view class="item-bottom">
								<view class="item-title">{{ item.main_title }}</view>
								<view class="item-content">
									<view class="item-task">共{{ item.subject_number }}题</view>
									<!-- <view class="item-price">
										<text>￥</text>
										{{ formatPrice(item.price) }}
									</view> -->
								</view>
							</view>
						</navigator>
					</view>
				</view>
			</view>
			<view class="other" v-if="list && list.length > 0">
				<view class="public-title">其他测评</view>
				<view class="list">
					<navigator hover-class="none" :url="'/pages/test/detail?id=' + item.evaluation_id" class="list-item" v-for="(item, index) in list" :key="index">
						<image :src="`${host}` + item.list_img_url" class="item-img" mode="aspectFill"></image>
						<view class="item-right">
							<view class="item-titles">{{ item.main_title }}</view>
							<view class="item-text">{{ item.subtitle }}</view>
							<view class="item-content">
								<view class="item-task">共{{ item.subject_number }}题</view>
								<!-- <view class="item-price">
									<text>￥</text>
									{{ formatPrice(item.price) }}
								</view> -->
							</view>
						</view>
					</navigator>
				</view>
			</view>
		</view>
    <view @click="exchangeShow=true" class="customer-icon"><image :src="`${staticHost}/images/shared/customer-icon.png`" class="icon"></image></view>
		<!-- 底部tabbar栏 -->
		<public-tabbar ref="tabbar" :current="3"></public-tabbar>
    
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
			color: 'transparent', // 导航栏的背景颜色
			
			page: 1,
			pageSize: 10,
			flag: true, // 是否加载
			
			tabs: [],
			recommendList: [], // 推荐列表
			list: [] ,// 其他测评
      
      exchangeShow:false, // 客服
		};
	},
	onLoad() {
		// 分类接口
		this.getEvaluationTypeList()
		// 推荐接口
		this.postEvaluationList()
		// 其他测评
		this.postEvaluationListOthers()
	},
	methods: {
    openExchange(){
    	this.exchangeShow = true;
    },
    closeExchange(e){
    	this.exchangeShow = e;
    },
		// 分类接口
		getEvaluationTypeList() {
			let params = {}
			this.$api.test.getEvaluationTypeList(params).then(res => {
				if (res.errcode == 0) {
					this.tabs = res.list
				}
			})
		},
		// 列表接口 （精选推荐）
		postEvaluationList() {
			let params = {
				"page": 1,
				"pageSize": 10,
				"isBoutique": "1", // 传1就是推荐列表 不传就是其他测评
				"class": "" // 分类
			}
			this.$api.test.postEvaluationList(params).then(res => {
				if (res.errcode == 0) {
					this.recommendList = res.list
				}
			})
		},
		// 列表接口 （其他测评）
		postEvaluationListOthers() {
			let params = {
				"page": this.page,
				"pageSize": this.pageSize,
				"isBoutique": "", // 传1就是推荐列表 不传就是其他测评
				"class": "" // 分类
			}
			this.$api.test.postEvaluationList(params).then(res => {
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
	onReachBottom() {
		this.page++

		if (this.flag) {
			// 课程列表接口
			this.postEvaluationListOthers()
		}
	},
	onShareAppMessage(res) {
		if (res.from === 'button') { // 来自页面内分享按钮
			console.log(res.target)
		}
		return {
			title: '蓝鸟心理',
			path: '/pages/test/index'
		}
	},
};
</script>

<style lang="less">
@import './index.less';
</style>
