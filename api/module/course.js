import { $get, $post } from '../../utils/request';

export default {
  // 课程列表
  async postCourseList(obj) {
    let res = await $post('api/CourseApi/List', obj)
    return res
  },
	// 课程详情
	async postCourseDetails(obj) {
	  let res = await $post('api/CourseApi/Details', obj)
	  return res
	},
	// 课程分类
	async getCourseTypeList(obj) {
	  let res = await $get('api/CourseApi/TypeList', obj)
	  return res
	}
}