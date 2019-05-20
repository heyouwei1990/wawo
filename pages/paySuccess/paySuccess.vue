<template>
	<view class="paySuccess">
		<view class="uni-icon uni-icon-checkbox-filled"></view>
		<view class="tip-msg">支付成功</view>
		<view class="desc"></view>
		<navigator class="btn-primary" open-type="switchTab" url="../home/home">返回首页</navigator>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">
.paySuccess{
	padding: 100upx 30upx;
	text-align: center;
	.uni-icon-checkbox-filled{
		font-size: 160upx;
		color: #48a7f9;
		line-height: 1;
	}
	.tip-msg{
		font-size: 40upx;
		color: #333;
		line-height: 2;
	}
	.btn-primary{
		width: 280upx;
		height: 90upx;
		line-height: 90upx;
		text-align: center;
		font-size: 32upx;
		margin: 60upx auto;
		border-radius: 4px;
	}
}
</style>
