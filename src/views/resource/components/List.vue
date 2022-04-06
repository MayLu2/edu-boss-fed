<template>
  <div class="resourceList">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
        <el-form :inline="true" label-width="80px" ref="form" :model="form" >
          <el-form-item prop="name" label="资源名称">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item prop="url" label="资源路径">
            <el-input v-model="form.url"></el-input>
          </el-form-item>
          <el-form-item prop="categoryId" label="资源分类">
            <el-select
              v-model="form.categoryId"
              placeholder="请选择资源分类"
              clearable
            >
              <el-option
                :label="item.name"
                :value="item.id"
                v-for="item in resourceCategories"
                :key="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="onSubmit"
              :disabled="isLoading"
            >查询搜索</el-button>
            <el-button
              @click="onReset"
              :disabled="isLoading"
            >重置</el-button>
          </el-form-item>
        </el-form>
        </div>
         <el-table
            :data="resource"
            style="width: 100%; margin-bottom: 20px" v-loading="isLoading">
                <el-table-column
                type="index"
                label="编号">
                </el-table-column>
                <el-table-column
                prop="name"
                label="资源名称">
                </el-table-column>
                <el-table-column
                prop="url"
                label="资源路径">
                </el-table-column>
                <el-table-column
                prop="description"
                label="描述">
                </el-table-column>
                <el-table-column
                prop="createdTime"
                label="添加时间"
                :formatter="dataFormat">
                </el-table-column>
                <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.row)">删除</el-button>
                </template>
                </el-table-column>
         </el-table>
         <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="form.current"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="form.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount">
            </el-pagination>
    </el-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getResourcePages, deleteResoure } from '@/services/resource'
import { getResourceCategories } from '@/services/resource-category'
import { Form } from 'element-ui'
export default Vue.extend({
  name: 'ResourceList',
  data () {
    return {
      resource: [],
      form: {
        name: '',
        url: '',
        current: 1, // 默认查询第1页数据
        size: 10, // 每页大小
        categoryId: null // 资源分类
      },
      totalCount: 0,
      isLoading: false,
      currentPage: 1,
      resourceCategories: []
    }
  },
  created () {
    this.loadResources()
    this.getCategorys()
  },
  methods: {
    async getCategorys () {
      const { data } = await getResourceCategories()
      if (data.code === '000000') {
        this.resourceCategories = data.data
      }
    },
    async loadResources () {
      this.isLoading = true
      const { data } = await getResourcePages(this.form)
      if (data.code === '000000') {
        this.resource = data.data.records
        this.totalCount = data.data.total
      }
      this.isLoading = false // 关闭加载中状态
    },
    handleEdit () {
      console.log('handleEdit')
    },
    handleDelete (item:any) {
      this.$confirm('确认删除吗？', '删除提示', {}).then(async () => {
        // 请求删除接口
        const { data } = await deleteResoure(item.id)
        if (data.code === '000000') {
          this.$message.success('删除成功')
          this.loadResources()
        } else {
          this.$message.success(data.mesg)
        }
      }).catch(err => {
        console.log(err)
        this.$message.info('已取消删除')
      })
    },
    handleSizeChange (val:number) {
      this.form.size = val
      this.form.current = 1
      this.loadResources()
    },
    handleCurrentChange (val:number) {
      this.form.current = val
      this.loadResources()
    },
    onReset () {
      (this.$refs.form as Form).resetFields()
      this.form.current = 1 // 重置回到第1页
      this.loadResources()
    },
    onSubmit () {
      this.form.current = 1 // 筛选查询从第 1 页开始
      this.loadResources()
    //   网络较慢时，设置loading，避免无用重复请求
    },
    // 时间格式
    // 修改时间格式
    dataFormat: function (row:any, column:any) {
      const data = row[column.property]
      if (data === null) {
        return ''
      }
      const dt = new Date(data)
      // console.log("dt"+dt);
      return dt.getFullYear() + '-' + (dt.getMonth() + 1) + '-' + dt.getDate()
    }
  }
})
</script>

<style lang="scss" scoped></style>
