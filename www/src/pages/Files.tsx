import React, { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useFieldArray, useForm } from 'react-hook-form';
import classNames from 'classnames';
import { useQueryParam, NumberParam, StringParam, JsonParam } from 'use-query-params';
import { useLocation } from 'react-router-dom';

import { IFile } from '../model/File';
import { useDebouncedEffect, useDidMountEffect } from '../Utils';
import { Modal, ModalProps } from '../components/Modal';
import { EditableText } from '../components/EditableText';
import { Pagination } from '../components/Pagination';
import { Loading } from '../components/Loader';
import { FileFavorite, FileMetadata, FileOpenButton, FileOpenTrigger } from '../common/File';

interface FileProps {
	file: IFile,
	onSubmit: (file: IFile) => void,
}
interface FileEditFormData {
	label: string,
	tags: [{text: string}]
}

const ModalFileEdit: React.FC<FileProps & ModalProps> = ({file, isOpen, onSubmit, onClose}) => {
	const [loading, setLoading] = useState<boolean>(false)
	const inputTagRef = useRef<HTMLInputElement>(null)

	const form = useForm<FileEditFormData>({
		mode: "onChange",
	})
	const tags = useFieldArray({
		control: form.control,
		name: "tags",
	})

	const onFormSubmit = (values: FileEditFormData) => {
		setLoading(true)
		axios.post(`/api/files/${file.id}`, {
			label: values.label,
			tags: (values.tags || []).map((tag) => tag.text),
		})
			.then(({data}) => {
				onClose()
				onSubmit(data)
			})
			.finally(() => setLoading(false))
	};
	const onTagsFormSubmit = () => {
		if (inputTagRef.current) {
			const value = inputTagRef.current.value

			if (value && !tags.fields.some((tag) => tag.text.trim().toLowerCase() === value.trim().toLowerCase())) {
				tags.append({ text: value })
				inputTagRef.current.value = '';
			}
		}
	}

	useEffect(() => {
		if (isOpen) {
			form.reset({
				label: file.label,
				tags: file.tags.map((tag) => ({text: tag})),
			})
			setTimeout(() => form.setFocus('label'), 0)
		}
	}, [isOpen])

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<form onSubmit={form.handleSubmit(onFormSubmit)}>
				<div className="mb-2">
					<h4 className="italic text-base-content text-opacity-50">{file.filename}</h4>
				</div>

				<div className="form-control">
					<label className="label">
						<span className="label-text">Label</span>
					</label>
					<input type="text" placeholder="Label" className={classNames("input input-bordered", {"input-error": form.formState.errors.label})} {...form.register('label')} autoFocus={true}/>
					{form.formState.errors.label && (
						<label className="label">
							<span className="label-text-alt text-error">Label is required</span>
						</label>
					)}
				</div>
				<div className="form-control">
					<label className="label">
						<span className="label-text">Tags</span>
					</label>
					<div className="flex flex-wrap">
						{tags.fields.map((tag, index) => (
							<div key={tag.id} data-tip="Click to remove tag" className="tooltip tooltip-bottom z-50 mr-2 mb-2">
								<button type="button" className="btn btn-sm" onClick={() => tags.remove(index)}>
									{tag.text}
									<svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
									</svg>
								</button>
							</div>
						))}
						<div className="form-control relative">
							<input ref={inputTagRef} type="text" className="w-40 pr-16 peer input input-sm focus:input-primary input-bordered" onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();

									onTagsFormSubmit()
								}
							}}/>
							<button tabIndex={-1} type="button" className="absolute top-0 right-0 rounded-l-none btn btn-sm btn-primary" onClick={onTagsFormSubmit}>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
								</svg>
							</button>
						</div>
					</div>
				</div>

				<div className="modal-action">
					<button type="button" className="btn btn-ghost" onClick={onClose}>Close</button>
					<button type="submit" className={classNames("btn btn-primary", {loading})} disabled={loading || !form.formState.isDirty || !form.formState.isValid}>Save</button>
				</div>
			</form>
		</Modal>
	)
}

const File: React.FC<FileProps & Omit<React.HTMLProps<HTMLDivElement>, "onSubmit">> = ({ file, onSubmit, className, ...props }) => {
	const [modalEditOpen, setModalEditOpen] = useState(false)

	const onLabelChange = (text: string, toggle: () => void) => {
	  	axios.post(`/api/files/${file.id}`, {
	  		label: text,
		})
			.then(({ data }) => {
				onSubmit(data);
				toggle();
			})
	}

	return (
		<>
			<ModalFileEdit
				file={file}
				isOpen={modalEditOpen}
				onClose={() => setModalEditOpen(false)}
				onSubmit={onSubmit}
			/>

			<div className={classNames("card lg:card-side bordered shadow-md bg-base-100", className)} {...props}>
				<FileOpenTrigger file={file}>
					<div className="lg:w-52 cursor-pointer">
						{file.thumbnail ? (
							<figure className="h-full">
								<img alt="thumbnail" src={`/media/thumbnails/${file.thumbnail}`} className="h-full object-cover"/>
							</figure>
						) : (
							<div className="h-full flex items-center justify-center">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
							</div>
						)}
					</div>
				</FileOpenTrigger>
				<div className="card-body px-4 py-2 relative">
					<EditableText text={file.label} onSubmit={onLabelChange} className="mb-2">
						{file.label ? <h2 className="card-title text-primary">{file.label}</h2> : <h2 className="card-title italic text-gray-500">Label</h2>}
					</EditableText>

					<FileMetadata file={file} className="mb-2"/>

					<p className="text-base-content text-sm italic text-opacity-50">{file.filename}</p>
					<div className="absolute right-2 top-2">
						<FileFavorite file={file}/>
					</div>
					<div className="card-actions">
						<FileOpenButton file={file} className="btn btn-sm btn-primary"/>

						<button className="btn btn-sm btn-ghost" onClick={() => setModalEditOpen(true)}>
							Edit
							<svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
							</svg>
						</button>
					</div>
				</div>
			</div>
		</>
	);
}

const SORT_OPTIONS = [
	{
		key: 'createdAt',
		label: 'Created at',
	},
	{
		key: 'size',
		label: 'Size',
	},
];
const FILTER_OPTIONS = [
	{
		key: '',
		label: 'All',
	},
	{
		key: 'favorites',
		label: 'Favorites',
	}
];

const Files: React.VFC = () => {
	const [loading, setLoading] = useState(true)
	const [files, setFiles] = useState<IFile[]>([])
	const [page = 1, setPage] = useQueryParam('page', NumberParam)
	const [pages, setPages] = useState(1)
	const location = useLocation();
	const [search] = useQueryParam('s', StringParam);
	const [sortKey, setSortKey] = useQueryParam('sk', StringParam);
	const [sortDir, setSortDir] = useQueryParam('sd', StringParam);
	const [filter, setFilter] = useQueryParam('f', StringParam);

	const fetch = () => {
		const params = {
			search,
			page,
			filter,
			sortKey,
			sortDir,
		}

		setLoading(true)
		axios.get(`/api/files`, {
			params,
		})
			.then(({ data }) => {
				setFiles(data.files)
				setPages(data.pagination.pages)
			})
			.finally(() => setLoading(false))
	}

	useDebouncedEffect(() => {
		fetch()
	}, [search, location, page, sortKey, sortDir, filter], 100)
	useDidMountEffect(() => {
		setPage(1)
	}, [search])

	useEffect(() => {
		setFilter((v) => v ? v : '')
		setSortKey((v) => v ? v : SORT_OPTIONS[0].key);
		setSortDir((v) => v ? v : 'desc');
	}, [])

	return (
		<div className="flex flex-col flex-1">
			<div className="flex flex-col md:flex-row items-center px-4 py-1 bg-base-200 border-b border-base-300">
				<div className="flex-1"/>

				<div className="flex items-center ml-2">
					<div className="text-base-content text-opacity-70 mr-2">Filter</div>
					<div className="dropdown dropdown-end">
						<div tabIndex={0} className="btn btn-outline btn-sm m-1 min-w-36 flex justify-between items-center">
							{FILTER_OPTIONS.find((option) => option.key === filter)?.label || <span>&nbsp;</span>}
							<span className="ml-4">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							  		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
								</svg>
							</span>
						</div>
						<ul className="shadow-lg py-2 menu dropdown-content bg-base-100 rounded w-52">
							{FILTER_OPTIONS.map((option) => (
								<li
									key={option.key}
									className={classNames("p-3 border-l-2 border-transparent cursor-pointer hover:bg-base-content hover:bg-opacity-10", option.key === filter && "border-l-primary")}
									onMouseDown={() => setFilter(option.key)}
								>
									<div className="flex items-center justify-between">
										{option.label}
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="flex items-center ml-2">
					<div className="text-base-content text-opacity-70 mr-2">Order</div>
					<div className="dropdown dropdown-end">
						<div tabIndex={0} className="btn btn-outline btn-sm m-1 min-w-36 flex justify-between items-center">
							{SORT_OPTIONS.find((option) => option.key === sortKey)?.label}
							<span className="ml-4">
								{sortDir === "desc" ? (
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
									</svg>
								) : (
									<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
									</svg>
								)}
							</span>
						</div>
						<ul className="shadow-lg py-2 menu dropdown-content bg-base-100 rounded w-52">
							{SORT_OPTIONS.map((option) => (
								<li
									key={option.key}
									className={classNames("p-3 border-l-2 border-transparent cursor-pointer hover:bg-base-content hover:bg-opacity-10", option.key === sortKey && "border-l-primary")}
									onMouseDown={() => {
										if (option.key === sortKey) {
											setSortDir((dir) => dir === 'desc' ? 'asc' : 'desc');
										}
										else {
											setSortKey(option.key)
											setSortDir('desc');
										}
									}}
								>
									<div className="flex items-center justify-between">
										{option.label}
										{sortDir === "desc" ? (
											<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
											</svg>
										) : (
											<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
											</svg>
										)}
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>

			<div className="relative flex-1">
				<div className="absolute inset-0 overflow-y-auto p-4">
					<div className="text-center"><Loading color="primary" loading={loading} size="lg"/></div>

					<div className="grid grid-flow-row auto-rows-max 3xl:grid-cols-2 gap-4">
						{(files.length === 0 && !loading) && (
							<h1 className="text-base-content text-opacity-50 text-xl text-center italic">No results found</h1>
						)}
						{!loading && files.map((file) => (
							<File
								key={file.id}
								file={file}
								onSubmit={(file) => setFiles((files) => files.map((f) => f.id === file.id ? file : f))}
							/>
						))}
					</div>
				</div>
			</div>

			<div className="flex justify-center items-center p-4 bg-base-200 border-t border-base-300">
				<Pagination
					page={page || 1}
					pages={pages}
					onPageChange={setPage}
				/>
			</div>
		</div>
	)
}

export default Files
