import axios from 'axios';

const API_URL = 'http://localhost:3000/api/user/';

class UserService {
  findMany(params) {
    return axios
      .get(API_URL, {params}, {headers: {'token': localStorage.getItem('token')}})
      .then(response => {
        return response;
      });
  }

  updateUser(body){
    const requestBody = {}
    if (body.user_name) requestBody.user_name = body.user_name
    if (body.email) requestBody.email = body.email
    if (body.position) requestBody.position = body.position

    return axios.patch(
      `${API_URL}/${body.user_id}`, 
      requestBody, 
      {headers: {'token': localStorage.getItem('token')}}
    )
  }

  createUser(body){
    return axios.post(`${API_URL}`, body, {headers: {'token': localStorage.getItem('token')}})
  }

  deleteUser(user_id) {
    console.log(user_id);
    return axios.delete(`${API_URL}/${user_id}`, {headers:{'token': localStorage.getItem('token')}});
  }
}

export default new UserService();