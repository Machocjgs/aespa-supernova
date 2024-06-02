<template>
    <div class="appBox">
      <div class="resetBox">
        <div class="inner">
          <div class="signIn" v-if="reset">
            <div class="top">
              <img
                class="logo"
                src="../assets/nuwa-logo-full.png"
              />
              <div class="title">Reset Password</div>
            </div>
            <form @submit="handleReset" v-on:submit.prevent="onSubmit">
              <div class="form">
                <input
                  required
                  aria-required="true"
                  type="text"
                  class="w100"
                  :class="{ invalid: user.error }"
                  ref="user"
                  placeholder="Username"
                  @blur="validateUserName"
                  @keydown="validateUserName"
                  v-model="user.value"
                  :disabled="resetSuccess"
                />
                <div v-if="user.error" class="errorInput">Username is required.</div>
  
                <input
                  required
                  aria-required="true"
                  type="password"
                  class="w100"
                  :class="{ invalid: oldPassword.error }"
                  placeholder="Old Password"
                  v-model="oldPassword.value"
                  @blur="validateOldPassword"
                  @keydown="validateOldPassword"
                  :disabled="resetSuccess"
                />
                <div v-if="oldPassword.error" class="errorInput">Old password is required.</div>

                <input
                  required
                  aria-required="true"
                  type="password"
                  class="w100"
                  :class="{ invalid: newPassword.error }"
                  placeholder="New Password"
                  v-model="newPassword.value"
                  @blur="validateNewPassword"
                  @keydown="validateNewPassword"
                  :disabled="resetSuccess"
                />
                <div v-if="newPassword.error" class="errorInput">{{ newPasswordErrorMessage }}</div>
              </div>
  
              <input
                type="submit"
                :value="loading ? 'Loading...' : 'Submit'"
                class="action"
                :class="{ 'action-disabled': !resetValid || loading || resetSuccess }"
                :disabled="!resetValid || loading || resetSuccess"
              />
  
              <p class="resetPass">
                <router-link to="login">Back to login</router-link>
              </p>
            </form>
          </div>
        </div>
        <v-slide-y-transition>
          <v-alert
            v-if="alert && message"
            class="alert"
            v-model="alert"
            :color="alertType"
            variant="tonal"
          >
            {{ message }}
          </v-alert>
        </v-slide-y-transition>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Reset",
    data() {
      return {
        // passwordRegex: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/,
  
        oldPassword: {
          value: "",
          error: false
        },

        newPassword: {
          value: "",
          error: false
        },
  
        user: {
          value: "",
          error: false
        },
  
        reset: true,
        message: null,
        alert: false,
        resetSuccess: false,
        loading: false,
      };
    },
  
    methods: {
      validateUserName(event) {
        if (this.user.value == "") this.user.error = true;
        else this.user.error = false;
      },
  
      validateOldPassword(event) {
        if (this.oldPassword.value == "") this.oldPassword.error = true;
        else this.oldPassword.error = false;
      },

      validateNewPassword(event) {
        if (this.newPassword.value == "" || 
          this.newPassword.value == this.oldPassword.value) {
          this.newPassword.error = true;
        } else {
          this.newPassword.error = false;
        }
      },
  
      handleReset() {
        this.loading = true;
        const user = {username: this.user.value, newpassword: this.newPassword.value, oldpassword: this.oldPassword.value}
        this.$store.dispatch("auth/reset", user).then(
          (data) => {
            this.alert = true;
            this.alertType = 'success';
            this.message = data.message;
            this.resetSuccess = true; // Set resetSuccess to true

            setTimeout(() => {
              this.alert = false; // Close the alert after 2 seconds (2000 milliseconds)
              setTimeout(() => {
                this.$router.push("/login"); // Redirect to login after closing the success alert
              }, 500);
            }, 500);
          },
          (error) => {
            this.alert = true;
            this.alertType = 'error';
            this.message =
              (error.response &&
                error.response.data &&
                error.response.data.error) ||
              error.message ||
              error.toString();

            if (this.message == "User not found!") {
              this.user.error = true;
              this.oldPassword.value = "";
              this.newPassword.value = "";
            }

            if (this.message == "Invalid old password!") {
              this.oldPassword.error = true;
              this.newPassword.value = "";
            }

            setTimeout(() => {
              this.alert = false; // Close the alert after 2 seconds (2000 milliseconds)
            }, 2000);
          }
        ).finally(() => {
          // Set loading back to false after the reset process completes
          this.loading = false;
        });
      },
    },
  
    computed: {
      loggedIn() {
        return this.$store.state.auth.status.loggedIn;
      },
      newPasswordErrorMessage() {
        if (this.newPassword.error) {
            if (this.newPassword.value === "") {
                return "New password is required.";
            } else if (this.newPassword.value === this.oldPassword.value) {
                return "The new password must be distinct from the previous one.";
            }
        }
        return ""; // No error message if there is no error
      },
      resetValid() {
        return (
          this.user.value.length > 0 &&
          this.oldPassword.value.length > 0 &&
          this.newPassword.value.length > 0 &&
          !this.user.error &&
          !this.oldPassword.error &&
          !this.newPassword.error &&
          this.oldPassword.value != this.newPassword.value
        );
      }
    },
    mounted() {
      if (this.loggedIn) {
        this.$router.push("/");
      }
    },
  };
  </script>
  
  <!-- Use preprocessors via the lang attribute! e.g. <style lang="scss"> -->
  <style lang="scss" scoped>
  @mixin box {
    box-shadow: 1px 1px 2px 1px #ccc;
  }
  
  @mixin field {
    border: 1px solid #aaa;
    height: 40px;
    padding: 10px;
    margin-top: 20px;
    border-radius: 5px;
    box-sizing: border-box;
  }
  
  input[type="text"] {
    @include field;
  }
  
  input[type="password"] {
    @include field;
  }
  
  .invalid {
    border: 2px solid red !important;
    &::placeholder {
      color: red;
    }
  }
  
  .errorMessage {
    color: red;
    margin: 10px;
    top: 5px;
  }

  .errorInput {
    color: red;
    font-size: .8rem;
  }
  
  .w100 {
    width: 100%;
  }
  
  .logo {
    width: 300px;
    margin-bottom: 10px;
  }
  
  .action {
    height: 40px;
    text-transform: uppercase;
    border-radius: 25px;
    width: 100%;
    border: none;
    cursor: pointer;
    background: green;
    margin-top: 20px;
    color: #fff;
    font-size: 1.2rem;
    @include box;
  }
  
  .action-disabled {
    color: #eee;
    background: #aaa;
    cursor: auto;
  }
  
  .top {
    display: flex;
    align-items: center;
    flex-direction: column;
    margin-bottom: 10px;
  }
  
  .title {
    width: 100%;
    font-size: 1.8rem;
    margin-bottom: 10px;
    text-align: center;
  }
  
  .appBox {
    background-repeat: no-repeat;
    background: linear-gradient(
      to bottom,
      #edd4a2 0%,
      #F8C963 100%
    );
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100vw;
    height: 100vh;
    font-family: 'Montserrat', sans-serif;
    padding: 25px 55px;
  }
  
  .resetBox {
    background: #fff;
    max-width: 400px;
    border-radius: 15px;
    padding: 25px 55px;
  }
  
  @keyframes slideInTop {
    from {
      opacity: 0;
      transform: translateY(-30%);
    }
  
    to {
      opacity: 100;
      transform: translateY(0%);
    }
  }
  
  .alert{
    margin-top: 10px;
    text-align: center;
  }
  
  .resetPass{
    text-align: center;
    font-size: .8rem;
    margin-top: 10px;
  }
  
  @media screen and (min-width: 440px) {
    .resetBox {
      @include box;
    }
  }
  
  @media screen and (max-width: 440px) {
    html {
      background: #fff;
      align-items: start;
      justify-content: start;
    }
  
    .resetBox {
      padding: 25px 25px;
      max-width: 100vw;
    }
  }
  </style>
  