import axios from 'axios';

const API_URL = 'http://localhost:3000/api/product/';

class ProductService {
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


  updateProduct(formData) {
    return axios.patch(`${API_URL}/${formData.get('product_id')}`, formData, {
      headers: {
        'token':localStorage.getItem('token'),
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  createProduct(formData) {
    return axios.post(API_URL, formData, {
      headers:{
        'token':localStorage.getItem('token'),
        'Content-Type': 'multipart/form-data'
      }
    })
  }
  
  deleteProduct(productId) {
    return axios.delete(`${API_URL}/${productId}`, {
      headers: {
        'token':localStorage.getItem('token'),
        'Content-Type': 'multipart/form-data'
      }
    })
  }

}

export default new ProductService();