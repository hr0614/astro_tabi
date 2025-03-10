import React, { useState, useEffect } from 'react'
// import s from '../galleryContents/gallery.module.css'


// type Item = {
//   image?: {
//     url: string
//   },
//   category: string[],
//   comment: string[]
// // }
// <Item[]>

export const Gallery = () => {
  const [items, setItems] = useState()
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
    <div className='gallery_wrapper'>
      hoge
    </div>
  )
}

