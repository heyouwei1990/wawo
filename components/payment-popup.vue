<template>
	<view class="payment-popup">
		<view class="uni-mask" v-show="show" :style="{top:offsetTop + 'px'}" @click="hide"></view>
		<view :class="['uni-popup','uni-popup-bottom',{active:show}]" v-show="visible">
			<view class="payment-channel">
				<view class="title">支付方式</view>
				<view class="radio-group">
					<block v-for="(item,index) in payList" :key="index" >
						<view class="radio-item" :class="{checked:checked===index}" @tap="payChange(index)">
							<image class="icon" :src="item.icon" mode="widthFix"></image>
							<view class="label">{{item.name}}</view>
						</view>
					</block>
				</view>
				<view class="btn-box">
					<button type="primary" @tap="submit" :loading="btnLoading">确认</button>
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
			};
		},
		props: {
			show: {
				type: Boolean,
				default: false
			},
			btnLoading: {
				type: Boolean,
				default: false
			}
		},
		created() {
			this.payList=uni.getStorageSync('payTypes');
			this.visible=true;
			// #ifdef APP-PLUS
			plus.payment.getChannels((channels) => {
				console.log("获取到channel" + JSON.stringify(channels))
				for (var i in channels) {
					var channel = channels[i];
					if (channel.id === 'appleiap') {
						var iapChannel = channel;
						console.log(JSON.stringify(iapChannel))
						this.requestOrder(iapChannel);
					}
				}
			}, (error) => {
				console.log('不支持苹果支付');
			});
			// #endif
		},
		methods: {
			hide() {
				this.$emit('hidePopup');
			},
			//选择支付方式
			payChange(index) {
				this.checked = index;
			},
			//
			submit() {
				var value = this.payList[this.checked];
				this.$emit('pay', value);
			},
			//
			requestOrder(iapChannel) {
				uni.showLoading({
					title: '检测支付环境...'
				})
				//必须调用此方法才能进行 iap 支付
				iapChannel.requestOrder(productIds, (orderList) => { 
					console.log(productIds);
					console.log('requestOrder success666: ' + JSON.stringify(orderList));
					uni.hideLoading();
				}, (e) => {
					console.log('requestOrder failed: ' + JSON.stringify(e));
					uni.hideLoading();
				});
			},
		},
	}
</script>

<style lang="scss">
	.payment-popup {
		.payment-channel {
			padding-top: 20upx;

			.title {
				padding: 20upx 30upx;
				font-size: 32upx;
				color: #333;
				line-height: 1.8;
			}

			.btn-box {
				padding: 20upx 30upx;
			}
		}

		.radio-group {
			width: 100%;
			border-top: 1upx solid #ddd;
			border-bottom: 1upx solid #ddd;

			.radio-item {
				border-bottom: 1upx solid #ddd;
				display: flex;
				align-items: center;
				width: 100%;
				padding: 20upx 30upx;
				position: relative;
				z-index: 2;

				&:last-child {
					border-bottom: 0;
				}

				&:after {
					content: "";
					width: 30upx;
					height: 30upx;
					border-radius: 50%;
					border: 1px solid #ddd;
					padding: 6upx;
					box-sizing: border-box;
					background-color: #fff;
					/* position: absolute;
				left: auto;
				right: 30upx;
				top: 50%;
				transform: translateY(-50%); */
				}

				&.checked:after {
					background-color: #66D27E;
					background-clip: content-box;
				}
			}

			.icon {
				width: 60upx;
				height: 60upx;
				margin-right: 20upx;
			}

			.label {
				font-size: 28upx;
				color: #333;
				line-height: 1.8;
				flex: 1;
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
