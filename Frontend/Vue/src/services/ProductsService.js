import Api from '@/services/Api'
import secret from '../secret.js'

export default {
  getAllProducts() {
    return Api(`${secret.LARAVEL_APP_URL}`).get(`products/`)
  },
  getProductById(id) {
    return Api(`${secret.LARAVEL_APP_URL}`).get(`products/${id}`)
  },
  createProduct(data) {
    return Api(`${secret.LARAVEL_APP_URL}`).post('products/', data)
  },
  upload(formData) {
    return Api(`${secret.LARAVEL_APP_URL}`).post('products/', formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })
  },
  updateProduct(data, id) {
    return Api(`${secret.LARAVEL_APP_URL}`).post(`products/${id}?_method=PUT`, data)
  },
  deleteProductById(id) {
    return Api(`${secret.LARAVEL_APP_URL}`).delete(`products/${id}`)
  }
}
