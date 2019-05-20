<template>
	<view class="searchPage">
		<view class="tab-hd">
			<view class="tab-hd-item" :class="{on:tabIndex==index}" v-for="(item,index) in tabItems" :key="index" @tap="tabChange(index)">{{item.label}}</view>
		</view>
		<view class="list" v-if="tabIndex==0">
			<navigator class="goods-dl"  v-for="(item,index) in list" :key="index" :url="'../goodsDetail/goodsDetail?id='+item.id">
				<view class="goods-dt" >
					<image class="cover" :src="item.thumbnail" mode="aspectFill" lazy-load></image>
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
		<view class="list" v-if="tabIndex==1">
			<navigator class="lesson-dl" v-for="(item,index) in list" :key="index" :url="'../lessonDetail/lessonDetail?id='+item.id">
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
		<view class="list" v-if="tabIndex==2">
			<navigator class="article-dl" @tap="item.views++" v-for="(item,index) in list" :key="index" :url="'../articleDetail/articleDetail?id='+item.id">
				<view class="article-dt">
					<image class="cover" :src="item.thumbnail" mode="aspectFill" lazy-load></image>
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
		<view class="list" v-if="tabIndex==3">
			<navigator class="article-dl" @tap="item.views++" v-for="(item,index) in list" :key="index" :url="'../esotericaDetail/esotericaDetail?id='+item.id">
				<view class="article-dt">
					<image class="cover" :src="item.thumbnail" mode="aspectFill" lazy-load></image>
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
		<view class="video-list" v-if="tabIndex==4">
			<view class="li" v-for="(item,index) in list" :key="index">
				<navigator class="video-dl" @tap="item.views++" :url="'../videoDetail/videoDetail?id='+item.id">
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
		<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				val:'',
				tabItems:[{label:'商品',value:1},{label:'课程',value:2},{label:'资讯',value:3},{label:'秘籍',value:4},{label:'视频',value:5}],
				list:[],
				tabIndex:0,
				pageIndex:1,//页码
				pageSize:10,//每页数量
				totalPage:0,
				showLoadMore:false,
				loadMoreText: "上拉加载更多",
			};
		},
		onNavigationBarSearchInputChanged(data) {
			this.val=data.text;
		},
		onNavigationBarSearchInputConfirmed() {
			this.search();
		},
		onNavigationBarButtonTap() {
			this.search();
		},
		//加载更多
		onReachBottom(){
			this.loadmore();
		},
		onLoad(option) {
			for(var i=0;i<this.tabItems.length;i++){
				if(this.tabItems[i].value==option.type){
					this.tabIndex=i;
				}
			}
			this.search();
		},
		methods:{
			//tab
			tabChange(index){
				this.list=[];
				this.tabIndex=index;
				this.search();
			},
			//搜索
			search(){
				this.pageIndex=1;
				this.totalPage=0;
				this.getPageList();
			},
			getPageList(){
				var type=this.tabItems[this.tabIndex].value;
				let location=this.$store.state.location.split(',');
				let params={
						type:type,
						keyword:this.val,
						popular:0,
						page:this.pageIndex,
						size:this.pageSize,
					}
				if(type=2){
					//课程
					params['longitude']=location[0];
					params['latitude']=location[1];
				}else{
					delete params.longitude;
					delete params.latitude;
				}
				this.showLoadMore=true;
				this.loadMoreText='加载中……';
				this.$http.get({
					url:'/content/get',
					data:params
				}).then(r=>{
					if(r.code==0){
						if(r.code==0){
							if(this.pageIndex>1){
								this.list=this.list.concat(r.data.list);
							}else{
								this.list=r.data.list;
							}
							this.totalPage=r.data.totalPage;
							this.pageIndex++;
							this.loadMoreText='上拉加载更多';
							if(this.list.length==0){
								this.loadMoreText='没有数据';
							}
							if(r.data.list.length<this.pageSize){
								this.loadMoreText='没有更多数据了';
							}
						}
					}
				})
			},
			//加载更多
			async loadmore(){
				this.showLoadMore=true;
				if(this.pageIndex<=this.totalPage){
					this.getPageList();
				}else{	
					this.loadMoreText='没有更多数据了';
					return;
				}
			},
		}
	}
</script>

<style lang="scss">
.searchPage{
	overflow: hidden;
	.tab-hd{
		display: flex;
		align-items: center;
		justify-content: space-around;
		position: fixed;
		top: var(--window-top);
		left: 0;
		z-index: 9;
		width: 100%;
		height: 90upx;
		background-color: #fff;
		border-top: 1upx solid #ddd;
		border-bottom: 1upx solid #ddd;
		.tab-hd-item{
			font-size: 28upx;
			color: #333;
			line-height: 88upx;
			&.on{
				color: #48A7f9;
			}
		}
	}
	.list{
		padding-top: 90upx;
	}
	.video-list{
		padding: 110upx 25upx 20upx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		.li{
			width: 340upx;
			margin-bottom: 20upx;
		}
	}
}
</style>
