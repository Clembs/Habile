import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_DISCORD_CLIENT_ID } from '$env/static/public';

export const GET: RequestHandler = async ({}) => {
	throw redirect(
		302,
		`https://discord.com/api/oauth2/authorize?response_type=code&client_id=${PUBLIC_DISCORD_CLIENT_ID}&redirect_uri=http%3A%2F%2Flocalhost%3A5173%2Fapi%2Fcallback&scope=identify%20email%20guilds
	`
	);
};
