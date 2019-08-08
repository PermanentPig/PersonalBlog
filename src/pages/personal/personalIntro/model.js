import { testRequest } from './service';

const Model = {
  namespace: 'personalInfo',
  state: {
    list: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(testRequest, payload);
      yield put({
        type: 'queryList',
        payload: response.data,
      });
    },
  },
  reducers: {
    queryList(state, action) {
      return { ...state, list: action.payload };
    },
  },
};
export default Model;
