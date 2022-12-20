import Link from "next/link";
import style from '../styles/available-tests.module.scss'

export default function AvailableTests({tests}) {
    return (
        <aside className={style.container}>
            <header className={style.header}>
                <div className={style.title}>Tilgængelige prøver:</div>
            </header>
            <ul className={style.list}>
                {tests.map((test, i) => (
                    <li key={i} className={style.li}>
                        <Link href={`proever/${test.slug}`}>
                            <a>Teoriprøve nr. 1</a>
                        </Link>
                    </li>
                ))}
                <li className={style.unavailable}>Teoriprøve nr. 2</li>
                <li className={style.unavailable}>Teoriprøve nr. 3</li>
                <li className={style.unavailable}>Teoriprøve nr. 4</li>
                <li className={style.unavailable}>Teoriprøve nr. 5</li>
            </ul>
        </aside>
    )
}