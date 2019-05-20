<template>
	<view class="friendMsg" v-if="info">
		<view class="userinfo">
			<image class="avatar" :src="info.avatar" mode="aspectFill"></image>
			<view class="nickname">{{info.customer_name}}</view>
			<view class="phone">{{info.phone}}</view>
		</view>
		<view class="msg">{{info.customer_name}} 请求添加你为好友</view>
		<block v-if="!info.status">
			<view class="textarea-box">
				<textarea class="textarea" v-model="leaveMsg" placeholder="如果拒绝,请输入理由" />
			</view>
			<view class="btn-group">
				<button class="btn-default" @tap="reject">拒绝</button>
				<button class="btn-primary" @tap="pass">同意</button>
			</view>
		</block>
		<view class="status" v-if="info.status==1">你们已经是好友了</view>
		<view class="status" v-if="info.status==2">您拒绝了Ta的请求</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				msgId:'',
				leaveMsg:'',
				info:'',
			};
		},
		onLoad(option) {
			this.msgId=option.id;
			this.init();
		},
		methods:{
			//初始化
			init(){
				this.$http.get({
					url:'/my/findMsgById',
					data:{
						id:this.msgId
					}
				}).then(r=>{
					if(r.code==0){
						this.info=r.data;
					}
				})
			},
			//同意
			pass(){
				this.$http.get({
					url:'/my/passFriend',
					data:{
						proposer_id:this.info.proposer_id
					}
				}).then(r=>{
					if(r.code==0){
						uni.showToast({
							title: '通过好友请求',
						});
						uni.navigateBack({
							delta:1
						})
					}
				})
			},
			//拒绝
			reject(){
				this.$http.get({
					url:'/my/rejectFriend',
					data:{
						proposer_id :this.info.proposer_id,
						remark:this.leaveMsg
					}
				}).then(r=>{
					if(r.code==0){
						uni.showToast({
							title: '拒绝了请求',
						});
						uni.navigateBack({
							delta:1
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.friendMsg{
	height: 100%;
	width: 100%;
	position: absolute;
	left: 0;
	top: 0;
	background-color: #fff;
	.userinfo{
		padding: 100upx 30upx 20upx;
		text-align: center;
		.avatar{
			width: 200upx;
			height: 200upx;
			border-radius: 50%;
			background-color: #f8f8f8;
		}
		.nickname{
			font-size: 32upx;
			color: #333;
			line-height: 2;
			margin-top: 10upx;
		}
		.phone{
			font-size: 28upx;
			color: #666;
			line-height: 2;
		}
	}
	.msg{
		padding: 20upx 30upx;
		font-size: 28upx;
		color: #333;
		line-height: 1.5;
		text-align: center;
	}
	.textarea-box{
		padding: 20upx 30upx;
		.textarea{
			width: 100%;
			height: 100upx;
			border: 1upx solid #ddd;
			padding: 10upx;
			font-size: 28upx;
			color: #333;
			line-height: 1.2;
			border-radius: 4px;
		}
	}
	.status{
		text-align: center;
		font-size: 28upx;
		color: #999;
		padding: 20upx 30upx;
	}
	.btn-group{
		display: flex;
		align-items: center;
		justify-content: space-around;
		padding: 20upx 30upx;
		margin-top: 30upx;
		.btn-default{
			width: 240upx;
			height: 88upx;
			line-height: 88upx;
			padding: 0;
			border: 1upx solid #48a7f9;
			font-size: 32upx;
			color: #48a7f9;
		}
		.btn-primary{
			width: 240upx;
			height: 88upx;
			line-height: 88upx;
			padding: 0;
			font-size: 32upx;
		}
	}
}
</style>
