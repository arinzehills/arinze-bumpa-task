<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserAchievementsTable extends Migration
{
    public function up()
    {
        Schema::create('user_achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('achievement_id')->constrained()->onDelete('cascade');
            $table->timestamp('unlocked_at')->nullable();
            $table->integer('progress')->default(0); // Track progress towards achievement
            $table->timestamps();

            // Prevent duplicate achievements for same user
            $table->unique(['user_id', 'achievement_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_achievements');
    }
}