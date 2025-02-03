import { useState, useEffect } from "react"
import { motion } from "framer-motion";
import s from "../loading/loading.module.css"

export const Loading = () => {
  const [loading, setLoading] = useState(true)

  // スクロール無効の処理

  // const handle = (event) => {
  //   event.preventDefault();
  // };

  // useEffect(() => {
  //   document.addEventListener("touchmove", handle, { passive: false }); // タッチ操作でのスクロール無効化
  //   document.addEventListener("mousewheel", handle, { passive: false }); // マウスホイール操作でのスクロール無効化
  //   console.log("hogehogehoge")
  // }, [])

  // const enableScroll = () => {
  //   document.removeEventListener("touchmove", handle); // タッチ操作でのスクロール有効化
  //   document.removeEventListener("mousewheel", handle); // マウスホイール操作でのスクロール有効化
  //   console.log("harimaron")
  // };

  return (
    <motion.div className={s.start_wrapper}
      initial={{ x: 0 }}
      variants={{ move: { x: "100%" } }}
      animate={loading ? undefined : "move"}
      transition={{ duration: 1, delay: 0 }}
    // onAnimationComplete={enableScroll}

    >
      <motion.section
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.5, delay: 3 }}
        onAnimationComplete={() => setLoading(false)}
      >
        <div className={s.dot}></div>
        <div className={s.dot}></div>
        <div className={s.dot}></div>
        <div className={s.dot}></div>
        <div className={s.dot}></div>
        <div className={s.dot}></div>
        <div className={s.dot}></div>
        <div className={s.dot}></div>
        <div className={s.dot}></div>
        <div className={s.dot}></div>
        <div className={s.dot}></div>
        <div className={s.dot}></div>
      </motion.section>
    </motion.div>
  )
}