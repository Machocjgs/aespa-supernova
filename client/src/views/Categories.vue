<template>
  <div class="categories-page-container">
    <main class="categories-page">
      <header class="header">
        <h1 class="header-title">Categories</h1>
        <div class="search-container">
          <div class="column-select-container">
            <select v-model="selectedColumn" class="column-select">
              <option value="">All Columns</option>
              <option value="category_label">Category</option>
              <option value="subcategory_label">Sub Category</option>
              <!-- Add more options for other columns -->
            </select>
          </div>
          <div class="search-input-container">
            <input
              type="text"
              v-model="search"
              @input="fetchCategories"
              placeholder="Search"
              class="search-input"
            />
          </div>
          <button @click="fetchCategories" class="search-button">
            <span class="material-icons">search</span>
          </button>
          <button @click="createCategoryModal" class="create-button">
            <span class="material-icons">add</span>
            <span class="create-category">Add Category</span>
          </button>
        </div>
      </header>
      <div class="category-table-container">
        <table>
          <thead>
            <tr>
              <th @click="sortBy('category_label')" :class="{ 'sortable': true, 'sorted': sortKey === 'category_label' }">
                Category
                <span v-if="sortKey === 'category_label'" class="material-icons">
                  {{ sortOrder === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down' }}
                </span>
              </th>
              <th @click="sortBy('subcategory_label')" :class="{ 'sortable': true, 'sorted': sortKey === 'subcategory_label' }">
                Sub Category
                <span v-if="sortKey === 'subcategory_label'" class="material-icons">
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
            <tr v-for="category in sortedCategories" :key="category.category_id" @dblclick="viewCategoryModal(category)" class="clickable-row">
              <td>{{ category.category_label }}</td>
              <td>{{ category.subcategory_label }}</td>
              <td>{{ category.created_dt }}</td>
              <td>{{ category.last_modified_dt }}</td>
              <td>
                <div class="row-actions">
                  <button @click="confirmDeleteCategory(category)" class="icon-button">
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
  <Modal :show="isModalOpen" :mode="modalMode" :category="selectedCategory" @create="createCategory" @update="updateCategory" @close="closeModal" />
  
  <v-dialog v-model="isDeleteDialogOpen" max-width="500">
    <v-card>
      <v-card-title class="headline">Are you sure to delete this?</v-card-title>
      <v-card-actions class="justify-center">
        <v-spacer></v-spacer>
        <v-btn color="red" @click="deleteCategory">Yes</v-btn>
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
import Modal from '@/components/CategoryModal.vue';
import CategoryService from '@/services/categories.service';

export default {
  components: {
    Modal
  },
  name: "Category",
  data() {
    return {
      categories: [],
      selectedColumn: '',
      search: '',
      sortKey: '',
      sortOrder: 'asc',
      isModalOpen: false,
      selectedCategory: null,
      modalMode: 'view',
      isDeleteDialogOpen: false,
      categoryToDelete: null,
      isSnackBarOpen:false,
      snackBarText:''
    };
  },
  created() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      try {
        const queryParams = {};

        if (this.selectedColumn) {
            // If a specific column is selected, use it for search
            queryParams[this.selectedColumn] = this.search;
        } else {
            // If no specific column is selected, apply search to all columns
            queryParams['all_search'] = this.search;
        }
            
        const response = await CategoryService.findMany(queryParams);

        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },

    viewCategoryModal(category) {
      this.selectedCategory = category;
      this.modalMode = 'view';
      this.isModalOpen = true;
    },

    createCategoryModal(category) {
      this.selectedCategory = category;
      this.modalMode = 'create';
      this.isModalOpen = true;
    },

    confirmDeleteCategory(category) {
      this.categoryToDelete = category;
      this.isDeleteDialogOpen = true;
    },

    showSnackBar(text){
      this.snackBarText = text;
      this.isSnackBarOpen = true
    },

    async createCategory(category) {
      try{
        await CategoryService.createCategory(category);
        this.showSnackBar("Category successfully created!");
      } catch(err) {
        console.error(err);
        this.showSnackBar('Category creation failed! Something went wrong');
      }
      await this.fetchCategories();
      this.closeModal()
    },

    async deleteCategory() {
      try {
        await CategoryService.deleteCategory(this.categoryToDelete.category_id);
        this.showSnackBar("Category successfully deleted!");
      } catch (error) {
        console.error('Error deleting category:', error);
        this.showSnackBar("Category deletion failed! Something went wrong.");
      }
      await this.fetchCategories()
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
      await this.fetchCategories();
      this.isModalOpen = false;
      this.selectedCategory = null;
      this.modalMode = 'view'; // Reset mode to 'view' after closing modal
    },
  }
  ,
  computed: {
    sortedCategories() {
      return this.categories.sort((a,b) => {
        let modifier = 1;
        if (this.sortOrder === 'desc') modifier = -1;
        if (a[this.sortKey] < b[this.sortKey]) return -1 * modifier;
        if (a[this.sortKey] > b[this.sortKey]) return 1 * modifier;
      });
    }
  }
};
</script>

<style scoped>
  html, body {
    height: 100%;
    margin: 0;
  }
  
  .categories-page-container {
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
  
  .categories-page {
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

  .column-select-container {
    margin-right: 10px;
    }

  .column-select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .create-button {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: #F8C963;
    cursor: pointer;
  }
  
  .create-category {
    vertical-align: middle;
    margin-left: 5px;
  }
  
  .sort-select {
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .category-table-container {
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