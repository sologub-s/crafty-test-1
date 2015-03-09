/**
 * Created by ZeitGeist on 10.04.2015.
 */
"use strict";
var Game = {

    map_grid: {
        width: 24,
        height: 16,
        tile: {
            width: 16,
            height: 16
        }
    },

    width: function () {
        return this.map_grid.width * this.map_grid.tile.width;
    },

    height: function () {
        return this.map_grid.height * this.map_grid.tile.height;
    },

    // Initialize and start game
    start: function () {
        // Start Crafty and set the green background
        Crafty.init(Game.width(), Game.height());
        Crafty.background('rgb(87, 109, 20)');

        Crafty.scene('Loading');
    }
}

var $text_css = {
    'size': '24px',
    'family': 'Arial',
    'color': 'white',
    'text-align': 'center'
}