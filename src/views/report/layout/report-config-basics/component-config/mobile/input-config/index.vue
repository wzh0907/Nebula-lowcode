<template>
  <div>
    <el-checkbox v-model="componentConfig.options.required" @change="onChangeRuleType('required')">必填</el-checkbox>
    <br>
    <el-input size="mini" style="width: 178px; margin-left: 24px;" v-model="componentConfig.options.requiredMsg" :disabled="!componentConfig.options.required" placeholder="自定义错误提示"></el-input>
    <div style="height: 10px;"></div>
    <el-checkbox v-model="componentConfig.options.validatorTypeFunc" @change="onChangeRuleType('validatorTypeFunc')">
      <el-select :disabled="!componentConfig.options.validatorTypeFunc" placeholder="请选择" size="mini" style="width: 178px;" v-model="componentConfig.options.inputRuleType" @change="addRuleValidator">
        <el-option
          v-for="item in validatorTypeList"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </el-checkbox>
    <el-input :disabled="!componentConfig.options.validatorTypeFunc" size="mini" style="width: 178px; margin-left: 24px;" v-model="componentConfig.options.funcMsg" placeholder="自定义错误提示"></el-input>
    <div style="height: 10px;"></div>
    <el-checkbox v-model="componentConfig.options.validatorTypeReg" @change="onChangeRuleType('validatorTypeReg')">
      <el-input :disabled="!componentConfig.options.validatorTypeReg" size="mini" placeholder="填写正则表达式" v-model="componentConfig.options.inputRuleReg" @change="addRuleValidator('reg')"></el-input>
    </el-checkbox>
    <el-input :disabled="!componentConfig.options.validatorTypeReg" size="mini" style="width: 178px; margin-left: 24px;" v-model="componentConfig.options.regMsg" placeholder="自定义错误提示"></el-input>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    componentConfig: {
      type: Object,
      default: () => {}
    },
  },
  data() {
    return {
      validatorTypeList: [
        {
          label: '手机号',
          value: 'phone'
        },
        {
          label: '身份证',
          value: 'idcard'
        },
        {
          label: '字符串',
          value: 'string'
        }, {
          label: '数字',
          value: 'number'
        }, {
          label: '整数',
          value: 'int'
        }, {
          label: '浮点数',
          value: 'float'
        }, {
          label: 'URL地址',
          value: 'url'
        }, {
          label: '邮箱地址',
          value: 'email'
        }, {
          label: '十六进制',
          value: 'hex'
        }
      ],
      checked: false
    };
  },
  created() {},
   watch: {
    componentConfig: {
      handler(val) {

      }
    },

  },
  methods: {
    onChangeRuleType(type){
      if (type == 'validatorTypeReg') {
        this.componentConfig.options.validatorTypeFunc = false
      } else if (type == 'validatorTypeFunc') {
        this.componentConfig.options.validatorTypeReg = false
      }
    },
    addRuleValidator(val){
      if (val === 'phone') {
        this.componentConfig.options.validator = value => {
          return /^1\d{10}$/.test(value)
        }
      }
      else if (val === 'idcard') {
        this.componentConfig.options.validator = value => {
          return this.checkIDCard(value)
        }
      }
      else if (val === 'url') {
        this.componentConfig.options.validator = value => {
          return /http:|https:/.test(value)
        }
      } else if (val === 'email') {
        this.componentConfig.options.validator = value => {
          return /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,5})$/.test(value)
        }
      } else if (val === 'reg') {
        this.componentConfig.options.validator = value => {
          return eval(this.componentConfig.options.inputRuleReg).test(value)
        }
      } else if (val === 'string') {
        this.componentConfig.options.validator = value => {
          return typeof value === 'string'
        }
      } else if (val === 'number') {
        this.componentConfig.options.validator = value => {
          return /^\d+(\.\d+)?$/.test(Number(value))
        }
      } else if (val === 'int') {
        this.componentConfig.options.validator = value => {
          return /^-?\d+$/.test(Number(value))
        }
      } else if (val === 'float') {
        this.componentConfig.options.validator = value => {
          return /^(-?\d+)(\.\d+)?$/.test(Number(value))
        }
      } else if (val === 'hex') {
        this.componentConfig.options.validator = value => {
          return /(^0x[a-f0-9]+$)|(^0X[A-F0-9]+$)|(^[A-F0-9]+$)|(^[a-f0-9]+$)/.test(value)
        }
      }
    },
    checkIDCard(idcode) {
      // 加权因子
      var weight_factor = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2];
      // 校验码
      var check_code = ['1', '0', 'X' , '9', '8', '7', '6', '5', '4', '3', '2'];

      var code = idcode + "";
      var last = idcode[17];//最后一位

      var seventeen = code.substring(0,17);

      // ISO 7064:1983.MOD 11-2
      // 判断最后一位校验码是否正确
      var arr = seventeen.split("");
      var len = arr.length;
      var num = 0;
      for(var i = 0; i < len; i++){
        num = num + arr[i] * weight_factor[i];
      }

      // 获取余数
      var resisue = num%11;
      var last_no = check_code[resisue];

      // 格式的正则
      // 正则思路
      /*
      第一位不可能是0
      第二位到第六位可以是0-9
      第七位到第十位是年份，所以七八位为19或者20
      十一位和十二位是月份，这两位是01-12之间的数值
      十三位和十四位是日期，是从01-31之间的数值
      十五，十六，十七都是数字0-9
      十八位可能是数字0-9，也可能是X
      */
      var idcard_patter = /^[1-9][0-9]{5}([1][9][0-9]{2}|[2][0][0|1][0-9])([0][1-9]|[1][0|1|2])([0][1-9]|[1|2][0-9]|[3][0|1])[0-9]{3}([0-9]|[X])$/;

      // 判断格式是否正确
      var format = idcard_patter.test(idcode);

      // 返回验证结果，校验码和格式同时正确才算是合法的身份证号码
      return last === last_no && format ? true : false;
    }
  },
};
</script>

<style lang="scss" scoped>
</style>
