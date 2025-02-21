import { motion } from "framer-motion";
import s from "../infoContents/infoContents.module.css"
import InfoItem from "./InfoItem"


export const InfoContents = () => {
  return (
    <motion.div className={s.infoList}>
      <ul className={s.infoItems}>
        <li className={s.item}><InfoItem /></li>
        <li className={s.item}><InfoItem /></li>
        <li className={s.item}><InfoItem /></li>
        <li className={s.item}><InfoItem /></li>
        <li className={s.item}><InfoItem /></li>
        <li className={s.item}><InfoItem /></li>
      </ul>
    </motion.div>

  )
}
