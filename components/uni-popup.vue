<template>
	<view>
		<view class="uni-mask" v-show="show" :style="{top:offsetTop + 'px'}" @click="hide"></view>
		<view :class="['uni-popup','uni-popup-'+type,{active:show}]" v-show="visible">
			{{msg}}
			<slot></slot>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			show: {
				type: Boolean,
				default: false
			},
			type: {
				type: String,
				//top - 顶部， middle - 居中, bottom - 底部
				default: 'middle'
			},
			msg: {
				type: String,
				default: ""
			}
		},
		data() {
			let offsetTop = 0;
			//#ifdef H5
			offsetTop = 44;
			//#endif
			return {
				offsetTop: offsetTop,
				visible:false,
			}
		},
		created(){
			this.visible=true;
		},
		methods: {
			hide: function() {
				this.$emit('hidePopup');
			}
		}
	}
</script>
<style lang="scss">
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

	.uni-popup-middle {
		display: flex;
		flex-direction: column;
		align-items: center;
		min-width: 10upx;
		min-height: 10upx;
		border-radius: 10upx;
		top: 0%;
		left: 50%;
		transform: translate(-50%, -120%);
		justify-content: center;
		/* padding: 30upx; */
		&.active{
			top: 50%;
			transform: translate(-50%, -50%);
		}
	}

	.uni-popup-top {
		top: 0;
		left: 0;
		width: 100%;
		height: 100upx;
		line-height: 100upx;
		text-align: center;
		transform: translateY(-100%);
		&.active{
			transform: translateY(0);
		}
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
</style>
