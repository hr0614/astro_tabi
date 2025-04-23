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
  category: string[],
}

export const InfoContents = () => {
  const [items, setItems] = useState<Item[]>()
  // console.log(cats);
  const fetchItems = async () => {
    const res = await fetch("https://hari-test.microcms.io/api/v1/info?limit=6", {
      headers: {
        "X-MICROCMS-API-KEY": import.meta.env.PUBLIC_MICROCMS_API_KEY || '',
      },
    });
    const data = await res.json()
    setItems(data.contents)
  }

  useEffect(() => {
    fetchItems()
  }, [])

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
        {items && items.map((item, index) => {
          return (
            <li className={s.item} key={index}>
              <a href={`/info/${item.id}`} className={s.articleLink}>
                <InfoItem
                  title={item.title}
                  imageUrl={item.thumbnail?.url}
                  date={item.publishedAt}
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
