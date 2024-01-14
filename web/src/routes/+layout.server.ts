import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { getUserData }, setHeaders }) => {
	const userData = await getUserData();

	return {
		userData
	};
};
