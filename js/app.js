'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('myApp', [
	'azure-mobile-service.module',
	'ui.router',
	'ngMessages',
	'naif.base64'
  ]);

app.constant('AzureMobileServiceClient', {
	API_URL : 'https://studentshadow.azure-mobile.net/',
	API_KEY : 'lPvxvTyhAUpHWapWsvMpmUTgKvNgjG32'
});

app.config(['$compileProvider', function($compileProvider) {
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(data:application\/octet-stream;)/);

}]);


