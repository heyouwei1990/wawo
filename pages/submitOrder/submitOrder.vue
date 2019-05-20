<template>
	<view class="submitOrder">
		<navigator class="addressee-info" url="../address/address">
			<view class="no-addr icon-link" v-if="!address">请先设置收货地址</view>
			<view class="icon-link" v-if="address">
				<view class="addressee">
					<view class="label">收货人：</view>
					<view class="fullname">{{address.recv_person}}</view>
					<view class="phone">{{address.recv_phone}}</view>
					<view class="mark" v-if="address.is_default==1">默认</view>
				</view>
				<view class="address">
					<view class="label">收货地址：</view>
					<view class="val">{{address.recv_district}}{{address.recv_addr}}</view>
				</view>
			</view>
		</navigator>
		<view class="divide"></view>
		<navigator class="goods-dl" v-if="goodsInfo" :url="'../goodsDetail/goodsDetail?id='+goodsInfo.content_id">
			<view class="goods-dt">
				<image class="cover" :src="goodsInfo.thumbnail" mode="aspectFill"></image>
			</view>
			<view class="goods-dd">
				<view class="desc">{{goodsInfo.title}}</view>
				<view class="spec">{{goodsInfo.attribute_values}}</view>
				<view class="uni-flex-item"></view>
				<view class="bottom">
					<!-- 价格显示 -->
					<view class="price-area">
						<view class="vip-price" v-if="goodsInfo.price != goodsInfo.vip_price">
							<view class="vip-mark"></view>
							<view class="price" v-if="goodsInfo.vip_price>0"><text class="unit">¥</text>{{goodsInfo.vip_price}}</view>
							<view class="price" v-else>免费</view>
						</view>
						<view class="price" v-if="goodsInfo.is_free==1">免费</view>
						<view class="price" :class="{smaller:goodsInfo.price != goodsInfo.vip_price}" v-if="goodsInfo.is_free==0"><text class="unit">¥</text>{{goodsInfo.price}}</view>
					</view>
					<view>
						<view class="count">数量：×{{count}}</view>
					</view>
				</view>
			</view>
		</navigator>
		<view class="divide"></view>
		<view class="leave-msg">
			<textarea class="textarea" v-model="leaveMsg" placeholder="请输入备注留言信息" />
			</view>
		<view class="uni-list info-list">
			<!-- <view class="uni-list-cell" v-for="(item,index) in list" :key="index"> -->
			<view class="uni-list-cell">
				<view class="label">优惠：</view>
				<view class="val">¥0</view>
			</view>
			<view class="uni-list-cell">
				<view class="label">运费：</view>
				<view class="val">¥{{postFee}}</view>
			</view>
			<view class="uni-list-cell">
				<view class="label">商品总价：</view>
				<view class="val">¥{{totalPrice}}</view>
			</view>
		</view>
		<view class="fixed-bottom uni-flex">
			<view class="payment uni-flex-item">
				合计：{{payment}}元
			</view>
			<button  class="btn-primary" @tap="choose">提交订单</button>
		</view>
		<payment-popup :show="showPopup" @pay="submit" @hidePopup="showPopup=false"></payment-popup>
		<pay-password :show="showPayPassword" @completed="payByScore" @hidePopup="showPayPassword=false"></pay-password>
	</view>
</template>

<script>
	import paymentPopup from '../../components/payment-popup.vue'
	import PayPassword from '../../components/pay-password.vue'
	export default {
		components:{
			paymentPopup,
			PayPassword
		},
		data() {
			return {
				showPayPassword:false,
				showPopup:false,
				address:'',
				goodsInfo:'',
				postFee:0,
				totalPrice:0,
				leaveMsg:'',
				payment:0,
				goodsId:'',
				count:0,
			};
		},
		onLoad(option) {
			this.goodsId=option.id;
			this.count=option.count;
			this.init();
			//判断是否支持苹果支付
			var that=this;
			uni.getProvider({
				service:'payment',
				success(res) {
					if(res.provider.indexOf('appleiap')!=-1){
						that.payTypes[2].isShow=true;
					}
				}
			})
		},
		onShow() {
			var addrInfo=uni.getStorageSync('address');
			if(addrInfo){
				this.address=addrInfo;
				uni.removeStorageSync('address');
			}
		},
		methods:{
			//初始化
			init(){
				uni.showLoading({
					title:'加载中…'
				})
				this.$http.get({
					url:'/order/previewCommodityOrder',
					data:{
						id:this.goodsId,
						num:this.count
					}
				}).then(r=>{
					uni.hideLoading();
					if(r.code==0){
						this.address=r.data.address;
						this.goodsInfo=r.data.commodity_value;
						this.postFee=r.data.post_fee;
						this.totalPrice=r.data.commodity_price
						this.payment=this.totalPrice+this.postFee;
					}
				})
			},
			//苹果支付获取支付订单信息
			applepay(productIds){
				plus.payment.getChannels((channels) => {
					console.log("获取到channel" + JSON.stringify(channels))
					for (var i in channels) {
						var channel = channels[i];
						if (channel.id === 'appleiap') {
							this.requestOrder(channel,productIds);
						}
					}
				}, (error) => {
					uni.showToast({
						title:'不支持苹果支付',
						icon:'none'
					})
				});
			},
			requestOrder(iapChannel,productIds) {
				uni.showLoading({
					title:'检测支付环境...',
				})
				iapChannel.requestOrder(productIds, (orderList) => { //必须调用此方法才能进行 iap 支付
					this.disabled = false;
					console.log('requestOrder success666: ' + JSON.stringify(orderList));
					uni.hideLoading();
				}, (e) => {
					console.log('requestOrder failed: ' + JSON.stringify(e));
					uni.hideLoading();
				});
			},
			
			//打开支付弹框
			choose(){
				if(!this.address || !this.address.id){
					uni.showToast({
						icon:'none',
						title:'请设置收货信息'
					})
					return;
				}
				this.showPopup=true;
			},
			//提交订单
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
					url:'/order/createCommodityOrder',
					data:{
						id:this.goodsId,
						num:this.count,
						post_fee :this.postFee,
						total_price:this.totalPrice,
						remark:this.leaveMsg,
						address_id:this.address.id,
						type:type
					}
				}).then(r=>{
					//console.log(JSON.stringify(r.data))
					if(r.code==0){
						var orderInfo;
						if(type==4 && this.payment!=0){
							var orders=[r.data.order_no];
							this.applepay(orders);
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
			//积分支付
			payByScore(password){
				this.$http.get({
					url:'/order/createCommodityOrder',
					data:{
						id:this.goodsId,
						num:this.count,
						post_fee :this.postFee,
						total_price:this.totalPrice,
						remark:this.leaveMsg,
						address_id:this.address.id,
						pay_password:password,
						type:3
					}
				}).then(r=>{
					if(r.code==0){
						uni.redirectTo({
							url:'../paySuccess/paySuccess'
						})
					}
					this.showPayPassword=false;
				})
			}
		}
	}
</script>

<style lang="scss">
.submitOrder{
	.addressee-info{
		width: 100%;
		overflow: hidden;
		background-color: #fff;
		padding: 20upx 30upx;
		.addressee{
			display: flex;
			align-items: center;
			margin-bottom: 10upx;
		}
		.address{
			display: flex;
		}
		.label{
			white-space: nowrap;
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
		}
		.fullname{
			margin-right: 20upx;
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
		}
		.phone{
			margin-right: 20upx;
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
		}
		.val{
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
			word-break: break-all
		}
		.mark{
			font-size: 24upx;
			color: #999;
			line-height: 1.5;
		}
	}
	.leave-msg{
		padding: 20upx 30upx;
		background-color: #fff;
		.textarea{
			height: 200upx;
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
		}
	}
	.spec{
		font-size: 24upx;
		color: #999;
		line-height: 1.5;
	}
	.count{
		font-size: 24upx;
		color: #666;
		line-height: 1.5;
	}
	.info-list{
		.uni-list-cell{
			padding: 20upx 30upx;
		}
		.label{
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
		}
		.val{
			flex: 1;
			text-align: right;
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
		}
	}
	.fixed-bottom{
		.payment{
			background-color: #fff;
			padding: 0 30upx;
			font-size: 32upx;
			color: #333;
			border-top: 1upx solid #ddd;
		}
		.btn-primary{
			padding: 0 30upx;
		}
	}
	.payment-channel{
		padding-top: 20upx;
		.title{
			padding:20upx 30upx;
			font-size: 32upx;
			color: #333;
			line-height: 1.8;
		}
		.btn-box{
			padding: 20upx 30upx;
		}
	}
	.radio-group{
		width: 100%;
		border-top: 1upx solid #ddd;
		border-bottom: 1upx solid #ddd;
		.radio-item{
			border-bottom: 1upx solid #ddd;
			display: flex;
			align-items: center;
			width: 100%;
			padding: 20upx 30upx;
			position: relative;
			&:last-child{
				border-bottom: 0;
			}
			&:after{
				content: "";
				width: 30upx;
				height: 30upx;
				border-radius: 50%;
				border: 1px solid #ddd;
				padding: 6upx;
				box-sizing: border-box;
				background-color: #fff;
				/* position: absolute;
				left: auto;
				right: 30upx;
				top: 50%;
				transform: translateY(-50%); */
			}
			&.checked:after{
				background-color: #66D27E;
				background-clip: content-box;
			}
		}
		.icon{
			width: 60upx;
			height: 60upx;
			margin-right: 20upx;
		}
		.label{
			font-size: 28upx;
			color: #333;
			line-height: 1.8;
			flex: 1;
		}
	}
}
</style>
