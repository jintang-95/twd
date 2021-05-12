/* eslint-disable */
import Vue from 'vue';
import store from '@/store/index.js'

const permission = Vue.directive('permission', {
  inserted(el, binding, vnode) {
      const { value } = binding
      const roles = store.getters.getPermission;
      if (value && value instanceof Array && value.length > 0) {
          const permissionRoles = value
          const hasPermission = roles.some(role => {
              return permissionRoles.includes(role)
          })
          if (!hasPermission) {
              // el.parentNode && el.parentNode.removeChild(el)
              el.style.display = "none";
          } else {
            el.style.display = "";
          }
      } else {
          throw new Error(`need roles! Like v-permission="['admin','editor']"`)
      }
  }
});
export default {
  permission
};
