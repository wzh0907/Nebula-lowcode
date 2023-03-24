<template>
  <el-dialog
    v-loading="listLoading"
    :title="title"
    width="600px"
    :visible.sync="isShowDialog"
    :close-on-click-modal="false"
    @open="dialogOpen"
  >
    <el-form
      ref="versionForm"
      :rules="rules"
      label-width="120px"
      :model="dataForm"
    >
      <el-form-item label="重复" prop="serverType" size="small">
        <el-radio-group v-model="dataForm.type">
          <el-radio :label="'1'">每天</el-radio>
          <el-radio :label="'2'">每周</el-radio>
          <el-radio :label="'3'">每月</el-radio>
          <el-radio :label="'4'">高级</el-radio>
        </el-radio-group>
        <div v-if="dataForm.type == '2'" style="display: flex">
          <div
            v-for="(week, wIndex) in weekDay"
            :key="wIndex"
            class="week-div"
            :class="[week.chosen ? 'week-div-active' : '']"
            @click="chosenWeek(wIndex)"
          >
            {{ week.label }}
          </div>
        </div>
        <div v-if="dataForm.type == '3'" style="display: flex; flex-wrap: wrap">
          <div
            v-for="(day, index) in monthDay"
            :key="index"
            :class="[
              monthDay.length - 1 == index ? 'mouth-div' : 'week-div',
              day.chosen ? 'week-div-active' : '',
            ]"
            @click="monthChosen(index)"
          >
            {{ day.name }}
          </div>
        </div>
        <div v-if="dataForm.type == '4'">
          <el-input v-model="dataForm.cron" maxlength="100" />
        </div>
      </el-form-item>
      <el-form-item></el-form-item>
      <el-form-item label="时间：" prop="remark" size="small">
        <el-time-picker
          v-model="dataForm.jobTime"
          value-format="HH:mm:ss"
          placeholder="选择时间"
        />
      </el-form-item>
      <el-form-item></el-form-item>
      <el-form-item label="任务：" prop="version" size="small">
        <div
          v-for="(item, mIndex) in dataForm.processVOList"
          :key="mIndex"
          class="job-div"
        >
          <el-select
            v-model="item.id"
            placeholder="请选择后端服务"
            @change="selsetInterfaceList($event)"
          >
            <el-option
              v-for="item in interfaceDataAll"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </div>

        <i class="iconfont iconjia job-add" @click="addMission" />
      </el-form-item>
      <!-- <el-form-item /> -->
      <!-- <el-form-item /> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="isShowDialog = false">取 消</el-button>
      <el-button type="primary" @click="save">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { saveJobService, listApiService } from "@/api/job";
export default {
  name: "AddVersion",
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    detailData: {},
  },
  data() {
    return {
      interfaceDataAll: [],
      listLoading: false,
      dataForm: {
        processVOList: [],
        remark: "",
        serverType: "",
      },
      rules: {
        version: [{ required: true, message: "请输入版本号", trigger: "blur" }],
      },
      weekDay: [
        {
          label: "一",
          value: "1",
          chosen: false,
        },
        {
          label: "二",
          value: "2",
          chosen: false,
        },
        {
          label: "三",
          value: "3",
          chosen: false,
        },
        {
          label: "四",
          value: "4",
          chosen: false,
        },
        {
          label: "五",
          value: "5",
          chosen: false,
        },
        {
          label: "六",
          value: "6",
          chosen: false,
        },
        {
          label: "日",
          value: "7",
          chosen: false,
        },
      ],
      dataForm: this.detailData,
      monthDay: [
        { name: "1", value: "1", chosen: false },
        { name: "2", value: "2", chosen: false },
        { name: "3", value: "3", chosen: false },
        { name: "4", value: "4", chosen: false },
        { name: "5", value: "5", chosen: false },
        { name: "6", value: "6", chosen: false },
        { name: "7", value: "7", chosen: false },
        { name: "8", value: "8", chosen: false },
        { name: "9", value: "9", chosen: false },
        { name: "10", value: "10", chosen: false },
        { name: "11", value: "11", chosen: false },
        { name: "12", value: "12", chosen: false },
        { name: "13", value: "13", chosen: false },
        { name: "14", value: "14", chosen: false },
        { name: "15", value: "15", chosen: false },
        { name: "16", value: "16", chosen: false },
        { name: "17", value: "17", chosen: false },
        { name: "18", value: "18", chosen: false },
        { name: "19", value: "19", chosen: false },
        { name: "20", value: "20", chosen: false },
        { name: "21", value: "21", chosen: false },
        { name: "22", value: "22", chosen: false },
        { name: "23", value: "23", chosen: false },
        { name: "24", value: "24", chosen: false },
        { name: "25", value: "25", chosen: false },
        { name: "26", value: "26", chosen: false },
        { name: "27", value: "27", chosen: false },
        { name: "28", value: "28", chosen: false },
        { name: "29", value: "29", chosen: false },
        { name: "30", value: "30", chosen: false },
        { name: "31", value: "31", chosen: false },
        { name: "最后一天", value: "-1", chosen: false },
      ],
    };
  },
  computed: {
    isShowDialog: {
      get() {
        return this.dialogVisible;
      },
      set(val) {
        this.$emit("update:dialogVisible", val);
      },
    },
  },
  created() {
    listApiService().then((res) => {
      this.interfaceDataAll = res.dataList;
    });
  },
  mounted() {},
  methods: {
    save() {
      // this.add();
      const params = {
        type: this.dataForm.type,
        jobTime: this.dataForm.jobTime,
        jobDaily: this.getJobDaily(),
        cron: this.dataForm.cron,
        processVOList: this.dataForm.processVOList,
      };
      if (this.dataForm.jobId) {
        params.jobId = this.dataForm.jobId;
      }
      saveJobService(params).then((res) => {
        if (res.code == 0) {
          this.$message.success("保存成功");
          this.isShowDialog = false;
          this.$emit("reload");
        }
      });
    },
    add() {
      // this.$refs.versionForm.validate(async (valid) => {
      //   if (valid) {
      //     console.log(this.dataForm);
      //     const params = {
      //       version: this.dataForm.version,
      //       remark: this.dataForm.remark,
      //       serverType: this.dataForm.serverType,
      //     };
      //     this.listLoading = true;
      //     saveJobService(params).then((res) => {
      //       this.listLoading = false;
      //       this.isShowDialog = false;
      //       this.$refs.versionForm.resetFields();
      //       this.$emit("reload");
      //     });
      //   }
      // });
    },
    getJobDaily() {
      let jobDaily = "";
      if (this.dataForm.type == 2) {
        this.weekDay.forEach((item) => {
          if (item.chosen) {
            jobDaily = item.value;
          }
        });
      } else if (this.dataForm.type == 3) {
        this.monthDay.forEach((item) => {
          if (item.chosen) {
            jobDaily = item.value;
          }
        });
      }
      return jobDaily;
    },
    dialogOpen() {
      this.dataForm = {
        processVOList: [],
        type: "",
        jobTime: "",
        jobDaily: "",
      };
      if (this.detailData) {
        this.dataForm = this.detailData;
        if (this.dataForm.type == "2") {
          this.weekDay.forEach((item) => {
            if (item.value === this.dataForm.jobDaily) {
              item.chosen = !item.chosen;
            } else {
              item.chosen = false;
            }
          });
        } else {
          this.monthDay.forEach((item, key) => {
            if (item.value === this.dataForm.jobDaily) {
              item.chosen = !item.chosen;
            } else {
              item.chosen = false;
            }
          });
        }
      } else {
        this.dataForm = {};
      }
    },
    chosenWeek(index) {
      this.weekDay.forEach((item, key) => {
        if (index === key) {
          item.chosen = !item.chosen;
        } else {
          item.chosen = false;
        }
      });
    },
    monthChosen(index) {
      this.monthDay.forEach((item, key) => {
        if (index === key) {
          item.chosen = !item.chosen;
        } else {
          item.chosen = false;
        }
      });
    },
    addMission() {
      console.log("addMission", this.dataForm, this.dataForm.processVOList);
      if (this.dataForm.processVOList) {
        this.dataForm.processVOList.push({});
      } else {
        this.dataForm.processVOList = [{}];
      }
      this.$forceUpdate();
    },
    selsetInterfaceList(value) {
      this.interfaceDataAll.map((i) => {
        if (i.id === value) {
          //  this.data.options.interfaceType = i.url
        }
      });
      this.$forceUpdate();
    },
  },
};
</script>

<style lang="scss" scoped>
.week-div {
  border: 1px solid #0962ea;
  color: #0962ea;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: 18px;
  margin: 5px;
  cursor: pointer;
}
.mouth-div {
  font-size: 18px;
  line-height: 30px;
  color: #0962ea;
  height: 30px;
  margin: 5px;
  cursor: pointer;
}
.week-div-active {
  background-color: #0962ea;
  color: #fff;
}
.job-div {
  margin-bottom: 10px;
}
</style>
