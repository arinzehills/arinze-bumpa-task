<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBadgesTable extends Migration
{
    public function up()
    {
        Schema::create('badges', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description');
            $table->integer('points_threshold'); // e.g., Bronze=0, Silver=500, Gold=1000
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('badges');
    }
}