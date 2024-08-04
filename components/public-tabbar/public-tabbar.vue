<template>
	<!-- tabbar 底部导航自定义组件 -->
	<view class="like-tabbar">
		<view class="tabbar-bottom">
			<view
				class="menu-item"
				:class="{ checked: item.id === selected }"
				v-for="(item, index) in list"
				:key="item.id"
				@click="
					() => {
						menuClick(item);
					}
				"
			>
				<view class="icon-box">
					<image class="icon one" :src="`${staticHost}` + item.checkedIcon" mode="widthFix"></image>
					<image class="icon two" :src="`${staticHost}` + item.uncheckedIcon" mode="widthFix"></image>
				</view>
				<view class="menu-text">{{ item.name }}</view>
			</view>
		</view>
		<!-- 底部空白占位 -->
		<view class="bottom-block"></view>
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
	name: 'like-tabbar',
	mixins: [publicMixin],
	data() {
		return {
			selected: 0,
			list: [
				{
					id: 0,
					name: '首页',
					uncheckedIcon: '/images/shared/home.png',
					checkedIcon: '/images/shared/home-active.png',
					path: '/pages/home/index',
					meta: {
						mode: 'redirectTo' //跳转方式
					}
				},
				{
					id: 1,
					name: '课程',
					uncheckedIcon: '/images/shared/course.png',
					checkedIcon: '/images/shared/course-active.png',
					path: '/pages/course/index',
					meta: {
						mode: 'redirectTo' //跳转方式
					}
				},
				{
					id: 2,
					name: '咨询',
					uncheckedIcon: '/images/shared/consult.png',
					checkedIcon: '/images/shared/consult-active.png',
					path: '/pages/consult/index',
					meta: {
						mode: 'redirectTo' //跳转方式
					}
				},
				{
					id: 3,
					name: '测评',
					uncheckedIcon: '/images/shared/test.png',
					checkedIcon: '/images/shared/test-active.png',
					path: '/pages/test/index',
					meta: {
						mode: 'redirectTo' //跳转方式
					}
				},
				{
					id: 4,
					name: '我的',
					uncheckedIcon: '/images/shared/my.png',
					checkedIcon: '/images/shared/my-active.png',
					path: '/pages/center/index',
					meta: {
						mode: 'redirectTo' //跳转方式
					}
				}
			],
			animateTimer: null,
			go: null
		};
	},
	// 此处定义传入的数据
	props: {
		current: {
			type: Number,
			value: 0
		}
	},
	created() {
		this.selected = this.current;
	},
	methods: {
		menuClick(go) {
			if (this.animateTimer) {
				return false;
			}
			console.log(111)
			this.go = go;
			this.goNextPage(go, 'redirectTo');
		},
		goNextPage(go, mode) {
			this.selected = go.id;
			//这里有两百毫秒的时间可以用来预加载下一个页面
			// uni.preloadPage({url: go.path});
			var goUrl = go.path;
			this.animateTimer = setTimeout(() => {
				// 动画执行完毕后跳转页面
				uni[mode]({
					url: goUrl
				});
				clearTimeout(this.animateTimer);
				this.animateTimer = null;
			}, 200);
		}
	}
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
