<template>
  <div>
    <el-button type="primary" @click="lookChannel">获取通道信息</el-button>
  </div>
</template>

<script>
export default {
  name: "updateChannel",
  data() {
    return {

    }
  },
  methods: {
    lookChannel() {
      this.look = this.$route.query.row
      this.$message({
        message: this.look,
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>

</style>