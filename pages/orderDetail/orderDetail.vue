<template>
	<view class="orderDetail" v-if="orderInfo">
		<view class="addressee-info">
			<view class="addressee">
				<view class="label">收货人：</view>
				<view class="fullname">{{orderInfo.receiver}}</view>
				<view class="phone">{{orderInfo.phone}}</view>
			</view>
			<view class="address">
				<view class="label">收货地址：</view>
				<view class="val">{{orderInfo.address}}</view>
			</view>
		</view>
		<view class="divide"></view>
		<view class="status" v-if="orderInfo.status==1">待付款</view>
		<view class="status" v-if="orderInfo.status==2">待发货</view>
		<view class="status" v-if="orderInfo.status==3">已发货（未签到）</view>
		<view class="status" v-if="orderInfo.status==4">待评价</view>
		<view class="status" v-if="orderInfo.status==5">退款中</view>
		<view class="status" v-if="orderInfo.status==6">退款成功</view>
		<view class="status" v-if="orderInfo.status==7">已评价</view>
		<view class="status" v-if="orderInfo.status==-1">已取消</view>
		<view class="goods-list">
			<view class="goods-dl" @tap="buyAgain(orderInfo)">
				<view class="goods-dt" >
					<image class="cover" :src="orderInfo.thumbnail" mode="aspectFill"></image>
				</view>
				<view class="goods-dd">
					<view class="desc">{{orderInfo.title}}</view>
					<view class="spec">{{orderInfo.attribute_values}}</view>
					<view class="uni-flex-item"></view>
					<view class="bottom">
						<!-- 价格显示 -->
						<view class="price" v-if="orderInfo.payment_amount==0">免费</view>
						<view class="price" v-else>¥{{orderInfo.payment_amount}}</view>
						<view class="amount" v-if="orderInfo.amount">×{{orderInfo.amount}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="divide"></view>
		<view class="info-list">
			<view class="cell">
				<view class="label">创建时间</view>
				<view class="val">{{orderInfo.c_time}}</view>
			</view>
			<view class="cell">
				<view class="label">订单编号</view>
				<view class="val">{{orderInfo.order_no}}</view>
			</view>
			<view class="cell">
				<view class="label">订单状态</view>
				<view class="val">{{orderInfo.status_name}}</view>
			</view>
			<view class="cell">
				<view class="label">订单金额</view>
				<view class="val">{{orderInfo.total_price}}</view>
			</view>
			<!-- <view class="cell">
				<view class="label">运费</view>
				<view class="val">¥{{orderInfo.phone}}</view>
			</view>
			<view class="cell">
				<view class="label">优惠</view>
				<view class="val">¥{{orderInfo.phone}}</view>
			</view> -->
			<view class="cell">
				<view class="label">实付款</view>
				<view class="val">¥{{orderInfo.payment_amount}}</view>
			</view>
		</view>
		<view class="fixed-bottom uni-flex">
			<button class="btn-default uni-flex-item" @tap="call">联系客服</button>
			<button class="btn-primary uni-flex-item" v-if="orderInfo.status==1" @tap="cancel">取消订单</button>
			<button class="btn-primary uni-flex-item" v-if="orderInfo.status==1" @tap="pay">继续支付</button>
			<button class="btn-primary uni-flex-item" v-if="orderInfo.status==2" @tap="refund">申请退款</button>
			<button class="btn-primary uni-flex-item" v-if="orderInfo.status==7" @tap="buyAgain(orderInfo)">再次购买</button>
			<button class="btn-primary uni-flex-item" v-if="orderInfo.status==4" @tap="comment">立即评价</button>
			<button class="btn-primary uni-flex-item" v-if="orderInfo.status==3" @tap="recieve">确认收货</button>
			<button class="btn-primary uni-flex-item" v-if="orderInfo.status==-1" @tap="remove">删除订单</button>
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
				orderId:'',
				orderInfo:'',
				tel:'',
				showPopup:false,
				showPayPassword: false,
			};
		},
		onLoad(option) {
			this.tel=uni.getStorageSync('tel');
			this.orderId=option.id;
		},
		onShow() {
			this.init();
		},
		methods:{
			init(){
				this.$http.get({
					url:'/myOrder/getById',
					data:{
						id:this.orderId
					}
				}).then(r=>{
					if(r.code==0){
						// console.log(r.data);
						this.orderInfo=r.data;
					}
				})
			},
			//联系客服
			call(){
				uni.makePhoneCall({
					phoneNumber:this.tel,
				})
			},
			//选择支付方式
			payChange(index){
				this.checked=index;
			},
			pay(){
				if(this.orderInfo.module_id==1){
					uni.navigateTo({
						url:'../submitOrder/submitOrder?id='+ this.orderInfo.detail_id +'&count='+ this.orderInfo.amount
					})
				}else{
					this.showPopup=true
				}
			},
			//确认支付
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
				var url='';
				switch(this.orderInfo.module_id){
					case 1:
						url='/order/createCommodityOrder' //购买商品接口
						break;
					case 2:
						url='/order/createCourseOrder' //购买课程接口
						break;
					case 3:
						url='/order/createArticleOrder' //购买文章接口
						break;
					case 5:
						url='/order/createVideoOrder' //购买视频接口
						break;
					case 6:
						url='/order/createRankOrder' //会员升级接口
						break;
				}
				var params;
				if(this.orderInfo.module_id==1){
					params={
						id:this.orderInfo.content_id,
						num:this.orderInfo.amount,
						post_fee :this.orderInfo.postage,
						total_price:this.orderInfo.total_price,
						address_id:this.orderInfo.address_id,
						type:type
					}
				}else if(this.orderInfo.module_id==6){
					params={
						rank_id:this.orderInfo.rank_id,
						price:this.orderInfo.total_price,
						type:type
					}
				}else{
					params={
						id:this.orderInfo.content_id,
						type:type
					}
				}
				this.$http.get({
					url:url,
					data:params
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
							}
						})
						this.showPopup=false;
					}
				})
			},
			//积分支付
			payByScore(password){
				var url='';
				switch(this.orderInfo.module_id){
					case 1:
						url='/order/createCommodityOrder' //购买商品接口
						break;
					case 2:
						url='/order/createCourseOrder' //购买课程接口
						break;
					case 3:
						url='/order/createArticleOrder' //购买文章接口
						break;
					case 5:
						url='/order/createVideoOrder' //购买视频接口
						break;
					case 6:
						url='/order/createRankOrder' //会员升级接口
						break;
				}
				var params;
				if(this.orderInfo.module_id==1){
					params={
						id:this.orderInfo.content_id,
						num:this.orderInfo.amount,
						post_fee :this.orderInfo.postage,
						total_price:this.orderInfo.total_price,
						address_id:this.orderInfo.address_id,
						type:3
					}
				}else if(this.orderInfo.module_id==6){
					params={
						rank_id:this.orderInfo.rank_id,
						price:this.orderInfo.total_price,
						type:3
					}
				}else{
					params={
						id:this.orderInfo.content_id,
						type:3
					}
				}
				this.$http.get({
					url:url,
					data:params
				}).then(r=>{
					if(r.code==0){
						uni.redirectTo({
							url:'../paySuccess/paySuccess'
						})
						this.showPayPassword = false;
					}
				})
			},
			//取消订单
			cancel(){
				uni.showModal({
					title: '提示',
					content: '确认取消该订单？',
					showCancel: true,
					success: res => {
						if(res.confirm){
							this.$http.get({
								url:'/myOrder/updateOrder',
								data:{
									id:this.orderId
								}
							}).then(r=>{
								if(r.code==0){
									uni.showToast({
										title:'取消成功'
									})
									this.orderInfo.status=-1;
								}
							})
						}
					},
				});
				
			},
			//申请退款
			refund(id){
				
			},
			//评价
			comment(){
				uni.navigateTo({
					url:'../feedback/feedback?id='+this.orderId
				})
			},
			//删除订单
			remove(){
				uni.showModal({
					title: '提示',
					content: '是否删除该订单',
					showCancel: true,
					success: res => {
						if(res.confirm){
							this.$http.get({
								url:'/myOrder/deleteOrder',
								data:{
									id:this.orderId
								}
							}).then(r=>{
								if(r.code==0){
									uni.showToast({
										title:'删除成功'
									})
									//返回订单列表时获取
									uni.setStorageSync('orderDelete','true');
									uni.navigateBack({
										delta:1
									})
								}
							})
						}
					},
				});
			},
			//确认收货
			recieve(id){
				
			},
			// 再次购买
			buyAgain(item){
				//再次购买商品
				if(item.module_id==1){
					uni.navigateTo({
						url:'../goodsDetail/goodsDetail?id='+item.content_id
					})
				}
				//再次购买课程
				if(item.module_id==2){
					console.log(item.module_id);
					uni.navigateTo({
						url:'../lessonDetail/lessonDetail?id='+item.content_id
					})
				}
				//再次购买资讯
				if(item.module_id==3){
					uni.navigateTo({
						url:'../articleDetail/articleDetail?id='+item.content_id
					})
				}
				//再次购买秘籍
				if(item.module_id==4){
					uni.navigateTo({
						url:'../esotericaDetail/esotericaDetail?id='+item.content_id
					})
				}
				//再次购买视频
				if(item.module_id==5){
					uni.navigateTo({
						url:'../videoDetail/videoDetail?id='+item.content_id
					})
				}
			}
		}
	}
</script>

<style lang="scss">
.orderDetail{
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
	.spec{
		font-size: 24upx;
		color: #999;
		line-height: 1.5;
	}
	.status{
		padding: 20upx 30upx;
		font-size: 24upx;
		color: #f33;
		background-color: #fff;
		border-bottom: 1upx solid #ddd;
	}
	.info-list{
		padding: 20upx 30upx 0;
		overflow: hidden;
		background-color: #fff;
		.cell{
			display: flex;
			justify-content:space-between;
			margin-bottom: 20upx;
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
		
}
</style>
