<template>
	<view class="orderList">
		<view class="fixed-tab">
			<view class="tab-item" :id="'tabItem'+index" @tap="tabChange(index)" :class="{active:tabIndex==index}" v-for="(item,index) in tabItems" :key="index">{{item}}</view>
			<view class="active-bar" ref="bar" :style="{'width':barWidth,'left':barLeft}"></view>
		</view>
		<view class="scroller">
			<view class="empty" v-if="orderList.length==0 && !showLoadMore">没有数据</view>
			<view class="order-item" v-for="(item,index) in orderList" :key="index">
				<view class="item-hd">
					<view class="order-no">{{item.order_no}}</view>
					<view class="status" v-if="item.status==1">待付款</view>
					<view class="status" v-if="item.status==2">待发货</view>
					<view class="status" v-if="item.status==3">已发货（未签到）</view>
					<view class="status" v-if="item.status==4">待评价</view>
					<view class="status" v-if="item.status==5">退款中</view>
					<view class="status" v-if="item.status==6">退款成功</view>
					<view class="status" v-if="item.status==7">已评价</view>
					<view class="status" v-if="item.status==-1">已取消</view>
				</view>
				<view class="goods-list">
					<navigator class="goods-dl" :url="'../orderDetail/orderDetail?id='+item.id">
						<view class="goods-dt" >
							<image class="cover" :src="item.product_img" mode="aspectFill" lazy-load></image>
						</view>
						<view class="goods-dd">
							<view class="desc">{{item.name}}</view>
							<view class="spec">{{item.attribute_values}}</view>
							<view class="uni-flex-item"></view>
							<view class="bottom">
								<view class="price" v-if="item.payment_amount==0">免费</view>
								<view class="price" v-else>¥{{item.payment_amount}}</view>
								<view class="amount" v-if="item.amount">×{{item.amount}}</view>
							</view>
						</view>
					</navigator>
				</view>
				<view class="item-ft">
					<button class="btn-default" @tap="call">联系客服</button>
					<button class="btn-default" v-if="item.status==1" @tap="pay(item)">继续支付</button>
					<button class="btn-default" v-if="item.status==1" @tap="cancel(item.id)">取消订单</button>
					<button class="btn-default" v-if="item.status==2" @tap="refund(item.id)">申请退款</button>
					<button class="btn-default" v-if="item.status==7" @tap="buyAgain(item)">再次购买</button>
					<button class="btn-default" v-if="item.status==3" @tap="recieve(item.id)">确认收货</button>
					<button class="btn-default" v-if="item.status==4" @tap="comment(item.id)">立即评价</button>
					<button class="btn-default" v-if="item.status==-1" @tap="remove(item.id)">删除订单</button>
				</view>
			</view>
			<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabItems:['全部','待付款','待收货','待评价','售后'],
				tabIndex:0,
				barWidth:'56upx',
				barLeft:'30upx',
				orderList:[],
				pageIndex:1,//评论页码
				pageSize:10,//评论
				totalPage:-1,
				showLoadMore:false,
				loadMoreText: "上拉加载更多",
				tel:'',
			};
		},
		onLoad(option) {
			this.tel=uni.getStorageSync('tel');
			this.tabIndex=option.type || 0;
		},
		onShow() {
			var isDeleteBack=uni.getStorageSync('orderDelete');
			console.log(isDeleteBack);
			if(isDeleteBack){
				setTimeout(()=>{
					this.tabChange(this.tabIndex);
					uni.removeStorageSync('orderDelete');
				},100)
			}
		},
		onReady() {
			this.tabChange(this.tabIndex);
		},
		//加载更多
		onReachBottom(){
			this.loadmore();
		},
		//刷新
		async onPullDownRefresh() {
			this.pageIndex=1;
			await this.tabChange(this.tabIndex);
			uni.stopPullDownRefresh();
		},
		methods:{
			//初始化
			init(){
				this.showLoadMore=true;
				this.loadMoreText= "加载中...";
				this.$http.get({
					url:'/myOrder/getMyOrder',
					data:{
						type:this.tabIndex,
						page:this.pageIndex,
						size:this.pageSize,
					}
				}).then(r=>{
					if(r.code==0){
						if(this.pageIndex>1){
							this.orderList=this.orderList.concat(r.data.list);
						}else{
							this.orderList=r.data.list;
						}
						this.totalPage=r.data.totalPage;
						this.pageIndex++;
						this.loadMoreText='上拉加载更多';
						if(r.data.list.length<this.pageSize){
							this.loadMoreText='没有更多数据了';
						}
						if(this.orderList.length==0){
							this.loadMoreText='没有数据';
						}
					}
				})
			},
			//tab切换
			tabChange(index){
				this.tabIndex=index;
				this.pageIndex=1;
				this.totalPage=-1;
				var view=uni.createSelectorQuery().select('#tabItem'+index).boundingClientRect(data=>{
					this.barLeft=data.left+'px';
					this.barWidth=data.width+'px';
				}).exec();
				this.init();
			},
			//加载更多
			async loadmore(){
				this.showLoadMore=true;
				if(this.pageIndex<=this.totalPage){
					this.init();
				}else{
					this.loadMoreText='没有更多数据了';
					return;
				}
			},
			//联系客服
			call(){
				uni.makePhoneCall({
					phoneNumber:this.tel,
				})
			},
			//继续支付
			pay(item){
				if(item.module_id==1){
					uni.navigateTo({
						url:'../submitOrder/submitOrder?id='+ item.detail_id +'&count='+ item.amount
					})
				}else{
					uni.navigateTo({
						url:'../orderDetail/orderDetail?id='+item.id
					})
				}
			},
			//取消订单
			cancel(id){
				uni.showModal({
					title: '提示',
					content: '确认取消该订单？',
					showCancel: true,
					success: res => {
						if(res.confirm){
							this.$http.get({
								url:'/myOrder/updateOrder',
								data:{
									id:id
								}
							}).then(r=>{
								if(r.code==0){
									uni.showToast({
										title:'取消成功'
									})
									for (var i = 0; i < this.orderList.length; i++) {
										if(this.orderList[i].id==id){
											this.orderList[i].status=-1;
										}
									}
								}
							})
						}
					},
				});
				
			},
			//申请退款
			refund(id){
				this.$http.get({
					url:'/myOrder/refund',
					data:{
						id:id,
						refund_desc :'2'
					}
				}).then(r=>{
					if(r.code==0){
						for (var i = 0; i < this.orderList.length; i++) {
							if(this.orderList[i].id==id){
								this.orderList[i].status=5;
								break;
							}
						}
					}
				})
			},
			//评价
			comment(id){
				uni.navigateTo({
					url:'../feedback/feedback?id='+id
				})
			},
			//删除订单
			remove(id){
				uni.showModal({
					title: '提示',
					content: '是否删除该订单',
					showCancel: true,
					success: res => {
						if(res.confirm){
							this.$http.get({
								url:'/myOrder/deleteOrder',
								data:{
									id:id
								}
							}).then(r=>{
								if(r.code==0){
									uni.showToast({
										title:'删除成功'
									})
									for (var i = 0; i < this.orderList.length; i++) {
										if(this.orderList[i].id==id){
											this.orderList.splice(i,1);
										}
									}
								}
							})
						}
					},
				});
			},
			//确认收货
			recieve(id){
				this.$http.get({
					url:'/myOrder/confirmOrder',
					data:{
						id:id
					}
				}).then(r=>{
					if(r.code==0){
						this.tabChange(3);
					}
				})
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
.orderList{
	overflow: hidden;
	.fixed-tab{
		position: fixed;
		left: 0;
		top: var(--window-top);
		z-index: 9;
		height: 90upx;
		padding: 0 30upx;
		width: 100vw;
		background-color: #fff;
		display: flex;
		justify-content: space-between;
		&:after{
			content: "";
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 1upx;
			background-color: #ddd;
			transform: scaleY(0.5);
		}
		.tab-item{
			text-align: center;
			line-height: 88upx;
			font-size: 28upx;
			color: #333;
		}
		.tab-item.active{
			color: #48a7f9;
		}
		.active-bar{
			position: absolute;
			left: 30;
			bottom: 0;
			z-index: 2;
			width: 56upx;
			height: 6upx;
			background-color: #48a7f9;
			transition: all 0.2s linear;
		}
	}
	.scroller{
		margin-top: 90upx;
		/* width: 100%;
		height: 200px;
		flex: 1; */
	}
	.order-item{
		background-color: #fff;
		margin-bottom: 20upx;
		.item-hd{
			display: flex;
			justify-content: space-between;
			padding: 12upx 30upx;
			border-bottom: 1upx solid #ddd;
			align-items: center;
		}
		.status{
			font-size: 24upx;
			color: #f31;
			line-height: 1.5;
		}
		.spec{
			font-size: 24upx;
			color: #999;
			line-height: 1.5;
		}
		.goods-dl{
			&:after{
				content: "";
				position: absolute;
				left: 30upx;
				bottom: 0upx;
				width: 690upx;
				height: 1upx;
				background-color: #ddd;
			}
			&:last-child:after{
				display: none;
			}
		}
		.item-ft{
			display: flex;
			justify-content: flex-end;
			padding: 12upx 30upx;
			border-top: 1upx solid #ddd;
			align-items: center;
		}
		.btn-default{
			padding: 0upx 20upx;
			font-size: 24upx;
			height: 60upx;
			line-height: 60upx;
			border: 1upx solid #48a7f9;
			margin-left: 20upx;
			color: #48a7f9;
		}
	}
}
</style>
