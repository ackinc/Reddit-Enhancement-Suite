/* @flow */

import { Module } from '../core/module';
import { isEnabled, getOptionsValues } from '../core/modules';
import { Redirection } from '../environment';

export const module: Module<*> = new Module('profileRedirectRedux');

module.moduleName = 'profileRedirectReduxName';
module.category = 'usersCategory';
module.description = 'profileRedirectReduxDesc';
module.keywords = ['redirect'];
module.permissions = {
	requiredPermissions: ['webRequestBlocking'],
};

module.options = {
	fromLandingPage: {
		title: 'redirectFromProfileLandingPageReduxTitle',
		description: 'redirectFromProfileLandingPageReduxDesc',
		keywords: ['legacy', 'overview'],
		type: 'enum',
		value: 'none',
		values: [{
			name: 'Do nothing',
			value: 'none',
		}, {
			name: 'Overview (legacy)',
			value: 'overview',
		}, {
			name: 'Comments',
			value: 'comments',
		}, {
			name: 'Submitted (legacy)',
			value: 'submitted',
		}, {
			name: 'Gilded',
			value: 'gilded',
		}, {
			name: 'Custom',
			value: 'custom',
		}],
	},
	customFromProfileLandingPage: {
		dependsOn: options => options.fromLandingPage.value === 'custom',
		title: 'redirectCustomFromProfileLandingPageReduxTitle',
		description: 'redirectCustomFromProfileLandingPageReduxDesc',
		type: 'text',
		value: '',
	},
};

module.beforeLoad = updateRedirectState;
module.onToggle = updateRedirectState;
module.onSaveSettings = updateRedirectState;

function updateRedirectState() {
	Redirection.updateRedirectState('updateProfileRedirectState', {
		enabled: isEnabled(module),
		options: getOptionsValues(module),
	});
}
