
let ApprovalCenter = {
    state: {
        ApprovalProcessGetList:{},//定义的表数据
        ApprovalProcessGetInfo:{},//设置或者查看的表数据,传ProcessID查询
        ApprovalProcessGetOrderList:{},//获取审批单据列表
        ApprovalProcessEdit:{},
        DeleteRecordNodes:[]
    },
    mutations: {
        MsetTabledata (state, list) {
            state.ApprovalProcessGetList = list
        },
        MsetTabledataInfo (state, list) {
            state.ApprovalProcessGetInfo = list
        },
        MsetOrderRecordLogData (state, list) {
            state.ApprovalProcessGetOrderList = list
        }

    },
    actions: {
        Asetabledata ({ commit }, list) {
            commit('MsetTabledata', list)
        },
        AsetTabledataInfo ({ commit }, list) {
            commit('MsetTabledataInfo', list)
        },
        AOrderRecordLogData ({ commit }, list) {
            commit('MsetOrderRecordLogData', list)
        }
    }
}
export default ApprovalCenter