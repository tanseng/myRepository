import request from '../utils/request';

export async function getMenus(params) {
    console.log('API getMenus Call!');
    return request('/api/menus', {
        method: 'POST',
        body: params,
      })
}