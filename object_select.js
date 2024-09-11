class Card {
	constructor(options = {}) {
		// options = {color: {background: hex, text: hex}, text: str}
		// 创建 card 元素
		this.cardElement = document.createElement("div");
		this.cardElement.className = "card";
		this.setColor(options.color);

		// 创建 multi-button 容器
		this.buttons = {};
		const multiButton = document.createElement("div");
		multiButton.className = "multi-button";

		// 添加 multi-button 到 card
		this.cardElement.appendChild(multiButton);
		// 存储 element
		this.buttons.multiButtonElement = multiButton;

		// 创建按钮
		const button1 = document.createElement("button");
		button1.className = "fas fa-palette";
		multiButton.appendChild(button1);
		this.buttons.palette_button = button1;

		const button2 = document.createElement("button");
		button2.className = "fas fa-times";
		multiButton.appendChild(button2);
		this.buttons.delete_button = button2;

		// 创建 card-text 元素
		this.textElement = document.createElement("p");
		this.textElement.className = "card-text";
		this.setText(options.text);
		this.cardElement.appendChild(this.textElement);
	}

	// 将 card 添加到指定的容器
	addTo(container) {
		container.appendChild(this.cardElement);
	}

	setColor(color = {}) {
		this.cardElement.style.setProperty("--background", color.background || "#3c3b3d");
		this.cardElement.style.setProperty("--text", color.textColor || "white");
	}

	setText(text) {
		this.textElement.textContent = text || "object";
	}

	// 绑定按钮的回调函数
	setButtonFunc(funcs = {}) {
		if (funcs.palette) {
			this.buttons.palette_button.addEventListener("click", funcs.palette);
		}
		if (funcs.delete) {
			this.buttons.delete_button.addEventListener("click", funcs.delete);
		}
	}

	destroy() {
		this.cardElement.remove();
	}
}


import Pickr from "@simonwep/pickr"

// 定义卡片
const render_container = document.getElementById('render_container');
const card1 = new Card({
	color: {
		background: "#42445a",
	},
	text: 'object_1'
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



import 'vanilla-colorful';
import { computePosition, autoPlacement } from '@floating-ui/dom';


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
		this.buttonElement.addEventListener('click', (event) => {
			event.stopPropagation(); // 防止点击冒泡到 document 上的全局监听
			this.setPickerPosition();
			this.pickrElement.classList.add('open');
		});

		// 点击其他地方时隐藏 pickrElement
		document.addEventListener('click', (event) => {
			// 检查点击是否发生在 pickrElement 之外
			if (!this.container.contains(event.target) && event.target !== this.buttonElement) {
				this.pickrElement.classList.remove('open');
			}
		});
	}

	// 设定 pickr 相对 button 的位置
	setPickerPosition() {
		const button = this.buttonElement;
		const picker = this.pickrElement;
		// 计算并设置 picker 的位置
		computePosition(button, picker, {
			placement: 'left',
			middleware: [autoPlacement()],
		}).then(({ x, y }) => {
			Object.assign(picker.style, {
				left: `${x}px`,
				top: `${y}px`,
				position: 'absolute',
			});
		});
	}

	// 绑定颜色改变的回调函数
	onColorChanged(func) {
		// func 接受 hex string like "#42445a"
		this.pickrElement.addEventListener('color-changed', (event) => {
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
	text: 'object_2'
});
card2.addTo(render_container);

// 定义调色盘并绑定回调函数
const pickr2 = new Pickr_vanilla({
	el: card2.buttons.palette_button
}).onColorChanged(
	(hex) => {
		card2.setColor({ background: hex });
	}
);

// 绑定删除按钮的回调函数
card2.setButtonFunc({
	delete: () => {
		pickr2.destroy();
		card2.destroy();
	},
});



class SegObjects {
	constructor(options = {}) {}
}

export {
	Card,
	SegObjects
}