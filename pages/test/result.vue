<template>
	<!-- 测评流程-->
	<view class="uni-content">
		<image :src="`${staticHost}/images/shared/banner.png`" class="banner"></image>
		<view class="detail">
			<u-navbar title="测评流程" :bgColor="color" :fixed="true" :safeAreaInsetTop="true" :placeholder="true"></u-navbar>
			<view class="detail-box">
				<image :src="`${staticHost}/images/order/sucess.png`" class="sucess-icon"></image>
				<div class="state">恭喜您完成测评</div>
				<div class="tip">如有任何问题，可随时联系在线客服~</div>
				<view class="btns">
					<navigator url="/pages/consult/index" hover-class="none" open-type="redirect" class="btn">咨询预约</navigator>
					<navigator :url="'/pages/test/report?id='+Id" hover-class="none" open-type="redirect" class="btn pay">查看报告</navigator>
				</view>
			</view>
			<view class="scan">
				<view class="scan-title">扫码添加客服微信</view>
				<view class="scan-blue-title">了解更多心理测评信息</view>
				<image :src="`${staticHost}/images/shared/qr.png`" class="qr"></image>
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
			Id: '',
			authoShow: false, // 授权弹窗显示
			title: '咨询师预约',
			color: 'transparent' // 导航栏的背景颜色
		};
	},
	onLoad(option) {
		if (option) {
			this.Id = option.id;
		}
	},
	methods: {
		// 子组件向父组件传值
		closeMain(e) {
			this.authoShow = e;
		}
	},
	computed: {},
	//控制导航栏背景颜色
	onPageScroll: function(e) {
		if (e.scrollTop > 50) {
			this.color = '#ffffff';
		} else {
			this.color = 'transparent';
		}
	}
};
</script>

<style lang="less">
@import './result.less';
</style>
