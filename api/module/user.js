import {
	$get,
	$post
} from '../../utils/request';

export default {
	// 用户信息
	async getUserInfo(obj) {
		let res = await $get('api/MemberApi/UserInfo', obj)
		return res
	},
	// 修改用户信息
	async postMemberUpUserInfo(obj) {
		let res = await $post('api/MemberApi/UpUserInfo', obj)
		return res
	},
	// 消费记录
	async postMemberConsumptionList(obj) {
		let res = await $post('api/MemberApi/ConsumptionList', obj)
		return res
	},
	// 意见留言
	async postOpinionAdd(obj) {
		let res = await $post('api/OpinionApi/Add', obj)
		return res
	},
	// 帮助中心
	async postCopywritingList(obj) {
		let res = await $post('api/CopywritingApi/List', obj)
		return res
	},
	// 传code
	async postLogoApiWxSession(obj) {
		let res = await $post('api/LogoApi/WxSession', obj, false)
		return res
	},
	// 手机号授权
	async postLogoApiWxUserInfo(obj) {
		let res = await $post('api/LogoApi/WxUserInfo', obj)
		return res
	},
	// 上传图片
	async postUpload(obj) {
		let res = await $post('api/MemberApi/ueUpload', obj)
		return res
	},
}
