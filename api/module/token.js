import {
	$get,
	$post
} from '../../utils/request';

export default {
	// 兑换券
	async postVoucherAdd(obj) {
		let res = await $post('api/VoucherApi/Add', obj)
		return res
	},
	// 我的券列表
	async postVoucherList(obj) {
		let res = await $post('api/VoucherApi/List', obj)
		return res
	},
}
