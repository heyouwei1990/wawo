import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
export default new Vuex.Store({
	state:{
		playerInfo:'',
		applePay:'',
		location:''
	},
	mutations:{
		setPlayerInfo(state,value){
			state.playerInfo=value
		},
		setApplePay(state,value){
			state.applePay=value
		},
		setLocation(state,value){
			state.location=value
		}
	},
	actions:{
		
	}
})










