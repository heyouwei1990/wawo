<script>
	import { checkUpdater } from './common/checkUpdater.js'
	export default {
		onLaunch: function() {
			//#ifdef APP-PLUS  
			//锁定屏幕方向
			plus.screen.lockOrientation('portrait-primary');
			this.openPush();
			this.onPush();
			/* 5+  push 消息推送 ps:使用:H5+的方式监听，实现推送*/
			plus.push.addEventListener("click", function(msg) {
				console.log(msg)
				// plus.ui.alert("click:" + JSON.stringify(msg));
				// plus.ui.alert(msg.payload);
				// plus.ui.alert(JSON.stringify(msg));  
			
			}, false);
			// 监听在线消息事件    
			plus.push.addEventListener("receive", function(msg) {
				// plus.ui.alert(2);  
				console.log(JSON.stringify(msg))
				// plus.ui.alert("recevice:" + JSON.stringify(msg))
			}, false);
			
			
			// app打开时先检查是否有更新记录（更新记录会被保存在storage中）
			// 更新记录的内容为 { 更新标记, 安装包位置 }
			
			// 如果存在更新记录，且更新标记（complete=true）则删除上次使用过的安装包，达到存储释放空间的目的
			
			// 如果存在更新记录，且更新标记（complete=false）则进行安装更新 - 2019年3月27日 新增强制更新内容
			const updated = uni.getStorageSync('updated') // 尝试读取storage
			
			if (updated.completed === true) { // 如果上次刚更新过
				// 删除安装包及安装记录
				console.log('安装记录被删除，更新成功')
				uni.removeSavedFile({ 
					filePath: updated.packagePath,
					success: (res) => {
						uni.removeStorageSync('updated')
					}
				})
			} else if (updated.completed === false) {
				uni.removeStorageSync('updated')
				plus.runtime.install(updated.packagePath, { force: true })
				uni.setStorage({
					key: 'updated',
					data: {
						completed: true,
						packagePath: updated.packagePath
					},
					success: (res) => {
						console.log('成功安装上次的更新，应用需要重启才能继续完成')
					}
				})     				
				uni.showModal({
					title: '提示',
					content: '应用将重启以完成更新',
					showCancel: false,
					complete: () => {
						plus.runtime.restart();
					}
				})
			} else {
				// 检查更新，参数：{ 当前版本号，跳转到更新页面的url }
				//checkUpdater(this.$current.number, '../updateApp/updateApp') 
			}
			//#endif 
			//每次重新打开App都需要询问是否有新版本
			uni.removeStorageSync('updateCancel');
			
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			
			openPush() {
				uni.subscribePush({
					provider: 'igexin',
					success() {
						var pinf = plus.push.getClientInfo();  
                         var cid = pinf.clientid;
// 						 if(cid!=null&&cid!='null'&cid!=''){
// 							 uni.setStorageSync('cid', cid);
// 						 }
// 						uni.showToast({
// 							title: "已开启push接收"
// 						})
					}
				})
			},
			onPush() {
				uni.onPush({
					provider: 'igexin',
					success() {
						uni.showToast({
							title: '监听透传成功',
						})
					},
					callback(e) {
// 						uni.showModal({
// 							title: '',
// 							content: JSON.stringify(e.data),
// 							showCancel: false,
// 							success: res => {},
// 						});
						console.log(JSON.stringify(e.data))
					}
				})
			},
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import url("./style/common.css");
	@import url("./style/uni.css");
	@import url("./style/iconfont.css");
	
	
	@font-face {
		font-family: yticon;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_1078604_5s29lo1n4i6.ttf') format('truetype');
		/* src: url('static/yticon.ttf') */
	}
	
	
	.yticon {
		font-family: "yticon" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	
	
	
	.icon-shezhi1:before {
	  content: "\e61d";
	}
	.icon-paizhao:before {
		content: "\e620";
	}
	
	.icon-lishijilu:before {
		content: "\e6b9";
	}
	
	.icon-iconfontweixin:before {
		content: "\e611";
	}
	
	.icon-shang:before {
		content: "\e624";
	}
	
	.icon-shouye:before {
		content: "\e626";
	}
	
	.icon-shanchu4:before {
		content: "\e622";
	}
	
	.icon-xiaoxi:before {
		content: "\e618";
	}
	
	.icon-jiantour-copy:before {
		content: "\e600";
	}
	
	.icon-fenxiang2:before {
		content: "\e61e";
	}
	
	.icon-pingjia:before {
		content: "\e67b";
	}
	
	.icon-daifukuan:before {
		content: "\e68f";
	}
	
	.icon-pinglun-copy:before {
		content: "\e612";
	}
	
	.icon-shoucang:before {
		content: "\e645";
	}
	
	.icon-xuanzhong2:before {
		content: "\e62f";
	}
	
	.icon-icon-test:before {
		content: "\e60c";
	}
	
	.icon-zuoshang:before {
		content: "\e613";
	}
	
	.icon-jia2:before {
		content: "\e60a";
	}
	
	.icon-sousuo:before {
		content: "\e7ce";
	}
	
	.icon-arrow-fine-up:before {
		content: "\e601";
	}
	
	.icon-xiatubiao--copy:before {
		content: "\e608";
	}
	
	.icon-shoucang_xuanzhongzhuangtai:before {
		content: "\e6a9";
	}
	
	.icon-jia1:before {
		content: "\e61c";
	}
	
	.icon-arrow-left-bottom:before {
		content: "\e602";
	}
	
	.icon-arrow-right-bottom:before {
		content: "\e603";
	}
	
	.icon-arrow-left-top:before {
		content: "\e604";
	}
	
	.icon-icon--:before {
		content: "\e744";
	}
	
	.icon-zuojiantou-up:before {
		content: "\e605";
	}
	
	.icon-xia:before {
		content: "\e62d";
	}
	
	.icon--jianhao:before {
		content: "\e60b";
	}
	
	.icon-Group-:before {
		content: "\e688";
	}
	
	.icon-you:before {
		content: "\e606";
	}
	
	.icon-forward:before {
		content: "\e607";
	}
	
	.icon-bangzhu:before {
		content: "\e679";
	}
	
	.icon-share:before {
		content: "\e656";
	}
	
	.icon-fork:before {
		content: "\e61b";
	}
	
	.icon-iLinkapp-:before {
		content: "\e654";
	}
	
	.icon-saomiao:before {
		content: "\e60d";
	}
	
	.icon-shezhi:before {
		content: "\e60f";
	}
	
	.icon-shouhoutuikuan:before {
		content: "\e631";
	}
	
	.icon-gouwuche:before {
		content: "\e609";
	}
	
	.icon-dizhi:before {
		content: "\e614";
	}
	
	.icon-zuo:before {
		content: "\e63c";
	}
	
	.icon-shoucang2:before {
		content: "\e62e";
	}
	
	.icon-yishouhuo:before {
		content: "\e71a";
	}
</style>
