import Header from './Header';
import Footer from './Footer';
import layout from '../styles/layout.module.scss';

export default function Layout({ children }) {
	return (
		<>
			<main className={layout.main}>{children}</main>
		</>
	)
}