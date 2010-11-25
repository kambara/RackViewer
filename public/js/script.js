$(function() {
    initSlider( new Rack(_tana.filenames,
                         _tana.image_dir) );
});

function initSlider(rack) {
    $('#slider').slider({
        animate: true,
        max: rack.getMaxTime(),
        min: rack.getMinTime(),
        slide: function(event, ui) {
            //rack.setTime(ui.value); // 重い
        },
        change: function(event, ui) {
            rack.setTime(ui.value);
        }
    }).slider(
        'value', rack.getMaxTime()
    );
}

//
// 棚
//
function Rack(filenames, image_dir) {
    this.boxes = {}; // 箱ID別のPhoto
    this.times = {}; // 時間別のPhoto
    this.timesArray = []; // ソートされた時間
    this.boxCount = 0; // 箱の個数
    this.image_dir = image_dir;

    this.classify(filenames);
}

Rack.prototype.classify = function(filenames) {
    var self = this;
    $.each(_tana.filenames, function(index, filename) {
        var ary = filename.split('.')[0].split('_');
        if (ary.length == 3 && ary[1] == "1") { // 箱内部
            self.addPhoto(ary[0], parseInt(ary[2]));
        }
    });
    // 時間をソートしておく
    this.timesArray = [];
    for (var time in this.times) {
        this.timesArray.push( parseInt(time) );
    }
    this.timesArray = this.timesArray.sort();
};

Rack.prototype.addPhoto = function(boxId, time) {
    // 箱が無ければ追加
    if (!this.boxes[boxId]) {
        this.boxes[boxId] = new Box(boxId);
        this.boxCount++;
    }
    // 箱に写真を追加
    var photo = new Photo(boxId, time);
    this.boxes[boxId].addPhoto(photo);
    // 時間でインデックスする
    this.times[time] = photo;
};

Rack.prototype.getMinTime = function() {
    return this.timesArray[0];
};

Rack.prototype.getMaxTime = function() {
    return this.timesArray[this.timesArray.length - 1];
};

Rack.prototype.setTime = function(newTime) {
    // 各箱のnewTime以前の最も新しい写真を表示
    var boxLatestPhoto = {};
    var count = 0;
    for (var i = this.timesArray.length-1; i >= 0; i--) {
        var t = this.timesArray[i];
        if (t <= newTime) { // newTime以前のものが対象
            var photo = this.times[t];
            if (!boxLatestPhoto[photo.boxId]) {
                boxLatestPhoto[photo.boxId] = photo;
                count++;
                // 箱が全部そろったら抜ける
                if (count >= this.boxCount) {
                    break;
                }
            }
        }
    }
    // すべての箱を再描画
    for (var boxId in this.boxes) {
        var src = "images/gray.png";
        if (boxLatestPhoto[boxId]) {
            var file = boxLatestPhoto[boxId].getBoxFileName();
            src = this.image_dir + '/' + file;
        }
        $('#box' + boxId).attr("src", src);
    }
}

//
// 箱
//
function Box(id) {
    this.id = id;
    this.photos = [];
}

Box.prototype.addPhoto = function(photo) {
    this.photos.push(photo);
};

//
// 写真
//
function Photo(boxId, time) {
    this.boxId = boxId;
    this.time = time;
}

Photo.prototype.getBoxFileName = function() {
    return [this.boxId,
            '1',
            this.time
           ].join('_') + '.jpg';
};