<template>
	<view class="addFriend">
		<view class="search-wrap">
			<view class="uni-icon uni-icon-search"></view>
			<input class="search" v-model="phone" @confirm="search" type="search" placeholder="搜索" />
			<button class="btn-search" @tap="search">搜索</button>
		</view>
		<view class="search-result" v-if="user">
			<image class="avatar" :src="user.avatar" mode="aspectFill"></image>
			<view class="nickname">{{user.costomer_name}}</view>
			<view class="phone">{{user.phone}}</view>
			<view class="btn-group">
				<!-- <navigator class="btn-primary" :url="'../transfer/transfer?id='+user.id">转账</navigator> -->
				<button class="btn-primary" @tap="transfer">转账</button>
				<button class="btn-primary" @tap="addFriend(user.id)">加好友</button>
			</view>
		</view>
	</view>
</template>

<script>
	import validate from '../../common/validate.js'
	export default {
		data() {
			return {
				phone:'',
				user:''
			};
		},
		onLoad() {
			var data=uni.getStorageSync('scanData');
			if(data && data.id){
				this.user=data;
				uni.removeStorageSync('scanData');
			}
		},
		methods:{
			search(){
				if(!validate.mobile(this.phone)){
					return;
				}
				this.$http.get({
					url:'/my/getByPhone',
					data:{
						phone :this.phone
					}
				}).then(r=>{
					if(r.code==0){
						this.user=r.data;
					}
				})
			},
			transfer(){
				if(this.user.is_friend){
					uni.navigateTo({
						url:'../transfer/transfer?id='+this.user.id
					})
				}else{
					uni.showToast({
						title:'成为好友才能转账！',
						icon:'none'
					})
				}
			},
			addFriend(id){
				this.$http.get({
					url:'/my/addFriend',
					data:{
						friend_id :id
					}
				}).then(r=>{
					if(r.code==0){
						uni.showToast({
							title:'申请成功'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.addFriend{
	background-color: #fff;
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
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
	.search-result{
		text-align: center;
		padding: 40upx 60upx;
		.avatar{
			display: block;
			width: 200upx;
			height: 200upx;
			border-radius: 50%;
			background-color: #f8f8f8;
			margin: 30upx auto;
		}
		.nickname{
			font-size: 28upx;
			color: #333;
			line-height: 2;
		}
		.phone{
			font-size: 28upx;
			color: #333;
			line-height: 2;
		}
		.btn-group{
			display: flex;
			align-items: center;
			justify-content: space-around;
			margin-top: 40upx;
			.btn-primary{
				width: 200upx;
				height: 80upx;
				line-height: 80upx;
				text-align: center;
				border-radius: 4px;
				background-color: #48a7f9;
				font-size: 32upx;
				color: #fff;
			}
		}
	}
}
</style>
