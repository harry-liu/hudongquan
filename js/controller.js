var interactiveControllers = angular.module('interactiveControllers', []);

interactiveControllers.controller('BodyControl', function($scope,$window,locals,$location,$rootScope,FetchData) {
	$scope.showTM = true;
	$scope.showBM = true;
	$scope.$on('hideTM', function(e,data){
		$scope.showTM = data;
	});
	$scope.$on('hideBM', function(e,data){
		$scope.showBM = data;
	});
	$scope.$on('changeTM', function(e,data){
		//top menu type 1:首页
		//top menu type 2:社区
		//top menu type 3:返回+文字
		//top menu type 4:文字
		//top menu type 5:返回+搜索+查找
		//top menu type 6:返回+搜索
		//top menu type 7:返回+文字+购买按钮
		//top menu type 8:返回+文字+添加客户按钮
		//top menu type 9:返回+文字+完成添加客户按钮
		//top menu type 9:返回+文字+完成修改客户按钮
		$scope.topMenuContent = data;
	});
	$scope.$on('setBottomMenuImage', function(e,data){
		$scope.activeBottomMenuImage = data;
	});
	$scope.goBackClicked = function(){
		$window.history.back();
	}
	$scope.goToSearch = function(){
		//$window.location.href = "#search";
		$location.path('#search');
	}

	$scope.addSearchItem = function(){
		var list = locals.getObject("searchList","")
		if($scope.searchInput){
			if(list.length){
				var findSameItem = false;
				for (var i = 0; i < list.length; i++) {
					if(list[i].content == $scope.searchInput){
						findSameItem = true;
					}
				}
				if(!findSameItem){
					var item = {
						'id':list.length,
						'content':$scope.searchInput
					}
					list.push(item);
				}
			}
			else{
				var item = {
					'id':0,
					'content':$scope.searchInput
				}
				list = [item];
			}
			locals.setObject("searchList",list);
		}
	}

	$scope.hideCity = true;
	$rootScope.hideBlackCover = true;
	$scope.hideSort = true;
	$rootScope.hideBodyOverflow = '';

	$scope.toggleCity = function(){
		if ($scope.hideCity == $scope.hideBlackCover) {
			if($scope.hideBlackCover){
				$scope.hideCity = false;
				$rootScope.hideBlackCover = false;
				//$scope.hideBodyOverflow = 'disable-overflow';
			}
			else{
				$scope.hideCity = true;
				$rootScope.hideBlackCover = true;
				//$scope.hideBodyOverflow = '';
			}
		}
	}
	$scope.toggleSort = function(){
		if ($scope.hideSort == $scope.hideBlackCover) {
			if($scope.hideBlackCover){
				$scope.hideSort = false;
				$rootScope.hideBlackCover = false;
				//$scope.hideBodyOverflow = 'disable-overflow';
			}
			else{
				$scope.hideSort = true;
				$rootScope.hideBlackCover = true;
				//$scope.hideBodyOverflow = '';
			}
		}
	}
	$scope.closeCityOrSort = function(){
		if($scope.hideCity == $scope.hideBlackCover){
			$scope.hideCity = true;
			$rootScope.hideBlackCover = true;
			//$scope.hideBodyOverflow = '';
		}
		else if ($scope.hideBlackCover == $scope.hideSort) {
			$scope.hideSort = true;
			$rootScope.hideBlackCover = true;
			//$scope.hideBodyOverflow = '';
		}
	}
	$rootScope.$watch('hideBlackCover',function(){
		if ($rootScope.hideBlackCover) {
			$rootScope.hideBodyOverflow = '';
		}
		else{
			$rootScope.hideBodyOverflow = 'disable-overflow';
		}
	})
	$scope.pushBookingForm = function(){
		$scope.$broadcast ('pushBookingForm');
	}
	$scope.pushClientInformation = function(){
		$scope.$broadcast ('pushClientInformation');
	}
	$scope.pushClientInformationEdit = function(){
		$scope.$broadcast ('pushClientInformationEdit');
	}

	$scope.getMenu = function(){
		var url = "categories";
		FetchData.getPublicAPI(url,function(error,data){
			if(data){
				$scope.menus = data.categories;
				console.log($scope.menus);
			}
		})
	}
	$scope.getMenu();

	$scope.goTo = function(id){
		if(id){
			$location.path('/product_list/'+id);
			$scope.toggleSort();
		}
	}
});

interactiveControllers.controller('LoginCtrl', function($timeout,SaveToken,$scope,LogService,FetchData,AuthenticationService,$location,$rootScope) {
	$rootScope.loadingData = false;
	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',false);
	var change = {
		type:3,
		word:'登陆'
	}

	$scope.sendSms = '发送验证码';
	$scope.disableButton = false;
	$scope.activeButton = '';

	function startTimeOut(){
		$scope.counter = 60;
		$scope.onTimeout = function(){
		    $scope.counter--;
		    mytimeout = $timeout($scope.onTimeout,1000);
		    //console.log($scope.counter);
		    $scope.sendSms = '重发 '+$scope.counter;
		    $scope.disableButton = true;
		    $scope.activeButton = 'active-button';
		    if($scope.counter == 1){
		    	$scope.stop();
		    }
		}
		var mytimeout = $timeout($scope.onTimeout,1000);

		$scope.stop = function(){
			$scope.sendSms = '发送验证码';
			$scope.disableButton = false;
			$scope.activeButton = '';
		    $timeout.cancel(mytimeout);
		}
	}

	$scope.getSms = function(){
		if($scope.phoneNumber){
			var data = 'mobile='+$scope.phoneNumber;
			LogService.sms(data)
			.success(function(data){
				console.log(data);
				if(data.success){
					startTimeOut();
				}
				else{
					alert('必须输入有效的号码');
				}
			})
			.error(function(status,error){
				console.log(status);
			})
		}
		//startTimeOut();
	}

	$scope.login = function(){
		if($scope.phoneNumber&&$scope.password){
			//console.log('login');
			var user = $scope.phoneNumber;
			var code = $scope.password;
			// LogService.login(user).success(function(data){
			// 	//console.log('login success');
			// 	console.log(data);
			// 	SaveToken(data);
			// 	$location.path($rootScope.nextUrl).replace();
			// 	//$location.path('/us');
			// }).error(function(status,data){
			// 	console.log(status);
			// 	if(data = 500){
			// 		console.log('error username or password');
			// 	}
			// 	console.log(data);
			// })
			LogService.login(user,code)
			.success(function(data){
				console.log(data);
				SaveToken(data);
				$location.path($rootScope.nextUrl||'/us').replace();
			})
			.error(function(status,error){
				console.log(status);
			})
		}
	}

	$scope.$emit('changeTM',change);
});

interactiveControllers.controller('NewUserCtrl', function($scope,$rootScope) {
	$rootScope.loadingData = false;

	$scope.$emit('hideTM',false);
	$scope.$emit('hideBM',false);
});

interactiveControllers.controller('HomeCtrl', function($scope,$rootScope,FetchData) {
	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',true);
	$scope.$emit('setBottomMenuImage','home');

	var change = {
		type:1
	}
	$scope.$emit('changeTM',change);

	$scope.myInterval = 6000;
	$scope.slides = [
	{
		id:0,
		image: 'imgs/home/1.jpg',
		text:'test'
	},
	{
		id:1,
		image: 'imgs/home/2.jpg',
		text:'test'
	}
	];

	var url = "categories/get?id=5";
	FetchData.getPublicAPI(url,function(error,data){
		if(data){
			$scope.dataList = data.productions;
			$rootScope.loadingData = false;
		}
	})
});

interactiveControllers.controller('MyDiscountCtrl', function($scope,$rootScope) {
	$rootScope.loadingData = false;

	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',false);
	var change = {
		type:3,
		word:'我的折扣'
	}
	$scope.$emit('changeTM',change);

	$scope.$emit('setBottomMenuImage','home');
});

interactiveControllers.controller('BookingListCtrl', function(PushData,$scope,$rootScope,$filter,FetchData,AuthenticationService) {
	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',true);
	var change = {
		type:3,
		word:'我的订单'
	}
	$scope.$emit('changeTM',change);
	$scope.$emit('setBottomMenuImage','us');

	$scope.bookingList = [];

	var url = "orders/my-orders";
	var token = AuthenticationService.getAccessToken();
	FetchData.getData(url,token)
	.success(function(data){
		$rootScope.loadingData = false;
		$scope.bookingList = data.orders;
		$scope.updateNumberUnreadMessage();
		$scope.updateUnreadMessage('1');
		console.log($scope.bookingList);
	})
	.error(function(status,error){
		console.log('status');
	})

	$scope.updateNumberUnreadMessage = function (){
		$scope.auditedUnreadMessage = $scope.getUnreadMessage('1');
		$scope.suditingUnreadMessage = $scope.getUnreadMessage('2');
		$scope.finishedUnreadMessage = $scope.getUnreadMessage('3');
		$scope.notPassUnreadMessage = $scope.getUnreadMessage('4');
	}
	$scope.updateUnreadMessage = function(status){
		var url = "orders/has-read";
		var data = 'status='+status;
		var token = AuthenticationService.getAccessToken();

		PushData.push(url,data,token)
		.success(function(data){
			angular.forEach($filter('filter')($scope.bookingList,{'status':status,'has_read':0}),function(value,key){
				// if (this) {
				// 	this.hasRead = true;
				// }
				value.has_read = 1;
				// console.log(value);
				// console.log(key);
			})
			$scope.updateNumberUnreadMessage();
			//console.log($filter('filter')($scope.bookingList,{'hasRead':false})[0]);
		})
		.error(function(status,error){
			console.log('something wrong');
		})

	}
	$scope.getUnreadMessage = function(status){
		var number = 0;
		angular.forEach($filter('filter')($scope.bookingList,{'status':status,'has_read':0}),function(){
			number++;
		})
		return number;
	}
});

interactiveControllers.controller('ClientListCtrl', function($scope,$rootScope,$filter,$anchorScroll,$location,FetchData,AuthenticationService,PushData) {
	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',false);
	var change = {
		type:8,
		word:'我的客户'
	}
	$scope.$emit('changeTM',change);
	
	console.log('run');
	$scope.goto = function(x){
        var newHash = x;
        if ($location.hash() !== newHash) {
			// set the $location.hash to `newHash` and
			// $anchorScroll will automatically scroll to it
			$location.hash(x).replace();
        }else {
          // call $anchorScroll() explicitly,
          // since $location.hash hasn't changed
          $anchorScroll();
        }
	}

	$scope.clients = [];

	var url = 'customers/my-customers';
	var token = AuthenticationService.getAccessToken();
	FetchData.getData(url,token)
	.success(function(data){
		console.log(data);
		$rootScope.loadingData = false;
		$scope.clients = data.customers;
		$scope.updateFirstCharList($filter('filter')($scope.clients,{'top':0}));
	})
	.error(function(status,error){
		console.log(status);
	})

	$scope.updateFirstCharList = function updateFirstCharList(list){
		if(list){
			$scope.firstCharList = [];
			//console.log(list);
			for(var i = 0; i<list.length; i++){
			    if ($scope.firstCharList.indexOf(list[i].initial) == -1) {
			        $scope.firstCharList.push(list[i].initial);
			    }
			}
			console.log($scope.firstCharList);
		}
	}

	$scope.onHammer = function (e,client,direction) {
		e.preventDefault();
		var url = 'customers/top';
		var data = 'id='+client.id;
		var token = AuthenticationService.getAccessToken();
		PushData.push(url,data,token)
		.success(function(data){
			if(direction == 'top'){
				$scope.currentClient = client;
				$scope.top = 1;
			}
			else{
				$scope.currentClient = client;
				$scope.bottom = 1;
			}
		})
		.error(function(status,error){
			console.log(status);
		})
	}

	$scope.pushTop = function(e){
		e.preventDefault();
		$scope.currentClient.top = 1;
		$scope.top = 0;
		$scope.updateFirstCharList($filter('filter')($scope.clients,{'top':0}));
	}

	$scope.pushBottom = function(e){
		e.preventDefault();
		$scope.currentClient.top = 0;
		$scope.bottom = 0;
		$scope.updateFirstCharList($filter('filter')($scope.clients,{'top':0}));
	}
});

interactiveControllers.controller('ClientAddCtrl', function($scope,$rootScope,PushData,$location,AuthenticationService,FetchData) {
	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',false);
	var change = {
		type:9,
		word:'添加客户'
	}
	$scope.$emit('changeTM',change);

	var url = "customers/create";
	var token = AuthenticationService.getAccessToken();
	FetchData.getData(url,token)
	.success(function(data){
		console.log(data.fields);
		$scope.fields = data.fields;
		$rootScope.loadingData = false;
	})
	.error(function(status,error){
		console.log(status);
	})

	$scope.$on('pushClientInformation',function(){
		var hasError = false;
		var errorMsg = '';
		for(var key in $scope.fields){
			if($scope.fields[key].required&&!$scope.fields[key].value){
				errorMsg  = errorMsg+' '+$scope.fields[key].label+',';
				hasError = true;
			}
		}
		if(hasError){
			alert('请输入'+errorMsg);
		}
		else{
			var url = "customers/create";
			var data = "";
			$scope.updateData = function(){
				for(var key in $scope.fields){
					if(key == $scope.fields.length-1){
						data =data + $scope.fields[key].prefix+$scope.fields[key].field+'='+$scope.fields[key].value;
					}
					else{
						data =data + $scope.fields[key].prefix+$scope.fields[key].field+'='+$scope.fields[key].value+'&';	
					}
				}
			}
			$scope.updateData();
			console.log(data);
			var token = AuthenticationService.getAccessToken();
			PushData.push(url,data,token)
			.success(function(data){
				$location.path('/client_list').replace();
			})
			.error(function(status,error){
				console.log(status);
			})
		}
	})
});

interactiveControllers.controller('ClientChangeCtrl', function($location,$scope,$rootScope,FetchData,AuthenticationService,$route,PushData) {
	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',false);
	var change = {
		type:10,
		word:'修改客户信息'
	}
	$scope.$emit('changeTM',change);

	var id = $route.current.params.id;
	var url = 'customers/edit?id='+id;
	var token = AuthenticationService.getAccessToken();

	FetchData.getData(url,token)
	.success(function(data){
		console.log(data.fields);
		$scope.fields = data.fields;
		$rootScope.loadingData = false;
	})
	.error(function(status,error){
		console.log(status);
	})

	$scope.$on('pushClientInformationEdit',function(){
		var hasError = false;
		var errorMsg = '';
		for(var key in $scope.fields){
			if($scope.fields[key].required&&!$scope.fields[key].value){
				errorMsg  = errorMsg+' '+$scope.fields[key].label+',';
				hasError = true;
			}
		}
		if(hasError){
			alert('请输入'+errorMsg);
		}
		else{
			var id = $route.current.params.id;
			var url = "customers/edit?id="+id;
			var data = "";
			$scope.updateData =  function(){
				for(var key in $scope.fields){
					if(key == $scope.fields.length-1){
						data =data + $scope.fields[key].prefix+$scope.fields[key].field+'='+$scope.fields[key].value;
					}
					else{
						data =data + $scope.fields[key].prefix+$scope.fields[key].field+'='+$scope.fields[key].value+'&';	
					}
				}
			}
			$scope.updateData();
			console.log(data);
			var token = AuthenticationService.getAccessToken();
			PushData.push(url,data,token)
			.success(function(data){
				$location.path('/us');
			})
			.error(function(status,error){
				console.log(status);
			})
		}
	})
});

interactiveControllers.controller('ClientHistoryCtrl', function($scope,$rootScope) {
	$rootScope.loadingData = false;

	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',false);
	var change = {
		type:3,
		word:'成交记录'
	}
	$scope.$emit('changeTM',change);
});

interactiveControllers.controller('ClientDetailCtrl', function($scope,$rootScope,AuthenticationService,FetchData,$route,$location) {
	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',false);
	var change = {
		type:3,
		word:'客户详情'
	}
	$scope.$emit('changeTM',change);

	var id = $route.current.params.id;
	var url = 'customers/view?id='+id;
	var token = AuthenticationService.getAccessToken();
	FetchData.getData(url,token)
	.success(function(data){
		console.log(data);
		$rootScope.loadingData = false;
		$scope.client = data.customer;
	})
	.error(function(status,error){
		console.log(status);
		console.log(error);
	})

	$scope.deletClient = function(){
		var deletUrl = 'customers/delete?id='+id;
		FetchData.getData(deletUrl,token)
		.success(function(data){
			console.log(data);
			if(data.success){
				$location.path('/client_list').replace();
			}
		})
		.error(function(status,error){
			console.log(status);
		})
	}
});

interactiveControllers.controller('BookingDetailCtrl', function($scope,$rootScope,FetchData,AuthenticationService,$route) {
	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',false);
	var change = {
		type:3,
		word:'订单详情'
	}
	$scope.$emit('changeTM',change);

	var url = 'orders/detail?id='+$route.current.params.id;
	var token = AuthenticationService.getAccessToken();
	FetchData.getData(url,token)
	.success(function(data){
		console.log(data);
		$rootScope.loadingData = false;
		$scope.orderInfo = data.order;
	})
	.error(function(status,error){
		console.log(status);
	})
});

interactiveControllers.controller('QRPaymentCtrl', function($scope,$rootScope) {
	$rootScope.loadingData = false;

	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',false);
	var change = {
		type:3,
		word:'二维码支付'
	}
	$scope.$emit('changeTM',change);
});

interactiveControllers.controller('OfflinePaymentCtrl', function($scope,$rootScope) {
	$rootScope.loadingData = false;

	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',false);
	var change = {
		type:3,
		word:'二维码支付'
	}
	$scope.$emit('changeTM',change);
});

interactiveControllers.controller('DiscountCtrl', function($scope,$rootScope) {
	$rootScope.loadingData = false;

	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',false);

	var change = {
		type:3,
		word:'抢购'
	}
	$scope.$emit('changeTM',change);
});

interactiveControllers.controller('DiscountDetailCtrl', function($scope,$rootScope) {
	$rootScope.loadingData = false;

	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',false);

	var change = {
		type:3,
		word:'详情'
	}
	$scope.$emit('changeTM',change);
	$scope.$emit('setBottomMenuImage','home');
});

interactiveControllers.controller('ProductDetailCtrl', function($scope,$route,FetchData,$sce,$rootScope,$location,AuthenticationService,ProductContImageReplace) {
	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',false);
	var change = {
		type:3,
		word:'详情'
	}
	$scope.$emit('changeTM',change);
	$scope.$emit('setBottomMenuImage','home');

	$scope.images = [];

	//console.log(ProductContImageReplace);

	var id = $route.current.params.id;
	var url = "productions/detail?id="+id;
	FetchData.getPublicAPI(url,function(error,data){
		if(data){
			console.log(data);
			$scope.product = data.production;
			$rootScope.loadingData = false;
			if(data.production.cont){
				$scope.thisCanBeusedInsideNgBindHtml = $sce.trustAsHtml(data.production.cont.replace(/src=["]/g,'src="'+ProductContImageReplace));	
			}
			
			for(var i = 0;i<data.production.imagesUrl.length;i++){
				$scope.images[i] = {
					id:i,
					url:data.production.imagesUrl[i]
				}
			}
		}
		else if(!error&&!data){
			$location.path('/disconnect');
		}
	});
});

interactiveControllers.controller('ProductBuyDetailCtrl', function($scope,$rootScope,FetchData,AuthenticationService,PushData,$location,$routeParams,NewOrder) {
	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',false);

	var change = {
		type:7,
		word:'产品订单'
	}
	$scope.$emit('changeTM',change);
	//$scope.bookingDetails = [];

	if(NewOrder.getOrderData().length>0){
		$rootScope.loadingData = false;
		$scope.productFields = NewOrder.getOrderData();
	}
	else{
		FetchData.getData('orders/create?id='+$routeParams.id,AuthenticationService.getAccessToken())
		.success(function(data){
			console.log(data);
			$rootScope.loadingData = false;
			$scope.productFields = data.fields;
		})
		.error(function(status,data){
			console.log(data);
			console.log(status);
		})
	}

	$scope.$on('pushBookingForm',function(){
		//console.log('pushForm');
		var url = 'orders/create?id='+$routeParams.id;
		var formData = '';
		for(var i=0;i<$scope.productFields.length;i++){
			if(i+1 == $scope.productFields.length){
				formData = formData+$scope.productFields[i].prefix+$scope.productFields[i].field+'='+$scope.productFields[i].value
			}
			else{
				formData = formData+$scope.productFields[i].prefix+$scope.productFields[i].field+'='+$scope.productFields[i].value+'&'
			}
			
		}
		console.log(url);
		console.log(formData);
		PushData.push(url,formData,AuthenticationService.getAccessToken())
		.success(function(data){
			console.log(data);
			$location.path('/us');
		})
		.error(function(error,data){
			console.log(error);
		})
	})

	$scope.saveData = function(){
		NewOrder.saveOrderData($scope.productFields);
		console.log($scope.productFields);
		$location.path('/insert_user');
	}
});

interactiveControllers.controller('InsertUserCtrl', function($window,$scope,$rootScope,FetchData,AuthenticationService,$filter,NewOrder) {
	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',false);

	var change = {
		type:3,
		word:'选择客户'
	}
	$scope.$emit('changeTM',change);

	$scope.clients = [];

	var url = 'customers/my-customers';
	var token = AuthenticationService.getAccessToken();
	FetchData.getData(url,token)
	.success(function(data){
		console.log(data);
		$rootScope.loadingData = false;
		$scope.clients = data.customers;
		$scope.updateFirstCharList($scope.clients);
	})
	.error(function(status,error){
		console.log(status);
	})

	$scope.updateFirstCharList = function updateFirstCharList(list){
		if(list){
			$scope.firstCharList = [];
			//console.log(list);
			for(var i = 0; i<list.length; i++){
			    if ($scope.firstCharList.indexOf(list[i].initial) == -1) {
			        $scope.firstCharList.push(list[i].initial);
			    }
			}
			console.log($scope.firstCharList);
		}
	}

	$scope.getUserInfo = function(id){
		var url = 'customers/view?id='+id;
		var token = AuthenticationService.getAccessToken();
		FetchData.getData(url,token)
		.success(function(data){
			console.log(data);
			var necessaryUserData = NewOrder.getOrderData();
			for(var i = 0;i<necessaryUserData.length;i++){
				if(necessaryUserData[i].section == "part_a"){
					// for(var k = 0;k<data.customer.length;k++){
					var field = NewOrder.getOrderData()[i].field;
					necessaryUserData[i].value = data.customer[field];
					// }
				}
			}
			console.log(necessaryUserData);
			NewOrder.saveOrderData(necessaryUserData);
			$window.history.back();
		})
		.error(function(status,error){
			console.log(status);
			console.log(error);
		})
	}
});

interactiveControllers.controller('CommunityCtrl', function($scope,$rootScope,FetchData,$location) {

	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',true);
	var change = {
		type:2,
		buttonType:1
	}
	$scope.$emit('changeTM',change);

	$scope.$emit('setBottomMenuImage','community');

	FetchData.getPublicAPI('community/articles',function(error,data){
		if (data) {
			console.log(data);
			$scope.articles = data.articles;
			$rootScope.loadingData = false;
		}
		else if(!data&&!error){
			$location.path('/disconnect');
		}
	})
});

interactiveControllers.controller('CommunityDetailCtrl', function($route,$scope,$rootScope,FetchData,$sce,$location,ProductContImageReplace) {
	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',false);
	var change = {
		type:3,
		word:'文章详情'
	}
	$scope.$emit('changeTM',change);

	$scope.inputAreaStatus = false;
	$scope.openInputArea = function(){
		$scope.inputAreaStatus = true;
	}
	$scope.closeInputArea = function(){
		$scope.inputAreaStatus = false;
	}

	var id = $route.current.params.id;
	var url = "community/view?id="+id;
	FetchData.getPublicAPI(url,function(error,data){
		if(data){
			$rootScope.loadingData = false;
			console.log(data);
			$scope.article = data.article;
			$rootScope.loadingData = false;
			$scope.thisCanBeusedInsideNgBindHtml = $sce.trustAsHtml(data.article.content.replace(/src=["]/g,'src="'+ProductContImageReplace));
		}
		else if(!error&&!data){
			$location.path('/disconnect');
		}
	});
});

interactiveControllers.controller('TeachCtrl', function($scope,$rootScope) {
	$rootScope.loadingData = false;

	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',true);
	var change = {
		type:2,
		buttonType:2
	}
	$scope.$emit('changeTM',change);

	$scope.$emit('setBottomMenuImage','community');
});

interactiveControllers.controller('SearchCtrl', function($scope,locals,$rootScope) {
	$rootScope.loadingData = false;

	$scope.hideUl = true;
	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',false);
	var change = {
		type:5
	}
	$scope.$emit('changeTM',change);
	if(locals.getObject("searchList","").length>0){
		$scope.searchList = locals.getObject("searchList","").reverse();
	}
	$scope.cleanSearchList = function(){
		$scope.hideUl = false;
		locals.setObject("searchList","");
	}
});

interactiveControllers.controller('SearchListCtrl', function($location,$scope,$route,FetchData,$rootScope) {
	var id = $route.current.params.id;
	//console.log($route.originalPath);
	if($route.current.originalPath == '/product_list/:id'){
		var url = "categories/get?id="+id;
	}
	else {
		if(id){
			var url = "productions?keyword="+id;
		}
		else{
			var url = "productions";
		}
	}

	FetchData.getPublicAPI(url,function(error,data){
		$scope.$emit('hideTM',true);
		$scope.$emit('hideBM',false);
		var change = {
			type:6
		}
		$scope.$emit('changeTM',change);

		
		if(data){
			$rootScope.loadingData = false;
			console.log(data);
			$scope.dataList = data.productions;
		}
		else if(!error&&!data){
			$location.path('/disconnect');
		}
	});


	//$scope.data = getData;
});

interactiveControllers.controller('ExampleCtrl', function($scope,$rootScope) {
	$rootScope.loadingData = false;

	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',false);

	var change = {
		type:3,
		word:'成交记录'
	}
	$scope.$emit('changeTM',change);
});

interactiveControllers.controller('ExampleDetailCtrl', function($scope,$rootScope) {
	$rootScope.loadingData = false;

	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',false);

	var change = {
		type:3,
		word:'成交详情'
	}
	$scope.$emit('changeTM',change);
});

interactiveControllers.controller('UsCtrl', function($scope,$rootScope,AuthenticationService,FetchData,LogService,$location,SaveToken) {

	$scope.$emit('hideTM',false);
	$scope.$emit('hideBM',true);

	$scope.$emit('setBottomMenuImage','us');

	//$rootScope.loadingData = false;
	
	function getData(){
		FetchData.getUserInfo(AuthenticationService.getAccessToken())
		.success(function(data){
			console.log(data);
			//return data;
			$scope.user = data.user;
			$rootScope.loadingData = false;
		})
		.error(function(status,data){
			//data == -1&&!status
			if(false){
				$location.path('/disconnect');
			}
			else{
				if (AuthenticationService.getRefreshToken() != ''){
					LogService.refreshToken(AuthenticationService.getRefreshToken()).success(function(data){
						SaveToken(data);
						FetchData.getUserInfo(AuthenticationService.getAccessToken()).success(function(data){
							$scope.user = data.user;
							$rootScope.loadingData = false;
						}).error(function(status,error){
							$location.path('/login');
						})
					}).error(function(status,error){
						$location.path('/login');
					})
				}
				else{
					$location.path('/login');
				}
			}
		})
	}

	getData();
});

interactiveControllers.controller('PersonalDetailCtrl', function($scope,$rootScope,$http,Upload, $timeout,PublicURL,AuthenticationService) {
	$rootScope.loadingData = false;

	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',false);
	var change = {
		type:9,
		word:'个人信息'
	}
	$scope.$emit('changeTM',change);
	$scope.$emit('setBottomMenuImage','us');

	$scope.user = {};
	$scope.user.image = '';

    $scope.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: PublicURL+'upload',
                method:"post",
                headers: {
                    'Authorization': 'Bearer '+AuthenticationService.getAccessToken()
                   // 'Content-Type': 'application/x-www-form-urlencoded'
                },
                file:file,
                // data: {

                // }
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                    console.log(response);
                    $scope.user.image = response.data.url;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
                console.log($scope.errorMsg);
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * 
                                         evt.loaded / evt.total));
                console.log(file.progress);
            });
        }   
    }
});

interactiveControllers.controller('AddAliPayCtrl', function($scope,$rootScope) {
	$rootScope.loadingData = false;

	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',false);
	var change = {
		type:3,
		word:'支付宝'
	}
	$scope.$emit('changeTM',change);
});

interactiveControllers.controller('WithdrawCtrl', function($scope,$rootScope) {
	$rootScope.loadingData = false;

	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',false);
	var change = {
		type:3,
		word:'提现'
	}
	$scope.$emit('changeTM',change);
	$scope.$emit('setBottomMenuImage','us');
});

interactiveControllers.controller('WithdrawCompleteCtrl', function($scope,$rootScope) {
	$rootScope.loadingData = false;

	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',false);
	var change = {
		type:3,
		word:'提现完成'
	}
	$scope.$emit('changeTM',change);
	$scope.$emit('setBottomMenuImage','us');
});

interactiveControllers.controller('SettingsCtrl', function($scope,$rootScope,AuthenticationService) {
	$rootScope.loadingData = false;

	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',false);
	var change = {
		type:3,
		word:'设置'
	}
	$scope.$emit('changeTM',change);
	$scope.$emit('setBottomMenuImage','us');

	$scope.logOut = function(){
		AuthenticationService.logOut();
	}
});

interactiveControllers.controller('TestListCtrl', function($scope,$rootScope) {
	$rootScope.loadingData = false;

	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',false);
	var change = {
		type:3,
		word:'商品考试'
	}
	$scope.$emit('changeTM',change);


	$scope.$watch("showFileter", function(newValue, oldValue) {
		if ($scope.showFileter) {
			$rootScope.hideBodyOverflow = '';
		}
		else{
			$rootScope.hideBodyOverflow = 'disable-overflow';
		}
	});
});

interactiveControllers.controller('TestDetailCtrl', function($scope,$rootScope) {
	$rootScope.loadingData = false;

	$scope.$emit('hideTM',true);
	$scope.$emit('hideBM',false);
	var change = {
		type:3,
		word:'考试'
	}
	$scope.$emit('changeTM',change);
});

interactiveControllers.controller('DisconnectCtrl', function($scope,$rootScope) {
	$rootScope.loadingData = false;

	$scope.$emit('hideTM',false);
	$scope.$emit('hideBM',false);
});