<template>
	<view class="videoDetail" v-if="videoInfo" :class="{showbtn:!isFree}">
		<image class="cover" :src="videoInfo.thumbnail" mode="widthFix"></image>
		<view class="video-info">
			<view class="title">{{videoInfo.title}}</view>
			<view class="price">
				<!-- 价格显示 -->
				<view class="price-area">
					<view class="vip-price" v-if="videoInfo.price != videoInfo.vip_price">
						<view class="vip-mark"></view>
						<view class="price" v-if="videoInfo.vip_price>0"><text class="unit">¥</text>{{videoInfo.vip_price}}</view>
						<view class="price" v-else>免费</view>
					</view>
					<view class="price" v-if="videoInfo.is_free==1">免费</view>
					<view class="price" :class="{smaller:videoInfo.price != videoInfo.vip_price}" v-if="videoInfo.is_free==0"><text class="unit">¥</text>{{videoInfo.price}}</view>
				</view>
				<!-- <view class="price" v-if="videoInfo.is_free==1">免费</view>
				<view class="price" v-if="videoInfo.is_free==0">
					<text>¥{{videoInfo.price}}</text>
					<text v-if="videoInfo.price != videoInfo.vip_price && videoInfo.vip_price>0"> / VIP¥{{videoInfo.vip_price}}</text>
					<text v-if="videoInfo.price != videoInfo.vip_price && videoInfo.vip_price==0"> / VIP免费</text>
				</view> -->
			</view>
		</view>
		<view class="divide"></view>
		<view class="tab-hd">
			<view class="tab-hd-item" :class="{on:tabIndex==index}" v-for="(item,index) in tabs" :key="index" @tap="tabChange(index)">{{item}}</view>
		</view>
		<swiper class="swiper" :duration="400" :current="tabIndex" @change="swipeChange">
			<swiper-item>
				<scroll-view class="scroller" scroll-y>
					<view class="content">
						<view class="title">{{videoInfo.title}}</view>
						<!-- <rich-text class="desc" :nodes="videoInfo.content"></rich-text> -->
						<div class="desc" v-html="videoInfo.content"></div>
					</view>
				</scroll-view>
			</swiper-item>
			<swiper-item>
				<scroll-view class="scroller" scroll-y>
					<view class="play-list">
						<view class="cell" v-for="(item,index) in videoInfo.video_list" :key="index" @tap="toPlayer(item)" >
							<text class="num">{{index+1}}</text>
							<view class="iconfont icon-video"></view>
							<view class="label">{{item.title}}</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<view class="fixed-bottom uni-flex">
			<!-- <view class="cost uni-flex-item" >
				<view class="val">20信誉值</view>
				<view class="label">兑换</view>
			</view> -->
			<button class="btn-primary uni-flex-item" v-if="!isFree" @tap="showPopup=true">购买</button>
		</view>
		<payment-popup :show="showPopup" @pay="submit" @hidePopup="showPopup=false"></payment-popup>
		<pay-password :show="showPayPassword" @completed="payByScore" @hidePopup="showPayPassword=false"></pay-password>
	</view>
</template>

<script>
	import config from '../../common/config.js'
	import paymentPopup from '../../components/payment-popup.vue'
	import PayPassword from '../../components/pay-password.vue'
	export default {
		components:{
			paymentPopup,
			PayPassword
		},
		data() {
			return {
				tabs:['课程介绍','视频列表'],
				tabIndex:0,
				videoId:'',
				videoInfo:'',
				showPayPassword: false,
				showPopup:false,
				isFree:false,
				userInfo:'',
			};
		},
		onLoad(option) {
			this.userInfo=uni.getStorageSync('userInfo');
			this.videoId=option.id;
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
			var title=this.videoInfo.title;
			var thumbnail=this.videoInfo.thumbnail;
			var summary=this.videoInfo.summary;
			var href=config.shareHost+'/video?id='+this.videoId;
			uni.share({
				provider:'weixin',
				type:0,
				title:title,
				scene:'WXSceneSession',
				summary:summary,
				href:href,
				imageUrl:thumbnail,
				success(res){
					console.log(JSON.stringify(res));
				},
				fail(err) {
					console.log(JSON.stringify(err));
				}
			})
		},
		methods:{
			init(){
				this.$http.get({
					url:'/content/videoDetail',
					data:{
						id:this.videoId,
					}
				}).then(r=>{
					if(r.code==0){
						this.videoInfo=r.data;
						//判断是否对本用户免费
						if(this.videoInfo.is_free==1 || (this.videoInfo.vip_price==0 && this.userInfo.rank_id>1) || this.videoInfo.have_power || this.videoInfo.price==0){
							this.isFree=true;
						}
					}
				})
			},
			tabChange(index){
				this.tabIndex=index;
			},
			swipeChange(e){
				this.tabIndex=e.detail.current;
			},
			//跳转到播放界面
			toPlayer(data){
				if(!data.url){
					uni.showToast({
						title:'请先购买视频',
						icon:'none'
					})
					return;
				}
				var player={
					pageview:this.videoInfo.views,
					content:this.videoInfo.content,
				}
				Object.assign(player,data);
				this.$store.commit('setPlayerInfo',player)
				uni.navigateTo({
					url:"../videoPlayer/videoPlayer"
				})
			},
			//确认购买
			submit(data){
				var checkedVal=data.value;
				var type;
				switch (checkedVal){
					case 'wxpay':
						type=1;
						break;
					case 'alipay':
						type=2;
						break;
					case 'appleiap':
						type=4;
						break;
					default:
						type=3;
						this.showPayPassword=true;
						this.showPopup = false;
						return;
				}
				uni.showLoading({
					title:'请稍候……'
				})
				this.$http.get({
					url:'/order/createVideoOrder',
					data:{
						id:this.videoInfo.id,
						type:type
					}
				}).then(r=>{
					if(r.code==0){
						var orderInfo;
						if(type==4 && this.payment!=0){
							var orders=[r.data.order_no];
						}
						if(type==1 && this.payment!=0){
							orderInfo=JSON.stringify(r.data.pay)
						}else if(type==2 && this.payment!=0){
							orderInfo=r.data;
						}
						uni.requestPayment({
							provider:checkedVal,
							orderInfo:orderInfo,
							success(res) {
								uni.redirectTo({
									url:'../paySuccess/paySuccess'
								})
							},
							fail(err) {
								console.log('支付错误'+JSON.stringify(err))
							},
							complete() {
								uni.hideLoading();
							}
						})
						this.showPopup=false;
					}
				})
			},
			payByScore(password){
				this.$http.get({
					url: '/order/createVideoOrder',
					data: {
						id: this.videoInfo.id,
						type: 3,
						pay_password:password
					}
				}).then(r=>{
					if(r.code==0){
						uni.redirectTo({
							url:'../paySuccess/paySuccess'
						})
						this.showPayPassword = false;
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.videoDetail{
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	padding-top: var(--window-top);
	display: flex;
	flex-direction: column;
	&.showbtn{
		padding-bottom:98upx;
	}
	.cover{
		width: 100%;
		height: 300upx;
		display: block;
	}
	.price-area{
		text-align: right;
	}
	.video-info{
		display: flex;
		align-items: center;
		padding: 20upx 30upx;
		background-color: #fff;
		justify-content: space-between;
		.title{
			font-size: 32upx;
			color: #333;
			line-height: 1.5;
			flex: 1;
			min-width: 100upx;
			margin-right: 20upx;
		}
	}
	.tab-hd{
		display: flex;
		align-items: center;
		justify-content: space-around;
		background-color: #fff;
		border-bottom: 1upx solid #ddd;
		height: 88upx;
		.tab-hd-item{
			font-size: 28upx;
			color: #333;
			line-height: 88upx;
			&.on{
				color: #48a7f9;
			}
		}
	}
	.swiper{
		flex: 1;
		min-height: 200upx;
		.scroller{
			height: 100%;
		}
	}
	.content{
		min-height: 200upx;
		background-color: #fff;
		padding: 20upx 30upx;
		.title{
			font-size: 28upx;
			line-height: 48upx;
			color: #333;
			margin-bottom: 20upx;
		}
		.desc{
			font-size: 28upx;
			line-height:1.4;
			color: #666;
		}
	}
	.play-list{
		.cell{
			height: 88upx;
			border-bottom: 1upx solid #ddd;
			background-color: #fff;
			display: flex;
			align-items: center;
			padding: 20upx 30upx;
		}
		.num{
			font-size: 24upx;
			line-height: 1.5;
			color: #333;
			width: 40upx;
		}
		.label{
			font-size: 24upx;
			line-height: 1.5;
			color: #333;
		}
		.icon-video{
			font-size: 48upx;
			color: #ccc;
			margin-right: 20upx;
		}
	}
	.cost{
		background-color: #fff;
		padding: 10upx 0upx;
		border-top: 1upx solid #ddd;
		text-align: center;
		.val{
			font-size: 24upx;
			line-height: 1.5;
			color: #333;
		}
		.label{
			font-size: 28upx;
			line-height: 1.5;
			color: #333;
		}
	}
}
</style>
