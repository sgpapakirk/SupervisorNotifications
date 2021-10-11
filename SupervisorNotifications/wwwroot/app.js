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
                $scope.UsesEmail = false;
                $scope.CheckEmailOnChange(false);
                $scope.UsesPhoneNumber = false;
                $scope.CheckPhoneNumberOnChange(false);
                $scope.SelectedSupervisor = ""; //This sets the 1st (default) item, as the selected one in the list

                $scope.frmSupervisorNotification.txtFirstName.$setPristine();
                $scope.frmSupervisorNotification.txtFirstName.$setUntouched();
                $scope.frmSupervisorNotification.txtLastName.$setPristine();
                $scope.frmSupervisorNotification.txtLastName.$setUntouched();
                $scope.frmSupervisorNotification.ddlSupervisor.$setPristine();
                $scope.frmSupervisorNotification.ddlSupervisor.$setUntouched();
                $scope.frmSupervisorNotification.txtEmail.$setPristine();
                $scope.frmSupervisorNotification.txtEmail.$setUntouched();
                $scope.frmSupervisorNotification.txtPhoneNumber.$setPristine();
                $scope.frmSupervisorNotification.txtPhoneNumber.$setUntouched();

                $scope.SubmitMessage = "Notification was submitted successfully.";
            },
            function errorCallback(response) {
                $scope.SubmitMessage = "Error while submitting this notification.";
            }
        );
    }

    //First Name functions:
    $scope.FirstNameOnChange = function (newValue) {
        var isInvalid = ContainsNumber(newValue);
        $scope.frmSupervisorNotification.txtFirstName.$setValidity("hasnumber", !isInvalid);
    }

    $scope.ShowFirstNameRequiredValidation = function () {
        return $scope.frmSupervisorNotification.txtFirstName.$dirty &&
               $scope.frmSupervisorNotification.txtFirstName.$invalid &&
               $scope.frmSupervisorNotification.txtFirstName.$error.required;
    }

    $scope.ShowFirstNameNumbersValidation = function () {
        return $scope.frmSupervisorNotification.txtFirstName.$dirty &&
               $scope.frmSupervisorNotification.txtFirstName.$invalid &&
               $scope.frmSupervisorNotification.txtFirstName.$error.hasnumber;
    }

    //Last Name functions:
    $scope.LastNameOnChange = function (newValue) {
        var isInvalid = ContainsNumber(newValue);
         $scope.frmSupervisorNotification.txtLastName.$setValidity("hasnumber", !isInvalid);
    }

    $scope.ShowLastNameRequiredValidation = function () {
        return $scope.frmSupervisorNotification.txtLastName.$dirty &&
               $scope.frmSupervisorNotification.txtLastName.$invalid &&
               $scope.frmSupervisorNotification.txtLastName.$error.required;
    }

    $scope.ShowLastNameNumbersValidation = function () {
        return $scope.frmSupervisorNotification.txtLastName.$dirty &&
               $scope.frmSupervisorNotification.txtLastName.$invalid &&
               $scope.frmSupervisorNotification.txtLastName.$error.hasnumber;
    }

    //Email functions:
    $scope.CheckEmailOnChange = function (checked) {
        $scope.TextEmailDisabled = !checked;
        if ($scope.TextEmailDisabled) {
            $scope.Email = "";
        }
    }

    $scope.ShowEmailValidation = function () {
        return $scope.frmSupervisorNotification.txtEmail.$dirty &&
               $scope.frmSupervisorNotification.txtEmail.$invalid &&
               $scope.frmSupervisorNotification.txtEmail.$error.email;
    }

    //Phone Number functions:
    $scope.CheckPhoneNumberOnChange = function (checked) {
        $scope.TextPhoneNumberDisabled = !checked;
        if ($scope.TextPhoneNumberDisabled) {
            $scope.PhoneNumber = "";
        }
    }

    $scope.ShowPhoneNumberValidation = function () {
        return $scope.frmSupervisorNotification.txtPhoneNumber.$dirty &&
               $scope.frmSupervisorNotification.txtPhoneNumber.$invalid &&
               ($scope.frmSupervisorNotification.txtPhoneNumber.$error.pattern ||
                $scope.frmSupervisorNotification.txtPhoneNumber.$error.minlength ||
                $scope.frmSupervisorNotification.txtPhoneNumber.$error.maxlength);
    }

    //Rest of functions:
    $scope.ShowOneRequiredValidation = function () {
        var isInvalid = $scope.Email === "" &&
                        $scope.PhoneNumber === "";
        $scope.frmSupervisorNotification.txtEmail.$setValidity("onerequired", !isInvalid);

        return isInvalid &&
               ($scope.frmSupervisorNotification.txtEmail.$dirty ||
                $scope.frmSupervisorNotification.txtPhoneNumber.$dirty);
    }

    $scope.ShowSupervisorRequiredValidation = function () {
        return $scope.frmSupervisorNotification.ddlSupervisor.$dirty &&
               $scope.frmSupervisorNotification.ddlSupervisor.$invalid &&
               $scope.frmSupervisorNotification.ddlSupervisor.$error.required;
    }

    $scope.SubmitButtonDisabled = function () {
        return $scope.frmSupervisorNotification.$invalid;
    }

    function ContainsNumber(newValue) {
        var hasNumberRegEx = /\d/;
        return hasNumberRegEx.test(newValue);
    }

    function LoadSupervisors() {
        $http.get($location.absUrl() + "api/supervisors").then(
            function successCallback(response) {
                //Initialize:
                var supervisorsArray = [];
                supervisorsArray.push({
                    Value: "",
                    Text: "(select a supervisor)"
                });
                for (var i = 0; i < response.data.length; i++) {
                    supervisorsArray.push({
                        Value: response.data[i],
                        Text: response.data[i]
                    });
                }

                $scope.Supervisors = supervisorsArray;
                $scope.SelectedSupervisor = ""; //This sets the 1st (default) item, as the selected one in the list
            },
            function errorCallback(response) {
                $scope.SubmitMessage = "Error while loading the supervisors.";
            }
        );
    }

    //Initialize:
    $scope.SubmitMessage = "";
    $scope.Email = "";
    $scope.UsesEmail = false;
    $scope.TextEmailDisabled = true;
    $scope.PhoneNumber = "";
    $scope.UsesPhoneNumber = false;
    $scope.TextPhoneNumberDisabled = true;
    LoadSupervisors();
});