<template>
	<!-- 首页-->
	<view class="uni-content">
		<u-navbar title="建议反馈" :bgColor="color" :fixed="true" :safeAreaInsetTop="true" :placeholder="true"></u-navbar>
		<image :src="`${staticHost}/images/shared/banner.png`" class="banner"></image>
		<view class="help">
			<view class="help-box">
				<view class="help-title">建议反馈</view>
				<u--textarea v-model="textareaValue" placeholder="请描述您的问题，方便我们尽快为您处理" count maxlength="300"></u--textarea>
			</view>
			<view class="help-button" @click="submit">提交</view>
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
			flag:true,
			textareaValue: '' // 反馈内容
		};
	},
	onLoad() {},
	methods: {
		// 点击提交
		submit() {
			if (this.textareaValue == '') {
				uni.showToast({
					icon: 'none',
					title: '请描述您的问题，方便我们尽快为您处理',
					duration: 1500
				});
				return false;
			}
			if(!this.flag){
				return false
			}
			this.flag = false
			let params = {
				subtitle: this.textareaValue,
			};
			this.$api.user.postOpinionAdd(params).then(res => {
				this.flag = true
				if (res.errcode == 0) {
					this.textareaValue = ''
					uni.showToast({
						title: '提交成功',
						duration: 1500
					});
				}
			});
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
@import './feedback.less';
</style>
