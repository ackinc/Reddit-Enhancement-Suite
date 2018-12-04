/* @flow */

import { Module } from '../core/module';
import { isEnabled, getOptionsValues } from '../core/modules';
import { Redirection } from '../environment';

export const module: Module<*> = new Module('subredditRedirect');

module.moduleName = 'subredditRedirectName';
module.category = 'usersCategory';
module.description = 'subredditRedirectDesc';
module.keywords = ['redirect'];
module.permissions = {
	requiredPermissions: ['webRequestBlocking'],
};

module.options = {
	fromLandingPage: {
		title: 'redirectFromSubredditFrontPageTitle',
		description: 'redirectFromSubredditFrontPageDesc',
		keywords: ['subreddit', 'front'],
		type: 'enum',
		value: 'none',
		values: [{
			name: 'Do nothing',
			value: 'none',
		}, {
			name: 'New',
			value: 'new',
		}, {
			name: 'Rising',
			value: 'rising',
		}, {
			name: 'Controversial',
			value: 'controversial',
		}, {
			name: 'Top',
			value: 'top',
		}, {
			name: 'Gilded',
			value: 'gilded',
		}, {
			name: 'Wiki',
			value: 'wiki',
		}, {
			name: 'Custom',
			value: 'custom',
		}],
	},
	customFromLandingPage: {
		dependsOn: options => options.fromLandingPage.value === 'custom',
		title: 'redirectCustomFromSubredditFrontPageTitle',
		description: 'redirectCustomFromSubredditFrontPageDesc',
		type: 'text',
		value: '',
	},
};

module.beforeLoad = updateRedirectState;
module.onToggle = updateRedirectState;
module.onSaveSettings = updateRedirectState;

function updateRedirectState() {
	Redirection.updateRedirectState('updateSubredditRedirectState', {
		enabled: isEnabled(module),
		options: getOptionsValues(module),
	});
}
