var app = angular.module('app', []);

app.controller('appController', function ($scope, $http, $location) {
    $scope.SubmitSupervisorNotification = function () {
        $scope.SubmitMessage = "";

        var supervisorNotification = {
            firstName: $scope.FirstName,
            lastName: $scope.LastName,
            email: $scope.Email,
            phoneNumber: $scope.PhoneNumber,
            supervisor: $scope.SelectedSupervisor
        }

        $http.post($location.absUrl() + "api/submit", supervisorNotification).then(
            function successCallback(response) {
                //Reset our form:
                $scope.FirstName = "";
                $scope.LastName = "";
                $scope.Email = "";
                $scope.PhoneNumber = "";
                $scope.SelectedSupervisor = "(select a supervisor)";

                //Reset the validation of these controls:
                $scope.frmSupervisorNotification.txtFirstName.$setPristine();
                $scope.frmSupervisorNotification.txtFirstName.$setUntouched();
                $scope.frmSupervisorNotification.txtLastName.$setPristine();
                $scope.frmSupervisorNotification.txtLastName.$setUntouched();

                $scope.SubmitMessage = "Notification was submitted successfully.";
            },
            function errorCallback(response) {
                $scope.SubmitMessage = "Error while submitting this notification.";
            }
        );
    }

    $scope.ShowFirstNameValidation = function () {
        return $scope.frmSupervisorNotification.txtFirstName.$dirty &&
               $scope.frmSupervisorNotification.txtFirstName.$invalid &&
               $scope.frmSupervisorNotification.txtFirstName.$error.required;
    }

    $scope.ShowLastNameValidation = function () {
        return $scope.frmSupervisorNotification.txtLastName.$dirty &&
               $scope.frmSupervisorNotification.txtLastName.$invalid &&
               $scope.frmSupervisorNotification.txtLastName.$error.required;
    }

    $scope.ShowSupervisorValidation = function () {
        return $scope.frmSupervisorNotification.ddlSupervisor.$dirty &&
               $scope.frmSupervisorNotification.ddlSupervisor.$invalid &&
               $scope.frmSupervisorNotification.ddlSupervisor.$error.required;
    }

    $scope.SubmitButtonDisabled = function () {
        return $scope.frmSupervisorNotification.$invalid;
    }

    



    function LoadSupervisors() {
        $http.get($location.absUrl() + "api/supervisors").then(
            function successCallback(response) {
                //Initialize:
                var defaultSupervisor = "(select a supervisor)";
                $scope.Supervisors = response.data;
                $scope.Supervisors.unshift(defaultSupervisor);
                $scope.SelectedSupervisor = defaultSupervisor; //This sets the 1st (default) item, as the selected one in the list
            },
            function errorCallback(response) {
            }
        );
    }

    //Initialize:
    LoadSupervisors();
});