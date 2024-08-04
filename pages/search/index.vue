<template>
	<!-- 搜索页-->
	<view class="uni-content">
		<image :src="`${staticHost}/images/shared/banner.png`" class="banner"></image>
		<view class="detail">
			<u-navbar title="搜索页" :bgColor="color" :fixed="true" :safeAreaInsetTop="true" :placeholder="true"></u-navbar>
			<view class="collect-box">
				<view class="banner-search">
					<image :src="`${staticHost}/images/home/search.png`" class="search-icon"></image>
					<u--input placeholder="输入内容关键词" placeholderClass="input-placeholder" :border="none" v-model="keywords" @confirm="search"></u--input>
					<view class="search-button" @click="search">搜索</view>
				</view>
				<view class="apply-top">
					<view class="apply-item" :class="{ active: type == 1 }" @click="changeType(1)">
						<view class="item-title">咨询师</view>
						<view class="item-line"></view>
						<image :src="`${staticHost}/images/order/white-arrow.png`" class="arrow" v-if="list.length > 0 && type == 1"></image>
					</view>
					<view class="apply-item" :class="{ active: type == 2}" @click="changeType(2)">
						<view class="item-title">心理课程</view>
						<view class="item-line"></view>
						<image :src="`${staticHost}/images/order/white-arrow.png`" class="arrow" v-if="list.length > 0 && type == 2"></image>
					</view>
					<view class="apply-item" :class="{ active: type == 3 }" @click="changeType(3)">
						<view class="item-title">心理测评</view>
						<view class="item-line"></view>
						<image :src="`${staticHost}/images/order/white-arrow.png`" class="arrow" v-if="list.length > 0 && type == 3"></image>
					</view>
				</view>
				<!-- 咨询师 -->
				<template v-if="type == 1">
					<view class="list" v-if="list.length > 0">
						<navigator hover-class="none" :url="'/pages/consult/detail?id=' + item.consultant_id" class="list-item" v-for="(item, index) in list" :key="index">
							<image :src="`${host}` + item.img_url" class="list-items-img" mode="aspectFill"></image>
							<view class="list-items-right">
								<view class="list-items-top">
									<view class="list-items-name">{{ item.main_title }}</view>
									<view class="list-items-intro">从业{{ item.working_year }}年</view>
								</view>
								<view class="list-items-title">{{ item.subtitle }}</view>
								<view class="list-items-text">
									<template v-for="(items, indexs) in item.classAll">
										{{ items }}
										<text v-if="indexs < item.classAll.length - 1" class="pd">|</text>
									</template>
								</view>
								<view class="list-items-content">
									<view>
										<view class="list-items-time" v-if="item.recentlyTomorrow > 0">可预约{{ item.recentlyDate + ' ' + item.recentlyTime }}</view>
									</view>
									<view class="list-items-price">
										<text>￥</text>
										{{ formatPrice(item.price) }}
									</view>
								</view>
							</view>
						</navigator>
					</view>
				</template>
				<!-- 心理课程 -->
				<template v-if="type == 2">
					<view class="list" v-if="list.length > 0">
						<navigator hover-class="none" :url="'/pages/course/detail?id=' + item.info_id" class="course-item" v-for="(item, index) in list" :key="index">
							<image :src="`${host}` + item.list_img_url" class="item-img" mode="aspectFill"></image>
							<view class="item-right">
								<view class="item-titles">{{ item.main_title }}</view>
								<view class="item-text">{{ item.subtitle }}</view>
								<view class="item-content">
									<view class="item-task">
										<text>讲师：</text>
										<text v-for="(items, indexs) in item.teacherList" :key="indexs" class="teachers">{{ items.title }}</text>
									</view>
									<view class="item-price">
										<text>￥</text>
										{{ formatPrice(item.price) }}
									</view>
								</view>
							</view>
						</navigator>
					</view>
				</template>
				<!-- 心理测评 -->
				<template v-if="type == 3">
					<view class="list" v-if="list.length > 0">
						<navigator hover-class="none" :url="'/pages/test/detail?id=' + item.evaluation_id" class="test-item" v-for="(item, index) in list" :key="index">
							<image :src="`${host}` + item.list_img_url" class="item-img" mode="aspectFill"></image>
							<view class="item-right">
								<view class="item-titles">{{ item.main_title }}</view>
								<view class="item-text">{{ item.subtitle }}</view>
								<view class="item-content">
									<view class="item-task">共{{ item.subject_number }}题</view>
									<view class="item-price">
										<text>￥</text>
										{{ formatPrice(item.price) }}
									</view>
								</view>
							</view>
						</navigator>
					</view>
				</template>
				<view class="no-result-box" v-if="list.length == 0">
					<image :src="`${staticHost}/images/order/no-result.png`" class="no-result"></image>
					<view class="no-result-text">暂无搜索结果~</view>
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
			authoShow: false, // 授权弹窗显示
			type: 1, // 1咨询师  2课程  2测评
			page: 1, // 页数
			keywords: '',
			flag: true,
			list: [],
			color: 'transparent' // 导航栏的背景颜色
		};
	},
	onLoad() {},
	methods: {
		//列表
		getList() {
			if (!this.flag) {
				return false;
			}
			// 咨询师
			if (this.type == 1) {
				this.getConsultant();
			}
			// 课程
			if (this.type == 2) {
				this.getCourse();
			}
			// 测评
			if (this.type == 3) {
				this.getTest();
			}
		},
		// 咨询师
		getConsultant() {
			var self = this;
			let params = {
				page: this.page,
				pageSize: 10,
				keywords: this.keywords
			};
			this.$api.consultant.postConsultanList(params).then(res => {
				if (res.errcode == 0) {
					self.list = self.list.concat(res.list);
					if (res.total == self.list.length) {
						self.flag = false;
					}
				}
			});
		},
		// 课程
		getCourse() {
			var self = this;
			let params = {
				page: this.page,
				pageSize: 10,
				keywords: this.keywords,
			};
			this.$api.course.postCourseList(params).then(res => {
				if (res.errcode == 0) {
					self.list = self.list.concat(res.list);
					if (res.total == self.list.length) {
						self.flag = false;
					}
				}
			});
		},
		// 测评
		getTest() {
			var self = this;
			let params = {
				page: this.page,
				pageSize: 10,
				keywords: this.keywords
			};
			this.$api.test.postEvaluationList(params).then(res => {
				if (res.errcode == 0) {
					self.list = self.list.concat(res.list);
					if (res.total == self.list.length) {
						self.flag = false;
					}
				}
			});
		},
		search() {
			if (this.keywords == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入内容关键字',
					duration: 2000
				});
				return false;
			}
			this.page = 1;
			this.list = [];
			this.flag = true;
			this.getList();
		},
		changeType(type) {
			this.type = type;
			this.search();
		},
		// 子组件向父组件传值
		closeMain(e) {
			this.authoShow = e;
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
		} else {
			this.color = 'transparent';
		}
	}
};
</script>

<style lang="less">
@import './index.less';
</style>
