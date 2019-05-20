/*
    fly配置文件
    by:David 2018.6.14
*/
//引入 fly
var Fly = require("flyio/dist/npm/wx");
var fly = new Fly;
import store from '../store/index.js'
import qs from 'qs'

import config from './config'
import autoUpdater from './autoUpdater.min.js';

let host = config.host;
let appKey = config.appkey;
let appid = config.appid;


//配置请求基地址
// //定义公共headers
// fly.config.headers={xx:5,bb:6,dd:7}
// //设置超时
fly.config.timeout = 100000;
// //设置请求基地址
fly.config.baseURL = config.host

//添加请求拦截器
fly.interceptors.request.use((request) => {
	let TOKEN = '';
	// console.log(request)
	TOKEN = uni.getStorageSync('Jwt');
	/* uni.showToast({
		title: '正在加载…',
		icon: 'loading',
		duration: fly.config.timeout
	}); */
	//给所有接口加上token
	// request.params['appid'] = 'TOKEN';
	//给所有请求添加自定义header
	/* if(request.url.indexOf('/login')==-1 || request.url.indexOf('/content/get')==-1){
		
	} */
	request.headers["Jwt"] = TOKEN;
	request.headers["Content-Type"] = "application/x-www-form-urlencoded";
	//request.headers["X-Tag"] = "flyio";
	//打印出请求体
	//终止请求
	//var err=new Error("xxx")
	//err.request=request
	//return Promise.reject(new Error(""))

	//可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
	
	//ps:检查程序升级的逻辑需要自己实现接口，uni.request 调用自己的检测接口，返回需要升级的相关字段(升级类容，安装包下载地址等)
	// #ifdef APP-PLUS
/* 	autoUpdater.init({
		packageUrl: 'https://qd.myapp.com/myapp/qqteam/Androidlite/qqlite_3.7.1.704_android_r110206_GuanWang_537057973_release_10000484.apk',
		content: '',
		contentAlign: 'left',
		cancel: '取消该版本',
		cancelColor: '#007fff',
		showCancelBtn:false,
	}); */
	// #endif
	// autoUpdater.show();
	// console.log(request)
	return request;
})

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
	(response) => {
		// console.log(response)
		uni.hideToast();
		//如果返回401则清除token
		if (response.status == 401||response.data.code == 401) {
			uni.removeStorageSync('token');
			uni.reLaunch({
				url: '../login/login'
			})
			return;
		}else if(response.data.code != 0){
			uni.showToast({
				title: response.data.message,
				icon: 'none',
			});
		}
		if(response.data.code == 450){
			//未设置支付密码
			setTimeout(()=>{
				uni.navigateTo({
					url:'../setPayPassword/setPayPassword'
				})
			},1000)
		}
		//只将请求结果的data字段返回
		return response.data
	},
	(err) => {
		uni.hideToast();
		uni.showToast({
			title: err.message,
			icon: 'none',
		});
		//发生网络错误后会走到这里
		//return Promise.resolve("ssss")
	}
)
// Vue.prototype.$http=fly //将fly实例挂在vue原型上

// 通用的get请求
let get = (params) => {
	let url = '';
	var paramsUrl = params.url
	if (paramsUrl.search('http') != -1) {
		url = paramsUrl;
	} else {
		url = host + paramsUrl;
	}
	return fly.get(url, qs.stringify(params.data))
};

// 通用的post请求
let post = (params) => {
	let url = '';
	var paramsUrl = params.url
	if (paramsUrl.search('http') != -1) {
		url = paramsUrl;
	} else {
		url = host + paramsUrl;
	}
	return fly.post(url, qs.stringify(params.data))
};
// 封装的登录请求，根据后台接收方式选择是否加qs.stringify
let login = params => {
	return fly.post(host + '/login', params)
};
export default {
	get,
	post,
	login
}
