import fetch from 'dva/fetch';
import { message } from 'antd';
import { toQueryString } from './utils';

const myRequest = (url, options) => {
  // 修改fetch默认参数
  options = options || {};
  options.method = ((options.method) || 'GET').toUpperCase();
  options.credentials = options.credentials || 'include';
  options.mode = options.mode || 'cors';
  options.headers = options.headers || {};
  // 添加token
  options.headers.token = localStorage.getItem('token') || '';
  // 对GET请求的特殊处理
  if (options.method === 'GET') {
    const str = toQueryString(options.body);
    // 参数拼接到url上
    if (str) {
      url += url.includes('?') ? '&' : '?';
      url += str;
    }
    delete options.body;
    options.headers['Content-Type'] = 'application/json';
  }
  // 对POST请求的特殊处理
  if (options.method === 'POST') {
    // content-type没有指定时，添加默认content-type
    options.headers['Content-Type'] = options.headers['Content-Type'] || 'application/json';

    // 处理content-type类型为application/x-www-form-urlencoded的请求body转换
    if (options.headers['Content-Type'] && options.headers['Content-Type'].includes('application/x-www-form-urlencoded')) {
      options.body = toQueryString(options.body);
    }
    // 处理提交的json对象
    if (options.headers['Content-Type'] === 'application/json') {
      if (options.body) {
        options.body = JSON.stringify(options.body);
      }
    }
  }
  return new Promise(((resolve, reject) => {
    fetch(url, options)
      .then(response => {
        // response.ok为true时，fetch成功
        if (response.ok) {
          return response.blob();
        }
        return reject(response.statusText);
      }).then(jsonBlob => {
      if (!jsonBlob) return;
      // fetch需要手动处理编码，xhr内部已经处理过
      const reader = new FileReader();
      reader.onload = () => {
        const jsonString = reader.result;
        let json;
        try {
          json = JSON.parse(jsonString);
          if (json.status && json.status !== 200) {
            message.error(json.msg);
          }
        } catch (err) {
          json = jsonString;
        }
        resolve(json);
      };
      reader.readAsText(jsonBlob, 'utf-8');
    }).catch(ex => {
      message.error(ex.stack, 5);
      reject(ex);
    });
  }));
};
export default myRequest;
