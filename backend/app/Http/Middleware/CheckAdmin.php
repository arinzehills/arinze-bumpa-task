<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // Check if user is authenticated
        if (!auth('api')->check()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        $user = auth('api')->user();

        // Check if user is admin or super_admin
        $isAdmin = $user->user_type === 'admin' || $user->role === 'super_admin';

        if (!$isAdmin) {
            return response()->json([
                'success' => false,
                'message' => 'Forbidden - Admin access required'
            ], 403);
        }

        return $next($request);
    }
}
