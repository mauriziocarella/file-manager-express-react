import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import classNames from 'classnames';

export interface SelectOption {
	label: string,
	value: any,
	Button?: React.ReactNode,
}
export interface SelectProps {
	options: SelectOption[],
	onChange: (option?: SelectOption) => void,
	inputClassName?: string,
}
export interface SelectElement {
	focus: () => void,
	reset: () => void,
	set: (value: string) => void,
}
export const Select = forwardRef<SelectElement, SelectProps & Omit<React.HTMLProps<HTMLInputElement>, "onSubmit" | "onChange">>(({options, onChange, className, inputClassName, ...props}, ref) => {
	const innerRef = useRef<HTMLInputElement>(null)

	const [hovered, setHovered] = useState<number | null>(null)
	const [value, setValue] = useState(props.defaultValue || '')
	const [open, setOpen] = useState(false)

	useImperativeHandle(ref, () => ({
		focus,
		reset,
		set,
	}))

	const focus = () => {
		if (innerRef.current) innerRef.current.focus();
	}
	const reset = () => {
		if (innerRef.current) {
			innerRef.current.value = '';
			innerRef.current.blur()
		}

		setHovered(null)
		setValue('')

		onChange()
	}
	const set = (value: string) => {
		const optionIndex = options.findIndex((option) => option.value === value);
		const option = options[optionIndex]
		if (optionIndex >= 0) setHovered(optionIndex)

		if (option) {
			setValue(option.label)

			if (innerRef.current) innerRef.current.value = option.label;
		}
		else {
			setValue(value)

			if (innerRef.current) innerRef.current.value = value;
		}
	}

	const onKeyDown = (e: KeyboardEvent) => {
		const input = e.currentTarget as HTMLInputElement;

	  	switch (e.key) {
			case 'ArrowDown': {
				e.preventDefault()

				setHovered((h) => {
					if (h === null) return 0
					if (h >= options.length-1) return h;

					return h+1;
				});
				break;
			}
			case 'ArrowUp': {
				e.preventDefault()

				setHovered((h) => {
					if (h === null || h === 0) return null;

					return h-1;
				});

				input.selectionStart = input.value.length;
				input.selectionEnd = input.value.length;
				break;
			}

			case 'Enter': {
				if (hovered !== null && options[hovered]) {
					onChange(options[hovered])

					setValue(options[hovered].value)
				}
				else if (innerRef.current) {
					const value = innerRef.current.value;
					onChange({
						label: value,
						value,
					})
				}

				if (innerRef.current) {
					innerRef.current.blur();
				}
				break;
			}
		}
	}
	const onKeyUp = (e: KeyboardEvent) => {
		const input = e.currentTarget as HTMLInputElement
		switch (e.key) {
			case 'ArrowUp':
			case 'ArrowDown':
				break;

			default: {
				setValue(input.value)
				break;
			}
		}
	}
	const onFocus = () => {
		setOpen(true)
	}
	const onBlur = () => {
		setOpen(false)
	}

	const onOptionClick = (option: SelectOption) => () => {
		if (innerRef.current) {
			innerRef.current.value = option.value;
		}

		onChange(option)

		setValue(option.value)
	}

	useEffect(() => {
		setHovered(null)
	}, [open])
	useEffect(() => {
		if (innerRef.current) {
			innerRef.current.addEventListener("keydown", onKeyDown)
			innerRef.current.addEventListener("keyup", onKeyUp)
			innerRef.current.addEventListener("focus", onFocus)
			innerRef.current.addEventListener("blur", onBlur)

			if (hovered === null) {
				innerRef.current.value = `${value}`;
			}
			else {
				const option = options[hovered]
				innerRef.current.value = option.label;
			}
		}

		return () => {
			if (innerRef.current) {
				innerRef.current.removeEventListener("keydown", onKeyDown)
				innerRef.current.removeEventListener("keyup", onKeyUp)
				innerRef.current.removeEventListener("focus", onFocus)
				innerRef.current.removeEventListener("blur", onBlur)
			}
		}
	}, [hovered])

	return (
		<div className={classNames("relative", className)}>
			<div className="flex flex-1 items-center relative">
				<input type="text" className={classNames("peer", inputClassName)} {...props} ref={innerRef} autoComplete="off"/>
				<div className="hidden peer-focus:flex absolute right-2">
					<button className="btn btn-sm btn-square btn-ghost" onMouseDown={reset}>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
			</div>
			{options.length > 0 && (
				<ul className={classNames("shadow-lg py-2 mt-1 menu absolute bg-base-200 rounded w-full z-10", open ? "block" : "hidden")}>
					{options.map((option, index) => (
						<li
							key={index}
							onMouseDown={onOptionClick(option)}
							className={classNames("p-3 border-l-2 pointer-events-auto text-base-content cursor-pointer hover:bg-base-100 hover:border-primary hover:text-opacity-100", index === hovered ? "bg-base-100 border-primary" : "border-transparent text-opacity-50")}
						>
							<div className="flex items-center justify-between">
								{option.label}
								{option.Button}
							</div>
						</li>
					))}
				</ul>
			)}
		</div>
	)
});
Select.displayName = 'Select';
