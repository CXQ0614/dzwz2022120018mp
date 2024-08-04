<template>
	<!-- 我的券码-->
	<view class="uni-content">
		<u-navbar title="我的券码" :bgColor="color" :fixed="true" :safeAreaInsetTop="true" :placeholder="true"></u-navbar>
		<image :src="`${staticHost}/images/shared/banner.png`" class="banner"></image>
		<view class="apply-box">
			<view class="apply-top">
				<view class="apply-item" :class="{ active: step == 0 }" @click="changeStep(0)">
					<view class="item-title">兑换码</view>
					<view class="item-line"></view>
					<image :src="`${staticHost}/images/order/white-arrow.png`" class="arrow"></image>
				</view>
				<view class="apply-item" :class="{ active: step == 1 }" @click="changeStep(1)">
					<view class="item-title">抵用券</view>
					<view class="item-line"></view>
					<image :src="`${staticHost}/images/order/white-arrow.png`" class="arrow"></image>
				</view>
			</view>
			<view class="exchange" v-if="step == 0">
				<input v-model="code" placeholder="请输入兑换码,区分大小写" class="exchange-code" />
				<view class="exchange-btn" @click="exchange">立即兑换</view>
				<view class="exchange-rule">
					<view class="rule-title">兑换规则</view>
					<view class="rule-content">
						1.兑换码可通过参与网易云音乐或合作商家举行的运营活动获得。
						<br />
						2.若兑换码无法兑换,则需联系发放兑换码的平台核实。
						<br />
						3.兑换流程: 核实账户信息,填写兑换码,点击立目兑换。
						<br />
						4.兑换账户默认为本机帐号,兑换前请核实帐号信息,确保登陆帐号为常用帐号,兑换成功后权益不可转移。
						<br />
						5.兑换成功后,可至对应页面查看权益,其中优惠券的使用规则,详见优惠券说明。
					</view>
				</view>
				<!-- 兑换成功 -->
				<u-popup :show="show" @close="closePop" bgColor="transparent" mode="center">
					<view class="pop-box">
						<view class="pop">
							<view class="pop-title">兑换成功</view>
							<view class="pop-content" v-if="model.type == 0">
								恭喜您获得账户金额：
								<span class="blue">¥ {{model.price}}</span>
							</view>
							<view class="pop-content" v-else>
								恭喜您获得：
								<span class="blue">{{model.main_title}}*1</span>
							</view>
							<view class="token-item" v-if="model.type == 1">
								<view class="item-left">
									<image :src="`${staticHost}/images/test/token.png`" class="token"></image>
									<view class="token-box">
										<view class="token-left">
											<view class="token-title">{{model.main_title}}</view>
											<view class="token-date">有效期：{{model.startDate}} 至 {{model.endDate}}</view>
										</view>
										<view class="token-right">
											<view class="token-num">1次</view>
											<view class="token-name">指定测评券</view>
										</view>
									</view>
								</view>
							</view>
							<view class="confirm" @click="closePop">确定</view>
						</view>
						<image :src="`${staticHost}/images/shared/round-close.png`" class="close" @click="closePop"></image>
					</view>
				</u-popup>
			</view>
			<view class="token-warp" v-else>
				<view class="token-top">
					<view class="token-item" :class="{ active: type == 0 }" @click="type = 0">可用抵用券({{availableTotal}})</view>
					<view class="token-item" :class="{ active: type == 1 }" @click="type = 1">不可用抵用券({{unavailableTotal}})</view>
				</view>
				<view class="token-bottom" v-if="type == 0">
					<view class="token-item" v-for="(item, index) in availableList">
						<view class="item-left">
							<image :src="`${staticHost}/images/test/token.png`" class="token"></image>
							<view class="token-box">
								<view class="token-left">
									<view class="token-title">{{ item.securitiesModel.main_title  }}</view>
									<view class="token-date">有效期：{{ item.securitiesModel.startDate }} 至 {{ item.securitiesModel.endDate }}</view>
								</view>
								<view class="token-right">
									<view class="token-num">1次</view>
									<view class="token-name">指定测评券</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="token-bottom" v-if="type == 1 ">
					<view class="token-item disable" v-for="(item, index) in unavailableList">
						<view class="item-left">
							<image :src="`${staticHost}/images/test/token.png`" class="token"></image>
							<view class="token-box">
								<view class="token-left">
									<view class="token-title">{{ item.securitiesModel.main_title }}</view>
									<view class="token-date">有效期：{{ item.securitiesModel.startDate }} 至 {{ item.securitiesModel.endDate }}</view>
								</view>
								<view class="token-right">
									<view class="token-num">1次</view>
									<view class="token-name">指定测评券</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
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
			step: 0,
			authoShow: false, // 授权弹窗显示
			type: 0, // 0 可抵用 1不可
			show: false, //兑换成功
			code: '', //兑换码
			model:{}, // 兑换券详情
			availableList: [],
			availableTotal: 0,
			unavailableList: [],
			unavailableTotal: 0
		};
	},
	onShow() {},
	onLoad(option) {
	},
	methods: {
		exchange() {
			if (this.code == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入兑换码',
					duration: 2000
				});
				return false;
			}
			let params = {
				code: this.code
			};
			this.$api.token.postVoucherAdd(params).then(res => {
				if (res.errcode == 0) {
					this.show = true;
					this.model = res.model
				}
			});
		},
		changeStep(step){
			this.step = step 
			if(step == 1){
				this.getList()
			}
		},
		getList() {
			let params = {};
			this.$api.token.postVoucherList(params).then(res => {
				if (res.errcode == 0) {
					this.availableList = res.availableList;
					this.availableTotal = res.availableTotal;
					this.unavailableList = res.unavailableList;
					this.unavailableTotal = res.unavailableTotal;
				}
			});
		},
		closePop(){
			this.show = false
			this.code = ''
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
@import './index.less';
</style>
