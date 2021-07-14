// export function fetchPictures(name, page) {
//   const API_KEY = '21672899-2a5ee6aa4aab0c8363895dd3b'
//   const BASE_URL = 'https://pixabay.com/api'
//   return fetch(
//     `${BASE_URL}/?key=${API_KEY}&q=${name}&image_type=photo&page&per_page=12&page=${page}`,
//   ).then((response) => {
//     if (response.ok) {
//       return response.json()
//     }
//     return Promise.reject(new Error(`Нет изображения с именем ${name.tags}`))
//   })
// }

import axios from 'axios'

export const fetchPictures = async (pictureName, page) => {
  const BASE_URL = 'https://pixabay.com/api'
  const API_KEY = '21672899-2a5ee6aa4aab0c8363895dd3b'
  const response = await axios.get(
    `${BASE_URL}/?key=${API_KEY}&q=${pictureName}&image_type=photo&page&per_page=12&page=${page}`,
  )
  const hits = await response.data.hits

  return hits
}
