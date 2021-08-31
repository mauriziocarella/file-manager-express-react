import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route, Redirect, useHistory, useLocation } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import axios from 'axios';

import { actions as AuthActions } from './redux/auth';
import { useAppDispatch, useAppSelector } from './redux';

import Layout from './Layout';
import { LoadingScreen } from './components/Loader';

import Files from './pages/Files';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Logout from './pages/Logout';
import { useWindowHeight } from './Utils';
import Register from './pages/Register';

const App: React.VFC = () => {
	const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
	const history = useHistory();
	const location = useLocation<{ redirect: Location }>();
	const dispatch = useAppDispatch();
	const windowHeight = useWindowHeight();

	useEffect(() => {
		const body = document.getElementsByTagName('body')[0];
		body.setAttribute("data-theme", "halloween");

		const height = () => {
			const vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		}
		window.addEventListener('resize', height);
		height()

		return () => {
			window.removeEventListener('resize', height);
		}
	}, [])

	useEffect(() => {
		axios.get(`/api/auth`)
			.then(({ data }) => {
				dispatch(AuthActions.login({ user: data }));
			})
			.catch(() => {
				dispatch(AuthActions.logout())
			});
	}, []);

	useEffect(() => {
		let title;
		switch (location.pathname) {
			case '/login': title = 'Login'; break;
			case '/register': title = 'Register'; break;
			case '/dashboard': title = 'Dashboard'; break;
			case '/files': title = 'Files'; break;
		}

		document.title = title ? `${title} | FileManager` : `FileManager`;
	}, [location]);


	if (isAuthenticated === null) return (
		<LoadingScreen/>
	);

	return (
		<div className="bg-base-300 text-base-content" style={{ height: windowHeight }}>
			<Switch>
				<Route path="/login" component={Login}/>
				<Route path="/logout" component={Logout}/>
				<Route path="/register" component={Register}/>

				{isAuthenticated && (
					<Switch>
						<Redirect from="/" to="/dashboard" exact/>

						<Layout>
							<Route path="/dashboard" exact>
								<Dashboard/>
							</Route>
							<Route path="/files" exact>
								<Files/>
							</Route>
						</Layout>
					</Switch>
				)}

				<Route path="*">
					{() => {
						console.log('redirect to login with state', {
							redirect: location.state?.redirect || location,
						})
						history.push('/login', {
							redirect: location.state?.redirect || location,
						});

						return null;
					}}
				</Route>
			</Switch>
		</div>
	);
}

const Root: React.VFC = () => (
	<BrowserRouter>
		<QueryParamProvider ReactRouterRoute={Route}>
			<App/>
		</QueryParamProvider>
	</BrowserRouter>
);

export default Root;
