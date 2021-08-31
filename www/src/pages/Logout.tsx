import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { useAppDispatch } from '../redux';
import { Loading } from '../components/Loader';
import {actions as AuthActions} from '../redux/auth';

const Logout: React.VFC = () => {
	const dispatch = useAppDispatch();
	const history = useHistory();

	useEffect(() => {
		axios.post(`/api/auth/logout`)
			.then(() => {
				dispatch(AuthActions.logout());

				history.push('/');
			})
	}, []);

	return (
		<div className="flex justify-center items-center">
			<Loading/>
		</div>
	);
}

export default Logout;
