<template>
  <div class="appBox">
    <div class="loginBox">
      <div class="inner">
        <div class="signIn" v-if="signIn">
          <div class="top">
            <img
              class="logo"
              src="../assets/nuwa-logo-full.png"
            />
            <div class="title">Sign in</div>
          </div>
          <form @submit="handleLogin" v-on:submit.prevent="onSubmit">
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
              />
              <div v-if="user.error" class="errorInput">Username is required.</div>

              <input
                required
                aria-required="true"
                type="password"
                class="w100"
                :class="{ invalid: password.error }"
                placeholder="Password"
                v-model="password.value"
                @blur="validatePassword"
                @keydown="validatePassword"
              />
              <div v-if="password.error" class="errorInput">Password is required.</div>
            </div>

            <input
              type="submit"
              value="Submit"
              class="action"
              :class="{ 'action-disabled': !loginValid }"
            />

            <p class="resetPass">
              <router-link to="reset">Reset password?</router-link>
            </p>
          </form>
        </div>
      </div>
      <v-slide-y-transition>
        <v-alert
          class="alertError"
          v-model="alert"
          color="error"
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
  name: "Login",
  data() {
    return {
      password: {
        value: "",
        error: false
      },

      user: {
        value: "",
        error: false
      },

      signIn: true,
      message: null,
      alert: false,
    };
  },

  methods: {
    validateUserName(event) {
      if (this.user.value == "") this.user.error = true;
      else this.user.error = false;
    },

    validatePassword(event) {
      if (this.password.value == "") this.password.error = true;
      else this.password.error = false;
    },

    handleLogin() {
      const user = {username: this.user.value, password: this.password.value}
      this.$store.dispatch("auth/login", user).then(
        () => {
          this.$router.push("/");
        },
        (error) => {
          this.alert=true
          
          setTimeout(() => {
            this.alert = false
          }, 2000)

          this.message =
            (error.response &&
              error.response.data &&
              error.response.data.error) ||
            error.message ||
            error.toString();
          
          if (this.message == "Invalid User or Password") {
              this.user.error = true;
              this.password.error = true;
          }
        }
      );
    },
  },

  computed: {

    usernameValid() {
      return this.user.value.length > 0;
    },

    passwordValid() {
      return this.password.value.length > 0;
    },

    loginValid() {
      return this.usernameValid && this.passwordValid;
    },

    loggedIn() {
      return this.$store.state.auth.status.loggedIn;
    }

  },
  created() {
    if (this.loggedIn) {
      this.$router.push("/");
    }
  }
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

.loginBox {
  background: #fff;
  max-width: 400px;
  border-radius: 15px;
  padding: 25px 55px;
  animation: slideInTop 1s;
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

.alertError{
  margin-top: 10px;
  text-align: center;
}

.resetPass{
  text-align: center;
  font-size: .8rem;
  margin-top: 10px;
}

@media screen and (min-width: 440px) {
  .loginBox {
    @include box;
  }
}

@media screen and (max-width: 440px) {
  html {
    background: #fff;
    align-items: start;
    justify-content: start;
  }

  .loginBox {
    padding: 25px 25px;
    max-width: 100vw;
  }
}
</style>
