<template>
  <div class="modal" v-if="show">
    <div class="modal-overlay" @click="closeModal"></div>
    <div class="modal-content">
      <div class="modal-header">
      <h2>{{ mode === 'create' ? 'New Category' : mode === 'edit' ? 'Update Category' : 'Category Details' }}</h2>
      </div>
      <div class="modal-body">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <div v-if="mode !== 'create'" class="input-container input-margin">
              <v-text-field label="Category ID" v-model="SelectedCategory.category_id" :variant="filled" :readonly="true"/>
            </div>
            <div class="input-row">
              <div class="input-container input-margin">
                <v-text-field v-model="SelectedCategory.category_label" label="Category" :variant="variant" :readonly="readonly" :rules="[requiredRule]"/>
              </div>
              <div class="input-container">
                <v-text-field v-model="SelectedCategory.subcategory_label" label="Sub Category" :variant="variant" :readonly="readonly" :rules="[requiredRule]"/>
              </div>
            </div>
            <div v-if="mode !== 'create'" class="input-container">
              <v-text-field v-model="SelectedCategory.created_dt" label="Created At" :variant="filled" :readonly="true"/>
            </div>
            <div v-if="mode !== 'create'" class="input-container">
              <v-text-field v-model="SelectedCategory.last_modified_dt" label="Last Modified" :variant="filled" :readonly="true"/>
            </div>
          </div>
        </form>
      </div>
      <div class="modal-actions">
        <button @click="closeModal" class="close-button">Close</button>
        <button v-if="mode !== 'view'" :disabled="!changesMade" @click=submitForm class="submit-button">Submit</button>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: 'view' // Can be 'view', 'edit', or 'create'
    },
    category: {
      type: Object,
      default: null
    },
  },
  watch: {
    category(newCategoryValue) {
      this.SelectedCategory = {...newCategoryValue};
      this.originalCategory = {...newCategoryValue};
    }
  },
  data() {
    return {
      SelectedCategory: { ...this.category },
      originalCategory: { ...this.category }, // Store the original category data
      requiredFields: ['category_label', 'subcategory_label']
    };
  },
  methods: {
    submitForm() {
      if (this.mode !== 'view') {
        this.$emit(this.mode, this.SelectedCategory);
      }
      this.closeModal();
    },

    closeModal() {
      this.$emit('close');
    },

    requiredRule(value) {
      return !!value || 'Field is required';
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        // Convert the selected file to a data URL
        const reader = new FileReader();
        reader.onload = () => {
          // Set the image URL to the SelectedCategory
          this.SelectedCategory.image_url = reader.result; // Corrected property name
        };
        reader.readAsDataURL(file);
      }
    },
  },
  computed: {
    variant() {
      return this.mode === 'view' ? 'filled' : 'outlined'
    },
    readonly() {
      return this.mode === 'view'
    },
    changesMade() {
      // Check if any changes have been made to the category data
      if (this.mode !== 'create'){
        for (let key in this.SelectedCategory) {
          if (this.SelectedCategory[key] != this.originalCategory[key] && this.SelectedCategory[key]) {

            return true
          }
        }
        return false
      } else {
        return this.requiredFields.every(field => !!this.SelectedCategory[field])
      }
    },
  }
};
</script>

<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999; /* Ensure the modal is on top */
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent overlay */
  z-index: -1; /* Place the overlay behind the modal */
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  z-index: 99999; /* Ensure the modal content is on top */
}

.modal-header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding: 10px;
}

.modal-body {
  display: flex;
  align-items: flex-start; /* Align items at the start of the flex container */
}

.category-image {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.category-image img {
  width: 300px !important; 
  height: 300px !important;
}

.category-image input {
  margin-top: 10px; /* Adjust spacing between image and input */
}

.big-icon {
  font-size: 72px; /* Adjust the size as needed */
  width: 150px; /* Adjust the width as needed */
  height: 150px; /* Adjust the height as needed */
  line-height: 150px; /* Center the icon vertically */
  text-align: center; /* Center the icon horizontally */
  border-radius: 50%; /* Make it circular */
  background-color: #ccc; /* Background color for the circle */
  margin-bottom: 10px;
}

.form-group {
  flex: 1; /* Take up 50% of the width */
  display: flex; /* Use flexbox to align input fields vertically */
  flex-direction: column; /* Arrange input fields vertically */
}

.input-container {
  margin-bottom: 15px; /* Add spacing between inputs */
}

.input-container label {
  margin-bottom: 5px;
}

.input-row {
  display: flex;
  align-items: center;
}

.input-row .input-container {
  flex: 1; /* Take up equal space */
}

.input-margin {
  margin-right: 10px;
}

.input-container input,
.input-container textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.category-image {
  flex: 1; /* Take up 50% of the width */
  margin-right: 20px; /* Add spacing between image and form */
}

.category-image img {
  max-width: 300px; /* Set the maximum width of the image */
  height: auto; /* Maintain aspect ratio */
  border-radius: 5px;
}

.close-button {
  background-color: #ff6666; /* Red color */
  color: white; /* Text color */
  border: none;
  border-radius: 10px; /* Rounded corners */
  padding: 5px 10px; /* Padding */
  cursor: pointer;
  transition: background-color 0.3s; /* Smooth transition */
}

.submit-button {
  background-color: #22972c; /* Red color */
  color: white; /* Text color */
  border: none;
  border-radius: 10px; /* Rounded corners */
  padding: 5px 10px; /* Padding */
  cursor: pointer;
  margin-left: 10px;
  transition: background-color 0.3s; /* Smooth transition */

  &:disabled {
    color: #eee;
    background: #aaa;
    cursor: auto;
  }
}

.modal-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.form-group {
  display: flex;
  flex-direction: column;
  width: 500px;
  margin-bottom: 10px; /* Add some spacing between each input */
}

.input-container {
  display: flex;
  align-items: center;
  margin-bottom: 5px; /* Adjust spacing between each label-input pair */
}

.input-container label {
  margin-right: 10px; /* Adjust spacing between label and input */
}

.input-container input {
  flex: 1; /* Allow input to take up remaining space */
}

</style>