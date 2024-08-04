<template>
	<!-- 客服、公众号弹窗 -->
	<view class="exchange">
		<u-popup :show="show" @close="close" mode="center" round="10" :closeOnClickOverlay="true" overlayOpacity="0.7" bgColor="transparent">
			<view class="scan" v-if="!follow">
				<image :src="`${staticHost}/images/shared/login-close.png`" @click="close" class="close"></image>
				<view class="scan-blue-title">扫码添加客服微信</view>
				<image :src="`${staticHost}/images/shared/qr-new.png`" class="qr" :show-menu-by-longpress="true"></image>
        <view class="scan-title">咨询时间：9:00-17:00</view>
			</view>
      <view class="scan" v-else>
				<view class="scan-blue-title green">开启订阅提醒</view>
        <view class="scan-title follow">请确保您在订阅前已关注公众号，若未关注请点击取消后点击“关注公众号”，若已关注请点击确定订阅公众号定时提醒。</view>
        <view class="btns">
          <view class="btn" @click="close">取消</view>
          <navigator
            :url="'/pages/webview/index?userType='+userType" class="btn green" open-type="redirect">确定</navigator>
        </view>
			</view>
		</u-popup>
	</view>
</template>

<script>
/**
 * @property {Number} current 当前选中的项（默认0）
 */
//全局混入
import { publicMixin } from '../../mixin/public.js';
import { rpxToPx } from '../../utils/util.js';
export default {
	name: 'exchange',
	mixins: [publicMixin],
	data() {
		return {
			timer: ''
		};
	},
	// 此处定义传入的数据
	props: {
		show: {
			type: Boolean,
			value: true
		},
    follow:{
      type: Boolean,
			value: false
    },
    userType:{
      type: String,
			value: ''
    }
	},
	created() {},
	methods: {
		close() {
			this.$emit('closeExchange', false);
		}
	},
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>