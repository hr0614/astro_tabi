import React, { useState, useEffect } from 'react'
import s from "../infoContents/infoContents.module.css"
import InfoItem from "./InfoItem"

type Item = {
  id: string,
  title: string,
  thumbnail?: {
    url: string
  },
  content?: string,
  publishedAt: string,
  Date?: string,
  date?: string, // 小文字バージョンも対応
  category: string[],
}

export const InfoContents = () => {
  const [items, setItems] = useState<Item[]>()
  const [isMobile, setIsMobile] = useState(false)
  const [isMediumScreen, setIsMediumScreen] = useState(false)
  const [isLowHeight, setIsLowHeight] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [displayLimit, setDisplayLimit] = useState(6)

  // レスポンシブ対応のためのスクリーンサイズチェック
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      const shortHeight = window.innerHeight <= 679;
      const mediumScreen = window.innerWidth > 720 && window.innerWidth <= 1024;
      const lowHeight = window.innerHeight <= 720;
      const width = window.innerWidth;

      setIsMobile(mobile || shortHeight);
      setIsMediumScreen(mediumScreen);
      setIsLowHeight(lowHeight);

      // 表示数の決定
      let limit = 6;  // デフォルト値

      // 画面の高さが720px以下の場合
      if (lowHeight) {
        // 幅も820px以下の場合は3件表示
        if (width <= 820) {
          limit = 3;
        }
        // 幅が820pxより大きい場合は4件表示
        else {
          limit = 4;
        }
      }
      // 画面の高さが十分ある場合
      else {
        // モバイルまたは中間サイズ画面
        if (mobile || mediumScreen) {
          limit = 4;
        }
        // それ以外（大画面）
        else {
          limit = 6;
        }
      }

      setDisplayLimit(limit);
      // console.log(`Display limit set to: ${limit}, width: ${width}, height: ${window.innerHeight}, lowHeight: ${lowHeight}, width <= 820: ${width <= 820}`);
    }

    // 初期チェック
    checkScreenSize()
    setIsInitialized(true)

    // リサイズイベントリスナー
    window.addEventListener('resize', checkScreenSize)

    // クリーンアップ
    return () => {
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  // 記事取得関数 - 常に最大数(6件)を取得
  const fetchItems = async () => {
    try {
      const res = await fetch(`https://hari-test.microcms.io/api/v1/info?limit=6`, {
        headers: {
          "X-MICROCMS-API-KEY": import.meta.env.PUBLIC_MICROCMS_API_KEY || '',
        },
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`)
      }

      const data = await res.json()
      // console.log('API response data:', data.contents)

      // デバッグ: 各記事の日付関連フィールドを確認
      data.contents.forEach((item: any, index: number) => {
        // console.log(`Item ${index}:`, {
        //   id: item.id,
        //   title: item.title,
        //   Date: item.Date,
        //   date: item.date,
        //   publishedAt: item.publishedAt
        // });
      });

      setItems(data.contents)
    } catch (error) {
      console.error('Failed to fetch items:', error)
    }
  }

  // 初期化時に一度だけ記事を取得
  useEffect(() => {
    if (isInitialized) {
      // console.log('Fetching items once at initialization');
      fetchItems();
    }
  }, [isInitialized])

  // HTMLからプレーンテキストを抽出
  const getPlainTextFromHTML = (html: string) => {
    // 一時的なdiv要素を作成してHTMLを設定
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    // テキスト内容を取得
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  // 本文の抜粋を生成
  const createExcerpt = (content: string | undefined, maxLength: number = 80) => {
    if (!content) return '';

    // HTMLからプレーンテキストを抽出
    const plainText = getPlainTextFromHTML(content);

    // 指定した長さで切り詰め
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength) + '...';
  };

  return (
    <div className={s.infoList} >
      <ul className={s.infoItems}>
        {items && items.slice(0, displayLimit).map((item, index) => {
          // 日付として使用する値を決定（Dateまたはdateがあればそれを使用、なければpublishedAt）
          const displayDate = item.Date || item.date || item.publishedAt;
          // console.log(`Item ${index} display date:`, {
          //   itemDate: item.Date,
          //   itemdate: item.date,
          //   publishedAt: item.publishedAt,
          //   finalDisplayDate: displayDate
          // });

          return (
            <li className={s.item} key={index}>
              <a href={`/info/${item.id}`} className={s.articleLink}>
                <InfoItem
                  title={item.title}
                  imageUrl={item.thumbnail?.url}
                  date={displayDate}
                  category={item.category[0]}
                  excerpt={createExcerpt(item.content)} />
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
