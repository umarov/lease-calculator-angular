'use strict';

/**
 * @ngdoc function
 * @name leaseCalculatorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the leaseCalculatorApp
 */
angular.module('leaseCalculatorApp')
  .controller('MainCtrl', function ($scope, $mdToast) {

    $scope.toastPosition = {
      bottom: true,
      top: false,
      left: false,
      right: true
    };

    $scope.customerInfo       = true;
    $scope.carInfo            = false;
    $scope.leaseInfo          = false;
    $scope.leaseSummary       = false;
    $scope.overrageMessage    = false;
    $scope.possibleBudget     = true;
    $scope.milesDrivenPerYear = 0.0;
    $scope.estimatedCharges   = 0.0;
    $scope.suggestedBudget    = 0.0;
    $scope.estimatedTotalMiles = 0;
    $scope.differenceInMiles   = 0;
    $scope.demoMessage         = 'Your info isn\'t stored, it\'s for demo only';


    function Lease() {
      this.maxMiles            = null;
      this.costPerMile         = null;
      this.lengthOfLease       = null;
      this.currentMonthInLease = null;
      this.car                 = null;
    }

    function Car() {
      this.make  = '';
      this.model = '';
      this.year  = null;
      this.miles = null;
    }

    function Customer() {
      this.firstName = '';
      this.lastName  = '';
      this.email     = '';
      this.lease     = null;
    }

    $scope.lease          = new Lease();
    $scope.car            = new Car();
    $scope.customer       = new Customer();
    $scope.lease.car      = $scope.car;
    $scope.customer.lease = $scope.lease;

    var calculateMilesDrivenPerYear = function() {
      return $scope.car.miles / ( $scope.lease.currentMonthInLease / 12 );
    };

    var estimatedTotalMiles = function() {
      return $scope.lease.lengthOfLease * $scope.milesDrivenPerYear;
    };

    var differenceInMiles = function() {
      return $scope.lease.maxMiles * $scope.lease.lengthOfLease - $scope.estimatedTotalMiles;
    };

    var estimatedCharges = function() {
      return $scope.lease.costPerMile * $scope.differenceInMiles;
    };

    var remainderInMiles = function() {
      return ($scope.lease.maxMiles * $scope.lease.lengthOfLease) - $scope.car.miles;
    };

    var remainderInMonths = function() {
      return ($scope.lease.lengthOfLease * 12) - $scope.lease.currentMonthInLease;
    };

    var suggestedBudget = function() {
      return (remainderInMiles()) / (remainderInMonths());
    };

    var calculateCharges = function() {
      $scope.estimatedCharges = estimatedCharges();
      $scope.suggestedBudget  = suggestedBudget();
      return true;
    };

    $scope.getToastPosition = function() {
      return Object.keys($scope.toastPosition)
        .filter(function(pos) { return $scope.toastPosition[pos]; })
        .join(' ');
    };

    $scope.toastIt = function() {
      $mdToast.show({
        template: '<md-toast>Please enter all the information before continuing</md-toast>',
        hideDelay: 2000,
        position: $scope.getToastPosition()
      });
    };

    var customerInfoDone = function() {
      var firstName = $scope.customer.firstName;
      var lastName  = $scope.customer.lastName;
      var email     = $scope.customer.email;
      return firstName !== '' && 
             lastName !== '' && 
             email !== '';
    };

    var carInfoDone = function() {
      var make  = $scope.car.make;
      var model = $scope.car.model;
      var year  = $scope.car.year;
      var miles = $scope.car.miles;
      return make !== '' && 
             model !== '' && 
             year !== '' && 
             miles !== '';
    };

    var leaseInfoDone = function() {
      var maxMiles            = $scope.lease.maxMiles;
      var costPerMile         = $scope.lease.costPerMile;
      var currentMonthInLease = $scope.lease.currentMonthInLease;
      var lengthOfLease       = $scope.lease.lengthOfLease;
      return maxMiles !== '' && 
             costPerMile !== '' && 
             lengthOfLease !== '' && 
             currentMonthInLease !== '';
    };

    $scope.prepareSummary = function() {
      $scope.milesDrivenPerYear  = calculateMilesDrivenPerYear();
      $scope.estimatedTotalMiles = estimatedTotalMiles();
      $scope.differenceInMiles   = differenceInMiles();
      $scope.overrageMessage     = ($scope.differenceInMiles < 0 ? calculateCharges() : false); 
      $scope.possibleBudget      = ($scope.suggestedBudget > 0 ? true : false);
      $scope.switchLeaseInfoSummary();
    };


    $scope.switchCustomerCarInfo = function() {
      if (customerInfoDone()) {
        $scope.customerInfo = !$scope.customerInfo;
        $scope.carInfo      = !$scope.carInfo;
      } else {
        $scope.toastIt();
      }
    };

    $scope.switchCarLeaseInfo = function() {
      if (carInfoDone()) {
        $scope.carInfo   = !$scope.carInfo;
        $scope.leaseInfo = !$scope.leaseInfo;
      } else {
        $scope.toastIt();
      }
    };

    $scope.switchLeaseInfoSummary = function() {
      if (leaseInfoDone()) {
        $scope.leaseSummary = !$scope.leaseSummary;
        $scope.leaseInfo    = !$scope.leaseInfo;
      } else {
        $scope.toastIt();
      }
    };
  });
