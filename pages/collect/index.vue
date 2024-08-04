<template>
	<!-- 我的收藏-->
	<view class="uni-content">
		<image :src="`${staticHost}/images/shared/banner.png`" class="banner"></image>
		<view class="detail">
			<u-navbar title="我的收藏" :bgColor="color" :fixed="true" :safeAreaInsetTop="true" :placeholder="true"></u-navbar>
			<view class="collect-box">
				<view class="banner-search">
					<image :src="`${staticHost}/images/home/search.png`" class="search-icon"></image>
					<u--input placeholder="输入内容关键词" placeholderClass="input-placeholder" :border="none" v-model="keywords" @confirm="search"></u--input>
					<view class="search-button" @click="search">搜索</view>
				</view>
				<view class="apply-top">
					<view class="apply-item" :class="{ active: association_type == 1}" @click="changeType(1)">
						<view class="item-title">咨询师</view>
						<view class="item-line"></view>
						<image :src="`${staticHost}/images/order/white-arrow.png`" class="arrow" v-if="list.length > 0 && association_type == 1"></image>
					</view>
					<view class="apply-item" :class="{ active: association_type == 2}" @click="changeType(2)">
						<view class="item-title">心理课程</view>
						<view class="item-line"></view>
						<image :src="`${staticHost}/images/order/white-arrow.png`" class="arrow"  v-if="list.length > 0 && association_type == 2"></image>
					</view>
					<view class="apply-item" :class="{ active: association_type == 3}" @click="changeType(3)">
						<view class="item-title">心理测评</view>
						<view class="item-line"></view>
						<image :src="`${staticHost}/images/order/white-arrow.png`" class="arrow"  v-if="list.length > 0 && association_type == 3"></image>
					</view>
				</view>
				<!-- 咨询师 -->
				<template v-if="association_type == 1">
					<view class="list" v-if="list.length > 0">
						<view class="item-box" :class="{ active: guide }" v-for="(item, index) in list" :key="index">
							<navigator hover-class="none" :url="'/pages/consult/detail?id=' + item.association_id" class="list-item">
								<image :src="`${host}` + item.associationModel.img_url" class="list-items-img" mode="aspectFill"></image>
								<view class="list-items-right">
									<view class="list-items-top">
										<view class="list-items-name">{{ item.associationModel.main_title }}</view>
										<view class="list-items-intro">从业{{ item.associationModel.working_year }}年</view>
									</view>
									<view class="list-items-title">{{ item.associationModel.subtitle }}</view>
									<view class="list-items-text">
										<template v-for="(items, indexs) in item.associationModel.classAll">
											{{ items }}
											<text v-if="indexs < item.associationModel.classAll.length - 1" class="pd">|</text>
										</template>
									</view>
									<view class="list-items-content">
										<view>
											<view class="list-items-time" v-if="item.associationModel.recentlyTomorrow > 0">
												可预约{{ item.associationModel.recentlyDate + ' ' + item.associationModel.recentlyTime }}
											</view>
										</view>
										<view class="list-items-price">
											<text>￥</text>
											{{ formatPrice(item.associationModel.price) }}
										</view>
									</view>
								</view>
							</navigator>
							<view class="item-choose" @click="choose(item)">
								<image :src="`${staticHost}/images/shared/checked.png`" class="item-checked" v-if="ids.indexOf(item.id) != -1 || all"></image>
								<view class="item-uncheck" v-else></view>
							</view>
						</view>
					</view>
					<view class="no-result-box" v-else>
						<image :src="`${staticHost}/images/order/no-result.png`" class="no-result"></image>
						<view class="no-result-text">暂无任何收藏</view>
						<navigator hover-class="none" url="/pages/consult/index" class="view">立即浏览产品</navigator>
					</view>
				</template>
				<!-- 心理课程 -->
				<template v-if="association_type == 2">
					<view class="list" v-if="list.length > 0">
						<view class="item-box" :class="{ active: guide }" v-for="(item, index) in list" :key="index">
							<navigator hover-class="none" :url="'/pages/course/detail?id=' + item.association_id" class="course-item">
								<image :src="`${host}` + item.associationModel.list_img_url" class="item-img" mode="aspectFill"></image>
								<view class="item-right">
									<view class="item-titles">{{ item.associationModel.main_title }}</view>
									<view class="item-text">{{ item.associationModel.subtitle }}</view>
									<view class="item-content">
										<view class="item-task">
											<text>讲师：</text>
											<text v-for="(items, indexs) in item.associationModel.teacherList" :key="indexs" class="teachers">{{ items.title }}</text>
										</view>
										<view class="item-price">
											<text>￥</text>
											{{ formatPrice(item.associationModel.price) }}
										</view>
									</view>
								</view>
							</navigator>
							<view class="item-choose" @click="choose(item)">
								<image :src="`${staticHost}/images/shared/checked.png`" class="item-checked" v-if="ids.indexOf(item.id) != -1 || all"></image>
								<view class="item-uncheck" v-else></view>
							</view>
						</view>
					</view>
					<view class="no-result-box" v-else>
						<image :src="`${staticHost}/images/order/no-result.png`" class="no-result"></image>
						<view class="no-result-text">暂无任何收藏</view>
						<navigator hover-class="none" url="/pages/course/index" class="view">立即浏览产品</navigator>
					</view>
				</template>
				<!-- 心理测评 -->
				<template v-if="association_type == 3">
					<view class="list" v-if="list.length > 0">
						<view class="item-box" :class="{ active: guide }" v-for="(item, index) in list" :key="index">
							<navigator hover-class="none" :url="'/pages/test/detail?id=' + item.association_id" class="test-item">
								<image :src="`${host}` + item.associationModel.list_img_url" class="item-img" mode="aspectFill"></image>
								<view class="item-right">
									<view class="item-titles">{{ item.associationModel.main_title }}</view>
									<view class="item-text">{{ item.associationModel.subtitle }}</view>
									<view class="item-content">
										<view class="item-task">共{{ item.associationModel.subject_number }}题</view>
										<view class="item-price">
											<text>￥</text>
											{{ formatPrice(item.associationModel.price) }}
										</view>
									</view>
								</view>
							</navigator>
							<view class="item-choose" @click="choose(item)">
								<image :src="`${staticHost}/images/shared/checked.png`" class="item-checked" v-if="ids.indexOf(item.id) != -1 || all"></image>
								<view class="item-uncheck" v-else></view>
							</view>
						</view>
					</view>
					<view class="no-result-box" v-else>
						<image :src="`${staticHost}/images/order/no-result.png`" class="no-result"></image>
						<view class="no-result-text">暂无任何收藏</view>
						<navigator hover-class="none" url="/pages/test/index" class="view">立即浏览产品</navigator>
					</view>
				</template>
			</view>
		</view>
		<view class="fix-bottom" v-if="guide">
			<view class="tips" v-if="ids.length>0">已选择{{ids.length}}个</view>
			<view class="fix-left" @click="chooseAll">
				<image :src="`${staticHost}/images/shared/checked.png`" class="item-checked" v-if="all"></image>
				<view class="item-uncheck" v-else></view>
				全选
			</view>
			<view class="fix-right">
				<view class="cancel" @click="deleteCollect">取消收藏</view>
				<view class="close" @click="closeGuide">关闭管理</view>
			</view>
		</view>
		<view class="fix-bottom" v-else>
			<view class="guide" v-if="list.length > 0" @click="guide = true">收藏管理</view>
			<view class="guide disable" v-else>收藏管理</view>
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
			guide: false,
			flag: true,
			all: false,
			page: 1,
			keywords: '',
			ids: [], //取消收藏
			association_type: 1, //1咨询 2课程 3测评
			list: [],
			color: 'transparent' // 导航栏的背景颜色
		};
	},
	onLoad() {
		this.getList();
	},
	methods: {
		// 列表
		getList() {
			if (!this.flag) {
				return false;
			}
			var self = this;
			let params = {
				page: this.page,
				pageSize: 4,
				keywords: this.keywords,
				association_type: this.association_type //1咨询 2课程 3测评
			};
			this.$api.collect.postCollectList(params).then(res => {
				if (res.errcode == 0) {
					self.list = self.list.concat(res.list);
					//全选
					if(this.all){
						self.ids = []
						self.list.forEach((item,index)=>{
							this.ids.push(item.id)
						})
					}
					// 最后一页
					if (self.list.length == res.total) {
						self.flag = false;
					}
					// 无数据退出管理状态
					if(self.list.length == 0) {
						self.guide = false;
					}
				}
			});
		},
		search(){
			this.guide = false;
			this.all = false;
			this.ids = []
			this.resetDate();
			this.getList();
		},
		changeType(type) {
			this.association_type = type;
			this.guide = false;
			this.all = false;
			this.ids = []
			this.resetDate();
			this.getList();
		},	
		chooseAll() {
			//取消全选
			if(this.all){
				this.ids = []
			}
			else{
				this.ids = []
				this.list.forEach((item,index)=>{
					this.ids.push(item.id)
				})
			}
			this.all = !this.all
		},
		choose(item) {
			var indexOf = this.ids.indexOf(item.id);
			if (indexOf != -1) {
				this.ids.splice(indexOf, 1);
			} else {
				this.ids.push(item.id);
			}
			this.all = this.ids.length >= this.list.length ? true :false
		},
		//删除收藏
		deleteCollect(){
			var self = this;
			let params = {
				ids:this.ids,
			};
			this.$api.collect.postCollectCancellation(params).then(res => {
				if (res.errcode == 0) {
					self.all = false // 取消全选
					self.ids = [] // 清空选中id
					self.resetDate();
					self.getList()
				}
			});
		},
		// 关闭管理
		closeGuide(){
			this.all = false
			this.guide = false 
			this.ids = []
		},
		resetDate() {
			this.flag = true;
			this.page = 1;
			this.list = [];
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
