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

  createCategory(body){
    return axios.post(`${API_URL}`, body, {headers: {'token': localStorage.getItem('token')}})
  }

  deleteCategory(category_id) {
    console.log(category_id);
    return axios.delete(`${API_URL}/${category_id}`, {headers:{'token': localStorage.getItem('token')}});
  }
}

export default new CategoryService();