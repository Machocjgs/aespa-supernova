import axios from 'axios';

const API_URL = 'http://localhost:3000/api/size/';

class SizeService {
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

  createSize(body){
    return axios.post(`${API_URL}`, body, {headers: {'token': localStorage.getItem('token')}})
  }

  deleteSize(size_id) {
    console.log(size_id);
    return axios.delete(`${API_URL}/${size_id}`, {headers:{'token': localStorage.getItem('token')}});
  }
}

export default new SizeService();