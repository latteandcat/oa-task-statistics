<template>
  <div class="submitWrapper">
    <div class="submitHeader">
      <div class="right">
        <div>Yioks任务统计系统</div>
        <div class="btn" @click="refreshData">
          <i class="el-icon-refresh-right refreshTask" />
        </div>
        <el-popover placement="bottom" width="180" trigger="hover" popper-class="colorPopper">
          <div class="colorWrapper">
            <div class="colorLine">
              <div
                v-for="(item, index) in defaultColors.slice(0,defaultColors.length/2)"
                :key="index"
                class="colorItem"
                :style="item"
                @click="changeTheme(item)">
              </div>
            </div>
            <div class="colorLine">
              <div
                v-for="(item, index) in defaultColors.slice(defaultColors.length/2,defaultColors.length)"
                :key="index"
                class="colorItem"
                :style="item"
                @click="changeTheme(item)">
              </div>
            </div>
          </div>
          <div slot="reference" class="btn">
            <i class="el-icon-brush" />
          </div>
        </el-popover>
        <div class="btn" @click="adminNoteDialog=true">
          <i class="el-icon-question" />
        </div>
        <div class="btn" @click="getCapture('admin')">
          <i class="el-icon-camera-solid" />
        </div>
      </div>
      <div>管理员列表</div>
    </div>
    <div class="scrollArea">
      <vue-scroll>
        <div id="captureContent" class="submitContent">
          <div v-if="showPermission" class="submitItem">您暂无权限查看该页面</div>
          <div v-for="(item, index) in tasks" :key=index class="listItem">
            <div class="left">
              <div class="infoItem">
                <i class="el-icon-user-solid" />{{ item.user.idName }}
              </div>
              <div class="infoItem">
                <i class="el-icon-s-platform" />{{ item.user.position }}
              </div>
              <div v-if="isOutWork(item.user.lastLoginTime) === '请假'" class="infoItem warn">
                <i class="el-icon-info" />{{ isOutWork(item.user.lastLoginTime) }}
              </div>
              <div v-if="isAllAchieved(item.user.lastLoginTime, item.tasks)" class="infoItem complete">
                <i class="el-icon-success" />任务全部完成
              </div>
            </div>
            <div class="right" :style="item.tasks.length > 1 ? 'padding-top: 15px;' : ''">
              <div v-for="(task, i) in item.tasks" :key="i" class="taskItem">
                <div :style="task.achieve ? 'text-decoration:line-through;color:#9e9e9e;' : ''">
                  <span>{{ i+1 }}</span>.
                  <span>{{ task.taskContent }}</span>
                </div>
                <div class="flagWrapper">
                  <div class="flag">
                    <div>
                      <i class="el-icon-s-flag" :style="statusColor(task.taskStartTime*1000, task.taskEndTime*1000, task.achieve)"></i>
                      <span class="status" :style="statusColor(task.taskStartTime*1000, task.taskEndTime*1000, task.achieve)">
                        {{ status(task.taskStartTime*1000, task.taskEndTime*1000, task.achieve) }}
                      </span>
                    </div>
                    <div class="date">
                      <i class="el-icon-date"></i>
                      <span>{{ task.taskStartTime | time }} ~ {{ task.taskEndTime | time }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="item.tasks.length === 0" class="taskItem notask"><i class="el-icon-warning" />暂无任务</div>
            </div>
          </div>
        </div>
      </vue-scroll>
    </div>
    <admin-note :visible="adminNoteDialog" @flag="changeFlag"/>
  </div>
</template>

<script>
import task from '@/api/task'
import commonMixin from '@/mixins/common'
import captureMixin from '@/mixins/capture'
export default {
  components: {
    'admin-note': () => import('@/views/adminNote')
  },
  mixins: [commonMixin, captureMixin],
  data () {
    return {
      showPermission: false,
      tasks: [],
      adminNoteDialog: false
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    isOutWork (last) {
      const time = new Date(new Date().toLocaleDateString()).getTime() + 6 * 60 * 60 * 1000
      if (last < time) {
        return '请假'
      } else {
        return '未请假'
      }
    },
    isAllAchieved (lastLoginTime, tasks) {
      if (tasks.length <= 0) return false
      if (this.isOutWork(lastLoginTime) === '请假') return false
      for (let index = 0; index < tasks.length; index++) {
        const task = tasks[index]
        const status = this.status(task.taskStartTime * 1000, task.taskEndTime * 1000, task.achieve)
        if (status === '进行中' || status === '已超时') {
          return false
        }
      }
      return true
    },
    getData () {
      task.getCurrentTaskList().then(res => {
        if (res.code && res.code === 'PERMISSION') {
          this.showPermission = true
        } else {
          this.tasks = res
        }
      })
    },
    changeFlag (bool) {
      this.adminNoteDialog = bool
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/css/base.styl';
</style>
