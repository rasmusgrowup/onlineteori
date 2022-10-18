import style from '../styles/preferences.module.scss'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes' // For darkmode
import Moon from './Icons/Moon.js'
import Sun from './Icons/Sun.js'
import Bell from './Icons/Bell.js'
import Search from './Icons/Search.js'

export default function Preferences() {
    const [mounted, setMounted] = useState(false)
    const [showNots, setShowNots] = useState(false)
    const { theme, setTheme } = useTheme()

    // When mounted on client, now we can show the UI
    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    const handleDarkmode = () => {
        if (theme === 'light') {
            setTheme('dark')
        } else {
            setTheme('light')
        }
    }

    return (
        <div className={style.prefs}>
            <div className={style.search}>
                <Search />
                <span>Søg</span>
            </div>
            <div className={style.bell} onClick={() => setShowNots(!showNots)}>
                <Bell/>
            </div>
            { showNots && <div className={style.notifications}>
                <ul className={style.list}>
                    <li className={style.notification}>Tilmeld dig &apos;Førstehjælpskursus&apos;</li>
                    <li className={style.notification}>Deadline kl. 20.00 på opgave: gennemfør teoritest</li>
                    <li className={style.notification}>Køretime aflyst</li>
                </ul>
            </div>}
            <button className={style.darkmode} onClick={handleDarkmode} data-tooltip='lys/mørk'>
                { theme === 'light' && <Moon />}
                { theme === 'dark' && <Sun />}
            </button>
        </div>
    )
}