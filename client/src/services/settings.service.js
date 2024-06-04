import axios from 'axios';

const API_URL = 'http://localhost:3000/api/category/';

class CategoryService {
  findMany(params) {
    const payload = {
      method: 'get',
      url: API_URL,
      headers: {'token': localStorage.getItem('token')},
      params
    }

    return axios(payload)
      .then(response => {
        return response;
      });
  }

  // updateUser(body){
  //   const requestBody = {}
  //   if (body.product_name) requestBody.product_name = body.product_name
  //   if (body.email) requestBody.email = body.email
  //   if (body.position) requestBody.position = body.position
  //   if (body.tier_access) requestBody.tier_access = body.tier_access

  //   return axios.patch(
  //     `${API_URL}/${body.user_id}`, 
  //     requestBody, 
  //     {headers: {'token': localStorage.getItem('token')}}
  //   )
  // }

  // createUser(body){
  //   return axios.post(`${API_URL}`, body, {headers: {'token': localStorage.getItem('token')}})
  // }

  // deleteUser(user_id) {
  //   console.log(user_id);
  //   return axios.delete(`${API_URL}/${user_id}`, {headers:{'token': localStorage.getItem('token')}});
  // }
}

export default new CategoryService();