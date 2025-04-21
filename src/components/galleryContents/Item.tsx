import React from 'react'
import { motion } from "framer-motion";
import IllustModal from '../modalComponent/IllustModal';
import s from '../galleryContents/gallery.module.css'

type Props = {
  imageUrl: string | undefined,
  index: number
}


export default function item(props: Props) {
  return (
    <motion.div className={s['gallery-item']} initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: props.index * 0.2 }} key={props.index}>
      <IllustModal imageUrl={props.imageUrl || ''} useDefaultStyles={false} />
    </motion.div>
  )
}
