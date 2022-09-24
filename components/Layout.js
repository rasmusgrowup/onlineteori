import Header from './Header';
import Footer from './Footer';
import layout from '../styles/layout.module.scss';

export default function Layout({ children }) {
	return (
		<>
			<div className={layout.main}>{children}</div>
		</>
	)
}