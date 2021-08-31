import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link, useHistory, useLocation } from 'react-router-dom';
import classNames from 'classnames';

interface FormData {
	email: string,
	password: string,
}

const Register: React.VFC = () => {
	const [loading, setLoading] = useState(false);
	const [feedback, setFeedback] = useState("");
	const history = useHistory();
	const location = useLocation<{redirect?: Location}>();

	const form = useForm<FormData>({
		mode: 'onChange',
	});

	const onSubmit = (values: FormData) => {
		setFeedback("");
		setLoading(true);
		axios.post(`/api/auth/register`, values)
			.then(() => {
				console.log('registered', location.state)
				history.push('/', location.state)
			})
			.catch((err) => {
				setFeedback(err.response?.data.message);
				setLoading(false);
			});
	}

	return (
		<div className="h-full flex justify-center items-center">
			<div className="card bordered bg-base-100 shadow-md" style={{minWidth: 300}}>
				<div className="card-body">
					<div className="text-3xl text-center mb-4">
						<span className="text-primary">File</span>Manager
					</div>

					{feedback && (
						<div className="text-error text-center text-sm my-2">{feedback}</div>
					)}

					<form onSubmit={form.handleSubmit(onSubmit)}>
						<div className="form-control">
							<label className="label">
								<span className="label-text">Email</span>
							</label>
							<input type="email" placeholder="Email" className="input input-bordered" autoFocus={true} {...form.register('email', {required: true})}/>
						</div>
						<div className="form-control">
							<label className="label">
								<span className="label-text">Password</span>
							</label>
							<input type="password" placeholder="Password" className="input input-bordered" {...form.register('password', {required: true})}/>
						</div>

						<button type="submit" className={classNames("btn btn-primary btn-block btn-sm mt-4", {loading})} disabled={loading}>
							Register
						</button>
						<Link to={{pathname: "/login", state: location.state}}>
							<button type="button" className={classNames("btn btn-ghost btn-block btn-xs mt-4")}>
								Login
							</button>
						</Link>
					</form>
				</div>
			</div>
		</div>
	)
}

export default Register;
