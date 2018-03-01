function view_render_board(view) {
    for(var i=0;i<view.cell_array.length;++i) {
        for(var j=0;j<view.cell_array[i].length;++j) {
            var td = view.cell_array[i][j];
            if (view.model.cell_array[i][j]==0) {
                td.className = "empty"
            } else if (view.model.cell_array[i][j].color==1) {
                td.className = "black";
                td.innerHTML = view.model.cell_array[i][j].name;
            } else if (view.model.cell_array[i][j].color==2) {
                td.className = "white";
                td.innerHTML = view.model.cell_array[i][j].name;
            }
        }
    }
}
function view_render_info(view) {
    var num_pieces = new Array(view.model.player_num);
    for(var i=0;i<view.model.player_num;++i) {
        num_pieces[i] = 0;
    }
    for(var i=0;i<view.cell_array.length;++i) {
        for(var j=0;j<view.cell_array[i].length;++j) {
            if (view.model.cell_array[i][j]==0) {
            } else {
                var color = view.model.cell_array[i][j].color;
                num_pieces[color-1] += 1;
            }
        }
    }
    var div = document.getElementById('info');
    div.innerHTML = "<p>black:"+num_pieces[0]+" white:"+num_pieces[1]+"</p>";
}
function view_render(view) {
    view_render_board(view);
    view_render_info(view);
}
function view_init(model) {
    var view = {};
    view.model = model;
    view.board = document.getElementById("board");
    view.cell_array = new Array(view.model.cell_array.length);
    view.board.innerHTML = "";
    for(var i=0;i<view.model.cell_array.length;++i) {
        view.cell_array[i] = new Array(view.model.cell_array[i].length);
        var tr = document.createElement("tr");
        for(var j=0;j<view.model.cell_array[i].length;++j) {
            var td = document.createElement("td");
            view.cell_array[i][j] = td;
            tr.appendChild(td);
        }
        view.board.appendChild(tr);
    }
    view_render(view);
    return view;
}