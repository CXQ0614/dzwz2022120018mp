<template>
	<!-- 关于我们-->
	<view class="uni-content">
		<u-navbar
			title="关于我们"
			:leftIconColor="titleColor"
			:titleStyle="'color: ' + titleColor + ';'"
			:bgColor="color"
			:fixed="true"
			:safeAreaInsetTop="true"
			:placeholder="true"
		></u-navbar>
		<image :src="`${staticHost}/images/center/balance-bg.png`" class="banner"></image>
		<view class="about">
			<view class="about-box">
				<view class="title">蓝鸟心理咨询</view>
				<view class="content">
					<image :src="`${staticHost}/images/center/logo.png`"  class="logo" mode="widthFix"></image>
					<view class="slogan">
						蓝鸟心理<br>
						心有归巢，翼有蓝天<br>
						助力1,000,000人<br>
						成为自己的专业心理顾问
					</view>
					蓝鸟心理隶属于易馨亿翼（上海）信息科技有限公司，我们致力于为用户建立线上线下一体化心理学平台，聚集国内新锐心理学人，输出健康、科学的心理学价值。在心理学中发现趣味，分享美好；为需要心理帮助的人提供在线解决方案；为心理机构提供展示、推广及服务平台。用有趣、有爱、实用的表达方式为社会、组织及每一个人提供有价值的心理学服务。
				</view>
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
			authoShow: false, // 授权弹窗显示
			color: 'transparent', // 导航栏的背景颜色
			titleColor: '#fff' // 标题和箭头颜色
		};
	},
	onLoad() {},
	methods: {},
	computed: {},
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
@import './about.less';
</style>
