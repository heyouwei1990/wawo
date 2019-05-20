<template>
	<view class="mallIndex">
		<swiper class="banner-slider" v-if="bannerList.length" indicator-color="rgba(255,255,255,0.5)" indicator-active-color="rgba(72,167,249,0.8)" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500">
			<swiper-item v-for="(item,index) in bannerList" :key="index">
				<view class="swiper-item" @tap="bannerTap(item)">
					<image class="banner" :src="item.bannerurl" mode=""></image>
				</view>
			</swiper-item>
		</swiper>
	<!-- 	<view class="module-nav">
			<navigator class="nav-item" url="../goodsList/goodsList">自营专区</navigator>
			<view class="nav-item" @tap="taoke">淘客专区</view>
		</view> -->
		<view class="module-wrap">
			<view class="sec-hd">
				<view class="title">自营精选</view>
				<navigator class="more icon-link" url="../goodsList/goodsList">查看更多</navigator>
			</view>
			<view class="goods-list">
				<view class="li" v-for="(item,index) in goodsList" :key="index">
					<navigator class="goods-dl" :url="'../goodsDetail/goodsDetail?id='+item.id">
						<view class="goods-dt" >
							<image class="cover" :src="item.thumbnail" mode="aspectFill"></image>
						</view>
						<view class="goods-dd">
							<view class="desc">{{item.title}}</view>
							<view class="bottom">
								<!-- 价格显示 -->
								<view class="price-area">
									<view class="vip-price" v-if="item.price != item.vip_price">
										<view class="vip-mark"></view>
										<view class="price" v-if="item.vip_price>0"><text class="unit">¥</text>{{item.vip_price}}</view>
										<view class="price" v-else>免费</view>
									</view>
									<view class="price" v-if="item.is_free==1">免费</view>
									<view class="price" :class="{smaller:item.price != item.vip_price}" v-if="item.is_free==0"><text class="unit">¥</text>{{item.price}}</view>
								</view>
								<button  class="btn-buy">立即购买</button>
							</view>
						</view>
					</navigator>
				</view>
			</view>
		</view>
		<!-- <view class="module-wrap">
			<view class="module-head">
				<view class="title">淘客精选</view>
				<view class="more icon-link">查看更多</view>
			</view>
			<view class="module-li" v-for="(item,index) in 3" :key="index">
				
			</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bannerList:[],
				goodsList:[],
			};
		},
		onLoad() {
			this.init();
		},
		onNavigationBarSearchInputClicked() {
			uni.navigateTo({
				url:'../seach/seach?type=1'
			})
		},
		methods:{
			init(){
				//banner
				this.$http.get({
					url:'/content/banner',
					data:{
						position:1,//1表示商城首页
					}
				}).then(r=>{
					if(r.code==0){
						this.bannerList=r.data;
					}
				})
				//自营精选
				this.$http.get({
					url:'/content/get',
					data:{
						type:1,
						popular:2
					}
				}).then(r=>{
					if(r.code==0){
						this.goodsList=r.data.list;
					}
				})
			},
			
			//banner点击跳转
			bannerTap(item){
				if(item.type==1){
					uni.navigateTo({
						url:'../webview/webview?url='+item.target
					})
				}else{
					if(item.module==1){
						uni.navigateTo({
							url:'../goodsDetail/goodsDetail?id='+item.target
						})
					}
					if(item.module==2){
						uni.navigateTo({
							url:'../lessonDetail/lessonDetail?id='+item.target
						})
					}
					if(item.module==3){
						uni.navigateTo({
							url:'../articleDetail/articleDetail?id='+item.target
						})
					}
					if(item.module==5){
						uni.navigateTo({
							url:'../videoDetail/videoDetail?id='+item.target
						})
					}
				}
			},
			taoke(){
				uni.showToast({
					title:'敬请期待',
					icon:'none'
				})
			},
		}
	}
</script>

<style lang="scss">
.mallIndex{
	background-color: #fff;
	.banner-slider{
		width: 100%;
		height: 480upx;
		.banner{
			width: 100%;
		}
	}
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
		background-color: #48a7f9;
		.top_view {
			height: var(--status-bar-height);
			width: 100%;
			position: fixed;
			background-color: #48a7f9;
			top: 0;
			z-index: 999;
		}
	}
	.search-nav-bar{
		width: 100%;
		height: --window-top;
		background-color: #48a7f9;
		overflow: hidden;
		.input-view {
			width: 660upx;
			display: flex;
			background-color: #fff;
			height: 30px;
			border-radius: 15px;
			padding: 0 4%;
			flex-wrap: nowrap;
			margin: 7px auto;
			line-height: 30px;
		}
		.icon-search{
			line-height: 30px;
			&:before{
				content: "\E466";
				display: inline-block;
				font-size: 44upx;
				color: #666;
				font-family: uniicons;
				font-weight: normal;
				font-style: normal;
				text-decoration: none;
				-webkit-font-smoothing: antialiased;
			}
		}
		
		.input {
			height: 30px;
			line-height: 30px;
			width: 94%;
			padding: 0 3%;
		}
	}
	.module-nav{
		display: flex;
		padding: 30upx;
		align-items: center;
		justify-content: space-between;
		.nav-item{
			width: 320upx;
			height: 200upx;
			border-radius: 10upx;
			background-color: #eff;
		}
	}
	.module-wrap{
		.module-head{
			padding:20upx 30upx;
			display: flex;
			align-items: center;
		}
		.title{
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
			flex: 1;
		}
		.more{
			font-size: 24upx;
			color: #999;
			line-height: 1.5;
		}
		.module-li{
			width: 100%;
			height: 200upx;
			margin-bottom: 10upx;
			background-color: #f8f8f8;
		}
	}
}
</style>
