import React, { useEffect, useRef, useState } from 'react';
import * as fns from 'date-fns';
import itLocale from 'date-fns/locale/it'

//region Functions
export const formatSize = (size: number): string => {
	const i = size === 0 ? 0 : Math.floor( Math.log(size) / Math.log(1024) );
	return Number((size / Math.pow(1024, i)).toFixed(2)) + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
};
//endregion

//region Hooks
export const useOnClickOutside = (ref: React.RefObject<any>, handler: (e: TouchEvent | MouseEvent) => void): void => {
	useEffect(() => {
		const listener = (e: TouchEvent | MouseEvent) => {
			if (!ref || !ref.current || ref.current.contains(e.target as Node)) {
				return;
			}

			handler(e);
		};

		document.addEventListener('mousedown', listener);
		document.addEventListener('touchstart', listener);

		return () => {
			document.removeEventListener('mousedown', listener);
			document.removeEventListener('touchstart', listener);
		};
	}, [ref, handler]);
}
export const useCombinedRefs = (...refs: Array<React.Ref<any> | React.MutableRefObject<null>>): React.Ref<any> | React.MutableRefObject<null> => {
	const targetRef = useRef(null)

	useEffect(() => {
		refs.forEach((ref) => {
			if (!ref) return

			if (typeof ref === 'function') {
				ref(targetRef.current)
			} else {
				(ref as any).current = targetRef.current
			}
		})
	}, [refs])

	return targetRef
}
export const useDebounce = (value: string | number, delay: number): string | number => {
	const [debouncedValue, setDebouncedValue] = useState(value);
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}
export const useDebouncedEffect = (effect: React.EffectCallback, deps: React.DependencyList, delay: number): void => {
	useEffect(() => {
		const handler = setTimeout(() => effect(), delay);

		return () => clearTimeout(handler);
	}, [...deps || [], delay]);
}
export const useDidMountEffect = (effect: React.EffectCallback, deps: React.DependencyList): void => {
	const mounted = useRef(false);
	useEffect(() => {
		if (mounted.current) {
			const unmount = effect();
			return () => {
				mounted.current = false;
				unmount && unmount();
			};
		} else {
			mounted.current = true;
		}
	}, deps);
};
export const useWindowHeight = (): number | string => {
	const [height, setHeight] = useState<number | null>(measureHeight)

	function measureHeight(): number | null {
		return document.documentElement?.clientHeight || window.innerHeight
	}

	useEffect(() => {
		function setMeasuredHeight() {
			const measuredHeight = measureHeight();
			setHeight(measuredHeight);
		}

		window.addEventListener('resize', setMeasuredHeight);
		return () => {
			window.removeEventListener('resize', setMeasuredHeight);
		}
	}, []);

	return height || '100vh';
}
//endregion

export const DateUtils = {
	fns,
	format: (date: string | Date, format = 'P p'): string => {
		if (typeof date === "string") {
			date = new Date(date)
		}

		return fns.format(date, format, {locale: itLocale})
	},
	formatDuration: (seconds: number): string => {
		const normalizeTime = (time: string): string => time.length === 1 ? `0${time}` : time;

		const milliseconds = seconds * 1000;

		const date = new Date(milliseconds);
		const timezoneDiff = date.getTimezoneOffset() / 60;
		const dateWithoutTimezoneDiff = fns.addHours(date, timezoneDiff);

		const normalizedHours = normalizeTime(String(fns.getHours(dateWithoutTimezoneDiff)));
		const normalizedMinutes = normalizeTime(String(fns.getMinutes(dateWithoutTimezoneDiff)));
		const normalizedSeconds = normalizeTime(String(fns.getSeconds(dateWithoutTimezoneDiff)));

		return `${normalizedHours !== '00' ? `${normalizedHours}:` : ''}${normalizedMinutes}:${normalizedSeconds}`;
	}
}

export const Hooks = {
	useOnClickOutside,
	useCombinedRefs,
	useDebounce,
	useDebouncedEffect,
	useDidMountEffect,
	useWindowHeight,
}

export const Utils = {
	formatSize,
	Hooks,
	DateUtils,
}

export default Utils;
