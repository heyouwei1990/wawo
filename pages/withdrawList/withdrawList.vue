<template>
	<view class="withdrawList">
		<view class="notice">实际到账金额将会扣除X%手续费和税费</view>
		<view class="list">
			<view class="cell" v-for="(item,index) in withdrawList" :key="index">
				<view class="icon"></view>
				<view class="dd">
					<view class="row1">
						<view class="name">提现人：{{item.proposer}}</view>
						<!-- <view class="phone">{{item.proposer}}</view> -->
						<view class="status">{{item.status_text}}</view>
					</view>
					<view class="row2">
						<view class="count">提现金额：¥{{item.withdraw_price}}</view>
						<view class="time">{{item.c_time}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				withdrawList:[]
			};
		},
		onLoad() {
			this.init();
		},
		methods:{
			init(){
				this.$http.get({
					url:'/my/getWithdrawDetails',
				}).then(r=>{
					if(r.code==0){
						this.withdrawList=r.data;
					}
				})
			}
		}
		
	}
</script>

<style lang="scss">
.withdrawList{
	overflow: hidden;
	padding-top: 88upx;
	.notice{
		position: fixed;
		left: 0;
		top: var(--window-top);
		width: 100%;
		height: 88upx;
		padding: 20upx 30upx;
		line-height: 48upx;
		font-size: 24upx;
		color: #faa;
		background-color: #fff;
		border-bottom: 1upx solid #ddd;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.list{
		.cell{
			display: flex;
			align-items: center;
			padding: 20upx 30upx;
			background-color: #fff;
			border-bottom: 1upx solid #ddd;
		}
		.dd{
			flex: 1;
			margin-left: 20upx;
		}
		.row1{
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		.name{
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
		}
		.phone{
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
			margin-left: 20upx;
		}
		.status{
			font-size: 24upx;
			color: #999;
			line-height: 1.5;
		}
		.row2{
			display: flex;
			align-items: center;
			margin-top: 10upx;
			justify-content: space-between;
		}
		.count{
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
		}
		.time{
			font-size: 24upx;
			color: #999;
			line-height: 1.5;
		}
	}
}
</style>
