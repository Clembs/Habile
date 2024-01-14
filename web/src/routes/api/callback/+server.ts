import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { PUBLIC_DISCORD_CLIENT_ID } from '$env/static/public';
import { DISCORD_CLIENT_SECRET } from '$env/static/private';

export const GET: RequestHandler = async ({ url, fetch, cookies }) => {
	const code = url.searchParams.get('code');

	if (!code) {
		throw error(400, 'No code provided');
	}

	const req = await fetch('https://discord.com/api/v10/oauth2/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: `Basic ${Buffer.from(
				`${PUBLIC_DISCORD_CLIENT_ID}:${DISCORD_CLIENT_SECRET}`
			).toString('base64')}`
		},
		body: new URLSearchParams({
			grant_type: 'authorization_code',
			code: code,
			redirect_uri: url.origin + `/api/callback`
		})
	});

	const data = await req.json();

	if (!req.ok) {
		throw error(500, data.error_description ?? 'Unknown error');
	}

	cookies.set(
		'session',
		JSON.stringify({
			...data,
			expires_at: Date.now() + data.expires_in
		}),
		{
			path: '/',
			maxAge: data.expires_in,
			sameSite: 'lax',
			httpOnly: true,
			secure: true
		}
	);

	throw redirect(302, '/settings');
};
