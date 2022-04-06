<template>
    <div class="course-section">
        <!-- 内容管理 -->
        <!-- 阶段列表s -->
        <el-card>
            <div class='card-header' slot="header">
                {{ course.courseName }}
                <el-button type="primary" @click='handleShowAddSection'>添加阶段</el-button>
            </div>
        <!-- 1.目录展开2.拖拽排序 draggable -->
          <el-tree
            :data="sections"
            node-key="id"
            default-expand-all
            draggable
            :props='defaultProps'>
            <div class='inner' slot-scope="{ node, data }">
                <span>{{node.label}}</span>
                <!-- section阶段 -->
                <span v-if='data.sectionName'>
                    <el-button size="mini" @click.stop="handleEditSectionShow(data)">编辑</el-button>
                    <el-button type='primary' size="mini" @click.stop="handleAddLessonShow(data)">添加课时</el-button>
                    <el-select
                       size="mini"
                        class="select-status"
                        v-model="data.status"
                        placeholder="请选择"
                        @change="handleSectionStatusChange(data)"
                        >
                        <el-option label="已隐藏" :value="0" />
                        <el-option label="待更新" :value="1" />
                        <el-option label="已更新" :value="2" />
                    </el-select>
                </span>
                <!-- lesson课时 -->
                <span v-else>
                    <el-button size="mini">编辑</el-button>
                    <el-button size="mini" type="success">上传视频</el-button>
                    <el-select
                        size="mini"
                        class="select-status"
                        v-model="data.status"
                        placeholder="请选择"
                        @change="handleLessonStatusChange(data)"
                        >
                        <el-option label="已隐藏" :value="0" />
                        <el-option label="待更新" :value="1" />
                        <el-option label="已更新" :value="2" />
                        </el-select>
                </span>
            </div>
            </el-tree>
        </el-card>
        <!-- 阶段列表s -->

        <!-- 添加或编辑section（章节） -->
        <el-dialog
        title='添加课程阶段' :visible.sync='isAddSectionShow'>
            <el-form ref="section-form" :model="section" label-width="70px">
                <el-form-item label="课程名称">
                    <el-input
                    :value="course.courseName"
                    autocomplete='off'
                    disabled>
                    </el-input>
                </el-form-item>
                <el-form-item label="章节名称" prop="sectionName">
                    <el-input v-model="section.sectionName" autocomplete="off"></el-input>
                </el-form-item>
                 <el-form-item label="章节描述" prop="description">
                    <el-input v-model="section.description" autocomplete="off"></el-input>
                </el-form-item>
                 <el-form-item label="章节排序" prop="orderNum">
                    <el-input-number v-model="section.orderNum"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isAddSectionShow=false">取消</el-button>
                <el-button type="primary" @click="handleAddSection">确定</el-button>

            </div>
        </el-dialog>
        <!-- 添加或编辑section（章节） -->

        <!-- 添加课时s -->
        <el-dialog title='添加课时' :visible.sync='isAddLessonShow'>
            <el-form ref="lesson-form" :model="lesson" label-width='100px'>
                <el-form-item label="课时名称">
                    <el-input :value="course.courseName" autocomplete="off" disabled
                    ></el-input>
                </el-form-item>
               <el-form-item label="章节名称" prop="sectionName">
                   <el-input :value="lesson.sectionName" disabled autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="课时名称" prop="sectionName">
                   <el-input v-model="lesson.theme" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="时长" prop="description">
                <el-input v-model.number="lesson.duration" type="number" autocomplete="off">
                    <template slot="append">分钟</template>
                </el-input>
                </el-form-item>
                <el-form-item label="是否开放试听" prop="description">
                    <el-switch v-model="lesson.isFree"></el-switch>
                </el-form-item>
                <el-form-item label="课时排序" prop="description">
                    <el-input-number v-model="lesson.orderNum"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isAddLessonShow=false">取消</el-button>
                <el-button type="primary" @click="handleAddLesson">确定</el-button>
            </div>

        </el-dialog>
        <!-- 添加课时e -->
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { getQueryCourses, getSectionById, saveOrUpdateSection } from '@/services/course-sections'
import { getCourseById } from '@/services/course'
import { Form } from 'element-ui'
import { saveOrUpdateLesson } from '@/services/course-lesson'
export default Vue.extend({
  name: 'CourseSection',
  props: {
    courseId: {
      type: [String, Number]
    }
  },
  data () {
    const lesson = {
      courseId: this.courseId,
      sectionId: undefined,
      sectionName: '',
      theme: '',
      duration: 0,
      isFree: false,
      orderNum: 0,
      status: 0
    }
    const section = {
      courseId: this.courseId,
      sectionName: '',
      description: '',
      orderNum: 0,
      status: 0
    }
    return {
      sections: [],
      section,
      lesson,
      defaultProps: {
        children: 'lessonDTOS',
        label (data:any) {
          return data.sectionName || data.theme
        }
      },
      course: {},
      isAddSectionShow: false,
      isAddLessonShow: false
    }
  },
  created () {
    this.loadSections()
    this.loadCourse()
  },
  methods: {
    //   获取课程内容
    async loadSections () {
      const { data } = await getQueryCourses(this.courseId)
      this.sections = data.data
    },
    // 获取课程信息
    async loadCourse () {
      const { data } = await getCourseById(this.courseId)
      this.course = data.data
    },
    /// ////编辑阶段--获取阶段信息并展示到修改框
    async handleEditSectionShow (section: any) {
      const { data } = await getSectionById(section.id)
      this.section = data.data
      this.isAddSectionShow = true
    },
    // 提交修改或添加的section阶段信息
    async handleAddSection () {
      const { data } = await saveOrUpdateSection(this.section)
      if (data.code === '000000') {
        this.loadSections()
        this.isAddSectionShow = false;
        (this.$refs['section-form'] as Form).resetFields()
        this.$message.success('操作成功')
      } else {
        this.$message.error(data.mesg)
      }
    },
    // 添加章节
    handleShowAddSection () {
      this.section = { // 防止数据还是编辑时获取的数据
        courseId: this.courseId,
        sectionName: '',
        description: '',
        orderNum: 0,
        status: 0
      }
      this.isAddSectionShow = true
    },
    // 添加课时展示框展开
    handleAddLessonShow () {
      this.lesson = {
        courseId: this.courseId,
        sectionId: undefined,
        sectionName: '',
        theme: '',
        duration: 0,
        isFree: false,
        orderNum: 0,
        status: 0
      }
      this.isAddSectionShow = true
    },
    // 添加课时
    async handleAddLesson () {
      const { data } = await saveOrUpdateLesson(this.lesson)
      if (data.code === '000000') {
        this.$message.success('操作成功')
        this.loadSections()
        this.isAddLessonShow = false
      } else {
        this.$message.error(data.mesg)
      }
    },
    // 修改章节状态
    async handleSectionStatusChange (section: any) {
      await saveOrUpdateSection(section)
      this.$message.success('操作成功')
    },
    /// 修改课时状态
    async handleLessonStatusChange (lesson: any) {
      await saveOrUpdateLesson(lesson)
      this.$message.success('操作成功')
    }
  }
})
</script>
<style lang="scss" scoped>
.inner{
    flex: 1;
    display: flex;
    padding: 10px;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ebeef5;
}
// ::v-deep
::v-deep .el-tree-node__content {
  height: auto;
}
.card-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.select-status {
  max-width: 100px;
  margin-left: 8px;
}
</style>
