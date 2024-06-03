import axios from 'axios';

const API_URL = 'http://localhost:3000/api/user/';

class UserService {
  findMany(params) {
    return axios
      .get(API_URL, {params})
      .then(response => {

        const res = {data: [
            {
                "product_id": 3,
                "product_name": "SuperUser1",
                "product_brand": "asdasasdasdsad@testskasdrt.com",
                "product_description": "Forward",
                "category": "Shirt",
                "product_price": 88,
                "image_url": "http://localhost:3000/images/1e9ba182-68ae-43fb-86dd-9d66fec487c5.png",
                "created_dt": "2024-06-02T10:33:22.999Z",
                "last_modified_dt": "2024-06-02T17:52:24.779Z"
            },
            {
                "product_id": 6,
                "product_name": "SuperUser",
                "product_brand": "adasdasdasdas@testskasdrt.com",
                "product_description": "Center",
                "category": "Shorts",
                "product_price": 3,
                "image_url": "http://localhost:3000/images/1e9ba182-68ae-43fb-86dd-9d66fec487c5.png",
                "created_dt": "2024-06-02T10:43:12.656Z",
                "last_modified_dt": "2024-06-02T17:12:41.921Z"
            },
            {
                "product_id": 11,
                "product_name": "Shorts3",
                "product_brand": "ThisIsNeverThat",
                "product_description": "Forward",
                "category": "Shorts",
                "product_price": 99,
                "image_url": "http://localhost:3000/images/1e9ba182-68ae-43fb-86dd-9d66fec487c5.png",
                "created_dt": "2024-06-02T17:56:19.489Z",
                "last_modified_dt": "2024-06-02T17:56:19.489Z"
            }
        ]}
        return res;
        // return response;
      });
  }

  updateUser(body){
    const requestBody = {}
    if (body.user_name) requestBody.user_name = body.user_name
    if (body.email) requestBody.email = body.email
    if (body.position) requestBody.position = body.position
    if (body.tier_access) requestBody.tier_access = body.tier_access

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