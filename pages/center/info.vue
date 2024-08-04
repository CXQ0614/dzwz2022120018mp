<template>
	<!-- 我的信息-->
	<view class="uni-content">
		<u-navbar title="我的信息" :bgColor="color" :fixed="true" :safeAreaInsetTop="true" :placeholder="true"></u-navbar>
		<image :src="`${staticHost}/images/shared/banner.png`" class="banner"></image>
		<view class="apply-box">
			<view class="info-top">
				<view class="info-box">
					<view class="info-item">
						<view class="info-left">更改头像</view>
						<view class="info-right">
							<view class="info-img">
								<button class="head-btn" open-type="chooseAvatar" @chooseavatar="chooseavatar"></button>
								<image :src="`${host}` + info.head_portrait" class="head-img"></image>
							</view>
							<u-icon name="arrow-right" color="#C3C3CD"></u-icon>
						</view>
					</view>
					<view class="info-item">
						<view class="info-left"><text class="required">*</text>姓名</view>
						<view class="info-right"><input class="info-value" v-model="info.name" placeholder="请输入姓名" placeholder-class="placeholder" /></view>
					</view>
					<view class="info-item">
						<view class="info-left"><text class="required">*</text>性别</view>
						<view class="info-right">
							<view class="radio-item" :class="{ checked: info.sex == item.value }" @click="info.sex = item.value" v-for="(item, index) in sexList" :key="index">
								<view class="item-dot-box"><view class="item-dot"></view></view>
								{{ item.label }}
							</view>
						</view>
					</view>
					<view class="info-item">
						<view class="info-left"><text class="required">*</text>联系电话</view>
						<view class="info-right"><input class="info-value" type="number" disabled v-model="info.mobile" placeholder="请输入联系电话" placeholder-class="placeholder" /></view>
					</view>
					<view class="info-item" @click="birthDayShow = true">
						<view class="info-left"><text class="required">*</text>出生日期</view>
						<view class="info-right">
							{{ info.birth_time }}
							<view class="right-tip" v-if="info.birth_time == ''">请选择</view>
							<u-icon name="arrow-right" color="#C3C3CD"></u-icon>
						</view>
					</view>
					<!-- 选择地区 -->
					<picker mode="region" @change="bindRegionChange">
						<view class="info-item">
							<view class="info-left">所在地</view>
							<view class="info-right">
								<view class="right-tip" v-if="info.address == '' || info.address == null">请选择</view>
								<text v-else>{{ info.address }}</text>
								<u-icon name="arrow-right" color="#C3C3CD"></u-icon>
							</view>
						</view>
					</picker>
				</view>
			</view>
			<view class="info-bottom">
				<view class="public-title">紧急联系人信息</view>
				<view class="info-box">
					<view class="info-item">
						<view class="info-left"><text class="required">*</text>联系人姓名</view>
						<view class="info-right"><input class="info-value" v-model="info.emergency_contact" placeholder="请输入联系人姓名" placeholder-class="placeholder" /></view>
					</view>
					<view class="info-item">
						<view class="info-left"><text class="required">*</text>联系电话</view>
						<view class="info-right"><input class="info-value" type="number" v-model="info.emergency_mobile" placeholder="请输入联系电话" placeholder-class="placeholder" /></view>
					</view>
					<view class="info-item line pb0">
						<view class="info-left"><text class="required">*</text>关系（单选）</view>
						<view class="info-right">
							<view class="checked-item" :class="{ checked: info.relationship == item.value }" @click="info.relationship = item.value" v-for="(item, index) in relationshipList">
								{{ item.label }}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="btns">
				<navigator hover-class="none" url="/pages/center/index" open-type="redirect" class="btn cancel">取消</navigator>
				<view class="btn edit" @click="edit">确认修改</view>
			</view>
		</view>
		<!-- 选择出生日期 -->
		<u-datetime-picker
			:minDate="-2209017943000"
			ref="datetimePicker"
			:show="birthDayShow"
			v-model="date"
			mode="date"
			:formatter="formatter"
			@cancel="birthDayShow = false"
			@confirm="dateConfirm"
		></u-datetime-picker>
		<!-- 授权弹窗 -->
		<diy-authorize ref="authorize" v-on:closeMain="closeMain" :show="authoShow"></diy-authorize>
	</view>
</template>

<script>
import { publicMixin } from '../../mixin/public.js';
export default {
	mixins: [publicMixin],
	data() {
		return {
			color: 'transparent', // 导航栏的背景颜色
			birthDayShow: false,
			authoShow: false, // 授权弹窗显示
			relationshipList: [], // 关系
			sexList: [], //性别
			date: Number(new Date()),
			flag: true,
			info: {
				head_portrait: '',
				name: '',
				sex: '',
				mobile: '',
				birth_time: '',
				address: '',
				emergency_contact: '', // 紧急联系人
				emergency_mobile: '', // 紧急联系人电话
				relationship: '' // 紧急联系人关系
			}
		};
	},
	onShow() {},
	onLoad(option) {
		// 用户信息接口
		this.getMemberApiUserInfo();
		// 信息参数
		this.postOrderMoreConditions();
		console.log(this.date);
	},
	methods: {
		// 用户信息接口
		getMemberApiUserInfo() {
			let params = {};
			this.$api.center.getMemberApiUserInfo(params).then(res => {
				if (res.errcode == 0) {
					uni.setStorageSync('NickName', res.model.nickname);
					if (res.model.head_portrait) {
						this.info.head_portrait =  res.model.head_portrait;
					}
					if (res.model.name) {
						this.info.name = res.model.name;
					}
					this.info.sex = res.model.sex_id;
					this.info.mobile = res.model.mobile;
					if (res.model.birthDate) {
						this.info.birth_time = res.model.birthDate;
					}
					if (res.model.address) {
						this.info.address = res.model.address;
					}
					if (res.model.emergency_contact) {
						this.info.emergency_contact = res.model.emergency_contact;
					}
					if (res.model.emergency_mobile) {
						this.info.emergency_mobile = res.model.emergency_mobile;
					}
					this.info.relationship = res.model.relationship;
					if (this.info.birth_time != '') {
						this.date = Number(new Date(this.info.birth_time));
						console.log(this.date);
					}
				}
			});
		},
		// 信息参数
		postOrderMoreConditions() {
			var self = this;
			let params = {
				association_type: 1 // 1咨询 2课程 3测评
			};
			this.$api.order.postOrderMoreConditions(params).then(res => {
				if (res.errcode == 0) {
					self.sexList = res.sexList;
					self.relationshipList = res.relationshipList;
				}
			});
		},
		edit() {
			// if (
			// 	this.info.head_portrait == '' ||
			// 	this.info.head_portrait == 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132'
			// ) {
			// 	uni.showToast({
			// 		icon: 'none',
			// 		title: '请上传头像',
			// 		duration: 2000
			// 	});
			// 	return false;
			// }
			if (this.info.name == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入姓名',
					duration: 2000
				});
				return false;
			}
			if (this.info.sex === '') {
				uni.showToast({
					icon: 'none',
					title: '请选择性别',
					duration: 2000
				});
				return false;
			}
			if (this.info.mobile == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入联系电话',
					duration: 2000
				});
				return false;
			}
			if (this.info.birth_time == '') {
				uni.showToast({
					icon: 'none',
					title: '请选择出生日期',
					duration: 2000
				});
				return false;
			}

			// if (this.info.address == '') {
			// 	uni.showToast({
			// 		icon: 'none',
			// 		title: '请选择所在地',
			// 		duration: 2000
			// 	});
			// 	return false;
			// }
			if (this.info.emergency_contact == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入联系人姓名',
					duration: 2000
				});
				return false;
			}
			if (this.info.emergency_mobile == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入联系人联系电话',
					duration: 2000
				});
				return false;
			}
			if (this.info.relationship == '') {
				uni.showToast({
					icon: 'none',
					title: '请选择联系人关系',
					duration: 2000
				});
				return false;
			}
			if (!this.flag) {
				return false;
			}
			this.flag = false;
			var self = this;
			let params = {
				head_portrait: this.info.head_portrait,
				name: this.info.name,
				sex: this.info.sex,
				birth_time: this.info.birth_time,
				address: this.info.address,
				emergency_contact: this.info.emergency_contact, // 紧急联系人
				emergency_mobile: this.info.emergency_mobile, // 紧急联系人电话
				relationship: this.info.relationship // 紧急联系人关系
			};
			this.$api.user.postMemberUpUserInfo(params).then(res => {
				self.flag = true;
				if (res.errcode == 0) {
					uni.showToast({
						title: '修改成功',
						duration: 2000
					});
				}
			});
		},
		//点击调用手机相册/拍照
		chooseavatar: function(e) {
			console.log(e);
			var self = this;
			this.uploadImg(e.detail.avatarUrl, function(res) {
				self.info.head_portrait = res;
			});

			// oss获取Sign 每次传图传视频都调用一次
			// this.getStoreOssSign(function() {
			// 	// // 上传oss 0是图片 1是视频
			// 	self.uploadOss(0, e.detail.avatarUrl, function(res) {
			// 		console.log('123', res);
			// 		self.info.avater = res;
			// 	});
			// });
		},
		bindRegionChange(e) {
			this.info.address = e.detail.value[0] + e.detail.value[1] + e.detail.value[2];
		},
		// 格式化
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
		},
		dateConfirm(e) {
			this.birthDayShow = false;
			const timeFormat = uni.$u.timeFormat; // 格式化
			let dates = timeFormat(e.value, 'yyyy-mm-dd');
			this.info.birth_time = dates;
		},
		// 子组件向父组件传值
		closeMain(e) {
			this.authoShow = e;
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
	}
};
</script>

<style lang="less">
@import './info.less';
</style>
