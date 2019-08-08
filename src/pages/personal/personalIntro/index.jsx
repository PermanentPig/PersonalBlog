import React, { PureComponent } from 'react';
import { connect } from 'dva';
import request from "../../../utils/myRequest";
@connect(({ personalInfo, loading }) => ({
  personalInfo,
  loading: loading.models.personalInfo,
}))
class Index extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      msg: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    request('http://localhost:8080/api/user/getMessage').then(res => {
      this.setState({
        msg: res.data,
      });
    });
  }

  render() {
    const { personalInfo } = this.props;
    const { list } = personalInfo;
    const { msg } = this.state;
    return (
      <div>
        <h2>个人简介页面</h2>
        <h1>{msg}</h1>
      </div>
    );
  }
}

export default Index;
