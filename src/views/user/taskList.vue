<template>
  <div class="taskList">
    <div class="taskItem">
      <div class="uncheckBtn">
        <i class="el-icon-check"></i>
      </div>
      <div class="taskContent">
        测试任务测试任务测试任务测试任务测试任务测试任务测试任务测试任务
        测试任务测试任务测试任务测试任务测试任务测试任务测试任务测试任务
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="stylus" scoped>
.taskList
  width 100%
  .taskItem
    background-color #ffffff
    padding 10px 0
    border-radius 5px
    display flex
    align-items center
    cursor default
    &:hover
      background-color #F5F5F5
      .uncheckBtn
        color #F5F5F5
    .uncheckBtn
      margin 0 15px
      width 30px
      height 30px
      flex-shrink 0
      // align-self center
      display flex
      justify-content center
      align-items center
      border-radius 50%
      border 2px solid #737373
      color #ffffff
      cursor pointer
      i
        font-weight bold
      &:hover
        color #737373
    .taskContent
      margin-right 10px
  .taskInfo
    padding 10px
    .title
      display flex
      justify-content space-between
      align-items center
      margin-bottom 10px
</style>
