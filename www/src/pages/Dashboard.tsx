import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Utils, { DateUtils } from '../Utils';
import { Loading } from '../components/Loader';
import { IFile } from '../model/File';
import classNames from 'classnames';
import { FileFavorite, FileMetadata, FileOpenButton, FileOpenTrigger } from '../common/File';

interface IStatistics {
	count: number,
	size: number,
	latest: IFile | null,
	files: IFile[],
}

const File: React.VFC<{file: IFile}> = ({file}) => {
	const isNew = useMemo(() => {
		const today = DateUtils.fns.startOfToday();
		return DateUtils.fns.differenceInDays(today, new Date(file.createdAt)) < 7;
	}, [file])

	return (
		<>
			<div className="card bordered bg-base-100 shadow-md">
				<FileOpenTrigger file={file}>
					<figure className="cursor-pointer">
						<img alt="thumbnail" src={`/media/thumbnails/${file.thumbnail}`}/>
					</figure>
				</FileOpenTrigger>
				<div className="card-body px-4 py-2 relative">
					<h2 className="card-title">
						{file.label || file.filename}
						{isNew && <div className="badge mx-2 badge-secondary align-middle">NEW</div>}
					</h2>

					<FileMetadata file={file} className="mb-2"/>

					<FileFavorite file={file} className="absolute right-2 top-2"/>

					<div className="justify-end card-actions">
						<FileOpenButton file={file} className="btn btn-sm btn-primary"/>
					</div>
				</div>
			</div>
		</>
	);
}

const Dashboard: React.VFC = () => {
	const [loading, setLoading] = useState(true);
	const [statistics, setStatistics] = useState<IStatistics>({
		count: 0,
		size: 0,
		latest: null,
		files: []
	});
	const [favorites, setFavorites] = useState<IFile[]>([]);

	const fetch = () => {
		setLoading(true);
		Promise.all([
			axios.get(`/api/statistics`)
				.then(({data}) => setStatistics(data)),
			axios.get(`/api/files/favorites`)
				.then(({data}) => setFavorites(data)),
		])
			.finally(() => setLoading(false))
	}

	useEffect(() => {
		fetch();
	}, [])

	return (
		<div className="p-4">
			<div>
				<h1 className="font-bold text-2xl mb-2">Statistics</h1>
				<div className="grid xs:grid-rows-3 md:grid-cols-3 gap-4 mb-4">
					<div className="inline-grid bg-base-100 py-4 px-6 rounded-lg shadow">
						<div className="stat-figure text-primary">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
							</svg>
						</div>
						<div className="stat-title">File count</div>
						<div className="stat-value">{loading ? <Loading size="sm"/> : statistics.count}</div>
					</div>
					<div className="inline-grid bg-base-100 py-4 px-6 rounded-lg shadow">
						<div className="stat-figure text-secondary">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
							</svg>
						</div>
						<div className="stat-title">File size</div>
						<div className="stat-value">{loading ? <Loading size="sm"/> : Utils.formatSize(statistics.size)}</div>
					</div>
					<div className="inline-grid bg-base-100 py-4 px-6 rounded-lg shadow">
						<div className="stat-figure text-accent">
							<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
						</div>
						<div className="stat-title">Latest file</div>
						<div className="stat-value">{loading ? <Loading size="sm"/> : statistics.latest ? DateUtils.format(statistics.latest.createdAt, 'P') : '-'}</div>
					</div>
				</div>
			</div>

			{statistics.files.length > 0 && (
				<div className="mb-4">
					<h1 className="font-bold text-2xl mb-2">Latest files</h1>
					<div className="grid xs:grid-rows-3 md:grid-cols-3 4xl:grid-cols-5 gap-4">
						{statistics.files.map((file, index) => (
							<div key={file.id} className={classNames(index >= 5 ? 'hidden' : index >= 3 && 'hidden 4xl:block')}>
								<File file={file}/>
							</div>
						))}
					</div>
				</div>
			)}

			{favorites.length > 0 && (
				<div className="mb-4">
					<h1 className="font-bold text-2xl mb-2">Favorites</h1>
					<div className="grid xs:grid-rows-3 md:grid-cols-3 4xl:grid-cols-5 gap-4">
						{favorites.map((file, index) => (
							<div key={file.id} className={classNames(index >= 5 ? 'hidden' : index >= 3 && 'hidden 4xl:block')}>
								<File file={file}/>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

export default Dashboard;
