import style from '../styles/calendar.module.scss'
import { useState } from 'react'

const timeStamps = [
    '09.00',
    '10.00',
    '11.00',
    '12.00',
    '13.00',
    '14.00',
    '15.00',
    '16.00'
]

export default function Calendar() {
    let today = new Date()
    const [time, setTime] = useState(today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds())
    const [date, setDate] = useState(today.getDate() + '/' + today.getMonth() + '/' + today.getFullYear())

    return (
        <aside className={style.calendar}>
            <header className={style.header}>
                <div className={style.title}>Kalender</div>
                <div className={style.date}>{date}</div>
            </header>
            <div className={style.timestamps}>
                { timeStamps.map((timestamp, i) => (
                    <div key={i} className={ i === 4 ? `${style.timestamp} ${style.now}` : `${style.timestamp}`}>{timestamp}</div>
                ))}
            </div>
            <div className={style.title}>Opgaver</div>
            <div className={style.opgave}>
                <span>Gennemfør teoritest</span>
                <span style={{ fontSize: '12px', opacity: '0.5' }}>Deadline: i aften kl. 20.00</span>
            </div>
            <div className={style.opgave}>
                <span>Læs kapitel 5</span>
                <span style={{ fontSize: '12px', opacity: '0.5' }}>Deadline: i morgen kl. 20.00</span>
            </div>
        </aside>
    )
}