<template>
	<view class="userIndex">
		<view class="user-section">
			<image class="bg" src="/static/user-bg.png"></image>
			<view class="user-info-box">
				<navigator url="../userInfo/userInfo" class="portrait-box">
					<image class="portrait" :src="userInfo.avatar || '/static/missing-face.png'"></image>
				</navigator>
				<view class="info-box">
					<navigator url="../userInfo/userInfo" class="username">{{ userInfo.customer_name || '游客' }}</navigator>
					<view class="phone">{{userInfo.phone}}</view>
				</view>
				<navigator class="qrcode-link icon-link" url="../qrcode/qrcode">
					<view class="iconfont icon-ewm"></view>
				</navigator>
			</view>
			<view class="vip-card-box">
				<image class="card-bg" src="/static/vip-card-bg.png" mode=""></image>
				<view class="align">
					<view class="tit">
						<text class="yticon icon-iLinkapp-"></text>
						哇喔VIP
					</view>
					<view v-if="userInfo.rank_id == 2" class="b-btn">你已开通</view>
					<navigator v-else url="../upgrade/upgrade" class="b-btn">立刻开通</navigator>
				</view>
				<text class="e-m">哇喔VIP</text>
				<text class="e-b">解锁更多福利</text>
			</view>
		</view>

		<view class="cover-container" :style="[
				{
					transform: coverTransform,
					transition: coverTransition
				}
			]"
		 @touchstart="coverTouchstart" @touchmove="coverTouchmove" @touchend="coverTouchend">
			<image class="arc" src="/static/arc.png"></image>

			<view class="tj-sction">
				<navigator class="tj-item" url="../creditValue/creditValue">
					<text class="num">{{ userInfo.total_score }}</text>
					<text>信用值</text>
				</navigator>
				<navigator class="tj-item" url="../friends/friends">
					<text class="num">{{ userInfo.friends }}</text>
					<text>好友</text>
				</navigator>
				<navigator class="tj-item" url="../income/income">
					<text class="num">{{ userInfo.balance }}</text>
					<text>余额</text>
				</navigator>
				<navigator class="tj-item" url="../income/income">
					<text class="num">{{ userInfo.total_revenue }}</text>
					<text>收益</text>
				</navigator>
			</view>
			<!-- 订单 -->
			<view class="order-section">
				<navigator class="order-item" url="../orderList/orderList?type=0">
					<text class="yticon icon-shouye"></text>
					<text>全部订单</text>
				</navigator>
				<navigator class="order-item" url="../orderList/orderList?type=1">
					<text class="yticon icon-daifukuan"></text>
					<view class="amount" v-if="userInfo && userInfo.obligation">{{userInfo.obligation}}</view>
					<text>待付款</text>
				</navigator>
				<navigator class="order-item" url="../orderList/orderList?type=2">
					<text class="yticon icon-yishouhuo"></text>
					<view class="amount" v-if="userInfo && userInfo.receiving">{{userInfo.receiving}}</view>
					<text>待收货</text>
				</navigator>
				<navigator class="order-item" url="../orderList/orderList?type=3">
					<text class="yticon icon-shouhoutuikuan"></text>
					<view class="amount" v-if="userInfo && userInfo.commenting">{{userInfo.commenting}}</view>
					<text>待评价</text>
				</navigator>
			</view>
			<!-- 浏览历史 -->
			<view class="history-section icon">
				<list-cell :dot="dot" @eventClick="navTo('/pages/message/message')" icon="icon-pinglun-copy" iconColor="#0193fe"
				 title="通知" :badge="unReadNum"></list-cell>
				<list-cell @eventClick="navTo('/pages/bankCardList/bankCardList')" icon="icon-iconfontweixin" iconColor="#0193fe"
				 title="银行卡" tips=""></list-cell>
				<list-cell @eventClick="call" icon="icon-bangzhu" iconColor="#0193fe" title="客服" :tips="tel"></list-cell>
				<list-cell @eventClick="navTo('/pages/setting/setting')" icon="icon-shezhi1" iconColor="#0193fe" title="设置" tips=""></list-cell>

				<!-- 	<list-cell icon="icon-dizhi" iconColor="#5fcda2" title="地址管理"></list-cell>
				<list-cell icon="icon-share" iconColor="#9789f7" title="分享" tips="邀请好友赢10万大礼"></list-cell>
				<list-cell icon="icon-pinglun-copy" iconColor="#ee883b" title="晒单" tips="晒单抢红包"></list-cell>
				<list-cell icon="icon-shoucang_xuanzhongzhuangtai" iconColor="#54b4ef" title="我的收藏"></list-cell>
				<list-cell icon="icon-shezhi1" iconColor="#e07472" title="设置" border="" @eventClick="navTo('/pages/set/set')"></list-cell> -->
			</view>
		</view>
	</view>
</template>
<script>
	import listCell from '@/components/mix-list-cell';
	import {mapState} from 'vuex';
	let startY = 0,
		moveY = 0,
		pageAtTop = true;
	export default {
		components: {
			listCell
		},
		data() {
			return {
				coverTransform: 'translateY(0px)',
				coverTransition: '0s',
				moving: false,
				userInfo: '',
				tel: '', //客服电话
				dot: '',
				unReadNum:0
			};
		},
		onLoad() {
			this.tel = uni.getStorageSync('tel');
		},
		onShow() {
			this.userInfo = uni.getStorageSync('userInfo');
			this.init();
			var dot = uni.getStorageSync('dot');
			if (dot == 1) {
				this.dot = dot;
			} else
				this.dot = '';
		},
		// #ifndef MP
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.navTo('../pages/set/set');
			}
		},
		// #endif
		computed: {},
		methods: {
			init() {
				//获取用户信息
				this.$http.get({
					url: '/customer'
				}).then(r => {
					if (r.code == 0) {
						uni.setStorageSync('userInfo', r.data);
						this.userInfo = r.data;
					}
				});
				//获取未读消息
				this.$http.get({
					url:'/my/checkMsg'
				}).then(r=>{
					if(r.code==0){
						if(r.data>999){
							this.unReadNum=999
						}else{
							this.unReadNum=r.data;
						}
					}
				})
			},
			call() {
				uni.makePhoneCall({
					phoneNumber: this.tel
				});
			},
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navTo(url) {
				uni.navigateTo({
					url
				});
			},
			/**
			 *  会员卡下拉和回弹
			 *  1.关闭bounce避免ios端下拉冲突
			 *  2.由于touchmove事件的缺陷（以前做小程序就遇到，比如20跳到40，h5反而好很多），下拉的时候会有掉帧的感觉
			 *    transition设置0.1秒延迟，让css来过渡这段空窗期
			 *  3.回弹效果可修改曲线值来调整效果，推荐一个好用的bezier生成工具 http://cubic-bezier.com/
			 */
			coverTouchstart(e) {
				if (pageAtTop === false) {
					return;
				}
				this.coverTransition = 'transform .1s linear';
				startY = e.touches[0].clientY;
			},
			coverTouchmove(e) {
				moveY = e.touches[0].clientY;
				let moveDistance = moveY - startY;
				if (moveDistance < 0) {
					this.moving = false;
					return;
				}
				this.moving = true;
				if (moveDistance >= 80 && moveDistance < 100) {
					moveDistance = 80;
				}

				if (moveDistance > 0 && moveDistance <= 80) {
					this.coverTransform = `translateY(${moveDistance}px)`;
				}
			},
			coverTouchend() {
				if (this.moving === false) {
					return;
				}
				this.moving = false;
				this.coverTransition = 'transform 0.3s cubic-bezier(.21,1.93,.53,.64)';
				this.coverTransform = 'translateY(0px)';
			}
		}
	};
</script>
<style lang="scss">
	%flex-center {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	%section {
		display: flex;
		justify-content: space-around;
		align-content: center;
		background: #fff;
		border-radius: 10upx;
	}

	.userIndex {
		.user-section {
			height: 520upx;
			padding: 100upx 30upx 0;
			position: relative;
			.bg {
				position: absolute;
				left: 0;
				top: 0;
				width: 100%;
				height: 100%;
				filter: blur(1px);
				opacity: 0.9;
			}
		}

		.user-info-box {
			height: 180upx;
			display: flex;
			align-items: center;
			position: relative;
			justify-content: space-between;
			z-index: 1;

			.portrait {
				width: 130upx;
				height: 130upx;
				border: 5upx solid #fff;
				border-radius: 50%;
			}

			.info-box {
				text-align: left;
				width: 100%;
				margin-left: 20upx;
			}

			.username {
				text-align: left;
				width: 100%;
				font-size: $font-lg + 6upx;
				color: #fff;
			}

			.phone {
				font-size: 28upx;
				color: #fff;
				line-height: 1.5;
			}
		}

		.vip-card-box {
			display: flex;
			flex-direction: column;
			color: #f7d680;
			height: 240upx;
			background: linear-gradient(left, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8));
			border-radius: 16upx 16upx 0 0;
			overflow: hidden;
			position: relative;
			padding: 10upx 24upx;

			.align {
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 28upx;
				position: relative;
				z-index: 2;
			}

			.card-bg {
				position: absolute;
				top: 20upx;
				right: 0;
				width: 380upx;
				height: 260upx;
			}

			.b-btn {
				width: 132upx;
				height: 40upx;
				text-align: center;
				line-height: 40upx;
				font-size: 22upx;
				color: #36343c;
				border-radius: 20px;
				background: linear-gradient(left, #f9e6af, #ffd465);
			}

			.tit {
				font-size: $font-base + 2upx;
				color: #f7d680;

				.yticon {
					color: #f6e5a3;
					margin-right: 16upx;
				}
			}

			.e-b {
				font-size: $font-sm;
				color: #d8cba9;
				margin-top: 10upx;
			}
		}

		.cover-container {
			background: $page-color-base;
			margin-top: -150upx;
			padding: 0 30upx;
			position: relative;
			background: #f5f5f5;
			padding-bottom: 20upx;

			.arc {
				position: absolute;
				left: 0;
				top: -34upx;
				width: 100%;
				height: 36upx;
			}
		}

		.tj-sction {
			@extend %section;

			.tj-item {
				@extend %flex-center;
				flex-direction: column;
				height: 140upx;
				font-size: $font-sm;
				color: #75787d;
			}

			.num {
				font-size: $font-lg;
				color: $font-color-dark;
				margin-bottom: 8upx;
			}
		}

		.order-section {
			@extend %section;
			padding: 32upx 0;
			margin-top: 20upx;

			.order-item {
				@extend %flex-center;
				font-size: $font-sm;
				color: $font-color-dark;
				position: relative;
			}

			.amount {
				position: absolute;
				left: 100%;
				top: 0;
				margin-left: -20upx;
				min-width: 30upx;
				height: 30upx;
				font-size: 22upx;
				line-height: normal;
				background-color: #f33;
				color: #fff;
				border-radius: 30upx;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.yticon {
				font-size: 48upx;
				margin-bottom: 18upx;
				color: #0193fe;
			}

			.icon-shouhoutuikuan {
				font-size: 44upx;
			}
		}

		.history-section {
			padding: 30upx 0 0;
			margin-top: 20upx;
			background: #fff;
			border-radius: 10upx;

			.sec-header {
				display: flex;
				align-items: center;
				font-size: $font-base;
				color: $font-color-dark;
				line-height: 40upx;
				margin-left: 30upx;

				.yticon {
					font-size: 44upx;
					color: #5eba8f;
					margin-right: 16upx;
					line-height: 40upx;
				}
			}

			.h-list {
				white-space: nowrap;
				padding: 30upx 30upx 0;

				image {
					display: inline-block;
					width: 160upx;
					height: 160upx;
					margin-right: 20upx;
					border-radius: 10upx;
				}
			}
		}

		.qrcode-link {
			color: #fff;
		}
	}
</style>
