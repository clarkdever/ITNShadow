"use strict";

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
      otherwise({
        redirectTo: 'partials/home.html'
      });
  }]);
