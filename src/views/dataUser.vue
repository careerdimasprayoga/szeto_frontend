<template>
  <b-container>
    <b-row>
      <b-col xl="12">
        <b-card class="mt-5" border-variant="info" header="Data User" header-bg-variant="info" header-text-variant="white" align="center">
          <b-button variant="info" class="mb-3 mr-3" @click="refresh()">
            <b-icon icon="arrow-repeat" font-scale="1.5"></b-icon>
          </b-button>
          <b-button class="mb-3" @click="clickAddUser()" variant="success" v-b-modal.modal-1>
            <b-icon icon="person-plus-fill" font-scale="1"></b-icon>
            Add User
          </b-button>
          <b-button v-b-toggle.collapse-2 class="mb-3 ml-3" variant="info">Readme</b-button>
          <b-collapse id="collapse-2">
            <b-card>You can add PIC manually at database => table pic!</b-card>
          </b-collapse>
          <b-table small :fields="fields" :items="getterDataUsers">
            <template #cell(index)="data">
              {{ data.index + 1 }}
            </template>
            <template #cell(img_ktp)="data">
              <img v-bind:src="urlapi + '/' + data.item.img_ktp" alt="" style="max-width: 80px;">
            </template>
            <template #cell(id)="data">
              <b-button variant="primary" size="sm" @click="clickEditUser(data.item)" v-b-modal.modal-1>
                Edit
              </b-button> |
              <b-button variant="danger" size="sm" @click="deleteUser(data.item.id)">
                Delete
              </b-button>
            </template>
          </b-table>
          <b-pagination
            class="mt-4"
            align="center"
            v-model="currentPage"
            :total-rows="getterTotalUsers"
            :per-page="5"
            aria-controls="my-table"
            @change="changePage"
          ></b-pagination>
        </b-card>
        <!-- ================ Modal ================ -->
        <b-modal id="modal-1" v-bind:title="modalTitle" hide-footer>
          <b-form v-on:submit.prevent="addUser()">
            <b-form-group label="Customer Name">
              <b-form-input
                v-model="form.name"
                type="text"
                required
                placeholder="Customer name"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="KTP">
              <b-form-file required @change="handleFile"></b-form-file>
            </b-form-group>
            <b-form-group label="Customer PIC">
              <b-form-select v-model="form.pic_id" multiple :select-size="3">
                <b-form-select-option
                  v-for="(item, index) in getterDataPic"
                  :key="index"
                  :value="`${item.id}`"
                  >{{ item.name }}</b-form-select-option
                >
              </b-form-select>
            </b-form-group>
            <b-form-group label="Customer Email">
              <b-form-input
                v-model="form.email"
                type="email"
                required
                placeholder="Customer email"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Customer Phone">
              <b-form-input
                v-model="form.phone"
                type="number"
                required
                placeholder="Customer email"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Address">
              <b-form-textarea
                id="textarea"
                v-model="form.address"
                placeholder="Address"
                rows="3"
                max-rows="6"
              ></b-form-textarea>
            </b-form-group>
          </b-form>
          <b-button @click="resetForm()" class="float-right" variant="danger"
            >Cancel</b-button
          >
          <b-button
            @click="addUser()"
            v-if="conditionEdit === false"
            class="mr-3 float-right"
            variant="success"
            >Save</b-button
          >
          <b-button
            @click="editUser()"
            v-else
            class="mr-3 float-right"
            variant="success"
            >Edit</b-button
          >
        </b-modal>
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
      modalTitle: '',
      urlapi: process.env.VUE_APP_URL,
      conditionEdit: false,
      form: {
        name: '',
        image: {},
        phone: '',
        email: '',
        address: '',
        pic_id: []
      },
      fields: [
        { key: 'index', label: 'No. ' },
        { key: 'name', label: 'Name' },
        { key: 'phone', label: 'Phone Number' },
        { key: 'email', label: 'Email' },
        { key: 'address', label: 'Address' },
        { key: 'img_ktp', label: 'Image KTP' },
        { key: 'pic_name', label: 'PIC' },
        { key: 'id', label: 'Action' }
      ]
    }
  },
  computed: {
    ...mapGetters({
      getterTotalUsers: 'getTotalUsers',
      getterDataUsers: 'getDataUsers',
      getterDataPic: 'getDataPic'
    })
  },
  methods: {
    ...mapActions({
      actionGetUsers: 'getUsers',
      actionGetUsersTotals: 'getUserTotal',
      actionAddUser: 'addUser',
      actionDeleteUser: 'deleteUser',
      actionGetPic: 'getPic',
      actionEditUser: 'editUser'
    }),
    ...mapMutations({
      mutationChangePage: 'pushChangePage',
      mutationIdUser: 'pushIdUser'
    }),
    changePage (page) {
      this.mutationChangePage(page)
      this.actionGetUsers()
    },
    clickAddUser () {
      this.conditionEdit = false
      this.modalTitle = 'Add Customer'
      this.form = {
        id: '',
        name: '',
        image: {},
        phone: '',
        email: '',
        address: '',
        pic_id: []
      }
    },
    clickEditUser (data) {
      this.conditionEdit = true
      this.modalTitle = 'Edit Customer'
      this.form = {
        id: data.id,
        name: data.name,
        phone: data.phone,
        image: data.image,
        email: data.email,
        address: data.address,
        pic_id: data.pic_id.split(', ').map(Number)
      }
      this.getEditDataProductId = data.id
    },
    async editUser () {
      try {
        await this.mutationIdUser(this.form.id)
        const data = new FormData()
        data.append('name', this.form.name)
        data.append('phone', this.form.phone)
        data.append('pic_id', this.form.pic_id)
        data.append('email', this.form.email)
        data.append('address', this.form.address)
        data.append('image', this.form.image)
        await this.actionEditUser(data).then((response) => {
          this.$swal({
            position: 'center',
            icon: 'success',
            title: response,
            showConfirmButton: true,
            timer: 2100
          })
          this.actionGetUsersTotals()
          this.actionGetUsers()
          this.resetForm()
        })
      } catch (error) {
        this.$swal({
          position: 'center',
          icon: 'error',
          title: error,
          showConfirmButton: true,
          timer: 2100
        })
      }
    },
    handleFile (event) {
      this.form.image = event.target.files[0]
      if (this.form.image.size >= 2097152) {
        this.$swal({
          position: 'center',
          icon: 'error',
          title: 'Max Image is 2Mb',
          showConfirmButton: true,
          timer: 2100
        })
      }
    },
    async addUser () {
      try {
        const data = new FormData()
        data.append('name', this.form.name)
        data.append('phone', this.form.phone)
        data.append('pic_id', this.form.pic_id)
        data.append('email', this.form.email)
        data.append('address', this.form.address)
        data.append('image', this.form.image)
        await this.actionAddUser(data).then((response) => {
          this.$swal({
            position: 'center',
            icon: 'success',
            title: response,
            showConfirmButton: true,
            timer: 2100
          })
          this.actionGetUsersTotals()
          this.actionGetUsers()
          this.resetForm()
        })
      } catch (error) {
        this.$swal({
          position: 'center',
          icon: 'error',
          title: error,
          showConfirmButton: true,
          timer: 2100
        })
      }
    },
    deleteUser (id) {
      this.$swal({
        title: 'Do you want to delete users ?',
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: 'Delete',
        denyButtonText: "Don't delete"
      }).then((result) => {
        if (result.isConfirmed) {
          this.actionDeleteUser(id)
          this.actionGetUsersTotals()
          this.actionGetUsers()
          this.$swal('Deleted!', '', 'success')
        } else if (result.isDenied) {
          this.$swal('Delete canceled', '', 'info')
        }
      })
    },
    refresh () {
      this.actionGetUsersTotals()
      this.actionGetUsers()
    },
    resetForm () {
      this.form = {
        id: '',
        name: '',
        image: {},
        phone: '',
        email: '',
        address: '',
        pic_id: []
      }
    }
  },
  created () {
    this.actionGetUsersTotals()
    this.actionGetUsers()
    this.actionGetPic()
  }
}
</script>
