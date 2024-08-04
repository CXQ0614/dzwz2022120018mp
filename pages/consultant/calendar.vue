<template>
	<!-- 首页-->
	<view class="uni-content">
		<u-navbar title="排班日历" :bgColor="color" :fixed="true" :safeAreaInsetTop="true" :placeholder="true"></u-navbar>
		<image :src="`${staticHost}/images/shared/banner.png`" class="banner"></image>
		<view class="help">
			<!-- 日历组件 -->
			<view class="help-box">
				<view class="calendar">
					<!-- 月份 -->
					<view class="month">
						<view class="arrow-buttons" @click="lastMonth">
							<image class="arrow-button" :src="`${staticHost}/images/consultant/arrow-left.png`" mode="widthFix"></image>
						</view>
						<view>{{year+'年'+month + '月'}}</view>
						<view class="arrow-buttons" @click="nextMonth">
							<image class="arrow-button" :src="`${staticHost}/images/consultant/arrow-right.png`" mode="widthFix"></image>
						</view>
					</view>
					<view class="date-box">
						<!-- 周 -->
						<view class="week">
							<!-- type1(有活动)和typebg1(今日)有用 -->
							<view :class="'i '+[index==0|| index==week.length-1?'i1':'']" v-for="(item,index) in weeks" :key="index">
								{{item}}
							</view>
						</view>
						<!-- 天 -->
						<view>
							<view class="day">
								<view @click="selectDay(item.day)" class="i" :class="{active: item.checked}" v-for="(item,index) in dayList" :key="index">
									<text :class="{color: item.checked}">{{item.day}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 编辑日历 -->
			<view class="edit-box">
				<view class="edit-top">
					<view class="edit-top-left">
						<view class="edit-top-line"></view>
						<view class="edit-top-title">编辑日历</view>
					</view>
					<view class="edit-right">
						<view class="add-top-right" @click="itemsAdd" v-if="list && list.length > 0 && !editShow">新增</view>
						<view class="edit-top-right" @click="editClick" v-if="list && list.length > 0 && !editShow">
							<view class="edit-top-text">编辑</view>
							<image :src="`${staticHost}/images/consultant/small-edit.png`" class="edit-top-icon"></image>
						</view>
					</view>
				</view>
				<view class="edit-boxs" v-if="(list && list.length <= 0) || editShow">
					<view class="edit-detail">
						<view class="edit-item" v-for="(item,index) in dateList" :key="index">
							<view class="edit-item-left">
								<view class="edit-item-time">
									<view class="edit-time-times">{{ item.startDate }}</view>
									<view class="edit-time-text">开始时间</view>
								</view>
								<image :src="`${staticHost}/images/consultant/blue-arrow.png`" class="edit-item-arrow"></image>
								<view class="edit-item-time">
									<view class="edit-time-times">{{ item.endDate }}</view>
									<view class="edit-time-text">结束时间</view>
								</view>
							</view>
							<!-- <view class="edit-item-line"></view>
							<view class="edit-item-right">
								<view class="edit-right-item" @click="itemEdit(item)">
									<image :src="`${staticHost}/images/consultant/big-edit.png`" class="edit-right-icon"></image>
									<view class="edit-right-text">编辑</view>
								</view>
								<view class="edit-right-item delete" @click="itemDelete(item)">
									<image :src="`${staticHost}/images/consultant/delete.png`" class="edit-right-icon"></image>
									<view class="edit-right-text">删除</view>
								</view>
							</view> -->
						</view>
					</view>
					<view class="edit-add" @click="itemAdd">
						<image :src="`${staticHost}/images/consultant/add.png`" class="edit-add-icon"></image>
					</view>
					<view class="edit-button" v-if="dateList && dateList.length > 0">
						<view class="edit-reset" @click="resetClick">重置</view>
						<view class="edit-submit" @click="submitClick">提交</view>
					</view>
				</view>
				<view class="edit-boxs" v-if="list && list.length > 0 && !editShow">
					<view class="edit-items">
						<view class="edit-items-title">上午</view>
						<view class="edit-items-group">
							<block v-for="(item,index) in list" :key="index">
								<view class="edit-group-item"v-if="textchangeNum(item.startDate, 2) >= 8 && textchangeNum(item.startDate, 2) < 12">
									<image :src="`${staticHost}/images/consultant/close.png`" v-if="deleteIcon" @click="itemDelete(item)" class="edit-delete"></image>
									{{ item.startDate }} - {{ item.endDate }}
								</view>
							</block>
						</view>
					</view>
					<view class="edit-items">
						<view class="edit-items-title">下午</view>
						<view class="edit-items-group">
							<block v-for="(item,index) in list" :key="index">
								<view class="edit-group-item"v-if="textchangeNum(item.startDate, 2) >= 12 && textchangeNum(item.startDate, 2) < 18">
									<image :src="`${staticHost}/images/consultant/close.png`" v-if="deleteIcon" @click="itemDelete(item)" class="edit-delete"></image>
									{{ item.startDate }} - {{ item.endDate }}
								</view>
							</block>
						</view>
					</view>
					<view class="edit-items">
						<view class="edit-items-title">晚上</view>
						<view class="edit-items-group">
							<block v-for="(item,index) in list" :key="index">
								<view class="edit-group-item"v-if="textchangeNum(item.startDate, 2) >= 18 && textchangeNum(item.startDate, 2) < 22">
									<image :src="`${staticHost}/images/consultant/close.png`" v-if="deleteIcon" @click="itemDelete(item)" class="edit-delete"></image>
									{{ item.startDate }} - {{ item.endDate }}
								</view>
							</block>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 选择时间弹窗 -->
		<u-popup :show="alertShow" :round="10" closeable mode="bottom" @close="closeAlert">
		  <view class="alert">
		    <view class="alert-top">
					<view class="alert-top-title">开始时间</view>
					<view class="alert-top-title">结束时间</view>
				</view>
				<view class="alert-middle">
					<view class="alert-middle-item" @click="startShow = true">
						{{ startText }}
					</view>
					<view class="alert-middle-item" @click="endShow = true">
						{{ endText }}
					</view>
				</view>
				<view class="alert-button">
					<view class="alert-button-cancel" @click="alertShow = false">取消</view>
					<view class="alert-button-true" @click="alertSubmit">确定</view>
				</view>
		  </view>
		</u-popup>
		
		<!-- 开始时间弹窗 -->
		<u-datetime-picker ref="datetimePicker1" :minHour="8" :maxHour="22" :filter="filter" :show="startShow" @cancel="closeStart" @confirm="startConfirm" v-model="startDate" mode="time"></u-datetime-picker>
		<!-- 结束时间弹窗 -->
		<u-datetime-picker ref="datetimePicker2" :minHour="8" :maxHour="22" :filter="filter" :show="endShow" @cancel="closeEnd" @confirm="endConfirm" v-model="endDate" mode="time"></u-datetime-picker>
	</view>
</template>

<script>
import { publicMixin } from '../../mixin/public.js'
export default {
	mixins: [publicMixin],
	data() {
		return {
			list: [], // 排期列表
			
			color: 'transparent', // 导航栏的背景颜色
			alertShow: false, // 弹窗是否显示
			
			startShow: false, // 开始时间弹窗
			startDate: '', // 开始时间
			endShow: false, // 结束时间弹窗
			endDate: '', // 结束时间
			startText: '请选择开始时间',
			endText: '请选择结束时间',
			
			year: '',
			month: '',
			day: '',
			week: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
			weeks: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
			dayList: [],
			now: { // 当前年月日
				year: '',
				month: '',
				day: ''
			},
			selected: '',
			model: {
				Month: "", //月份（字符串形式 格式固定 xxxx-xx） 必填字段
				date: '', // 日期
				startTime: '', // 日期 带时间的
				endTime: '', // 日期 带时间的
			},
			editShow: false, // 点击编辑
			alertState: 0, // 0是生成时间 1是新增排期
			editId: '', // 编辑的id
			dateList: [],// 生成时间列表 显示的
			datesList: [],// 生成时间列表 传接口的
			deleteIcon: false, // 是否显示删除icon
		}
	},
	computed: {
		shrinkDayList() {
			if (!this.dayList.length) return [];
			const list = [];
			const preLength = this.dayList.findIndex(item => item === this.day) % 7;
			const subLength = 7 - preLength - 1;
			for (let i = preLength; i > 0; i--) {
				const day = this.day - i;
				if (day > 0) {
					list.push(this.day - i);
				} else {
					list.push('');
				}
			}
			list.push(this.day);
			//获取当前月天数
			let date = new Date(this.year, this.month, 0);
			let monthDay = date.getDate();
			for (let i = 1; i <= subLength; i++) {
				const day = this.day + i;
				if (day <= monthDay) {
					list.push(this.day + i);
				} else {
					list.push('');
				}
			}
			return list;
		}
	},
	watch: {
		month: function() {
			this.setDayList();
		}
	},
	created() {
		this.init();
	},
	onLoad() {
		var month
		// 刚进页面 获取今日所属的年份和月份
		if(this.month < 10){
			month = '0' + this.month
		}else {
			month = this.month
		}
		this.model.Month = this.year + '-' + month
		this.model.date = this.year + '-' + month + '-' + this.day
		this.model.startTime = this.model.Month + '-' + this.day + ' 08:00'
		this.model.endTime = this.model.Month + '-' + this.day + ' 22:00'
		
		// 排期列表
		this.postConsultanSchedulingApiList()
	},
	methods: {
		// 排期列表
		postConsultanSchedulingApiList(bool) {
			let params = {
				"startDate": this.model.startTime,
				"endDate": this.model.endTime,
				"Token": uni.getStorageSync('consultantToken')
			}
			this.$api.consultant.postConsultanSchedulingApiList(params).then(res => {
				if (res.errcode == 0) {
					this.list = res.list
					
					if(bool){ // 新增 修改 删除的
						
					}else {
						if(this.list.length <= 0){
							this.editShow = true
						}else {
							this.editShow = false
						}
					}
				}
			})
		},
		// 重置
		resetClick(){
			var self = this
			uni.showModal({
				title: '提示',
				content: '确认重置吗？',
				success: function (res) {
					if (res.confirm) {
						// 清空临时选择的的时间
						self.dateList = []
						self.datesList = []
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		// 提交
		submitClick(){
			// 生成时间
			this.postConsultanSchedulingApiAddAll()
		},
		// 添加 新增排期的
		itemsAdd(item){
			this.alertState = 1
			this.alertShow = true
			this.startText = '请选择开始时间'
			this.endText = '请选择结束时间'
			this.startDate = ''
			this.endDate = ''
		},
		// 添加 生成时间的
		itemAdd(){
			this.alertState = 0
			this.alertShow = true
			this.startText = '请选择开始时间'
			this.endText = '请选择结束时间'
			this.startDate = ''
			this.endDate = ''
		},
		// 点击右上角的总编辑
		editClick(){
			if(this.deleteIcon){
				this.deleteIcon = false
			}else {
				this.deleteIcon = true
			}
		},
		// 点击关闭弹窗
		closeAlert(){
			this.alertShow = false
		},
		// 点击开始时间弹窗的取消
		closeStart(){
			this.startShow = false
		},
		// 点击结束时间弹窗的取消
		closeEnd(){
			this.endShow = false
		},
		// 点击开始时间弹窗的确认
		startConfirm(e){
			console.log(e)
			if(e.value == this.endText){
				uni.showToast({
					icon: 'none',
					title: '开始时间和结束时间不能一致',
					duration: 1500
				})
				return false
			}
			this.startText = e.value
			this.startShow = false
			
			var startTime = this.startText
			var endTime = this.endText
			var startHour = this.textchangeNum(this.startText, 2)
			var startMinute = this.textchangeNum(this.startText, 2, true)
			var endHour = this.textchangeNum(this.endText, 2)
			var endMinute = this.textchangeNum(this.endText, 2, true)
			if(startHour > endHour){
				this.startText = endTime
				this.endText = startTime
			}else if(startHour == endHour){
				if(startMinute > endMinute){
					this.startText = endTime
					this.endText = startTime
				}
			}
		},
		// 点击结束时间弹窗的确认
		endConfirm(e){
			console.log(e)
			if(this.startText == e.value){
				uni.showToast({
					icon: 'none',
					title: '开始时间和结束时间不能一致',
					duration: 1500
				})
				return false
			}
			this.endText = e.value
			this.endShow = false
			
			var startTime = this.startText
			var endTime = this.endText
			var startHour = this.textchangeNum(this.startText, 2)
			var startMinute = this.textchangeNum(this.startText, 2, true)
			var endHour = this.textchangeNum(this.endText, 2)
			var endMinute = this.textchangeNum(this.endText, 2, true)
			if(startHour > endHour){
				this.startText = endTime
				this.endText = startTime
			}else if(startHour == endHour){
				if(startMinute > endMinute){
					this.startText = endTime
					this.endText = startTime
				}
			}
		},
		// 点击选择时间的确定
		alertSubmit(){
			if(this.startDate == ''){
				uni.showToast({
					icon: 'none',
					title: '请选择开始时间',
					duration: 1500
				})
				return false
			}
			if(this.endDate == ''){
				uni.showToast({
					icon: 'none',
					title: '请选择结束时间',
					duration: 1500
				})
				return false
			}
			
			var startDate = this.startDate
			var endDate = this.endDate
			var startHour = this.textchangeNum(this.startDate, 2)
			var startMinute = this.textchangeNum(this.startDate, 2, true)
			var endHour = this.textchangeNum(this.endDate, 2)
			var endMinute = this.textchangeNum(this.endDate, 2, true)
			if(startHour > endHour){
				this.startDate = endDate
				this.endDate = startDate
			}else if(startHour == endHour){
				if(startMinute > endMinute){
					this.startDate = endDate
					this.endDate = startDate
				}
			}
			console.log(this.startDate)
			console.log(this.endDate)
			let startTime = this.model.date + ' ' + this.startDate
			let endTime = this.model.date + ' ' + this.endDate
			
			if(this.alertState == 0){ // 生成时间
				// 生成时间
				this.pushList(startTime,endTime, this.startDate, this.endDate)
			}else if(this.alertState == 1){ // 新增排期
				// 新增排期
				this.postConsultanSchedulingApiAdd(startTime,endTime)
			}
		},
		// 生成时间 push到数组
		pushList(startTime,endTime,startDate,endDate){
			var length = this.dateList.length // 当前个数
			var successLength = 0 // 没问题的个数
			this.dateList.forEach((item,index) => {
				if(startDate >= item.startDate && startDate < item.endDate){
					return false
				}else if(endDate > item.startDate && endDate <= item.endDate) {
					 return false
				}
				successLength++
			})
			if(successLength == length){
				console.log('成功的')
			}else {
				uni.showToast({
					icon: 'none',
					title: '选择的时间有冲突',
					duration: 1500
				})
				return false
			}
			
			this.datesList.push({ // 传接口的
				startDate: startTime,
				endDate: endTime
			})
			this.dateList.push({ // 显示的
				startDate: startDate,
				endDate: endDate
			})
			this.alertShow = false
		},
		// 生成时间接口
		postConsultanSchedulingApiAddAll(){
			let params = {
				"dateList": this.datesList,
				"Token": uni.getStorageSync('consultantToken')
			}
			this.$api.consultant.postConsultanSchedulingApiAddAll(params).then(res => {
				if (res.errcode == 0) {
					// 列表
					this.postConsultanSchedulingApiList()
				}
			})
		},
		// 新增排期接口
		postConsultanSchedulingApiAdd(startTime,endTime) {
			let params = {
				"startDate": startTime,
				"endDate": endTime,
				"Token": uni.getStorageSync('consultantToken')
			}
			this.$api.consultant.postConsultanSchedulingApiAdd(params).then(res => {
				if (res.errcode == 0) {
					this.alertShow = false
					// 列表接口
					this.postConsultanSchedulingApiList()
				}
			})
		},
		// 修改排期接口
		postConsultanSchedulingApiModify(startTime,endTime) {
			let params = {
				"startDate": startTime,
				"endDate": endTime,
				"id": this.editId,
				"Token": uni.getStorageSync('consultantToken')
			}
			this.$api.consultant.postConsultanSchedulingApiModify(params).then(res => {
				if (res.errcode == 0) {
					this.alertShow = false
					// 列表接口
					this.postConsultanSchedulingApiList(true)
				}
			})
		},
		// 删除排期接口
		postConsultanSchedulingApiDelete(array) {
			let params = {
				"idList": array,
				"Token": uni.getStorageSync('consultantToken')
			}
			this.$api.consultant.postConsultanSchedulingApiDelete(params).then(res => {
				if (res.errcode == 0) {
					
					// 列表接口
					this.postConsultanSchedulingApiList(true)
				}
			})
		},
		// 点击删除
		itemDelete(item) {
			var self = this
			uni.showModal({
				title: '提示',
				content: '确认删除吗？',
				success: function (res) {
					if (res.confirm) {
						var array = []
						array.push(item.scheduling_id)
						// 删除接口
						self.postConsultanSchedulingApiDelete(array)
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		filter(type, options){
			if(type == 'minute'){
				var test = options.filter((option) => {
					return option % 10 === 0
				})
				var test2 = [].concat(test)
				return test2
			}
			return options
		},
		getDateArray() {
			if (!this.date) return [];
			if (this.date.match(/\//g).length == 3) {
				return this.date.split(' ')[0].split('/');
			}
			if (this.date.match(/-/g).length == 3) {
				return this.date.split(' ')[0].split('-');
			}
			return [];
		},
		/**
		 * 初始化
		 */
		init() {
			let date = new Date();
			const dateArray = this.getDateArray().map(item => parseInt(item));
			if (dateArray.length > 0) {
				this.year = dateArray[0];
				this.month = dateArray[1];
				this.day = dateArray[2];
			} else {
				this.year = date.getFullYear();
				this.month = date.getMonth() + 1;
				this.day = date.getDate();
			}
			this.setNow(date);
			this.selected = `${this.year}-${this.month}-${this.day}`;
			
		},
		/**
		 * 设置当前年月日
		 */
		setNow(date) {
			this.now.year = date.getFullYear();
			this.now.month = date.getMonth() + 1;
			this.now.day = date.getDate();
		},
		/**
		 * 下一个月
		 */
		nextMonth() {
			if (this.month + 1 > 12) {
				this.year = this.year + 1;
				this.month = 1;
			} else {
				this.month = this.month + 1;
			}
			
			var month
			if(this.month < 10){
				month = '0' + this.month
			}else {
				month = this.month
			}
			var date = this.year + '-' + month
			this.model.Month = date
			
		},
		/**
		 * 上一个月
		 */
		lastMonth() {
			if(this.month == this.now.month){ // 禁止翻到上一个月份
				return false
			}
			if (this.month - 1 < 1) {
				this.year = this.year - 1;
				this.month = 12;
			} else {
				this.month = this.month - 1;
			}
			
			var month
			if(this.month < 10){
				month = '0' + this.month
			}else {
				month = this.month
			}
			var date = this.year + '-' + month
			this.model.Month = date
			
		},
		/**
		 * 设置日历天
		 */
		setDayList() {
			let date = new Date(this.year, this.month - 1, 1);
			let date1 = new Date(this.year, this.month, 0);
			//获取当前月第一天是周几，0等于周日
			let oneDay = date.getDay();
			//获取当前月天数
			let monthDay = date1.getDate();
			let dayList = [];
			for (var i = 0; i < oneDay; i++) {
				dayList.push({
					day: "",
					type: 0
				})
			}
			for (var i = 0; i < monthDay; i++) {
				dayList.push({
					day: i+1,
					type: 0,
					checked: false
				})
			}
			this.dayList = dayList;
			
			// 匹配当前年月 给当前日 加上一个圆点标识
			if(this.year == this.now.year){
				if(this.month == this.now.month){
					this.dayList.forEach((item,index) => {
						if(item.day == this.now.day){
							var obj = this.dayList[index]
							this.$set(this.dayList, index, {
								...obj,
								checked: true
							})
						}
					})
				}
			}
			
		},
		// 点击日子
		selectDay(day) {
			// 在年份和月份相同的情况下 如果点击的日子小于当前日子 则不选中
			if(this.now.year == this.year){
				if(this.now.month == this.month){
					if(day < this.now.day){
						return false
					}
				}
			}
			
			this.dayList.forEach((item,index) => {
				if(item.day == day){
					// 清空临时选择的的时间
					this.dateList = []
					this.datesList = []
						
					// 清空所有的选中状态
					for(let i = 0; i<this.dayList.length;i++){
						this.dayList[i].checked = false
					}
					// 选中状态 
					item.checked = true
					// 活动列表的筛选
					let days = ''
					if(day < 10){
						day = '0' + day
					}
					days = this.model.Month + '-' + day
					this.model.date = days
					this.model.startTime = days + ' 08:00'
					this.model.endTime = days + ' 22:00'
					this.editShow = false
					// 列表接口
					this.postConsultanSchedulingApiList()
				}
			})
		},
		//字符串转换数字
		textchangeNum(texts, length, reverse) {
			var text;
			//截取后几位
			if (reverse) {
				text = texts.slice(-length);
			} else {
				text = texts.slice(0, length);
			}
			text = parseInt(text);
			return text;
		},
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
@import './calendar.less';
</style>
