'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('myApp', [
	'azure-mobile-service.module',
    'myApp.routes',
	'ngMessages'
  ]);

app.constant('AzureMobileServiceClient', {
	API_URL : 'https://studentshadow.azure-mobile.net/',
	API_KEY : 'lPvxvTyhAUpHWapWsvMpmUTgKvNgjG32'
});


