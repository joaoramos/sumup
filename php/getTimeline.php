<?php

	require 'TwitterAPIExchange.php';

	$settings = array(
	    'oauth_access_token' => "10151982-K1X4GFasqtzq3ktDKftlyQZ7ZPpMlTj2a7slefh2f",
	    'oauth_access_token_secret' => "hImE1dP5h7agDXBrfI4fMOza5F1rkvkFCb0som4Qciu5u",
	    'consumer_key' => "DzteZ0q25TKrOiSoOUaJA",
	    'consumer_secret' => "olTG8wgQyeA94AA96Rg9nyTsjCB0FeFVgtMEEGyg5I"
	);

	$url = 'https://api.twitter.com/1.1/search/tweets.json';
	$getfield = '?q=%23sumup&count=100';
	$requestMethod = 'GET';
	$twitter = new TwitterAPIExchange($settings);
	echo $twitter->setGetfield($getfield)
	             ->buildOauth($url, $requestMethod)
	             ->performRequest();

?>