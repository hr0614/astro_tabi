import React, { useState, useEffect } from 'react'
import { motion } from "framer-motion";
import s from "../infoContents/infoContents.module.css"
import InfoItem from "./InfoItem"

const fetchCatFactsData = async (setData) => {
  const res = await fetch("https://hari-test.microcms.io/api/v1/info", {
    headers: {
      "X-MICROCMS-API-KEY": "c0aSqVH637iloNXUyIZnlKzv0S3UTA3SRhXP",
    },
  });
  const data = await res.json()
  setData(data.contents)
}

// const data = [
//   {
//     title: "テスト・テストテスト・テストテスト・テストテスト・テストテスト",
//     image_url: "https://tabi0v0.com/wp-content/uploads/2025/01/30843db5dfa69154a6cca76b8e6d1e1a.jpg",
//     date: "2025/02/22",
//     category: "info"
//   },
//   {
//     title: "テスト・テストテスト・テストテスト・テストテスト・テスト",
//     image_url: "https://tabi0v0.com/wp-content/uploads/2025/01/79bc95c23c22975050eeb6b223013ea5.jpg",
//     date: "2025/02/22",
//     category: "work",
//   },
//   {
//     title: "テスト・テストテスト・テストテスト・テストテスト・テスト",
//     image_url: "https://tabi0v0.com/wp-content/uploads/2025/01/79bc95c23c22975050eeb6b223013ea5.jpg",
//     date: "2025/02/22",
//     category: "work",
//   },
//   {
//     title: "テスト・テストテスト・テストテスト・テストテスト・テストテスト",
//     image_url: "https://tabi0v0.com/wp-content/uploads/2025/01/30843db5dfa69154a6cca76b8e6d1e1a.jpg",
//     date: "2025/02/22",
//     category: "info"
//   },
//   {
//     title: "テスト・テストテスト・テストテスト・テストテスト・テスト",
//     image_url: "https://tabi0v0.com/wp-content/uploads/2025/01/79bc95c23c22975050eeb6b223013ea5.jpg",
//     date: "2025/02/22",
//     category: "work",
//   },
//   {
//     title: "テスト・テストテスト・テストテスト・テストテスト・テストテスト",
//     image_url: "https://tabi0v0.com/wp-content/uploads/2025/01/30843db5dfa69154a6cca76b8e6d1e1a.jpg",
//     date: "2025/02/22",
//     category: "info"
//   },
// ]

export const InfoContents = () => {
  const [cats, setCatsData] = useState()

  console.log(cats);

  useEffect(() => {
    fetchCatFactsData(setCatsData)
  }, [])

  return (
    <motion.div className={s.infoList}>
      <ul className={s.infoItems}>
        {cats && cats.map((item, index) => {
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
    </motion.div>

  )
}
