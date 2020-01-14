<template>
  <div class="pageWrap">
    <div class="pageHeader">
      <div class="title">Yioks任务统计系统-管理员列表</div>
      <div class="title_mobile">任务统计-管理员</div>
      <div class="btns">
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
        <div class="btn" title="操作手册" @click="adminNoteDialog=true">
          <i class="el-icon-question" />
        </div>
      </div>
    </div>
    <div class="pageContent">
      <div v-if="showPermission" class="userItem">您暂无权限查看该页面</div>
      <div
        v-for="(item, index) in tasks"
        :key="index"
        :class="{
          userItem: true,
          allAchieved: isAllAchieved(item.user.lastLoginTime, item.tasks),
          isNoTask: item.tasks.length === 0
        }"
        >
        <div class="userInfo">
          <div class="infoItem">
            <div>
              <i class="el-icon-user-solid" />{{ item.user.idName }}
              <i class="el-icon-s-platform" />{{ item.user.position }}
            </div>
            <div v-if="isOutWork(item.user.lastLoginTime) === '请假'" class="warn">
              <i class="el-icon-info" />{{ isOutWork(item.user.lastLoginTime) }}
            </div>
          </div>
        </div>
        <div class="userTasks">
          <div v-if="item.tasks.length === 0" class="taskItem notask"><i class="el-icon-warning" />暂无任务</div>
          <div v-for="(task, i) in item.tasks" :key="i" class="taskItem">
            <div :style="task.achieve ? 'text-decoration:line-through;color:#9e9e9e;' : ''">
              <span>{{ i+1 }}</span>.
              <span>{{ task.taskContent }}</span>
            </div>
            <div class="flags">
              <div style="margin-right: 5px;">
                <i class="el-icon-s-flag" :style="statusColor(task.taskStartTime*1000, task.taskEndTime*1000, task.achieve)"></i>
                <span class="status" :style="statusColor(task.taskStartTime*1000, task.taskEndTime*1000, task.achieve)">
                  {{ status(task.taskStartTime*1000, task.taskEndTime*1000, task.achieve) }}
                </span>
              </div>
              <el-popover
                placement="bottom-end"
                trigger="hover"
                popper-class="datePopper">
                <span>{{ task.taskStartTime | time }} ~ {{ task.taskEndTime | time }}</span>
                <i slot="reference" class="el-icon-date date_mobile"></i>
              </el-popover>
              <div class="date">
                <i class="el-icon-date"></i>
                <span>{{ task.taskStartTime | time }} ~ {{ task.taskEndTime | time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <admin-note :visible="adminNoteDialog" @flag="changeFlag"/>
    <el-dialog
      width="80%"
      :visible.sync="showLoginDia"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false">
      <div slot="title" class="loginDiaHeader">
        <span>请登录</span>
        <el-button-group v-if="!isMobile">
          <el-button type="primary" size="mini" @click="loginType='password'">密码登录</el-button>
          <el-button type="primary" size="mini" @click="wechatLogin">微信登录</el-button>
        </el-button-group>
      </div>
      <div v-show="loginType==='password'">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" label-position="left" label-width="auto">
          <el-form-item label="真实姓名" prop="idName">
            <el-input v-model="loginForm.idName"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" show-password></el-input>
          </el-form-item>
          <div style="display:flex;justify-content:center;">
            <el-button :loading="loginLoading" type="primary" @click="passLogin">登录</el-button>
          </div>
        </el-form>
      </div>
      <div v-show="loginType==='wechat'" id="wechatLogin" class="wechatLogin">

      </div>
    </el-dialog>
  </div>
</template>

<script>
import task from '@/api/task'
import commonMixin from '@/mixins/common'
import captureMixin from '@/mixins/capture'
import wechat from '@/api/wechat'
import storage from '@/utils/storage'
import { WxLogin } from '@/assets/js/wechat'
export default {
  components: {
    'admin-note': () => import('@/views/adminNote')
  },
  mixins: [commonMixin, captureMixin],
  data () {
    return {
      showPermission: false,
      tasks: [],
      adminNoteDialog: false,
      showLoginDia: false,
      loginLoading: false,
      loginForm: {
        idName: '',
        password: ''
      },
      loginRules: {
        idName: [
          { required: true, message: '请输入真实姓名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      },
      loginType: 'password',
      isMobile: false
    }
  },
  mounted () {
    if (this.$route.query.code && this.$route.query.state) {
      this.loginType = 'wechat'
      this.wechatCheck() // 微信登录代码
    } else {
      this.passCheck()
    }
    this.isMobile = !!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  },
  methods: {
    passCheck () {
      task.checkLogin()
        .then(res => {
          if (res) {
            this.getData()
          } else {
            this.showLoginDia = true
            this.$nextTick(() => {
              this.$refs.loginForm.resetFields()
            })
          }
        }).catch(() => {
          this.showLoginDia = true
          this.$nextTick(() => {
            this.$refs.loginForm.resetFields()
          })
        })
    },
    passLogin () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loginLoading = true
          task.passLogin(this.loginForm)
            .then(res => {
              if (res.code) {
                this.$message({
                  showClose: true,
                  message: res.message,
                  type: 'error'
                })
              } else {
                storage.set('token', res.loginToken)
                this.getData()
                this.showLoginDia = false
              }
              this.loginLoading = false
            }).catch(() => {
              this.loginLoading = false
            })
        } else {
          return false
        }
      })
    },
    wechatLogin () {
      this.loginType = 'wechat'
      let num = new Date().getTime().valueOf()
      WxLogin({
        self_redirect: false,
        id: 'wechatLogin',
        appid: 'wx64d310062380831c',
        scope: 'snsapi_login',
        redirect_uri: 'http://task.yioks.org/admin',
        state: num,
        style: '',
        href: ''
      })
    },
    wechatCheck () {
      wechat.login({
        code: this.$route.query.code,
        state: this.$route.query.state
      }).then(res => {
        if (res.code) {
          if (res.code === 'PERMISSION') {
            this.showPermission = true
          } else if (res.code === 'WECHAT-LOGIN-ERROR') {
            this.showLoginDia = true
            this.$nextTick(() => {
              let num = new Date().getTime().valueOf()
              WxLogin({
                self_redirect: false,
                id: 'wechatLogin',
                appid: 'wx64d310062380831c',
                scope: 'snsapi_login',
                redirect_uri: 'http://task.yioks.org/admin',
                state: num,
                style: '',
                href: ''
              })
            })
          }
        } else {
          // *绑定idName res.bindingUser
          if (res.bindingUser) {
            storage.set('token', res.loginToken)
            this.getData()
            return false
          }
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
              wechat.bind(instance.inputValue).then(res => {
                if (!res.code) {
                  storage.set('token', res.loginToken)
                  this.getData()
                  done()
                  this.$notify({
                    title: '成功',
                    message: '绑定成功',
                    type: 'success',
                    offset: 80
                  })
                } else {
                  this.$notify({
                    title: '提示',
                    message: res.message,
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
        }
      })
    },
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
          this.tasks = []
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
@import '~@/assets/css/admin.styl';
</style>

<style lang="stylus">
.pageWrap
  .el-dialog
    max-width 500px
</style>
