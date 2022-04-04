// 菜单相关模块
import request from '@/utils/request'
export const createOrUpdateMenu = (data: any) => {
  return request({
    method: 'POST',
    url: '/boss/menu/saveOrUpdate',
    data: data
  })
}
export const getEditMenuInfo = (id:string |number) => {
  return request({
    method: 'GET',
    url: '/boss/menu/getEditMenuInfo?id=' + id
    // params: {
    //   id
    // }
  })
}
export const getAllMenus = () => {
  return request({
    method: 'GET',
    url: '/boss/menu/getAll'
  })
}
export const deleteMenu = (id:number) => {
  return request({
    method: 'DELETE',
    url: `/boss/menu/${id}`
  })
}
