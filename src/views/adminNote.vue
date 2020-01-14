<template>
  <el-dialog
    title="操作手册"
    :visible.sync="flag"
    width="80%"
    top="80px"
  >
    <el-collapse v-model="activeName">
      <el-collapse-item name="1">
        <template slot="title">
          <span class="blue">系统使用<i class="el-icon-s-opportunity"></i></span>
        </template>
        <div>该系统使用ip自动登录，每个人只能查看自己的任务，有管理员权限的IP才能查看管理员列表</div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <span class="red">请假记录规则<i class="el-icon-warning"></i></span>
        </template>
        <div>用户需每天8~11点打开电脑（需要关闭防火墙）或每天6点以后打开页面自动登录一次，否则自动记为请假</div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          <span class="blue">任务显示规则<i class="el-icon-s-order"></i></span>
        </template>
        <div><i class="el-icon-football" />进行中任务或未开始任务</div>
        <div><i class="el-icon-football" />已完成但结束时间未到的任务</div>
        <div><i class="el-icon-football" />已超时任务（未完成但结束时间已到）</div>
      </el-collapse-item>
      <el-collapse-item name="4">
        <template slot="title">
          <span class="blue">任务全部完成<i class="el-icon-s-claim"></i></span>
        </template>
        <div>除未开始任务外的所有任务全部完成</div>
      </el-collapse-item>
    </el-collapse>
  </el-dialog>
</template>

<script>
export default {
  props: ['visible'],
  data () {
    return {
      activeName: ''
    }
  },
  computed: {
    flag: {
      set (bool) {
        this.$emit('flag', bool)
      },
      get () {
        return this.visible
      }
    }
  },
  watch: {
    visible (val) {
      if (!val) {
        this.activeName = ''
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.red
  color #F56C6C
.blue
  color #409EFF
</style>
