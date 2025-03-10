import { div } from 'framer-motion/client';
import React, { useState, useEffect } from 'react'
// import s from '../galleryContents/gallery.module.css'
import Masonry from 'react-layout-masonry';


type Item = {
  image?: {
    url: string
  },
  category: string[],
  comment: string[]
}


export const Gallery = () => {
  const [items, setItems] = useState<Item[]>()
  console.log(items);
  const fetchItems = async () => {
    const res = await fetch("https://hari-test.microcms.io/api/v1/gallery", {
      headers: {
        "X-MICROCMS-API-KEY": "c0aSqVH637iloNXUyIZnlKzv0S3UTA3SRhXP",
      },
    });
    const data = await res.json()
    setItems(data.contents)
  }

  useEffect(() => {
    fetchItems()
  }, [])

  return (
    <Masonry
      columns={4}
      gap={16}
    >
      {items && items.map((item, index) => {
        return <img src={item.image?.url} alt="" key={index} />;
      })}
    </Masonry>
  )
}


