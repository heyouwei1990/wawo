<template>
	<view class="signIn">
		<view class="sec-hd">
			<view class="title">用户信息</view>
		</view>
		<view class="info-list">
			<view class="li">
				<view class="label">姓名：</view>
				<view class="val"></view>
			</view>
			<view class="li">
				<view class="label">手机号：</view>
				<view class="val"></view>
			</view>
			<view class="li">
				<view class="label">上课类型：</view>
				<view class="val"></view>
			</view>
			<view class="li">
				<view class="label">上课次数：</view>
				<view class="val"></view>
			</view>
		</view>
		<view class="divide"></view>
		<view class="sec-hd">
			<view class="title">课程信息</view>
		</view>
		<view class="info-list">
			<view class="li">
				<view class="label">课程标题：</view>
				<view class="val"></view>
			</view>
			<view class="li">
				<view class="label">课程时间：</view>
				<view class="val"></view>
			</view>
			<view class="li">
				<view class="label">课程地点：</view>
				<view class="val"></view>
			</view>
			<view class="li">
				<view class="label">签到状态：</view>
				<view class="val"></view>
			</view>
			<view class="li">
				<view class="label">签到时间：</view>
				<view class="val"></view>
			</view>
		</view>
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
.signIn{
	.sec-hd{
		display: flex;
		align-items: center;
		height: 80upx;
		background-color: #fff;
		border-bottom: 1upx solid #ddd;
		padding: 0 30upx;
		.title{
			flex: 1;
			font-size: 32upx;
			color: #333;
			line-height: 1.5;
		}
	}
	.info-list{
		padding: 20upx 30upx;
		background-color: #fff;
		.li{
			display: flex;
			margin-bottom: 10upx;
			font-size: 24upx;
			color: #999;
			line-height: 1.5;
		}
		.val{
			flex: 1;
		}
	}
}
</style>
