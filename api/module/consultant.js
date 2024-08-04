import { $get, $post } from '../../utils/request';

export default {
  // 咨询师列表
  async postConsultanList(obj) {
    let res = await $post('api/ConsultanApi/List', obj)
    return res
  },
	// 咨询师详情
	async postConsultanDetails(obj) {
	  let res = await $post('api/ConsultanApi/Details', obj)
	  return res
	},
	// 咨询师筛选更多条件
	async getConsultanMoreConditions(obj) {
	  let res = await $get('api/ConsultanApi/MoreConditions', obj)
	  return res
	},
	// 咨询师分类 (困扰)
	async getConsultanTypeList(obj) {
	  let res = await $get('api/ConsultanApi/TypeList', obj)
	  return res
	},
	// 推荐课程
	async getConsultanAssociationList(obj) {
	  let res = await $post('api/ConsultanApi/AssociationList', obj)
	  return res
	},
	// 排期时间段
	async postConsultanSchedulingList(obj) {
	  let res = await $post('api/ConsultanApi/SchedulingList', obj)
	  return res
	},
	// 更改预约排期
	async postOrderUpScheduling(obj) {
	  let res = await $post('api/OrderApi/UpScheduling', obj)
	  return res
	},
	//、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	// 咨询师端订单列表
	async postConsultanOrderApiList(obj) {
	  let res = await $post('api/ConsultanOrderApi/List', obj)
	  return res
	},
	// 咨询师端提交备注
	async postConsultanOrderApiNotes(obj) {
	  let res = await $post('api/ConsultanOrderApi/Notes', obj, false)
	  return res
	},
	// 咨询师端排期详情
	async postConsultanOrderApiDetails(obj) {
	  let res = await $post('api/ConsultanOrderApi/Details', obj)
	  return res
	},
	// 咨询师端修改排期
	async postConsultanSchedulingApiModify(obj) {
	  let res = await $post('api/ConsultanSchedulingApi/Modify', obj)
	  return res
	},
	// 咨询师端登录
	async postConsultanLogoApiLogin(obj) {
	  let res = await $post('api/ConsultanLogoApi/Login', obj, false)
	  return res
	},
	// 咨询师端绑定unionId
	async postConsultanLogoApiUserUnionId(obj) {
	  let res = await $post('api/ConsultanLogoApi/UserUnionId', obj)
	  return res
	},
	// 咨询师端咨询师详情
	async postConsultanLogoApiUserInfo(obj) {
	  let res = await $post('api/ConsultanLogoApi/UserInfo', obj)
	  return res
	},
	// 咨询师端服务状态
	async getConsultanOrderApiMoreConditions(obj) {
	  let res = await $get('api/ConsultanOrderApi/MoreConditions', obj)
	  return res
	},
	// 咨询师端新增排期（用了的）
	async postConsultanSchedulingApiAdd(obj) {
	  let res = await $post('api/ConsultanSchedulingApi/Add', obj, false)
	  return res
	},
	// 咨询师端排期列表（用了的）
	async postConsultanSchedulingApiList(obj) {
	  let res = await $post('api/ConsultanSchedulingApi/List', obj)
	  return res
	},
	// 咨询师端删除排期（用了的）
	async postConsultanSchedulingApiDelete(obj) {
	  let res = await $post('api/ConsultanSchedulingApi/Delete', obj, false)
	  return res
	},
	// 咨询师端生成时间（用了的）
	async postConsultanSchedulingApiAddAll(obj) {
	  let res = await $post('api/ConsultanSchedulingApi/AddAll', obj)
	  return res
	},
}