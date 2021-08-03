var firebase;
var config = {
    databaseURL: "https://chatroom-67d02-default-rtdb.firebaseio.com/"
};
firebase.initializeApp(config);
var database = firebase.database().ref().limitToLast(50);

var databaseMs = new Date().getTime()
database.on('value', function(snapshot) {
    var getData = snapshot.val()
    var txt = ''
    for (let i in getData) {
        let msg = getData[i].msg.split('<div>').join('').split('</div>').join('').replace('<br>', '');

        txt += `<li class="${getData[i].id == 'id' + databaseMs?'self':''}" >
                        <div class="chat_member">
                            <span class="chat_time" id="chat_time">${getData[i].time}</span>
                            <span class="chat_name" id="chat_name">${getData[i].name}</span>
                        </div>
                        <div class="chat_speak" id="chat_speak" style="color:${getData[i].color}">${msg}</div>
                    </li>`
    }

    $('#chat_list ul').html(txt)

    var chat_sc = document.getElementById('chat_sc');
    chat_sc.scrollTop = chat_sc.scrollHeight;
});

var chat_ipt = false
$('#chat_msg').focus(function() {
    chat_ipt = true
}).blur(function() {
    chat_ipt = false
})

$(document).keydown(function(e) {
    if (e.keyCode == 13 && chat_ipt) {
        write();
    }
});

// 加入icon圖片
$('#chat_iconList li').click(function() {
    let getIndex = $('#chat_iconList li').index(this);
    $('#chat_msg').append(`<img src="images/i_chat_${getIndex+1}.png" class="chat_icon">`);
    $('#chat_msg').focus();
    showTake()
})

$('#chat_msg').focus(function() {
    $(document).keydown(function(e) {
        let state = $('#chat_msg').html().length;
        showTake()
    });
})

function showTake() {
    let state = $('#chat_msg').html().length;
    if (state >= 1) {
        $('.chat_take').css('display', 'none');
    } else {
        $('.chat_take').css('display', 'flex');
    }
}

function write() {
    var date = new Date();
    var h = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    if (h < 10) {
        h = '0' + h;
    }
    if (m < 10) {
        m = '0' + m;
    }
    var now = h + ':' + m
    var getMsg = $('#chat_msg').html().split('<div>').join('').split('</div>').join('').replace('<br>', '')
    var postData = {
        name: '匿名',
        msg: getMsg,
        time: now,
        id: 'id' + databaseMs,
        color: $('#chat_color').val()
    };

    firebase.database().ref().push(postData);
    $('#chat_msg').attr('contenteditable', "false")
    $('#chat_msg').html('')
    $('#chat_msg').attr('contenteditable', "true");
    setTimeout(function() {
        $('#chat_msg').focus();
    }, 100)
}