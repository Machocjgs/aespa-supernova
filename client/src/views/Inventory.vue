<template>
  <div class="products-page-container">
    <main class="products-page">
      <header class="header">
        <h1 class="header-title">Inventory</h1>
          <div class="search-container">
              
              <button @click="createInventoryModal" class="create-button">
                <span class="material-icons">add</span>
                <span class="create-product">Create Inventory</span>
              </button>
          </div>
      </header>
      <div class="product-table-container">
        <table>
          <thead>
            <tr>
              <th @click="sortBy('product_name')" :class="{ 'sortable': true, 'sorted': sortKey === 'product_name' }">
                  Product Name
                  <span v-if="sortKey === 'product_name'" class="material-icons">
                    {{ sortOrder === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down' }}
                  </span>
                </th>
                <th @click="sortBy('product_brand')" :class="{ 'sortable': true, 'sorted': sortKey === 'product_brand' }">
                  Brand
                  <span v-if="sortKey === 'product_brand'" class="material-icons">
                    {{ sortOrder === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down' }}
                  </span>
                </th>
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
                <th @click="sortBy('size_label')" :class="{ 'sortable': true, 'sorted': sortKey === 'size_label' }">
                  Size
                  <span v-if="sortKey === 'size_label'" class="material-icons">
                    {{ sortOrder === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down' }}
                  </span>
                </th>
                <th @click="sortBy('quantity')" :class="{ 'sortable': true, 'sorted': sortKey === 'quantity' }">
                  Quantity
                  <span v-if="sortKey === 'quantity'" class="material-icons">
                    {{ sortOrder === 'asc' ? 'arrow_drop_up' : 'arrow_drop_down' }}
                  </span>
                </th>
                <th @click="sortBy('status')" :class="{ 'sortable': true, 'sorted': sortKey === 'status' }">
                  Status
                  <span v-if="sortKey === 'status'" class="material-icons">
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
            <tr v-for="inventory in sortedProducts" :key="inventory.inventory_id" @dblclick="viewInventoryModal(inventory)" class="clickable-row">
              <td>{{ inventory.product_name }}</td>
              <td>{{ inventory.product_brand }}</td>
              <td>{{ inventory.category_label }}</td>
              <td>{{ inventory.subcategory_label }}</td>
              <td>{{ inventory.size_label }}</td>
              <td>{{ inventory.quantity }}</td>
              <td>{{ inventory.status }}</td>
              <td>{{ inventory.created_dt }}</td>
              <td>{{ inventory.last_modified_dt }}</td>
              <td>
                <div class="row-actions">
                  <button @click="updateInventoryModal(inventory)" class="icon-button">
                    <span class="material-icons">edit</span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
  <Modal :show="isModalOpen" :mode="modalMode" :inventory="selectedInventory" @create="createInventory" @edit="updateInventory" @close="closeModal" />
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
import Modal from '@/components/InventoryModal.vue';
import InventoryService from '@/services/inventory.service';
import CategoryService from '@/services/category.service';

export default {
  components: {
    Modal
  },
  name: "Inventory",
  data() {
    return {
      inventories: [],
      selectedCategory: '',
      search: '',
      sortKey: '',
      sortOrder: 'asc',
      isModalOpen: false,
      selectedInventory: null,
      modalMode: 'view',
      isDeleteDialogOpen: false,
      inventoryToDelete: null,
      isSnackBarOpen:false,
      snackBarText:'',
      categories: [],
    };
  },
  created() {
    this.fetchInventories();
    this.fetchCategories();
  },
  methods: {
    async fetchInventories() {
      try {
        const queryParams = {};
        if (this.search) {
          queryParams['all_search'] = this.search;
        }

        const response = await InventoryService.findMany(queryParams);

        this.inventories = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    updateInventoryModal(inventory) {
      this.selectedInventory = inventory;
      this.modalMode = 'edit';
      this.isModalOpen = true;
    },

    viewInventoryModal(inventory) {
      this.selectedInventory = inventory;
      this.modalMode = 'view';
      this.isModalOpen = true;
    },

    createInventoryModal(inventory) {
      this.selectedInventory = inventory;
      this.modalMode = 'create';
      this.isModalOpen = true;
    },

    showSnackBar(text){
      this.snackBarText = text;
      this.isSnackBarOpen = true
    },

    async updateInventory(inventory) {
      try {
        console.log(inventory);
        const response = await InventoryService.updateInventory(inventory);
        console.log(response);
        this.showSnackBar('Inventory successfully updated!');
      } catch(err) {
        const { status, data } = err.response;
        console.log(status, data.error);
        if (status == '409'){
          this.showSnackBar(data.error);
        } else {
          this.showSnackBar('Inventory creation failed! Something went wrong');
        }
      }
      await this.fetchInventories();
      this.closeModal()
    },

    async createInventory(inventory) {
      try{
        const response = await InventoryService.createInventory(inventory);
        console.log(response);
        this.showSnackBar("Inventory successfully added!");
      } catch(err) {
        const { status, data } = err.response;
        console.log(status, data.error);
        if (status == '409'){
          this.showSnackBar(data.error);
        } else {
          this.showSnackBar('Inventory creation failed! Something went wrong');
        }
      }
      await this.fetchInventories();
      this.closeModal()
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
      await this.fetchInventories();
      this.isModalOpen = false;
      this.selectedInventory = null;
      this.modalMode = 'view'; // Reset mode to 'view' after closing modal
    },

    async fetchCategories() {
      try {
        const queryParams = {};
        const response = await CategoryService.findMany(queryParams);

        this.categories = response.data
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
  },
  computed: {
    sortedProducts() {
      const inventoriesCopy = [...this.inventories]; // Create a shallow copy of the inventories array
        return inventoriesCopy.sort((a, b) => {
          let modifier = 1;
          if (this.sortOrder === 'desc') modifier = -1;
          if (a[this.sortKey] < b[this.sortKey]) return -1 * modifier;
          if (a[this.sortKey] > b[this.sortKey]) return 1 * modifier;
          return 0; // Ensure it returns 0 if a[this.sortKey] === b[this.sortKey]
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

.products-page-container {
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

.products-page {
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

.create-product {
  vertical-align: middle;
  margin-left: 5px;
}

.sort-select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.product-table-container {
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
