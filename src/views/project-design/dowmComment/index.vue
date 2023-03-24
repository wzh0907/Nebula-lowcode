<template>
  <div class="downComment_main">
    <div class="downCommentDetail">
        <div class="detail_base">
            <div class="detail_base_left">
              <img v-if="applyDetail.cpntLogo !== '' && applyDetail.cpntLogo !== null && applyDetail.cpntLogo !== undefined" :src="applyDetail.cpntLogo"  style="object-fit: cover; object-position: top center" alt="">
              <img v-else src="../../../assets/noImg.png" alt="">
            </div>
            <div class="detail_base_right">
              <div class="detail_base_right_line">
                    <div class="detail_base_title">{{applyDetail.cpntName}}</div>
                    <!-- <div class="detail_base_right_type">
                      <el-button>体验一下</el-button>
                      <el-button type="primary">下载</el-button>
                      <el-button type="primary">引用</el-button>
                    </div> -->
              </div>
            </div>
        </div>
        <div class="detail_more">
            <div class="detail_extend">
                <el-carousel height="420px">
                  <el-carousel-item v-for="item in applyDescPicList" :key="item">
                    <img :src="item" alt="" style="object-fit: contain">
                  </el-carousel-item>
                </el-carousel>
            </div>
            <div class="detail_spread">
              <ul>
                <li>
                  <div>
                    管理者: <label>{{applyDetail.createdBy}}</label>
                  </div>
                </li>
                <li>
                  <div>
                    发布时间: <label>{{applyDetail.createTime}}</label>
                  </div>
                </li>
                  <li>
                  <div>
                    当前版本: <label>{{applyDetail.cpntVersion}}</label>
                  </div>
                </li>                
                <li>
                  <div>
                    版本说明: <label>{{applyDetail.cpntVersionDesc}}</label>
                  </div>
                </li>
              </ul>

            </div>
        </div>
    </div>
  </div>
</template>

<script>
import { checkMktApplyDetail } from "@/api/componentApply";
export default {
  name: "downCommentDetail",
  components: {

  },
  data() {
    return {
      applyDetail:{},
      applyDescPicList:[],
      defaultImg:require('../../../assets/lunbo.png')
    };
  },
  computed: {

  },
  created() {
    this.getMktAppDetail()
  },
  mounted() {},
  methods: {
    //获取我的全部应用市场详情
    getMktAppDetail() {
      let obj =  {
        id:this.$route.query.id
      }
      checkMktApplyDetail(obj).then(res => {
          this.applyDetail = res.data
          if (res.data.cpntDescPic !== '' && res.data.cpntDescPic !== null && res.data.cpntDescPic !== undefined) {
            this.applyDescPicList = (res.data.cpntDescPic).split(',')
          } else {
            this.applyDescPicList.push(this.defaultImg)
          }
          
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.downComment_main{
  width: 100%;
  height: 100%;
  padding-top: 62px;
  padding-bottom: 20px;
  overflow: auto;
  .downCommentDetail{
      max-width: 1180px;
      width: 100%;
      height: 100%;
      margin: 0 auto;
      padding: 34px 40px 60px;
      min-height: 350px;
      background: #fff;
    .detail_base{
      display: flex;
      .detail_base_left{
        img{
          width: 80px;
          height: 80px;
          border-radius: 4px;
        }
      }
      .detail_base_right{
        flex:1;
        .detail_base_right_line{
          display: flex;
          flex: 1;
          .detail_base_title{
              flex: 1;
              margin-left: 20px;
              font-size: 20px;
              color: #333;

          }
        }
      }
    }
    .detail_more{
      display:flex;
      width:100%;
      .detail_extend{
        float: left;
        width: 756px;
        margin-left: 100px;
        margin-right: 24px;
        padding-top: 40px;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .detail_spread{
        float: left;
        padding-top: 40px;
        max-width: 180px;
        ul{
          li{
            margin: 10px 0;
            div{
                font-size: 12px;
                color: rgba(0,0,0,.6);
            }
          }
        }
      }
    }
  }
}


</style>
