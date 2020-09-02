<?php
namespace Minds\Core\Plus;

use Minds\Core\Di\Provider;

/**
 * Wire Providers
 */
class PlusProvider extends Provider
{
    /**
     * Registers providers onto DI
     * @return null
     */
    public function register()
    {
        $this->di->bind('Plus\Manager', function ($di) {
            return new Manager();
        }, ['useFactory'=>true]);
    }
}
