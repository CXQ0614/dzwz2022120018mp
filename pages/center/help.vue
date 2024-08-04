<template>
	<!-- 首页-->
	<view class="uni-content">
		<u-navbar title="帮助中心" :bgColor="color" :fixed="true" :safeAreaInsetTop="true" :placeholder="true"></u-navbar>
		<image :src="`${staticHost}/images/shared/banner.png`" class="banner"></image>
		<view class="help">
			<view class="help-box">
				<view class="help-item" v-for="(item, index) in list" :key="index">
					<view class="help-item-top" @click="openClick(item,index)">
						<view class="help-item-left">
							<view class="help-item-title">Q{{ index+1 }}:</view>
							<view class="help-item-text">{{ item.contents }}</view>
						</view>
						<image :src="`${staticHost}/images/shared/arrow-bottom.png`" class="help-item-right"></image>
					</view>
					<view class="help-item-bottom" v-if="item.checked">{{ item.introduction }}</view>
				</view>
			</view>
		</view>
    <view @click="exchangeShow=true" class="customer-icon"><image :src="`${staticHost}/images/shared/customer-icon.png`" class="icon"></image></view>
    <!-- 客服 -->
    <exchange :show="exchangeShow" v-on:closeExchange="closeExchange"></exchange>
	</view>
</template>

<script>
import { publicMixin } from '../../mixin/public.js'
export default {
	mixins: [publicMixin],
	data() {
		return {
			color: 'transparent', // 导航栏的背景颜色
			flag:true,
			page:1,
			list: [],
      exchangeShow:false, // 客服

		}
	},
	onLoad() {
		this.getList()
	},
	methods: {
    openExchange(){
    	this.exchangeShow = true;
    },
    closeExchange(e){
    	this.exchangeShow = e;
    },
		//列表
		getList() {
			if(!this.flag){
				return false
			}
			var self = this;
			let params = {
				page:this.page,
				pageSize:30,
			};
			this.$api.user.postCopywritingList(params).then(res => {
				if (res.errcode == 0) {
					var list = res.list
					list.forEach((item,index)=>{
						item.checked= false
					})
					self.list = self.list.concat(list)

					if(res.total == self.list.length){
						self.flag = false;
					}
				}
			});
		},
		// 点击展开
		openClick(item,index){
			item.checked = !item.checked
      this.$set(this.list,index,item)
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
			this.color = '#ffffff'
		} else {
			this.color = 'transparent'
		}
	}
}
</script>

<style lang="less">
@import './help.less';
</style>
