import axios from 'axios'

const baseUrl = '/api/persons'

const getAll = () => { 
 return axios.get(baseUrl)
}

const create = (newObj) => {
  return axios.post(baseUrl, newObj)
}

const erase = (id) => {
  return axios.delete(`${baseUrl}/${id}`)
}

const update = (id, newObj) => {
  return axios.put(`${baseUrl}/${id}`, newObj)
}

export default { getAll, create, erase, update}