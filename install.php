<?php

// Proceed with DB Setup?
$proceedWithSetup = isset($_POST["hostname"]);

if ($proceedWithSetup) {

	// Config
	$config_file	= "./application/config/config.php.TEMPLATE";
	$encryption_key	= sha1(microtime(true).mt_rand(10000,90000));
	$config_current	= file_get_contents($config_file, FILE_USE_INCLUDE_PATH);
	$config_current	= str_replace("{INSTALL_BASE_URL}", $_POST["base_url"], $config_current);
	$config_current	= str_replace("{INSTALL_ENCRYPTION_KEY}", $encryption_key, $config_current);
	file_put_contents("./application/config/config.php", $config_current);

	// Database
	$hostname = $_POST["hostname"];
	$username	= $_POST["username"];
	$password	= $_POST["password"];
	$database_name = $_POST["database"];
	$database_file = file_get_contents("./application/config/database.php.TEMPLATE", FILE_USE_INCLUDE_PATH);
	$database_file = str_replace("{INSTALL_DB_HOSTNAME}", $hostname, $database_file);
	$database_file = str_replace("{INSTALL_DB_USERNAME}", $username, $database_file);
	$database_file = str_replace("{INSTALL_DB_PASSWORD}", $password, $database_file);
	$database_file = str_replace("{INSTALL_DB_DATABASE}", $database_name, $database_file);
	file_put_contents("./application/config/database.php", $database_file);
	
	// Make Files
	copy("./application/config/routes.php.TEMPLATE","./application/config/routes.php");
	copy("./application/config/social_igniter.php.TEMPLATE","./application/config/social_igniter.php");
	
	echo json_encode(
		array(
			'status' => 'success',
			'message' => 'Created files & folders',
			'data' => $_POST
		)
	);

} else {
	// Write HTML for setup Forms etc
?>
<!DOCTYPE html>  
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Install Social-Igniter</title>
	<link rel="stylesheet" type="text/css" href="/css/install.css" />
	<script type="text/javascript" src="/js/jquery.js"></script>
	<script type="text/javascript" src="/js/social.core.js"></script>
	<script type="text/javascript" src="/js/installer/setup.js"></script>
</head>
<body>
<div id="container">
	<div class="content norm_top"></div>	
	<div class="content norm_mid">	
		<div id="welcome" class="content_wrap">
			<img id="logo" src="images/si_logo.png">
			<h1>Install Social-Igniter</h1>
			<p>Welcome and thanks for downloading Social-Igniter, you have taken the first step to setting up your own little corner on the internet. Great job Ace, but first we need you to tell us a few things before your site will work properly.</p>
			<div class="clear"></div>
		</div>
		<div class="norm_separator"></div>
		<div class="content_wrap">
			<!-- step 1 -->
			<div id="step_1" class="hide">
			<form name="install_step_1" id="install_step_1" method="POST">
				<h2>Site URL</h2>
				<p>Of your website <input type="text" name="base_url" id="base_url" placeholder="http://example.com/"></p>
				<h2>Database Settings</h2>
				<p>The hostname of your database server. <input type="text" id="db_hostname" placeholder="localhost" name="hostname"></p>
				<p>The username used to connect to the database. <input type="text" id="db_username" placeholder="root" name="username"></p>
				<p>The password used to connect to the database. <input type="password" id="db_password" placeholder="" name="password"></p> 
				<p>The name of the database you want to connect to. <input type="text" id="db_database" placeholder="social-igniter" name="database"></p>
				<p>(Currently you have to have to manually create your database)</p>
				<p><input type="submit" value="Continue"></p>
			</form>
			</div>
			<!-- step 2 -->
			<div id="step_2" class="hide">
				<h2 id="step_2_title">Creating Database...</h2>		
			</div>
			<!-- step 3 -->
			<div id="step_3" class="hide">
			<form name="install_step_3" id="install_step_3" method="POST">
				<h2>Your Information</h2>
				<p>Enter information for who will be owning or controlling this website</p>
				<table border="0" cellpadding="0" cellspacing="0">
					<tr>
					  <td>Name</td>
					  <td>
					  	<input type="text" name="name" id="signup_name" placeholder="Joe Smith" value="">
					  	<span id="signup_name_error"></span>
					  </td>
					</tr>
					<tr>
					  <td>Email</td>
					  <td>
					  	<input type="text" name="email" id="signup_email" placeholder="your@email.com" value="">
				  		<span id="signup_email_error"></span>
					  </td>
					</tr>
					<tr>  
					  <td>Password</td>
					  <td>
					  	<input type="password" name="password" id="signup_password" placeholder="********" value="">
					  	<span id="signup_password_error"></span>
					  </td>
					</tr>
					<tr>  
					  <td>Confirm Password</td>
					  <td>
					  	<input type="password" name="password_confirm" id="signup_password_confirm" placeholder="********" value="">
					  	<span id="signup_password_confirm_error"></span> 
					  </td>
					</tr>
					<tr> 
					  <td colspan="2"><input type="submit" name="submit" value="Signup"></td>
					</tr>
				</table>	
				<input type="hidden" name="session" value="1">
				<input type="hidden" name="remember" value="1">
			</form>
			</div>
			<!-- step 4 -->
			<div id="step_4" class="hide">
			<form name="install_step_4" id="install_step_4" method="POST">
				<h2>Website Information</h2>
				<p>So people know what website they are visiting :)</p>
				<p>Site Name<br> <input type="text" name="title" id="site_title" placeholder="My Awesome Website" value=""></p>
				<p>Tagline<br> <input type="text" name="tagline" id="site_tagline" placeholder="Where I Post All My Awesome Things" value=""></p>
				<p>Keywords<br> <input type="text" name="keywords" id="site_keywords" placeholder="awesome, things, pictures, videos, poems, watermelons, cats, ninjas" value=""></p> 
				<p>Description<br> <textarea name="description" id="site_description" placeholder="This is my awesome website where I post awesome stuff. Some of my favorite things are ninjas, watermelons, and cats" cols="40" rows="7"></textarea>
				<p><input type="submit" value="Continue"></p>
			</form>
			</div>	
			<!-- step 5 -->
			<div id="step_5" class="hide">
				<h2>Your Site is Now Setup</h2>
				<p>Good job old sport, you're awesome. Now go em get em tiger!</p>
				<h3>Get Started Exploring</h3>
				<p><a id="go_to_website" href=""><img src="application/views/dashboard_default/assets/icons/globe_24.png"> Site</a>
				<p><a id="go_to_dashboard" href=""><img src="application/views/dashboard_default/assets/icons/home_24.png"> Home</a>
				<p><a id="go_to_apps" href=""><img src="application/views/dashboard_default/assets/icons/installer_24.png"> Apps</a>
				<p><a id="go_to_design" href=""><img src="application/views/dashboard_default/assets/icons/colors_24.png"> Design</a>
			</div>
		</div>
	</div>
	<div class="content norm_bot"></div>
</div>
</body>
</html>
<?php } ?>