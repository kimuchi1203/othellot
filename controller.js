function controller_add_listener(view) {
    for(var i=0;i<view.cell_array.length;++i) {
        for(var j=0;j<view.cell_array[i].length;++j) {
            var td = view.cell_array[i][j];
            td.onclick = (function(i, j){
                return function(){
                    model_play(view.model, i, j);
                    view_render_board(view);
                };
            })(i, j);
        }
    }
}
function controller_init(model, view) {
    var controller = {};
    controller_add_listener(view);
    return controller;
}