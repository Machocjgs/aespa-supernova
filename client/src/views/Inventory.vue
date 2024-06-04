<template>
  <div class="products-page-container">
    <main class="products-page">
      <header class="header">
        <h1 class="header-title">Inventory</h1>
          <div class="search-container">
              <div class="column-select-container">
                  <select v-model="selectedCategory" class="column-select">
                    <option value="">All Categories</option>
                    <option v-for="category in uniqueCategories" :key="category" :value="category">{{ category }}</option>
                  </select>
              </div>
              <div class="search-input-container">
                  <input
                  type="text"
                  v-model="search"
                  @input="fetchProducts"
                  placeholder="Search"
                  class="search-input"
                  />
              </div>
              <button @click="fetchProducts" class="search-button">
              <span class="material-icons">search</span>
              </button>
          </div>
      </header>
      <div class="product-table-container">
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Brand</th>
              <th>Category</th>
              <th>Sub Category</th>
              <th>Price</th>
              <th>Created</th>
              <th>Last Modified</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in sortedProducts" :key="product.product_id" @dblclick="viewProductModal(product)" class="clickable-row">
              <td>{{ product.product_name }}</td>
              <td>{{ product.product_brand }}</td>
              <td>{{ product.category_label }}</td>
              <td>{{ product.subcategory_label }}</td>
              <td>{{ product.product_price }}</td>
              <td>{{ product.created_dt }}</td>
              <td>{{ product.last_modified_dt }}</td>
              <td>
                <div class="row-actions">
                  <button @click="updateProductModal(product)" class="icon-button">
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
</template>

<script>
import Modal from '@/components/ProductModal.vue';
import ProductService from '@/services/product.service';
import CategoryService from '@/services/categories.service';

export default {
  components: {
    Modal
  },
  name: "Product",
  data() {
    return {
      products: [],
      selectedCategory: '',
      search: '',
      sortKey: '',
      sortOrder: 'asc',
      isModalOpen: false,
      selectedProduct: null,
      modalMode: 'view',
      isDeleteDialogOpen: false,
      productToDelete: null,
      isSnackBarOpen:false,
      snackBarText:'',
      categories: [],
    };
  },
  created() {
    this.fetchProducts();
    this.fetchCategories();
  },
  methods: {
    async fetchProducts() {
      try {
        const queryParams = {};

        console.log(this.selectedCategory)

        if (this.selectedCategory) {
          // If a specific column is selected, use it for search
          queryParams['category_label'] = this.selectedCategory;
        }
            
        const response = await ProductService.findMany(queryParams);

        this.products = response.data;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    updateProductModal(product) {
      this.selectedProduct = product;
      this.modalMode = 'update';
      this.isModalOpen = true;
    },

    viewProductModal(product) {
      this.selectedProduct = product;
      this.modalMode = 'view';
      this.isModalOpen = true;
    },

    createProductModal(product) {
      this.selectedProduct = product;
      this.modalMode = 'create';
      this.isModalOpen = true;
    },

    confirmDeleteProduct(product) {
      this.productToDelete = product;
      this.isDeleteDialogOpen = true;
    },

    showSnackBar(text){
      this.snackBarText = text;
      this.isSnackBarOpen = true
    },

    async updateProduct(product) {
      try {
        await ProductService.updateProduct(product);
        this.showSnackBar('Product successfully updated!');
      } catch(err) {
        console.error(err);
        this.showSnackBar('Product update failed! Something went wrong');
      }
      await this.fetchProducts();
      this.closeModal()
    },

    async createProduct(product) {
      try{
        await ProductService.createProduct(product);
        this.showSnackBar("Product successfully created!");
      } catch(err) {
        console.error(err);
        this.showSnackBar('Product creation failed! Something went wrong');
      }
      await this.fetchProducts();
      this.closeModal()
    },
    
    async deleteProduct() {
      try {
        await ProductService.deleteProduct(this.productToDelete.product_id);
        this.showSnackBar("Product successfully deleted!");
      } catch (error) {
        console.error('Error deleting product:', error);
        this.showSnackBar("Delete failed! Something went wrong.");
      }
      await this.fetchProducts();
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
      await this.fetchProducts();
      this.isModalOpen = false;
      this.selectedProduct = null;
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
      return this.products.sort((a,b) => {
        let modifier = 1;
        if (this.sortOrder === 'desc') modifier = -1;
        if (a[this.sortKey] < b[this.sortKey]) return -1 * modifier;
        if (a[this.sortKey] > b[this.sortKey]) return 1 * modifier;
      });
    },
    uniqueCategories() {
      try {
        // Fetch categories from the server
        const queryParams = {};
        if (this.categories) {
          // Return unique categories

          return [...new Set(this.categories.map(category => category.category_label))]
        } else {
          console.error('Error fetching categories:', response);
          // If fetching fails, fallback to computing unique categories from products
          return [...new Set(this.products.map(product => product.category_label))];
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // If an error occurs, fallback to computing unique categories from products
        return [...new Set(this.products.map(product => product.category_label))];
      }
    },
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
