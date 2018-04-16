app.controller('signup', function($scope, $http, $window) {
    // ng-models from the signin form
    $scope.email;
    $scope.password;
    $scope.password_second;

    $scope.signupProgress = false;

    $scope.emailFormat = /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/;

    // Warning in case of error
    $scope.error;

    $scope.signup = () => {

        console.log($scope.password);
        console.log($scope.password_second);

        if ($scope.signupProgress) return;

        $scope.signupProgress = true;

        if (!$scope.emailFormat.test($scope.email)) {
            $scope.signupProgress = false;
            return $scope.error = "L'email entré est incorrect.";
        }
        if ($scope.password == undefined || $scope.password_second == undefined || $scope.password.length < 6 || $scope.password_second < 6) {
            $scope.signupProgress = false;
            return $scope.error = "Le mot de passe doit contenir au minimum 6 charactères.";
        }
        if ($scope.password != $scope.password_second) {
            $scope.signupProgress = false;
            return $scope.error = "Les mots de passe ne correspondent pas.";
        }
        $scope.error = '';

        $http.post('/signup', {
            email: $scope.email,
            password: $scope.password,
            password_second: $scope.password_second
        }).then(response => {
            if (!response.data.success) {
                $scope.signupProgress = false;
                return $scope.error = response.data.error
            }
            $scope.success = 'Vous êtes bien authentifié !';

            $timeout(() => {
                $window.location.href = '/signin';
            }, 1000)
        }).catch(err => console.log(err));
    }
});