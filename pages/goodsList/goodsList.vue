<template>
	<view class="goodsList">
		<scroll-view scroll-x class="tab-scroller" v-if="scrollHead.length">
			<view class="scroll-tab">
				<view class="item" :class="{on:scrollTabIndex==index}" v-for="(item,index) in scrollHead" :key="index" @tap="scrollTab(index)">{{item.name}}</view>
			</view>
		</scroll-view>
		<view class="list" v-if="goodsList.length">
			<block  v-for="(item,index) in goodsList" :key="index">
				<navigator class="goods-dl" :url="'../goodsDetail/goodsDetail?id='+item.id">
					<view class="goods-dt" >
						<image class="cover" lazy-load :src="item.thumbnail" mode="aspectFill"></image>
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
			</block>
		</view>
		<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more.vue';
	export default {
		data(){
			return{
				goodsList:[],
				scrollTabIndex:0,
				scrollHead:[],
				pageIndex:1,//页码
				pageSize:10,//每页数量
				totalPage:0,
				showLoadMore:false,
				loadMoreText: "上拉加载更多",
			}
		},
		//下拉刷新
		onPullDownRefresh() {
			this.pageIndex=1;
			this.totalPage=0;
			this.getPageList();
		},
		//加载更多
		onReachBottom(){
			this.loadmore();
		},
		onLoad() {
			this.init();
		},
		methods:{
			async init(){
				await this.$http.get({
					url:'/content/category',
					data:{
						type:1
					}
				}).then(r=>{
					if(r.code==0){
						this.scrollHead=r.data;
						this.scrollHead.unshift({name:'全部',id:''});
					}
				})
				//获取
				this.getPageList();
			},
			//分类切换
			scrollTab(index){
				this.scrollTabIndex=index;
				this.pageIndex=1;
				this.totalPage=0;
				this.goodsList=[];
				this.getPageList();
			},
			//数据加载
			getPageList(){
				this.showLoadMore=true;
				this.loadMoreText='加载中……';
				var sub=this.scrollHead[this.scrollTabIndex].id;
				this.getList(1,0,'',sub).then(r=>{
					if(r.code==0){
						if(this.pageIndex>1){
							this.goodsList=this.goodsList.concat(r.data.list);
						}else{
							this.goodsList=r.data.list;
						}
						this.totalPage=r.data.totalPage;
						this.pageIndex++;
						this.loadMoreText='上拉加载更多';
						if(r.data.list.length<this.pageSize){
							this.loadMoreText='没有更多数据了';
						}
						if(this.goodsList.length==0){
							this.loadMoreText='没有数据';
						}
					}
					uni.stopPullDownRefresh();
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
			//获取列表
			getList(type=1,popular,keyword='',sub){
				return new Promise((res,rej)=>{
					this.$http.get({
						url:'/content/get',
						data:{
							type:type,
							keyword:keyword,
							popular:popular,
							sub:sub,
							page:this.pageIndex,
							size:this.pageSize
						}
					}).then(r=>{
						res(r);
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.goodsList {
		overflow: hidden;
		padding-top: 90upx;
		.tab-scroller{
			position: fixed;
			left: 0;
			top: var(--window-top);
			z-index: 9;
			height: 90upx;
			background-color: #fff;
			// border-bottom: 1upx solid #ddd;
			.scroll-tab{
				position: relative;
				height: 90upx;
				white-space: nowrap;
				&:after{
					content: "";
					position: absolute;
					left: 0;
					bottom: 0;
					width: 100%;
					height: 1upx;
					transform:scaleY(0.5);
					background-color: #ddd;
				}
				.item{
					display: inline-block;
					padding: 0 30upx;
					height: 90upx;
					line-height: 90upx;
					font-size: 28upx;
					color: #333;
					text-align: center;
					&.on{
						color: #48A7F9;
						position: relative;
						&:after{
							content: "";
							padding: 0 30upx;
							box-sizing: border-box;
							position: absolute;
							left: 0;
							bottom: 0;
							z-index: 2;
							width: 100%;
							height: 6upx;
							background-color: #48A7F9;
							background-clip: content-box;
						}
					}
				}
			}
		}
	}
</style>
