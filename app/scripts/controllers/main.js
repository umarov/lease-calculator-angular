'use strict';

/**
 * @ngdoc function
 * @name leaseCalculatorApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the leaseCalculatorApp
 */
angular.module('leaseCalculatorApp')
  .controller('MainCtrl', function ($scope) {

    $scope.customerInfo       = true;
    $scope.carInfo            = false;
    $scope.leaseInfo          = false;
    $scope.leaseSummary       = false;
    $scope.overrageMessage    = false;
    $scope.milesDrivenPerYear = 0.0;
    $scope.estimatedCharges   = 0.0;
    $scope.suggestedBudget    = 0.0;
    $scope.estimatedTotalMiles = 0;
    $scope.differenceInMiles   = 0;


    function Lease() {
      this.maxMiles            = 0;
      this.costPerMile         = 0.0;
      this.lengthOfLease       = 0;
      this.currentMonthInLease = 0;
      this.car                 = null;
    }

    function Car() {
      this.make  = '';
      this.model = '';
      this.year  = 0;
      this.miles = 0;
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

    $scope.prepareSummary = function() {
      $scope.milesDrivenPerYear  = calculateMilesDrivenPerYear();
      $scope.estimatedTotalMiles = estimatedTotalMiles();
      $scope.differenceInMiles   = differenceInMiles();
      $scope.overrageMessage     = ($scope.differenceInMiles < 0 ? calculateCharges() : false); 

      $scope.switchLeaseInfoSummary();
    };


    $scope.switchCustomerCarInfo = function() {
      $scope.customerInfo = !$scope.customerInfo;
      $scope.carInfo      = !$scope.carInfo;
    };

    $scope.switchCarLeaseInfo = function() {
      $scope.carInfo   = !$scope.carInfo;
      $scope.leaseInfo = !$scope.leaseInfo;
    };

    $scope.switchLeaseInfoSummary = function() {
      $scope.leaseSummary = !$scope.leaseSummary;
      $scope.leaseInfo    = !$scope.leaseInfo;
    };
  });
