﻿var app = angular.module('app', []);

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
                $scope.OneRequiredOnChange();
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
        var hasNumber = /\d/;
        if (hasNumber.test(newValue)) {
            $scope.frmSupervisorNotification.txtFirstName.$setValidity("hasnumbers", false);
        }
        else {
            $scope.frmSupervisorNotification.txtFirstName.$setValidity("hasnumbers", true);
        }
    }

    $scope.ShowFirstNameRequiredValidation = function () {
        return $scope.frmSupervisorNotification.txtFirstName.$dirty &&
               $scope.frmSupervisorNotification.txtFirstName.$invalid &&
               $scope.frmSupervisorNotification.txtFirstName.$error.required;
    }

    $scope.ShowFirstNameNumbersValidation = function () {
        return $scope.frmSupervisorNotification.txtFirstName.$dirty &&
               $scope.frmSupervisorNotification.txtFirstName.$invalid &&
               $scope.frmSupervisorNotification.txtFirstName.$error.hasnumbers;
    }

    //Last Name functions:
    $scope.LastNameOnChange = function (newValue) {
        var hasNumber = /\d/;
        if (hasNumber.test(newValue)) {
            $scope.frmSupervisorNotification.txtLastName.$setValidity("hasnumbers", false);
        }
        else {
            $scope.frmSupervisorNotification.txtLastName.$setValidity("hasnumbers", true);
        }
    }

    $scope.ShowLastNameRequiredValidation = function () {
        return $scope.frmSupervisorNotification.txtLastName.$dirty &&
               $scope.frmSupervisorNotification.txtLastName.$invalid &&
               $scope.frmSupervisorNotification.txtLastName.$error.required;
    }

    $scope.ShowLastNameNumbersValidation = function () {
        return $scope.frmSupervisorNotification.txtLastName.$dirty &&
               $scope.frmSupervisorNotification.txtLastName.$invalid &&
               $scope.frmSupervisorNotification.txtLastName.$error.hasnumbers;
    }

    //Email functions:
    $scope.CheckEmailOnChange = function (checked) {
        $scope.TextEmailDisabled = !checked;
        if ($scope.TextEmailDisabled) {
            $scope.Email = "";
        }
    }

    $scope.OneRequiredOnChange = function () {
        if ($scope.Email === "" &&
            $scope.PhoneNumber === "") {
            $scope.frmSupervisorNotification.txtEmail.$setValidity("onerequired", false);
        }
        else {
            $scope.frmSupervisorNotification.txtEmail.$setValidity("onerequired", true);
        }
    }

    //Phone Number functions:
    $scope.CheckPhoneNumberOnChange = function (checked) {
        $scope.TextPhoneNumberDisabled = !checked;
        if ($scope.TextPhoneNumberDisabled) {
            $scope.PhoneNumber = "";
        }
    }

    //Rest of functions:
    $scope.ShowOneRequiredValidation = function () {
        return $scope.Email === "" &&
               $scope.PhoneNumber === "" &&
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