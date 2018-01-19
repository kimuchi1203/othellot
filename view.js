function view_render_board(view) {
    for(var i=0;i<view.cell_array.length;++i) {
        for(var j=0;j<view.cell_array[i].length;++j) {
            var td = view.cell_array[i][j];
            if (view.model.cell_array[i][j]==1) {
                td.className = "black";
            } else if (view.model.cell_array[i][j]==2) {
                td.className = "white";
            }
        }
    }
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
    view_render_board(view);
    return view;
}