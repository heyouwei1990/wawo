<template>
	<view class="realName">
		<view class="form-item">
			<view class="label">姓名</view>
			<input type="text" class="input" v-model="fullname" placeholder="请输入姓名"/>
		</view>
		<view class="form-item">
			<view class="label">身份证号</view>
			<input type="idcard" class="input" v-model="idNo" placeholder="请输入身份证号码"/>
		</view>
		<view class="btn-group">
			<button class="btn-primary" @tap="submit">提交</button>
		</view>
	</view>
</template>

<script>
	import validate from '../../common/validate.js'
	export default {
		data() {
			return {
				fullname:'',
				idNo:''
			};
		},
		methods:{
			submit(){
				if(this.fullname==''){
					uni.showToast({
						title:'请输入真实姓名',
						icon:'none'
					})
					return;
				}
				
				if(!validate.fullName(this.fullname) || !validate.idCard(this.idNo)){
					return;
				}
				
			}
		}
	}
</script>

<style lang="scss">
.realName{
	.form-item{
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1upx solid #ddd;
		padding:0upx 30upx;
		.label{
			min-width: 120upx;
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
		}
		.input{
			flex: 1;
			height: 88upx;
			font-size: 28upx;
			color: #333;
			line-height: 88upx;
		}
	}
	.btn-group{
		padding:60upx 30upx;
		
	}
}
</style>
