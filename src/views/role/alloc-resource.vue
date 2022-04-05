<template>
  <div class="allc-resource">
    <el-card>
      <div slot="header"><span>分配资源</span></div>
      <el-tree ref='resource-tree' node-key='id' :data="resources"
       :props="defaultProps"
       show-checkbox
       default-expand-all
       :default-checked-keys="defaultCheckedKeys"
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
import { getResourceCategories } from '@/services/resource-category'
import { getRoleResources, allocateRoleResources, getAllResources } from '@/services/resource'
import { Tree } from 'element-ui'
export default Vue.extend({
  name: 'alloc-resource',
  props: {
    roleId: { /// /roleId其实可以从roouter的params中获取，但为了和路由解耦，所以此处通过路由中的props传递,
    /// /这样这个组件既可以作为路由组件也可以作为普通组件来使用了
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      resources: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultCheckedKeys: []
    }
  },
  created () {
    this.loadResources()
    this.loadRoleResources()
  },
  methods: {
    // 获取全部资源
    async loadResources () {
      const ret = await Promise.all([getAllResources(), getResourceCategories()])
      const resources = ret[0].data.data
      const resourceCategories = ret[1].data.data
      resources.forEach((r: any) => {
        const category = resourceCategories.find((c: any) => c.id === r.categoryId)
        if (category) {
          category.children = category.children || []
          category.children.push(r)
        }
      })
      // 修改顶层分类 ID：因为分类 ID 和资源 ID 冲突
      resourceCategories.forEach((item: any) => {
        item.id = Math.random()
      })

      this.resources = resourceCategories
    },
    // 已有资源数组
    getCheckedResources (resources: any) {
      resources.forEach((r: any) => {
        r.resourceList && r.resourceList.forEach((c: any) => {
          if (c.selected) {
            this.defaultCheckedKeys = [...this.defaultCheckedKeys, c.id] as any
          }
        })
      })
    },
    /// 获取当前用户已有资源
    async loadRoleResources () {
      const { data } = await getRoleResources(this.roleId)
      this.getCheckedResources(data.data)
    },
    // 保存选择的资源
    async onSave () {
      // 拿到选中节点
      const checkedNodes = (this.$refs['resource-tree'] as Tree).getCheckedNodes()
      const resourceIdList: number[] = []
      checkedNodes.forEach(item => {
        if (!item.children) {
          resourceIdList.push(item.id)
        }
      })
      const { data } = await allocateRoleResources({
        roleId: this.roleId,
        resourceIdList
      })
      console.log(data)

      this.$message.success('保存成功')
      this.$router.back()
    },
    resetChecked () {
      (this.$refs['resource-tree'] as Tree).setCheckedKeys([])
    }
  }
})
</script>
<style lang="scss" scoped>

</style>
