<?php

namespace App\Modules\PaymentService\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'product_id',
        'amount',
        'status',
        'transaction_id',
        'reference',
        'redirect_url',
        'unlocked_data',
        'payment_method'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'unlocked_data' => 'array',
    ];

    /**
     * Get the user who made the payment
     */
    public function user()
    {
        return $this->belongsTo('App\Modules\UserService\Models\User');
    }

    /**
     * Get the product that was purchased
     */
    public function product()
    {
        return $this->belongsTo('App\Modules\ECommerceProductService\Models\Product');
    }
}