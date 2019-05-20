<template>
	<view class="collegeIndex">
			<swiper class="banner-slider" v-if="bannerList.length" indicator-color="rgba(255,255,255,0.5)" indicator-active-color="rgba(72,167,249,0.8)" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="500">
				<swiper-item v-for="(item,index) in bannerList" :key="index">
					<view class="swiper-item" @tap="bannerTap(item)">
						<image class="banner" :src="item.bannerurl" @load="imgLoaded" mode="scaleToFill"></image>
					</view>
				</swiper-item>
			</swiper>
			<view class="tab-wrap" id="tab">
				<!--  :class="{'is-fixed':isFixed}" -->
				<view class="tab-hd">
					<view class="tab-hd-item" :class="{on:tabIndex==index}" v-for="(item,index) in tabs" :key="index" @tap="tabChange(index)">{{item}}</view>
				</view>
			</view>
			<swiper class="swiper-wrap" :duration="200" :current="tabIndex" @change="swipe">
				<swiper-item>
					<scroll-view scroll-y class="scroller">
						<view class="sec-hd">
							<view class="title">即将开课</view>
							<navigator class="more icon-link" url="../lessonList/lessonList">查看更多</navigator>
						</view>
						<view class="lesson-list" v-if="lessonList.length">
							<navigator class="lesson-dl" v-for="(item,index) in lessonList" :key="index" :url="'../lessonDetail/lessonDetail?id='+item.id">
								<view class="lesson-dt">
									<view class="free-mark" v-if="item.vip_price==0">VIP免费</view>
									<image class="cover" mode="aspectFill" :src="item.thumbnail" lazy-load></image>
								</view>
								<view class="lesson-dd">
									<view class="row-top">
										<view class="title">{{item.title}}</view>
										<view class="status">{{item.course_status}}</view>
									</view>
									<view class="desc">{{item.summary}}</view>
									<view class="time">开课时间：{{item.start_time}}</view>
									<view class="row-bottom">
										<view class="address">开课地点：{{item.specificsite}}</view>
										<view class="distance" v-if="item.distance || item.distance===0">{{item.distance}}km</view>
									</view>
								</view>
							</navigator>
						</view>
						<view class="uni-loadmore" v-if="lessonList.length==0">没有数据</view>
						<view class="divide"></view>
						<view class="sec-hd">
							<view class="title">视频课程</view>
							<navigator url="../videoList/videoList" class="more icon-link">查看更多</navigator>
						</view>
						<view class="video-list" v-if="videoList.length">
							<view class="li" v-for="(item,index) in videoList" :key="index">
								<navigator @tap="item.views++" class="video-dl" :url="'../videoDetail/videoDetail?id='+item.id">
									<image class="cover" :src="item.thumbnail" mode="aspectFill" lazy-load></image>
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
						<view class="uni-loadmore" v-if="videoList.length==0">没有数据</view>
					</scroll-view>
				</swiper-item>
				<swiper-item>
					<scroll-view scroll-y class="scroller">
						<view class="sec-hd">
							<view class="title">秘籍</view>
							<navigator url="../esotericaList/esotericaList" class="more icon-link">查看更多</navigator>
						</view>
						<view class="list" v-if="esotericaList.length">
							<navigator class="article-dl" @tap="item.views++" v-for="(item,index) in esotericaList" :key="index" :url="'../esotericaDetail/esotericaDetail?id='+item.id">
								<view class="article-dt">
									<image class="cover" :src="item.thumbnail" mode="aspectFill"></image>
								</view>
								<view class="article-dd">
									<view class="row-top">
										<view class="title">{{item.title}}</view>
									</view>
									<view class="desc">{{item.summary}}</view>
									<view class="row-bottom">
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
								</view>
							</navigator>
						</view>
						<view class="uni-loadmore" v-if="esotericaList.length==0">没有数据</view>
					</scroll-view>
				</swiper-item>
			</swiper>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isFixed:false,
				tabTop:0,
				bannerList:[],
				tabs:['课程','秘籍'],
				tabIndex:0,
				esotericaList:[],//秘籍
				lessonList:[],
				videoList:[],
			};
		},
		onNavigationBarButtonTap(obj){
			uni.navigateTo({
				url:'../calendar/calendar'
			})
		},
		onNavigationBarSearchInputClicked() {
			uni.navigateTo({
				url:'../seach/seach?type=2'
			})
		},
		onLoad() {
			this.init();
		},
		methods:{
			async init(){
				//banner
				this.$http.get({
					url:'/content/banner',
					data:{
						position:3,//3表示学院首页
					}
				}).then(r=>{
					if(r.code==0){
						this.bannerList=r.data;
					}
				});
				//获取课程
				this.getList(2,1,5).then(r=>{
					if(r.code==0){
						var list=r.data.list;
						this.lessonList=list;
					}
				})
				//获取视频
				await this.getList(5,1,4).then(r=>{
					if(r.code==0){
						this.videoList=r.data.list;
					}
				})
				//获取秘籍
				this.getList(4,1,5).then(r=>{
					if(r.code==0){
						this.esotericaList=r.data.list;
					}
				})
			},
			//点击切换
			tabChange(index){
				this.tabIndex=index;
			},
			//滑动切换
			swipe(e){
				this.tabIndex=e.detail.current;
			},
			//轮播图加载完获取tab的位置
			async imgLoaded(){
// 				let data=await this.getSize('#tab');
// 				this.tabTop=data.top;
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
			//滚动时候固定tab
			async onScroll(e){
				var scrollTop=e.detail.scrollTop;
				var pullUp=e.detail.deltaY>0?false:true;
				if(scrollTop<=this.tabTop){
					this.isFixed=false;
				}
				if(scrollTop+10>this.tabTop && pullUp){
					this.isFixed=true;
				}
			},
			//获取节点信息
			getSize(el){
				return new Promise((res,rej)=>{
					const result=uni.createSelectorQuery().select(el).boundingClientRect(function(data){
						res(data);
					}).exec();
				})
			},
			
			//获取列表
			async getList(type=1,popular,size=10,keyword='',sub){
				let location=this.$store.state.location.split(',');
				// console.log(JSON.stringify(location));
				let params={
						type:type,
						keyword:keyword,
						popular:popular,
						sub:sub,
						page:1,
						size:size,
					}
				if(type=2){
					//课程
					params['longitude']=location[0];
					params['latitude']=location[1];
				}
				return new Promise((res,rej)=>{
					this.$http.get({
						url:'/content/get',
						data:params
					}).then(r=>{
						res(r);
					})
				})
			},
		}
	}
</script>

<style lang="scss">
.collegeIndex{
	position: fixed;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	overflow: hidden;
	padding-top: var(--window-top);
	padding-bottom: var(--window-bottom);
	.swiper-wrap{
		flex: 1;
		min-height: 200upx;
		width: 100%;
	}
	.scroller{
		height: 100%;
		width: 100%;
	}
	.banner-slider{
		width: 100%;
		height: 330upx;
		.banner{
			width: 100%;
			height: 330upx;
		}
	}
	.tab-wrap{
		position: relative;
		height: 90upx;
		width: 100%;
	}
	.tab-hd{
		display: flex;
		justify-content: space-around;
		width: 100%;
		align-items: center;
		height: 90upx;
		background-color: #fff;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 10;
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
		&.is-fixed{
			position: fixed;
			top: var(--window-top);
		}
		.tab-hd-item{
			height: 90upx;
			line-height: 90upx;
			font-size: 28upx;
			color: #333;
			padding: 0 30upx;
			position: relative;
			&.on{
				color: #48a7f9;
				&:after{
					content: "";
					box-sizing: border-box;
					padding: 0 30upx;
					background-clip: content-box;
					position: absolute;
					left: 0;
					bottom: 0;
					z-index: 2;
					width: 100%;
					height: 6upx;
					background-color: #48a7f9;
				}
			}
			
		}
	}
	.more{
		font-size: 24upx;
		color: #999;
		line-height: 1.5;
	}
	.video-list{
		overflow: hidden;
		display: flex;
		flex-wrap: wrap;
		padding: 20upx 25upx;
		justify-content: space-between;
		.li{
			width: 340upx;
			margin-bottom: 20upx;
		}
	}
}
</style>
