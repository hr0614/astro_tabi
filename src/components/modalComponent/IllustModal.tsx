// src/components/ModalComponent.jsx
import React, { useState } from 'react';
import Modal from 'react-modal';
import s from './illustModal.module.css';

// スタイル設定
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '90%',
    maxHeight: '90%',
    padding: '10px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: 'none',
    borderRadius: '10px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    zIndex: 1000
  }
};

// アプリケーションのルート要素を設定（Astroでは_astroIDが動的に生成されるので注意）
if (typeof window !== 'undefined') {
  Modal.setAppElement('body');
}

type IllustModalProps = {
  imageUrl: string;
  alt?: string;
  useDefaultStyles?: boolean;
}

export default function IllustModal({ imageUrl, alt = '', useDefaultStyles = true }: IllustModalProps) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <div className={useDefaultStyles ? s.illustContainer : ''}>
      {/* サムネイル画像（クリックでモーダル表示） */}
      <img
        src={imageUrl}
        alt={alt}
        onClick={openModal}
        className={useDefaultStyles ? s.thumbnailImage : ''}
      />

      {/* モーダル */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="イラスト詳細"
      >
        <div className={s.modalContent}>
          <img src={imageUrl} alt={alt} className={s.modalImage} />
          <button onClick={closeModal} className={s.closeButton}>
            ✕
          </button>
        </div>
      </Modal>
    </div>
  );
}