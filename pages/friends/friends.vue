<template>
	<view class="friendsList">
		<view class="search-wrap">
			<view class="uni-icon uni-icon-search"></view>
			<input class="search" v-model="key" @confirm="search" type="search" placeholder="搜索" />
			<button class="btn-search" @tap="search">搜索</button>
		</view>
		<view class="title"></view>
		<view class="list" v-if="friendsList.length">
			<navigator class="user-cell" v-for="(item,index) in friendsList" :key="index" :url="'../transfer/transfer?id='+item.id">
				<image class="avatar" :src="item.avatar" mode="aspectFill"></image>
				<view class="dd">
					<view class="nickname">{{item.customer_name}}</view>
					<view class="phone">{{item.phone}}</view>
				</view>
			</navigator>
		</view>
		<view class="empty" v-if="empty">您还没有好友，快去添加好友吧</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				key:'',
				friendsList:[],
				empty:false,
			};
		},
		onNavigationBarButtonTap(option) {
			if(option.index===0){
				uni.navigateTo({
					url:'../addFriend/addFriend'
				})
			}else{
				uni.navigateTo({
					url:'../addFriend/addFriend'
				})
			}
		},
		onLoad() {
			this.init();
		},
		methods:{
			search(){
				if(this.key===''){
					return;
				}
				this.init();
			},
			init(){
				this.$http.get({
					url:'/my/getFriendList',
					data:{
						customer_name:this.key
					}
				}).then(r=>{
					if(r.code==0){
						this.friendsList=r.data;
						if(this.friendsList.length==0){
							if(this.key){
								uni.showToast({
									title:'Ta还不是您的好友',
									icon:'none'
								})
							}else{
								this.empty=true;
							}
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.friendsList{
	.search-wrap{
		position: fixed;
		left: 0;
		top:0;
		z-index: 9;
		width: 100%;
		height: 100upx;
		background-color: #fff;
		border-top: 1upx solid #ddd;
		border-bottom: 1upx solid #ddd;
		padding: 14upx 30upx;
		position: relative;
		display: flex;
		align-items: center;
		.uni-icon-search{
			position: absolute;
			left: 40upx;
			top: 50%;
			z-index: 2;
			transform: translateY(-50%);
			font-size: 40upx;
			color: #999;
		}
		.search{
			background-color: #ececec;
			border-radius:4px;
			height: 70upx;
			line-height: 70upx;
			padding-left: 60upx;
			padding-right: 20upx;
			font-size: 28upx;
			color: #333;
			flex: 1;
		}
		.btn-search{
			width: 100upx;
			height: 70upx;
			background-color: #48a7f9;
			border-radius: 4px;
			text-align: center;
			line-height: 70upx;
			font-size: 28upx;
			color:#fff;
			margin-left: 20upx;
		}
	}
	.empty{
		padding:20upx 30upx;
		text-align: center;
		font-size: 28upx;
		line-height: 1.5;
		color:#999;
	}
	.user-cell{
		position: relative;
		display: flex;
		align-items: center;
		padding: 20upx 30upx;
		background-color: #fff;
		&:after{
			content: "";
			position: absolute;
			left: 0;
			bottom: 0;
			z-index: 2;
			width: 100%;
			height: 1upx;
			padding: 0 30upx;
			box-sizing: border-box;
			background-color: #ddd;
			background-clip: content-box;
		}
		&:last-child:after{
			display: none;
		}
		.avatar{
			width: 120upx;
			height: 120upx;
			border-radius: 50%;
			background-color: #eae;
		}
		.dd{
			flex: 1;
			min-width: 200upx;
			margin-left: 30upx;
		}
		.nickname{
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
			margin-bottom: 20upx;
		}
		.phone{
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
		}
	}
}
</style>
