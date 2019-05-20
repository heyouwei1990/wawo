<template>
  <div class="mpvue-picker">
		<div class="mpvue-input"  @click="show">{{val}}</div>
    <div :class="{'pickerMask':showPicker}" @click.stop="maskClick" catchtouchmove="true"></div>
    <div class="mpvue-picker-content " :class="{'mpvue-picker-view-show':showPicker}">
      <div class="mpvue-picker__hd" catchtouchmove="true">
        <div class="mpvue-picker__action" @click.stop="pickerCancel">取消</div>
        <div class="mpvue-picker__action" :style="{color:themeColor}" @click.stop="pickerConfirm">确定</div>
      </div>
      <picker-view indicator-style="height: 40px;" class="mpvue-picker-view" :value="pickerValue" @change="pickerChange">
        <block>
          <picker-view-column>
            <div class="picker-item" v-for="(item,index) in provinceDataList" :key="index">{{item.label}}</div>
          </picker-view-column>
          <picker-view-column>
            <div class="picker-item" v-for="(item,index) in cityDataList" :key="index">{{item.label}}</div>
          </picker-view-column>
          <picker-view-column>
            <div class="picker-item" v-for="(item,index) in areaDataList" :key="index">{{item.label}}</div>
          </picker-view-column>
        </block>
      </picker-view>
    </div>
  </div>
</template>

<script>
import provinceData from './city-data/province.js';
import cityData from './city-data/city.js';
import areaData from './city-data/area.js';
export default {
  data() {
    return {
      pickerValue: [0, 0, 0],
      provinceDataList: [],
      cityDataList: [],
      areaDataList: [],
		/* 是否显示控件 */
			showPicker:false,
			val:'',
    };
  },
  created() {
    this.init();
  },
  props: {
    /* 默认值 */
		address:{
			type: String,
			default:''
		},
    /* 主题色 */
    themeColor: String,
  },
	watch:{
		address(v){
			this.init();
		}
	},
  methods: {
		init() {
			this.val=this.address;
			var cityArr=this.val.split('-');
			if(cityArr.length==2){
				//如果地址只有两级，则在中间添加市辖区
				cityArr.splice(1,0,'市辖区');
			}
			var provinceNo=0;
			var cityNo=0;
			var areaNo=0;
			//获取当前省的index
			for (var i = 0; i < provinceData.length; i++) {
				if(cityArr[0]==provinceData[i].label){
					provinceNo=i;
				}
			}
			//获取当前市的index
			for (var j = 0; j < cityData[provinceNo].length; j++) {
				if(cityArr[1]==cityData[provinceNo][j].label){
					cityNo=j;
				}
			}
			//获取当前县区的index
			for (var k = 0; k < areaData[provinceNo][cityNo].length; k++) {
				if(cityArr[2]==areaData[provinceNo][cityNo][k].label){
					areaNo=k;
				}
			}
			this.pickerValue=[provinceNo,cityNo,areaNo];
			this.handPickValueDefault(); // 对 pickerValueDefault 做兼容处理
			this.provinceDataList = provinceData;
			this.cityDataList = cityData[this.pickerValue[0]];
			this.areaDataList = areaData[this.pickerValue[0]][this.pickerValue[1]];
		},
    show() {
      setTimeout(() => {
        this.showPicker = true;
      }, 0);
    },
    maskClick() {
      this.pickerCancel();
    },
    pickerCancel() {
      this.showPicker = false;
      this._$emit('onCancel');
    },
    pickerConfirm(e) {
      this.showPicker = false;
			this.val=this._getLabel();
      this._$emit('onConfirm');
    },
    showPickerView() {
      this.showPicker = true;
    },
    handPickValueDefault() {
      if (this.pickerValue !== [0, 0, 0]) {
        if (this.pickerValue[0] > provinceData.length - 1) {
          this.pickerValue[0] = provinceData.length - 1;
        }
        if (this.pickerValue[1] > cityData[this.pickerValue[0]].length - 1) {
          this.pickerValue[1] = cityData[this.pickerValue[0]].length - 1;
        }
        if (this.pickerValue[2] > areaData[this.pickerValue[0]][this.pickerValue[1]].length - 1) {
          this.pickerValue[2] = areaData[this.pickerValue[0]][this.pickerValue[1]].length - 1;
        }
      }
    },
    pickerChange(e) {
      let changePickerValue = e.mp.detail.value;
      if (this.pickerValue[0] !== changePickerValue[0]) {
        // 第一级发生滚动
        this.cityDataList = cityData[changePickerValue[0]];
        this.areaDataList = areaData[changePickerValue[0]][0];
        changePickerValue[1] = 0;
        changePickerValue[2] = 0;
      } else if (this.pickerValue[1] !== changePickerValue[1]) {
        // 第二级滚动
        this.areaDataList =
          areaData[changePickerValue[0]][changePickerValue[1]];
        changePickerValue[2] = 0;
      }
      this.pickerValue = changePickerValue;
      this._$emit('onChange');
    },
    _$emit(emitName) {
      let pickObj = {
        label: this._getLabel(),
        value: this.pickerValue,
        cityCode: this._getCityCode()
      };
			if(emitName!='onCancel'){
				this.$emit(emitName, pickObj);
			}else{
				this.$emit(emitName);
			}
      
    },
    _getLabel() {
      let pcikerLabel =
        this.provinceDataList[this.pickerValue[0]].label +
        '-' +
        this.cityDataList[this.pickerValue[1]].label +
        '-' +
        this.areaDataList[this.pickerValue[2]].label;
      return pcikerLabel;
    },
    _getCityCode() {
      return this.areaDataList[this.pickerValue[2]].value;
    }
  }
};
</script>

<style lang="scss">
.mpvue-picker{
	.mpvue-input{
		width: 100%;
		height: 88upx;
		line-height: 88upx;
		font-size: 14px;
		color: #333;
	}
}
.pickerMask {
  position: fixed;
  z-index: 1000;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
}
.mpvue-picker-content {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  transition: all 0.3s ease;
  transform: translateY(100%);
  z-index: 3000;
}
.mpvue-picker-view-show {
  transform: translateY(0);
}
.mpvue-picker__hd {
  display: flex;
  padding: 9px 15px;
  background-color: #fff;
  position: relative;
  text-align: center;
  font-size: 17px;
}
.mpvue-picker__hd:after {
  content: ' ';
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #e5e5e5;
  color: #e5e5e5;
  transform-origin: 0 100%;
  transform: scaleY(0.5);
}
.mpvue-picker__action {
  display: block;
  flex: 1;
  color: #1aad19;
}
.mpvue-picker__action:first-child {
  text-align: left;
  color: #888;
}
.mpvue-picker__action:last-child {
  text-align: right;
}
.picker-item {
  text-align: center;
  line-height: 40px;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 16px;
}
.mpvue-picker-view {
  position: relative;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 238px;
  background-color: rgba(255, 255, 255, 1);
}
</style>
