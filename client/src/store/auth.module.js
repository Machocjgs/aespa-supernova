import AuthService from '../services/auth.service'

const token = localStorage.getItem('token')
const initialState = token ? { status: { loggedIn: true }, user: token } : { status: { loggedIn: false }, user: null }

export const auth = {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, user) {
      console.log(user)
      return AuthService.login(user).then(
        user => {
          commit('loginSuccess', user);
          return Promise.resolve(user);
        },
        error => {
          commit('loginFailure');
          return Promise.reject(error);
        }
      );
    },
    logout({ commit }) {
      AuthService.logout();
      commit('logout');
    },
    reset({ commit }, user) {
      return AuthService.reset(user).then(
        response => {
          commit('resetSuccess');
          return Promise.resolve(response.data);
        },
        error => {
          commit('resetFailure');
          return Promise.reject(error);
        }
      );
    }
  },
  mutations: {
    loginSuccess(state, user) {
      state.status.loggedIn = true;
      state.user = user;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
    },
    resetSuccess(state) {
      state.status.loggedIn = false;
    },
    resetFailure(state) {
      state.status.loggedIn = false;
    }
  }
}