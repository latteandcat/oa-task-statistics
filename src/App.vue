<template>
  <div id="app" :style="bgColor">
    <router-view/>
  </div>
</template>
<script>
import { getRandowColor } from '@/assets/js/background'
export default {
  data () {
    return {
      bgColor: {
        background: 'linear-gradient(to right, #91EAE4, #86A8E7, #7F7FD5)'
      }
    }
  },
  mounted () {
    this.bgColor.background = getRandowColor()
  }
}
</script>

<style lang="stylus">
@import '~@/assets/css/index.styl';
</style>
