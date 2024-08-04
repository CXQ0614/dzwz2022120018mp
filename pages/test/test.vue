<template>
	<!-- 测评流程-->
	<view class="uni-content">
		<image :src="`${staticHost}/images/shared/banner.png`" class="banner"></image>
		<view class="detail">
			<u-navbar :title="title" :bgColor="color" :fixed="true" :safeAreaInsetTop="true" :placeholder="true"></u-navbar>
			<view class="detail-box">
				<view class="progrss-box">
					<view class="progrss-text">当前进度</view>
					<view class="progrss"><view class="progrss-line" :style="{ width: ((current + 1) / QuestionList.length) * 100 + '%' }"></view></view>
					<view class="progrss-num">
						<span class="current">{{ current + 1 }}</span>
						/{{ QuestionList.length }}
					</view>
				</view>
				<view class="question-box" v-if="QuestionList.length > 0">
					<view class="public-title">单选题</view>
					<view class="question-title">{{ QuestionList[current].name }}</view>
					<view class="answer-box">
						<view
							class="answer-item"
							:class="{ checked: answer[current].val === item.answerId }"
							v-for="(item, index) in QuestionList[current].answerList"
							:key="index"
							@click="check(item, QuestionList[current])"
						>
							{{ String.fromCharCode(index + 65) }}.{{ item.answerName }}
						</view>
					</view>
				</view>
				<view class="btns">
					<view class="btn" v-if="current != 0" @click="prev">上一题</view>
					<view class="btn blue" :class="{ whole: current == 0 }" @click="next" v-if="current != QuestionList.length - 1">下一题</view>
					<view class="btn blue" @click="submit" v-if="current == QuestionList.length - 1">提交</view>
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
			Id: '',
			current: 0, // 题号
			QuestionList: [],
			answer: [], //答案列表
			authoShow: false, // 授权弹窗显示
			color: 'transparent', // 导航栏的背景颜色
      title:'测评流程'
		};
	},
	onLoad(option) {
		if (option.id) {
			this.Id = option.id;
		}
    if(option.title){
      this.title=option.title
    }
		this.getList();
	},
	methods: {
		// 试题详情接口
		getList() {
			let params = {
				id: this.Id
			};
			this.$api.test.postEvaluationQuestionsList(params).then(res => {
				if (res.errcode == 0) {
					this.QuestionList = res.personalityList;
					this.QuestionList.forEach((item, index) => {
						var answerList = [];
						for (let i in item.answerList) {
							answerList.push(item.answerList[i]);
						}
						item.answerList = answerList;
					});
				}
			});
		},
		prev() {
			this.current--;
			console.log(this.current);
		},
		next() {
			if (!this.answer[this.current]) {
				uni.showToast({
					icon: 'none',
					title: '请选择答案',
					duration: 2000
				});
				return false;
			}
			this.current++;
			console.log(this.current);
		},
		//选择选项
		check(item, question) {
			//item 当前问题答案  question 当前问题
			var obj = {
				key: question.id, //问题id
				keyName: question.name, //问题名称
				val: item.answerId, //答案id
				valName: item.answerName //答案名称
			};
			this.$set(this.answer, this.current, obj);
			console.log('答案列表', this.answer);
		},
		submit() {
			var self = this;
			if (!this.answer[this.current]) {
				uni.showToast({
					icon: 'none',
					title: '请选择答案',
					duration: 2000
				});
				return false;
			}
			let params = {
				id: this.Id,
				list: this.answer
			};
			this.$api.test.postEvaluationAnswer(params).then(res => {
				console.log(res);
				if (res.errcode == 0) {
					uni.redirectTo({
						url: '/pages/test/result?id=' + this.Id
					});
				}
			});
			console.log('答案列表', this.answer);
		},
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
@import './test.less';
</style>
