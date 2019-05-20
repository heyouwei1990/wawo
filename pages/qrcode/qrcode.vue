<template>
	<view class="qrcode-page">
		<view class="wrapper">
			<view class="user-dl" v-if="userInfo">
				<image class="avatar" :src="userInfo.avatar"></image>
				<view class="dd" ref="dd">
					<view class="user-name">{{userInfo.customer_name}}</view>
					<view class="desc">{{userInfo.rank_des}}</view>
				</view>
			</view>
			<view class="qrcode-img">
				<tki-qrcode
					ref="qrcode"
					:val="qrval"
					:size="qrsize"
					background="#fff"
					foreground="#000"
					:icon="centerIcon"
					:iconSize="24"
					:onval="true"
					@result="qrcodeUrl" />
			</view>
			<view class="label">
				我的二维码
			</view>
		</view>
		<!-- <canvas class="canvas-qrcode" id="_myQrCodeCanvas" canvas-id="_myQrCodeCanvas"></canvas> -->
		<!-- <posters :postersData="postersData" @success="printPoster"></posters> -->
		<!-- <image :src="posterSrc" mode=""></image> -->
		<!-- <view class="btn-box">
			<button class="btn-default">保存</button>
			<button class="btn-primary">分享</button>
		</view> -->
		<!-- #ifdef APP-PLUS -->
		<!-- <img :src="posterSrc" class="share-image" mode="" />
		<canvasdrawer :painting="postersData" class="canvasdrawer" @getImage="printPoster"/> -->
		<!-- #endif -->
		
	</view>
</template>

<script>
	import { pathToBase64, base64ToPath } from '../../common/image-tools.js'
	import tkiQrcode from '../../components/tki-qrcode/tki-qrcode.vue'
	// import QRCode from '../../components/tki-qrcode/qrcode.js';
	import Posters from '../../components/posters.vue';
	// import config from '../../common/config.js';
	export default {
		components: {
			Posters,
			tkiQrcode
		},
		computed: {
			qrsize() {
				return uni.upx2px(280);
			}
		},
		data() {
			return {
				qrval: '',//二维码链接
				qrcodeImg: '',//二维码
				userInfo: '',
				postersData: {
					views: []
				},
				posterSrc:'',//海报链接
				centerIcon:'../../static/icon.png', //二维码中心图标
			};
		},
		onLoad() {
			this.userInfo = uni.getStorageSync('userInfo');
			this.init();
			// this.createPosters();
		},
		//分享
		onNavigationBarButtonTap(option) {
			uni.share({
				provider: 'weixin',
				type: 2,
				scene: 'WXSceneSession',
				imageUrl: this.qrcodeImg,
				success(res) {
					console.log(JSON.stringify(res));
				},
				fail(err) {
					console.log(JSON.stringify(err));
				}
			})
		},
		methods: {
			init() {
				this.$http.get({
					url: "/my/shareLink"
				}).then(r => {
					if (r.code == 0) {
						this.qrval=r.data;
						// this.creatQrcode();
					}
				})
			},
			//
			qrcodeUrl(data){
				console.log(data);
				this.qrcodeImg = data;
				/* base64ToPath(data).then(path=>{
					this.qrcodeImg = path;
				}) */
			},
			//生成二维码
			creatQrcode() {
				let that=this;
				if (this.qrval == '') {
					uni.showToast({
						title: '二维码内容不能为空',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				var qrcode = new QRCode({
					context: that,
					text: that.qrval, // 生成内容
					size: that.qrsize, // 二维码大小
					background: '#fff', // 背景色
					foreground:'#000', // 前景色
					cbResult: function (res) { // 生成二维码的回调
						that.qrcodeImg = res;
						// that.createPosters();
					},
				});
			},
			//输出海报信息
			printPoster(e){
				var img=e.path;
				// var img=e.detail.tempFilePath;
				this.posterSrc=img;
				console.log(img);
				//转换成图片
				/* base64ToPath(img).then(path=>{
					console.log(path);
					this.posterSrc = path.substring(path.indexOf('http'));
				}) */
			},
			//渲染海报
			createPosters() {
				var that=this;
				//poster
				let config={
					clear: true,
					width: 320,
					height: 500,
					background:'#48a7f9',
					radius:10,
					views:[{
						type: 'image',
						width: 40,
						height: 40,
						left: 40,
						top:20,
						radius:20,
						url: that.userInfo.avatar
					},
					{
						type: 'text',
						width: 100,
						height: 30,
						left: 100,
						top:30,
						fontSize:16,
						color:'#fff',
						bolder:true,
						lineHeight:30,
						content: that.userInfo.customer_name
					},{
						type: 'image',
						width: 120,
						height: 120,
						left: 100,
						top: 260,
						radius:1,
						url: that.qrcodeImg
					}]
				}
				//canvasdrawer
				/* const config = {
					width: 320,
					height: 500,
					clear: true,
					background: 'blue',
					views: [{
						type: 'rect',
						width: 320,
						height: 500,
						left: 0,
						top:0,
						borderRadius:10,
						backgroundColor:'#fff'
					},{
						type: 'image',
						width: 40,
						height: 40,
						left: 40,
						top:20,
						borderRadius:40,
						url: that.userInfo.avatar
					},{
						type: 'text',
						width: 100,
						height: 30,
						left: 100,
						top:25,
						fontSize:16,
						color:'#48a7f9',
						bolder:true,
						lineHeight:30,
						content: that.userInfo.customer_name
					},{
						type: 'image',
						width: 120,
						height: 120,
						left: 100,
						top: 260,
						url: that.qrcodeImg
					}]
				}; */
				this.postersData = config;
			},
		}
	};
</script>

<style lang="scss">
	.qrcode-page {
		overflow: hidden;
		.canvas-qrcode{
			position: absolute;
			left: -5000px;
			top: 0;
		}
		.share-image{
			display: block;
			width: 320px;
			height: 500px;
			margin: 60upx auto 0;
		}
		.wrapper {
			margin: 60upx 30upx;
			background-color: #fff;
			box-shadow: 0px 2px 4px 0px rgba(180, 179, 179, 0.5);
			padding: 40upx;

			.qrcode-img {
				display: block;
				width: 280upx;
				height: 280upx;
				padding: 30upx;
				margin: 80upx auto 20upx;
				border: 2px solid #66d27e;
				box-sizing: content-box;
			}

			.label {
				text-align: center;
				font-size: 14px;
				color: #333;
				line-height: 24px;

				&:before,
				&:after {
					content: '';
					display: inline-block;
					vertical-align: middle;
					width: 1.2em;
					height: 1px;
					background-color: #333;
					margin: -5upx 20upx 0;
				}
			}
		}

		.user-dl {
			display: flex;
			align-items: center;

			.avatar {
				width: 100upx;
				height: 100upx;
				border-radius: 50%;
				margin-right: 20upx;
			}

			.dd {
				flex: 1;
			}

			.user-name {
				font-size: 18px;
				color: #333;
				line-height: 32px;
			}

			.desc {
				font-size: 12px;
				color: #999;
				line-height: 24px;
			}
		}

		.btn-box {
			margin: 30upx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.btn-default {
				width: 330upx;
				border: 1upx solid #ddd;
			}

			.btn-primary {
				width: 330upx;
			}
		}
	}
</style>
