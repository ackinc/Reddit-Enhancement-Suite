/* @flow */

import { sendMessage } from './messaging';

type RedirectState = {
	enabled: boolean,
	options: any,
};

export function updateRedirectState(type: string, state: RedirectState): void {
	sendMessage(type, state);
}
