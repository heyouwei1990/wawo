<template>
	<view class="updateApp">
		<view class="content">
			<image class="logo" src="../../static/up-circle.png" />
			<view class="mainInfo">
				<text class="title">{{ info }}</text>
				<text class="tip">\n{{ Mtip }}</text>
			</view>
			<text class="line" />
		</view>
		<view>
			<view class="infoContentTitle">
				<image class="infoPic" src="../../static/info-circle.png" />
				<text class="infoTitle">更新摘要</text>
			</view>
			<view class="infoContent">
				<text class="updateInfo">{{ updateInfo }}</text>
			</view>
		</view>
		<view v-if="!currentIsLatest">
			<view class="infoContentTitle">
				<image class="infoPic" src="../../static/sync.png" />
				<text class="infoTitle">更新大小</text>
			</view>
			<view class="infoContent">
				<text class="updateInfo">{{ packageSize }}</text>
			</view>
		</view>
		<view class="minorContent bottom_aera">
			<view v-if="startProgress && !currentIsLatest" class="smallTitle">
				<text>下载进度:{{ downloadProgress }}%</text>
				<progress :percent="downloadProgress" stroke-width="4" />
			</view>
			<button v-if="!startProgress && !currentIsLatest" type="primary" @click="handleUpdate()">立即更新</button>
			<button v-if="currentIsLatest" :loading="buttonLoading" type="primary" @click="getLatest()">检查更新</button>
		</view>
	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {
				info: '正在加载', // 主标题显示版本号
				Minfo: '未知', // 副标题显示版本类型
				Mtip: '', // 小提示标语
				updateInfo: '无', // 更新摘要

				latest: null, // 版本信息
				packageSize: null, // 更新包大小
				packagePath: null, // 更新包的文件地址
				downloadTask: null, // 下载任务
				downloadProgress: 0, // 下载进度

				buttonLoading: false, // 加载 - 标记
				installed: false, // 是否执行了安装 - 标记
				startProgress: false, // 下载进行 - 标记
				currentIsLatest: true // 当前版本就是最新版本 - 标记
			}
		},
		onReady() {
			this.getLatest()
			const updated = uni.getStorageSync('updated')
			if (updated.packagePath) {
				this.packagePath = updated.packagePath
			}
		},
		// 如果用户下载后没有完成安装，却回到app，则执行这里
		onShow() {
			if (this.installed === true && this.packagePath) {
				this.installed = false
				this.haveDownloaded()
			}
		},
		// 用户关闭页面时检查是否存在下载任务
		onUnload() {
			if (this.downloadTask) {
				this.closeTask()
				this.showToast('更新被取消')
			}
		},
		// 下拉刷新更新
		onPullDownRefresh() {
			this.getLatest()
			uni.stopPullDownRefresh()
		},
		methods: {
			// 封装个Toast方便用
			showToast(text) {
				uni.showToast({
					title: text,
					duration: 3000,
					icon: 'none'
				})
			},
			installPackage() {
				// 安装更新
				plus.runtime.install(this.packagePath, {
					force: true
				})
				this.installed = true
				// 保存更新记录到stroage，方便下次启动app时删除安装包
				uni.setStorage({
					key: 'updated',
					data: {
						completed: true,
						packagePath: this.packagePath
					},
					success: (res) => {
						console.log('成功保存更新记录')
					}
				})
				// 判断是否为热更新（判断文件名中是否含有.wgt）
				if (this.packagePath.match(RegExp(/.wgt/))) {
					this.installed = false
					uni.showModal({
						title: '提示',
						content: '应用将重启以完成更新',
						showCancel: false,
						complete: () => {
							plus.runtime.restart();
						}
					})
				}
			},
			// 已经下载了更新包但是没有安装
			haveDownloaded() {
				uni.showModal({
					title: '更新尚未完成',
					content: '您已下载更新包，但是还没有完成安装，请问是否要继续安装更新包呢？',
					success: (res) => {
						if (res.confirm) {
							// 安装
							this.installPackage()
						} else if (res.cancel) {
							this.showToast('更新被取消')
						}
					}
				})
			},
			// 取得最新版本及其所有信息
			getLatest() {
				this.info = '正在加载' // 主标题显示版本号
				this.Minfo = '未知' // 副标题显示版本类型
				this.updateInfo = '无' // 更新摘要

				this.buttonLoading = true
				this.latest = null
				this.$http.post({
					url:'/version/update'
				}).then(r=>{
					if(r.code==0 && r.data.update==1){
						this.latest = r.data;
						this.buttonLoading = false
						this.checkLatest();
					}
				})
			},
			// 检查版本
			checkLatest() {
				if (!this.latest.number) {
					this.Mtip = '未找到发行版本'
				} else if (this.$currentVersion.versionId < this.latest.id) { // 当前版本与新版本不符（$current在main.js里）
					this.currentIsLatest = false
					this.Mtip = '发现新版本'
					this.info = this.latest.name + ' ' + this.latest.number //名称 版本号
					this.updateInfo = this.latest.info
					// 判断系统类型
					if (plus.os.name.toLowerCase() === 'android'){
						this.packageSize = (this.latest.androidSize / 1048576).toFixed(2) + 'MB' // 请求取得的packageSize是字节大小，转换为保留两位小数的MB
					}else{
						this.packageSize = (this.latest.iosSize / 1048576).toFixed(2) + 'MB' // 请求取得的packageSize是字节大小，转换为保留两位小数的MB
					}
					
					this.setMinfo(this.latest.type)
				} else {
					this.showToast('当前是最新版了')
					this.currentIsLatest = true
					this.Mtip = '当前是最新版'
					this.info = this.latest.name + ' ' + this.latest.number //名称 版本号
					this.updateInfo = this.latest.info
					this.setMinfo(this.latest.type)
				}
			},
			// 根据英文版本类型选择中文版本类型
			setMinfo(type) {
				switch (type) {
					case 'base':
						this.Minfo = '结构版'
						break
					case 'alpha':
						this.Minfo = '内测版'
						break
					case 'beta':
						this.Minfo = '公测版'
						break
					case 'rc':
						this.Minfo = '终测版'
						break
					case 'release':
						this.Minfo = '正式版'
						break
					default:
						this.Minfo = '未知'
				}
			},
			// 关闭下载任务
			closeTask() {
				this.downloadTask.abort()
				this.downloadTask = null
				this.startProgress = false
			},
			// 开始下载任务
			createTask(downloadLink) {
				//判断是否已经存在任务
				if (this.packagePath) {
					this.haveDownloaded()
				} else {
					this.downloadProgress = 0
					this.startProgress = true
					// 创建下载任务对象
					let that=this;
					this.downloadTask = uni.downloadFile({
						url: downloadLink,
						success: (res) => {
							if (res.statusCode === 200) {
								// 保存下载的安装包
								uni.saveFile({
									tempFilePath: res.tempFilePath,
									success: (r) => {
										that.packagePath = r.savedFilePath
										// 进行安装
										that.installPackage()
										// 任务完成，关闭下载任务
										that.closeTask()
									}
								})
							}
						}
					})
					// 进度条更新
					this.downloadTask.onProgressUpdate((res) => {
						this.downloadProgress = res.progress
					})
				}
			},
			handleUpdate() {
				// 判断系统类型
				if (plus.os.name.toLowerCase() === 'android') {
					if (this.latest.androidLink && this.latest.androidLink !== '#') { // 我这里默认#也是没有地址，请根据业务自行修改
						// 安卓：创建下载任务
						this.createTask(this.latest.androidLink)
					} else {
						this.showToast('未找到下载地址')
					}
				} else {
					if (this.latest.iosLink && this.latest.iosLink !== '#') { // 我这里默认#也是没有地址，请根据业务自行修改
						// 苹果(A)：进行热更新（如果iosLink是wgt更新包的下载地址）判断文件名中是否含有.wgt
						if (this.latest.iosLink.match(RegExp(/.wgt/))) {
							this.createTask(this.latest.iosLink)
						} else {
							// 苹果(B)：打开商店链接（如果iosLink是苹果商店的地址）
							plus.runtime.openURL(this.latest.iosLink)
						}
					} else {
						this.showToast('未找到ios商店地址')
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.updateApp {
		width: 100%;
		display: flex;
		flex-direction: column;

		.content {
			text-align: center;
		}

		.minorContent {
			width: 650upx;
			padding: 0 50upx;
		}

		.process {
			margin-top: 200upx;
			margin-left: 30%;
		}

		.logo {
			height: 200upx;
			width: 200upx;
			margin-top: 100upx;
		}

		.title {
			font-size: 36upx;
			color: #373737;
			font-weight: bold;
		}

		.infoTitle {
			font-size: 32upx;
			color: #373737;
			padding-left: 15upx;
			font-weight: bold;
		}

		.tip {
			font-size: 28upx;
			color: #7E7E83;
			vertical-align: text-top;
		}

		.bottom_aera {
			position: absolute;
			bottom: 0;
			height: 12%;
			width: 100%;
		}

		.line {
			padding: 0 600upx;
			border-bottom: 2upx solid #D8D8D8;
		}

		.infoPic {
			height: 50upx;
			width: 50upx;
		}

		.infoContentTitle {
			display: flex;
			align-items: center;
			padding: 40upx 40upx;
		}

		.infoContent {
			display: flex;
			align-items: center;
		}

		.updateInfo {
			font-size: 28upx;
			color: #7E7E83;
			padding: 0 80upx;
		}

		.smallTitle {
			font-size: 26upx;
			font-weight: 500;
			padding: 20upx 0;
			line-height: 1.5;
			color: #888;
		}
	}
</style>
