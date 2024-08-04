import {
	$get,
	$post
} from '../../utils/request';

export default {
	// 热门城市
	async getPopularList(obj) {
		let res = await $get('api/GetAddress/PopularList', obj)
		return res
	},
	// 城市列表
	async getAddressList(obj) {
		let res = await $get('api/GetAddress/List', obj)
		return res
	},
}
