<template>
  <div class="Scheduling_table">
    <el-table :data="tableDatas" :header-cell-style="{padding:0,margin:0}">
      <template v-for="(item,index) in tableLabel">
        <el-table-column :key="index" align="center" v-if="!item.label" :width="item.width">
          <template slot="header">
            <div>{{item.day}}</div>
            <div>{{item.week}}</div>
          </template>
          <template slot-scope="scope">
            <div
              @click="newdata(scope.row[index],index)"
              class="status01"
              :style="scope.row[index] | filter"
            >{{scope.row[index]&&scope.row[index].weeks?scope.row[index].weeks:''}}</div>
          </template>
        </el-table-column>
        <el-table-column :key="index" v-else align="center" :width="item.width">
          <template slot="header">
            <div>{{item.label}}</div>
          </template>
          <template slot-scope="scope">
            <div class="status01">{{scope.row[1].StaffName}}</div>
          </template>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "",
  filters:{
    filter:(value)=>{
      if (value&&value.status&&value.status==1) {
        return 'background: #55AAFF;color:#FFF'
      }
	  if (value&&value.status&&value.status==2) {
	    return 'background: #009900;color:#FFF'
	  }
      if (value&&value.status&&value.status==3) {
        return 'background: #ccc;color:#FFF'
      }
      // scope.row[item.key]&&scope.row[item.key].status==0?'background: #FFFFFF':scope.row[item.key]&&scope.row[item.key].status==2?'background: #ccc;color:#FFF':scope.row[item.key]&&scope.row[item.key].status==3?'background: #199ED8;color:#FFF':'background: #009900;color:#FFF'
    }
  },
  props: {
    tableLabel: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  data() {
    return {
      datas: {},
      tableDatas: []
    };
  },
  watch:{
  	  tableDatas:{
  		handler(data) {
  		      },
  		      immediate: true,
  		      deep: true
  		},
	datas:{
		handler(data) {
			if(data!={}){
				this.getdatas(data)
			}
		},
		immediate: true,
		deep: true
	}
  },
  components: {},
  methods: {
    getdatas(data) {
      for(var index in this.tableDatas){
      	for(var index2 in this.tableDatas[index]){
      		if(this.tableDatas[index][index2].StaffId==data.StaffId && this.tableDatas[index][index2].NewData==data.NewData){
				 this.$set(this.tableDatas[index],index2,data);
				 this.tableDatas = JSON.parse(JSON.stringify(this.tableDatas));
      		}
      	}
      }
    },
    newdata(val,indexs) {
      // console.log(val);
	  val.index = indexs;
      this.$emit('newdata',val)
    },
  },
  created() {},
  mounted() {}
};
</script>
<style scoped>
/* @import url(); 引入css类 */
.status01 {
  /* color: white; */
  width: 100%;
  height: 40px;
  text-align: center;
  line-height: 40px;
  margin: 0;
  padding: 0;
  cursor: default;
}
.Scheduling {
  padding: 20px;
}
</style>