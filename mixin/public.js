import appUtils from "./../utils/appUtils/index.js"

export const publicMixin = {
	data() {
		return {
			// 静态图片前缀
      // staticHost: 'http://www.dzwz2022120018.idea-source.net',
      staticHost: 'https://www.lanniaoxl.com',
			host: '', //接口图片地址
		}
	},
	computed: {

	},
	methods: {
		auth_Login_filter(callback, goPath, tabBar) {
			var token = uni.getStorageSync('token') || ''
			var isExistUser = token != '';
			if (!isExistUser) {
				if (!goPath) {
					goPath = '/pages/home/index'
				}
				goPath = goPath.replace(/\?/g, '66ab6')
				goPath = goPath.replace(/\=/g, '99ab9')
				goPath = goPath.replace(/\//g, '77ab7')
				goPath = goPath.replace(/\&/g, '55ab5')
				console.log('goPath', goPath)
				console.log(goPath)
				uni.redirectTo({
					url: `/pages/authorize/index?url=${goPath}`
				});
				if (callback) {
					callback()
				}
				return false;
			}
			return true;
		},
		uploadImg(filePath, callback) {
			uni.showLoading({
				title: '上传中'
			});
			uni.uploadFile({
                 //url: 'http://www.dzwz2022120018.idea-source.net/api/MemberApi/ueUpload', // 开发者服务器的URL。
                url: 'https://www.lanniaoxl.com/api/MemberApi/ueUpload', // 开发者服务器的URL。
				filePath: filePath,
				header: {
					'Authorization': 'Bearer ' + uni.getStorageSync('token')
				},
				formData: {
					flie: filePath
				},
				name: 'file',
				success: (res) => {
					uni.hideLoading()
					console.log('上传成功', res.statusCode)
					console.log('res', res)
					if (res.statusCode == 200) {
						var data = JSON.parse(res.data)
						callback(data.url)
					}
				},
				fail: err => {
					uni.hideLoading()
					console.log(err);
				}
			});
		},
		getOpenId() {
			var openid = uni.getStorageSync('openId') // 个人id
			if (openid && openid != '') {
				return openid
			}
			return ''
		},
		getCurrentPage() {
			var pages = getCurrentPages();
			var page = pages[pages.length - 1];
			var route = page.$vm.$scope.route
			console.log(route)
		},
		//2021-12-01 18:10:00  转为 //2021-12-01
		dateChange(val) {
			if (!val) {
				return ''
			}
			var timestamp = new Date(val.replace(/-/g, '/')).getTime() //转为时间戳
			var date = new Date(timestamp)
			var Y = date.getFullYear() + '-';
			var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
			var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
			return Y + M + D
		},
		urlToObj(url) {
			let obj = {}
			let str = url.slice(url.indexOf('?') + 1)
			let arr = str.split('&')
			for (let j = arr.length, i = 0; i < j; i++) {
				let arr_temp = arr[i].split('=')
				obj[arr_temp[0]] = arr_temp[1]
			}
			return obj
		},
		//2021-12-01 18:10:00  转为 /2021年12月01日 18:10
		dateChangeChDate(val) {
			var timestamp = new Date(val.replace(/-/g, '/')).getTime() //转为时间戳
			var date = new Date(timestamp)
			var Y = date.getFullYear() + '年';
			var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
			var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '日';
			// var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
			// var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
			return Y + M + D
		},
		//获取今日 //2021-12-01
		getToday() {
			var date = new Date()
			var Y = date.getFullYear() + '-';
			var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
			var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
			return Y + M + D
		},
		//获取当前日期4周时间
		getMonthTime(date) {
			var new_Date = new Date(date); //获取指定日期当周的一周日期
			var timesStamp = new_Date.getTime();
			var currenDay = new_Date.getDay();
			var dates = [];
			for (var i = 0; i < 28; i++) {
				var das = new Date(timesStamp + 24 * 60 * 60 * 1000 * (i - (currenDay + 6) % 7))
				//.toLocaleDateString();
				//	das.replace(/[年月]/g, '.').replace(/[日上下午]/g, '');
				dates.push(das);
			}
			return dates
		},
		getYearMonth(date) {
			var Y = date.getFullYear();
			var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
			var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
			return Y + '年' + M + '月'
		},
		getDay(date) {
			var Y = date.getFullYear() + '-';
			var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
			var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
			return D
		},
		getYearMonthDay(date) {
			var Y = date.getFullYear();
			var M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
			var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
			return Y + '-' + M + '-' + D
		},
		//  转为标准时间
		getYMD(val) {
			var timestamp = new Date(val.replace(/-/g, '/')).getTime() //转为时间戳
			var date = new Date(timestamp)
			var Y = date.getFullYear();
			var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
			var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate());
			var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours());
			var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
			var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
			return Y + '-' + M + '-' + D
		},
		// 获取时分秒
		getHMS(val) {
			var timestamp = new Date(val.replace(/-/g, '/')).getTime() //转为时间戳
			var date = new Date(timestamp)
			var Y = date.getFullYear() + '年';
			var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '月';
			var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '日';
			var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
			var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
			var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
			return h + m + s
		},
		// 获取年龄
		getAge(time) {
			let nowTime = new Date();
			let birthTime = new Date(time);
			// console.log("time",nowTime,birthTime);
			// 当前年月日
			let curYear = nowTime.getFullYear();
			let curMonth = nowTime.getMonth();
			let curDay = nowTime.getDate();
			// 出生年月日
			let birYear = birthTime.getFullYear();
			let birMonth = birthTime.getMonth();
			let birDay = birthTime.getDate();
			// 年月日之差
			let year = curYear - birYear;
			let months = curMonth - birMonth;
			let day = curDay - birDay;
			// console.log("test",year,months,day);
			//（1）将出生日期的时间戳都转化为Date，分别获取当前时间和出生时间的年、月、日之差
			//（2）若月份相差为负说明不满这一年，年份减1，月份借了一年变为12+当前月份。故月份之差变为12+当前月份-出生月份。
			// 若月份相差为0并且天相差为负，说明也不满一年，计算同理。
			//（3）若天相差为负，说明不满这个月，月份减1，天数借了一个月，故天数之差为上个月的天数+当前天-出生天
			if (months < 0 || months == 0 && day < 0) {
				year -= 1;
				months = 12 + curMonth - birMonth;
			}
			if (day < 0) {
				months -= 1;
				let date = this.getDaysInMonth(curYear, curMonth);
				// console.log("date",date);
				day = date + curDay - birDay;
			}
			var age = {
				year: year,
				months: months,
				day: day
			}
			return age;
		},
		// 获取某年某月有多少天
		getDaysInMonth(year, month) {
			month = parseInt(month, 10);
			var temp = new Date(year, month, '0');
			return temp.getDate();
		},
		// 乘法
		multiply(a, b) {
			// 先转换为字符串
			var s1 = a.toString()
			var s2 = b.toString()
			var m1 = 0
			var m2 = 0
			try {
				// 字符串拆分，获取小数点右边的长度
				m1 += s1.split('.')[1].length
			} catch (error) {}
			try {
				m2 += s2.split('.')[1].length
			} catch (error) {}
			// 转为整数
			var t1 = Number(s1) * Math.pow(10, m1)
			var t2 = Number(s2) * Math.pow(10, m2)
			// 再转为小数
			var result = t1 * t2 / Math.pow(10, m1 + m2)
			result = result.toFixed(m1 + m2)
			return result
		},
		// 判断是否授权 跳转页面
		getAuthoPage(page) {
			var token = uni.getStorageSync('token') || '';
			var isExistUser = token != '';
			if (!isExistUser) {
				// this.authoShow = true; // 显示弹窗
				this.$refs.authorize.getCode(); // 调用子组件的onshow方法 获取openid和sessionKey
				return false;
			} else {
				uni.navigateTo({
					url: page
				})
			}
		},
		// 价格加逗号
		formatPrice(str) {	
			if(!str){
				return '0.00'
			}else{
				var newStr = "";
					var count = 0;
					var indexOf = str.indexOf(".")
					// 当数字是整数
					if (indexOf == -1) {
						for (var i = str.length - 1; i >= 0; i--) {
							if (count % 3 == 0 && count != 0) {
								newStr = str.charAt(i) + "," + newStr;
							} else {
								newStr = str.charAt(i) + newStr;
							}
							count++;
						}
						str = newStr; //自动补小数点后两位
						return str;
					}
					// 当数字带有小数
					else {
						var starttext = str.slice(0, indexOf)
						var endtext = str.slice(indexOf, str.length)
						for (var i = indexOf - 1; i >= 0; i--) {
							if (count % 3 == 0 && count != 0) {
								newStr = str.charAt(i) + "," + newStr;
							} else {
								newStr = str.charAt(i) + newStr; //逐个字符相接起来
							}
							count++;
						}
						str = newStr+ endtext;
						return str;
					}
				
			}
	  }
	}
}
