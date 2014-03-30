<?php
// ini_set('display_startup_errors',1);
// ini_set('display_errors',1);

doLog("file called");

if ( $_GET["method"] ) {
	switch ($_GET["method"]) {
		case 'getCode':
			getTrackingCode();
			break;
	}	
}

if ( $_POST["method"] ) {
	switch ($_POST["method"]) {
		case 'setgeo':
			setGeoInformation( $_POST["data"] );
			break;
		case 'track':
			storeTrack( $_POST["data"] );
			break;
	}
}

function getTrackingCode() {
	if ( $_GET["ip"] ) {
		echo getCodeByIP( $_GET["ip"] );
	} else {
		echo getCodeByIP( get_client_ip() );
	}
}

function get_client_ip() {
    $ipaddress = '';
    if ($_SERVER['HTTP_CLIENT_IP'])
        $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
    else if($_SERVER['HTTP_X_FORWARDED_FOR'])
        $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
    else if($_SERVER['HTTP_X_FORWARDED'])
        $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
    else if($_SERVER['HTTP_FORWARDED_FOR'])
        $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
    else if($_SERVER['HTTP_FORWARDED'])
        $ipaddress = $_SERVER['HTTP_FORWARDED'];
    else if($_SERVER['REMOTE_ADDR'])
        $ipaddress = $_SERVER['REMOTE_ADDR'];
    else
        $ipaddress = 'UNKNOWN';
 
    return $ipaddress;
}

function generateUniqueId() {
	return uniqid("", true);
}

function getCodeByIP($ip) {
	// check if ip is already in database with a valid date
	return generateUniqueId();
}

function storeTrack() {

}

function setGeoInformation( $data ) {
	doLog("user is from...");
	doLog($data["country"] );
}

function doLog($text) {
  // open log file
  $filename = "text.log";
  $fh = fopen($filename, "a") or die("Could not open log file.");
  fwrite($fh, date("d-m-Y, H:i")." - $text\n") or die("Could not write file!");
  fclose($fh);
}
?>