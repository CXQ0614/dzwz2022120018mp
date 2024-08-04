import { $get, $post } from '../../utils/request';

export default {
  // 用户信息
  async getMemberApiUserInfo(obj) {
    let res = await $get('api/MemberApi/UserInfo', obj)
    return res
  },
}