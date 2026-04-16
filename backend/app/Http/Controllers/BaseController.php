<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller;

abstract class BaseController extends Controller
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * Success response
     */
    protected function successResponse($data = null, $message = 'Success', $code = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ], $code);
    }

    /**
     * Error response
     */
    protected function errorResponse($message = 'Error', $code = 400)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'data' => null
        ], $code);
    }

    /**
     * Validation error response
     */
    protected function validationErrorResponse($errors)
    {
        return response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $errors
        ], 422);
    }

    /**
     * Paginated response
     */
    protected function paginatedResponse($data, $pagination = null, $message = 'Success', $code = 200)
    {
        // Handle Laravel paginator object
        if (is_object($data) && method_exists($data, 'items')) {
            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => [
                    'items' => $data->items(),
                    'pagination' => [
                        'total' => $data->total(),
                        'per_page' => $data->perPage(),
                        'current_page' => $data->currentPage(),
                        'last_page' => $data->lastPage(),
                    ]
                ]
            ], $code);
        }

        // Handle custom pagination format
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => [
                'items' => $data,
                'pagination' => $pagination
            ]
        ], $code);
    }

    /**
     * Handle exceptions
     */
    protected function handleException(\Exception $e)
    {
        \Log::error($e->getMessage());

        $code = (int) ($e->getCode() ?: 500);
        // Ensure code is a valid HTTP status code (100-599)
        if ($code < 100 || $code > 599) {
            $code = 500;
        }

        return $this->errorResponse(
            $e->getMessage(),
            $code
        );
    }
}