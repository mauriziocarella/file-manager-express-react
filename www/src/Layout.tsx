import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Select, SelectElement } from './components/Select';
import { useAppSelector } from './redux';
import axios from 'axios';
import { StringParam, useQueryParam } from 'use-query-params';

const Logo: React.FC<React.HTMLProps<HTMLDivElement>> = ({className}) => {
	return (
		<header className={classNames("flex", className)}>
			<div className="flex align-center lg:hidden">
				<label htmlFor="menu-drawer" className="btn btn-square btn-ghost">
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
					</svg>
				</label>
			</div>
			<div className="flex font-bold">
				<Link to="/">
					<button className="btn btn-ghost normal-case text-3xl px-2">
						<span className="hidden lg:block"><span className="text-primary">File</span>Manager</span>
						<span className="block lg:hidden"><span className="text-primary">F</span>M</span>
					</button>
				</Link>
			</div>
		</header>
	)
}

const Search: React.VFC = () => {
	const ref = useRef<SelectElement>(null);
	const history = useHistory();
	const location = useLocation();
	const [options, setOptions] = useState<string[]>([])
	const [search, setSearch] = useQueryParam('s', StringParam);

	const onKeyUp = (e: KeyboardEvent) => {
		if (e.key === "k" && e.ctrlKey) {
			e.preventDefault()
			e.stopPropagation()

			if (ref.current) ref.current.focus();
		}
	}

	useEffect(() => {
		try {
			const parsed = JSON.parse(localStorage.getItem('searchHistory') || '')
			if (parsed.length > 0) {
				setOptions(parsed)
			}
		}
		catch (e) {
			console.error(e)
		}
	}, [])

	useEffect(() => {
		try {
			localStorage.setItem('searchHistory', JSON.stringify(options))
		}
		catch (e) {
			console.error(e)
		}
	}, [options])

	useEffect(() => {
		if (location.pathname !== "/files") {
			if (ref.current) ref.current.reset();
		}
	}, [location])

	useEffect(() => {
		if (ref.current) {
			if (search) ref.current.set(search)
			else ref.current.reset()
		}
	}, [search, location])

	useEffect(() => {
		document.addEventListener('keydown', onKeyUp)

		return () => {
			document.removeEventListener('keydown', onKeyUp)
		};
	}, []);

	return (
		<>
			<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mx-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
			</svg>
			<Select
				ref={ref}
				className="flex-1"
				inputClassName="input text-2xl w-full pl-2 sm:pl-4"
				placeholder="Search..."
				options={options.map((item) => ({
					label: item,
					value: item,
					Button: (
						<button className="btn btn-sm btn-square btn-ghost" onMouseDown={(e) => {
							e.preventDefault()
							e.stopPropagation()
							setOptions((options) => options.filter((option) => option !== item))
						}}>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					)
				}))}
				defaultValue={search || ''}
				onChange={(option) => {
					if (!option && search) {
						history.push(`/files`)
					}
					else if (option) {
						setOptions((options) => {
							if (option.value) {
								options = options.filter((opt) => opt !== option.value);
								options = [option.value, ...options]
							}

							return [...options];
						})

						if (location.pathname === "/files") setSearch(option.value)
						else history.push(`/files?s=${option.value}`)
					}
				}}
			/>
			<div className="hidden md:block pointer-events-none select-none mr-2">
				<kbd className="kbd bg-base-100 ml-2">Ctrl K</kbd>
			</div>
		</>
	);
}

const SyncButton: React.VFC<React.HTMLProps<HTMLButtonElement>> = ({className, ...props}) => {
	const [loading, setLoading] = useState(false);
	const [count, setCount] = useState(0);
	const timeout = useRef<number | undefined>(undefined);

	const sync = () => {
		clearTimeout(timeout.current);
		setCount(0)
	  	setLoading(true)
		axios.get(`/api/scripts/import`)
			.then(({data}) => {
				setCount(data.length)
				timeout.current = window.setTimeout(() => setCount(0), 2000);
			})
			.finally(() => setLoading(false));
	}

	return (
		<button {...props} className={classNames("btn btn-circle btn-ghost", loading && 'loading text-primary', className)} type="button" onClick={sync}>
			{!loading && (
				<>
					{count > 0 ? (
						<div className="bg-primary text-primary-content rounded-full px-3">+{count}</div>
					) : (
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
						</svg>
					)}
				</>
			)}
		</button>
	);
}

const Layout: React.FunctionComponent = ({children}) => {
	const location = useLocation();
	const user = useAppSelector((state) => state.auth.user)

	const menu = useMemo(() => [
		{
			label: 'Dashboard',
			to: '/dashboard',
			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
				</svg>
			),
		},
		{
			label: 'Files',
			to: '/files',
			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
				</svg>
			)
		},
		{
			label: 'Users',
			to: '/users',
			icon: (
				<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
				</svg>
			)
		},
	], [])

	return (
		<div className="h-screen drawer drawer-mobile text-base-content">
			<input id="menu-drawer" type="checkbox" className="drawer-toggle"/>

			<div className="flex flex-col drawer-content">
				<div className="w-full navbar flex justify-between bg-base-200 border-b border-base-300 shadow fixed top-0 z-10">
					<div className="flex-1">
						<Logo className="lg:hidden"/>

						<Search/>

						<div className="hidden lg:inline-block">
							<SyncButton className="mx-1"/>
						</div>
					</div>
					{user && (
						<div className="flex-none">
							<div className="dropdown dropdown-end">
								<button className="btn btn-ghost">
									<span className="hidden md:block">{user.email}</span>

									<svg xmlns="http://www.w3.org/2000/svg" className="md:ml-2 h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
									</svg>
								</button>

								<ul className="p-2 shadow menu dropdown-content bg-base-100 border border-base-300 rounded-box w-52">
									<li>
										<Link to="/logout">Logout</Link>
									</li>
								</ul>
							</div>
						</div>
					)}
				</div>

				<div className="flex-1 flex flex-col overflow-y-auto mt-16">
					{children}
				</div>
			</div>

			<div className="drawer-side">
				<label htmlFor="menu-drawer" className="drawer-overlay" />
				<aside className="flex flex-col justify-between border-r border-base-300 bg-base-200 text-base-content shadow w-80">
					<div className="navbar hidden lg:flex border-b border-base-300">
						<Logo/>
					</div>
					<div className="flex-1">
						<ul className="p-4 overflow-y-auto menu compact bg-base-200">
							{menu.map((item) => (
								<li key={item.to} className="mb-2">
									<Link
										to={item.to}
										className={classNames("capitalize", {
											active: location.pathname === item.to
										})}
									>
										<span className="flex items-center text-xl py-4">
											{item.icon && (
												<span className="mr-2">{item.icon}</span>
											)}
											{item.label}
										</span>
									</Link>
								</li>
							))}
						</ul>
					</div>
				</aside>
			</div>
		</div>

	);
}

export default Layout;
