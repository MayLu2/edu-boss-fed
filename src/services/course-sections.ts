// 课程章节相关请求模块
import request from '@/utils/request'

// 获取课程内容
export const getQueryCourses = (courseId: string|number) => {
  return request({
    method: 'GET',
    url: '/boss/course/section/getSectionAndLesson',
    params: {
      courseId
    }

  })
}
// 保存或更新阶段
export const saveOrUpdateSection = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/course/section/saveOrUpdateSection',
    data
  })
}
//   根据阶段Id获取阶段信息
export const getSectionById = (sectionId: string | number) => {
  return request({
    method: 'GET',
    url: '/boss/course/section/getBySectionId',
    params: {
      sectionId
    }
  })
}
