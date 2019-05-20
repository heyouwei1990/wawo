<template>
	<view class="lessonDetail">
		<image class="cover" :src="lesson.thumbnail" mode="widthFix"></image>
		<view class="lesson-info">
			<view class="title">{{lesson.title}}</view>
			<view class="price-area">
				<view class="vip-price" v-if="lesson.price != lesson.vip_price">
					<view class="vip-mark"></view>
					<view class="price" v-if="lesson.vip_price>0"><text class="unit">¥</text>{{lesson.vip_price}}</view>
					<view class="price" v-else>免费</view>
				</view>
				<view class="price" v-if="lesson.is_free==1">免费</view>
				<view class="price" :class="{smaller:lesson.price != lesson.vip_price}" v-if="lesson.is_free==0"><text class="unit">¥</text>{{lesson.price}}</view>
			</view>
		</view>
		<view class="divide"></view>
		<view class="info-wrap">
			<view class="row">
				<view class="iconfont icon-time"></view>
				<view class="time">{{lesson.start_time}}</view>
				<view class="status">{{lesson.course_status}}</view>
			</view>
			<view class="row">
				<view class="iconfont icon-people"></view>
				<view class="limit">已报名{{lesson.signup_num}}人 / 限制{{lesson.limit_amount}}人 </view>
			</view>
			<view class="row">
				<view class="iconfont icon-locate"></view>
				<view class="address">{{lesson.specificsite}}</view>
				<view class="distance" v-if="lesson.distance || lesson.distance===0">{{lesson.distance}}km</view>
			</view>
		</view>
		<view class="divide"></view>
		<view class="reg-time">报名时间：{{lesson.start_signup_time}}至{{lesson.deadline_time}}</view>
		<view class="divide"></view>
		<view class="detail">
			<view class="title">课程详情</view>
			<!-- <wxParse :content="content" :imageProp="imageProp" /> -->
			<!-- <rich-text :nodes="content"></rich-text> -->
			<div v-html="content"></div>
		</view>
		<view class="fixed-bottom uni-flex">
			<!-- <view class="cost uni-flex-item" >
				<view class="val">20信誉值</view>
				<view class="label">兑换</view>
			</view> -->
			<button class="btn-primary uni-flex-item" v-if="!is_buy" @tap="signIn">报名</button>
			<button class="btn-primary uni-flex-item" v-if="!isFree" @tap="showPopup=true">购买</button>
		</view>
		<payment-popup :show="showPopup" @pay="submit" @hidePopup="showPopup=false"></payment-popup>
	</view>
</template>

<script>
	import config from '../../common/config.js'
	import paymentPopup from '../../components/payment-popup.vue'
	import PayPassword from '../../components/pay-password.vue'
	// import marked from '../../components/marked'
	// import wxParse from '../../components/mpvue-wxparse/src/wxParse.vue'
	export default {
		components:{
			paymentPopup,
			PayPassword,
			// wxParse
		},
		data() {
			return {
				lessonId:'',
				lesson:'',
				showPopup:false,
				showPayPassword: false,
				isFree:false,
				userInfo:'',
				content: '',
				is_buy:false,
				imageProp: {
					mode: 'widthFix',
					padding: 15,
					lazyLoad: true,
					domain: '',
				},
			};
		},
		onLoad(option) {
			this.userInfo=uni.getStorageSync('userInfo');
			this.lessonId=option.id;
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
			var title=this.lesson.title;
			var thumbnail=this.lesson.thumbnail;
			var summary=this.lesson.summary;
			var href=config.shareHost+'/lesson?id='+this.lessonId;
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
				uni.showLoading({
					title:'正在加载…',
					mask:true
				})
				var location=this.$store.state.location.split(',')
				this.$http.get({
					url:'/content/courseDetail',
					data:{
						id:this.lessonId,
						longitude:location[0],
						latitude:location[1]
					}
				}).then(r=>{
					if(r.code==0){
						this.lesson=r.data;
						this.is_buy=this.lesson.is_buy;
						var content = r.data.content || '';
						// this.content = marked(content);
						this.content=content.replace(/\<img/g,'<img style="max-width:100%;"');
						//判断是否对本用户免费
						if(this.lesson.is_free==1 || (this.lesson.vip_price==0 && this.userInfo.rank_id>1) || this.lesson.have_power || this.lesson.price==0){
							this.isFree=true;
						}
					}
					this.$nextTick(function(){
						uni.hideLoading();
					})
				})
			},
			//报名
			signIn(){
				this.$http.get({
					url:'/order/createCourseOrder',
					data:{
						id:this.lesson.id,
						type:3
					}
				}).then(r=>{
					if(r.code==0){
						this.init()
					}
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
					url:'/order/createCourseOrder',
					data:{
						id:this.lesson.id,
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
					url: '/order/createCourseOrder',
					data: {
						id: this.lesson.id,
						type: 3,
						pay_password:password
					}
				}).then(r=>{
					if(r.code==0){
						uni.redirectTo({
							url:'../paySuccess/paySuccess'
						})
						this.showPayPassword=false;
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.lessonDetail{
	padding-bottom: 100upx;
	.cover{
		width: 100%;
		display: block;
	}
	.price-area{
		text-align: right;
	}
	.lesson-info{
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
	.info-wrap{
		padding: 20upx 30upx;
		background-color: #fff;
		.row{
			display: flex;
			margin-bottom: 20upx;
			&:last-child{
				margin-bottom: 0upx;
			}
		}
		.iconfont{
			font-size: 30upx;
			margin-right: 10upx;
			color: #666;
		}
		.time,.limit,.address{
			flex: 1;
			font-size: 24upx;
			line-height: 1.5;
			color: #333;
		}
		.distance{
			font-size: 24upx;
			line-height: 1.5;
			color: #999;
		}
		.status{
			font-size: 24upx;
			line-height: 1.5;
			color: #333;
		}
	}
	.reg-time{
		height: 88upx;
		padding: 20upx 30upx;
		background-color: #fff;
		font-size: 24upx;
		line-height: 48upx;
		color: #333;
	}
	.detail{
		background-color: #fff;
		width: 100%;
		padding: 30upx;
		.title{
			font-size:32upx;
			color: #333;
			line-height: 2;
			text-align: center;
			margin-bottom: 20upx;
			&:before,&:after{
				content: "";
				display: inline-block;
				width: 160upx;
				height: 1upx;
				background-color: #666;
				vertical-align: middle;
				margin-right: 40upx;
				margin-left: 40upx;
				transform: translateY(0.5);
			}
		}
		image{
			width: 100%;
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
