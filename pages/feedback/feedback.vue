<template>
	<view class="feedbackPage">
		<my-issue :score="score" @submit="submit" :headPicValue="avatar"/>
	</view>
</template>

<script>
	import MyIssue from '../../components/myIssue.vue'
	export default{
		components:{
			MyIssue,
		},
		data(){
			return{
				orderId:'',
				score:5,
				avatar:''
			}
		},
		onLoad(option) {
			this.orderId=option.id;
			this.avatar=uni.getStorageSync('userInfo').avatar || '';
		},
		methods:{
			submit(data){
				this.$http.post({
					url:'/myOrder/createComment',
					data:{
						id:this.orderId,
						content:data.textareaValue || '好评！',
						score:data.score
					}
				}).then(r=>{
					if(r.code==0){
						uni.showToast({
							title:'评价成功！',
							complete() {
								uni.navigateBack();
							}
						});
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.feedbackPage{
	width: 750upx;
	height: 100%;
	
}
</style>
