var SumUp = angular.module('SumUp', []);

SumUp.filter('timeago', function() {
	return function(time) {
		// http://ejohn.org/blog/javascript-pretty-date/
	    var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
		diff = (((new Date()).getTime() - date.getTime()) / 1000),
		day_diff = Math.floor(diff / 86400);
			
		if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
			return;
				
		return day_diff == 0 && (
				diff < 60 && "just now" ||
				diff < 120 && "about a minute ago" ||
				diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
				diff < 7200 && "about an hour ago" ||
				diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
			day_diff == 1 && "yesterday" ||
			day_diff < 7 && day_diff + " days ago" ||
			day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";

	}
});


SumUp.factory('juice', function($http) {
	return {
		getTimeline: function () {
			return $http({
				url: 'php/getTimeline.php',
				method: 'GET'
			});
		},
		// Website metrics
		getWebsiteFBLikes: function () {
			return $http({
				url: 'https://api.facebook.com/method/fql.query?query=select%20like_count%20from%20link_stat%20where%20url=%27http://sumup.com/%27&format=json',
				method: 'GET'
			});
		},
		getWebsiteFBShares: function () {
			return $http({
				url: 'https://graph.facebook.com/?id=http://sumup.com',
				method: 'GET'
			});
		},
		getWebsiteTShares: function () {
			return $http({
				url: 'http://urls.api.twitter.com/1/urls/count.json?url=http://sumup.com&callback=JSON_CALLBACK',
				method: 'JSONP'
			});
		},
		// Facebook metrics
		getGroupLikes: function () {
			return $http({
				url: 'https://api.facebook.com/method/fql.query?query=select%20like_count%20from%20link_stat%20where%20url=%27http://facebook.com/sumup.co.uk/%27&format=json',
				method: 'GET'
			});
		},
		getGroupStories: function () {
			return $http({
				url: 'https://graph.facebook.com/?id=http://facebook.com/sumup.co.uk',
				method: 'GET'
			});
		},
		// Twitter metrics
		getTwitterMetrics: function () {
			return $http({
				url: 'php/getMetrics.php',
				method: 'GET'
			});
		}
	};
});

SumUp.controller('timeline', function($scope, $http, juice) {
	
	$scope.data = {
		content: {},
		loader: true,
		count: 0,
		check: function(count) {
			if (count==6) {
				$scope.data.loader = false;
			}
		}
	}

	juice.getTimeline().success(function(data) {
		$scope.data.content.timeline = data;
		$scope.data.check($scope.data.count++);
	});

	// Website metrics
	juice.getWebsiteFBLikes().success(function(data) {
		$scope.data.content.WebsiteFBLikes = data;
		$scope.data.check($scope.data.count++);
	});
	juice.getWebsiteFBShares().success(function(data) {
		$scope.data.content.WebsiteFBShares = data;
		$scope.data.check($scope.data.count++);
	});
	juice.getWebsiteTShares().error(function(data) {
		// http://stackoverflow.com/a/16349513/618063
		$scope.data.content.WebsiteTShares = angular.callbacks.counter;
		$scope.data.check($scope.data.count++);
	});

	// Facebook metrics
	juice.getGroupLikes().success(function(data) {
		$scope.data.content.GroupLikes = data;
		$scope.data.check($scope.data.count++);
	});
	juice.getGroupStories().success(function(data) {
		$scope.data.content.GroupStories = data;
		$scope.data.check($scope.data.count++);
	});

	// Twitter metrics
	juice.getTwitterMetrics().success(function(data) {
		$scope.data.content.TwitterMetrics = data;
		$scope.data.check($scope.data.count++);
	});

});