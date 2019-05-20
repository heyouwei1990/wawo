<template>
	<view class="calendarPage">
		<calendar 
		:disableBefore="false"
		:selected="selectedDate"
		@to-click="toClick"
		@change="change"
			 />
		<view class="divide"></view>
		<view class="sec-hd">
			<view class="title">即将开课</view>
		</view>
		<view class="list" v-if="lessonList.length">
			<navigator class="lesson-dl" v-for="(item,index) in lessonList" :key="index" :url="'../lessonDetail/lessonDetail?id='+item.id">
				<view class="lesson-dt">
					<view class="free-mark" v-if="item.vip_price==0">VIP免费</view>
					<image class="cover" mode="aspectFill" :src="item.thumbnail" lazy-load></image>
				</view>
				<view class="lesson-dd">
					<view class="row-top">
						<view class="title">{{item.title}}</view>
						<view class="status">{{item.course_status}}</view>
					</view>
					<view class="desc">{{item.summary}}</view>
					<view class="time">开课时间：{{item.start_time}}</view>
					<view class="row-bottom">
						<view class="address">开课地点：{{item.specificsite}}</view>
					</view>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
	import Calendar from '../../components/calendar.vue'
	export default {
		components:{
			Calendar
		},
		data() {
			return {
				selectedDate:[],
				lessonList:[],
				month:'',
			};
		},
		onLoad() {
			// this.init();
		},
		watch: {
			month(newValue, oldValue) {
				if(newValue!==oldValue){
					this.lessonList=[];
					this.lessonStartDate();
				}
			}
		},
		methods:{
			init(){
				var year=new Date().getFullYear();
				var month=new Date().getMonth()+1;
				var monthStr=month<10?('0'+month):(''+month);
				this.month=year+monthStr;
				this.lessonStartDate();
			},
			//获取课程日期
			lessonStartDate(){
				this.selectedDate=[];
				this.$http.get({
					url:'/content/courseCount',
					data:{
						month:this.month
					}
				}).then(r=>{
					if(r.code==0){
						var list=r.data || [];
						for (var i = 0; i < list.length; i++) {
							var obj={};
							obj['date']=list[i].start_time;
							obj['info']=list[i].quantity;
							this.selectedDate.push(obj);
						}
					}
				})
			},
			//左右滑动获取当月信息
			change(data){
				var month=data.month<10?('0' + data.month):(data.month+'');
				this.month=data.year+''+month;
				this.toClick(data);
			},
			//点击有信息的日子，显示当日课程
			toClick(data){
				var month=data.month<10?('0' + data.month):(data.month+'');
				var date=data.date<10?('0' + data.date):(data.date+'');
				var day=data.year+month+date;
				this.$http.get({
					url:'/content/calendar',
					data:{
						date:day
					}
				}).then(r=>{
					if(r.code==0){
						this.lessonList=r.data;
					}
				})
			}
		}
	}
</script>

<style lang="scss">
.calendarPage{
	
}
</style>
