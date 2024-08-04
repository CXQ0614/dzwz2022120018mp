import { $get, $post } from '../../utils/request';

export default {
  // 广告位
  async GetAdvertisingSpaceList(obj) {
    let res = await $get('api/GetAdvertisingSpace/List', obj)
    return res
  },
}