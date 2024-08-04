<template>
	<!-- 首页-->
	<view class="uni-content">
		<u-navbar
			title="余额明细"
			:leftIconColor="titleColor"
			:titleStyle="'color: ' + titleColor + ';'"
			:bgColor="color"
			:fixed="true"
			:safeAreaInsetTop="true"
			:placeholder="true"
		></u-navbar>
		<image :src="`${staticHost}/images/center/balance-bg.png`" class="banner"></image>
		<view class="help">
			<!-- 头部账户余额 -->
			<view class="help-box">
				<view class="help-top">
					<view class="help-top-title">账户余额(蓝鸟币)</view>
					<image :src="`${staticHost}/images/center/open-eyes.png`" @click="isDisplay = false" v-if="isDisplay" class="help-top-icon"></image>
					<image :src="`${staticHost}/images/center/close-eyes.png`" @click="isDisplay = true" v-if="!isDisplay" class="help-top-icons"></image>
				</view>
				<view class="help-middle" v-if="isDisplay">
					<!-- <view class="help-middle-icon">￥</view> -->
					<view class="help-middle-title">{{ formatPrice(model.money) }}</view>
				</view>
				<view class="help-middle" v-if="!isDisplay"><view class="help-middle-title">******</view></view>
				<view class="help-text">蓝鸟币余额仅支持购买虚拟商品，不可提现、转增、退款</view>
			</view>
			<!-- 收支明细 -->
			<view class="help-detail">
				<view class="help-content">
					<view class="help-content-left">
						<view class="help-content-line"></view>
						<view class="help-content-title">收支明细</view>
					</view>
					<view class="help-content-right" @click="dateShow = true">
						<view class="help-content-date">{{ date }}</view>
						<image :src="`${staticHost}/images/center/arrow-top.png`" class="help-content-arrow" :class="{ arrows: dateShow }"></image>
					</view>
				</view>
				<view class="help-group" >
					<view class="help-item" :class="{ red: item.types == 0 }" v-for="(item, index) in list" :key="index">
						<view class="help-item-top">
							<template v-if="item.types == 0">
								<view class="help-item-title">+{{ formatPrice(item.money) }}</view>
								<view class="help-item-tips">兑换</view>
							</template>
							<template v-else-if="item.types == 1">
								<view class="help-item-title">-{{ formatPrice(item.money) }}</view>
								<view class="help-item-tips">消费</view>
							</template>
              <template v-if="item.types == 2">
              	<view class="help-item-title">+{{ formatPrice(item.money) }}</view>
              	<view class="help-item-tips">退款</view>
              </template>
						</view>
						<view class="help-item-date">{{ item.create_time }}</view>
					</view>
				</view>
			</view>

			<u-datetime-picker
				ref="datetimePicker"
				:formatter="formatter"
				@confirm="dateConfirm"
				@cancel="dateCancel"
				:show="dateShow"
				v-model="dateValue"
				mode="year-month"
			></u-datetime-picker>
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
			titleColor: '#fff', // 标题和箭头颜色
			list: [],
			model:{},
			date: '', // 当前月
			month: '', // 当月
			year: '', // 当年
			isDisplay: false, // 是否显示账户余额 默认不显示
			dateShow: false, // 点击选择日期
			dateValue: Number(new Date()) // 日期
		};
	},
	onReady() {
		// 微信小程序需要用此写法
		this.$refs.datetimePicker.setFormatter(this.formatter);
	},
	onLoad() {
		this.year = new Date().getFullYear();
		this.month = new Date().getMonth() + 1;
		// 获取当前月份
		const timeFormat = uni.$u.timeFormat; // 格式化
		let dates = timeFormat(Number(new Date()), 'yyyy-mm');
		this.date = dates;
		this.getList();
	},
	onShow(){
		// 用户信息接口
		this.getMemberApiUserInfo()
	},
	methods: {
		getList() {
			var self = this;
			let params = {
				startDate: this.year + '-' + this.month + '-01',
				endDate: this.year + '-' + this.month + '-' + this.getDaysInMonth(this.year, this.month)
			};
			this.$api.user.postMemberConsumptionList(params).then(res => {
				if (res.errcode == 0) {
					self.list = self.list.concat(res.list);
					// 最后一页
					if (self.list.length == res.total) {
						self.flag = false;
					}
				}
			});
		},
		// 用户信息接口
		getMemberApiUserInfo() {
			let params = {}
			this.$api.center.getMemberApiUserInfo(params).then(res => {
				if (res.errcode == 0) {
					this.model = res.model
					uni.setStorageSync('NickName', res.model.nickname);
				}
			})
		},
		// 点击日期选择器的确定
		dateConfirm(e) {
			const timeFormat = uni.$u.timeFormat; // 格式化
			let dates = timeFormat(e.value, 'yyyy-mm');
			this.date = dates;
			this.dateShow = false;
			this.year = dates.slice(0,4)
			this.month = dates.slice(-2)
			this.page = 1
			this.list =[]
			this.flag= true
			this.getList()
		},
		// 点击日期选择器的取消
		dateCancel() {
			this.dateShow = false;
		},
		// 格式化日期
		formatter(type, value) {
			if (type === 'year') {
				return `${value}年`;
			}
			if (type === 'month') {
				return `${value}月`;
			}
			if (type === 'day') {
				return `${value}日`;
			}
			return value;
		}
	},
	computed: {},
	onReachBottom() {
		if (this.flag) {
			this.page++;
			this.getList();
		}
	},
	//控制导航栏背景颜色
	onPageScroll: function(e) {
		if (e.scrollTop > 50) {
			this.color = '#ffffff';
			this.titleColor = '#000';
		} else {
			this.color = 'transparent';
			this.titleColor = '#fff';
		}
	}
};
</script>

<style lang="less">
@import './balance.less';
</style>
