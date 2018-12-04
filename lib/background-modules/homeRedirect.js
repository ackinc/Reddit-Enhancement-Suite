/* @flow */
/* global chrome */

import { addListener } from '../environment/background/messaging';

const state = {
	enabled: true,
	options: {
		fromLandingPage: 'none',
		customFromLandingPage: '',
	},
};

// TODO-refactor: put a helper function in the storage background script
chrome.storage.local.get(['RES.modulePrefs', 'RESoptions.homeRedirect'], data => {
	if (data['RES.modulePrefs'].homeRedirect === false) state.enabled = false;

	if (data['RESoptions.homeRedirect']) {
		state.options.fromLandingPage = data['RESoptions.homeRedirect'].fromLandingPage.value;
		state.options.customFromLandingPage = data['RESoptions.homeRedirect'].customFromLandingPage.value;
	}
});

addListener('homeRedirectStateUpdate', ({ enabled, options }) => {
	state.enabled = enabled;
	state.options = { ...state.options, ...options };
});

export function redirect(urlObj: URL): string | void {
	const { enabled, options } = state;
	if (!enabled) return;

	if (urlObj.origin !== 'www.reddit.com' || urlObj.pathname !== '/') return;

	if (!options.fromLandingPage || options.fromLandingPage === 'none') return;

	const redirectTo = options.fromLandingPage === 'custom' ?
		options.customFromLandingPage :
		options.fromLandingPage;
	if (!redirectTo) return;

	return redirectTo;
}
