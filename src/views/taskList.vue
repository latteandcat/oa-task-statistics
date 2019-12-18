<template>
  <div class="submitWrapper">
    <div class="submitHeader">
      <div class="right">
        <div>Yioks任务统计系统</div>
        <div class="btn" title="刷新任务列表" @click="refreshData">
          <i class="el-icon-refresh-right refreshTask" />
        </div>
        <div class="btn" title="添加任务" @click="addTask">
          <i class="el-icon-circle-plus" />
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
        <el-popover placement="bottom" width="96" title="当前任务统计" trigger="hover" popper-class="dataPoper">
          <div class="dataWrapper">
            <div class="gray"><i class="el-icon-s-flag" />未开始: <span>{{ taskSta.notStart }}</span></div>
            <div class="blue"><i class="el-icon-s-flag" />进行中: <span>{{ taskSta.underWay }}</span></div>
            <div class="green"><i class="el-icon-s-flag" />已完成: <span>{{ taskSta.finished }}</span></div>
            <div class="red"><i class="el-icon-s-flag" />已超时: <span>{{ taskSta.delayed }}</span></div>
          </div>
          <div slot="reference" class="btn">
            <i class="el-icon-s-data" />
          </div>
        </el-popover>
        <div class="btn" @click="getCapture(name)">
          <i class="el-icon-camera-solid" />
        </div>
        <div class="btn" title="操作手册" @click="userNoteDialog=true">
          <i class="el-icon-question" />
        </div>
      </div>
      <div>当前用户: <span>{{ name }}</span></div>
    </div>
    <div class="scrollArea">
      <vue-scroll>
        <div id="captureContent" class="submitContent">
          <div v-if="showEmpty" class="submitItem">您当前暂无任务</div>
          <div v-for="(item,index) in tasks" :key="index" class="submitItem">
            <div class="left">
              <div
                :title="item.achieve ? '取消完成':'完成任务'"
                :class="item.btnClass"
                @click="changeTaskStatus(item, index)">
                <i class="el-icon-check"></i>
              </div>
              <div class="content" :style="item.achieve ? 'text-decoration:line-through;color:#9e9e9e;' : ''">
                {{ item.taskContent }}
              </div>
            </div>
            <div class="right">
              <div class="flag">
                <div>
                  <i class="el-icon-s-flag" :style="statusColor(item.taskStartTime*1000, item.taskEndTime*1000, item.achieve)"></i>
                  <span class="status" :style="statusColor(item.taskStartTime*1000, item.taskEndTime*1000, item.achieve)">
                    {{ status(item.taskStartTime*1000, item.taskEndTime*1000, item.achieve) }}
                  </span>
                </div>
                <div class="date">
                  <i class="el-icon-date"></i>
                  {{ item.taskStartTime | time }} ~ {{ item.taskEndTime | time }}
                  <el-popover v-if="isOverWeek(item.taskStartTime*1000, item.taskEndTime*1000)" placement="bottom" width="130" trigger="hover">
                    该任务时间跨度过长请注意合理拆分任务
                    <i slot="reference" class="el-icon-warning-outline warn" />
                  </el-popover>
                </div>
              </div>
              <i class="el-icon-edit-outline edit" @click="editTask(item)"></i>
            </div>
          </div>
        </div>
      </vue-scroll>
    </div>
    <user-note :visible="userNoteDialog" @flag="changeFlag"/>
    <el-dialog
      :visible.sync="addDialog"
      width="700px"
      title="添加任务"
      top="8%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false">
      <el-form
        ref="addTaskForm"
        :model="addTaskForm"
        :rules="addTaskRules"
        label-position="left"
        label-width="100px">
        <el-form-item prop="taskContent">
          <span slot="label"><i class="el-icon-postcard"></i> 任务内容</span>
          <el-input v-model="addTaskForm.taskContent" size="medium" />
        </el-form-item>
        <el-form-item prop="taskDate">
          <span slot="label"><i class="el-icon-alarm-clock"></i> 任务日期</span>
           <el-date-picker
            v-model="addTaskForm.taskDate"
            type="daterange"
            size="medium"
            range-separator="-"
            value-format="timestamp"
            start-placeholder="任务开始日期"
            end-placeholder="任务结束日期"
            @change="changeDate">
          </el-date-picker>
        </el-form-item>
        <div class="formBtns">
          <el-button :loading="addTaskLoading" type="primary" size="medium" @click="submitTaskForm">保存</el-button>
          <el-button size="medium" @click="cancelSubmitTaskForm">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
    <el-dialog
      :visible.sync="editDialog"
      width="700px"
      title="编辑任务"
      top="8%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false">
      <el-form
        ref="editTaskForm"
        :model="editTaskForm"
        :rules="editTaskRules"
        label-position="left"
        label-width="100px">
        <el-form-item prop="taskContent">
          <span slot="label"><i class="el-icon-postcard"></i> 任务内容</span>
          <el-input v-model="editTaskForm.taskContent" size="medium" />
        </el-form-item>
        <el-form-item prop="taskDate">
          <span slot="label"><i class="el-icon-alarm-clock"></i> 任务日期</span>
           <el-date-picker
            v-model="editTaskForm.taskDate"
            type="daterange"
            size="medium"
            range-separator="-"
            value-format="timestamp"
            start-placeholder="任务开始日期"
            end-placeholder="任务结束日期"
            @change="changeEditDate">
          </el-date-picker>
        </el-form-item>
        <div class="formBtns">
          <el-button :loading="editTaskLoading" type="primary" size="medium" @click="submitEditTaskForm">保存</el-button>
          <el-button size="medium" @click="cancelSubmitEditTaskForm">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import storage from '@/utils/storage/index'
import task from '@/api/task'
import taskMixin from '@/mixins/taskList'
import commonMixin from '@/mixins/common'
import captureMixin from '@/mixins/capture'
export default {
  mixins: [taskMixin, commonMixin, captureMixin],
  methods: {
    getUserInfo () {
      task.getUserInfo().then(res => {
        if (res.code && res.code === 'UNREGISTERED') {
          this.$prompt('请绑定真实姓名', '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            showClose: false,
            closeOnPressEscape: false,
            closeOnClickModal: false,
            inputPlaceholder: '请输入真实姓名',
            inputValidator (value) {
              if (!value) {
                return '您尚未绑定姓名，请输入真实姓名！'
              } else {
                return true
              }
            },
            beforeClose: (action, instance, done) => {
              task.addUser(instance.inputValue).then(res => {
                if (!res.code) {
                  storage.set('userInfo', {
                    idName: res.idName,
                    uuid: res.uuid
                  })
                  done()
                  this.$notify({
                    title: '成功',
                    message: '绑定成功',
                    type: 'success',
                    offset: 80
                  })
                  this.getUserInfo()
                } else {
                  this.$notify({
                    title: '提示',
                    message: res.massage,
                    type: 'warning',
                    offset: 80
                  })
                }
              }).catch(() => {
                this.$notify({
                  title: '提示',
                  message: '绑定失败，请稍后重试',
                  type: 'warning',
                  offset: 80
                })
              })
            }
          })
        } else {
          storage.set('userInfo', {
            idName: res.idName,
            uuid: res.uuid
          })
          this.name = res.idName
          this.uuid = res.uuid
          this.getMyTaskList()
        }
      }).catch(() => {
        this.$notify({
          title: '提示',
          message: '用户信息获取失败，请稍后重试',
          type: 'warning',
          offset: 80
        })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~@/assets/css/base.styl';
</style>
