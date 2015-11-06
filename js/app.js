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

/*
function configureTemplateFactory($provide) {
	// Set a suffix outside the decorator function
	var cacheBuster = Date.now().toString();

	function templateFactoryDecorator($delegate) {
		var fromUrl = angular.bind($delegate, $delegate.fromUrl);
		$delegate.fromUrl = function (url, params) {
			if (url !== null && angular.isDefined(url) && angular.isString(url)) {
				url += (url.indexOf("?") === -1 ? "?" : "&");
				url += "v=" + cacheBuster;
			}

			return fromUrl(url, params);
		};

		return $delegate;
	}

	$provide.decorator('$templateFactory', ['$delegate', templateFactoryDecorator]);
}

app.config(['$provide', configureTemplateFactory]);
	*/
