/* @flow */

import { redirect as homeRedirect } from '../../background-modules/homeRedirect';
import { redirect as profileRedirect } from '../../background-modules/profileRedirect';
import { redirect as subredditRedirect } from '../../background-modules/subredditRedirect';

const redirects = [homeRedirect, profileRedirect, subredditRedirect];

// TODO: only run this when we have webRequestBlocking
chrome.webRequest.onBeforeRequest.addListener(({ url }) => {
	const urlObj = new URL(url);
	const redirectUrl = redirects.reduce((acc, fn) => acc || fn(urlObj), undefined);
	return { redirectUrl };
},
{ urls: ['*://*.reddit.com/*'], types: ['main_frame'] },
['blocking']
);
