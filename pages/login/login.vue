<template>
	<view class="loginPage" :class="{isH5:isH5}">
		<view class="head">
			<image class="logo" src="../../static/icon.png"  mode="widthFix"></image>
		</view>
		<view class="tab-bar">
			<view class="tab-item" v-for="(item,index) in tabHd" :key="index" @tap="tab(index)" :class="{active:tabActive==index}">{{item}}</view>
		</view>
		<view class="form">
			<label class="form-item" for="phone">
				<input class="input" id="phone" v-model="phone" type="digit" placeholder="请输入手机号" />
			</label>
			<label class="form-item" for="password" v-if="tabActive==0">
				<input class="input" id="password" v-model="password" :password="hidePassword" type="text" placeholder="请输入密码" />
				<view class="iconfont" :class="{'icon-look':!hidePassword,'icon-eye-close':hidePassword,}" @tap="ctrlPassword"></view>
			</label>
			<label class="form-item" for="code" v-if="tabActive==1">
				<input class="input" id="code" v-model="code" type="digit" placeholder="请输入验证码" />
				<button class="btn-code" @tap="getCode(phone)" v-if="sec==60">获取验证码</button>
				<button class="btn-code" v-else>{{sec}}s</button>
			</label>
			<view class="forget">
				<view class="btn-forget" v-if="tabActive==0" @tap="forget">忘记密码?</view>
			</view>
			<button class="btn-login" @tap="login">登录</button>
		</view>
	</view>
</template>

<script>
	import validate from '../../common/validate.js'
	export default {
		data() {
			return {
				isH5:false,
				tabHd:['密码登录','验证码登录'],
				tabActive:0,
				phone:'',
				password:'',
				code:'',
				hidePassword:true,
				isDisabled:true,
				sec:60, //倒计时60s
				clientId:'',
			};
		},
		onLoad() {
			// #ifdef H5
			this.isH5=true;
			// #endif
		},
		onShow() {
			// #ifdef APP-PLUS
			this.clientId=plus.push.getClientInfo().clientid;
			// #endif
		},
		onNavigationBarButtonTap() {
			uni.navigateTo({
				url:'../register/register'
			})
		},
		methods:{
			//切换登录方式
			tab(idx){
				this.tabActive=idx;
				this.code='';
				this.password='';
			},
			//是否显示密码
			ctrlPassword(){
				this.hidePassword=!this.hidePassword;
			},
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
			//登录
			login(){
				if(!validate.mobile(this.phone)){
					return;
				}
				if(this.tabActive==0 && !validate.password(this.password)){
					return;
				}
				if(this.tabActive==1 && !validate.code(this.code)){
					return;
				}
				var params;
				if(this.tabActive==0){
					params={
						phone:this.phone,
						password:this.password,
						client_id:this.clientId
					}
				}else{
					params={
						phone:this.phone,
						code:this.code,
						type:1,
						client_id:this.clientId
					}
				}
				this.$http.post({
					url:'/customer/login',
					data:params
				}).then(r=>{
					if(r.code==0){
						uni.setStorageSync('Jwt',r.data.Jwt);
						this.userInfo();
					}
				})
			},
			//获取用户信息
			userInfo(){
				this.$http.get({
					url:'/customer',
				}).then(r=>{
					if(r.code==0){
						uni.setStorageSync('userInfo',r.data);
						uni.switchTab({
							url:'../home/home'
						})
					}
				})
			},
			//忘记密码
			forget(){
				uni.navigateTo({
					url:"../resetPassword/resetPassword"
				})
			}
		}
	}
</script>

<style lang="scss">
.loginPage{
	// min-height: 100vh;
	background-color: #fff;
	&.isH5{
		// min-height: calc(100vh - var(--window-top));
	}
	.head{
		position: relative;
		width: 100%;
		overflow: hidden;
		.logo{
			display: block;
			width: 160upx;
			height: 160upx;
			border-radius: 100upx;
			margin: 80upx auto 40upx;
		}
	}
	.tab-bar{
		padding: 40upx 30upx;
		display: flex;
		justify-content: space-around;
		.tab-item{
			font-size: 28upx;
			color: #999;
			line-height: 2;
			position: relative;
			&.active{
				color: #333;
				&:after{
					content: "";
					display: block;
					width: 42upx;
					height: 6upx;
					border-radius: 6px;
					background-color:skyblue;
					margin: 0 auto;
				}
			}
		}
	}
	.form{
		padding: 0 30upx;
		.form-item{
			background-color: #f8f8f8;
			margin-bottom: 20upx;
			border-radius: 4px;
			display: flex;
			position: relative;
		}
		.input{
			flex: 1;
			min-width: 100upx;
			height: 48upx;
			padding: 20upx;
			box-sizing: content-box;
			color: #333;
			font-size: 28upx;
			line-height: 48upx;
		}
		.btn-code{
			font-size: 28upx;
			color: #333;
			line-height: 88upx;
			padding-left: 20upx;
			padding-right: 20upx;
		}
		.iconfont{
			color:#ccc;
			padding: 20upx;
		}
		.forget{
			overflow: hidden;
		}
		.btn-forget{
			float: right;
			color: #f00;
			font-size: 24upx;
			color: #999;
			line-height: 2;
		}
		.btn-login{
			height: 88upx;
			font-size: 32upx;
			line-height: 88upx;
			color: #fff;
			margin-top: 40upx;
			background-color: #0193fe;
			&[disabled]{
				background: #ccc;
			}
		}
	}
}
</style>
