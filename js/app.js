var SumUp = angular.module('SumUp', []);

SumUp.factory('juice', function($http) {
	return {
		getTimeline: function () {
			return $http({
				url: 'TwitterAPIExchange.php',
				method: 'GET'
			});
		},
		getwLikes: function () {
			return $http({
				url: 'https://api.facebook.com/method/fql.query?query=select%20like_count%20from%20link_stat%20where%20url=%27http://sumup.com/%27&format=json',
				method: 'GET'
			});
		},
		getgLikes: function () {
			return $http({
				url: 'https://api.facebook.com/method/fql.query?query=select%20like_count%20from%20link_stat%20where%20url=%27http://facebook.com/sumup.co.uk/%27&format=json',
				method: 'GET'
			});
		},
		getShares: function () {
			return $http({
				url: 'http://urls.api.twitter.com/1/urls/count.json?url=http://sumup.com&callback=JSON_CALLBACK',
				method: 'JSONP'
			});
		},
	};
});

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

SumUp.controller('timeline', function($scope, $http, juice) {
	
	$scope.data = {
		content: {},
		loader: true,
		count: 0,
		check: function(count) {
			if (count==3) {
				$scope.data.loader = false;
				console.log($scope.data.content.timeline.statuses);
			}
		}
	}

	juice.getTimeline().success(function(data) {
		$scope.data.content.timeline = data;
		$scope.data.check($scope.data.count++);
	});

	juice.getwLikes().success(function(data) {
		$scope.data.content.wlikes = data;
		$scope.data.check($scope.data.count++);
	});

	juice.getgLikes().success(function(data) {
		$scope.data.content.glikes = data;
		$scope.data.check($scope.data.count++);
	});

	juice.getShares().error(function(data) {
		// http://stackoverflow.com/a/16349513/618063
		$scope.data.content.shares = angular.callbacks.counter;
		$scope.data.check($scope.data.count++);
	});

});