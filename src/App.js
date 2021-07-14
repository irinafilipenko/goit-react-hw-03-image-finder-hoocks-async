import { Component } from 'react'
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

export class App extends Component {
  state = {
    pictureName: null,
    pictures: [],
    status: Status.IDLE,
    page: 1,
    largeImageURL: null,
    imgTags: '',
    loader: false,
  }

  onModalClose = () => {
    this.setState({ largeImageURL: null })
  }

  hideLoaderInModal = () => this.setState({ loader: false })

  handleImageClick = (largeImageURL, imgTags) => {
    this.setState({ largeImageURL, imgTags, loader: true })
  }

  handleFormSubmit = (pictureName) => {
    const pictureQuery = this.state.pictureName === pictureName

    if (pictureQuery) {
      return
    }
    if (pictureName.trim() === '') {
      onErrorToast()
      return
    }

    this.resetState()
    this.setState({ pictureName })
  }

  handleNameChange = (pictureName) => {
    this.setState({ pictureName })
  }

  resetState = () => {
    this.setState({
      pictureName: null,
      page: 1,
      pictures: [],
      status: Status.IDLE,
    })
  }

  scrollPageToEnd = () => {
    setTimeout(() => {
      window.scrollBy({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth',
      })
    }, 1000)
  }

  onLoadMoreBtn = () => {
    this.setState((prevState) => ({
      page: prevState.page + 1,
    }))
  }

  async onFetchPictures() {
    const { pictureName, page } = this.state
    try {
      const pictures = await fetchPictures(pictureName, page)

      if (pictures.length === 0) {
        throw new Error()
      }

      this.setState((prevState) => ({
        pictures: [...prevState.pictures, ...pictures],

        status: Status.RESOLVED,
      }))
    } catch (error) {
      this.setState({ status: Status.REJECTED })
      onErrorToast()
    }
  }

  componentDidUpdate(_, prevState) {
    const { pictureName, page } = this.state
    const shouldFetch =
      prevState.pictureName !== pictureName || prevState.page !== page

    if (shouldFetch) {
      this.setState({ status: Status.PENDING })
      this.onFetchPictures()
    }
    if (page > 1) {
      this.scrollPageToEnd()
    }
  }

  render() {
    const { pictures, status, largeImageURL, imgTags, loader } = this.state

    const showImageList = pictures.length > 0

    return (
      <Container>
        <ToastContainer autoClose={4000} />

        <SearchBar onSearch={this.handleFormSubmit} />
        {status === Status.IDLE && (
          <>
            <img src={image} width="1600" alt="question" className={s.image} />
          </>
        )}
        {status === Status.PENDING && <GalleryLoader />}

        {status === Status.RESOLVED && (
          <ImageGallery
            pictures={pictures}
            handleImageClick={this.handleImageClick}
          />
        )}
        {showImageList && (
          <Button onClick={this.onLoadMoreBtn} aria-label="add contact" />
        )}
        {largeImageURL && (
          <Modal onClose={this.onModalClose}>
            {loader && <ModalLoader />}
            <img
              src={largeImageURL}
              alt={imgTags}
              onLoad={this.hideLoaderInModal}
            />
          </Modal>
        )}
      </Container>
    )
  }
}
