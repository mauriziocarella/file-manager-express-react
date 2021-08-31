import React from 'react';
import classNames from 'classnames';

const LOADING_SIZES = {
	'xs': 'btn-xs',
	'sm': 'btn-sm',
	'md': 'btn-md',
	'lg': 'btn-lg',
}
const LOADING_COLORS = {
	'primary': 'text-primary',
	'secondary': 'text-secondary',
	'white': 'text-white',
}

export interface LoadingProps {
	loading?: boolean,
	size?: 'xs' | 'sm' | 'md' | 'lg',
	color?: 'primary' | 'secondary' | 'white'
}
export const Loading: React.VFC<LoadingProps & Omit<React.HTMLProps<HTMLButtonElement>, "size" | "type">> = ({loading = true, size = 'lg', color = 'primary', className, ...props}) => {
	if (!loading) return null;

	return (
		<button type="button" className={classNames("btn loading btn-circle btn-ghost", size && LOADING_SIZES[size], color && LOADING_COLORS[color], className)} {...props}/>
	)
}

export const LoadingScreen: React.VFC = () => {
	return (
		<div className="fixed inset-0 w-screen h-screen flex justify-center items-center bg-base-300">
			<Loading/>
		</div>
	);
}
