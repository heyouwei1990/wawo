<template>
	<view class="creditDetail">
		<view class="list" v-if="list.length">
			<view class="cell" v-for="(item,index) in list" :key="index">
				<view class="icon"></view>
				<view class="dd">
					<view class="row1">
						<view class="value">信用值{{item.score}}</view>
						<view class="time">{{item.c_time}}</view>
					</view>
					<view class="desc">内容：{{item.content}}/</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[],
			};
		},
		onLoad() {
			this.init();
		},
		methods:{
			init(){
				this.$http.get({
					url:'/score/getDetailList'
				}).then(r=>{
					if(r.code==0){
						this.list=r.data;
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.creditDetail{
	.cell{
		padding: 20upx 30upx;
		display: flex;
		align-items: center;
		background-color: #fff;
		border-bottom: 1upx solid #ddd;
		.icon{
			width: 60upx;
			height: 60upx;
			background-color: #afa;
		}
		.dd{
			flex: 1;
			margin-left: 20upx;
			min-width: 200upx;
		}
		.row1{
			display: flex;
			align-items: center;
			justify-content: space-between;
		}
		.value{
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
		}
		.time{
			font-size: 24upx;
			color: #999;
			line-height: 1.5;
		}
		.desc{
			font-size: 24upx;
			color: #666;
			line-height: 1.5;
			margin-top: 20upx;
		}
	}
}
</style>
