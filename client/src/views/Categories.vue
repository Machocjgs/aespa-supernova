<template>
  <div class="categories-page-container">
    <!-- Tabs for categories and sizes -->
    <div class="tab-container">
      <button class="tab-button" :class="{ 'active': activeTab === 'categories' }" @click="activeTab = 'categories'">Categories</button>
      <button class="tab-button" :class="{ 'active': activeTab === 'size' }" @click="activeTab = 'size'">Sizes</button>
    </div>
    <main v-if="activeTab === 'categories'" class="categories-page">
      <header class="header">
        <h2 class="header-title">Categories</h2>
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

    <main v-if="activeTab === 'size'" class="categories-page">
      <header class="header">
        <h2 class="header-title">Sizes</h2>
        <div class="search-container">
          <div class="search-input-container">
            <input
              type="text"
              v-model="search"
              @input="fetchSizes"
              placeholder="Search"
              class="search-input"
            />
          </div>
          <button @click="fetchSizes" class="search-button">
            <span class="material-icons">search</span>
          </button>
          <button @click="createSizeModal" class="create-button">
            <span class="material-icons">add</span>
            <span class="create-category">Add Size</span>
          </button>
        </div>
      </header>
      <div class="category-table-container">
        <table>
          <thead>
            <tr>
              <th @click="sortBySize('size_label')" :class="{ 'sortable': true, 'sorted': sizeSortKey === 'size_label' }">
                Size Label
                <span v-if="sizeSortKey === 'size_label'" class="material-icons">
                  {{ sortOrder === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down' }}
                </span>
              </th>
              <th @click="sortBySize('size_description')" :class="{ 'sortable': true, 'sorted': sizeSortKey === 'size_description' }">
                Size Description
                <span v-if="sizeSortKey === 'size_description'" class="material-icons">
                  {{ sortOrder === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down' }}
                </span>
              </th>
              <th @click="sortBySize('created_dt')" :class="{ 'sortable': true, 'sorted': sizeSortKey === 'created_dt' }">
                Created
                <span v-if="sizeSortKey === 'created_dt'" class="material-icons">
                  {{ sortOrder === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down' }}
                </span>
              </th>
              <th @click="sortBySize('last_modified_dt')" :class="{ 'sortable': true, 'sorted': sizeSortKey === 'last_modified_dt' }">
                Last Modified
                <span v-if="sizeSortKey === 'last_modified_dt'" class="material-icons">
                  {{ sortOrder === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down' }}
                </span>
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="size in sortedSizes" :key="size.size_id" @dblclick="viewSizeModal(size)" class="clickable-row">
              <td>{{ size.size_label }}</td>
              <td>{{ size.size_description }}</td>
              <td>{{ size.created_dt }}</td>
              <td>{{ size.last_modified_dt }}</td>
              <td>
                <div class="row-actions">
                  <button @click="confirmDeleteSize(size)" class="icon-button">
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
  <Modal :show="isModalOpen" :mode="modalMode" :category="selectedCategory" @create="createCategory" @close="closeModal" />
  <SizeModal :show="isSizeModalOpen" :mode="sizeModalMode" :size="selectedSize" @create="createSize" @close="closeSizeModal" />

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

  <v-dialog v-model="isDeleteSizeDialogOpen" max-width="500">
    <v-card>
      <v-card-title class="headline">Are you sure to delete this size?</v-card-title>
      <v-card-actions class="justify-center">
        <v-spacer></v-spacer>
        <v-btn color="red" @click="deleteSize">Yes</v-btn>
        <v-btn color="grey" @click="isDeleteSizeDialogOpen = false">No</v-btn>
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
import SizeModal from '@/components/SizeModal.vue';
import CategoryService from '@/services/category.service';
import SizeService from '@/services/sizes.service';

export default {
  components: {
    Modal,
    SizeModal
  },
  name: "Category",
  data() {
    return {
      categories: [],
      sizes: [],
      selectedColumn: '',
      search: '',
      sortKey: '',
      sizeSortKey: '',
      sortOrder: 'asc',
      sizeSortOrder: 'asc',
      isModalOpen: false,
      isSizeModalOpen: false,
      selectedCategory: null,
      selectedSize: null,
      modalMode: 'view',
      sizeModalMode: 'view',
      isDeleteDialogOpen: false,
      isDeleteSizeDialogOpen: false,
      categoryToDelete: null,
      sizeToDelete: null,
      isSnackBarOpen: false,
      snackBarText: '',
      activeTab: 'categories',
    };
  },
  created() {
    this.fetchCategories();
    this.fetchSizes();
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

    async fetchSizes() {
      try {
        const queryParams = {};

        // If no specific column is selected, apply search to all columns
        queryParams['all_search'] = this.search;
        const response = await SizeService.findMany(queryParams);

        this.sizes = response.data;
      } catch (error) {
        console.error('Error fetching sizes:', error);
      }
    },

    viewCategoryModal(category) {
      this.selectedCategory = category;
      this.modalMode = 'view';
      this.isModalOpen = true;
    },

    viewSizeModal(size) {
      this.selectedSize = size;
      this.sizeModalMode = 'view';
      this.isSizeModalOpen = true;
    },

    createCategoryModal(category) {
      this.selectedCategory = category;
      this.modalMode = 'create';
      this.isModalOpen = true;
    },

    createSizeModal(size) {
      this.selectedSize = size;
      this.sizeModalMode = 'create';
      this.isSizeModalOpen = true;
    },

    confirmDeleteCategory(category) {
      this.categoryToDelete = category;
      this.isDeleteDialogOpen = true;
    },

    confirmDeleteSize(size) {
      this.sizeToDelete = size;
      this.isDeleteSizeDialogOpen = true;
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

    async createSize(size) {
      try{
        await SizeService.createSize(size);
        this.showSnackBar("Category successfully created!");
      } catch(err) {
        console.error(err);
        this.showSnackBar('Category creation failed! Something went wrong');
      }
      await this.fetchSizes();
      this.closeSizeModal()
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

    async deleteSize() {
      try {
        await SizeService.deleteSize(this.sizeToDelete.size_id);
        this.showSnackBar("Size successfully deleted!");
      } catch (error) {
        console.error('Error deleting size:', error);
        this.showSnackBar("Size deletion failed! Something went wrong.");
      }
      await this.fetchSizes()
      this.isDeleteSizeDialogOpen = false;
    },

    sortBy(key) {
      if (this.sortKey == key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
      }
    },

    sortBySize(key) {
      if (this.sizeSortKey == key) {
        this.sizeSortOrder = this.sizeSortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sizeSortKey = key;
        this.sizeSortOrder = 'asc';
      }
    },

    async closeModal() {
      await this.fetchCategories();
      this.isModalOpen = false;
      this.selectedCategory = null;
      this.modalMode = 'view'; // Reset mode to 'view' after closing modal
    },
    async closeSizeModal() {
      await this.fetchSizes();
      this.isSizeModalOpen = false;
      this.selectedSize = null;
      this.sizeModalMode = 'view'; // Reset mode to 'view' after closing modal
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
    },
    sortedSizes() {
      return this.sizes.sort((a,b) => {
        let modifier = 1;
        if (this.sizeSortOrder === 'desc') modifier = -1;
        if (a[this.sizeSortKey] < b[this.sizeSortKey]) return -1 * modifier;
        if (a[this.sizeSortKey] > b[this.sizeSortKey]) return 1 * modifier;
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

  .tab-container {
    display: flex;
    padding-left: 30px;
    width: 100%;
  }

  .tab-button {
    padding: 10px;
    border: none;
    background-color: transparent;
    cursor: pointer;
    font-size: 16px;
    margin-bottom: 10px;
  }

  .tab-button.active {
    font-weight: bold;
    color: #333;
    border-bottom: 3px solid #F8C963;
    background-color: #f7e6bfea;
  }

  .categories-page {
    flex: 1;
    padding-top: 0px;
  }
  </style>