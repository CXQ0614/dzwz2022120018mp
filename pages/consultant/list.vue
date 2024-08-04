<template>
	<!-- 首页-->
	<view class="uni-content">
		<u-navbar
			title="个人中心"
			:leftIconColor="titleColor"
			:titleStyle="'color: ' + titleColor + ';'"
			:bgColor="color"
			:fixed="true"
			:safeAreaInsetTop="true"
			:placeholder="true"
		></u-navbar>
		<image :src="`${staticHost}/images/center/balance-bg.png`" class="banner"></image>
		<view class="center">
			<view class="center-content">
				<view class="center-input">
					<image :src="`${staticHost}/images/consultant/search.png`" class="center-input-icon"></image>
					<input type="text" class="center-inputs" @confirm="searchClick" @input="searchChange" placeholder="输入关键词" placeholder-style="color: #fff;" v-model="search">
				</view>
				<view class="center-item" @click="dateClick">
					<view class="center-item-title">预约日期</view>
					<image :src="`${staticHost}/images/consultant/arrow.png`" class="center-item-icon"></image>
				</view>
				<view class="center-item" @click="stateClick">
					<view class="center-item-title">{{orderText}}</view>
					<view class="center-item-icons">
						<image :src="`${staticHost}/images/consultant/arrow-top.png`" class="center-item-iconss"></image>
						<image :src="`${staticHost}/images/consultant/arrow-bottom.png`" class="center-item-iconss"></image>
					</view>
				</view>
			</view>
			<!-- 订单列表 -->
			<view class="center-group">
				<navigator hover-class="none" :url="'/pages/consultant/detail?id=' + item.order_id" class="center-item" v-for="(item,index) in list" :key="index">
					<view class="center-item-state" v-if="item.order_state == 10">订单完成</view>
					<view class="center-item-state red" v-if="item.order_state == 20">订单取消</view>
					<view class="center-item-state orange" v-if="item.order_state == 5">待服务</view>
					<view class="center-item-top">
						<image :src="`${host}` + item.infoModel.head_sculpture" class="center-item-head"></image>
						<view class="center-item-right">
							<view class="center-right-top">
								<view class="center-item-name">{{ item.infoModel.name }}</view>
								<view class="center-item-text">
									<text v-if="item.infoModel.sex_id == 1">男</text>
									<text v-if="item.infoModel.sex_id == 0">女</text>
									丨{{ item.infoModel.age }}岁</view>
							</view>
							<view class="center-right-bottom">
								<view class="center-right-tip" v-if="item.infoModel.emotionState && item.infoModel.emotionState != ''">{{item.infoModel.emotionState}}</view>
								<view class="center-right-tip" v-for="(items,indexs) in item.infoModel.plagueList" :key="indexs">{{items}}</view>
							</view>
						</view>
					</view>
					<view class="center-item-bottom">
						<image :src="`${staticHost}/images/consultant/time.png`" class="center-item-time"></image>
						<view class="center-time-text">预约咨询时间：<text>{{item.recentlyDate}}    {{item.startTime}}-{{item.endTime}}</text></view>
					</view>
				</navigator>
			</view>
		</view>
		
		<u-picker :show="orderShow" :columns="columns" keyName="label" @confirm="orderConfirm" @close="orderClose" @cancel="orderClose" :closeOnClickOverlay="true"></u-picker>
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
			sortKey: 'consultant_start_time',
			sortOrder: 'asc', // desc(降) asc(升)
			orderState: '', // 筛选的订单状态
			orderText: '', // 订单文案
			orderShow: false, // 是否显示订单状态弹窗
			columns: [
			  [{
					label: '全部',
					value: ''
				}]
			],
			
			search: '', // 搜索内容
			page: 1,
			pageSize: 10,
			flag: true, // 是否加载
			list: [],
			
			stateList: [], // 婚姻状态参数
			plagueList: [], // 困扰
		}
	},
	onLoad() {
		// 获取服务状态
		this.getConsultanOrderApiMoreConditions()
	},
	methods: {
		// 服务状态
		getConsultanOrderApiMoreConditions(){
			let params = {}
			this.$api.consultant.getConsultanOrderApiMoreConditions(params).then(res => {
				if (res.errcode == 0) {
					for (let key in res.list) {
						this.columns[0].push({
							value: res.list[key].value,
							label: res.list[key].label
						})
					}
					// 默认选择第一个待服务
					this.orderState = this.columns[0][1].value
					this.orderText = this.columns[0][1].label
					
					// 信息参数
					this.postOrderMoreConditions()
				}
			})
		},
		// 信息参数
		postOrderMoreConditions(){
			let params = {
				"association_type": 1
			}
			this.$api.order.postOrderMoreConditions(params).then(res => {
				if (res.errcode == 0) {
					this.stateList = res.stateList
					this.plagueList = res.plagueList
					// 订单列表
					this.postConsultanOrderApiList()
				}
			})
		},
		// 监听搜索
		searchChange(e){
			if(e.detail.value == ''){
				// 重置列表
				this.list = []
				this.page = 1
				this.flag = true
				this.postConsultanOrderApiList()
			}
		},
		// 点击搜索 和点击键盘的搜索
		searchClick(){
			// 重置列表
			this.list = []
			this.page = 1
			this.flag = true
			this.postConsultanOrderApiList()
		},
		// 订单列表
		postConsultanOrderApiList() {
			let params = {
				"page": this.page,
				"pageSize": this.pageSize,
				"keywords": this.search,
				"order_state": this.orderState, // 订单状态
				"sortKey": this.sortKey, // 预约日期 consultant_start_time
				"sortOrder": this.sortOrder, // desc(降) asc(升),
				"Token": uni.getStorageSync('consultantToken')
			}
			this.$api.consultant.postConsultanOrderApiList(params).then(res => {
				if (res.errcode == 0) {
					if (res.list.length > 0) {
						let lists = res.list
						
						lists.forEach((item,index) => {
							// 情感状态
							for (let key in this.stateList) {
								if(item.infoModel.emotional_state == this.stateList[key].value){
									item.infoModel.emotionState = this.stateList[key].label
								}
							}
							// 困扰
							var newkrList = []
							for (let key in this.plagueList) {
								if(item.infoModel.main_troubles_id){
									var krList = item.infoModel.main_troubles_id.split(',')
									for(var i=0; i<krList.length; i++){
										if(krList[i] == this.plagueList[key].value){
											newkrList.push(this.plagueList[key].label)
										}
									}
								}
							}
							item.infoModel.plagueList = newkrList
						})
					
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
		// 点击预约日期
		dateClick(){
			if(this.sortOrder == 'desc'){
				this.sortOrder = 'asc'
			}else if(this.sortOrder == 'asc'){
				this.sortOrder = 'desc'
			}
			this.sortKey = 'consultant_start_time'
			
			// 重置列表
			this.list = []
			this.page = 1
			this.flag = true
			// 订单列表
			this.postConsultanOrderApiList()
		},
		// 点击订单状态
		stateClick(){
			this.orderShow = true
		},
		// 关闭弹窗
		orderClose(){
			this.orderShow = false
		},
		// 点击确定
		orderConfirm(e){
			this.orderState = e.value[0].value
			this.orderText = e.value[0].label
			this.orderShow = false
			
			// 重置列表
			this.list = []
			this.page = 1
			this.flag = true
			// 订单列表
			this.postConsultanOrderApiList()
		},
	},
	computed: {},
	//控制导航栏背景颜色
	onPageScroll: function(e) {
		if (e.scrollTop > 50) {
			this.color = '#ffffff'
			this.titleColor = '#000'
		} else {
			this.color = 'transparent'
			this.titleColor = '#fff'
		}
	},
	onReachBottom() {
		this.page++

		if (this.flag) {
			// 我的订单接口
			this.postConsultanOrderApiList()
		}
	},
}
</script>

<style lang="less">
@import './list.less';
</style>
