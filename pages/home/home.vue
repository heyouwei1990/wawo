<template>
	<view class="homePage">
		<view class="tab-icons">
			<view class="tab-item" @click="scan">
				<image style="width: 60upx;height:60upx;" src="../../static/icon_scan.png" />
				<view class="label">扫一扫</view>
			</view>
			<navigator class="tab-item" url="../friends/friends">
				<image style="width: 60upx;height:60upx;" src="../../static/icon_zhuan.png" />
				<view class="label">转账</view>
			</navigator>
			<navigator class="tab-item" url="../creditValue/creditValue">
				<image style="width: 60upx;height:60upx;" src="../../static/icon_xin.png" />
				<view class="label">信用值</view>
			</navigator>
			<navigator class="tab-item" url="../friends/friends">
				<image style="width: 60upx;height:60upx;" src="../../static/icon_friend.png" />
				<view class="label">好友</view>
			</navigator>
		</view>
		<view class="content">
			<view class="module-list" v-if="items.length">
				<view @tap="towebview(item.url)" class="item" v-for="(item,index) in items" :key="index">
					<image style="width: 80upx;height:80upx;" :src="item.icon" />
					<view class="label">{{item.name}}</view>
				</view>
			</view>
			<view class="notice-wrap">
				<image class="head-img" src="../../static/headline.png" mode="widthFix"></image>
				<view class="notice-box" >
					<navigator class="notice-desc" id="notice" :style="{'animation-duration':duration+'s'}" :url="'../articleDetail/articleDetail?id='+notice.id">{{notice.title}}</navigator>
				</view>
			</view>
			<view class="sec-hd">
				<view class="title">热卖商品</view>
				<navigator class="more icon-link" url="../goodsList/goodsList">查看更多</navigator>
			</view>
			<view class="goods-list">
				<view class="li" v-for="(item,index) in goodsList" :key="index">
					<navigator class="goods-dl" :url="'../goodsDetail/goodsDetail?id='+item.id">
						<view class="goods-dt" >
							<image class="cover" :src="item.thumbnail" mode=""></image>
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
			<view class="divide"></view>
			<view class="sec-hd">
				<view class="title">精选视频</view>
				<navigator class="more icon-link" url="../videoList/videoList">查看更多</navigator>
			</view>
			<view class="video-list">
				<view class="li" v-for="(item,index) in videoList" :key="index">
					<navigator @tap="item.views++" class="video-dl" :url="'../videoDetail/videoDetail?id='+item.id">
						<image class="cover" :src="item.thumbnail" lazy-load></image>
						<view class="title">{{item.title}}</view>
						<view class="desc">{{item.summary}}</view>
						<view class="row">
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
							<view class="pageview">{{item.views}}</view>
						</view>
					</navigator>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: '',
				duration:10,
				goodsList:[],
				videoList:[],
				notice:'',
				items:[],
			}
		},
		onLoad() {
			this.init();
		},
		onShow() {
			this.checkMsg();
		},
		onReady() {
			this.update();
			this.setTime();
			//获取支付通道
			var that=this;
			uni.getProvider({
				service:'payment',
				success(res) {
					var list=res.provider.map(function(value){
						console.log(value);
						switch (value){
							case 'wxpay':
								return{
									icon:'/static/wxpay.png',
									name:'微信支付',
									value:value,
								};
								break;
							case 'alipay':
								return{
									icon:'/static/alipay.png',
									name:'支付宝',
									value:value,
								};
								break;
							case 'appleiap':
								return{
									icon:'/static/appleiap.png',
									name:'苹果支付',
									value:value,
								};
								break;
						}
					});
					list.push({
						icon:'/static/icon.png',
						name:'信用分支付',
						value:'score',
					});
					uni.setStorageSync('payTypes',list);
				}
			})
		
			//获取定位
			uni.getLocation({
				success(data) {
					var location=data.longitude+','+data.latitude;
					that.$store.commit('setLocation',location);
				}
			})
		},
		onNavigationBarSearchInputClicked() {
			uni.navigateTo({
				url:'../seach/seach?type=1'
			})
		},
		onPullDownRefresh() {
			this.init();
		},
		methods: {
			//打开webview
			towebview(url){
				uni.navigateTo({
					url:'../webview/webview?url='+url
				})
			},
			
			async checkMsg(){
				this.$http.get({
					url:'/my/checkMsg',
					data:{
					}
				}).then(r=>{
					if(r.code==0){
						if(r.data.number>0){
							uni.showTabBarRedDot({
								index:4
							})
							uni.setStorageSync('dot', 1);
						}
					}
				})
			},
			async init(){
				//获取第三方入口列表
				this.$http.get({
					url:'/main/third/get'
				}).then(r=>{
					if(r.code==0){
						this.items=r.data;
					}
				})
				//获取头条
				this.getList(3,2,1).then(r=>{
					if(r.code==0){
						this.notice=r.data.list[0];
					}
				})
				//获取商品
				this.getList(1,2,3).then(r=>{
					if(r.code==0){
						this.goodsList=r.data.list;
					}
				})
				
				//获取视频
				await this.getList(5,2,4).then(r=>{
					if(r.code==0){
						this.videoList=r.data.list;
					}
				})
				uni.stopPullDownRefresh();
			},
			//获取列表
			getList(type,popular,size=10,keyword='',sub){
				return new Promise((res,rej)=>{
					this.$http.get({
						url:'/content/get',
						data:{
							type:type,
							keyword:keyword,
							popular:popular,
							sub:sub,
							page:1,
							size:size
						}
					}).then(r=>{
						res(r);
					})
				})
			},
			//设置头条滚动时间
			setTime(){
				//通知的滚动时长=宽度÷屏幕宽度*10s
				uni.createSelectorQuery().select('#notice').boundingClientRect((res)=>{
					if(res.width>uni.upx2px(750)){
						this.duration=res.width/uni.upx2px(750)*10;
					}else{
						this.duration=10;
					}
				}).exec();
			},
			//扫一扫
			scan(){
				var that=this;
				uni.scanCode({
					success(res) {
						that.getFriendInfo(res.result);
					}
				})
			},
			
			getFriendInfo(key){
				this.$http.get({
					url:"/my/scan",
					data:{
						code:key
					}
				}).then(r=>{
					if(r.code==0){
						uni.setStorageSync('scanData',r.data);
						uni.navigateTo({
							url:'../addFriend/addFriend'
						})
					}
				})
			},
			update() {
				var flag=uni.getStorageSync('updateCancel');
				if(flag){
					return;
				}
				this.$http.post({
					url: '/version/update',
				}).then(r => {
					if (r.code == 0 && r.data.id > this.$currentVersion.versionId) {
						var latestId=r.data.number;
						uni.showModal({
							title: '发现新版本',
							content: '有新版本可用 (版本id:' + latestId + ')，请问您是否更新？',
							success: (res) => {
								if (res.confirm) {
									uni.navigateTo({
										url:'../updateApp/updateApp'
									})
								} else if (res.cancel) {
									
								}
								uni.setStorageSync('updateCancel',true);
							}
						})
					}
				});
			}
		}
	}
</script>

<style lang="scss">
.homePage{
// 	height: 100%;
// 	width: 100%;
// 	position: fixed;
// 	left: 0;
// 	top: 0;
// 	padding-top: var(--window-top);
// 	padding-bottom: var(--window-bottom);
// 	display: flex;
// 	flex-direction: column;
	overflow: hidden;
	.tab-icons{
		display: flex;
		justify-content: space-around;
		align-items: flex-end;
		background-color: #0193fe;
		padding-top: 20upx;
		padding-bottom: 20upx;
		height: 144upx;
		width: 100%;
		position: fixed;
		left: 0;
		top: var(--window-top);
		z-index: 9;
		.tab-item{
			width: 25%;
			text-align: center;
			color: #fff;
		}
		.label{
			font-size: 28upx;
			line-height: 1.5;
		}
	}
	.content{
		margin-top: 144upx;
		background-color: #fff;
		width: 100%;
	}
	.module-list{
		background-color: #fff;
		padding-top: 20upx;
		.item{
			padding-top: 15upx;
		   padding-bottom:15upx;
			float: left;
			width: 25%;
			text-align: center;
			margin-bottom: 10upx;
		}
		.icon{
			width: 80upx;
			height: 80upx;
			background-color: #faa;
			margin: 0 auto;
		}
		.label{
			font-size: 24upx;
			line-height: 1.5;
			color: #333;
		}
	}
	.notice-wrap{
		width: 100%;
		height: 80upx;
		display: flex;
		align-items: center;
		background-color: #f8f8f8;
		padding-left: 30upx;
		.icon-remind{
			width: 35upx;
			height: 30upx;
			margin-right: 20upx;
		}
		.head-img{
			max-height: 80upx;
			width: 120upx;
		}
		.notice-box{
			flex: 1;
			min-width: 200upx;
			height: 50upx;
			overflow: hidden;
			position: relative;
		}
		.notice-desc{
			font-size: 24upx;
			line-height: 50upx;
			height: 50upx;
			color: #48a7f9;
			white-space: nowrap;
			position: absolute;
			left: 0;
			top: 0;
			min-width: 665upx;
			animation-name: run;
			animation-delay:0.1s;
			//animation-duration: 10s;
			animation-timing-function:linear;
			animation-iteration-count: infinite;
		}
	}
	.sec-hd{
		.more{
			font-size: 24upx;
			color: #999;
			line-height: 1.5;
		}
	}
	.video-list{
		padding: 20upx 25upx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		.li{
			width: 340upx;
			margin-bottom: 20upx;
		}
	}
}
	
@keyframes run{
	from{
		transform: translate(665upx);
	}
	to{
		transform: translate(-100%);
	}
}
</style>
