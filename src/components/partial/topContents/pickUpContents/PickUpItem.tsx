import React from 'react'
import { motion } from "framer-motion";

type Props = {
  imageUrl: string | undefined,
  index: number
}


export default function item(props: Props) {
  return (
    <motion.div initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: props.index * 0.2 }} key={props.index}>
      <img src={props.imageUrl} alt="" key={props.imageUrl} />
    </motion.div>
    // <img src={props.imageUrl} alt="" key={props.imageUrl} />
  )
}
