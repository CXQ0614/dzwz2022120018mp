import {
	$get,
	$post
} from '../../utils/request';

export default {
	// 收藏
	async postCollectAdd(obj) {
		let res = await $post('api/CollectApi/Add', obj)
		return res
	},
	// 收藏列表
	async postCollectList(obj) {
		let res = await $post('api/CollectApi/List', obj)
		return res
	},
	// 批量取消收藏
	async postCollectCancellation(obj) {
		let res = await $post('api/CollectApi/Cancellation', obj)
		return res
	},
}
