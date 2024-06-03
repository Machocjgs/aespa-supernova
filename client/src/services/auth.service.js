import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth/';

class AuthService {
  login(user) {
    return axios
      .post(API_URL + 'login', {
        user_name: user.username,
        password: user.password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          localStorage.setItem('token', response.data.accessToken);
        }

        return response.data;
      });
  }

  reset(user) {
    return axios
      .post(API_URL + 'passwordchange', {
        user_name: user.username,
        old_password: user.oldpassword,
        new_password: user.newpassword
      })
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }
}

export default new AuthService();