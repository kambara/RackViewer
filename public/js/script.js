$(function() {
    initSlider( new Rack() );

    $('#colorbox').click(function() {
        $.colorbox.close();
    });
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
function Rack() {
    this.boxes = {}; // 箱ID別のPhoto
    this.times = {}; // 時間別のPhoto
    this.timesArray = []; // ソートされた時間
    this.boxCount = 0; // 箱の個数

    this.classify(_rack.filenames);
}

Rack.prototype.classify = function(filenames) {
    var self = this;
    $.each(filenames, function(index, filename) {
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
        var box = this.boxes[boxId];
        if (boxLatestPhoto[boxId]) {
            box.showPhoto( boxLatestPhoto[boxId] );
        } else {
            box.hidePhoto();
        }
    }
};

//
// 箱
//
function Box(id) {
    this.id = id;
    this.photos = [];
    this.boxImg = $('#box' + id);
    this.currentPhoto = null;

    var self = this;
    $('#box' + id).click(function() {
        self.showPerspective();
    });
}

Box.prototype.showPerspective = function() {
    if (!this.currentPhoto) return;
    var self = this;
    $.colorbox({
        href: self.currentPhoto.getPerspectiveFilePath(),
        maxWidth: '80%',
        maxHeight: '80%',
        close: '',
        title: self.currentPhoto.getTimeString()
    });
    
};

Box.prototype.addPhoto = function(photo) {
    this.photos.push(photo);
};

Box.prototype.showPhoto = function(photo) {
    this.currentPhoto = photo;
    this.boxImg.attr('src', photo.getBoxFilePath());
};

Box.prototype.hidePhoto = function() {
    this.currentPhoto = null;
    this.boxImg.attr('src', 'images/gray.png');
};

//
// 写真
//
function Photo(boxId, time) {
    this.boxId = boxId;
    this.time = time;
}

Photo.prototype.getBoxFilePath = function() {
    return _rack.image_dir
        + '/'
        + [this.boxId, '1', this.time].join('_')
        + '.jpg';
};

Photo.prototype.getPerspectiveFilePath = function() {
    return 'images/perspective.jpg'; // とりあえず

    return _rack.image_dir
        + '/'
        + [this.boxId, '2', this.time].join('_')
        + '.jpg';
};

Photo.prototype.getTimeString = function() {
    var date = new Date();
    date.setTime(this.time * 1000);
    return [ date.getFullYear(),
             date.getMonth(),
             date.getDate()
           ].join('/')
        + ' '
        + [ date.getHours(),
            date.getMinutes(),
            date.getSeconds()
          ].join(':');
};