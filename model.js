function model_init(board_size) {
    var model = {};

    model.player_num = 2;
    model.players = new Array(model.player_num);
    for (var i=0;i<model.player_num;++i) {
        model.players[i] = model_create_player(i+1);
    }

    model.board_size = board_size;
    model.cell_array = new Array(board_size);
    var center = Math.floor((board_size-1)/2);
    for (var i=0;i<board_size;++i) {
        model.cell_array[i] = new Array(board_size);
        for (var j=0;j<board_size;++j) {
            if (i==center && j==center) {
                model.cell_array[i][j] = model_piece(2);
            } else if (i==center+1 && j==center) {
                model.cell_array[i][j] = model_piece(1);
            } else if (i==center && j==center+1) {
                model.cell_array[i][j] = model_piece(1);
            } else if (i==center+1 && j==center+1) {
                model.cell_array[i][j] = model_piece(2);
            } else {
                model.cell_array[i][j] = 0; // 0:empty, 1:black, 2:white
            }
        }
    }
    model.next_move = 1; // 1:black, 2:white
    model_update_playable(model); // update available move list
    return model;
}
function model_piece(color) {
    var piece = {};
    piece.name = "";
    piece.color = color;
    return piece;
}
function model_create_player(color) {
    var pieces_name = [ "A", "B", "C", "D",
                        "E", "F", "G", "H",
                        "I", "J", "K", "L",
                        "M", "N", "O", "P"];
    var player = {};
    player.color = color;
    player.pieces_num = pieces_name.length;
    player.pieces = new Array(player.pieces_num);
    for (var i=0;i<player.pieces_num;++i) {
        player.pieces[i] = model_piece(color);
        player.pieces[i].name = pieces_name[i];
    }
    player.pieces_count = 0;
    return player;
}
function model_player_play(model) {
    var player = model.players[model.next_move-1];
    player.pieces_count += 1;
    return player.pieces[player.pieces_count-1];
}
function model_player_pieces(model) {
    var player = model.players[model.next_move-1];
    return player.pieces_num - player.pieces_count;
}
function model_play(model, i, j) {
    var playable = model_search_playable(model, i, j); // check move availability
    if (playable >= 0) {
        model.cell_array[i][j] = model_player_play(model);
        model_flip(model, i, j, playable);
        model.next_move = model.next_move % model.player_num + 1;
        model_update_playable(model); // update available move list
        if (model.playable.length == 0 || model_player_pieces(model) <= 0) {
            model.next_move = model.next_move % model.player_num + 1;
            model_update_playable(model); // update available move list
            if (model.playable.length == 0 || model_player_pieces(model) <= 0) {
                window.alert('Game End.');
            } else {
                window.alert('PASS!');                
            }
        }
        // TODO: support history feature
    }
    console.log(model.players[0].pieces_count, model.players[1].pieces_count);
}
function model_flip(model, i, j, k) {
    var to_flip = model.playable[k][2];
    for (var l=0;l<to_flip.length;++l) {
        var flip_i = to_flip[l][0];
        var flip_j = to_flip[l][1];
        model.cell_array[flip_i][flip_j] = model_piece(model.next_move);
    }
}
function model_search_playable(model, i, j) {
    for (var k=0;k<model.playable.length;++k) {
        if (model.playable[k][0] == i && model.playable[k][1] == j) {
            return k;
        }
    }
    return -1;
}
function model_update_playable(model) {
    model.playable = [];
    for (var i=0;i<model.board_size;++i) {
        for (var j=0;j<model.board_size;++j) {
            if (model.cell_array[i][j] == 0) {
                var flippable = model_flippable(model, i, j);
                if (flippable.length > 0) {
                    model.playable.push([i, j, flippable]);
                }
            }
        }
    }
    console.log('playable',model.playable);
}
function model_flippable(model, i, j) {
    var flippable_points = [];
    Array.prototype.push.apply(flippable_points, model_check_direction(model, i, j, -1, -1).flip); // north west
    Array.prototype.push.apply(flippable_points, model_check_direction(model, i, j, -1,  0).flip); // north
    Array.prototype.push.apply(flippable_points, model_check_direction(model, i, j, -1,  1).flip); // north east
    Array.prototype.push.apply(flippable_points, model_check_direction(model, i, j,  0,  1).flip); // east
    Array.prototype.push.apply(flippable_points, model_check_direction(model, i, j,  1,  1).flip); // south east
    Array.prototype.push.apply(flippable_points, model_check_direction(model, i, j,  1,  0).flip); // south
    Array.prototype.push.apply(flippable_points, model_check_direction(model, i, j,  1, -1).flip); // south west
    Array.prototype.push.apply(flippable_points, model_check_direction(model, i, j,  0, -1).flip); // west
    return flippable_points;
}
function model_check_direction(model, i, j, dir_i, dir_j, flip = []) {
    var r = {
        playable: false,
        flip: []
    };
    Array.prototype.push.apply(r.flip, flip);
    if (i+dir_i >= 0 && j+dir_j >= 0 && i+dir_i < model.board_size && j+dir_j < model.board_size) {
        var p = model.cell_array[i+dir_i][j+dir_j];
        if (model_is_opposite(model, p)) { // 敵色
            r.flip.push([i+dir_i, j+dir_j]);
            var r2 = model_check_direction(model, i+dir_i, j+dir_j, dir_i, dir_j, r.flip); // その先も見る
            if (r2.playable) { // 自色で挟めた
                r.playable = r2.playable;
                r.flip = r2.flip;
            } else {
                r.flip = [];
            }
        } else if (model_is_same(model, p)) { // 自色
            if (r.flip.length > 0) {
                r.playable = true;
            }
        }
    }
    return r;
}
function model_is_opposite(model, p) {
    if (p == 0) {
        return false; // empty
    } else if (model.next_move == p.color) {
        return false; // same color
    }
    return true; // opposite color
}
function model_is_same(model, p) {
    if (p == 0) {
        return false; // empty
    } else if (model.next_move == p.color) {
        return true; // same color
    }
    return false; // opposite color
}