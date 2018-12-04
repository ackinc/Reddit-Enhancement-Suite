/* @flow */
/* global chrome */

import { addListener } from '../environment/background/messaging';
import { regexes } from '../utils/location';

const state = {
	enabled: true,
	options: {
		fromLandingPage: 'none',
		customFromLandingPage: '',
	},
};

// TODO-refactor: put a helper function in the storage background script
chrome.storage.local.get(['RES.modulePrefs', 'RESoptions.subredditRedirect'], data => {
	if (data['RES.modulePrefs'].subredditRedirect === false) state.enabled = false;

	if (data['RESoptions.subredditRedirect']) {
		state.options.fromLandingPage = data['RESoptions.subredditRedirect'].fromLandingPage.value;
		state.options.customFromLandingPage = data['RESoptions.subredditRedirect'].customFromLandingPage.value;
	}
});

addListener('subredditRedirectStateUpdate', ({ enabled, options }) => {
	state.enabled = enabled;
	state.options = { ...state.options, ...options };
});

export function redirect(urlObj: URL): string | void {
	const { enabled, options } = state;
	if (!enabled) return;

	const [, name, currentSection] = regexes.subreddit.exec(urlObj.pathname) || [];
	if (!name || currentSection) return;

	if (!options.fromLandingPage || options.fromLandingPage === 'none') return;

	const redirectTo = options.fromLandingPage === 'custom' ?
		options.customFromLandingPage :
		options.fromLandingPage;
	if (!redirectTo) return;

	return `${urlObj.origin}/r/${name}/${redirectTo}`;
}
