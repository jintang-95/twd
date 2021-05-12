

let per = {
    state: {
        MNvalue: {
            Login: true,
			QueryStaffByUId: true,
            QueryUser: true,
            DelUser: true,
            UpdateUser: true,
            AddUser: true,
            QueryGroup: true,
            AddGroup: true,
            DelGroup: true,
            UpdateGroup: true,
            UpdatePermissionState: true,
            QueryPermissionTree: true,
            QueryPermission: true,
            QueryModular: true,
            AddPermission: true,
            UpdatePermission: true,
            UpdateUserState: true,
            QueryRole: true,
            QueryPermissionByType: true,
            QueryRoleButtonPermission: true,
            QueryRolePermission: true,
            QueryRoleDataPermission: true,
            QueryDataPermissionByType: true,
            QueryButtonPermissionByType: true,
            AddRole: true,
            DelRole: true,
            UpdateRole:true,
            BillTypeGetList:true,//系统管理-->单号列表
            BillNoRoleByBillId:true,//单号规则详情
			BillNoRoleSave:true,//新增规则
            GetHomeData:true,//主页数据
            GetPersonnelByIdForCollector:true,
            GetAccountGroupList:true,//用户组列表
            GetAccountList:true,//用户列表
            ResetAccountPassword:true,//重置密码
            UpdateAccountStatus:true,//修改用户状态
            DeleteAccount:true,//删除用户
            GetSetUpAccountList:true,//获取可选用户
            SaveAccountGroup:true,//新增用户组
            DeleteAccountGroup:true,//删除组
            GetPersonnelList:true,//请求员工
            SaveAccount:true,//新增/修改员工
            GetRoleList:true,//查询角色
            AccountOrGroupAuthorize:true,
            GetRoleList:true,//角色列表
            UpdateRoleStatus:true,//修改角色状态
            SaveRole:true,//新增/编辑
            GetRoleAuthorityList:true,//权限列表
            GetRoleDataAuthorityList:true,//数据权限列表
            SaveRoleAuthority:true,//设置权限
            GetAuthorityList:true,//权限列表
            UpdateAuthorityStatus:true,//
            SaveAuthority:true,//新增/修改
            GetDataTableList:true,//数据库表
            GetApis:true,
        },
        Permissions: ["User_AddGroup","User_Adduser","User_Editorgroup","User_Deletegroup","User_Check","User_Editoruser","User_Deleteuser","Role_Addrole","Role_Editorrole",
      "Role_Deleterole","Role_Editorbutton","Per_Addper","Per_Editorper","Per_Deleteper","Per_Addper"
    ]
    },
    mutations: {

    },
    actions: {

    }
}

export default per
