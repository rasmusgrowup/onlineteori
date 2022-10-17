import style from '../styles/preferences.module.scss'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes' // For darkmode
import Moon from './Icons/Moon.js'
import Sun from './Icons/Sun.js'
import Bell from './Icons/Bell.js'
import Search from './Icons/Search.js'

export default function Preferences() {
    const [mounted, setMounted] = useState(false)
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
            <div className={style.bell} data-tooltip='notifikationer'><Bell /></div>
            <button className={style.darkmode} onClick={handleDarkmode} data-tooltip='lys/mørk'>
                { theme === 'light' && <Moon />}
                { theme === 'dark' && <Sun />}
            </button>
        </div>
    )
}