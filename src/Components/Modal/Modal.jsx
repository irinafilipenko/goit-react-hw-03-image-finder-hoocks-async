import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import PropTypes from 'prop-types'
import s from './Modal.module.css'

const modalRoot = document.querySelector('#modalroot')

function Modal({ onClose, children }) {
  useEffect(() => {
    window.addEventListener('keydown', handleKeydown)
    return () => {
      window.removeEventListener('keydown', handleBackdropClick)
    }
  })

  const handleKeydown = (e) => {
    if (e.code === 'Escape') {
      onClose()
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return createPortal(
    <div className={s.Overlay} onClick={handleBackdropClick}>
      <div className={s.Modal}>{children}</div>
    </div>,
    modalRoot,
  )
}

Modal.defaultProps = {
  onClose: () => null,
  children: null,
}

Modal.propTypes = {
  onClose: PropTypes.func,
  children: PropTypes.node,
}

export default Modal
