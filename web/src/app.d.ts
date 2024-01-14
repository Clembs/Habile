import type { HabileChatData } from '$lib/db/HabileChatData';
import type { APIUser, RESTPostOAuth2AccessTokenResult } from 'discord-api-types/v10';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			getSession: () => Promise<RESTPostOAuth2AccessTokenResult | null | undefined>;
			getUserData: () => Promise<(APIUser & { habileChatData: HabileChatData }) | null | undefined>;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
