

/**
 * 
 * @param {*} 
 * fromComponent:表单控件
 * rules：表单校验规则
 * tabPane：标签页  content：标签页所对应的组件（动态）
 */

const optiondata ={
      OrganType:[
        {
          label:'部门',
          value:'1'
        },
        {
          label:'项目组',
          value:'2'
        },
      ],
      sex:[
        {
          label:'男',
          value:'1'
        },
        {
          label:'女',
          value:'2'
        },
      ],
      SuperiorType:[
        {
          label:'无',
          value:''
        },
        {
          label:'指定岗位',
          value:'1'
        },
        {
          label:'指定人',
          value:'2'
        },
      ],
      Typeoption:[
        {
          label:'部门调动',
          value:'1'
        },
        {
          label:'岗位调动',
          value:'2'
        },
      ],
      StaffType:[
        {
          label:'证件信息',
          value:'1'
        },
        {
          label:'个人信息',
          value:'2'
        },
        {
          label:'联系方式',
          value:'3'
        },
      ],
      UserType:[
        {
          label:"不使用系统",
          value:'1'
        },
        {
          label:'当前工号',
          value:'2'
        },
        {
          label:'选择已建的系统用户',
          value:'3'
        },
      ],
      LoginMethod:[
        {
          label:'账号',
          value:'1'
        },
        {
          label:'人脸',
          value:'2'
        },
        {
          label:'ID卡',
          value:'3'
        },
        {
          label:'指纹',
          value:'4'
        },
      ],

}

export default optiondata