import s from './ImageGallery.module.css'
import ImageGalleryItem from '../ImageGalleryItem/ImageGalleryItem'

export const ImageGallery = ({ pictures, handleImageClick }) => {
  return (
    <ul className={s.ImageGallery}>
      {pictures.map(({ id, webformatURL, largeImageURL, tags }) => (
        <ImageGalleryItem
          key={id}
          webformatURL={webformatURL}
          largeImageURL={largeImageURL}
          tags={tags}
          handleImageClick={handleImageClick}
        />
      ))}
    </ul>
  )
}
