import storage from '@/utils/storage/index'
import { defaultColors } from '@/assets/js/background'
export default {
  filters: {
    time (time) {
      if (!time) {
        return '0/0/0'
      }
      let newTime = new Date(time * 1000)
      let dateString = newTime.toLocaleDateString().replace(/\//g, '/')
      return dateString
    }
  },
  data () {
    return {
      defaultColors
    }
  },
  methods: {
    changeTheme (item) {
      let app = document.querySelector('#app')
      app.style.background = item.background
      storage.set('theme', item.background)
    },
    statusColor (start, end, achieve) {
      if (achieve) return 'color: #67C23A'
      switch (this.status(start, end)) {
        case '进行中':
          return 'color: #409EFF'
        case '已超时':
          return 'color: #F56C6C'
        case '未开始':
          return 'color: #909399'
        default:
          return ''
      }
    },
    status (start, end, achieve) {
      if (achieve) return '已完成'
      const ended = end + 24 * 60 * 60 * 1000
      const now = new Date().getTime()
      if (start <= now && now <= ended) {
        return '进行中'
      } else if (now > ended) {
        return '已超时'
      } else if (now < start) {
        return '未开始'
      } else {
        return '---'
      }
    },
    refreshData () {
      let btn = document.querySelector('.refreshTask')
      btn.classList.add('rotate_refresh')
      setTimeout(function () {
        btn.classList.remove('rotate_refresh')
      }, 500)
      this.getData()
    }
  }
}
