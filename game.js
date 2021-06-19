const kvs = document.getElementById("bird");
const konteks = kvs.getContext("2d");
let frames = 0;
const sprite = new Image();
sprite.src = "img/sprite.png";

function Background() {
    this.srcX = 0;
    this.srcY = 0;
    this.x = 0;
    this.y = kvs.height - 226;
    this.w = 275;
    this.h = 226;
    this.dx = 1;
    this.draw = function () {
        konteks.drawImage(sprite, this.srcX, this.srcY, this.w, this.h, this.x, this.y, this.w, this.h);
        konteks.drawImage(sprite, this.srcX, this.srcY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
        konteks.drawImage(sprite, this.srcX, this.srcY, this.w, this.h, this.x + 2 * this.w, this.y, this.w, this.h);
    };
    this.update = function () {
        if (statusgame.current == statusgame.berjalan) {
            this.x = (this.x - this.dx) % this.w;
        }
    };
}
function Foreground() {
    this.srcX = 276;
    this.srcY = 0;
    this.x = 0;
    this.y = kvs.height - 112;
    this.w = 224;
    this.h = 112;
    this.dx = 2;
    this.draw = function () {
        konteks.drawImage(sprite, this.srcX, this.srcY, this.w, this.h, this.x, this.y, this.w, this.h);
        konteks.drawImage(sprite, this.srcX, this.srcY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    };
    this.update = function () {
        if (statusgame.current == statusgame.berjalan) {
            this.x = (this.x - this.dx) % (this.w / 2);
        }
    };
}

function Burung() {
    this.radius = 12;
    this.speed = 0;
    this.gravitasi = 0.25;
    this.frame = 0;
    this.animation = [
        { srcX: 276, srcY: 112 },
        { srcX: 276, srcY: 139 },
        { srcX: 276, srcY: 164 },
        { srcX: 276, srcY: 139 },
    ];
    this.x = 50;
    this.y = 150;
    this.w = 34;
    this.h = 26;

    this.draw = function () {
        let anim = this.animation[this.frame];
        konteks.drawImage(sprite, anim.srcX, anim.srcY, this.w, this.h, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
    };

    this.update = function () {
        //periode adalah variable untuk kecepatan animasi terbang burung dalam hitungan frame
        //semakin tinggi periode, maka semakin lambat animasi terbang
        this.periode;

        //kondisi burung ketika game masih bersiap
        if (statusgame.current == statusgame.Ready) {
            this.periode = 15;
            this.y = 150; //untuk reset posisi setelah game over
        }
        //kondisi burung ketika game sedang berjalan
        else if (statusgame.current == statusgame.berjalan) {
            this.periode = 4;
            this.speed += this.gravitasi;
            this.y += this.speed;
            if (this.y + this.h / 2 >= kvs.height - fg.h) {
                this.y = kvs.height - fg.h - this.h / 2;
                this.speed = 0;
                if (statusgame.current == statusgame.berjalan) {
                    statusgame.current = statusgame.GameOver;
                    mati.play();
                }
            }
        }
        //mengganti array animation pada burung, untuk animasi terbang burung
        if (statusgame.current == statusgame.Ready || statusgame.current == statusgame.berjalan) {
            this.frame += frames % this.periode == 0 ? 1 : 0;
            this.frame = this.frame % this.animation.length;
        } else {
            this.frame = 1;
        }
    };

    this.flap = function () {
        if (this.y >= 0 + this.h) {
            this.jump = 4.6;
            this.speed = -this.jump;
        } else {
            this.jump = 0;
            this.speed = -this.jump;
        }
    };
    this.speedReset = function () {
        this.speed = 0;
    };
}

function Pipe() {
    this.bottom = {
        srcX: 502,
        srcY: 0,
    };
    this.top = {
        srcX: 553,
        srcY: 0,
    };
    this.w = 53;
    this.h = 400;
    this.gap = 85;
    this.position = [];
    this.maxYposisi = -175;
    this.update = function () {
        let p;
        if (statusgame.current !== statusgame.berjalan) return;
        if (frames % 100 == 0 && statusgame.current == statusgame.berjalan) {
            this.dx = 2;
            this.position.push({
                x: kvs.width,
                y: this.maxYposisi * (Math.random() + 1),
            });
        }
        for (let i = 0; i < this.position.length; i++) {
            p = this.position[i];
            let bottomPipeY = p.y + this.gap + this.h;

            // mengecek jika burung mengenai pipe, maka game Over

            //mengecek pipa atas
            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y - bird.radius < p.y + this.h) {
                statusgame.current = statusgame.GameOver;
                mati.play();
            }

            //mengecek pipa bawah
            if (bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipeY && bird.y - bird.radius < bottomPipeY + this.h) {
                statusgame.current = statusgame.GameOver;
                mati.play();
            }
            //animasi move pipa ke kiri
            p.x -= this.dx;

            // menghapus pipa yang sudah lewat pada Array
            if (p.x + this.w <= 0) {
                this.position.shift();
                skore.value += 1;
                skore.best = Math.max(skore.value, skore.best);
                point.play();
            }
        }
    };

    this.draw = function () {
        let p;
        for (let i = 0; i < this.position.length; i++) {
            p = this.position[i];
            konteks.drawImage(sprite, this.top.srcX, this.top.srcY, this.w, this.h, p.x, p.y, this.w, this.h);
            konteks.drawImage(sprite, this.bottom.srcX, this.bottom.srcY, this.w, this.h, p.x, p.y + this.h + this.gap, this.w, this.h);
        }
    };
    this.reset = function () {
        this.position = [];
    };
}

function PapanAwal() {
    this.srcX = 0;
    this.srcY = 228;
    this.x = kvs.width / 2 - 173 / 2;
    this.y = 80;
    this.w = 173;
    this.h = 152;
    this.draw = function () {
        if (statusgame.current == statusgame.Ready) {
            konteks.drawImage(sprite, this.srcX, this.srcY, this.w, this.h, this.x, this.y, this.w, this.h);
            backsound.play();
        }
    };
}
function PapanGameOver() {
    this.srcX = 175;
    this.srcY = 228;
    this.x = kvs.width / 2 - 225 / 2;
    this.y = 90;
    this.w = 225;
    this.h = 202;
    this.draw = function () {
        if (statusgame.current == statusgame.GameOver) {
            konteks.drawImage(sprite, this.srcX, this.srcY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    };
}

function StatusGame() {
    this.Ready = 0;
    this.berjalan = 1;
    this.GameOver = 2;
    this.current = this.Ready;
}
function score() {
    this.best = parseInt(localStorage.getItem("best")) || 0;
    this.value = 0;
    this.draw = function () {
        konteks.fillStyle = "#FFF";
        konteks.strokeStyle = "#000";

        //mencetak score di saat game berjalan
        if (statusgame.current == statusgame.berjalan) {
            konteks.lineWidth = 2;
            konteks.font = "35px Teko";
            konteks.fillText(this.value, kvs.width / 2, 50);
            konteks.strokeText(this.value, kvs.width / 2, 50);
        }
        // mencetak score disaat game over
        else if (statusgame.current == statusgame.GameOver) {
            konteks.font = "25px Teko";
            // score value
            konteks.fillText(this.value, 225, 186);
            konteks.strokeText(this.value, 225, 186);

            // best score
            konteks.fillText(this.best, 225, 228);
            konteks.strokeText(this.best, 225, 228);
        }
    };

    this.reset = function () {
        this.value = 0;
    };
}

// Load Audio file
const point = new Audio();
point.src = "audio/sfx_point.wav";
const mati = new Audio();
mati.src = "audio/sfx_die.wav";

const backsound = new Audio();
backsound.src = "audio/background.mp3";

// inisiasi
const skore = new score();
const bird = new Burung();
const bg = new Background();
const pipe = new Pipe();
const pMulai = new PapanAwal();
const statusgame = new StatusGame();
const fg = new Foreground();
const pGameOver = new PapanGameOver();

const startBtn = {
    x: 120,
    y: 263,
    w: 83,
    h: 29,
};
// Game Play's Control
kvs.addEventListener("click", function (evt) {
    if (statusgame.current == statusgame.Ready) {
        statusgame.current = statusgame.berjalan;
    } else if (statusgame.current == statusgame.berjalan) {
        bird.flap();
    } else if (statusgame.current == statusgame.GameOver) {
        let rect = kvs.getBoundingClientRect();
        let clickX = evt.clientX - rect.left;
        let clickY = evt.clientY - rect.top;

        if (clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w && clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h) {
            bird.speedReset();
            pipe.reset();
            skore.reset();
            statusgame.current = statusgame.Ready;
        }
    }
});
function draw() {
    konteks.fillStyle = "#70c5ce";
    konteks.fillRect(0, 0, kvs.width, kvs.height);
    bg.draw();
    pipe.draw();
    fg.draw();
    bird.draw();
    pMulai.draw();
    pGameOver.draw();
    skore.draw();
}
function loop() {
    update();
    draw();
    frames++;
    requestAnimationFrame(loop);
    requestAnimationFrame(loop);
}
loop();
function update() {
    bird.update();
    fg.update();
    bg.update();
    pipe.update();
}
