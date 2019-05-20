<template>
	<view class="incomePage">
		<view class="head" v-if="wallet">
			<view class="account">
				<view class="label">余额</view>
				<view class="value">{{wallet.balance}}</view>
			</view>
			<view class="info">
				<view class="item">
					<view class="label">已冻结</view>
					<view class="val">¥{{wallet.freeze_withdraw}}</view>
				</view>
				<view class="item">
					<view class="label">已提现</view>
					<view class="val">¥{{wallet.withdrawed}}</view>
				</view>
				<view class="item">
					<view class="label">总计金额</view>
					<view class="val">¥{{wallet.total_revenue}}</view>
				</view>
			</view>
		</view>
		<view class="title">收益明细</view>
		<view class="list">
			<view class="cell" v-for="(item,index) in incomeList" :key="index">
				<image src="../../static/icon.png" class="icon"></image>
				<view class="dd">
					<view class="row">
						<view class="type">{{item.type_name}}</view>
						<view class="val">¥{{item.amount}}</view>
					</view>
					<view class="time">{{item.c_time}}</view>
				</view>
			</view>
		</view>
		<view class="fixed-bottom">
			<button class="btn-primary" @tap="withdraw">提现</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				wallet:'',
				incomeList:[]
			};
		},
		onLoad() {
			this.init();
		},
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url:'../withdrawList/withdrawList'
			})
		},
		methods:{
			init(){
				this.$http.get({
					url:'/my/getMyEarnings',
				}).then(r=>{
					console.log(r)
					if(r.code==0){
						this.wallet=r.data.customerWallet;
						this.incomeList=r.data.moneyStreams.list;
					}
				})
			},
			withdraw(){
				uni.navigateTo({
					url:"../withdraw/withdraw"
				})
			}
		}
	}
</script>

<style lang="scss">
.incomePage{
	padding-bottom: 100upx;
	.head{
		position: relative;
	background-color: #0193fe;
		.account{
			padding: 60upx 30upx;
			text-align: center;
			.label{
				font-size: 28upx;
				color: #fff;
				line-height: 2;
			}
			.value{
				font-size: 40upx;
				color: #fff;
				line-height: 1.5;
			}
		}
		.info{
			display: flex;
			justify-content: space-between;
			padding: 10upx 30upx;
			align-items: center;
			.item{
				text-align: center;
			}
			.label{
				font-size: 24upx;
				color: #fff;
				line-height: 1.5;
			}
			.val{
				font-size: 24upx;
				color: #fff;
				line-height: 1.5;
			}
		}
	}
	.title{
		height: 88upx;
		padding: 20upx 30upx;
		background-color: #fff;
		font-size: 28upx;
		color: #333;
		line-height: 48upx;
		border-bottom: 1upx solid #ddd;
	}
	.list{
		.cell{
			position: relative;
			display: flex;
			align-items: center;
			padding: 20upx 30upx;
			background-color: #fff;
			border-bottom: 1upx solid #ddd;
			/* &:after{
				content: "";
				position: absolute;
				left: 0;
				bottom: 0;
				width: 100%;
				height: 1upx;
				background-color: #ddd;
				box-sizing: border-box;
				background-clip: content-box;
				padding-left: 30upx;
			} */
			.icon{
				width: 80upx;
				height: 80upx;
				background-color: #f8f8f8;
			}
			.dd{
				flex: 1;
				margin-left: 20upx;
			}
			.row{
				display: flex;
				align-items: center;
				justify-content: space-between;
				margin-bottom: 10upx;
			}
			.type{
				font-size: 28upx;
				color: #333;
				line-height: 1.5;
			}
			.val{
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
}
</style>
