# Native-Palette-Usage

两个 HTML 原生元素调色盘应用示例
[https://juejin.cn/post/7126351624032747528](https://juejin.cn/post/7126351624032747528)

## 1. pickr

一个完全原生的调色盘：<https://github.com/simonwep/pickr>

```html
<link
 rel="stylesheet"
 href="https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/monolith.min.css" />
<script type="importmap">
 {
  "imports": {
   "@simonwep/pickr": "https://cdn.jsdelivr.net/npm/@simonwep/pickr@1.9.1/+esm"
  }
 }
</script>
```

用于改变卡片的颜色：

```jsx
import Pickr from "@simonwep/pickr";

// 定义卡片
const render_container = document.getElementById("render_container");
const card1 = new Card({
 color: {
  background: "#42445a",
 },
});
card1.addTo(render_container);

// 定义调色盘并绑定回调函数
const pickr1 = Pickr.create({
 el: card1.buttons.palette_button,
 theme: "monolith", // or 'monolith', or 'nano'
 useAsButton: true, // 用 el 作为 button
 default: "#42445a",
 swatches: ["#F44336", "#E91E63", "#9C27B0", "#673AB7"],
 components: {
  // Main component
  hue: true,
  opacity: true,
 },
}).on("change", (color, source, instance) => {
 card1.setColor({ background: color.toHEXA().toString() });
});

// 绑定删除按钮的回调函数
card1.setButtonFunc({
 delete: () => {
  pickr1.destroyAndRemove();
  card1.destroy();
 },
});
```

## 2. vanilla-colorful

一个重构[react-colorful](https://github.com/omgovich/react-colorful)的、可类似原生元素使用的调色盘：<https://github.com/web-padawan/vanilla-colorful>

```html
<script type="importmap">
 {
  "imports": {
   "vanilla-colorful": "https://cdn.jsdelivr.net/npm/vanilla-colorful@0.7.2/+esm"，
   "@floating-ui/dom": "https://cdn.jsdelivr.net/npm/@floating-ui/dom@1.6.10/+esm"
  }
 }
</script>
```

借助定位元素的库 [https://floating-ui.com/](https://floating-ui.com/)，用于改变卡片的颜色：

```jsx
import "vanilla-colorful";
import { computePosition, autoPlacement } from "@floating-ui/dom";

class Pickr_vanilla {
 constructor(options = {}) {
  // options = {el: domElement}
  this.container = document.createElement("div");
  // 创建 pickr 元素
  this.pickrElement = document.createElement("hex-color-picker");
  // this.pickrElement.style.display = 'none';  // 初始状态为隐藏
  this.container.appendChild(this.pickrElement);
  document.body.appendChild(this.container);

  // 将 pickr 绑定到 el
  this.bundleButton(options.el);
 }

 // 将 pickr 绑定到 buttonElement
 bundleButton(buttonElement) {
  this.buttonElement = buttonElement;

  // 点击 buttonElement 显示/隐藏 pickrElement
  this.buttonElement.addEventListener("click", (event) => {
   event.stopPropagation(); // 防止点击冒泡到 document 上的全局监听
   this.setPickerPosition();
   this.pickrElement.classList.add("open");
  });

  // 点击其他地方时隐藏 pickrElement
  document.addEventListener("click", (event) => {
   // 检查点击是否发生在 pickrElement 之外
   if (!this.container.contains(event.target) && event.target !== this.buttonElement) {
    this.pickrElement.classList.remove("open");
   }
  });
 }

 // 设定 pickr 相对 button 的位置
 setPickerPosition() {
  const button = this.buttonElement;
  const picker = this.pickrElement;
  // 计算并设置 picker 的位置
  computePosition(button, picker, {
   placement: "left",
   middleware: [autoPlacement()],
  }).then(({ x, y }) => {
   Object.assign(picker.style, {
    left: `${x}px`,
    top: `${y}px`,
    position: "absolute",
   });
  });
 }

 // 绑定颜色改变的回调函数
 onColorChanged(func) {
  // func 接受 hex string like "#42445a"
  this.pickrElement.addEventListener("color-changed", (event) => {
   // get updated color value
   const newColor = event.detail.value; // r,g,b,a
   func(newColor); // 执行回调函数
  });
  return this;
 }

 // 销毁 pickrElement
 destroy() {
  this.pickrElement.remove();
 }
}

// 定义卡片2
const card2 = new Card({
 color: {
  background: "#42445a",
 },
 text: "object_2",
});
card2.addTo(render_container);

// 定义调色盘并绑定回调函数
const pickr2 = new Pickr_vanilla({
 el: card2.buttons.palette_button,
}).onColorChanged((hex) => {
 card2.setColor({ background: hex });
});
```
