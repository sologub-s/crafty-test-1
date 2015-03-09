/**
 * Created by ZeitGeist on 11.04.2015.
 */

"use strict";

Crafty.scene("Game", function () {

    this.occupied = new Array(Game.map_grid.width);
    for (var i = 0; i < Game.map_grid.width; i++) {
        this.occupied[i] = new Array(Game.map_grid.height);
        for (var y = 0; y < Game.map_grid.height; y++) {
            this.occupied[i][y] = false;
        }
    }

    this.atEdge = function (x, y) {
        return x === 0 || x === Game.map_grid.width - 1 || y === 0 || y === Game.map_grid.height - 1;
    };

    this.player = Crafty.e('PlayerCharacter').at(5, 5);
    this.occupied[this.player.at().x][this.player.at().y] = true;

    for (var x = 0; x < Game.map_grid.width; x++) {
        for (var y = 0; y < Game.map_grid.height; y++) {
            if (this.atEdge(x, y)) {
                Crafty.e('Tree').at(x, y);
                this.occupied[x][y] = true;
            } else if (Math.random() < .06 && !this.occupied[x][y]) {
                Crafty.e((Math.random() > 0.3) ? 'Bush' : 'Rock').at(x, y);
                this.occupied[x][y] = true;
            }
        }
    }

    var max_villages = 5;
    var i = 0;
    while (Crafty('Village').length < max_villages) {
        var x = Crafty.math.randomInt(0, Game.map_grid.width - 1);
        var y = Crafty.math.randomInt(0, Game.map_grid.height - 1);
        if (!this.occupied[x][y]) {
            Crafty.e('Village').at(x, y);
        }
    }

    var max_towers = 10;
    var i = 0;
    while (Crafty('Tower').length < max_towers) {
        var x = Crafty.math.randomInt(0, Game.map_grid.width - 1);
        var y = Crafty.math.randomInt(0, Game.map_grid.height - 1);
        if (!this.occupied[x][y]) {
            Crafty.e('Tower').at(x, y);
        }
    }

    Crafty.audio.play('ring');

    this.show_victory = this.bind('VillageVisited', function () {
        if (!Crafty('Village').length) {
            Crafty.scene('Victory');
        }
    });

    this.player_changed_position = this.bind('PlayerChangedPosition', function (data) {
        for (var i = 0; i < Crafty('Tower').length; i++) {
            /**
             * VERY slow
             * need to replace on math formula "whether point belongs to circle"
             */
            //console.log(Crafty.math.distance(data.x, data.y, Crafty('Tower').get(i).x, Crafty('Tower').get(i).y));
        }
    });

}, function () {
    this.unbind('VillageVisited', this.show_victory);
    this.unbind('PlayerChangedPosition', this.player_changed_position);
});

Crafty.scene('Victory', function () {
    Crafty.e('2D, DOM, Text')
        .text('All villages visited!')
        .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
        .textFont($text_css);
    Crafty.audio.play('applause');
    var delay = true;
    setTimeout(function() { delay = false; }, 5000);
    this.restart_game = this.bind('KeyDown', function () {
        delay || Crafty.scene('Game');
    });
}, function () {
    this.unbind('KeyDown', this.restart_game);
});

Crafty.scene('Loading', function () {
    Crafty.e('2D, DOM, Text')
        .text('Loading, please wait...')
        .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
        .textFont($text_css);

    Crafty.load({
        audio: {
            knock: ['assets/door_knock_3x.mp3', 'assets/door_knock_3x.ogg', 'assets/door_knock_3x.aac'],
            applause: ['assets/board_room_applause.mp3', 'assets/board_room_applause.ogg', 'assets/board_room_applause.aac'],
            ring: ['assets/candy_dish_lid.mp3', 'assets/candy_dish_lid.ogg', 'assets/candy_dish_lid.aac'],
            step_l: ['assets/sfx_step_grass_l.mp3'],
            step_r: ['assets/sfx_step_grass_r.mp3']
        },
        images: ['assets/16x16_forest_2.gif', 'assets/hunter.png', 'assets/tower_round.png']
    }, function(){
        Crafty.sprite(16, 'assets/16x16_forest_2.gif', {
            spr_tree:    [0, 0],
            spr_bush:    [1, 0],
            spr_village: [0, 1],
            spr_rock:    [1, 1]
        });
        Crafty.sprite(16, 'assets/hunter.png', {
            spr_player:  [0, 2]
        }, 0, 2);
        Crafty.sprite(16, 'assets/tower_round.png', {
            spr_tower:  [0, 0]
        });

        Crafty.scene('Game');
    });
});