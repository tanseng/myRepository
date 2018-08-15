## 开发说明
-----
#### 启动
1. 启动文件： app/src/index.js
   > 加载全局数据模型./models/global

   > 加载全局路由./router
   ``` js
   import React from 'react';
    import { routerRedux, Route, Switch } from 'dva/router';
    import { LocaleProvider } from 'antd';
    import zhCN from 'antd/lib/locale-provider/zh_CN';
    import { getRouterData } from './common/router';
    import Authorized from './utils/Authorized';
    import { getQueryPath } from './utils/utils';

    const { ConnectedRouter } = routerRedux;
    const { AuthorizedRoute } = Authorized;
    // 全局路由配置
    function RouterConfig({ history, app }) {
        const routerData = getRouterData(app);
        const UserLayout = routerData['/user'].component;
        const BasicLayout = routerData['/'].component;
        return (
            <LocaleProvider locale={zhCN}>
            <ConnectedRouter history={history}>
                <Switch>
                <Route path="/user" component={UserLayout} />
                <!-- 路由权限过滤，如果不是角色或admin或user则重定向/user/login路由 -->
                <AuthorizedRoute
                    path="/"
                    render={props => <BasicLayout {...props} />}
                    authority={['admin', 'user']}
                    redirectPath={getQueryPath('/user/login', {
                    redirect: window.location.href,
                    })}
                />
                </Switch>
            </ConnectedRouter>
            </LocaleProvider>
        );
    }
   ```
2. 权限过滤
   > 过滤权限文件：./utils/Authorized.js
   ``` js
    import RenderAuthorized from '../components/Authorized';
    import { getAuthority } from './authority';

    let Authorized = RenderAuthorized(getAuthority()); // eslint-disable-line

    // Reload the rights component
    const reloadAuthorized = () => {
    Authorized = RenderAuthorized(getAuthority());
    };

    export { reloadAuthorized };
    export default Authorized;
   ```
   > 获取权限文件:./utils/authority.js
   ``` js
    // use localStorage to store the authority info, which might be sent from server in actual project.
    // 重写该方法实现路由权限调整
    export function getAuthority() {
    // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
    // 如果没有权限登录默认guest权限进入登录界面
    let authority = localStorage.getItem('antd-pro-authority') || 'guest';
    return authority;
    }

    export function setAuthority(authority) {
    return localStorage.setItem('antd-pro-authority', authority);
    }
   ```

#### 登录
1. 在启动篇中加载全局路由时有一句代码如下，方法返回路径和对应的界面
   ``` js
   const routerData = getRouterData(app);
   ```
2. 路由配置对象
   ``` js
    const routerConfig = {
        '/': {
        component: dynamicWrapper(app, ['user', 'login'], () => import('../layouts/BasicLayout')),
        },
        
        '/dashboard/analysis': {
        component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Analysis')),
        },
        '/dashboard/monitor': {
        component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')),
        },
        '/dashboard/workplace': {
        component: dynamicWrapper(app, ['project', 'activities', 'chart'], () =>
            import('../routes/Dashboard/Workplace')
        ),
        // hideInBreadcrumb: true,
        // name: '工作台',
        // authority: 'admin',
        },
        '/test/test': {
        component: dynamicWrapper(app, [], () =>
            import('../routes/test/NormalLoginForm')
        ),
        // hideInBreadcrumb: true,
        // name: '工作台',
        // authority: 'admin',
        },
        '/form/basic-form': {
        component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/BasicForm')),
        },
        '/form/step-form': {
        component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm')),
        },
        '/form/step-form/info': {
        name: '分步表单（填写转账信息）',
        component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step1')),
        },
        '/form/step-form/confirm': {
        name: '分步表单（确认转账信息）',
        component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step2')),
        },
        '/form/step-form/result': {
        name: '分步表单（完成）',
        component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step3')),
        },
        '/form/advanced-form': {
        component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/AdvancedForm')),
        },
        '/list/table-list': {
        component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
        },
        '/list/basic-list': {
        component: dynamicWrapper(app, ['list'], () => import('../routes/List/BasicList')),
        },
        '/list/card-list': {
        component: dynamicWrapper(app, ['list'], () => import('../routes/List/CardList')),
        },
        '/list/search': {
        component: dynamicWrapper(app, ['list'], () => import('../routes/List/List')),
        },
        '/list/search/projects': {
        component: dynamicWrapper(app, ['list'], () => import('../routes/List/Projects')),
        },
        '/list/search/applications': {
        component: dynamicWrapper(app, ['list'], () => import('../routes/List/Applications')),
        },
        '/list/search/articles': {
        component: dynamicWrapper(app, ['list'], () => import('../routes/List/Articles')),
        },
        '/profile/basic': {
        component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/BasicProfile')),
        },
        '/profile/advanced': {
        component: dynamicWrapper(app, ['profile'], () =>
            import('../routes/Profile/AdvancedProfile')
        ),
        },
        '/result/success': {
        component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
        },
        '/result/fail': {
        component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
        },
        '/exception/403': {
        component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
        },
        '/exception/404': {
        component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
        },
        '/exception/500': {
        component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
        },
        '/exception/trigger': {
        component: dynamicWrapper(app, ['error'], () =>
            import('../routes/Exception/triggerException')
        ),
        },
        '/user': {
        component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
        },
        '/user/login': {
        component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
        },
        '/user/register': {
        component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
        },
        '/user/register-result': {
        component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
        },
        // '/user/:id': {
        //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
        // },
    };
   ```

3. 根据默认路由/user/login找到对应的登录界面app/src/routes/User/Login.js
   ``` js
    import React, { Component } from 'react';
    import { connect } from 'dva';
    import { Link } from 'dva/router';
    import { Checkbox, Alert, Icon } from 'antd';
    import Login from 'components/Login';
    import styles from './Login.less';

    const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;
    // 此操作符连接命名空间为login的model层
    @connect(({ login, loading }) => ({
    login,
    submitting: loading.effects['login/login'],
    }))
    export default class LoginPage extends Component {
    state = {
        type: 'account',
        autoLogin: true,
    };

    onTabChange = type => {
        this.setState({ type });
    };

    handleSubmit = (err, values) => {
        const { type } = this.state;
        const { dispatch } = this.props;
        if (!err) {
        // 调用loigin命名空间下的login方法
        dispatch({
            type: 'login/login',
            payload: {
            ...values,
            type,
            },
        });
        }
    };

    changeAutoLogin = e => {
        this.setState({
        autoLogin: e.target.checked,
        });
    };

    renderMessage = content => {
        return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
    };
    // 登录界面，可以更改为自定义的UI
    render() {
        const { login, submitting } = this.props;
        const { type, autoLogin } = this.state;
        return (
        <div className={styles.main}>
            <Login defaultActiveKey={type} onTabChange={this.onTabChange} onSubmit={this.handleSubmit}>
            <Tab key="account" tab="账户密码登录">
                {login.status === 'error' &&
                login.type === 'account' &&
                !submitting &&
                this.renderMessage('账户或密码错误（admin/888888）')}
                <UserName name="userName" placeholder="admin/user" />
                <Password name="password" placeholder="888888/123456" />
            </Tab>
            <Tab key="mobile" tab="手机号登录">
                {login.status === 'error' &&
                login.type === 'mobile' &&
                !submitting &&
                this.renderMessage('验证码错误')}
                <Mobile name="mobile" />
                <Captcha name="captcha" />
            </Tab>
            <div>
                <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
                自动登录
                </Checkbox>
                <a style={{ float: 'right' }} href="">
                忘记密码
                </a>
            </div>
            <Submit loading={submitting}>登录</Submit>
            <div className={styles.other}>
                其他登录方式
                <Icon className={styles.icon} type="alipay-circle" />
                <Icon className={styles.icon} type="taobao-circle" />
                <Icon className={styles.icon} type="weibo-circle" />
                <Link className={styles.register} to="/user/register">
                注册账户
                </Link>
            </div>
            </Login>
        </div>
        );
    }
    }
   ```
4. 登录处理
   > 文件路径：app/src/model/login.js
   ``` js
    import { routerRedux } from 'dva/router';
    import { stringify } from 'qs';
    import { fakeAccountLogin } from '../services/api';
    import { setAuthority } from '../utils/authority';
    import { reloadAuthorized } from '../utils/Authorized';
    import { getPageQuery } from '../utils/utils';

    export default {
    namespace: 'login',

    state: {
        status: undefined,
    },

    effects: {
        *login({ payload }, { call, put }) {
        const response = yield call(fakeAccountLogin, payload);
        yield put({
            type: 'changeLoginStatus',
            payload: response,
        });
        // Login successfully
        if (response.status === 'ok') {
            reloadAuthorized();
            const urlParams = new URL(window.location.href);
            const params = getPageQuery();
            let { redirect } = params;
            if (redirect) {
            const redirectUrlParams = new URL(redirect);
            if (redirectUrlParams.origin === urlParams.origin) {
                redirect = redirect.substr(urlParams.origin.length);
                if (redirect.startsWith('/#')) {
                redirect = redirect.substr(2);
                }
            } else {
                window.location.href = redirect;
                return;
            }
            }
            yield put(routerRedux.replace(redirect || '/'));
        }
        },
        *logout(_, { put }) {
        yield put({
            type: 'changeLoginStatus',
            payload: {
            status: false,
            currentAuthority: 'guest',
            },
        });
        reloadAuthorized();
        yield put(
            routerRedux.push({
            pathname: '/user/login',
            search: stringify({
                redirect: window.location.href,
            }),
            })
        );
        },
    },

    reducers: {
        changeLoginStatus(state, { payload }) {
        setAuthority(payload.currentAuthority);
        return {
            ...state,
            status: payload.status,
            type: payload.type,
        };
        },
    },
    };

   ```

5. 调用rest接口
   > 文件目录：app/src/services/api.js
   ``` js
   // 方法名：fakeAccountLogin
    export async function fakeAccountLogin(params) {
    return request('/api/login/account', {
        method: 'POST',
        body: params,
    });
    }
   ```
6. 登录默认路径
   > ant登录主要是看有没有上次登录地址，如果没有则重定向根目录/,也就是会定向到路由数组的第一个值

   > 在登录完成处理中的定义返回的首次登录路由，更改如下：
   ``` js
   // Login successfully
      if (response.status === 'ok') {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        // gxg 如果是用户登录时返回登录路径，则以用户登录路径为准
        let defaultPath = response.path;
        if(defaultPath){
        // 登录到该用户的缺省路径
          yield put(
            routerRedux.push({
              pathname: defaultPath,
              search: stringify({
                redirect: window.location.href,
              }),
            })
          );
        }else{
          let { redirect } = params;
          if (redirect) {
            const redirectUrlParams = new URL(redirect);
            if (redirectUrlParams.origin === urlParams.origin) {
              redirect = redirect.substr(urlParams.origin.length);
              if (redirect.startsWith('/#')) {
                redirect = redirect.substr(2);
              }
            } else {
              window.location.href = redirect;
              return;
            }
          }
          // 重定向路径
          yield put(routerRedux.replace(redirect || '/'));
        }

      }
   ```
    > .roadhogrc.mock.js模拟rest api要进行更改
    ``` js
        'POST /api/login/account': (req, res) => {
        const { password, userName, type } = req.body;
        if (password === '888888' && userName === 'admin') {
        res.send({
            status: 'ok',
            type,
            currentAuthority: 'admin',
            path: '/profile/basic',
        });
        return;
        }
    ```

#### 菜单与权限
1. 文件目录：app/src/common/menu.js
2. 自定义菜单
   ``` js
   export const getMenuData = () => formatter(menuData);
   ```
   > 可以重定义formatter方法通过rest去获取菜单功能

3. 菜单权限（authority代表了功能菜单所需的权限）
   ``` json
    {
        name: '详情页',
        icon: 'profile',
        path: 'profile',
        children: [
        {
            name: '基础详情页',
            path: 'basic',
        },
        {
            name: '高级详情页',
            path: 'advanced',
            authority: 'admin',
        },
        ],
    }
   ```
   > 返回菜单以常理形式缓存与后台，返回后每个功能菜单追加上autority属性，这样从性能上或权限控制上来说，都可以推送到前台去决定。

   ``` json
    {
        name: '详情页',
        icon: 'profile',
        path: 'profile',
        children: [
        {
            name: '基础详情页',
            path: 'basic',
        },
        {
            name: '高级详情页',
            path: 'advanced',
            authority: ['admin', 'user'],
        },
        ],
    }
   ```
   > 此时“高级详情页”菜单对于admin和user角色均可使用

#### 新增界面
1. src/routes文件下新建目录NewPage
2. 新建界面样式NewPage.less
   ``` css
    @import "~antd/lib/style/themes/default.less";
   ```
3. 新建页面文件NewPage.js
   ```js
    import React, { PureComponent, Fragment } from 'react';
    import { connect } from 'dva';
    import moment from 'moment';
    import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    Icon,
    Button,
    Dropdown,
    Menu,
    InputNumber,
    DatePicker,
    Modal,
    message,
    Badge,
    Divider,
    } from 'antd';
    import StandardTable from 'components/StandardTable';
    import PageHeaderLayout from '../../layouts/PageHeaderLayout';

    import styles from './NewPage.less';

    const FormItem = Form.Item;
    const { Option } = Select;
    const getValue = obj =>
    Object.keys(obj)
        .map(key => obj[key])
        .join(',');
    const statusMap = ['default', 'processing', 'success', 'error'];
    const status = ['关闭', '运行中', '已上线', '异常'];

    const CreateForm = Form.create()(props => {
    const { modalVisible, form, handleAdd, handleModalVisible } = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
        if (err) return;
        form.resetFields();
        handleAdd(fieldsValue);
        });
    };
    return (
        <Modal
        title="新建规则"
        visible={modalVisible}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
        >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="描述">
            {form.getFieldDecorator('desc', {
            rules: [{ required: true, message: 'Please input some description...' }],
            })(<Input placeholder="请输入" />)}
        </FormItem>
        </Modal>
    );
    });

    @connect(({ rule, loading }) => ({
    rule,
    loading: loading.models.rule,
    }))
    @Form.create()
    export default class NewPage extends PureComponent {
    state = {
        modalVisible: false,
        expandForm: false,
        selectedRows: [],
        formValues: {},
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
        type: 'rule/fetch',
        });
    }

    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const { dispatch } = this.props;
        const { formValues } = this.state;

        const filters = Object.keys(filtersArg).reduce((obj, key) => {
        const newObj = { ...obj };
        newObj[key] = getValue(filtersArg[key]);
        return newObj;
        }, {});

        const params = {
        currentPage: pagination.current,
        pageSize: pagination.pageSize,
        ...formValues,
        ...filters,
        };
        if (sorter.field) {
        params.sorter = `${sorter.field}_${sorter.order}`;
        }

        dispatch({
        type: 'rule/fetch',
        payload: params,
        });
    };

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
        formValues: {},
        });
        dispatch({
        type: 'rule/fetch',
        payload: {},
        });
    };

    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({
        expandForm: !expandForm,
        });
    };

    handleMenuClick = e => {
        const { dispatch } = this.props;
        const { selectedRows } = this.state;

        if (!selectedRows) return;

        switch (e.key) {
        case 'remove':
            dispatch({
            type: 'rule/remove',
            payload: {
                no: selectedRows.map(row => row.no).join(','),
            },
            callback: () => {
                this.setState({
                selectedRows: [],
                });
            },
            });
            break;
        default:
            break;
        }
    };

    handleSelectRows = rows => {
        this.setState({
        selectedRows: rows,
        });
    };

    handleSearch = e => {
        e.preventDefault();

        const { dispatch, form } = this.props;

        form.validateFields((err, fieldsValue) => {
        if (err) return;

        const values = {
            ...fieldsValue,
            updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
        };

        this.setState({
            formValues: values,
        });

        dispatch({
            type: 'rule/fetch',
            payload: values,
        });
        });
    };

    handleModalVisible = flag => {
        this.setState({
        modalVisible: !!flag,
        });
    };

    handleAdd = fields => {
        const { dispatch } = this.props;
        dispatch({
        type: 'rule/add',
        payload: {
            description: fields.desc,
        },
        });

        message.success('添加成功');
        this.setState({
        modalVisible: false,
        });
    };

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        const {
        rule: { data },
        loading,
        } = this.props;
        const { selectedRows, modalVisible } = this.state;

        const columns = [
        {
            title: '规则编号',
            dataIndex: 'no',
        },
        {
            title: '描述',
            dataIndex: 'description',
        },
        {
            title: '服务调用次数',
            dataIndex: 'callNo',
            sorter: true,
            align: 'right',
            render: val => `${val} 万`,
            // mark to display a total number
            needTotal: true,
        },
        {
            title: '状态',
            dataIndex: 'status',
            filters: [
            {
                text: status[0],
                value: 0,
            },
            {
                text: status[1],
                value: 1,
            },
            {
                text: status[2],
                value: 2,
            },
            {
                text: status[3],
                value: 3,
            },
            ],
            onFilter: (value, record) => record.status.toString() === value,
            render(val) {
            return <Badge status={statusMap[val]} text={status[val]} />;
            },
        },
        {
            title: '更新时间',
            dataIndex: 'updatedAt',
            sorter: true,
            render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        },
        {
            title: '操作',
            render: () => (
            <Fragment>
                <a href="">配置</a>
                <Divider type="vertical" />
                <a href="">订阅警报</a>
            </Fragment>
            ),
        },
        ];

        const menu = (
        <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
            <Menu.Item key="remove">删除</Menu.Item>
            <Menu.Item key="approval">批量审批</Menu.Item>
        </Menu>
        );

        const parentMethods = {
        handleAdd: this.handleAdd,
        handleModalVisible: this.handleModalVisible,
        };

        return (
        <PageHeaderLayout title="自定义功能">
            <Card bordered={false}>
            <div className={styles.tableList}>
                <div className={styles.tableListForm}>
                
        <Form onSubmit={this.handleSearch} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
                <FormItem label="规则编号">
                {getFieldDecorator('no')(<Input placeholder="请输入" />)}
                </FormItem>
            </Col>
            <Col md={8} sm={24}>
                <FormItem label="使用状态">
                {getFieldDecorator('status')(
                    <Select placeholder="请选择" style={{ width: '100%' }}>
                    <Option value="0">关闭</Option>
                    <Option value="1">运行中</Option>
                    </Select>
                )}
                </FormItem>
            </Col>
            <Col md={8} sm={24}>
                <FormItem label="调用次数">
                {getFieldDecorator('number')(<InputNumber style={{ width: '100%' }} />)}
                </FormItem>
            </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col md={8} sm={24}>
                <FormItem label="更新日期">
                {getFieldDecorator('date')(
                    <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
                )}
                </FormItem>
            </Col>

            </Row>
            <div style={{ overflow: 'hidden' }}>
            <div style={{ float: 'right', marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
                </Button>
            </div>
            </div>
        </Form>
                </div>
                <div className={styles.tableListOperator}>
                <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                    新建
                </Button>
                {selectedRows.length > 0 && (
                    <span>
                    <Button>批量操作</Button>
                    <Dropdown overlay={menu}>
                        <Button>
                        更多操作 <Icon type="down" />
                        </Button>
                    </Dropdown>
                    </span>
                )}
                </div>
                <StandardTable
                selectedRows={selectedRows}
                loading={loading}
                data={data}
                columns={columns}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                />
            </div>
            </Card>
            <CreateForm {...parentMethods} modalVisible={modalVisible} />
        </PageHeaderLayout>
        );
    }
    }
   ```
4. 声明路径动态加载新建界面app/src/common/route.js
   ``` js
   '/new/newpage': {
      component: dynamicWrapper(app, [], () =>
        import('../routes/New/NewPage')
      ),
    },
   ```
5. 菜单显示该功能 app/src/commom.menu.js
   ``` json 
    {
        name: '自定义模块',
        icon: 'form',
        path: 'new',
        children: [
        {
            name: '新功能',
            path: 'newpage',
        },
        ],
    },
   ```
#### 
   
   

