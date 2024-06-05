import axios from 'axios';

const API_URL = 'http://localhost:3000/api/inventory/';

class ProductService {
  findMany(params) {
    const payload = {
      method: 'get',
      url: API_URL,
      headers: {'token': localStorage.getItem('token')},
      params
    }

    return axios(payload);
  }

  updateInventory(body) {
    return axios.patch(`${API_URL}/${body.inventory_id}`, body, {
      headers: {
        'token':localStorage.getItem('token'),
      }
    })
  }

  createInventory(body) {
    return axios.post(API_URL, body, {
      headers:{
        'token':localStorage.getItem('token'),
      }
    })
  }
  
  deleteInventory(inventoryId) {
    return axios.delete(`${API_URL}/${inventoryId}`, {
      headers: {
        'token':localStorage.getItem('token'),
      }
    })
  }

}

export default new ProductService();