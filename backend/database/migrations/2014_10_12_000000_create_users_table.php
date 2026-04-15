<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->integer('total_points')->default(0);
            $table->unsignedBigInteger('current_badge_id')->nullable();
            $table->string('current_badge_name')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('user_type')->default('user'); // admin, user, vendor
            $table->string('role')->default('admin'); // admin, super_admin
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('users');
    }
}
