"use strict";
/*
angular.module('myApp.routes', ['ngRoute'])

 .config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl:  'partials/home.html'
      }).
      when('/info', {
        templateUrl:  'partials/info.html'
      }).
      when('/home', {
        templateUrl:  'partials/home.html'
      }).
      when('/students', {
        templateUrl:  'partials/students.html'
      }).
      when('/companies', {
        templateUrl:  'partials/companies.html'
      }).
      when('/contact', {
        templateUrl:  'partials/contact.html'
      }).
      when('/register', {
        templateUrl:  'partials/register.html'
      }).
		when('/students/apply', {
			templateUrl:  'partials/studentsform.html'
		}).
		when('/companies/apply', {
			templateUrl:  'partials/companiesform.html'
		}).
	when('/login', {
		templateUrl:  'partials/login.html'
	}).
      otherwise({
        redirectTo: 'partials/home.html'
      });
  }]);
*/
app.config(function($stateProvider, $urlRouterProvider) {
	//
	// For any unmatched url, redirect to /state1
	$urlRouterProvider.otherwise("/info");
	//
	// Now set up the states
	$stateProvider

		.state('home', {
			url: "/",
			templateUrl: 'partials/info.html'
		})
		.state('info', {
			url: "/info",
			templateUrl: 'partials/info.html'
		})
		/* .state('home2', {
			url: "/home",
			templateUrl: 'partials/home.html'
		})

		.state('students', {
			url: "/students",
			templateUrl: 'partials/students.html'
		})
		.state('companies', {
			url: "/companies",
			templateUrl: 'partials/companies.html'
		})
		.state('contact', {
			url: "/contact",
			templateUrl: 'partials/contact.html'
		})

		.state('register', {
			url: "/register",
			templateUrl: 'partials/register.html'
		})

		.state('studentsform', {
			url: "/students/apply",
			templateUrl: 'partials/studentsform.html'
		})
		.state('companiesform', {
			url: "/companies/apply",
			templateUrl: 'partials/companiesform.html'
		})
		.state('login', {
			url: "/login",
			templateUrl: 'partials/login.html'
		})

*/


});
