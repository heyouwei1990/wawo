<template>
	<view class="transferTo">
		<view class="search-wrap">
			<input class="input" type="search" v-model="key" @confirm="search" placeholder="搜索" />
			<button class="btn-search" @tap="search">查找</button>
		</view>
		<view class="history">
			<view class="title">最近</view>
			<view class="list" v-if="payeeList.length">
				<view class="user-dl" v-for="(item,index) in payeeList" :key="index">
					<view class="avatar" :src="item.avatar"></view>
					<view class="user-dd">
						<view class="nickname">{{item.customer_name}}</view>
						<view class="phone">{{item.phone}}</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				key:'',
				payeeList:[],
			};
		},
		methods:{
			search(){
				
			},
			init(){
				
			}
		}
	}
</script>

<style lang="scss">
.transferTo{
	padding-top: var(--window-top);
	.search-wrap{
		position: fixed;
		left: 0;
		top: var(--window-top);
		width: 100%;
		height: 90upx;
		display: flex;
		align-items: center;
		padding: 10upx 30upx;
		background-color: #fff;
		border-bottom: 1upx solid #ddd;
		.input{
			flex: 1;
			height: 70upx;
			line-height: 70upx;
			padding: 0 10upx;
			border-radius: 4px;
			border: 1px solid #ddd;
			font-size: 28upx;
			color: #333;
		}
		.btn-search{
			width: 120upx;
			height: 70upx;
			line-height: 70upx;
			text-align: center;
			font-size: 32upx;
			color: #fff;
			background-color: #48a7f9;
			border-radius: 4px;
			margin-left: 20upx;
		}
	}
	.history{
		.title{
			padding: 0 30upx;
			background-color: #fff;
			font-size: 28upx;
			color: #333;
			line-height: 80upx;
			height: 80upx;
			border-bottom: 1upx solid #ddd;
		}
	}
	.user-dl{
		display: flex;
		padding: 20upx 30upx;
		align-items: center;
		border-bottom: 1upx solid #ddd;
		background-color: #fff;
		.avatar{
			width: 120upx;
			height: 120upx;
			border-radius: 50%;
			margin-right: 20upx;
			background-color: #d88;
		}
		.user-dd{
			flex: 1;
		}
		.nickname{
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
			margin-bottom: 10upx;
		}
		.phone{
			font-size: 28upx;
			color: #333;
			line-height: 1.5;
		}
	}
}
</style>
