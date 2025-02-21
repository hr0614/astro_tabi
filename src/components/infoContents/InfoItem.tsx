import s from "../infoContents/infoItem.module.css"


export default function InfoItem() {
  return (

    <div className={s.itemWrapper}>
      <div className={s.imageArea}></div>
      <div className={s.textArea}>
        <div className={s.dateWrapper}>
          <div className={s.date}></div>
          <div className={s.categoryLabel}></div>
        </div>
        <div className={s.title}></div>
      </div>
    </div>

  )
}
