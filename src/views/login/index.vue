<template>
  <div class="login">
  <h2>学习管理系统</h2>
  <el-form class='login-form' :model="form" :rules="rules" ref="ruleForm" label-position="top" label-width="80px">
    <el-form-item label="手机号" prop='phone'>
      <el-input v-model="form.phone"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop='password'>
      <el-input v-model="form.password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button class='login-btn' type="primary" @click="onSubmit" :loading="loading">登录</el-button>
    </el-form-item>
</el-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// import request from '@/utils/request'
// import qs from 'qs'
import { login } from '@/services/user'
import { Form } from 'element-ui'
export default Vue.extend({
  name: 'LoginIndex',
  data () {
    return {
      form: {
        phone: '18201288771',
        password: '111111'
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  methods: {
    async onSubmit () {
      // 表单验证
      try {
        // const data = { state: 1, message: 'success', content: '{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTAwMDMwMDE5IiwidXNlcl9uYW1lIjoiMTgyMDEyODg3NzEiLCJzY29wZSI6WyJyZWFkIl0sIm9yZ2FuaXphdGlvbiI6IjE4MjAxMjg4NzcxIiwiZXhwIjoxNjQ4ODA5NDE4LCJhdXRob3JpdGllcyI6WyIzMzMiLCJBRE1JTiJdLCJqdGkiOiJrZ2Z2R0VWVG4zTUM2ejBaQkVSTUhDZUZQeHciLCJjbGllbnRfaWQiOiJ0ZXN0X2NsaWVudCJ9.VoPPZhOj1wtriZX9wc_5ZOfs52dwU52qUQ9j-WnIXVI","token_type":"bearer","refresh_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTAwMDMwMDE5IiwidXNlcl9uYW1lIjoiMTgyMDEyODg3NzEiLCJzY29wZSI6WyJyZWFkIl0sIm9yZ2FuaXphdGlvbiI6IjE4MjAxMjg4NzcxIiwiYXRpIjoia2dmdkdFVlRuM01DNnowWkJFUk1IQ2VGUHh3IiwiZXhwIjoxNjQ4OTEwMjE4LCJhdXRob3JpdGllcyI6WyIzMzMiLCJBRE1JTiJdLCJqdGkiOiJKdDZhOXVENjZycGtTUzQxS3prUkd1dTg4bUUiLCJjbGllbnRfaWQiOiJ0ZXN0X2NsaWVudCJ9.WUoRcdrgybSQFdWkZQOb80ktbdc9KZoaMOblXK5id0Q","expires_in":7159,"scope":"read","user_id":"100030019","organization":"18201288771","jti":"kgfvGEVTn3MC6z0ZBERMHCeFPxw"}', success: true }/// 假数据
        // 登录按钮 loading
        this.loading = true
        // validate()被ts验证认成vue的函数了，把格式转换为any
        await (this.$refs.ruleForm as Form).validate() /// 验证失败会抛出一个promise异常，需要捕获
        // 验证通过--提交表单
        const { data } = await login(this.form)/// 封装,this.from需要符合参数类型规定
        // const { data } = await request({
        //   method: 'post',
        //   url: '/front/user/login',
        //   headers: { 'content-type': 'application/x-www-form-urlencoded' }, /// 安装qs包
        //   data: qs.stringify(this.form)/// axios默认发送的是application-json格式,此接口用的是x-www-form-urlencoded
        // })
        // 处理结果
        if (data.state !== 1) {
          return this.$message({ showClose: true, message: '登录失败', type: 'error' })
        } else {
          // 1. 登录成功，记录登录状态，状态需要能够全局访问（放到 Vuex 容器中）
          this.$store.commit('setUser', data.content)
          // 2. 然后在访问需要登录的页面的时候判断有没有登录状态（路由拦截器）
          //    成功：跳转回原来页面或首页
          this.$router.push(this.$route.query.redirect as string || '/')
          // this.$router.push({ name: 'home' })
          this.$message.success('登录成功')
        }
        this.loading = false
      } catch (err) {
        this.$message.error('登录失败')
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.login{
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .login-form{
    width:300px;
    background: #fff;
    padding: 20px;
    border-radius: 5px;
  }
  .login-btn{
    width: 100%;
  }
}
</style>
