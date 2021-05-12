

let Purchasingmanagement = {
  path: '/Purchasingmanagement',
  name: 'Purchasingmanagement',
  redirect: '/Purchasingmanagement/Suppliermanagement/Suppliergroup',
  meta: { title: '采购管理', icon: "icon-iconcaigouguanli" },
  component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/White.vue"),
  children: [
      {
          path: '/Purchasingmanagement/Suppliermanagement',
          name: 'Suppliermanagement',
          meta: { title: '供应商管理', icon: "" },
          component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Purchasingmanagement/index.vue"),
          children:[
            {
                path: '/Purchasingmanagement/Suppliermanagement/Suppliergroup',
                name: 'Suppliergroup',
                meta: { title: '供应商分组', icon: "" },
                component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Purchasingmanagement/Suppliermanagement/Suppliergroup.vue"),
            },
            {
                path: '/Purchasingmanagement/Suppliermanagement/Supplierprofile',
                name: 'Supplierprofile',
                meta: { title: '供应商档案', icon: "" },
                component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Purchasingmanagement/Suppliermanagement/Supplierprofile.vue"),
            },
          ]
      },
      {
          path: '/Purchasingmanagement/Ordermanagement',
          name: 'Ordermanagement',
          meta: { title: '订单管理', icon: "" },
          component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Purchasingmanagement/index.vue"),
          children:[
            {
                path: '/Purchasingmanagement/Ordermanagement/Purchaserequisition',
                name: 'Purchaserequisition',
                meta: { title: '请购单', icon: "" },
                component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Purchasingmanagement/Ordermanagement/Purchaserequisition.vue"),
            },
            // {
            //     path: '/Purchasingmanagement/Ordermanagement/Purchaserequisitionapproval',
            //     name: 'Purchaserequisitionapproval',
            //     meta: { title: '请购单审批', icon: "" },
            //     component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Purchasingmanagement/Ordermanagement/Purchaserequisitionapproval.vue"),
            // },
            {
                path: '/Purchasingmanagement/Ordermanagement/Purchaseorder',
                name: 'Purchaseorder',
                meta: { title: '采购单', icon: "" },
                component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Purchasingmanagement/Ordermanagement/Purchaseorder.vue"),
            },
            // {
            //     path: '/Purchasingmanagement/Ordermanagement/PurchaseReturn',
            //     name: 'PurchaseReturn',
            //     meta: { title: '采购退货单', icon: "" },
            //     component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Purchasingmanagement/Ordermanagement/PurchaseReturn.vue"),
            // },

          ]
      },
      // {
      //     path: '/Purchasingmanagement/Purchasestatistics',
      //     name: 'Purchasestatistics',
      //     meta: { title: '采购统计', icon: "icon-yonghuguanli" },
      //     component: () => import( /* webpackChunkName: "Humanmanage" */ "../Pages/Purchasingmanagement/Purchasestatistics.vue"),
      //   },
  ]
}
export default Purchasingmanagement