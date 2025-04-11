/*  */


//const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTKQbAIEg3GdlydA-MgWGfXpmNH8v_zodODQz03pCLMxCqWgmjT56-BoM8eCdZOFApl_kRN0QFuGRUB/pub?gid=1640920593&single=true&output=csv";
const CSV_URL = "http://192.168.100.160:5500/test.csv";

var proc = [];

Papa.parse(CSV_URL, {
    header: false,
    download: true,
    complete: function (results) {
        console.log(results.data);
        proc = ProcessCSV(results.data);
        console.log(proc);
        CreateButtons(proc);
    },
    error: function (err) {
        console.error("Parsing error:", err);
    }
});

function ProcessCSV(arr) {
    const sliceRow = (arr, index) => {
        let row = arr[index];
        return row.slice(2, 32);//.toSpliced(16, 5);
    }

    const START_ROW = 22;
    const END_ROW = 33;

    let final = [];

    for (let i = START_ROW; i < END_ROW; i++) {
        const curRow = sliceRow(arr, i);
        final.push(curRow);
    }

    return final;
}

var PANZOOM_ELEMENT = document.querySelector(".parent");
var SEATS_PARENT = document.querySelector(".seat-selection");

var SelectedSeats = [];

var VIPCount = 0;
var RegularCount = 0;

function GetName(col, row) {
    const Alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return `${Alphabet[col]}${row + 1}`;
}

function SelectSeat(row, col) {
    let name = GetName(col, row);
    let vip = IsVIP(row, col);
    if (SelectedSeats.includes(name)) {
        SelectedSeats.splice(SelectedSeats.indexOf(name), 1);
        if (vip) {
            VIPCount--;
        } else {
            RegularCount--;
        }
        UpdateStatusTexts();
        return false;
    }
    SelectedSeats.push(name);
    if (vip) {
        VIPCount++;
    } else {
        RegularCount++;
    }
    UpdateStatusTexts();

    return true;
}

const PRICE_VIP = 30000;
const PRICE_NORMAL = 25000;
const Text_SelectedSeats = $I("selected-seats");
const Text_TotalPrice = $I("total-price");

function UpdateStatusTexts() {
    Text_SelectedSeats.innerText = SelectedSeats.join(", ");
    Text_TotalPrice.innerText = "Rp"+(VIPCount * PRICE_VIP + RegularCount * PRICE_NORMAL);
}

function CreateButtons(data) {
    /*
    const SKIP_COL_BEGIN = 13;
    const SKIP_COL_END = 15;
    const SKIP_ROW_BEGIN = 16;
    const SKIP_ROW_END = 18;
    const BEGINNING_GAP_COL = 14;
    const GAP_AMOUNT = 5;
    */

    const BEGIN_SKIP_COL = 12;
    const END_SKIP_COL = 17 + 5;
    const BEGIN_SKIP_ROW = 8;
    const END_SKIP_ROW = 11;

    const BEGIN_GAP_COL = 15;
    const END_GAP_COL = 19;


    const MakeButton = (text, tooltip) => {
        let btn = document.createElement("button");
        btn.className = "seat-btn";
        btn.innerText = text;
        btn.title = tooltip || text;
        return btn;
    }

    let Blank = document.createElement("button");
    Blank.className = "blank-seat";
    Blank.innerText = "XX";
    Blank.disabled = true;

    let Debug = document.createElement("button");
    Debug.className = "debug-seat";
    Debug.innerText = "YY";
    Debug.disabled = true;

    for (let c = 0; c < 12; c++) {
        let offset = 0;
        for (let r = 0; r < 35; r++) {
            if (r >= BEGIN_GAP_COL && r <= END_GAP_COL) {
                offset++;
                SEATS_PARENT.appendChild(Blank.cloneNode());
                continue;
            }

            if (r >= BEGIN_SKIP_COL && r <= END_SKIP_COL && c >= BEGIN_SKIP_ROW && c <= END_SKIP_ROW) {
                SEATS_PARENT.appendChild(Blank.cloneNode());
                continue;
            }

            let btn = MakeButton(GetName(c, r - offset));
            if (c == 0) {
                //Sponsor
                btn.classList.add("sponsor-seat");
                btn.disabled = true;
            } else if (IsVIP(c, r)) {
                //VIP
                btn.classList.add("vip-seat");
            }

            switch (data[c][r]) {
                case "PAID":
                    btn.classList.add("taken-seat");
                    btn.disabled = true;
                    break;
                case "$":
                    btn.classList.add("pending-seat");
                    btn.disabled = true;
                    break;
                case "X":
                    //btn.classList.add("overdue-seat");
                    break;
                default:
                    break;

            }

            if (SelectedSeats.includes(GetName(c, r - offset))) {
                btn.classList.add("selected-seat");
            }

            btn.onclick = (e) => {
                let result = SelectSeat(r - offset, c);
                if (result) {
                    btn.classList.add("selected-seat");
                } else {
                    btn.classList.remove("selected-seat");
                }
            }
            SEATS_PARENT.appendChild(btn);
        }
    }
}

function IsVIP(c, r) {
    return (c >= 1 && c <= 7 && r >= 6 && r <= 28)
}

/*
const panzoom = Panzoom(PANZOOM_ELEMENT, {
    maxScale: 3,
    minScale: .5,
    startScale: .6,
    contain: "inside",
    pinchAndPan: true,
});

PANZOOM_ELEMENT.parentElement.addEventListener('wheel', panzoom.zoomWithWheel)
*/

panzoom(PANZOOM_ELEMENT, {
    maxZoom: 2,
    minZoom: 0.5,
    initialZoom: 0.6,
    bounds: true,
    boundsPadding: .1,
    zoomDoubleClickSpeed: 1,
});

/*
Indexed (from 0)

A = 22
L = 33

1 = C(2)
15 = Q(16)

16 = W(22)
30 = AK(31)

Blank seats
13-15
16-18
I-L
*/