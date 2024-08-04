<template>
	<view class="authorize" :class="{ active: show }">
		<view class="auth-alert">
			<view class="auth-box">
				<image :src="`${staticHost}/images/shared/login-icon.png`" class="autho-img"></image>
				<view class="autho-text">蓝鸟心理</view>
				<button class="auth-button" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">
					<view class="auth-button-text">获取手机号</view>
				</button>
				<view class="auth-bottom">
					<view class="auth-tips">你还没有关联手机号，</view>
					<view class="auth-tips">这将会影响部分功能的使用。</view>
				</view>
				<image :src="`${staticHost}/images/shared/login-close.png`" @click="closeSkip" class="autho-close"></image>
			</view>
		</view>
	</view>
</template>

<script>
//全局混入
import { publicMixin } from '../../mixin/public.js';
import { rpxToPx } from '../../utils/util.js';
import authorize from '../../utils/appUtils/module/authorize.js';
export default {
	name: 'diy-authorize',
	mixins: [publicMixin],
	props: {
		show: {
			title: Boolean,
			default: false
		}
	},
	data() {
		return {
			// 是否授权成功
			authorize: false,
			openid: '',
			option: '', //传入option
			sessionkey: '',
			unionid: '',
			encryptedData: '', // 登录的
			iv: '', // 登录的

			newencryptedData: '', // 手机号的
			newiv: '', // 手机号的
			phone: '',

			nickname: '微信用户', // 昵称
			head: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132', // 头像
		};
	},
	onShow() {},
	methods: {
		// 关闭  子组件向父组件传值
		close() {
			this.$emit('closeMain', false);
		},
		// 通过code获取sessionKey和openid
		getCode(option) {
			if (option) {
				this.option = option;
			}
			console.log('option', option);
			var that = this;
			authorize.uniLogin(res => {
				// 判断是否授权成功
				if (res.errMsg === 'login:ok') {
					console.log('code', res.code)
					// 变成true button变成获取手机号
					// 获取数据openid和sessionkey
					var params = {
						code: res.code
					};
					that.$api.user.postLogoApiWxSession(params).then(res => {
						if(res.errcode == 0){
							if(res.token){ // 有token就是老用户 直接授权成功
								uni.setStorageSync('token', res.token);
								that.openid = res.model.openid;
								that.sessionkey = res.model.session_key;
								uni.setStorageSync('openId', that.openid);
								uni.setStorageSync('sessionKey', that.sessionkey);
								// 存一个当前时间
								let timestamp = Date.parse(new Date());
								uni.setStorageSync('tokenDate', timestamp);
								
								this.$emit('closeMain', false); // 授权成功后 关闭弹窗 不是第一次注册
								
								let pages = getCurrentPages();
								let currPage = pages[pages.length - 1]; //当前页面
								let prePage = pages[pages.length - 2]; //上一个页面
								console.log(pages);
								console.log('当前路径', currPage);
								console.log('this.option', that.option);
								if (that.option) {
									currPage.onLoad(that.option);
								} else {
									currPage.onLoad();
								}
								currPage.onShow();
							}else {
								that.openid = res.model.openid;
								that.sessionkey = res.model.session_key;
								uni.setStorageSync('openId', that.openid);
								uni.setStorageSync('sessionKey', that.sessionkey);
								this.$emit('closeMain', true); // 新用户 打开弹窗
							}
						}
					});
				}
			});
		},
		// 获取手机号
		getPhoneNumber(e) {
			var that = this;
			
			that.newencryptedData = e.detail.encryptedData
			that.newiv = e.detail.iv
			console.log('2',e.detail.encryptedData)
			console.log('2',e.detail.iv)
			if(e.detail.errMsg = 'getPhoneNumber:ok'){
				// 获取手机号
				var params = {
					"encrypted": that.newencryptedData,
					"iv": that.newiv,
					"sessionKey": that.sessionkey,
					"wxOpenid": that.openid,
					"nickname": that.nickname,
					"headimgurl": that.head,
					"wxUnionid": that.unionid,
				}
				that.$api.user.postLogoApiWxUserInfo(params).then((res) => {
					if(res.errcode === 0){
						uni.setStorageSync('token', res.token);
						
						this.$emit('closeMain', false); // 授权成功后 关闭弹窗 不是第一次注册
						
						let pages = getCurrentPages();
						let currPage = pages[pages.length - 1]; //当前页面
						let prePage = pages[pages.length - 2]; //上一个页面
						console.log(pages);
						console.log('当前路径', currPage);
						console.log('this.option', that.option);
						if (that.option) {
							currPage.onLoad(that.option);
						} else {
							currPage.onLoad();
						}
						currPage.onShow();
					}
				})
			}else {
				
			}
		},
		// 点击跳过
		closeSkip() {
			this.$emit('closeMain', false);
		}
	},
	watch: {}
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
