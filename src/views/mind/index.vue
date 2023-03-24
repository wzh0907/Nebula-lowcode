<template>
  <div class="outer">
     <custom-header>
            <div slot="opertBtn">
              <span class="el-button-opert-text">
                <el-button
                  type="text"
                  size="medium"
                  icon="el-icon-tickets"
                  @click="saveMind"
                  >保存</el-button
                >
                
              </span>
            </div>
          </custom-header>
    <div class="map" id="map"></div>
  </div>
</template>
<script>
import { getMindListService, saveMindService } from "@/api/mind.js";
import MindElixir, { E } from "mind-elixir";
import customHeader from "@/components/customHeader/index.vue";
export default {
  name: "mind",
  props: {
    projectName: {
      type: String,
    },
  },
  components: {
    MindElixir,
    customHeader
  },
  computed: {},
  data() {
    return {
      mind: "",
      options: "",
      mindData:{},
      mindId:0,

    };
  },
  mounted() {
    console.log("mind mounted");
    this.init();
  },
  created() {
    console.log("mind");
  },
  methods: {
    init() {
      this.mindData=MindElixir.new(this.projectName);
      getMindListService().then((res) => {
        if (res.code==0) {
          if (res.dataList.length>0) {
            this.mindId=res.dataList[0].mindId;
            this.mindData = JSON.parse(res.dataList[0].mind);
            
          }
        }
      });
      setTimeout(()=>{this.initMind()},500)
    },
    initMind(){
      this.options = {
              el: "#map",
              direction: MindElixir.LEFT,
              // the data return from `.getAllData()`
              data: this.mindData,
              draggable: true, // default true
              contextMenu: true, // default true
              toolBar: true, // default true
              nodeMenu: true, // default true
              keypress: true, // default true
              locale: "zh_CN", // [zh_CN,zh_TW,en,ja,pt] waiting for PRs
              overflowHidden: false, // default false
              primaryLinkStyle: 2, // [1,2] default 1
              primaryNodeVerticalGap: 15, // default 25
              primaryNodeHorizontalGap: 15, // default 65
              contextMenuOption: {
                focus: true,
                link: true,
                extend: [
                  {
                    name: "Node edit",
                    onclick: () => {
                      alert("extend menu");
                    },
                  },
                ],
              },
              allowUndo: false,
            };

            if (this.mind == "") {
              this.mind = new MindElixir(this.options);
              this.mind.init();
            }
    },
    saveMind() {
      let param = {
        mind: JSON.stringify(this.mind.getAllData()),
      };
      if(this.mindId){
        param.mindId=this.mindId;
      }
      console.log("saveMind", param);
      saveMindService(param).then((res) => {
        console.log("save", res);
      });
    },
  },
};
</script>

<style lang="less" scoped>
.map {
  height:  calc(100vh - 92px);
  width: 100%;
}
.outer {
  /deep/.lt {
    width: 40px;
  }
  /deep/.header_left{
   flex:0;
 }
  /deep/.header_right{
   width:100%;
   text-align: center;
 }
}
</style>
