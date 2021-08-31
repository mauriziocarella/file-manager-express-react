import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useOnClickOutside } from '../Utils';
import classNames from 'classnames';

const INPUT_SIZES = {
	'xs': 'input-xs',
	'lg': 'input-lg',
	'md': 'input-md',
	'sm': 'input-sm',
}

interface EditableTextFormFields {
	text: string,
}
interface EditableTextProps {
	text: string,
	onSubmit: (text: string, toggle: () => void) => void,
	size?: 'xs' | 'lg' | 'md' | 'sm'
}

export const EditableText: React.FC<EditableTextProps & Omit<React.HTMLProps<HTMLFormElement>, keyof EditableTextProps>> = ({children, text, onSubmit, size = 'sm', className, ...props}) => {
	const [editing, setEditing] = useState(false)
	const formRef = useRef(null);

	const form = useForm<EditableTextFormFields>({
		mode: "onChange",
		defaultValues: {
			text,
		}
	})

	useOnClickOutside(formRef, () => setEditing(false))

	const toggle = () => setEditing((editing) => !editing)

	const element = useMemo(() => {
		if (React.isValidElement(children)) {
			return React.cloneElement(children, {
				onClick: toggle
			})
		}

		return null
	}, [children, text])

	useEffect(() => {
		if (editing) {
			form.reset({
				text,
			})
			setTimeout(() => form.setFocus('text'), 0)
		}
	}, [editing, text])

	if (!editing) return element;

	return (
		<span className="relative">
			{element}

			<div className="absolute inset-0 z-50">
				<form ref={formRef} onSubmit={form.handleSubmit(({ text }) => onSubmit(text, toggle))} className={classNames("form-control relative h-full", className)} {...props}>
					<input type="text" className={classNames("w-full pr-16 input input-primary input-bordered", size && INPUT_SIZES[size])} {...form.register('text', {required: true})}/>
					<button type="submit" className={classNames("absolute top-0 right-0 rounded-l-none btn btn-primary max-h-full min-h-0", size && `btn-${size}`)}>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
						</svg>
					</button>
				</form>
			</div>
		</span>
	)
}
