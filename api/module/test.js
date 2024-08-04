import { $get, $post } from '../../utils/request';

export default {
  // 测评列表
  async postEvaluationList(obj) {
    let res = await $post('api/EvaluationApi/List', obj)
    return res
  },
	// 测评详情
	async postEvaluationDetails(obj) {
	  let res = await $post('api/EvaluationApi/Details', obj)
	  return res
	},
	// 测评分类
	async getEvaluationTypeList(obj) {
	  let res = await $get('api/EvaluationApi/TypeList', obj)
	  return res
	},
	// 试题
	async postEvaluationQuestionsList(obj) {
	  let res = await $post('api/EvaluationApi/QuestionsList', obj)
	  return res
	},
	// 答题
	async postEvaluationAnswer(obj) {
	  let res = await $post('api/EvaluationApi/Answer', obj)
	  return res
	},
	// 报告
	async postEvaluationAnswerResult(obj) {
	  let res = await $post('api/EvaluationApi/AnswerResult', obj)
	  return res
	},
}