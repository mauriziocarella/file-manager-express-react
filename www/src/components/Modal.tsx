import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useOnClickOutside } from '../Utils';
import classNames from 'classnames';

const Portal: React.FC = ({ children }) => {
	const rootRef = useRef(document.getElementById(`root`));
	const elementRef = useRef(document.createElement(`div`));

	useEffect(() => {
		const element = elementRef.current;
		const portalRoot = rootRef.current;

		if (portalRoot) portalRoot.appendChild(element);

		return () => {
			if (portalRoot) portalRoot.removeChild(element);
		};
	}, []);

	return ReactDOM.createPortal(children, elementRef.current);
};

export interface ModalProps {
	isOpen: boolean,
	onClose: () => void,
	size?: 'full' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

const MODAL_SIZES = {
	'full': 'max-w-full',
	'sm': 'max-w-screen-sm',
	'md': 'max-w-screen-md',
	'lg': 'max-w-screen-lg',
	'xl': 'max-w-screen-xl',
	'2xl': 'max-w-screen-2xl',
}

export const Modal: React.FC<ModalProps & Omit<React.HTMLProps<HTMLDivElement>, keyof ModalProps>> = ({ children, isOpen, onClose, size = 'md', className, ...props }) => {
	const modalRef = useRef<HTMLDivElement>(null)

	useOnClickOutside(modalRef, onClose);

	if (!isOpen) return null

	return (
		<Portal>
			<div className="modal opacity-100 visible pointer-events-auto">
				<div ref={modalRef} {...props} className={classNames("modal-box sm:mx-8", size && MODAL_SIZES[size], className)}>
					{children}
				</div>
			</div>
		</Portal>
	);
}
