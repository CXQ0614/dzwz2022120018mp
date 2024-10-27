var baseUrl=''
if(process.env.NODE_ENV === 'development'){
	//开发环境 改地址记得看一下public.js中的上传图片地址
	//baseUrl='http://www.dzwz2022120018.idea-source.net/'
    baseUrl='https://www.lanniaoxl.com/'
}else{
	//生产环境
   //baseUrl='http://www.dzwz2022120018.idea-source.net/'
    baseUrl = 'https://www.lanniaoxl.com/'

}

const http = ({ url = '', param = {}, ...other } = {},loading=true) => {
  if(loading){
		uni.showLoading({
		  title: '加载中'
		});
  }
  return new Promise((resolve, reject) => {
		// 判断当前时间和缓存的token时间进行对比
		let timestamp = Date.parse(new Date());
		console.log('日期', uni.getStorageSync('tokenDate'))
		
		// 79200000 22h 21600000 6h
		if(uni.getStorageSync('tokenDate') && timestamp - 21600000 > uni.getStorageSync('tokenDate')){
			// 过期
			wx.login({
				success: ret => {
			 	let code = ret.code
					wx.request({
						url: baseUrl + 'api/LogoApi/WxSession',
						method: 'POST',
						data: { code },
						success: res => {
							console.log(res)
							if(res.data.errcode == 0){
								if(res.data.token){
									uni.setStorageSync('token', res.data.token)
									// 存一个当前时间
									let timestamps = Date.parse(new Date());
									uni.setStorageSync('tokenDate', timestamps)
									
									uni.request({
										url: getUrl(url),
										data: param,
										header: { 
											'content-type': 'application/json',
											'Authorization': 'Bearer ' + uni.getStorageSync('token')
										},
										method: 'GET',
										...other,
										complete: (res) => {
											if(loading){
												uni.hideLoading()
											}
											if (res.statusCode >= 200 && res.statusCode < 300) {
												if (res.data.errcode != 0) {
													uni.showModal({
														title: '提示',
														content: res.data.errmsg,
														showCancel: false,
													})
												}
												resolve(res.data)
											} else {
												uni.showModal({
													title: '网络异常',
													content: '请稍后再试',
													showCancel: false,
												})
												reject(res)
											}
										}
									})
								}
							}else {
								console.log(res)
							}
						}
					})
				}
			})
		}else { // 没过期
			uni.request({
				url: getUrl(url),
				data: param,
				header: { 
					'content-type': 'application/json',
					'Authorization': 'Bearer ' + uni.getStorageSync('token')
				},
				method: 'GET',
				...other,
				complete: (res) => {
					if(loading){
						uni.hideLoading()
					}
					if (res.statusCode >= 200 && res.statusCode < 300) {
						if (res.data.errcode != 0) {
							uni.showModal({
								title: '提示',
								content: res.data.errmsg,
								showCancel: false,
							})
						}
						resolve(res.data)
					} else {
						uni.showModal({
							title: '网络异常',
							content: '请稍后再试',
							showCancel: false,
						})
						reject(res)
					}
				}
			})
		}
  })
}

const getUrl = (url) => {
  if (url.indexOf('://') === -1) {
    url = baseUrl + url
  }
  return url
}

//get方法
const _get = (url, param = {},loading=true) => {
  return http({
    url,
    param
  },loading)
}

//post方法
const _post = (url, param = {},loading=true) => {
  return http({
    url,
    param,
    method: 'POST'
  },loading)
}

module.exports={
  baseUrl:baseUrl,
  $get:_get,
  $post:_post
}