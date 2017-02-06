// Setting up route
angular.module('core.admin.routes').config(['$stateProvider', ($stateProvider) => {
	$stateProvider
		.state('admin', {
			abstract: true,
			url: '/admin',
			template: '<ui-view/>',
			data: {
				roles: ['admin']
			}
		});
}
]);
