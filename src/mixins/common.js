import storage from '@/utils/storage/index'
import { defaultColors } from '@/assets/js/background'
import logo from '@/assets/images/logo.png'
import words from '@/api/words'
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
      defaultColors,
      logo,
      lifewords: {},
      isShowYioks: false,
      wordDialog: false,
      submitAddWordLoading: false,
      addWordForm: {
        'authorUuid': '',
        'content': '',
        'from': ''
      },
      addWordRules: {
        content: [
          { required: true, message: '请输入投稿的句子内容', trigger: 'blur' }
        ]
      },
      page: 0,
      wordRankDialog: false,
      rankWords: []
    }
  },
  created () {
    if (this.$route.path !== '/admin') {
      this.getLifeWord()
      this.getLifeWordRank()
    }
  },
  methods: {
    openWordRank () {
      words.getRankWord({
        page: 0,
        size: 10
      }, 'DESC', 'likeCount').then(res => {
        this.rankWords = res.content
        this.wordRankDialog = true
      })
    },
    getLifeWordRank () {
      words.getRankWord({
        page: 0,
        size: 10
      }, 'DESC', 'likeCount').then(res => {
        this.rankWords = res.content
      })
    },
    async getLifeWord () {
      const count = await words.getCount()
      if (count === 0) {
        this.isShowYioks = false
        return false
      }
      this.page = count - 1
      words.getWord({
        page: this.page,
        size: 1
      }).then(res => {
        this.lifewords = res.content[0]
        this.isShowYioks = true
      })
    },
    refreshLifeWord () {
      this.page--
      if (this.page < 0) {
        this.getLifeWord()
        return false
      }
      words.getWord({
        page: this.page,
        size: 1
      }).then(res => {
        this.lifewords = res.content[0]
        this.isShowYioks = true
      })
    },
    addWord () {
      this.wordDialog = true
      this.$nextTick(() => {
        this.$refs.addWordForm.resetFields()
      })
    },
    cancelAddWord () {
      this.wordDialog = false
    },
    submitAddWord () {
      this.$refs.addWordForm.validate(valid => {
        if (valid) {
          this.submitAddWordLoading = false
          words.replace({
            'authorUuid': this.uuid,
            'content': this.addWordForm.from === ''
              ? this.addWordForm.content
              : this.addWordForm.content + ' --- ' + this.addWordForm.from
          }).then(res => {
            this.$message.success('添加成功')
            this.wordDialog = false
            this.submitAddWordLoading = false
          }).catch(() => {
            this.submitAddWordLoading = false
          })
        } else {
          return false
        }
      })
    },
    copyLifeWord () {
      var input = document.querySelector('#copyLifeWord')
      input.select()
      document.execCommand('Copy')
      this.$message.success('复制成功')
    },
    likeLifeWord (uuid) {
      words.like(uuid)
        .then(res => {
          let likeHeart = document.createElement('div')
          likeHeart.innerText = '🧡'
          likeHeart.className = 'likeHeart'
          document.querySelector('#like').appendChild(likeHeart)
          setTimeout(() => {
            let childNodes = document.querySelector('#like').childNodes
            if (childNodes.length > 2) {
              let deleteNode = childNodes[2]
              deleteNode.parentNode.removeChild(deleteNode)
            }
          }, 1000)
        })
    },
    dislikeLifeWord (uuid) {
      words.dislike(uuid)
        .then(res => {
          let dislikeHeart = document.createElement('div')
          dislikeHeart.innerText = '🖤'
          dislikeHeart.className = 'dislikeHeart'
          document.querySelector('#dislike').appendChild(dislikeHeart)
          setTimeout(() => {
            let childNodes = document.querySelector('#dislike').childNodes
            if (childNodes.length > 2) {
              let deleteNode = childNodes[2]
              deleteNode.parentNode.removeChild(deleteNode)
            }
          }, 1000)
        })
    },
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
      this.refreshLifeWord()
    }
  }
}
