<?php

require_once(dirname(dirname(__FILE__)) . "/engine/start.php");

//create a newspost
$user = new Minds\Entities\User('minds');

$activity = new Minds\Entities\Activity();
$activity->setMessage("Hello Minds!");
$guid = $activity->save();

Minds\Core\Boost\Factory::build('Newsfeed')->boost($guid, 1);
Minds\Core\Events\Dispatcher::trigger('notification', 'elgg/hook/activity', array(
        'to'=>array($user->guid),
        'object_guid' => $guid,
        'notification_view' => 'boost_submitted',
        'params' => array('impressions'=>1),
        'impressions' => 1
        ));

echo "done";
