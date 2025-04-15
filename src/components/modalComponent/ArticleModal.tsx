import React, { useState } from 'react';
import Modal from 'react-modal';
import s from './articleModal.module.css';


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

// 取得するPropsの型定義
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
    // デフォルトスタイルを使用するかを判定
    <div className={useDefaultStyles ? s.illustContainer : ''}>
      {/* 記事サムネイル（クリックでモーダル表示） */}
      {/* メモ　↓をinfoContentsの内容に書き換え 記事の内容取得のためのAPI記述をAPIのファイルに追加すること */}
      <img
        src={imageUrl}
        alt={alt}
        onClick={openModal}
        className={useDefaultStyles ? s.thumbnailImage : ''}
      />

      {/* 記事モーダル */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="記事の内容"
      >
        <div className={s.modalContent}>
          {/* モーダルに表示する記事の内容 */}
          <img src={imageUrl} alt={alt} className={s.modalImage} />
          <button onClick={closeModal} className={s.closeButton}>
            ✕
          </button>
        </div>
      </Modal>
    </div>
  );
}