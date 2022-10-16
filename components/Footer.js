import Link from 'next/link';
import Image from 'next/image';
import Logo from '../public/OnlineteoriLogo.png';;
import React from 'react';

import footer from '../styles/footer.module.scss';
import typo from '../styles/typo.module.scss'

export default function Footer() {
	return (
		<footer className={footer.footer} >
			<div className={footer.rightContent} >
				<p className={typo.link} style={{ fontSize: '14px' }}>Handelsbetingelser</p>
			</div>
			<div className={footer.leftContent}>
				<p style={{ fontSize: '14px' }}>© 2022 Onlineteori Aps</p>
			</div>
		</footer>
	)
}