export const common = {
  version: '0.0.1',
  cover: '',
  className: '',
  quickToolsAddClass: [],
  createdUser: {
    id: 0,
    name: 'jmingzi'
  },
  events: [],
  style: {
    width: '100%',
    height: '60px',
    positionType: 'absolute',
    position: {},
    margin: {},
    padding: {},
    // zIndex: 0,
    code: '(function () {\n  return {\n  }\n})()'
  },
  children: [],
  show: true,
  outDocFlow: false,
  // 手写 vNode 版本
  // renderString: '(function (h) {\n  return {\n    option: {\n      props: {}\n    },\n    children: [\n    ]\n  }\n})(vueCompositionApi.createElement)'
  // template 版本
  renderString: '(function (h) {\n  return {\n    template: `\n      <div></div>\n    `,\n    methods: {\n      // 列表容器事件的绑定：@click="handleClick"\n      // 再使用 $$listBind\n    }\n  }\n})(vueCompositionApi.createElement)'
}
