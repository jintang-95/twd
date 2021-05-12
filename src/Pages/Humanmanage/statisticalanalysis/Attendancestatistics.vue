<template>
  <div class="attendance_body">
    <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
    <el-tab-pane label="部门出勤率" name="first">
      <department></department>
    </el-tab-pane>
    <el-tab-pane label="岗位出勤率" name="second">配置管理</el-tab-pane>
    <el-tab-pane label="个人出勤率" name="third">角色管理</el-tab-pane>
  </el-tabs>
  </div>
</template>

<script>
import department from './tablepage/department'
  export default {
    data() {
      return {
        activeName2:'first',
      }
    },
    components:{
      department
    },
    methods: {
      handleClick(){

      }
    },
  }
</script>

<style lang="less" scoped>
.attendance_body{
  padding: 20px;
}
</style>