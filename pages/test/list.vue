<template>
	<!-- 心理测评-->
	<view class="uni-content">
		<u-navbar title="心理测评列表" :bgColor="color" :fixed="true" :safeAreaInsetTop="true" :placeholder="true"></u-navbar>
		<image :src="`${staticHost}/images/shared/banner.png`" class="banner"></image>
		<view class="test-page">
			<!-- 输入框 -->
			<view class="banner-search-box">
				<view class="banner-search">
					<image :src="`${staticHost}/images/home/search.png`" class="search-icon"></image>
					<u--input placeholder="输入内容关键词" @search="searchClick" @change="searchChange" placeholderClass="input-placeholder" clearabled="true" :border="none" v-model="searchValue"></u--input>
					<view class="search-button" @click="searchClick">搜索</view>
				</view>
			</view>
			<view class="other" id="other" :style="'height:calc(100vh - ' + top + 'px)'">
				<scroll-view scroll-y="true" class="tabs-scroll">
					<view class="tabs">
						<view class="tab-item" :class="{ active: current == 0 }" @click="changeType(0)">全部</view>
						<view class="tab-item" v-for="(item, index) in tabs" :key="index" :class="{ active: index + 1 == current }" @click="changeType(index + 1)">{{ item.name }}</view>
					</view>
				</scroll-view>
				<scroll-view scroll-y="true" class="list-scroll" @scrolltolower="listScroll">
					<view class="list">
						<navigator hover-class="none" :url="'/pages/test/detail?id=' + item.evaluation_id" class="list-item" v-for="(item, index) in list" :key="index">
							<image :src="`${host}` + item.list_img_url" class="item-img" mode="aspectFill"></image>
							<view class="item-right">
								<view class="item-titles">{{ item.main_title }}</view>
								<view class="item-text">{{ item.subtitle }}</view>
								<view class="item-content">
									<view class="item-task">共{{ item.subject_number }}题</view>
									<view class="item-price">
										<text>￥</text>
										{{ formatPrice(item.price) }}
									</view>
								</view>
							</view>
						</navigator>
						<!-- 暂无数据 -->
						<view class="list-none" v-if="list && list.length == 0">暂无数据</view>
					</view>
				</scroll-view>
			</view>
		</view>
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
			typeId: '', // 分类id
			
			searchValue: '', // 搜索内容
			current: 0,
			top: '',
			tabs: [],
			list: []
		};
	},
	onLoad(option) {
		if (option.index) {
			this.current = parseInt(option.index)+1; // 因为0是全部
		}
		
		// 分类接口
		this.getEvaluationTypeList()
	},
	onReady() {
		this.getTop();
	},
	methods: {
		// 监听搜索
		searchChange(e){
			if(e == ''){
				// 重置列表
				this.list = []
				this.page = 1
				this.flag = true
				this.postEvaluationListOthers()
			}
		},
		// 点击搜索 和点击键盘的搜索
		searchClick(){
			// 重置列表
			this.list = []
			this.page = 1
			this.flag = true
			this.postEvaluationListOthers()
		},
		// 分类接口
		getEvaluationTypeList() {
			let params = {}
			this.$api.test.getEvaluationTypeList(params).then(res => {
				if (res.errcode == 0) {
					this.tabs = res.list
					// 获取分类的id
					if(this.current != 0){
					  this.typeId = this.tabs[this.current - 1].id
					}
					
					// 其他测评
					this.postEvaluationListOthers()
				}
			})
		},
		// 列表接口 （其他测评）
		postEvaluationListOthers() {
			let params = {
				"page": this.page,
				"pageSize": this.pageSize,
				"isBoutique": "", // 传1就是推荐列表 不传就是其他测评
				"class": this.typeId, // 分类
        "keywords": this.searchValue // 搜索关键词
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
		// 右侧滚动到底部加载
		listScroll(){
			this.page++;
		
			if (this.flag) {
				this.postEvaluationListOthers();
			}
		},
		getTop() {
			let _this = this;
			const query = uni.createSelectorQuery();
			query.select('#other').boundingClientRect();
			query.selectViewport().scrollOffset();
			query.exec(function(res) {
				_this.top = res[0].top;
			});
		},
		changeType(index) {
			this.current = index;
			
			if(index == 0){
				this.typeId = ""
			}else {
				this.typeId = this.tabs[index - 1].id
			}
			
			// 重置列表
			this.list = []
			this.page = 1
			this.flag = true
			this.postEvaluationListOthers()
		}
	},
	computed: {},
	//控制导航栏背景颜色
	onPageScroll: function(e) {
		console.log(e.scrollTop);
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
			path: '/pages/test/list?index' + this.current - 1
		}
	},
};
</script>

<style lang="less">
@import './list.less';
</style>
