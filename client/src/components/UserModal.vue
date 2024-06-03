<template>
  <div class="modal" v-if="show">
    <div class="modal-overlay" @click="closeModal"></div>
    <div class="modal-content">
      <div class="modal-header">
      <h2>{{ mode === 'create' ? 'New User' : mode === 'edit' ? 'Update User' : 'User Details' }}</h2>
      </div>
      <div class="modal-body">
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <div v-if="mode !== 'create'" class="input-container">
              <v-text-field label="User ID" v-model="SelectedUser.user_id" :variant="filled" :readonly="true"/>
            </div>
            <div class="input-container">
              <v-text-field v-model="SelectedUser.user_name" label="User Name" :variant="variant" :readonly="readonly" :rules="[requiredRule]"/>
            </div>
            <div v-if="mode === 'create'" class="input-container">
              <v-text-field v-model="SelectedUser.password" type="password" label="Password" :variant="variant" :readonly="readonly" :rules="[requiredRule]"/>
            </div>
            <div class="input-container">
              <v-text-field v-model="SelectedUser.email" label="Email" :variant="variant" :readonly="readonly" :rules="[requiredRule, emailRule]"/>
            </div>
            <div class="input-container">
              <v-text-field v-model="SelectedUser.position" label="Position" :variant="variant" :readonly="readonly" :rules="[requiredRule]"/>
            </div>
            <div class="input-container">
              <v-text-field v-model="SelectedUser.tier_access" label="Tier Access" :variant="variant" :readonly="readonly" :rules="[requiredRule]"/>
            </div>
            <div v-if="mode !== 'create'" class="input-container">
              <v-text-field v-model="SelectedUser.created_dt" label="Created At" :variant="filled" :readonly="true"/>
            </div>
            <div v-if="mode !== 'create'" class="input-container">
              <v-text-field v-model="SelectedUser.last_modified_dt" label="Last Modified" :variant="filled" :readonly="true"/>
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
    user: {
      type: Object,
      default: null
    },
  },
  watch: {
    user(newUserValue) {
      this.SelectedUser = {...newUserValue};
      this.originalUser = {...newUserValue};
    }
  },
  data() {
    return {
      SelectedUser: { ...this.user },
      originalUser: { ...this.user }, // Store the original user data
      requiredFields: ['user_name', 'password', 'position', 'email', 'tier_access']
    };
  },
  methods: {
    submitForm() {
      if (this.mode !== 'view') {
        this.$emit(this.mode, this.SelectedUser);
      }
      this.closeModal();
    },

    closeModal() {
      this.$emit('close');
    },

    requiredRule(value) {
      return !!value || 'Field is required';
    },

    emailRule(value) {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailPattern.test(value) || 'Invalid email format';
    }
  },
  computed: {
    variant() {
      return this.mode === 'view' ? 'filled' : 'outlined'
    },
    readonly() {
      return this.mode === 'view'
    },
    changesMade() {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      // Ensure email format is valid if email is present
      if (this.SelectedUser.email && !emailPattern.test(this.SelectedUser.email)) {
        return false
      }

      // Check if any changes have been made to the user data
      if (this.mode !== 'create'){
        for (let key in this.SelectedUser) {
          if (this.SelectedUser[key] != this.originalUser[key] && this.SelectedUser[key]) {

            return true
          }
        }
        return false
      } else {
        return this.requiredFields.every(field => !!this.SelectedUser[field])
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
  align-items: center;
  flex-direction: column;
}

.modal-details {
  margin-bottom: 20px;
  white-space: nowrap;
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