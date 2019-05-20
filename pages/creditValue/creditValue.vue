<template>
	<view class="creditValue">
		<view class="credit">
			<view class="label">信用值</view>
			<view class="value">{{credit}}</view>
		</view>
		
		<view class="list" v-if="list.length">
			<view class="cell" v-for="(item,index) in list" :key="index">
				<image src="../../static/icon.png" class="icon"></image>
				<view class="dd">
					<view class="row1">
						<view class="value">信用值{{item.score}}</view>
						<view class="time">{{item.c_time}}</view>
					</view>
					<view class="desc">内容：{{item.content}}</view>
				</view>
			</view>
			<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
		</view>
		
		
		<!-- <view class="sec-hd">
			<view class="title">兑换课程</view>
		</view>
		<view class="list">
			<view class="lesson-dl" v-for="(item,index) in 3" :key="index">
				<view class="dt">
					<image class="cover"></image>
				</view>
				<view class="dd">
					<view class="row1">
						<view class="title">标题</view>
						<view class="registered">2598人已报名</view>
					</view>
					<view class="row2">简介</view>
					<view class="row3">开课时间：</view>
					<view class="row4">开课地点：</view>
				</view>
			</view>
		</view>
		<view class="divide"></view>
		<view class="sec-hd">
			<view class="title">兑换文章</view>
		</view>
		<view class="list">
			<view class="lesson-dl" v-for="(item,index) in 3" :key="index">
				<view class="dt">
					<image class="cover"></image>
				</view>
				<view class="dd">
					<view class="row1">
						<view class="title">标题</view>
						<view class="registered">2598人已报名</view>
					</view>
					<view class="row2">简介</view>
					<view class="row3">开课时间：</view>
					<view class="row4">开课地点：</view>
				</view>
			</view>
		</view>
		<view class="divide"></view>
		<view class="sec-hd">
			<view class="title">兑换秘籍</view>
		</view>
		<view class="list">
			<view class="lesson-dl" v-for="(item,index) in 3" :key="index">
				<view class="dt">
					<image class="cover"></image>
				</view>
				<view class="dd">
					<view class="row1">
						<view class="title">标题</view>
						<view class="registered">2598人已报名</view>
					</view>
					<view class="row2">简介</view>
					<view class="row3">开课时间：</view>
					<view class="row4">开课地点：</view>
				</view>
			</view>
		</view>
		<view class="divide"></view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				credit:'',
				list:[],
				pageIndex:1,
				pageSize:10,
				totalPage:0,
				showLoadMore:false,
				loadMoreText: "上拉加载更多",
			};
		},
		onLoad() {
			this.init()
		},
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url:'../creditDetail/creditDetail'
			})
		},
		onReachBottom() {
			this.loadmore();
		},
		methods: {
			init(){
				this.$http.get({
					url:'/customer',
				}).then(r=>{
					if(r.code==0){
						uni.setStorageSync('userInfo',r.data);
						this.credit=r.data.total_score;
					}
				})
				this.getList();
			},
			getList(){
				this.showLoadMore=true;
				this.loadMoreText='加载中';
				this.$http.get({
					url:'/score/getDetailList',
					data:{
						page:this.pageIndex,
						size:this.pageSize
					}
				}).then(r=>{
					if(r.code==0){
						if(this.pageIndex>1){
							this.list=this.list.concat(r.data.list);
						}else{
							this.list=r.data.list;
						}
						this.totalPage=r.data.totalPage;
						this.pageIndex++;
						this.loadMoreText='上拉加载更多';
						if(r.data.list.length<this.pageSize){
							this.loadMoreText='没有更多数据了';
						}
						if(this.list.length==0){
							this.loadMoreText='没有数据';
						}
					}
				})
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
		},
	}
</script>

<style lang="scss">
.creditValue{
	.credit{
		background-color: #0193fe;
		padding: 100upx 30upx;
		text-align: center;
		.label{
			font-size: 32upx;
			color: #fff;
			line-height: 2;
		}
		.value{
			font-size: 40upx;
			color: #fff;
			font-weight: 500;
			font-family: Arial, Helvetica, sans-serif;
			line-height: 2;
		}
	}
	.sec-hd{
		display: flex;
		align-items: center;
		border-bottom: 1upx solid #ddd;
		background-color: #fff;
		height: 88upx;
		font-size: 32upx;
		color: #333;
	}
	.lesson-dl{
		position: relative;
		display: flex;
		align-items: center;
		padding: 20upx 30upx;
		background-color: #fff;
		&:after{
			content:'';
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 1upx;
			background-color: #ddd;
		}
		.dt{
			width: 200upx;
			height: 200upx;
		}
		.cover{
			width: 100%;
			height: 100%;
			display: block;
			background-color: #f8f8f8;
		}
		.dd{
			flex: 1;
			margin-left: 20upx;
			height: 200upx;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
		}
		.title{
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
			flex: 1;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			min-width: 100upx;
		}
		.registered{
			font-size: 24upx;
			color: #999;
			line-height: 1.5;
		}
		.row1{
			display: flex;
			width: 100%;
			align-items: center;
			justify-content: space-between;
		}
		.row2,.row3,.row4{
			font-size: 24upx;
			color: #666;
			line-height: 1.5;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
	}
	.cell{
		padding: 20upx 30upx;
		display: flex;
		align-items: center;
		background-color: #fff;
		border-bottom: 1upx solid #ddd;
		.icon{
			width: 60upx;
			height: 60upx;
		}
		.dd{
			flex: 1;
			margin-left: 20upx;
			min-width: 200upx;
		}
		.row1{
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		.value{
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
		}
		.time{
			font-size: 24upx;
			color: #999;
			line-height: 1.5;
		}
		.desc{
			font-size: 24upx;
			color: #666;
			line-height: 1.5;
			margin-top: 20upx;
		}
	}
}
</style>
