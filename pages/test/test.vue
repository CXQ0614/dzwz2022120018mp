<template>
	<!-- 测评流程-->
	<view class="uni-content">
		<image :src="`${staticHost}/images/shared/banner.png`" class="banner"></image>
		<view class="detail">
			<u-navbar :title="title" :bgColor="color" :fixed="true" :safeAreaInsetTop="true" :placeholder="true"></u-navbar>
			<view class="detail-box">
				<view class="progrss-box">
					<view class="progrss-text">当前进度</view>
					<template v-if="mode">
						<view class="progrss">
							<view class="progrss-line"
								:style="{ width: ((current + 1) / (QuestionList.length + num)) * 100 + '%' }"></view>
						</view>
						<view class="progrss-num">
							<span class="current">{{ current + 1 }}</span>
							/{{ QuestionList.length + num }}
						</view>
					</template>
					<template v-else>
						<view class="progrss">
							<view class="progrss-line"
								:style="{ width: ((current + 1) / QuestionList.length) * 100 + '%' }"></view>
						</view>
						<view class="progrss-num">
							<span class="current">{{ current + 1 }}</span>
							/{{ QuestionList.length }}
						</view>
					</template>
				</view>
				<view class="question-box" v-if="QuestionList.length > 0 &&  current < QuestionList.length">
					<view class="public-title">单选题</view>
					<view class="question-title">{{ QuestionList[current].name }}</view>
					<view class="answer-box">
						<view class="answer-item" :class="{ checked: answer[current].val === item.answerId }"
							v-for="(item, index) in QuestionList[current].answerList" :key="index"
							@click="check(item, QuestionList[current])">
							{{ String.fromCharCode(index + 65) }}.{{ item.answerName }}
						</view>
					</view>
				</view>
				<view class="question-box" v-if="mode && current >=  QuestionList.length">
					<view class="public-title">多选题</view>
					<view class="question-title">{{ LastQuestion[extaCurrent].name }}</view>
					<view class="answer-box">
						<view class="answer-item" :class="{ checked: item.checked }"
							v-for="(item, index) in LastQuestion[extaCurrent].answerList" :key="index"
							@click="chooseMore(item, LastQuestion[extaCurrent])">
							{{ String.fromCharCode(index + 65) }}.{{ item.answerName }}
						</view>
					</view>
				</view>

				<view class="btns">
					<view class="btn" v-if="current != 0" @click="prev">上一题</view>
					<template v-if="mode">
						<view class="btn blue" :class="{ whole: current == 0 }" @click="next"
							v-if="current != QuestionList.length">下一题</view>
						<view class="btn blue" @click="submit" v-if="current == QuestionList.length">提交</view>
					</template>
					<template v-else>
						<view class="btn blue" :class="{ whole: current == 0 }" @click="next"
							v-if="current != QuestionList.length - 1">下一题</view>
						<view class="btn blue" @click="submit" v-if="current == QuestionList.length - 1">提交</view>
					</template>
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
			mode: false, // true 会自动加上后端返回的额外题目
			num: 0, // 额外题目个数
			Id: '',
			current: 0, // 题号
			extaCurrent: 0, //额外题号
			QuestionList: [],
			LastQuestion: [], // 额外题目
			LastAnswer: [], //额外答案列表
			answer: [], //答案列表
			authoShow: false, // 授权弹窗显示
			color: 'transparent', // 导航栏的背景颜色
			title: '测评流程'
		};
	},
	onLoad(option) {
		if (option.id) {
			this.Id = option.id;
		}
		if (option.title) {
			this.title = option.title
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
					this.mode = res.associationModel.code == 'CAREER_ANCHOR' ? true : false
					this.num = res.associationModel.additional // 额外题目个数
					var obj = {
						id: '', //问题id
						name: '', //问题名称
						answerList: [], //答案id
					};
					for (var i = 0; i < this.num; i++) {
						this.LastAnswer.push(obj)
					}
					this.QuestionList = res.personalityList;
					this.QuestionList.forEach((item, index) => {
						var answerList = [];
						for (let i in item.answerList) {
							answerList.push(item.answerList[i]);
						}
						item.answerList = answerList;
					});
					console.log(this.QuestionList)
				}
			});
		},
		prev() {
			this.current--;
			this.extaCurrent = this.current - this.QuestionList.length < 0 ? 0 : this.current - this.QuestionList.length
			console.log(this.current);
		},
		next() {
			if (!this.answer[this.current] && this.current < this.QuestionList.length) {
		    	uni.showToast({
					icon: 'none',
					title: '请选择答案',
					duration: 2000
				});
				return false;
			}
			if (this.current >= this.QuestionList.length && this.mode && this.LastAnswer[this.extaCurrent].answerList.length < 3) {
				    uni.showToast({
					    icon: 'none',
					    title: '至少选择三个选项',
						duration: 2000
					});
					return false;
			}
			this.current++;
			this.extaCurrent = this.current - this.QuestionList.length < 0 ? 0 : this.current - this.QuestionList.length
			// 走接口添加最后一道题 
			if (this.mode && this.current == this.QuestionList.length) {
				console.log('最后一题')
				this.getLast()
			}
			console.log(this.current);
		},
		// 试题最后一题接口
		getLast() {
			var self = this
			var list = this.answer
			list.forEach((item, index) => {
				item.scoreInt = parseInt(item.valName)
			})
			let params = {
				id: this.Id,
				list: list
			};
			this.$api.test.postEvaluationAnswerTop(params).then(res => {
				if (res.errcode == 0) {
					self.LastQuestion = res.list
					self.LastQuestion.forEach((item, index) => {
						item.answerList.forEach((Qitem, QIndex) => {
							Qitem.checked = false
						})
					})
				}
			});
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
		//选择多选选项 
		chooseMore(item, question) {
			//item 当前问题答案  question 当前问题
			// 取消选择
			this.LastAnswer[this.extaCurrent].id = question.id //问题id
			this.LastAnswer[this.extaCurrent].name = question.name //问题名称
			
			var list = this.LastAnswer[this.extaCurrent].answerList
			if (list.length > 0) {
				var flag = -1
				list.forEach((LastItem, LastIndex) => {
					if (LastItem.answerId == item.answerId) {
						flag = LastIndex
					}
				})
				if (flag != -1) {
					item.checked = false
					this.LastAnswer[this.extaCurrent].answerList.splice(flag, 1);
				} else {
					item.checked = true
					this.LastAnswer[this.extaCurrent].answerList.push(item)
				}
			} else {
				item.checked = true
				this.LastAnswer[this.extaCurrent].answerList.push(item)
			}
			console.log('额外答案列表', this.LastAnswer);
	    },
		submit() {
			var self = this;
			if (!this.answer[this.current] && this.current < this.QuestionList.length) {
				uni.showToast({
					icon: 'none',
					title: '请选择答案',
					duration: 2000
				});
				return false;
			}
			if (this.current >= this.QuestionList.length && this.mode && this.LastAnswer[this.current - this.QuestionList.length].answerList.length < 3) {
				uni.showToast({
					icon: 'none',
					title: '至少选择三个选项',
					duration: 2000
				});
				return false;
			}
			let params = {
				id: this.Id,
				list: this.answer,
				topIdList: this.LastAnswer
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
