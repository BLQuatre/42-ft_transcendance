'use client';

import { useEffect, useState } from 'react';
import { Language } from '@/types/types';
import { getDictionary } from '@/lib/dictionnaries';
import { usePathname } from 'next/navigation';

const supportedLocales = Object.values(Language);

export function useLocale(): Language {
	const pathname = usePathname();
	const candidate = pathname.split('/')[1] as Language;
	return supportedLocales.includes(candidate) ? candidate : Language.ENGLISH;
}

export function useDictionary(locale?: Language) {
	const [dict, setDict] = useState<any | null>(null);

	if (!locale) {
		locale = useLocale();
	}

	useEffect(() => {
		getDictionary(locale).then(setDict).catch(console.error);
	}, [locale]);

	return dict;
}
