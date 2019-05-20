<template>
	<view class="videoPlayer" v-if="videoInfo">
		<video class="player" :src="videoInfo.url"></video>
		<view class="sec-hd">
			<view class="title">{{videoInfo.title}}</view>
			<!-- <view class="pageview">{{videoInfo.views}}人观看</view> -->
		</view>
		<view class="introduction">
			<view class="title">视频介绍</view>
			<view class="desc">{{videoInfo.content}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// videoInfo:'',
			};
		},
		computed:{
			videoInfo(){
				return this.$store.state.playerInfo;
			}
		},
		onLoad() {
			console.log(this.videoInfo)
		},
		methods:{
			
		}
	}
</script>

<style lang="scss">
.videoPlayer{
	.player{
		width: 100%;
		height: 422upx;
	}
	.introduction{
		background-color: #fff;
		.title{
			font-size: 28upx;
			color: #333;
			line-height: 48upx;
			padding: 20upx 30upx;
		}
		.desc{
			padding:20upx 30upx;
			font-size: 24upx;
			color: #666;
		}
	}
}
</style>
