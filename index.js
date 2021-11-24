const $ = document.querySelector.bind(document);
const $$ = document.querySelector.bind(document);
/*
1.render songs
2. scrollTop
3. play/pause/seek
*/
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const cd = $(".cd");
const playBtn = $(".btn-toggle-play");
const player = $(".player");
const progress = $(".progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Bước qua nhau",
      singer: "Vũ",
      path: "./music/song8.mp3",
      image: "./img/img8.jpg",
    },
    {
      name: "Lạ lùng",
      singer: "Vũ",
      path: "./music/song9.mp3",
      image: "./img/img9.jpg",
    },
    {
      name: "Đông kiếm em",
      singer: "Vũ",
      path: "./music/song10.mp3",
      image: "./img/img10.jpg",
    },
    {
      name: "Kẻ theo đuổi ánh sáng",
      singer: "Huy Vạc",
      path: "./music/song4.mp3",
      image: "./img/img4.jpg",
    },
    {
      name: "Câu hứa chưa vẹn toàn",
      singer: "Phát Huy T4",
      path: "./music/song2.mp3",
      image: "./img/img2.jpg",
    },
    {
      name: "Cưa là đổ",
      singer: "Phát Hồ X2X",
      path: "./music/song3.mp3",
      image: "./img/img3.jpg",
    },
    {
      name: "Yêu là cưới",
      singer: "Phát Hồ X2X",
      path: "./music/song5.mp3",
      image: "./img/img5.jpg",
    },
    {
      name: "Thay Lòng",
      singer: "Nal x TVK",
      path: "./music/song6.mp3",
      image: "./img/img6.jpg",
    },
    {
      name: "Em của quá khứ",
      singer: "Huy Nam",
      path: "./music/song7.mp3",
      image: "./img/img7.jpg",
    },
  ],
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
         <div class="song ${
           index === this.currentIndex ? "active" : ""
         }" data-index="${index}" >
            <div class="thumb" style=" background-image: url('${
              song.image
            }')"></div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
        `;
    });
    $(".playlist").innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const cdWidth = cd.offsetWidth;
    const _this = this;
    //xử lý cd quay/dừng
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    cdThumbAnimate.pause();
    //xử lý phóng to thu nhỏ cd
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newcdWidth = cdWidth - scrollTop;
      cd.style.width = newcdWidth > 0 ? newcdWidth + "px" : 0;
      cd.style.opacity = newcdWidth / cdWidth;
    };
    //xử lý khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    //xử lý khi repeat bài hát
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };
    //xử lý khi next bài
    nextBtn.onclick = function () {
      if (_this.isRepeat) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    //xử lý khi prev bài
    prevBtn.onclick = function () {
      _this.prevSong();
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };
    //xử lý khi random
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      randomBtn.classList.toggle("active", _this.isRandom);
    };
    //khi song được play
    audio.onplay = function () {
      app.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };
    // khi song được pause
    audio.onpause = function () {
      app.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };
    //khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.value = progressPercent;
      }
    };
    //khi bài hát kết thúc
    audio.onended = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else if (_this.isRepeat) {
        audio.play();
      } else {
        _this.nextSong();
      }

      audio.play();
    };
    //xử lý khi tua xong
    progress.onchange = function (e) {
      const seektime = audio.duration * e.target.value * 0.01;
      audio.currentTime = seektime;
    };
    //lắng nghe click
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      //xử lý khi click vào song
      if (songNode) {
        _this.currentIndex = Number(songNode.dataset.index);
        _this.loadCurrentSong();
        _this.render();
        audio.play();
      }
    };
  },
  scrollToActiveSong: function () {
    setTimeout(function () {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: this.currentIndex < 3 ? "end" : "nearest",
      });
    }, 200);
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  start: function () {
    //định nghĩa các thuộc tính cho object
    this.defineProperties();
    //Lắng nghe xử lý sự kiện
    this.handleEvents();
    //tải thông tin bài hát đầu tiên khi truy cập UI
    this.loadCurrentSong();
    //render playlist
    this.render();
  },
};
app.start();
