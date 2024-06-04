<template>
  <div class="users-page-container">
    <main class="users-page">
      <header class="header">
        <h1 class="header-title">Users</h1>
        <div class="search-container">
          <input
            type="text"
            v-model="search"
            @input="fetchUsers"
            placeholder="Search"
            class="search-input"
          />
          <button @click="fetchUsers" class="search-button">
            <span class="material-icons">search</span>
          </button>
          <button @click="createUserModal" class="create-button">
            <span class="material-icons">add</span>
            <span class="create-user">Create User</span>
          </button>
        </div>
      </header>
      <div class="users-table-container">
      <table>
        <thead>
          <tr>
            <th @click="sortBy('user_name')" :class="{ 'sortable': true, 'sorted': sortKey === 'user_name' }">
                User Name
                <span v-if="sortKey === 'user_name'" class="material-icons">
                  {{ sortOrder === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down' }}
                </span>
              </th>
              <th @click="sortBy('email')" :class="{ 'sortable': true, 'sorted': sortKey === 'email' }">
                Email
                <span v-if="sortKey === 'email'" class="material-icons">
                  {{ sortOrder === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down' }}
                </span>
              </th>
              <th @click="sortBy('position')" :class="{ 'sortable': true, 'sorted': sortKey === 'position' }">
                Position
                <span v-if="sortKey === 'position'" class="material-icons">
                  {{ sortOrder === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down' }}
                </span>
              </th>
              <th @click="sortBy('created_dt')" :class="{ 'sortable': true, 'sorted': sortKey === 'created_dt' }">
                Created
                <span v-if="sortKey === 'created_dt'" class="material-icons">
                  {{ sortOrder === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down' }}
                </span>
              </th>
              <th @click="sortBy('last_modified_dt')" :class="{ 'sortable': true, 'sorted': sortKey === 'last_modified_dt' }">
                Last Modified
                <span v-if="sortKey === 'last_modified_dt'" class="material-icons">
                  {{ sortOrder === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down' }}
                </span>
              </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in sortedUsers" :key="user.user_id" @dblclick="viewUserModal(user)" class="clickable-row">
            <td>{{ user.user_name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.position }}</td>
            <td>{{ user.created_dt }}</td>
            <td>{{ user.last_modified_dt }}</td>
            <td>
              <div class="row-actions">
                <button @click="updateUserModal(user)" class="icon-button">
                  <span class="material-icons">edit</span>
                </button>
                <button @click="confirmDeleteUser(user)" class="icon-button" v-if="local_user_id!=user.user_id">
                  <span class="material-icons">delete</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    </main>
  </div>
  <Modal :show="isModalOpen" :mode="modalMode" :user="selectedUser" @create="createUser" @update="updateUser" @close="closeModal" />

  <v-dialog v-model="isDeleteDialogOpen" max-width="500">
    <v-card>
      <v-card-title class="headline">Are you sure to delete this?</v-card-title>
      <v-card-actions class="justify-center">
        <v-spacer></v-spacer>
        <v-btn color="red" @click="deleteUser">Yes</v-btn>
        <v-btn color="grey" @click="isDeleteDialogOpen = false">No</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  
  <v-snackbar
    v-model="isSnackBarOpen"
    timeout=3000
    class="text-center"
  >
    {{ snackBarText }}
    <template v-slot:actions>
      <v-btn
        color="blue"
        variant="text"
        @click="isSnackBarOpen = false"
      >
        Close
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import Modal from '@/components/UserModal.vue';
import UserService from '@/services/user.service';

export default {
  components: {
    Modal
  },
  name: "User",
  data() {
    return {
      users: [],
      search: '',
      sortKey: '',
      sortOrder: 'asc',
      isModalOpen: false,
      selectedUser: null,
      modalMode: 'view',
      local_user_id: null,
      isDeleteDialogOpen: false,
      userToDelete: null,
      isSnackBarOpen:false,
      snackBarText:''
    };
  },
  created() {
    this.local_user_id = JSON.parse(localStorage.getItem('user')).user_id;
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const queryParams = {
          search: this.search
        };
        const response = await UserService.findMany(queryParams);
        this.users = response.data;
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    updateUserModal(user) {
      this.selectedUser = user;
      this.modalMode = 'update';
      this.isModalOpen = true;
    },

    viewUserModal(user) {
      this.selectedUser = user;
      this.modalMode = 'view';
      this.isModalOpen = true;
    },

    createUserModal(user) {
      this.selectedUser = user;
      this.modalMode = 'create';
      this.isModalOpen = true;
    },

    confirmDeleteUser(user) {
      this.userToDelete = user;
      this.isDeleteDialogOpen = true;
    },

    showSnackBar(text){
      this.snackBarText = text;
      this.isSnackBarOpen = true
    },

    async updateUser(user) {
      try {
        await UserService.updateUser(user);
        this.showSnackBar('User successfully updated!');
      } catch(err) {
        console.error(err);
        this.showSnackBar('User update failed! Something went wrong');
      }
      await this.fetchUsers();
      const response = 
      console.log(response);
      this.closeModal()
    },

    async createUser(user) {
      try{
        await UserService.createUser(user);
        this.showSnackBar("User successfully created!");
      } catch(err) {
        console.error(err);
        this.showSnackBar('User creation failed! Something went wrong');
      }
      await this.fetchUsers();
      this.closeModal()
    },
    
    async deleteUser() {
      try {
        await UserService.deleteUser(this.userToDelete.user_id);
        this.showSnackBar("User successfully deleted!");
      } catch (error) {
        console.error('Error deleting user:', error);
        this.showSnackBar("Delete failed! Something went wrong.");
      }
      await this.fetchUsers()
      this.isDeleteDialogOpen = false;
    },
    sortBy(key) {
      if (this.sortKey == key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
      }
    },
    async closeModal() {
      await this.fetchUsers();
      this.isModalOpen = false;
      this.selectedUser = null;
      this.modalMode = 'view'; // Reset mode to 'view' after closing modal
    },
  },
  computed: {
    sortedUsers() {
      return this.users.sort((a,b) => {
        let modifier = 1;
        if (this.sortOrder === 'desc') modifier = -1;
        if (a[this.sortKey] < b[this.sortKey]) return -1 * modifier;
        if (a[this.sortKey] > b[this.sortKey]) return 1 * modifier;
      });
    }
  }
};
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
}

.users-page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 100vh;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f9f9f9;
}

.users-page {
  text-align: center;
  margin-bottom: 20px;
  width: 100%;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 10px;
}

.header-title {
  margin: 0;
  vertical-align: middle;
}

.search-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 0;
  justify-content: center;
}

.search-input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
  min-width: 300px
}

.create-button {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #F8C963;
  cursor: pointer;
}

.create-user {
  vertical-align: middle;
  margin-left: 5px;
}

.sort-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.users-table-container {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

th, td {
  border: 1px solid #ddd;
  padding: 12px 15px;
  text-align: left;
}

th {
  background-color: #F8C963;
  color: white;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

.sortable {
  cursor: pointer;
}

.sorted {
  color: #f2f2f2;
}

th:hover {
  background-color: #f2f2f2;
  color: #F8C963;
}


tr:hover {
  background-color: #ddd;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  color: #311f19;
}

.material-icons {
  font-size: 18px;
  vertical-align: middle;
}

.icon-button .material-icons {
  font-size: 24px;
  vertical-align: middle;
}

.icon-button:hover .material-icons {
  color: #4CAF50;
}

.clickable-row {
  cursor: pointer;
}

.clickable-row:hover {
  background-color: #FFE7AD;
}

.row-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
