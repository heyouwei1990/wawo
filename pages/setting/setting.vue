<template>
	<view class="settingPage">
		<view class="list">
			<navigator class="cell icon-link" url="../resetPassword/resetPassword">
				<view class="label">修改登录密码</view>
			</navigator>
			<navigator class="cell icon-link" url="../setPayPassword/setPayPassword">
				<view class="label">修改转账密码</view>
			</navigator>
			<view class="cell icon-link">
				<view class="label">清除缓存</view>
			</view>
			<navigator class="cell icon-link" url="../updateApp/updateApp">
				<view class="label">版本更新</view>
				<view class="val">当前版本v{{version}}</view>
			</navigator>
		</view>
		<view class="fixed-bottom">
			<button class="btn-primary" @tap="exit">退出当前账号</button>
		</view>
	</view>
</template>

<script>
	import config from '../../common/config.js'
	export default {
		data() {
			return {
				version:config.version.number
			};
		},
		methods:{
			exit(){
				uni.showModal({
					title: '提示',
					content: '确认退出登录？',
					showCancel: true,
					success: res => {
						if(res.confirm){
							uni.removeStorageSync('userInfo');
							uni.removeStorageSync('Jwt');
							uni.redirectTo({
								url:'../login/login'
							})
						}
					},
					fail: () => {},
					complete: () => {}
				});
			}
		}
	}
</script>

<style lang="scss">
.settingPage{
	.list{
		.cell{
			background-color: #fff;
			padding: 20upx 50upx 20upx 30upx;
			display: flex;
			align-items: center;
			min-height: 88upx;
			border-bottom: 1upx solid #ddd;
			justify-content: space-between;
			&:after{
				right: 20upx;
			}
			.label{
				color: #333;
				font-size: 28upx;
				line-height: 1.5;
			}
			.val{
				color: #999;
				font-size: 24upx;
				line-height: 1.5;
			}
		}
	}
	
}
</style>
