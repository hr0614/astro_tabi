import React, { useState, useEffect } from 'react'
import s from "../infoContents/infoContents.module.css"
import InfoItem from "./InfoItem"

type Item = {
  title: string,
  thumbnail?: {
    url: string
  },
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

  return (
    <div className={s.infoList} >
      <ul className={s.infoItems}>
        {items && items.map((item, index) => {
          return (
            <li className={s.item} key={index}>
              <InfoItem title={item.title}
                imageUrl={item.thumbnail?.url}
                date={item.publishedAt}
                category={item.category[0]} />
            </li>
          )
        })}
      </ul>
    </div>

  )
}
