
const $friction = $('.friction');

// class Friction {
//   constructor(el, range = 100, friction = 1) {
//     this.el = $(el);
//     this.range = range;
//     this.friction = friction;
//   }
// }
// const friction = new Friction($friction, 100, 1);

class Scroll {
  constructor(el) {
    this.el = $(el);
    this.subscribers = [];
    this.speed = 0;
    this.scrollPos = this.el.scrollTop();
  }
  update() {
    const prevSpeed = this.speed;
    this.updatePos();
    this.updateSpeed();
    this.subscribers.forEach((fn) => {
      fn(this);
    });
  }
  updatePos() {
    this.lastScrollPos = this.scrollPos;
    this.scrollPos = this.el.scrollTop();
  }
  updateSpeed() {
    this.speed = this.scrollPos - this.lastScrollPos;
  }
  subscribe(fn) {
    this.subscribers.push(fn);
  }
}

class Friction {
  constructor(el, range = 30, friction = 1, scroll) {
    this.el = $(el);
    this.range = range;
    this.friction = friction;
    this.y = 0;
    this.target = 0;
    this.gap = 0;
    this.returnTween = new TWEEN.Tween(this)
    .to({ y : 0 }, 1000)
    .easing(TWEEN.Easing.Quadratic.Out)
    .onUpdate(function() {
      el.css('transform', `translateY(${this.y}px)`)
    });

    this.pullTween = new TWEEN.Tween(this)
    .onUpdate(function() {
      el.css('transform', `translateY(${this.y}px)`)
    })
    .onComplete(() => {
      this.returnTween.start();
    });
    this.move = _.throttle(this.move, 100);
  }
  move(speed) {
    if (speed === 0) { return; }
    const direction = speed > 0 ? 1 : -1;
    const modifiedSpeed = Math.min(Math.abs(speed) / (this.friction), this.range);

    const percentage = modifiedSpeed / this.range;

    console.log((percentage * this.range) * direction);
    this.returnTween.stop();
    this.pullTween
    .to({ y: (percentage * this.range) * direction }, 100)
    .start();
  }
}

const WindowScroll = new Scroll(window);
const blackBox = new Friction($('.friction'), 30, 0.5);
WindowScroll.subscribe((scroll) => {
  blackBox.move(scroll.speed);
});
$(window).scroll((e) => {

})

const paint = (time) => {
  requestAnimationFrame(paint)

  WindowScroll.update();
  TWEEN.update();
};

requestAnimationFrame(paint)
