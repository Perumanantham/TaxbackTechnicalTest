var app = angular.module('txnsApp', []);
var baseAddress = 'https://jointhecrew.in/api/txns/';
var url = "";

app.factory('txnsFactory', function ($http) {
    return {
        getTxnList: function (usr) {
            url = baseAddress + usr;
            return $http.get(url);
        }, getTxn: function (usr, txn) {
            url = baseAddress + usr + "/" + txn.id;
            return $http.get(url);
        }, addTxn: function (txn, usr) {
            url = baseAddress + usr;
            return $http.post(url, {
                'user':txn.user, 
                "currency":txn.currency,
                "amount":txn.amount, 
                "txn_date":txn.txn_date})
        }, deleteTxn: function (txn, usr) {
            console.log(txn)
            url = baseAddress + usr + "/" + txn.id;
            return $http.delete(url);
        }, updateTxn: function (txn, usr) {
            url = baseAddress + usr + "/" + txn.id;
            //return $http.put(url, txn);
            return $http.post(url, {
                'id':txn.id, 
                'user':txn.user, 
                "currency":txn.currency,
                "amount":txn.amount, 
                "txn_date":txn.txn_date});
        }
    };
});

app.controller('txnsController', function PostController($scope, txnsFactory, $filter) {
    $scope.txns = [];
    $scope.txn = null;
    $scope.editMode = false;
    $scope.curruser = "test@gmail.com";
    $scope.error_cls = "danger"

    // Get Txn
    $scope.get = function (txn) {
        // $scope.txn = txn;
        // $('#viewModal').modal('show');

        txnsFactory.getTxn($scope.curruser, txn).success(function (data) {
            $scope.txn = data;
            $('#viewModal').modal('show');
        }).error(function (data) {
            $scope.error = "An Error has occured while Loading users! " + data.ExceptionMessage;
        });
    };

    // Get all txns
    $scope.getAll = function () {
        if (typeof $scope.curruser !== "undefined" && $scope.curruser != "") {
            txnsFactory.getTxnList($scope.curruser).success(function (data) {
                $scope.txns = data;
                if ($scope.txns.length == 0) {
                    $scope.error = "No Transactions Found";
                    $scope.error_cls = "info";
                }
            }).error(function (data) {
                $scope.error = "An Error has occured while Loading users! " + data.ExceptionMessage;
            });
        } else {
            $scope.error = "Please enter user email";
        }
    };

    // Add Txn
    $scope.add = function () {
        $scope.dlgerror = undefined;
        if ($scope.txn) {
            txnsFactory.addTxn($scope.txn, $scope.curruser).success(function (data) {
                $scope.addMode = false;
                $scope.txn.id = data.id;
                $scope.txns.push($scope.txn);

                //$scope.txn = null;
                $scope.error = undefined;
                $('#txnModel').modal('hide');
            }).error(function (data) {
                $scope.dlgerror = data.error;
            });
        }
    };

    // Edit Txn
    $scope.edit = function (txn) {
        $scope.txn = [];
        $scope.txn = txn;
        $scope.editMode = true;
        $('#txnModel').modal('show');
    };

    // Update Txn
    $scope.update = function () {
        var tmp = $scope.txn;
        txnsFactory.updateTxn(tmp, $scope.curruser).success(function (data) {
            $scope.editMode = false;

            //$scope.txn = null;
            $scope.error = undefined;
            $('#txnModel').modal('hide');
        }).error(function (data) {
            $scope.dlgerror = data.error;
        });
    };

    // Delete Txn
    $scope.delete = function () {
        var currTxn = $scope.txn;
        txnsFactory.deleteTxn($scope.txn, $scope.curruser).success(function (data) {
            $('#confirmModal').modal('hide');
            $scope.txns.pop(currTxn);
        }).error(function (data) {
            $scope.error = "An Error has occured while Deleting user! " + data.ExceptionMessage;
            $('#confirmModal').modal('hide');
        });
    };

    // Model popup events
    $scope.showadd = function () {
        $scope.txn = [];
        $scope.txn.user = $scope.curruser;
        $scope.txn.txn_date = $filter('date')(new Date(), "yyyy-MM-dd");
        $scope.editMode = false;
        $('#txnModel').modal('show');
    };

    // Txn model show
    $scope.showedit = function () {
        $('#txnModel').modal('show');
    };

    // Confirmation
    $scope.showconfirm = function (data) {
        $scope.txn = data;
        $('#confirmModal').modal('show');
    };

    // Close
    $scope.cancel = function () {
        $scope.txn = null;
        $('#txnModel').modal('hide');
    }

    // Initialize your txns data
    $scope.getAll();
});