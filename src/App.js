import { useState, useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { onErrorToast } from './Components/ToastError'
import { GalleryLoader, ModalLoader } from './Components/Loader/Loader'
import s from './App.module.css'
import Container from './Components/Container/Container'
import { SearchBar } from './Components/Searchbar/Searchbar'
import { ImageGallery } from './Components/ImageGallery/ImageGallery'

import { fetchPictures } from './services/pictures-api'
import Button from './Components/Button/Button'
import Modal from './Components/Modal/Modal'
import image from './Components/Images/search-g722c6413f_640.jpg'

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
}

export function App() {
  const [pictureName, setPictureName] = useState(null)
  const [pictures, setPictures] = useState([])
  const [status, setStatus] = useState(Status.IDLE)
  const [page, setPage] = useState(1)
  const [largeImageURL, setLargeImageURL] = useState(null)
  const [imgTags, setImgTags] = useState('')
  const [loader, setLoader] = useState(false)

  function onModalClose() {
    setLargeImageURL(null)
  }

  function hideLoaderInModal() {
    setLoader(false)
  }
  function handleImageClick(largeImageURL, imgTags) {
    setLargeImageURL(largeImageURL)
    setImgTags(imgTags)
    setLoader(true)
  }

  function handleFormSubmit(pictureName) {
    if (pictureName.trim() === '') {
      onErrorToast()
      return
    }

    resetState()
    setPictureName(pictureName)
  }

  function resetState() {
    setPictureName(null)
    setPage(1)
    setPictures([])
  }

  function onLoadMoreBtn() {
    setPage((page) => page + 1)
  }

  useEffect(() => {
    if (!pictureName) {
      return
    }
    setStatus(Status.PENDING)

    async function onFetchPictures() {
      try {
        const pictures = await fetchPictures(pictureName, page)

        if (pictures.length === 0) {
          throw new Error()
        }

        setPictures((state) => [...state, ...pictures])
        setStatus(Status.RESOLVED)
      } catch (error) {
        setStatus(Status.REJECTED)
        onErrorToast()
      }
    }

    setTimeout(() => {
      onFetchPictures()
    }, 500)
  }, [page, pictureName])

  useEffect(() => {
    function scrollPageToEnd() {
      setTimeout(() => {
        window.scrollBy({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth',
        })
      }, 1000)
    }

    if (page > 1) {
      scrollPageToEnd()
    }
  }, [pictures, page])

  const showImageList = pictures.length > 0

  return (
    <Container>
      <ToastContainer autoClose={4000} />
      <SearchBar onSearch={handleFormSubmit} />
      {status === Status.IDLE && (
        <>
          <img src={image} width="1200" alt="question" className={s.image} />
        </>
      )}
      {status === Status.PENDING && <GalleryLoader />}

      <ImageGallery pictures={pictures} handleImageClick={handleImageClick} />
      {showImageList && status === Status.RESOLVED && (
        <Button onClick={onLoadMoreBtn} aria-label="add contact" />
      )}
      {largeImageURL && (
        <Modal onClose={onModalClose}>
          {loader && <ModalLoader />}
          <img src={largeImageURL} alt={imgTags} onLoad={hideLoaderInModal} />
        </Modal>
      )}
    </Container>
  )
}
