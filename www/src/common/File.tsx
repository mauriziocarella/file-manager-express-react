import React, { useMemo, useState } from 'react';
import classNames from 'classnames';

import Utils, { DateUtils } from '../Utils';
import { IFile } from '../model/File';
import axios from 'axios';
import { actions as AuthActions } from '../redux/auth';
import { useAppDispatch, useAppSelector } from '../redux';
import { Modal, ModalProps } from '../components/Modal';

interface FileProps {
	file: IFile,
}
interface FileOpenButtonProps {
	label?: string,
}

export const FileMetadata: React.VFC<React.HTMLProps<HTMLDivElement> & FileProps> = ({file, className, ...props}) => {
	return (
		<div className={classNames("flex flex-wrap text-sm italic", className)} {...props}>
			{file.createdAt && (
				<div className="flex items-center mr-2 mb-2">
					<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-base-content text-opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
					</svg>

					{DateUtils.format(file.createdAt)}
				</div>
			)}
			{(file.metadata && 'duration' in file.metadata) && (
				<div className="flex items-center mr-2 mb-2">
					<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-base-content text-opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>

					{DateUtils.formatDuration(file.metadata.duration)}
				</div>
			)}
			<div className="flex items-center mr-2 mb-2">
				<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-base-content text-opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
				</svg>

				{Utils.formatSize(file.size)}
			</div>
			{file.tags.length > 0 && (
				<div className="flex items-center mr-2 mb-2">
					<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-base-content text-opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
					</svg>

					{file.tags.join(',')}
				</div>
			)}
		</div>
	)
}

export const FileSupported = (file: IFile): boolean => {
	switch (file.fileType) {
		case 'video': return true;

		default: return false;
	}
}
export const FileOpenTrigger: React.FC<FileProps> = ({file, children}) => {
	const [modalOpen, setModalOpen] = useState(false);
	const isSupportedFileType = useMemo(() => FileSupported(file), [file]);

	const open = () => {
		if (isSupportedFileType) {
			setModalOpen(true);
		}
		else {
			window.open(`/api/files/${file.id}/raw`, '_blank');
		}
	}

	const element = useMemo(() => {
		if (React.isValidElement(children)) {
			return React.cloneElement(children, {
				onClick: open,
			});
		}

		return null;
	}, [children]);

	return (
		<>
			<ModalFile
				file={file}
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
			/>

			{element}
		</>
	);
}

export const FileOpenButton: React.VFC<React.HTMLProps<HTMLButtonElement> & FileProps & FileOpenButtonProps> = ({file, label = 'Open', ...props}) => {
	const [modalOpen, setModalOpen] = useState(false);
	const isSupportedFileType = useMemo(() => FileSupported(file), [file]);

	const open = () => {
		if (isSupportedFileType) {
			setModalOpen(true);
		}
		else {
			window.open(`/api/files/${file.id}/raw`, '_blank');
		}
	}

	return (
		<>
			<ModalFile
				file={file}
				isOpen={modalOpen}
				onClose={() => setModalOpen(false)}
			/>

			{isSupportedFileType ? (
				<button {...props} type="button" onClick={open}>
					{label}
					<svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
					</svg>
				</button>
			) : (
				<button {...props} type="button" onClick={open}>
					{label}
					<svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
					</svg>
				</button>
			)}
		</>
	)
}
export const FileFavorite: React.VFC<React.HTMLProps<HTMLButtonElement> & FileProps> = ({file, className, ...props}) => {
	const user = useAppSelector((state) => state.auth.user);
	const [loading, setLoading] = useState(false);
	const dispatch = useAppDispatch();

	const toggle = () => {
		setLoading(true)
		axios.post(`/api/files/${file.id}/favorite`)
			.then(({data}) => {
				dispatch(AuthActions.login({user: data}))
			})
			.finally(() => setLoading(false));
	}

	return (
		<button {...props} className={classNames("btn btn-ghost btn-circle", {loading}, (!loading && user?.favorites.includes(file.id)) && "text-primary", className)} type="button" onClick={toggle}>
			{!loading && (
				<>
					{user?.favorites.includes(file.id) ? (
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
							<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
						</svg>
					) : (
						<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
						</svg>
					)}
				</>
			)}
		</button>
	);
}

export const ModalFile: React.FC<{file: IFile} & ModalProps> = ({file, isOpen, onClose}) => {
	const content = useMemo(() => {
		switch (file.fileType) {
			case 'video': {
				return (
					<div className="aspect-w-16 aspect-h-9">
						<video src={`/api/files/${file.id}/raw`} controls autoPlay className="bg-black"/>
					</div>
				);
			}

			default: return null;
		}
	}, [file])

	return (
		<Modal isOpen={isOpen} onClose={onClose} size="2xl">
			<div className="mb-4 text-center">
				<h1 className="text-2xl">{file.label || file.filename}</h1>
			</div>

			{content}

			<div className="modal-action">
				<button type="button" className="btn btn-primary" onClick={onClose}>Close</button>
			</div>
		</Modal>
	);
}
