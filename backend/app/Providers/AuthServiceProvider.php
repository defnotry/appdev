<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        //
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();

        Gate::define('create-music', function ($user) {
            return $user->role == 'artist' && $user->is_approved;
        });

        Gate::define('manage-users', function ($user) {
            return in_array($user->role, ['admin', 'superadmin']);
        });

        Gate::define('manage-system', function ($user) {
            return $user->role == 'superadmin';
        });
    }
}
