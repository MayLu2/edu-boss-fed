// 资源相关模块
import request from '@/utils/request'
export const getResourcePages = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data: data
  })
}
export const deleteResoure = (id: number) => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/${id}`
  })
}
export const allocateRoleResources = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/resource/allocateRoleResources',
    data
  })
}
export const getAllResources = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/getAll'
  })
}
export const getRoleResources = (roleId: string | number) => {
  return request({
    method: 'GET',
    url: '/boss/resource/getRoleResources',
    params: {
      roleId
    }
  })
}
