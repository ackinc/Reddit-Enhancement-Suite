/* @flow */

import { Module } from '../core/module';
import { isEnabled, getOptionsValues } from '../core/modules';
import { Redirection } from '../environment';

export const module: Module<*> = new Module('homeRedirect');

module.moduleName = 'homeRedirectName';
module.category = 'usersCategory';
module.description = 'homeRedirectDesc';
module.keywords = ['redirect'];
module.permissions = {
	requiredPermissions: ['webRequestBlocking'],
};

module.options = {
	fromLandingPage: {
		title: 'redirectFromHomePageTitle',
		description: 'redirectFromHomePageDesc',
		keywords: ['legacy', 'overview'],
		type: 'enum',
		value: 'none',
		values: [{
			name: 'Do nothing',
			value: 'none',
		}, {
			name: 'Old Reddit',
			value: 'https://old.reddit.com',
		}, {
			name: 'No-Participation Mode',
			value: 'https://np.reddit.com',
		}, {
			name: 'Custom',
			value: 'custom',
		}],
	},
	customFromLandingPage: {
		dependsOn: options => options.fromLandingPage.value === 'custom',
		title: 'redirectCustomFromHomePageTitle',
		description: 'redirectCustomFromHomePageDesc',
		type: 'text',
		value: '',
	},
};

module.beforeLoad = updateRedirectState;
module.onToggle = updateRedirectState;
module.onSaveSettings = updateRedirectState;

function updateRedirectState() {
	Redirection.updateRedirectState('updateHomeRedirectState', {
		enabled: isEnabled(module),
		options: getOptionsValues(module),
	});
}
