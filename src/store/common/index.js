let common = {
    state: {
        crums: [],
        ULFB: [],
        ULFE: [],
        imgUrl: 'http://192.168.1.39:7777',
        // QueryStaff: [],
        QuerySupplier: [],
        ApprovalProcessOrderRecordLogGet: [],
        ApprovalProcessOrderRecordCreate: [],
        GetLeaveByNo: [],
        ApprovedWithdraw: [],
        ApprovedPass: [],
        ApprovedRefused: [],
        ApprovedCancel: [],
        ApprovedRefusedRedo: [],
        UpdateLeaveStatus: [],
        // 人事调动
        UpdateStaffMoveStatus: [],
        GetStaffMoveByNo: []
    },
    mutations: {
        SET_CRUMS (state, crums) {
            state.crums = crums
        },
        SET_ULFB (state, ulfb) {
            state.ULFB = ulfb
        },
        SET_ULFe (state, ulfe) {
            state.ULFE = ulfe
        },
        // SET_QUERYSTAFF (state, list) {
        //     state.QueryStaff = list
        // },
        SET_QUERYSUPPLIER (state, list) {
            state.QuerySupplier = list
        },
        // store分模块导入时只有state是跟着一起分模块的 其他默认都是全局除非使用了设置namespaced: true,
        Setfunname (state, payload) {
            // console.log(payload);
            let name = payload.MN;
            // console.log(payload)
            // console.log(this.state['ApprovalCenter'].MNvalue);
            let arr = ['Technology', 'AssetManage', 'DeviceManage', 'DeviceOperation', 'ApprovalCenter', 'Purchasingmanagement', 'Humanmanage', "Managements", 'Permission', 'Attendance', 'Materia', 'Common', 'Kaoqin'];
            for (let index = 0; index < arr.length; index++) {
                let item = arr[index];
                // console.log(this.state,this.state[item],this.state[item][name])//不为空更新
                // console.log(this.state[item].MNvalue,this.state[item].MNvalue[name])
                // console.log(this.state[item],this.state[item][name])
                // console.log("--------")
                if (this.state[item].MNvalue && this.state[item].MNvalue[name]) {
                    this.state[item].MNvalue[name] = payload;
                    // console.log(JSON.stringify(this.state[item])+'-----------------');
                    return
                } else if (this.state[item] && this.state[item][name]) {//为空存入
                    // console.log(JSON.stringify(this.state[item])+'dddddddddd+++++++++++++++++++ddddddddd');
                    this.state[item][name] = payload;
                    return
                } else {
                    // console.log('22');
                    continue
                }
            }
        }
    },
    actions: {
        setCrums ({ commit }, crums) {
            commit('SET_CRUMS', crums)
        },
        setUlfb ({ commit }, ulfb) {
            commit('SET_ULFB', ulfb)
        },
        setUlfe ({ commit }, ulfe) {
            commit('SET_ULFE', ulfe)
        },
        // setQueryStaff ({ commit }, staff) {
        //     commit('SET_QUERYSTAFF', staff)
        // },
        setQuerySupplier ({ commit }, staff) {
            commit('SET_QUERYSUPPLIER', staff)
        },
        setQueryJobs ({ commit }, staff) {
            commit('SET_QUERYJOBS', staff)
        },
        setQueryOrganization ({ commit }, staff) {
            commit('SET_QUERYORGANIZATION', staff)
        },
    }
}

export default common
