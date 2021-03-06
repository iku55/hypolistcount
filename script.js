var hypolist;
var counts = [];

var targetDate = [new Date()];
targetDate[0].setHours(targetDate[0].getHours() - 42);
targetDate[0].setMinutes(targetDate[0].getMinutes() - 30);
targetDate[1] = (('0000'+targetDate[0].getFullYear()).slice(-4))+'/'+(('00'+(targetDate[0].getMonth()+1)).slice(-2))+'/'+(('00'+targetDate[0].getDate()).slice(-2));
targetDate[2] = (('0000'+targetDate[0].getFullYear()).slice(-4))+(('00'+(targetDate[0].getMonth()+1)).slice(-2))+(('00'+targetDate[0].getDate()).slice(-2));
document.getElementById('date').innerText = targetDate[1];

var prevDate = () => {
    targetDate[0].setDate(targetDate[0].getDate() - 1);
    targetDate[1] = (('0000'+targetDate[0].getFullYear()).slice(-4))+'/'+(('00'+(targetDate[0].getMonth()+1)).slice(-2))+'/'+(('00'+targetDate[0].getDate()).slice(-2));
    targetDate[2] = (('0000'+targetDate[0].getFullYear()).slice(-4))+(('00'+(targetDate[0].getMonth()+1)).slice(-2))+(('00'+targetDate[0].getDate()).slice(-2));
    count(targetDate[2]);
    document.getElementById('date').innerText = targetDate[1];
}
var nextDate = () => {
    targetDate[0].setDate(targetDate[0].getDate() + 1);
    targetDate[1] = (('0000'+targetDate[0].getFullYear()).slice(-4))+'/'+(('00'+(targetDate[0].getMonth()+1)).slice(-2))+'/'+(('00'+targetDate[0].getDate()).slice(-2));
    targetDate[2] = (('0000'+targetDate[0].getFullYear()).slice(-4))+(('00'+(targetDate[0].getMonth()+1)).slice(-2))+(('00'+targetDate[0].getDate()).slice(-2));
    count(targetDate[2]);
    document.getElementById('date').innerText = targetDate[1];
}

// Load JSON
const count = (date) => {
    $('#nextDate').prop('disabled', true);
    $('#prevDate').prop('disabled', true);
    counts = [];
    $('tbody').empty();

    console.log("Loading hypolist...");

    xhr = new XMLHttpRequest;
    xhr.onload = function(){
        if (xhr.status == 200) {
            var res = xhr.responseText;
            if (res.length>0) {
                hypolist = JSON.parse(res);
                console.log("Loaded "+hypolist.length+" hypocenters");
                if ($('#anim').prop('checked')) {
                    counting();
                } else {
                    countingFast();
                }
            }
        } else if (xhr.status == 404) {
            alert('????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????')
            $('#nextDate').prop('disabled', false);
            $('#prevDate').prop('disabled', false);
        }
    };
    xhr.onerror = function(){
        alert("??????????????????????????????????????????????????????????????????");
        $('#nextDate').prop('disabled', false);
        $('#prevDate').prop('disabled', false);
    }
    xhr.open('get', "https://raw.githubusercontent.com/iku55/hypolistjson/main/data/"+date+".json", true);
    xhr.send('');
};

/**
 * ?????????????????????????????????
 * @param {string} magnitude ?????????????????????
 * @returns ????????????????????????????????????????????????????????????????????????true??????????????????
 */
var magCheck = (magnitude) => {
    switch ($('#magfilter option:selected').val()) {
        case 'ALL':
            return false;
        case 'M0.5+':
            if (parseFloat(magnitude) < 0.5) {return true;} else {return false;}
        case 'M1+':
            if (parseFloat(magnitude) < 1) {return true;} else {return false;}
        case 'M1.5+':
            if (parseFloat(magnitude) < 1.5) {return true;} else {return false;}
        case 'M2+':
            if (parseFloat(magnitude) < 2) {return true;} else {return false;}
        case 'M2.5+':
            if (parseFloat(magnitude) < 2.5) {return true;} else {return false;}
    }
}

var counting = async () => {
    var table = document.querySelector('table');
    var total = 0;
    for (const hypo of hypolist) {
        if (magCheck(hypo.magnitude)) {
            console.log('??????????????????????????????????????????????????????????????????????????????????????????: ??????:'+hypo.name+'/??????:'+hypo.time+'/?????????????????????:'+hypo.magnitude+'/??????:'+hypo.depth)
            continue;
        }
        if (counts.find(d=> d.name == hypo.name) == undefined) counts.push({name: hypo.name, count: 0});
        counts.find(d=> d.name == hypo.name).count++;
        total++;
        $('#total').text('???'+total+'???');

        counts.sort((a, b) => {
            if (a.count > b.count) return -1;
            if (a.count < b.count) return 1;
            return 0;
        });
        $(table).empty();
        for (const count of counts) {
            var newRow = table.insertRow();
            newRow.insertCell().appendChild(document.createTextNode(count.name));
            newRow.insertCell().appendChild(document.createTextNode(count.count));
            if (count.name.includes('???') || count.name.includes('???') || count.name.includes('???') || count.name.includes('???')) {
                newRow.style.color = '#3296fa';
            } else {
                newRow.style.color = '#4be14b';
            }
        }
        await _sleep(5);
    }
    console.log(counts);

    $('#nextDate').prop('disabled', false);
    $('#prevDate').prop('disabled', false);
}

const countingFast = () => {
    var table = document.querySelector('table');
    var total = 0;
    for (const hypo of hypolist) {
        if (magCheck(hypo.magnitude)) {
            console.log('??????????????????????????????????????????????????????????????????????????????????????????: ??????:'+hypo.name+'/??????:'+hypo.time+'/?????????????????????:'+hypo.magnitude+'/??????:'+hypo.depth)
            continue;
        }
        if (counts.find(d=> d.name == hypo.name) == undefined) counts.push({name: hypo.name, count: 0});
        counts.find(d=> d.name == hypo.name).count++;
        total++;
    }
    counts.sort((a, b) => {
        if (a.count > b.count) return -1;
        if (a.count < b.count) return 1;
        return 0;
    });
    for (const count of counts) {
        var newRow = table.insertRow();
        newRow.insertCell().appendChild(document.createTextNode(count.name));
        newRow.insertCell().appendChild(document.createTextNode(count.count));
        if (count.name.includes('???') || count.name.includes('???') || count.name.includes('???') || count.name.includes('???')) {
            newRow.style.color = '#3296fa';
        } else {
            newRow.style.color = '#4be14b';
        }
    }
    $('#total').text('???'+total+'???');

    $('#nextDate').prop('disabled', false);
    $('#prevDate').prop('disabled', false);
}

count(targetDate[2]);

// https://hirooooo-lab.com/development/javascript-sleep/
const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
