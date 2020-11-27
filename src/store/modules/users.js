import axios from 'axios'

export default {
  state: {
    users: [],
    idUser: '',
    page: 1,
    limit: 5,
    totalUsers: '',
    dataPic: []
  },
  mutations: {
    pushDataUsers (state, payload) {
      state.users = payload
    },
    pushTotalUsers (state, payload) {
      state.totalUsers = payload
    },
    pushChangePage (state, payload) {
      state.page = payload
    },
    pushIdUser (state, payload) {
      state.idUser = payload
    },
    pushDataPic (state, payload) {
      state.dataPic = payload
    }
  },
  actions: {
    getPic (context, payload) {
      axios
        .get(`${process.env.VUE_APP_URL}/users/getpic`)
        .then(response => {
          context.commit('pushDataPic', response.data.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getUsers (context, payload) {
      axios
        .get(`${process.env.VUE_APP_URL}/users?limit=${context.state.limit}&page=${context.state.page}`)
        .then(response => {
          context.commit('pushDataUsers', response.data.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    getUserTotal (context, payload) {
      axios
        .get(`${process.env.VUE_APP_URL}/users/totalUser`)
        .then(response => {
          context.commit('pushTotalUsers', response.data.data)
        })
        .catch(error => {
          console.log(error)
        })
    },
    addUser (context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .post(`${process.env.VUE_APP_URL}/users`, payload)
          .then(response => {
            resolve(response.data.msg)
          })
          .catch(error => {
            reject(error.response.data.msg)
          })
      })
    },
    deleteUser (context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .delete(`${process.env.VUE_APP_URL}/users/deleteUser/${payload}`)
          .then(response => {
            resolve(response.data.msg)
          })
          .catch(error => {
            reject(error.response.data.msg)
          })
      })
    },
    editUser (context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .patch(`${process.env.VUE_APP_URL}/users/${context.state.idUser}`, payload)
          .then(response => {
            resolve(response.data.msg)
          })
          .catch(error => {
            reject(error.response.data.msg)
          })
      })
    }
  },
  getters: {
    getTotalUsers (state) {
      return state.totalUsers
    },
    getDataUsers (state) {
      return state.users
    },
    getDataPic (state) {
      return state.dataPic
    }
  }
}
