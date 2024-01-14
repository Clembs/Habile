import { DISCORD_CLIENT_SECRET } from '$env/static/private';
import { PUBLIC_DISCORD_CLIENT_ID } from '$env/static/public';
import { db } from '$lib/db';
import { defaultHabileChatData } from '$lib/db/HabileChatData';
import { users } from '$lib/db/schema';
import { redirect, type Handle } from '@sveltejs/kit';
import type { APIUser, RESTPostOAuth2AccessTokenResult } from 'discord-api-types/v10';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.getSession = async () => {
		const session = event.cookies.get('session');

		if (!session) {
			return null;
		}

		const { refresh_token, expires_at } = JSON.parse(session) as RESTPostOAuth2AccessTokenResult & {
			expires_at: number;
		};

		if (Date.now() > expires_at) {
			return null;
		}

		const req = await event.fetch('https://discord.com/api/v10/oauth2/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: new URLSearchParams({
				client_id: PUBLIC_DISCORD_CLIENT_ID,
				client_secret: DISCORD_CLIENT_SECRET,
				grant_type: 'refresh_token',
				refresh_token: refresh_token
			})
		});

		if (!req.ok) {
			return null;
		}

		const data = await req.json();

		event.cookies.set(
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

		return data;
	};

	event.locals.getUserData = async () => {
		const session = await event.locals.getSession();

		if (!session) {
			return null;
		}

		// get user data from session
		const req = await event.fetch('https://discord.com/api/v10/users/@me', {
			headers: {
				Authorization: `Bearer ${session.access_token}`
			}
		});

		if (!req.ok) {
			return null;
		}

		const discordData: APIUser = await req.json();

		const habileChatData =
			(
				await db.query.users.findFirst({
					where: ({ id }, { eq }) => eq(id, discordData.id),
					columns: {
						habileChatData: true
					}
				})
			)?.habileChatData ??
			(
				await db
					.insert(users)
					.values({
						id: discordData.id,
						email: discordData.email,
						habileChatData: {
							tokens: 0,
							used: 0,
							dismissedUsageBanner: false,
							knowledge: '',
							lastMessages: [],
							messagesSent: 0
						}
					})
					.returning()
			)[0]?.habileChatData ??
			defaultHabileChatData;

		return { ...discordData, habileChatData };
	};

	const response = await resolve(event);

	return response;
};
