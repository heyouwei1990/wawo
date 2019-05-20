<template>
	<view class="articleDetail">
		<view class="article" v-if="articleInfo">
			<view class="title">{{articleInfo.title}}</view>
			<!-- <wxParse :content="article" :imageProp="imageProp" /> -->
			<!-- <rich-text :nodes="article"></rich-text> -->
			<div v-html="article"></div>
		</view>
		<view v-if="isPaid==2" class="tip-msg">该文章为哇喔精选优质文章，如需阅读完整文章，请订阅文章所属专栏</view>
		<view class="fixed-bottom" v-if="isPaid==2">
			<button class="btn-primary" @tap="showPopup=true">订阅</button>
		</view>
		<payment-popup :show="showPopup" @pay="submit" @hidePopup="showPopup=false"></payment-popup>
		<pay-password :show="showPayPassword" @completed="payByScore" @hidePopup="showPayPassword=false"></pay-password>
	</view>
</template>

<script>
	import config from '../../common/config.js'
	// import marked from '../../components/marked'
	// import wxParse from '../../components/mpvue-wxparse/src/wxParse.vue'
	import paymentPopup from '../../components/payment-popup.vue'
	import PayPassword from '../../components/pay-password.vue'
	export default {
		components: {
			paymentPopup,
			PayPassword,
			// wxParse,
		},
		data() {
			return {
				articleId: '',
				article: '正在加载……',
				isPaid: '',
				preview: 'afdgdfgd',
				showPopup: false,
				showPayPassword: false,
				imageProp: {
					mode: 'widthFix',
					padding: 15,
					lazyLoad: true,
					domain: '',
				},
				articleInfo: ''
			};
		},
		onLoad(option) {
			this.articleId = option.id;
			this.init();
		},
		//分享
		onNavigationBarButtonTap(option) {
			if (option.index == 1) {
				uni.showToast({
					title: '举报成功',
					icon: 'none'
				})
				return
			}
			var title = this.articleInfo.title;
			var thumbnail = this.articleInfo.thumbnail;
			var summary = this.articleInfo.summary;
			var href = config.shareHost + '/article?id=' + this.articleId;
			uni.share({
				provider: 'weixin',
				type: 0,
				title: title,
				scene: 'WXSceneSession',
				summary: summary,
				href: href,
				imageUrl: thumbnail,
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
				uni.showLoading({
					title:'正在加载…',
					mask:true
				})
				this.$http.get({
					url: '/content/articleDetail',
					data: {
						id: this.articleId
					}
				}).then(r => {
					if (r.code == 0) {
						this.articleInfo = r.data;
						this.isPaid = r.data.have_power ? 1 : 2;
						var content = r.data.content || '';
						// this.article = marked(content);
						this.article=content.replace(/\<img/g,'<img style="max-width:100%;"');

					}
					this.$nextTick(function(){
						uni.hideLoading();
					})
				})
			},
			//确认购买
			submit(data) {
				var checkedVal = data.value;
				var type;
				switch (checkedVal) {
					case 'wxpay':
						type = 1;
						break;
					case 'alipay':
						type = 2;
						break;
					case 'appleiap':
						type = 4;
						break;
					default:
						type = 3;
						this.showPayPassword=true;
						this.showPopup = false;
						return;
				}
				uni.showLoading({
					title:'请稍候……'
				})
				this.$http.get({
					url: '/order/createArticleOrder',
					data: {
						id: this.articleId,
						type: type
					}
				}).then(r => {
					if (r.code == 0) {
						var orderInfo;
						if (type == 4 && this.payment != 0) {
							var orders = [r.data.order_no];
						}
						if (type == 1 && this.payment != 0) {
							orderInfo = JSON.stringify(r.data.pay)
						} else if (type == 2 && this.payment != 0) {
							orderInfo = r.data;
						}
						var that = this;
						uni.requestPayment({
							provider: checkedVal,
							orderInfo: orderInfo,
							success(res) {
								that.init();
							},
							fail(err) {
								console.log('支付错误' + JSON.stringify(err))
							},
							complete() {
								uni.hideLoading();
							}
						})
						this.showPopup = false;
					}
				})
			},
			payByScore(password){
				this.$http.get({
					url: '/order/createArticleOrder',
					data: {
						id: this.articleId,
						type: 3,
						pay_password:password
					}
				}).then(r=>{
					if(r.code==0){
						this.init();
						this.showPayPassword = false;
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	@import url('../../components/mpvue-wxparse/src/wxParse.css');

	.articleDetail {
		min-height: 100vh;
		background-color: #fff;
		padding-bottom: 100upx;

		.article {
			overflow: hidden;
			width: 100%;
			padding: 30upx 30upx;

			.title {
				font-size: 32upx;
				color: #333;
				line-height: 1.4;
				font-weight: 500;
				text-align: center;
				margin-bottom: 20upx;
			}
		}

		.tip-msg {
			font-size: 28upx;
			color: orangered;
			line-height: 1.5;
			background-color: #f8f8f8;
			padding: 20upx 30upx;
		}
	}
</style>
