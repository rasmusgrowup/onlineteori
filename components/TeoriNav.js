import Link from 'next/link'
import { useState, useContext } from 'react' // useState for setting navigation open or closed
import { useRouter } from 'next/router'

import style from '../styles/dashboard.module.scss' // Styling import
import components from '../styles/components.module.scss' // Styling import
import List from './Icons/List' // List SVG Icon

export default function TeoriNav({ array }) {
	const [openNav, setOpenNav] = useState(false);
	const [selected, setSelected] = useState(array[0].title)
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
				<div className={style.inner} key={i}>
					<div onClick={() => setSelected(part.title)} style={{ cursor: 'pointer' }}>{part.title}</div>
					<div className={ selected === part.title ? `${style.opened}` : `${style.collapsed}`}>
						{ part.contents.map((content, i) => (
							<div key={i}>
							{ content.__typename === 'Page' ?
								<Link href="/dashboard/teori/[slug]" as={`/dashboard/teori/${content.slug}`} passHref>
									<a className={slug.toString() === content.slug ? `${style.active}` : undefined}>
										{content.title}
									</a>
								</Link>
							:
								<Link href="/dashboard/teori/[slug]" as={`/dashboard/teori/${content.slug}`} passHref>
									<a className={style.testButton}>
										{content.title}
									</a>
								</Link>
							}
							</div>
						))}
					</div>
				</div>
			))}
			</div>
		</aside>
	)
}