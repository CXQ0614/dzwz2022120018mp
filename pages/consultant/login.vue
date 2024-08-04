<template>
	<!-- 注册登录-->
	<view class="uni-content">
		<!-- <u-navbar title=" " bgColor="transparent" :fixed="true" :safeAreaInsetTop="true" :placeholder="true">
			<view class="u-nav-slot" slot="left"><view class="banner-title">注册登录</view></view>
		</u-navbar> -->
		<u-navbar
			title="注册登录"
			:leftIconColor="titleColor"
			:titleStyle="'color: ' + titleColor + ';'"
			:bgColor="color"
			:fixed="true"
			:safeAreaInsetTop="true"
			:placeholder="true"
		></u-navbar>
		<image :src="`${staticHost}/images/center/balance-bg.png`" class="banner"></image>
		<view class="consultant">
			<view class="consultant-box">
				<image :src="`${staticHost}/images/consultant/logo.png`" class="consultant-logo"></image>
				<view class="consultant-title">
					欢迎使用
					<br />
					蓝鸟心理小程序～
				</view>
				<view class="consultant-item"><input type="text" v-model="username" class="consultant-input" placeholder-class="placeholder" placeholder="输入您的账号" /></view>
				<view class="consultant-item"><input type="password" v-model="password" class="consultant-input" placeholder-class="placeholder" placeholder="输入账号密码" /></view>
				<view class="consultant-agreement" @click="agreeClick">
					<view class="agreement-icon">
						<view class="agreement-iconborder" v-if="!isAgree"></view>
						<image :src="`${staticHost}/images/consultant/success.png`" v-if="isAgree" class="agreement-icons"></image>
					</view>
					<view class="agreement-right">
						<view class="agreement-title">我已阅读并同意</view>
						<view class="agreement-text" @click="openAgreeMent">《蓝鸟心理服务协议》。</view>
					</view>
				</view>
				<view class="consultant-button" @click="submitClick">登录</view>
			</view>
		</view>

		<!-- loading -->
		<u-loading-page
			fontSize="20"
			iconSize="30"
			loadingText="加载中..."
			loadingMode="spinner"
			:loading="loading"
			bg-color="rgba(0,0,0,0.3)"
			color="#fff"
			loading-color="#fff"
		></u-loading-page>
		
		<!-- 协议 -->
		<agreement type="4" :show="agreementShow" :second="second" v-on:secondChange="secondChange" v-on:closeAgreement="closeAgreement"></agreement>
	</view>
</template>

<script>
import { setTimeout } from 'timers'
import { publicMixin } from '../../mixin/public.js'
export default {
	mixins: [publicMixin],
	data() {
		return {
			color: 'transparent', // 导航栏的背景颜色
			agreementShow: false, // 蓝鸟心理服务协议
			second: 10, // 阅读秒数
			titleColor: '#fff', // 标题和箭头颜色
			username: '', // 账号
			password: '', // 密码
			isAgree: false, // 同意协议
			flag: true, // 锁
			loading: false // 全局的loading
		}
	},
	onLoad() {},
	methods: {
		//阅读秒数变化
		secondChange(e) {
			this.second = e;
		},
		//关闭协议
		closeAgreement(e) {
			this.agreementShow = e;
		},
		openAgreeMent() {
			this.agreementShow = true;
		},
		// 咨询师端登录
		postConsultanLogoApiLogin() {
			this.flag = false
			this.loading = true
			let params = {
				"account": this.username,
				"password": this.$md5(this.password)
			}
			this.$api.consultant.postConsultanLogoApiLogin(params).then(res => {
				this.loading = false
				this.flag = true
				if (res.errcode == 0) {
					uni.setStorageSync('consultantToken', res.token);
					
					// 绑定unionId
					this.postConsultanLogoApiUserUnionId()
				}
			})
		},
		// 绑定unionId
		postConsultanLogoApiUserUnionId() {
			let params = {
        "Token":uni.getStorageSync('consultantToken'),
				"wxUnionid": '',
				"wxOpenid": uni.getStorageSync('openId')
			}
			this.$api.consultant.postConsultanLogoApiUserUnionId(params).then(res => {
				if (res.errcode == 0) {
					uni.redirectTo({
						url: '/pages/consultant/center'
					})
				}
			})
		},
		// 点击确认协议
		agreeClick() {
			if (!this.isAgree) {
				this.isAgree = true
			} else {
				this.isAgree = false
			}
		},
		// 点击登录
		submitClick() {
			var self = this
			if(this.username == ''){
				uni.showToast({
					icon: 'none',
					title: '请输入您的账号',
					duration: 1500
				})
				return false
			}
			if(this.password == ''){
				uni.showToast({
					icon: 'none',
					title: '请输入您的密码',
					duration: 1500
				})
				return false
			}
			if(!this.isAgree){
				uni.showToast({
					icon: 'none',
					title: '请阅读并同意蓝鸟心理服务协议',
					duration: 1500
				})
				return false
			}
			
			// 登录
			this.postConsultanLogoApiLogin()
		}
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
}
</script>

<style lang="less">
@import './login.less';
</style>
