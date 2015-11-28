app.controller('login.controller',function($scope,Azureservice) {


	$scope.companies = [];
	$scope.userMessage = '';
	$scope.processing = {
		login : false,
		companylist : false,
		studentlist : false
	};

	$scope.b64toBlob = function b64toBlob(b64Data, contentType, sliceSize) {
		contentType = contentType || '';
		sliceSize = sliceSize || 512;

		var byteCharacters = atob(b64Data);
		var byteArrays = [];

		for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			var slice = byteCharacters.slice(offset, offset + sliceSize);

			var byteNumbers = new Array(slice.length);
			for (var i = 0; i < slice.length; i++) {
				byteNumbers[i] = slice.charCodeAt(i);
			}

			var byteArray = new Uint8Array(byteNumbers);

			byteArrays.push(byteArray);
		}

		var blob = new Blob(byteArrays, {type: contentType});
		return blob;
	}

	$scope.download = function(b64Data,fileName){

		var blob = $scope.b64toBlob(b64Data, 'application/octet-stream');
		var blobUrl = URL.createObjectURL(blob);

		var a = document.createElement("a");
		document.body.appendChild(a);
		a.style = "display: none";
		a.href = blobUrl;
		a.download = fileName;
		a.click();
		window.URL.revokeObjectURL(blobUrl);



	};



	$scope.init = function init(){


		$scope.readCompanies();
		$scope.readStudents();

	}

	$scope.loggedIn = function(){
		return Azureservice.isLoggedIn();
	}


	$scope.logout = function(){

		Azureservice.logout();

	};

	$scope.login = function(){

		$scope.userMessage = '';
		$scope.processing.login = true;
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
				$scope.readStudents();

			}else{
				$scope.userMessage = 'Login Failed';
			}

			$scope.processing.login = false;

		}, function(err) {
			console.error('Azure Error: ' + err);
			$scope.processing.login = false;
		});



	}

	$scope.readCompanies = function(){

		if(Azureservice.isLoggedIn()){


			$scope.processing.companylist = true;
			Azureservice.read('Company')
				.then(function(items) {

					$scope.companies = items;

					$scope.processing.companylist = false;
				}).catch(function(error) {
					$scope.processing.companylist = false;
				console.log(error)
			});
		};

	};

	$scope.parseList = function(list){

		return angular.fromJson(list);
	}

	$scope.readStudents = function(){
		if(Azureservice.isLoggedIn()){

			$scope.processing.studentlist = true;
			Azureservice.read('Student')
				.then(function(items) {
					$scope.students = items;
					$scope.processing.studentlist = false;
				}).catch(function(error) {
				$scope.processing.studentlist = false;
				console.log(error)
			});
		};

	};

	$scope.init();

});