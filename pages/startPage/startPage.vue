<template>
	<view class="startPage">
		<swiper class="slider" indicator-color="rgba(255,255,255,0.3)" indicator-active-color="rgba(255,255,255,0.8)" :indicator-dots="true" :duration="300" @animationfinish="swipe">
			<swiper-item >
				<image class="banner" src="../../static/start_1.jpg" mode="aspectFill"></image>
			</swiper-item>
			<swiper-item >
				<image class="banner" src="../../static/start_2.jpg" mode="aspectFill"></image>
			</swiper-item>
			<swiper-item >
				<image class="banner" src="../../static/start_3.jpg"  @touchstart="touchStart" @touchmove="touchMove" @touchend="touchEnd" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<view class="btn" @tap="start">跳过</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current:'',
				startX:0,
				endX:0
			}
		},
		methods: {
			swipe(e){
				this.current=e.detail.current;
			},
			touchStart(e){
				// console.log(e)
				this.startX = e.touches[0].pageX;
			},
			touchMove(e){
				this.endX = e.touches[0].pageX;
				// console.log(this.endX);
			},
			touchEnd(){
				const distance = this.endX - this.startX;
				// console.log(distance);
				if(distance<-50 && this.current==2){
					this.start();
				}
			},
			start(){
				uni.setStorage({
						key: 'launchFlag',
						data: true,
				});
				uni.switchTab({
					url:'../home/home'
				})
			}
		}
	}
</script>

<style lang="scss">
.startPage{
	position:fixed;
	z-index: 999;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	.slider{
		width: 100%;
		height: 100%;
	}
	.banner{
		width: 100%;
		height: 100%;
		display: block;
	}
	.btn{
		padding: 10upx 30upx;
		border: 1upx solid #fff;
		color: #fff;
		font-size: 28upx;
		line-height: normal;
		position: absolute;
		right: 30upx;
		top: 80upx;
		border-radius: 100upx;
	}
}
</style>
