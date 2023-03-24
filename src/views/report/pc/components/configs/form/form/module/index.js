
// import vantInput from '../../input/index';
// import vantSelect from '../../select';
import vantRadio from '../../radio';
import vanCheckBox from '../../checkbox';
import vanCascade from '../../cascadeSelector';

const formComponents = [
  // vantInput,
  // vantSelect,
  vantRadio,
  vanCheckBox,
  vanCascade
]

const components = [
  formComponents
]
components.forEach(componentsItems => {
  // 为所有组件配置添加公共属性
  // componentsItems.forEach(component => {
  //   component.configList.unshift({
  //     labelName: '组件名称',
  //     formType: 'input',
  //     // isInputDisable: true,
  //     key: 'commonConfigAssignName'
  //   })
  //   component.configList.unshift({
  //     labelName: '组件ID',
  //     formType: 'input',
  //     isInputDisable: true,
  //     key: 'commonConfigAssignSign'
  //   })
  // })
})

export default components
