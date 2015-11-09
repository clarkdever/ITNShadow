app.controller('login.controller',function($scope,Azureservice) {


	$scope.companies = [];
	$scope.userMessage = '';

	$scope.init = function init(){


		$scope.readCompanies();


	}

	$scope.loggedIn = function(){
		return Azureservice.isLoggedIn();
	}


	$scope.logout = function(){

		Azureservice.logout();

	};

	$scope.login = function(){

		$scope.userMessage = '';

		Azureservice.invokeApi('login', {
			method: 'post',
				body: {
					email : $scope.login.email,
					password:$scope.login.password
			}
		})
		.then(function(response) {


			if(response.status == 'SUCCESS'){
				Azureservice.setCurrentUser(response);

				$scope.readCompanies();

			}else{
				$scope.userMessage = 'Login Failed';
				console.log('Login Failed');
			}



		}, function(err) {
			console.error('Azure Error: ' + err);
		});



	}

	$scope.readCompanies = function(){
		if(Azureservice.isLoggedIn()){


			Azureservice.read('Company')
				.then(function(items) {
					console.log(items);
					$scope.companies = items;
					console.log($scope.companies);
				}).catch(function(error) {
				console.log(error)
			});
		};

	};

	$scope.init();

});