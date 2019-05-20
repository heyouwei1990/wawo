<template>
	<view class="payPassword">
		<view class="uni-mask" v-show="show" :style="{top:offsetTop + 'px'}" ></view>
		<view :class="['uni-popup','uni-popup-bottom',{active:show}]" v-show="visible">
			<view class="password-popup">
				<view class="iconfont icon-close" @tap="hide"></view>
				<view class="text-box">
					<view class="item-char" v-for="(item,i) in 6" :key="i">
						<view class="item-char__dot" v-if="password[i] || password[i] === 0"></view>
					</view>
				</view>
				<view class="forget" @tap="forget">忘记密码</view>
				<view class="keyboard-content mt-10">
					<view class="table">
						<view class="row">
							<view class="btn" @tap="inputPwd($event)" data-char="1">1</view>
							<view class="btn" @tap="inputPwd($event)" data-char="2">2</view>
							<view class="btn" @tap="inputPwd($event)" data-char="3">3</view>
						</view>
						<view class="row">
							<view class="btn" @tap="inputPwd($event)" data-char="4">4</view>
							<view class="btn" @tap="inputPwd($event)" data-char="5">5</view>
							<view class="btn" @tap="inputPwd($event)" data-char="6">6</view>
						</view>
						<view class="row">
							<view class="btn" @tap="inputPwd($event)" data-char="7">7</view>
							<view class="btn" @tap="inputPwd($event)" data-char="8">8</view>
							<view class="btn" @tap="inputPwd($event)" data-char="9">9</view>
						</view>
						<view class="row">
							<view class="btn"></view>
							<view class="btn" @tap="inputPwd($event)" data-char="0">0</view>
							<view class="btn backspace" hover-class="cell-active" @tap="backspace">
								<view class="iconfont icon-backspace"></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			let offsetTop = 0;
			//#ifdef H5
			offsetTop = 44;
			//#endif
			return {
				offsetTop: offsetTop,//header高度
				payList: [],//支付方式
				checked: 0,//默认支付方式
				visible:false,
				items:[0,1,2,3,4,5],
				password:[],
			};
		},
		props: {
			show: {
				type: Boolean,
				default: false
			},
		},
		watch:{
			show(){
				this.password=[];
			}
		},
		created() {
			this.visible=true;
		},
		methods:{
			hide() {
				this.$emit('hidePopup');
			},
			inputPwd(e) {
				let char = e.currentTarget.dataset.char;
				let args = {
					target: this,
					data: char,
					cancel: false,
					callback: undefined
				};
				this.$emit('input', args);
				if (!args.cancel){
					if (this.password.length === this.items.length) {
						return;
					}
					if (args.callback && typeof args.callback === 'function') {
						args.callback.call(this);
					}
					this.password.push(char);
					if (this.password.length === this.items.length) {
						//长度达6位，自动验证
						this.$emit('completed', this.password.join(''));
						return;
					}
				}
			},
			backspace() {
				let args = {
					cancel: false
				};
				this.$emit('delete', args);
				if (!args.cancel) {
					if (this.password.length > 0) {
						this.password = this.password.slice(0, this.password.length - 1);
					}
				}
			},
			forget(){
				uni.navigateTo({
					url:'../setPayPassword/setPayPassword'
				})
			}
		}
	}
</script>

<style lang="scss">
.payPassword{
	.password-popup{
		position: relative;
		.icon-close{
			position: absolute;
			right: 20upx;
			top: 20upx;
			font-size: 32upx;
			color: #999;
			z-index: 2;
		}
		.text-box{
			padding: 10px 0;
			display: flex;
			flex-direction: row;
			align-items: center;
			justify-content: center;
		}
		.item-char {
			border:1px solid #ccc;
			width: 32px;
			height: 32px;
			margin: 0 6upx;
			&__dot {
				height: 30px;
				&:after {
					content: '●';
					font-size: 18px;
					line-height: 30px;
					height: 30px;
					display: block;
					text-align: center;
				}
			}
		}
		.keyboard-content {
			min-height: 100px;
			height: auto;
			padding:10px;
			width: 100%;
			box-sizing: border-box;
		}
		.table {
			display: table;
			border-collapse:separate;
			border-top:1px solid #f6f6f6;
			border-left:1px solid #f6f6f6;
			width: 100%;
			.row {
				display: table-row;
			}
			.backspace {
				text-align: center;
				display: flex;
				align-items: center;
			}
			.icon-backspace{
				
			}
			.btn {
				display: table-cell;
				width: calc(100% / 4);
				text-align: center;
				height: 50px;
				line-height: 50px;
				border-bottom: 1px solid #f6f6f6;
				border-right: 1px solid #f6f6f6;
				font-size: 16px;
				font-weight: bold;
			}
			.btn:active {
				background: #f3f3f3;
			}
			.confirm{
				background-color: orange;
				color: #fff;
				font-size: 32upx;
				font-weight: normal;
			}
			.confirm:active {
				background: darkorange;
			}
		}
		.forget{
			font-size: 28upx;
			color: #999;
			line-height: 1.5;
			text-align: center;
		}
	}
	.uni-mask {
		position: fixed;
		z-index: 998;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: rgba(0, 0, 0, .3);
	}
	
	.uni-popup {
		position: fixed;
		z-index: 999;
		background-color: #ffffff;
		box-shadow: 0 0 30upx rgba(0, 0, 0, .1);
		transition: all 0.2s linear;
	}
	.uni-popup-bottom {
		left: 0;
		bottom: 0;
		width: 100%;
		/* height: 100upx;
		line-height: 100upx;
		text-align: center; */
		transform: translateY(100%);
		&.active{
			transform: translateY(0);
		}
	}
}
</style>
