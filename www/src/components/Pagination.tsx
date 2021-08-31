import React, { useMemo } from 'react';
import classNames from 'classnames';

export interface PaginationProps {
	page: number,
	onPageChange: (page: number) => void,
	pages: number,
}
export const Pagination: React.FC<PaginationProps & React.HTMLProps<HTMLDivElement>> = ({page, onPageChange, pages, className, ...props}) => {
	const items = useMemo(() => {
		const items = [];
		if (page !== 1) items.push(1)
		if (page-1 > 0 && page-1 !== 1 && page-1 !== pages) {
			items.push('separator')
			items.push(page-1)
		}
		items.push(page)
		if (page+1 < pages && page+1 !== pages && page+1 !== pages) {
			items.push(page+1)
			items.push('separator')
		}
		if (page !== pages && pages > 0) items.push(pages)
		return items;
	}, [pages, page])

  	return (
  		<div className={classNames("flex justify-center items-center", className)} {...props}>
			<button className={classNames("btn btn-sm btn-square mx-1 btn-ghost")} onClick={() => onPageChange(page-1)} disabled={page-1 <= 0}>
				<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
				</svg>
			</button>

			{items.map((item, index) => {
				if (item === "separator") return (
					<button key={index} className="btn btn-sm btn-square btn-ghost" disabled={true}>
						<svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" />
						</svg>
					</button>
				)
				if (typeof item === "string") return null

				return (
					<button key={index} className={classNames("btn btn-sm btn-square mx-1", page === item ? "btn-primary pointer-events-none" : "btn-ghost")} onClick={() => onPageChange(item)}>{item}</button>
				)
			})}

			<button className={classNames("btn btn-sm btn-square mx-1 btn-ghost")} onClick={() => onPageChange(page+1)} disabled={page+1 > pages}>
				<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
				</svg>
			</button>
		</div>
	)
}
