import request from '@/utils/request';

export async function testRequest(params) {
  return request('http://localhost:8080/api/user/getusers?a=123');
}
export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request('/api/fake_list', {
    method: 'POST',
    params: {
      count,
    },
    data: { ...restParams, method: 'delete' },
  });
}
