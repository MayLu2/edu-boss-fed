<template>
  <div class="allc-menu">
    <el-card>
      <div slot="header"><span>分配权限</span></div>
      <el-tree ref='menu-tree' node-key='id' :data="menus"
       :props="defaultProps"
       show-checkbox
       default-expand-all
       :default-checked-keys="checkedKeys"
       ></el-tree>
    <div style="text-align:center">
      <el-button @click='resetChecked'>清空</el-button>
      <el-button type="primary" @click="onSave">保存</el-button>
    </div>
    </el-card>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu'
import { Tree } from 'element-ui'
export default Vue.extend({
  name: 'alloc-menu',
  props: {
    roleId: { /// /roleId其实可以从roouter的params中获取，但为了和路由解耦，所以此处通过路由中的props传递,
    /// /这样这个组件既可以作为路由组件也可以作为普通组件来使用了
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      menus: [],
      defaultProps: {
        children: 'subMenuList',
        label: 'name'
      },
      checkedKeys: []
    }
  },
  created () {
    this.loadMenu()
    this.loadRoleMenus()
  },
  methods: {
    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)
      this.getCheckedKeys(data.data)
    },
    getCheckedKeys (menus:any) {
      menus.forEach((menu:any) => {
        if (menu.selected) {
          // this.checkedKeys.push(menu.id as never)/// 报错，不能将any放在never的数组中，所以需要as never
          // push没有触发视图更新，所以改为赋值的方式
          this.checkedKeys = [...this.checkedKeys, menu.id] as any
        }
        if (menu.subMenuList) {
          this.getCheckedKeys(menu.subMenuList)/// 递归遍历
        }
      })
    },
    async loadMenu () {
      const { data } = await getMenuNodeList()
      this.menus = data.data
    },
    async onSave () {
      // 拿到选中节点的数据id列表
      const menuIdList = (this.$refs['menu-tree'] as Tree).getCheckedKeys()
      // 请求提交保存
      const { data } = await allocateRoleMenus({
        roleId: this.roleId,
        menuIdList
      })
      // console.log(data)
      if (data.code === '000000') {
        this.$message.success('保存成功')
        this.$router.back()
      } else {
        this.$message.info(data.mesg)
      }
    },
    resetChecked () {
      (this.$refs['menu-tree'] as Tree).setCheckedKeys([])
    }
  }
})
</script>
<style lang="scss" scoped>

</style>
