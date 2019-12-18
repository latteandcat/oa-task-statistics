import storage from '@/utils/storage/index'
import task from '@/api/task'
export default {
  components: {
    'user-note': () => import('@/views/userNote')
  },
  data () {
    return {
      name: '- - -',
      uuid: '',
      tasks: [],
      taskSta: {
        notStart: 0,
        underWay: 0,
        finished: 0,
        delayed: 0
      },
      addTaskLoading: false,
      editTaskLoading: false,
      showEmpty: false,
      addDialog: false,
      addTaskForm: {
        taskContent: '',
        taskDate: []
      },
      addTaskRules: {
        taskContent: [
          { required: true, message: '请输入任务内容', trigger: 'blur' }
        ],
        taskDate: [
          { required: true, message: '请选择任务日期', trigger: 'change' }
        ]
      },
      editDialog: false,
      editTaskForm: {
        taskContent: '',
        taskDate: [],
        taskUuid: ''
      },
      editTaskRules: {
        taskContent: [
          { required: true, message: '请输入任务内容', trigger: 'blur' }
        ],
        taskDate: [
          { required: true, message: '请选择任务日期', trigger: 'change' }
        ]
      },
      userNoteDialog: false
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      if (storage.get('userInfo') && storage.get('userInfo').idName && storage.get('userInfo').uuid) {
        this.name = storage.get('userInfo').idName
        this.uuid = storage.get('userInfo').uuid
        this.getMyTaskList()
      } else {
        this.getUserInfo()
      }
    },
    addUser (idName) {
      task.addUser(idName).then(res => {
        if (!res.code) {
          this.$notify({
            title: '成功',
            message: '绑定成功',
            type: 'success',
            offset: 80
          })
          this.getUserInfo()
        } else {
          this.getUserInfo()
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
    },
    getMyTaskList () {
      this.showEmpty = false
      task.getMyTaskList(this.uuid).then(res => {
        if (!res.code) {
          this.tasks = res.map(item => {
            return {
              ...item,
              btnClass: item.achieve ? 'checkBtnStart' : 'uncheckBtn'
            }
          })
          this.computedTaskSta(res)
          if (res.length === 0) this.showEmpty = true
        } else {
          this.getUserInfo()
        }
      }).catch(() => {
        this.$notify({
          title: '提示',
          message: '任务列表获取失败，请稍后重试',
          type: 'warning',
          offset: 80
        })
      })
    },
    computedTaskSta (tasks) {
      let taskSta = {
        notStart: 0,
        underWay: 0,
        finished: 0,
        delayed: 0
      }
      tasks.forEach(item => {
        let status = this.status(item.taskStartTime * 1000, item.taskEndTime * 1000, item.achieve)
        switch (status) {
          case '未开始':
            taskSta.notStart++
            break
          case '进行中':
            taskSta.underWay++
            break
          case '已完成':
            taskSta.finished++
            break
          case '已超时':
            taskSta.delayed++
            break
          default:
            break
        }
      })
      this.taskSta = taskSta
    },
    addTask () {
      this.addDialog = true
      this.addTaskLoading = false
      this.$nextTick(() => {
        this.$refs.addTaskForm.resetFields()
      })
    },
    changeDate () {
      if (this.addTaskForm.taskDate) {
        const max = this.addTaskForm.taskDate[1]
        const now = new Date().getTime()
        if (max < now - 24 * 60 * 60 * 1000) {
          this.$notify({
            title: '提示',
            message: '任务结束日期不能早于当前日期请重新选择任务日期',
            type: 'warning',
            offset: 80
          })
          this.$set(this.addTaskForm, 'taskDate', [])
        }
      }
    },
    changeEditDate () {
      if (this.editTaskForm.taskDate) {
        const max = this.editTaskForm.taskDate[1]
        const now = new Date().getTime()
        if (max < now - 24 * 60 * 60 * 1000) {
          this.$notify({
            title: '提示',
            message: '任务结束日期不能早于当前日期请重新选择任务日期',
            type: 'warning',
            offset: 80
          })
          this.$set(this.editTaskForm, 'taskDate', [])
        }
      }
    },
    submitTaskForm () {
      this.$refs.addTaskForm.validate((valid) => {
        if (valid) {
          this.addTaskLoading = true
          task.replaceTask({
            'taskContent': this.addTaskForm.taskContent,
            'taskEndTime': this.addTaskForm.taskDate[1] / 1000,
            'taskStartTime': this.addTaskForm.taskDate[0] / 1000,
            'userUuid': this.uuid
          }).then(res => {
            if (!res.code) {
              this.$notify({
                title: '成功',
                message: '任务添加成功',
                type: 'success',
                offset: 80
              })
              this.addDialog = false
              this.getMyTaskList()
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
              title: '成功',
              message: '任务添加失败，请稍后重试',
              type: 'error',
              offset: 80
            })
            this.addTaskLoading = false
          })
        } else {
          this.$notify({
            title: '提示',
            message: '请完善任务表单',
            type: 'warning',
            offset: 80
          })
          return false
        }
      })
    },
    cancelSubmitTaskForm () {
      this.$refs.addTaskForm.resetFields()
      this.addDialog = false
    },
    submitEditTaskForm () {
      this.$refs.editTaskForm.validate((valid) => {
        if (valid) {
          this.editTaskLoading = true
          task.replaceTask({
            'taskContent': this.editTaskForm.taskContent,
            'taskEndTime': this.editTaskForm.taskDate[1] / 1000,
            'taskStartTime': this.editTaskForm.taskDate[0] / 1000,
            'taskUuid': this.editTaskForm.taskUuid,
            'userUuid': this.uuid
          }).then(res => {
            if (!res.code) {
              this.$notify({
                title: '成功',
                message: '任务编辑成功',
                type: 'success',
                offset: 80
              })
              this.editDialog = false
              this.getMyTaskList()
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
              title: '成功',
              message: '任务编辑失败，请稍后重试',
              type: 'error',
              offset: 80
            })
            this.editTaskLoading = false
          })
        } else {
          this.$notify({
            title: '提示',
            message: '请完善任务表单',
            type: 'warning',
            offset: 80
          })
          return false
        }
      })
    },
    cancelSubmitEditTaskForm () {
      this.$refs.editTaskForm.resetFields()
      this.editDialog = false
    },
    changeTaskStatus (item, index) {
      task.changeTaskStatus({
        'achieve': !item.achieve,
        'taskUuid': item.uuid
      }).then(res => {
        this.$notify({
          title: '成功',
          message: '操作成功',
          type: 'success',
          offset: 80
        })
        this.tasks.splice(index, 1, {
          ...item,
          btnClass: !item.achieve ? 'checkBtn' : 'uncheckBtn'
        })
        setTimeout(() => {
          this.getMyTaskList()
        }, 500)
      }).catch(() => {
        this.$notify({
          title: '提示',
          message: '操作失败，请稍后重试',
          type: 'warning',
          offset: 80
        })
      })
    },
    editTask (item) {
      if (item.locking) {
        this.$notify({
          title: '提示',
          message: '任务已被锁定，暂时无法编辑',
          type: 'warning',
          offset: 80
        })
      } else {
        this.$set(this.editTaskForm, 'taskContent', item.taskContent)
        this.$set(this.editTaskForm, 'taskUuid', item.uuid)
        this.$set(this.editTaskForm, 'taskDate', [
          item.taskStartTime * 1000,
          item.taskEndTime * 1000
        ])
        this.editDialog = true
        this.editTaskLoading = false
      }
    },
    changeFlag (bool) {
      this.userNoteDialog = bool
    },
    isOverWeek (start, end) {
      let time = end - start
      if (time > 7 * 24 * 60 * 60 * 1000) {
        return true
      } else {
        return false
      }
    }
  }
}
