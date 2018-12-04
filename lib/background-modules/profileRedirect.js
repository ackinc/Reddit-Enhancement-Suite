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
chrome.storage.local.get(['RES.modulePrefs', 'RESoptions.profileRedirectRedux'], data => {
	if (data['RES.modulePrefs'].profileRedirectRedux === false) state.enabled = false;

	if (data['RESoptions.profileRedirectRedux']) {
		state.options.fromLandingPage = data['RESoptions.profileRedirectRedux'].fromLandingPage.value;
		state.options.customFromLandingPage = data['RESoptions.profileRedirectRedux'].customFromLandingPage.value;
	}
});

addListener('profileRedirectReduxStateUpdate', ({ enabled, options }) => {
	state.enabled = enabled;
	state.options = { ...state.options, ...options };
});

export function redirect(urlObj: URL): string | void {
	const { enabled, options } = state;
	if (!enabled) return;

	let [, name, currentSection] = regexes.profile.exec(urlObj.pathname) || [];
	if (!name || currentSection) {
		// for if the url to the profile page in the redesign ever changes
		[, name, currentSection] = regexes.profile2x.exec(urlObj.pathname) || [];
		if (!name || currentSection) return;
	}

	if (!options.fromLandingPage || options.fromLandingPage === 'none') return;

	const redirectTo = options.fromLandingPage === 'custom' ?
		options.customFromLandingPage :
		options.fromLandingPage;
	if (!redirectTo) return;

	return `${urlObj.origin}/user/${name}/${redirectTo}`;
}
