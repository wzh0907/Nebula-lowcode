<template>
  <div class="date-chose-div">
        <el-row v-if="variateInfo.type == '2'">
          <el-col :span="12">
            <el-date-picker
              type="date"
               size="small" 
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              v-model="varDate"
              placeholder="Select date"
              style="max-width: 120px"
              @change="setOptionDate"
            ></el-date-picker>
            <!-- <el-checkbox
              v-model="variateInfo.currentDate"
              @change="setCheckBoxDate('currentDate')"
              >当前日期</el-checkbox
            > -->
          </el-col>
          <el-col :span="12">
            <el-time-picker
              type="time"
               size="small" 
              format="HH:mm:ss"
              value-format="HH:mm:ss"
              v-model="varTime"
              placeholder="Select time"
              style="max-width: 120px"
              @change="setOptionTime"
            ></el-time-picker>
            <!-- <el-checkbox
              v-model="variateInfo.currentTime"
              @change="setCheckBoxDate('currentTime')"
              >当前时间</el-checkbox
            > -->
          </el-col>
        </el-row>
        
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
export default {
  name: "dateChoose",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
    },
  },
  data() {
    return {
      dialogVisible: false,
      
     
      buttonProps: {
        type: "default",
        size: "small",
      },
      variableList: [],
      variateInfo: {},
      varTagFlag: false,
      varDate:"",
      varTime:"",
      chosenRoot: {},
      chosenNode: {},
    };
  },
  created() {},
  mounted() {
    // console.log("data",this.data);
    this.variateInfo = this.data;
    this.varDate = this.variateInfo.date;
    this.varTime = this.variateInfo.time;
  },
  watch: {
    "variateInfo":{
       handler(newData, oldVal){
      if(newData){
        this.$emit("setDate", newData,this.type);
      }
      },
      deep:true
    }
  },
  // computed: {
  //    dialogVisible: {
  //     get() {
  //       return this.value;
  //     },
  //     set(val) {
  //        this.$emit('cancel')
  //     },
  //   },
  // },
  methods: {
    
    setOptionDate(value, type) {
      this.variateInfo.date = value;
      this.variateInfo.currentDate = false;
      this.dealDate();
    },
    setOptionTime(value, type) {
      this.variateInfo.time = value;
      this.variateInfo.currentTime = false;
      this.dealDate();
    },
    dealDate() {
      if (this.variateInfo.date && this.variateInfo.time) {
        this.variateInfo.value =
          this.variateInfo.date + " " + this.variateInfo.time;
      } else if (this.variateInfo.date) {
        this.variateInfo.value = this.variateInfo.date;
      } else if (varInfo.time) {
        this.variateInfo.value = varInfo.time;
      }
    },
    
    formatDate(date, fmt) {
      if (date instanceof Date) {
        if (/(y+)/.test(fmt)) {
          fmt = fmt.replace(
            RegExp.$1,
            (date.getFullYear() + "").substr(4 - RegExp.$1.length)
          );
        }
        let o = {
          "M+": date.getMonth() + 1,
          "d+": date.getDate(),
          "h+": date.getHours(),
          "m+": date.getMinutes(),
          "s+": date.getSeconds(),
        };
        for (let k in o) {
          if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + "";
            fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length === 1 ? str : this.padLeftZero(str)
            );
          }
        }
        return fmt;
      } else {
        return date;
      }
    },
    padLeftZero(str) {
      return ("00" + str).substr(str.length);
    },
    close() {
      this.cancel();
      //  this.$emit("cancalVarEdit", false);
    },
  },
};
</script>

<style scoped lang="less">
.variable-edit-div {
  font-size: 16px;
}
.demo-tree-render {
  margin-top: 40px;
  max-height: 400px;
  overflow-x: hidden;
  overflow-y: auto;
}
.btn-group {
  display: flex;
  justify-content: center;
}
/deep/.ivu-modal-footer {
  text-align: left;
  font-size: 14px;
  line-height: 14px;
  color: #666666;
}
.icon-cancal {
  font-size: 25px;
  cursor: pointer;
}
.icon-cancal:hover {
  font-weight: bold;
}
.date-chose-div{
    /deep/.el-input--suffix {
    width: 100%;
  }
  /deep/.el-input {
    width: 100%;
  }
  /deep/.el-select{
     width:100%;
  }
}
</style>
