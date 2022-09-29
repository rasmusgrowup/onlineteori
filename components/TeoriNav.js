import Link from 'next/link'
import { useState, useContext } from 'react' // useState for setting navigation open or closed
import { useRouter } from 'next/router'

import style from '../styles/dashboard.module.scss' // Styling import
import List from './icons/List' // List SVG Icon
import GreenDot from './icons/GreenDot' // Greendot SVG Icon

export default function TeoriNav({ array }) {
	const [openNav, setOpenNav] = useState(false);
	const router = useRouter()
	const slug = router.query.slug || [];

	const handleNav = () => {
		setOpenNav(!openNav)
	}

	return (
		<aside className={ openNav ? `${style.teoriNav} ${style.open}` : `${style.teoriNav} ${style.close}`}>
			<header className={style.navHeader} onClick={() => setOpenNav(!openNav)}>
				Afsnit
				<List />
			</header>
			<div className={style.teoriNavTable}>
			{ array.map((part, i) => (
				<ul key={i}>
				<div>{part.title}</div>
				{ part.pages.map((page, i) => (
					<Link key={i} href="/dashboard/teori/[slug]" as={`/dashboard/teori/${page.slug}`} passHref>
						<a className={slug.toString() === page.slug ? `${style.active}` : undefined}>
							{page.title}
						</a>
					</Link>
				))}
				</ul>
			))}
			</div>
		</aside>
	)
}