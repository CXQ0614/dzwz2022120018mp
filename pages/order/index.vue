<template>
	<!-- 订单列表-->
	<view class="uni-content">
		<image :src="`${staticHost}/images/shared/banner.png`" class="banner"></image>
		<view class="detail">
			<u-navbar title="我的订单" :bgColor="color" :fixed="true" :safeAreaInsetTop="true" :placeholder="true"></u-navbar>
			<view class="order-type">
				<view class="type-item" :class="{ active: association_type == 1 }" @click="changeType(1)">
					<view class="item-bg" :style="'background-image: url(' + `${staticHost}` + '/images/order/nav-left.png);'"></view>
					<view class="item-text">心理咨询</view>
				</view>
				<view class="type-item" :class="{ active: association_type == 2 }" @click="changeType(2)">
					<view class="item-bg" :style="'background-image: url(' + `${staticHost}` + '/images/order/nav-center.png);'"></view>
					<view class="item-text">心理课程</view>
				</view>
				<view class="type-item" :class="{ active: association_type == 3 }" @click="changeType(3)">
					<view class="item-bg" :style="'background-image: url(' + `${staticHost}` + '/images/order/nav-right.png);'"></view>
					<view class="item-text">心理测评</view>
				</view>
			</view>
			<view class="order-box">
				<view class="banner-search">
					<image :src="`${staticHost}/images/home/search.png`" class="search-icon"></image>
					<u--input placeholder="输入内容关键词" placeholderClass="input-placeholder" :border="none" v-model="keyword" @confirm="search"></u--input>
					<view class="search-button" @click="search">搜索</view>
				</view>
				<u-tabs
					:list="tabList"
					:current="current"
					:scrollable="false"
					@change="currentChange"
					lineWidth="24"
					lineHeight="4"
					lineColor="linear-gradient(134deg, #149cff 0%, #0975e8 100%)"
					:activeStyle="{
						color: 'transparent',
						'font-size': '36rpx',
						'font-weight': 'bold',
						'-webkit-background-clip': 'text',
						'background-image': 'linear-gradient(134deg, #149cff 0%, #0975e8 100%)'
					}"
					:inactiveStyle="{
						color: '#666A72',
						'font-size': '32rpx'
					}"
				></u-tabs>
				<!-- 心理咨询 -->
				<template v-if="association_type == 1">
					<view class="list" v-if="list.length > 0">
						<navigator hover-class="none" :url="'/pages/order/consultDetail?id=' + item.order_id" class="list-item" v-for="(item, index) in list" :key="item.order_id">
							<view class="item-top">
								<view class="item-left">
									<image :src="`${staticHost}/images/home/logo.png`" class="logo"></image>
									<view class="detail-title">蓝鸟心理</view>
								</view>
								<view class="item-state" v-if="item.order_state == 0">待付款</view>
								<view class="item-state" v-if="item.order_state == 5">等待咨询</view>
								<view class="item-state" v-if="item.order_state == 10">咨询已完成</view>
								<view class="item-state" v-if="item.order_state == 20">已取消</view>
							</view>
							<view class="item-detail">
								<image :src="`${host}` + item.associationModel.img_url" class="item-img" mode="aspectFill"></image>
								<view class="item-right">
									<view class="item-name">咨询师：{{ item.associationModel.main_title }}</view>
									<view class="item-type">视频咨询、{{ formatPrice(item.associationModel.price) }}元 / 50分钟</view>
									<view class="item-content">
										<view class="item-price-title">咨询费用：</view>
										<view class="item-price">
											<text>￥</text>
											{{ formatPrice(item.payment_amount) }}
										</view>
									</view>
								</view>
							</view>
							<!-- 已取消不显示 -->
							<view class="info-box">
								<template v-if="item.order_state != 20">
									<view class="info-item">
										<view class="info-left">预约信息：</view>
										<view class="info-right">
											查看详情
											<image :src="`${staticHost}/images/shared/black-arrow.png`" class="arrow"></image>
										</view>
									</view>

									<view class="info-item">
										<view class="info-left">预约时间：</view>
										<view class="info-right">{{ item.recentlyDate }}({{ item.recentlyWeek }}) {{ item.startTime }} - {{ item.endTime }}</view>
									</view>
								</template>
							</view>
							<view class="flex" v-if="item.order_state == 0">
								<view class="btn half line" @click.stop="cancelOrder(item.order_id)">取消订单</view>
								<view class="btn half" @click.stop="pay(item,1)">立即支付</view>
							</view>
							<template v-if="item.order_state == 5">
								<view class="btn" v-if="item.isStart" @click.stop="enterConsult(item)">进入咨询</view>
								<view class="btn gray" v-else>咨询未开始</view>
							</template>					
							<view class="btn gray" v-if="item.order_state == 10">咨询已完成</view>
							<view class="btn gray" v-if="item.order_state == 20">订单已取消</view>
						</navigator>
					</view>
					<view class="no-result-box" v-else>
						<image :src="`${staticHost}/images/order/no-result.png`" class="no-result"></image>
						<view class="no-result-text">暂无任何订单</view>
						<navigator hover-class="none" url="/pages/consult/index" class="view">立即浏览产品</navigator>
					</view>
				</template>
				<!-- 心理课程 -->
				<template v-if="association_type == 2">
					<view class="list" v-if="list.length > 0">
						<navigator hover-class="none" :url="'/pages/order/courseDetail?id=' + item.order_id" class="list-item" v-for="(item, index) in list" :key="item.order_id">
							<view class="item-top">
								<view class="item-left">
									<image :src="`${staticHost}/images/home/logo.png`" class="logo"></image>
									<view class="detail-title">蓝鸟心理</view>
								</view>
								<view class="item-state" v-if="item.order_state == 0">待付款</view>
								<view class="item-state" v-if="item.order_state == 5 || item.order_state == 10">已购买</view>
								<view class="item-state" v-if="item.order_state == 20">已取消</view>
							</view>
							<view class="item-detail">
								<image :src="`${host}` + item.associationModel.list_img_url" class="item-img" mode="aspectFill"></image>
								<view class="item-right">
									<view class="item-name">{{ item.associationModel.main_title }}</view>
									<view class="item-type">共{{ item.associationModel.class_hour }}课时</view>
									<view class="item-content">
										<view class="item-price-title">实付金额：</view>
										<view class="item-price">
											<text>￥</text>
											{{ formatPrice(item.payment_amount) }}
										</view>
									</view>
								</view>
							</view>
							<view class="flex" v-if="item.order_state == 0">
								<view class="btn half line" @click.stop="cancelOrder(item.order_id)">取消订单</view>
								<view class="btn half" @click.stop="pay(item,2)">立即支付</view>
							</view>
							<view class="btn" v-if="item.order_state == 5" @click.stop="openCourse">兑换课程</view>
							<view class="btn gray" v-if="item.order_state == 10">课程已兑换</view>
							<view class="btn gray" v-if="item.order_state == 20">订单已取消</view>
						</navigator>
					</view>
					<view class="no-result-box" v-else>
						<image :src="`${staticHost}/images/order/no-result.png`" class="no-result"></image>
						<view class="no-result-text">暂无任何订单</view>
						<navigator hover-class="none" url="/pages/course/index" class="view">立即浏览产品</navigator>
					</view>
				</template>
				<!-- 心理测评 -->
				<template v-if="association_type == 3">
					<view class="list" v-if="list.length > 0">
						<navigator hover-class="none" :url="'/pages/order/testDetail?id=' + item.order_id" class="list-item" v-for="(item, index) in list" :key="item.order_id">
							<view class="item-top">
								<view class="item-left">
									<image :src="`${staticHost}/images/home/logo.png`" class="logo"></image>
									<view class="detail-title">蓝鸟心理</view>
								</view>
								<view class="item-state" v-if="item.order_state == 0">待付款</view>
								<view class="item-state" v-if="item.order_state == 5">未完成</view>
								<view class="item-state" v-if="item.order_state == 10">已完成</view>
								<view class="item-state" v-if="item.order_state == 20">已取消</view>
							</view>
							<view class="item-detail">
								<image :src="`${host}` + item.associationModel.list_img_url" class="item-img" mode="aspectFill"></image>
								<view class="item-right">
									<view class="item-name">{{ item.associationModel.main_title }}</view>
									<view class="item-type">共{{ item.associationModel.subject_number }}题</view>
									<view class="item-content">
										<view class="item-price-title">实付金额：</view>
										<view class="item-price">
											<text>￥</text>
											{{ formatPrice(item.payment_amount) }}
										</view>
									</view>
								</view>
							</view>
							<view class="flex" v-if="item.order_state == 0">
								<view class="btn half line" @click.stop="cancelOrder(item.order_id)">取消订单</view>
								<view class="btn half" @click.stop="pay(item,3)">立即支付</view>
							</view>
							<navigator :url="'/pages/test/test?id=' + item.order_id+'&title='+item.main_title" hover-class="none" class="btn" v-if="item.order_state == 5" @click.stop>开始测评</navigator>
							<navigator :url="'/pages/test/report?id=' + item.order_id" hover-class="none" class="btn" v-if="item.order_state == 10" @click.stop>查看测评报告</navigator>
							<view class="btn gray" v-if="item.order_state == 20">订单已取消</view>
						</navigator>
					</view>
					<view class="no-result-box" v-else>
						<image :src="`${staticHost}/images/order/no-result.png`" class="no-result"></image>
						<view class="no-result-text">暂无任何订单</view>
						<navigator hover-class="none" url="/pages/test/index" class="view">立即浏览产品</navigator>
					</view>
				</template>
			</view>
		</view>
		<view @click="exchangeShow=true" class="customer-icon"><image :src="`${staticHost}/images/shared/customer-icon.png`" class="icon"></image></view>
		<!-- 授权弹窗 -->
		<diy-authorize ref="authorize" v-on:closeMain="closeMain" :show="authoShow"></diy-authorize>
		<!-- 客服 -->
		<exchange :show="exchangeShow" v-on:closeExchange="closeExchange"></exchange>
	</view>
</template>

<script>
import { publicMixin } from '../../mixin/public.js';
export default {
	mixins: [publicMixin],
	data() {
		return {
			authoShow: false, // 授权弹窗显示
			exchangeShow: false, // 客服显示
			page: 1,
			keyword: '',
			flag: true,
			association_type: 1, // 分类 1咨询 2课程 3测评
			current: 0, //分类选择index
			order_state: '', //分类状态
			tabList: [],
			list: [],
			color: 'transparent' ,// 导航栏的背景颜色
      intervalId:null,
		};
	},
	onLoad(option) {
		if (option.type) {
			this.association_type = option.type;
		}
		//订单状态
		this.getStateList();
	},
	onShow() {
		this.getList(true,true); // 更新数据
     // setInterval(() => {
     //      const currentDate = new Date();
     //      const currentMinutes = currentDate.getMinutes();
     //      if (currentMinutes % 10 === 0) { // 当前分钟为10的倍数时
     //        this.getList(true,true); // 调用需要执行的方法
     //      }
     //    }, 1000); // 每秒钟执行一次检查 
      this.checkTime()
	},
  onUnload(){
    // clearInterval()
    this.intervalId =null
  },
	methods: {
    checkTime(){
      const intervalId = setInterval(() => {
             const currentDate = new Date();
             const currentHour = currentDate.getHours();
             const currentMinute = currentDate.getMinutes();
             console.log('currentMinute',currentMinute);
             for (let i = 0; i < this.list.length; i++) {
               const item = this.list[i];
               const [startHour, startMinute] = item.startTime.split(':');
               
               if (parseInt(startHour) == currentHour && parseInt(startMinute) == currentMinute) {
                 this.getList(true,true)
               }
             }
           }, 60000); // 每秒检查一次
           // 保存intervalId，以便在组件销毁时清除定时器
           this.intervalId = intervalId;
    },
		// 订单状态
		getStateList() {
			var self = this;
			let params = {
				association_type: this.association_type //1咨询 2课程 3测评
			};
			this.$api.order.getStateList(params).then(res => {
				if (res.errcode == 0) {
					var stateList = [];
					var obj = {
						name: '全部',
						value: ''
					};
					stateList.push(obj);
					for (let i in res.stateList) {
						var obj = {
							name: res.stateList[i].label,
							value: res.stateList[i].value
						};
						stateList.push(obj);
					}
					self.tabList = stateList;
				}
			});
		},
		// 订单列表
		getList(loading,changeState) {
			if(changeState){
				this.flag = true
			}
			if (!this.flag) {
				return false;
			}
			var self = this;
			let params = {
				page: changeState ? 1 : this.page,
				pageSize: changeState ? this.page * 10 : 10,
				keywords: this.keyword,
				order_state: this.order_state,
				association_type: this.association_type //1咨询 2课程 3测评
			};
			this.$api.order.postOrderList(params,loading).then(res => {
				if (res.errcode == 0) {
					var list = res.list;
					if (changeState) {
						self.list = list;
					} else {
						self.list = self.list.concat(list);
					}
					// 最后一页
					if (self.list.length == res.total) {
						self.flag = false;
					}
					
					// 心理咨询的加一个时间判断
					if(self.association_type == 1){
						self.list.forEach((item,index) => {
							var currentTime = new Date().valueOf(); //当前日期
							// 咨询开始时间 - 当前时间
							var ceshiTime = (item.consultant_start_time * 1000 - currentTime) / 1000 ; //距离咨询开始剩余时间
							console.log(ceshiTime)
							if(ceshiTime < 0){ // 已经开始了
								item.isStart = true
							}else {
								item.isStart = false
							}
						})
					}
					console.log('列表', self.list)
					
				}
			});
		},
		//取消订单
		cancelOrder(Id) {
			var self = this;
			uni.showModal({
				title: '提示',
				content: '订单还未付款，确认要取消吗？',
				success: function(res) {
					if (res.confirm) {
						let params = {
							id: Id
						};
						self.$api.order.postOrderCancellation(params).then(res => {
							if (res.errcode == 0) {
								self.flag = true;
								self.getList(false,true);
								uni.showToast({
									icon: 'sucess',
									title: '取消成功',
									duration: 1500
								});
							}
						});
					}
				}
			});
		},
		pay(item,type) {
			var self = this;
			var params = {
				order_number: item.order_number
			};
			this.$api.order.postWeChatPayPayment(params).then(res => {
				console.log(res);
				if (res.errcode == 0) {
					uni.requestPayment({
						timeStamp: String(res.data.timeStamp),
						nonceStr: res.data.nonceStr,
						package: res.data.package,
						signType: res.data.signType,
						paySign: res.data.paySign,
						success(payRes) {
							console.log(payRes);
							//下单成功
							if (payRes.errMsg === 'requestPayment:ok') {
								uni.redirectTo({
									url: '/pages/order/result?type='+type+'&id=' + item.order_id
								});
							}
						},
						fail(payRes) {
            if (payRes.errMsg === 'requestPayment:fail cancel') {
               return
              } else{
                	uni.showModal({
								title: '提示',
								content: payRes.errMsg,
								showCancel: false
							});
              }
						
						}
					});		
				}
			});
		},
		enterConsult(item) {
			var self = this
      console.log('item',item);
			console.log('uni.getStorageSync(NickName)',item.name)
			console.log('self.getOpenId()',self.getOpenId())
			console.log('item.associationModel.nickname',item.main_title)
			console.log('item.associationModel.open_id',item.associationModel.open_id)
			wx.setEnable1v1Chat({
				enable: true,
				success: res => {
					console.log(res, 'res');
					wx.join1v1Chat({
						caller: {
							nickname: item.name,
							openid: self.getOpenId()
						},
						listener: {
							nickname: item.main_title,
							openid: item.associationModel.open_id
						},
            success(res) {
              console.log('[呼叫成功]res', res)
              console.log('呼叫方：', self.getOpenId())
              console.log('接听方：', self.model.associationModel.open_id)
            },
            fail(err) {
              console.log('[呼叫失败]err', err)
            }
					});
				},
				fail: err => {
					console.log('err',err);
				}
			});
		},
		// 子组件向父组件传值
		closeMain(e) {
			this.authoShow = e;
		},
		openCourse() {
			this.exchangeShow = true;
		},
		closeExchange(e) {
			this.exchangeShow = e;
		},
		search() {
			this.resetDate();
			this.getList();
		},
		//切换状态
		currentChange(e) {
			this.current = e.index;
			this.order_state = e.value;
			this.resetDate();
			this.getList();
		},
		// 切换分类
		changeType(type) {
			this.association_type = type;
			this.current = 0;
			this.order_state = '';
			this.getStateList();
			this.resetDate();
			this.getList();
		},
		resetDate() {
			this.flag = true;
			this.page = 1;
			this.list = [];
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
	},
	onReachBottom() {
		if (this.flag) {
			this.page++;
			this.getList();
		}
	}
};
</script>

<style lang="less">
@import './index.less';
</style>
