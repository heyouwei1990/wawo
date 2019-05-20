<template>
	<view class="resetPassword">
		<label for="phone" class="uni-form-item">
			<input class="uni-input" v-model="phone" type="number" id="phone" placeholder="请输入手机号" />
		</label>
		<label for="code" class="uni-form-item">
			<input class="uni-input" v-model="code" type="number" id="code" placeholder="请输入验证码" />
			<button class="btn-code" type="text" @tap="getCode(phone)" v-if="sec==60">获取验证码</button>
			<button class="btn-code" v-else>{{sec}}s</button>
		</label>
		<view class="uni-form-item">
			<input v-model="password" class="uni-input" type="text" :maxlength="20" :password="hidePassword" placeholder="请输入您的新登录密码" />
			<view class="iconfont" :class="{'icon-look':!hidePassword,'icon-eye-close':hidePassword,}" @tap="ctrlPassword"></view>
		</view>
		<view class="uni-form-item">
			<input v-model="password2" class="uni-input" type="text" :maxlength="20" :password="hidePassword2" placeholder="请再次输入您的新登录密码" />
			<view class="iconfont" :class="{'icon-look':!hidePassword2,'icon-eye-close':hidePassword2,}" @tap="ctrlPassword2"></view>
		</view>
		<button class="btn-primary" @tap="submit">提交</button>
	</view>
</template>

<script>
	import validate from '../../common/validate.js'
	export default {
		data() {
			return {
				password:'',
				password2:'',
				phone:'',
				code:'',
				sec:60, //倒计时60s
				hidePassword:true,
				hidePassword2:true,
				type:1,//1忘记密码，2重置密码
			};
		},
		async onShow(){
			var token= await uni.getStorageSync('Jwt');
			this.type=!token?1:2
		},
		methods:{
			//获取验证码
			getCode(phone){
				if(!validate.mobile(phone)){
					return;
				}
				this.$http.get({
					url:'/customer/sendCode',
					data:{
						phone:phone
					}
				}).then(r=>{
					if(r.code==0){
						uni.showToast({
							title:'验证码已发送！'
						})
						this.countdown();
					}
				})
			},
			//密码显示、隐藏
			ctrlPassword(){
				this.hidePassword=!this.hidePassword;
			},
			//确认密码显示、隐藏
			ctrlPassword2(){
				this.hidePassword2=!this.hidePassword2;
			},
			//倒计时
			countdown(){
				let timer=setInterval(()=>{
					this.sec--;
					if(this.sec==0){
						clearInterval(timer);
						this.sec=60;
					}
				},1000)
			},
			submit(){
				if(!validate.mobile(this.phone) || 
				!validate.code(this.code) || 
				!validate.password(this.password)){
					return;
				}
				if(this.password!==this.password2){
					uni.showToast({
						title:'密码不一致，请确认密码',
						icon:'none'
					})
					return;
				}
				var url='/customer/updatePassword';
				if(this.type==1){
					url='/customer/resetPassword'
				}
				this.$http.post({
					url:url,
					data:{
						phone:this.phone,
						code:this.code,
						password:this.password,
					}
				}).then(r=>{
					if(r.code==0){
						uni.showToast({
							title:'重置密码成功!'
						});
						uni.redirectTo({
							url:'../login/login'
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss">
.resetPassword{
	background-color: #fff;
	min-height: 100vh;
	.uni-form-item{
		display: flex;
		align-items: center;
		width: 100%;
		background-color: #fff;
		padding: 0;
		border-bottom: 1upx solid #ddd;
	}
	.uni-input{
		box-sizing: content-box;
		height: 48upx;
		line-height: 48upx;
		flex: 1;
		padding: 16upx 25upx;
		font-size: 28upx;
		color: #333;
	}
	.btn-code{
		padding-right: 30upx;
		padding-left: 30upx;
		font-size: 14px;
		color: #00a0ff;
		height: 80upx;
		line-height: 80upx;
		min-width: 200upx;
		text-align: center;
		background-color: #fff;
		border-radius: 0;
		// background-color: $color_primary;
	}
	.iconfont{
		color: #ccc;
		padding:16upx 20upx;
	}
	.btn-code[disabled]{
		background-color: #ccc;
	}
	.btn-primary{
		margin:60upx 30upx;
	}
}
</style>
