<template>
	<view class="messagePage">
		<view class="fixed-tab">
			<view class="tab-item" :id="'tabItem'+index" @tap="tabChange(index)" :class="{active:tabIndex==index}" v-for="(item,index) in tabItems" :key="index">{{item}}</view>
			<view class="active-bar" ref="bar" :style="{'width':barWidth,'left':barLeft}"></view>
		</view>
		<view class="scroller">
			<block v-if="msgList" v-for="(item,index) in msgList" :key="index">
				<view class="msg-item" @tap="look(item)">
					<view class="iconfont" :class="{'icon-email':item.readed==0,'icon-email-opened':item.readed==1}"></view>
					<view class="dd">
						<view class="title">{{item.content}}</view>
						<view class="time">{{item.c_time}}</view>
					</view>
				</view>
			</block>
			<view class="uni-loadmore" v-if="showLoadMore">{{loadMoreText}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tabItems:['个人消息','系统消息'],
				tabIndex:0,
				type:2,//个人消息，1:系统消息
				barWidth:'112upx',
				barLeft:'146upx',
				msgList:[],
				showLoadMore:false,
				pageIndex:1,//页码
				pageSize:10,//每页数量
				totalPage:-1,
				loadMoreText: "加载中...",
			};
		},
		//加载更多
		onReachBottom(){
			this.loadmore();
		},
		onShow(){
			this.init();
			uni.hideTabBarRedDot({
				index:4
			})
			uni.setStorageSync('dot',0);
		},
		methods: {
			init(){
				this.showLoadMore=true;
				this.loadMoreText= "加载中...";
				this.$http.get({
					url:'/my/findMsg',
					data:{
						page:this.pageIndex,
						size:this.pageSize,
						type:this.type
					}
				}).then(r=>{
					if(r.code==0){
						if(this.pageIndex>1){
							this.msgList=this.msgList.concat(r.data.list);
						}else{
							this.msgList=r.data.list;
						}
						this.totalPage=r.data.totalPage;
						this.pageIndex++;
						this.loadMoreText='上拉加载更多';
						if(this.msgList.length==0){
							this.loadMoreText='没有消息';
						}
						if(r.data.list.length<this.pageSize){
							this.loadMoreText='没有更多消息了';
						}
					}
				})
			},
			//tab切换
			tabChange(index){
				this.msgList=[];
				this.tabIndex=index;
				if(this.tabIndex==1){
					this.type=1;
				}else{
					this.type=2;
				}
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
					this.loadMoreText='没有更多消息了';
					return;
				}
			},
			look(item){
				if(this.tabIndex==0 && item.role==1){
					uni.navigateTo({
						url:'../friendMsg/friendMsg?id='+item.id
					})
				}
			}
		},
	}
</script>

<style lang="scss">
.messagePage{
	overflow: hidden;
	.fixed-tab{
		position: fixed;
		left: 0;
		top: var(--window-top);
		z-index: 9;
		height: 90upx;
		padding: 0 30upx;
		width: 100vw;
		border-bottom: 1upx solid #ddd;
		background-color: #fff;
		display: flex;
		justify-content: space-around;
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
			left: 146upx;
			bottom: 0;
			z-index: 2;
			width: 112upx;
			height: 4upx;
			background-color: #48a7f9;
			transition: all 0.2s linear;
		}
	}
	.scroller{
		margin-top: 90upx;
	}
	.msg-item{
		display: flex;
		width: 100%;
		align-items: center;
		background-color: #fff;
		border-bottom: 1upx solid #ddd;
		padding: 20upx 30upx;
		.iconfont{
			font-size: 40upx;
			color: #999;
			margin-right: 30upx;
		}
		.icon-email{
			color: #48a7f9;
		}
		.dd{
			flex: 1;
		}
		.title{
			font-size: 28upx;
			color: #333;
			line-height: 1.2;
			margin-bottom: 12upx;
		}
		.time{
			font-size: 24upx;
			color: #999;
			line-height: 1.2;
		}
	}
}
</style>
