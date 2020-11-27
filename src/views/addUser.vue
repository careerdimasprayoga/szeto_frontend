<template>
  <b-container>
    <b-row>
      <b-col xl="12">
        <b-card class="mt-5" border-variant="info" header="Add User" header-bg-variant="info" header-text-variant="white" align="center">
          <b-button class="mb-3" variant="success">
            <b-icon icon="person-plus-fill" font-scale="1"></b-icon>
            Back
          </b-button>
          <b-form v-on:submit.prevent="addUser">
            <b-form-group label="Product Name">
              <b-form-input
                v-model="form.name"
                type="text"
                required
                placeholder="Product Name"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Image">
              <b-form-file required @change="handleFile"></b-form-file>
            </b-form-group>
            <b-form-group label="Category">
              <b-form-select v-model="form.id_category">
                <b-form-select-option
                  v-for="(item, index) in dataCategorys"
                  :key="index"
                  :value="`${item.category_id}`"
                  >{{ item.category_name }}</b-form-select-option
                >
              </b-form-select>
            </b-form-group>
            <b-form-group label="Price">
              <b-form-input
                v-model="form.price"
                type="number"
                required
                placeholder="Price"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Status">
              <b-form-select
                v-model="form.status"
                :options="selectOptionStatus"
              ></b-form-select>
            </b-form-group>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  data () {
    return {
      currentPage: 1,
      urlapi: process.env.VUE_APP_URL
    }
  },
  computed: {
    ...mapGetters({
      getterTotalUsers: 'getTotalUsers',
      getterDataUsers: 'getDataUsers'
    })
  },
  methods: {
    ...mapActions({
      actionGetUsers: 'getUsers',
      actionGetUsersTotals: 'getUserTotal'
    }),
    ...mapMutations({
      mutationChangePage: 'pushChangePage',
      mutationIdUser: 'pushIdUser'
    }),
    changePage (page) {
      if (parseInt(this.$route.query.page) !== page) {
        this.$router.push(`?page=${page}`)
      }
      this.mutationChangePage(page)
      this.actionGetUsers()
    },
    editUsers () {
      this.$swal({
        title: 'Do you want to delete users ?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Delete',
        denyButtonText: "Don't delete"
      }).then((result) => {
        if (result.isConfirmed) {
          this.$swal('Deleted!', '', 'success')
        } else if (result.isDenied) {
          this.$swal('Delete canceled', '', 'info')
        }
      })
    }
  },
  created () {
    this.actionGetUsersTotals()
    this.actionGetUsers()
  }
}
</script>
