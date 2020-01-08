<template>
  <div class="pageWrap">
    <div class="pageHeader">
      <div class="title">Yioks任务统计系统</div>
      <div class="btns">
        <div class="btn" title="任务列表">
          <i class="el-icon-tickets" />
        </div>
        <div class="btn" title="添加任务">
          <i class="el-icon-circle-plus" />
        </div>
        <div class="btn" title="任务统计">
          <i class="el-icon-s-data" />
        </div>
        <div class="btn" title="更换主题">
          <i class="el-icon-brush" />
        </div>
        <div class="btn" title="操作手册">
          <i class="el-icon-question" />
        </div>
        <div class="btn" title="用户信息">
          <i class="el-icon-user" />
        </div>
      </div>
      <div class="btns_m">
        <el-dropdown>
          <div class="btn" title="用户信息">
            <i class="el-icon-more-outline" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><i class="el-icon-tickets" />任务列表</el-dropdown-item>
            <el-dropdown-item><i class="el-icon-circle-plus" />添加任务</el-dropdown-item>
            <el-dropdown-item><i class="el-icon-s-data" />任务统计</el-dropdown-item>
            <el-dropdown-item divided><i class="el-icon-brush" />更换主题</el-dropdown-item>
            <el-dropdown-item><i class="el-icon-question" />操作手册</el-dropdown-item>
            <el-dropdown-item><i class="el-icon-user" />用户信息</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <div class="pageContent">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="stylus" scoped>
</style>
