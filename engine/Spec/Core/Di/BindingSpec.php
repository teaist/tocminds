<?php

namespace Spec\Minds\Core\Di;

use PhpSpec\ObjectBehavior;
use Prophecy\Argument;

class BindingSpec extends ObjectBehavior
{
    public function it_is_initializable()
    {
        $this->shouldHaveType('Minds\Core\Di\Binding');
    }

    public function it_should_set_function()
    {
        $this->setFunction(function () {
            return "boo";
        })->shouldReturn($this);
        $this->getFunction()->shouldHaveType('Closure');
    }

    public function it_should_set_factory()
    {
        $this->setFactory(true)->shouldReturn($this);
        $this->isFactory()->shouldReturn(true);
    }

    public function it_should_set_immutable()
    {
        $this->setImmutable(true)->shouldReturn($this);
        $this->isImmutable()->shouldReturn(true);
    }
}
