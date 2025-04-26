import s from "../infoContents/infoItem.module.css"
import infosample from "../../../../img/info/noimage.jpg"
import dayjs from 'dayjs';
import { motion } from "framer-motion";

type Props = {
  title: string,
  imageUrl: string | undefined,
  date: string,
  category: string,
  excerpt?: string,
}

export default function InfoItem(props: Props) {
  const formattedDate = dayjs(props.date).format('YYYY.MM.DD');
  return (
    <div className={s.itemWrapper} >
      <div className={s.imageArea}><img src={props.imageUrl ? props.imageUrl : infosample.src} alt="" /></div>
      <div className={s.textArea}>
        <div className={s.dateWrapper}>
          <div className={s.date}>{formattedDate}</div>
          <div className={s.categoryLabel} data-category={props.category}>{props.category}</div>
        </div>
        <div className={s.title}>{props.title}</div>
        {props.excerpt && <div className={s.excerpt}>{props.excerpt}</div>}
      </div>
    </div>


  )
}
