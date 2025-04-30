import React, { useState, useEffect } from 'react'
import s from '../galleryContents/gallery.module.css'
import Masonry from 'react-layout-masonry';
import Item from './Item';
import { div } from 'framer-motion/client';

type Item = {
  image?: {
    url: string
  },
  category: string[],
  comment: string[],
}

export const MasonryContents = () => {
  // 初期値を設定せずに、ローディング状態を追加
  const [items, setItems] = useState<Item[]>([])
  const [category, setCategory] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // レスポンシブ対応のためのスクリーンサイズチェック
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 719);
    }

    // 初期チェック
    checkScreenSize();

    // リサイズイベントリスナー
    window.addEventListener('resize', checkScreenSize);

    // クリーンアップ
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    }
  }, []);

  // コンポーネントマウント時に一度だけURLパラメータを取得
  useEffect(() => {
    // URLからクエリパラメータを取得
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get('category');

    // クエリパラメータが存在する場合はその値を、なければデフォルト値を設定
    setCategory(categoryParam || "Original");
  }, []);

  // categoryが設定された後にのみデータを取得
  useEffect(() => {
    // categoryがnullの場合は何もしない（初期化前）
    if (category === null) return;

    const fetchItems = async () => {
      try {
        const res = await fetch(`${import.meta.env.PUBLIC_MICROCMS_API_URL}gallery?filters=category[contains]${category}`, {
          headers: {
            "X-MICROCMS-API-KEY": import.meta.env.PUBLIC_MICROCMS_API_KEY || '',
          },
        });
        const data = await res.json();
        setItems(data.contents);
      } catch (error) {
        console.error("データの取得に失敗しました", error);
      }
    };

    fetchItems();
  }, [category]); // categoryが変更されたときだけ実行

  // 現在のカテゴリに基づいてリンクのスタイルを決定
  const isOriginalActive = category === "Original";
  const isWorkActive = category === "Work";

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <a href="/gallery" className={`${s.nav} ${isOriginalActive ? s.active : ''}`}>Original</a>
        <a href="/gallery?category=Work" className={`${s.nav} ${isWorkActive ? s.active : ''}`}>Work</a>
      </div>
      <div className={s.image_area}>
        <Masonry
          columns={isMobile ? 3 : 4}
          gap={16}
        >
          {items && items.map((item, index) => {
            return (
              <Item imageUrl={item.image?.url} index={index} key={index} />
            )
          })}
        </Masonry>
      </div>
    </div>
  )
}
