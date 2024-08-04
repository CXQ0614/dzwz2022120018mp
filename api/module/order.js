import {
	$get,
	$post
} from '../../utils/request';

export default {
	// 下单 信息所用参数
	async postOrderMoreConditions(obj) {
		let res = await $post('api/OrderApi/MoreConditions', obj)
		return res
	},
	// 下单
	async postOrderGenerateOrder(obj) {
		let res = await $post('api/OrderApi/GenerateOrder', obj)
		return res
	},
	// 微信支付
	async postWeChatPayPayment(obj) {
		let res = await $post('api/WeChatPay/Payment', obj)
		return res
	},
	// 退款
	async postWeChatPayRefund(obj) {
		let res = await $post('api/WeChatPay/Refund', obj)
		return res
	},
	// 订单状态
	async getStateList(obj) {
		let res = await $post('api/OrderApi/stateList', obj)
		return res
	},
	// 订单列表
	async postOrderList(obj,loading) {
		let res = await $post('api/OrderApi/List',obj,loading)
		return res
	},
	// 取消订单
	async postOrderCancellation(obj) {
    let res = await $post('api/OrderApi/Cancellation', obj)	
    return res
  },
	// 订单详情
	async postOrderDetails(obj,loading) {
	  let res = await $post('api/OrderApi/Details',obj,loading)	
	  return res
	},
	// 订单详情 - 咨询师提交评价
	async postOrderEvaluate(obj) {
	  let res = await $post('api/OrderApi/Evaluate', obj)	
	  return res
	},
	// 下单兑换券列表
	async postVoucherApiList(obj) {
		let res = await $post('api/VoucherApi/List', obj)
		return res
	},
}
