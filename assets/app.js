! function () {
	"use strict";
	/**
	 * @preserve FastClick: polyfill to remove click delays on browsers with touch UIs.
	 *
	 * @codingstandard ftlabs-jsv2
	 * @copyright The Financial Times Limited [All Rights Reserved]
	 * @license MIT License (see LICENSE.txt)
	 */
	function e(t, i) {
		function s(e, t) {
			return function () {
				return e.apply(t, arguments)
			}
		}
		var r;
		if (i = i || {}, this.trackingClick = !1, this.trackingClickStart = 0, this.targetElement = null, this.touchStartX = 0, this.touchStartY = 0, this.lastTouchIdentifier = 0, this.touchBoundary = i.touchBoundary || 10, this.layer = t, this.tapDelay = i.tapDelay || 200, this.tapTimeout = i.tapTimeout || 700, !e.notNeeded(t)) {
			for (var a = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], o = this, l = 0, u = a.length; u > l; l++) o[a[l]] = s(o[a[l]], o);
			n && (t.addEventListener("mouseover", this.onMouse, !0), t.addEventListener("mousedown", this.onMouse, !0), t.addEventListener("mouseup", this.onMouse, !0)), t.addEventListener("click", this.onClick, !0), t.addEventListener("touchstart", this.onTouchStart, !1), t.addEventListener("touchmove", this.onTouchMove, !1), t.addEventListener("touchend", this.onTouchEnd, !1), t.addEventListener("touchcancel", this.onTouchCancel, !1), Event.prototype.stopImmediatePropagation || (t.removeEventListener = function (e, n, i) {
				var s = Node.prototype.removeEventListener;
				"click" === e ? s.call(t, e, n.hijacked || n, i) : s.call(t, e, n, i)
			}, t.addEventListener = function (e, n, i) {
				var s = Node.prototype.addEventListener;
				"click" === e ? s.call(t, e, n.hijacked || (n.hijacked = function (e) {
					e.propagationStopped || n(e)
				}), i) : s.call(t, e, n, i)
			}), "function" == typeof t.onclick && (r = t.onclick, t.addEventListener("click", function (e) {
				r(e)
			}, !1), t.onclick = null)
		}
	}
	var t = navigator.userAgent.indexOf("Windows Phone") >= 0,
		n = navigator.userAgent.indexOf("Android") > 0 && !t,
		i = /iP(ad|hone|od)/.test(navigator.userAgent) && !t,
		s = i && /OS 4_\d(_\d)?/.test(navigator.userAgent),
		r = i && /OS [6-7]_\d/.test(navigator.userAgent),
		a = navigator.userAgent.indexOf("BB10") > 0;
	e.prototype.needsClick = function (e) {
		switch (e.nodeName.toLowerCase()) {
			case "button":
			case "select":
			case "textarea":
				if (e.disabled) { return !0; }
				break;
			case "input":
				if (i && "file" === e.type || e.disabled) { return !0; }
				break;
			case "label":
			case "iframe":
			case "video":
				return !0;
		}
		return /\bneedsclick\b/.test(e.className);
	}, e.prototype.needsFocus = function (e) {
		switch (e.nodeName.toLowerCase()) {
			case "textarea":
				return !0;
			case "select":
				return !n;
			case "input":
				switch (e.type) {
					case "button":
					case "checkbox":
					case "file":
					case "image":
					case "radio":
					case "submit":
						return !1
				}
				return !e.disabled && !e.readOnly;
			default:
				return /\bneedsfocus\b/.test(e.className)
		}
	}, e.prototype.sendClick = function (e, t) {
		var n, i;
		document.activeElement && document.activeElement !== e && document.activeElement.blur(), i = t.changedTouches[0], n = document.createEvent("MouseEvents"), n.initMouseEvent(this.determineEventType(e), !0, !0, window, 1, i.screenX, i.screenY, i.clientX, i.clientY, !1, !1, !1, !1, 0, null), n.forwardedTouchEvent = !0, e.dispatchEvent(n)
	}, e.prototype.determineEventType = function (e) {
		return n && "select" === e.tagName.toLowerCase() ? "mousedown" : "click"
	}, e.prototype.focus = function (e) {
		var t;
		i && e.setSelectionRange && 0 !== e.type.indexOf("date") && "time" !== e.type && "month" !== e.type ? (t = e.value.length, e.setSelectionRange(t, t)) : e.focus()
	}, e.prototype.updateScrollParent = function (e) {
		var t, n;
		if (t = e.fastClickScrollParent, !t || !t.contains(e)) {
			n = e;
			do {
				if (n.scrollHeight > n.offsetHeight) {
					t = n, e.fastClickScrollParent = n;
					break
				}
				n = n.parentElement
			} while (n)
		}
		t && (t.fastClickLastScrollTop = t.scrollTop)
	}, e.prototype.getTargetElementFromEventTarget = function (e) {
		return e.nodeType === Node.TEXT_NODE ? e.parentNode : e
	}, e.prototype.onTouchStart = function (e) {
		var t, n, r;
		if (e.targetTouches.length > 1) return !0;
		if (t = this.getTargetElementFromEventTarget(e.target), n = e.targetTouches[0], i) {
			if (r = window.getSelection(), r.rangeCount && !r.isCollapsed) return !0;
			if (!s) {
				if (n.identifier && n.identifier === this.lastTouchIdentifier) return e.preventDefault(), !1;
				this.lastTouchIdentifier = n.identifier, this.updateScrollParent(t)
			}
		}
		return this.trackingClick = !0, this.trackingClickStart = e.timeStamp, this.targetElement = t, this.touchStartX = n.pageX, this.touchStartY = n.pageY, e.timeStamp - this.lastClickTime < this.tapDelay && e.preventDefault(), !0
	}, e.prototype.touchHasMoved = function (e) {
		var t = e.changedTouches[0],
			n = this.touchBoundary;
		return Math.abs(t.pageX - this.touchStartX) > n || Math.abs(t.pageY - this.touchStartY) > n ? !0 : !1
	}, e.prototype.onTouchMove = function (e) {
		return this.trackingClick ? ((this.targetElement !== this.getTargetElementFromEventTarget(e.target) || this.touchHasMoved(e)) && (this.trackingClick = !1, this.targetElement = null), !0) : !0
	}, e.prototype.findControl = function (e) {
		return void 0 !== e.control ? e.control : e.htmlFor ? document.getElementById(e.htmlFor) : e.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
	}, e.prototype.onTouchEnd = function (e) {
		var t, a, o, l, u, c = this.targetElement;
		if (!this.trackingClick) return !0;
		if (e.timeStamp - this.lastClickTime < this.tapDelay) return this.cancelNextClick = !0, !0;
		if (e.timeStamp - this.trackingClickStart > this.tapTimeout) return !0;
		if (this.cancelNextClick = !1, this.lastClickTime = e.timeStamp, a = this.trackingClickStart, this.trackingClick = !1, this.trackingClickStart = 0, r && (u = e.changedTouches[0], c = document.elementFromPoint(u.pageX - window.pageXOffset, u.pageY - window.pageYOffset) || c, c.fastClickScrollParent = this.targetElement.fastClickScrollParent), o = c.tagName.toLowerCase(), "label" === o) {
			if (t = this.findControl(c)) {
				if (this.focus(c), n) return !1;
				c = t
			}
		} else if (this.needsFocus(c)) return e.timeStamp - a > 100 || i && window.top !== window && "input" === o ? (this.targetElement = null, !1) : (this.focus(c), this.sendClick(c, e), i && "select" === o || (this.targetElement = null, e.preventDefault()), !1);
		return i && !s && (l = c.fastClickScrollParent, l && l.fastClickLastScrollTop !== l.scrollTop) ? !0 : (this.needsClick(c) || (e.preventDefault(), this.sendClick(c, e)), !1)
	}, e.prototype.onTouchCancel = function () {
		this.trackingClick = !1, this.targetElement = null
	}, e.prototype.onMouse = function (e) {
		return this.targetElement ? e.forwardedTouchEvent ? !0 : e.cancelable && (!this.needsClick(this.targetElement) || this.cancelNextClick) ? (e.stopImmediatePropagation ? e.stopImmediatePropagation() : e.propagationStopped = !0, e.stopPropagation(), e.preventDefault(), !1) : !0 : !0
	}, e.prototype.onClick = function (e) {
		var t;
		return this.trackingClick ? (this.targetElement = null, this.trackingClick = !1, !0) : "submit" === e.target.type && 0 === e.detail ? !0 : (t = this.onMouse(e), t || (this.targetElement = null), t)
	}, e.prototype.destroy = function () {
		var e = this.layer;
		n && (e.removeEventListener("mouseover", this.onMouse, !0), e.removeEventListener("mousedown", this.onMouse, !0), e.removeEventListener("mouseup", this.onMouse, !0)), e.removeEventListener("click", this.onClick, !0), e.removeEventListener("touchstart", this.onTouchStart, !1), e.removeEventListener("touchmove", this.onTouchMove, !1), e.removeEventListener("touchend", this.onTouchEnd, !1), e.removeEventListener("touchcancel", this.onTouchCancel, !1)
	}, e.notNeeded = function (e) {
		var t, i, s, r;
		if ("undefined" == typeof window.ontouchstart) return !0;
		if (i = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) {
			if (!n) return !0;
			if (t = document.querySelector("meta[name=viewport]")) {
				if (-1 !== t.content.indexOf("user-scalable=no")) return !0;
				if (i > 31 && document.documentElement.scrollWidth <= window.outerWidth) return !0
			}
		}
		if (a && (s = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/), s[1] >= 10 && s[2] >= 3 && (t = document.querySelector("meta[name=viewport]")))) {
			if (-1 !== t.content.indexOf("user-scalable=no")) return !0;
			if (document.documentElement.scrollWidth <= window.outerWidth) return !0
		}
		return "none" === e.style.msTouchAction || "manipulation" === e.style.touchAction ? !0 : (r = +(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1], r >= 27 && (t = document.querySelector("meta[name=viewport]"), t && (-1 !== t.content.indexOf("user-scalable=no") || document.documentElement.scrollWidth <= window.outerWidth)) ? !0 : "none" === e.style.touchAction || "manipulation" === e.style.touchAction ? !0 : !1)
	}, e.attach = function (t, n) {
		return new e(t, n)
	}, "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function () {
		return e
	}) : "undefined" != typeof module && module.exports ? (module.exports = e.attach, module.exports.FastClick = e) : window.FastClick = e
}(), /*! jQuery v2.1.4 | (c) 2005, 2015 jQuery Foundation, Inc. | jquery.org/license */ ! function (e, t) {
	"object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function (e) {
		if (!e.document) throw new Error("jQuery requires a window with a document");
		return t(e)
	} : t(e)
}("undefined" != typeof window ? window : this, function (e, t) {
	function n(e) {
		var t = "length" in e && e.length,
			n = Z.type(e);
		return "function" === n || Z.isWindow(e) ? !1 : 1 === e.nodeType && t ? !0 : "array" === n || 0 === t || "number" == typeof t && t > 0 && t - 1 in e
	}

	function i(e, t, n) {
		if (Z.isFunction(t)) return Z.grep(e, function (e, i) {
			return !!t.call(e, i, e) !== n
		});
		if (t.nodeType) return Z.grep(e, function (e) {
			return e === t !== n
		});
		if ("string" == typeof t) {
			if (oe.test(t)) return Z.filter(t, e, n);
			t = Z.filter(t, e)
		}
		return Z.grep(e, function (e) {
			return z.call(t, e) >= 0 !== n
		})
	}

	function s(e, t) {
		for (;
			(e = e[t]) && 1 !== e.nodeType;);
		return e
	}

	function r(e) {
		var t = fe[e] = {};
		return Z.each(e.match(pe) || [], function (e, n) {
			t[n] = !0
		}), t
	}

	function a() {
		Q.removeEventListener("DOMContentLoaded", a, !1), e.removeEventListener("load", a, !1), Z.ready()
	}

	function o() {
		Object.defineProperty(this.cache = {}, 0, {
			get: function () {
				return {}
			}
		}), this.expando = Z.expando + o.uid++
	}

	function l(e, t, n) {
		var i;
		if (void 0 === n && 1 === e.nodeType)
			if (i = "data-" + t.replace(_e, "-$1").toLowerCase(), n = e.getAttribute(i), "string" == typeof n) {
				try {
					n = "true" === n ? !0 : "false" === n ? !1 : "null" === n ? null : +n + "" === n ? +n : be.test(n) ? Z.parseJSON(n) : n
				} catch (s) {}
				ye.set(e, t, n)
			} else n = void 0;
		return n
	}

	function u() {
		return !0
	}

	function c() {
		return !1
	}

	function h() {
		try {
			return Q.activeElement
		} catch (e) {}
	}

	function d(e, t) {
		return Z.nodeName(e, "table") && Z.nodeName(11 !== t.nodeType ? t : t.firstChild, "tr") ? e.getElementsByTagName("tbody")[0] || e.appendChild(e.ownerDocument.createElement("tbody")) : e
	}

	function p(e) {
		return e.type = (null !== e.getAttribute("type")) + "/" + e.type, e
	}

	function f(e) {
		var t = Oe.exec(e.type);
		return t ? e.type = t[1] : e.removeAttribute("type"), e
	}

	function m(e, t) {
		for (var n = 0, i = e.length; i > n; n++) ve.set(e[n], "globalEval", !t || ve.get(t[n], "globalEval"))
	}

	function g(e, t) {
		var n, i, s, r, a, o, l, u;
		if (1 === t.nodeType) {
			if (ve.hasData(e) && (r = ve.access(e), a = ve.set(t, r), u = r.events)) {
				delete a.handle, a.events = {};
				for (s in u)
					for (n = 0, i = u[s].length; i > n; n++) Z.event.add(t, s, u[s][n])
			}
			ye.hasData(e) && (o = ye.access(e), l = Z.extend({}, o), ye.set(t, l))
		}
	}

	function v(e, t) {
		var n = e.getElementsByTagName ? e.getElementsByTagName(t || "*") : e.querySelectorAll ? e.querySelectorAll(t || "*") : [];
		return void 0 === t || t && Z.nodeName(e, t) ? Z.merge([e], n) : n
	}

	function y(e, t) {
		var n = t.nodeName.toLowerCase();
		"input" === n && ke.test(e.type) ? t.checked = e.checked : ("input" === n || "textarea" === n) && (t.defaultValue = e.defaultValue)
	}

	function b(t, n) {
		var i, s = Z(n.createElement(t)).appendTo(n.body),
			r = e.getDefaultComputedStyle && (i = e.getDefaultComputedStyle(s[0])) ? i.display : Z.css(s[0], "display");
		return s.detach(), r
	}

	function _(e) {
		var t = Q,
			n = Be[e];
		return n || (n = b(e, t), "none" !== n && n || (He = (He || Z("<iframe frameborder='0' width='0' height='0'/>")).appendTo(t.documentElement), t = He[0].contentDocument, t.write(), t.close(), n = b(e, t), He.detach()), Be[e] = n), n
	}

	function w(e, t, n) {
		var i, s, r, a, o = e.style;
		return n = n || We(e), n && (a = n.getPropertyValue(t) || n[t]), n && ("" !== a || Z.contains(e.ownerDocument, e) || (a = Z.style(e, t)), Ve.test(a) && Ie.test(t) && (i = o.width, s = o.minWidth, r = o.maxWidth, o.minWidth = o.maxWidth = o.width = a, a = n.width, o.width = i, o.minWidth = s, o.maxWidth = r)), void 0 !== a ? a + "" : a
	}

	function j(e, t) {
		return {
			get: function () {
				return e() ? void delete this.get : (this.get = t).apply(this, arguments)
			}
		}
	}

	function x(e, t) {
		if (t in e) return t;
		for (var n = t[0].toUpperCase() + t.slice(1), i = t, s = Je.length; s--;)
			if (t = Je[s] + n, t in e) return t;
		return i
	}

	function k(e, t, n) {
		var i = $e.exec(t);
		return i ? Math.max(0, i[1] - (n || 0)) + (i[2] || "px") : t
	}

	function P(e, t, n, i, s) {
		for (var r = n === (i ? "border" : "content") ? 4 : "width" === t ? 1 : 0, a = 0; 4 > r; r += 2) "margin" === n && (a += Z.css(e, n + je[r], !0, s)), i ? ("content" === n && (a -= Z.css(e, "padding" + je[r], !0, s)), "margin" !== n && (a -= Z.css(e, "border" + je[r] + "Width", !0, s))) : (a += Z.css(e, "padding" + je[r], !0, s), "padding" !== n && (a += Z.css(e, "border" + je[r] + "Width", !0, s)));
		return a
	}

	function S(e, t, n) {
		var i = !0,
			s = "width" === t ? e.offsetWidth : e.offsetHeight,
			r = We(e),
			a = "border-box" === Z.css(e, "boxSizing", !1, r);
		if (0 >= s || null == s) {
			if (s = w(e, t, r), (0 > s || null == s) && (s = e.style[t]), Ve.test(s)) return s;
			i = a && (G.boxSizingReliable() || s === e.style[t]), s = parseFloat(s) || 0
		}
		return s + P(e, t, n || (a ? "border" : "content"), i, r) + "px"
	}

	function C(e, t) {
		for (var n, i, s, r = [], a = 0, o = e.length; o > a; a++) i = e[a], i.style && (r[a] = ve.get(i, "olddisplay"), n = i.style.display, t ? (r[a] || "none" !== n || (i.style.display = ""), "" === i.style.display && xe(i) && (r[a] = ve.access(i, "olddisplay", _(i.nodeName)))) : (s = xe(i), "none" === n && s || ve.set(i, "olddisplay", s ? n : Z.css(i, "display"))));
		for (a = 0; o > a; a++) i = e[a], i.style && (t && "none" !== i.style.display && "" !== i.style.display || (i.style.display = t ? r[a] || "" : "none"));
		return e
	}

	function E(e, t, n, i, s) {
		return new E.prototype.init(e, t, n, i, s)
	}

	function T() {
		return setTimeout(function () {
			Ge = void 0
		}), Ge = Z.now()
	}

	function q(e, t) {
		var n, i = 0,
			s = {
				height: e
			};
		for (t = t ? 1 : 0; 4 > i; i += 2 - t) n = je[i], s["margin" + n] = s["padding" + n] = e;
		return t && (s.opacity = s.width = e), s
	}

	function N(e, t, n) {
		for (var i, s = (nt[t] || []).concat(nt["*"]), r = 0, a = s.length; a > r; r++)
			if (i = s[r].call(n, t, e)) return i
	}

	function F(e, t, n) {
		var i, s, r, a, o, l, u, c, h = this,
			d = {},
			p = e.style,
			f = e.nodeType && xe(e),
			m = ve.get(e, "fxshow");
		n.queue || (o = Z._queueHooks(e, "fx"), null == o.unqueued && (o.unqueued = 0, l = o.empty.fire, o.empty.fire = function () {
			o.unqueued || l()
		}), o.unqueued++, h.always(function () {
			h.always(function () {
				o.unqueued--, Z.queue(e, "fx").length || o.empty.fire()
			})
		})), 1 === e.nodeType && ("height" in t || "width" in t) && (n.overflow = [p.overflow, p.overflowX, p.overflowY], u = Z.css(e, "display"), c = "none" === u ? ve.get(e, "olddisplay") || _(e.nodeName) : u, "inline" === c && "none" === Z.css(e, "float") && (p.display = "inline-block")), n.overflow && (p.overflow = "hidden", h.always(function () {
			p.overflow = n.overflow[0], p.overflowX = n.overflow[1], p.overflowY = n.overflow[2]
		}));
		for (i in t)
			if (s = t[i], Ke.exec(s)) {
				if (delete t[i], r = r || "toggle" === s, s === (f ? "hide" : "show")) {
					if ("show" !== s || !m || void 0 === m[i]) continue;
					f = !0
				}
				d[i] = m && m[i] || Z.style(e, i)
			} else u = void 0;
		if (Z.isEmptyObject(d)) "inline" === ("none" === u ? _(e.nodeName) : u) && (p.display = u);
		else {
			m ? "hidden" in m && (f = m.hidden) : m = ve.access(e, "fxshow", {}), r && (m.hidden = !f), f ? Z(e).show() : h.done(function () {
				Z(e).hide()
			}), h.done(function () {
				var t;
				ve.remove(e, "fxshow");
				for (t in d) Z.style(e, t, d[t])
			});
			for (i in d) a = N(f ? m[i] : 0, i, h), i in m || (m[i] = a.start, f && (a.end = a.start, a.start = "width" === i || "height" === i ? 1 : 0))
		}
	}

	function L(e, t) {
		var n, i, s, r, a;
		for (n in e)
			if (i = Z.camelCase(n), s = t[i], r = e[n], Z.isArray(r) && (s = r[1], r = e[n] = r[0]), n !== i && (e[i] = r, delete e[n]), a = Z.cssHooks[i], a && "expand" in a) {
				r = a.expand(r), delete e[i];
				for (n in r) n in e || (e[n] = r[n], t[n] = s)
			} else t[i] = s
	}

	function A(e, t, n) {
		var i, s, r = 0,
			a = tt.length,
			o = Z.Deferred().always(function () {
				delete l.elem
			}),
			l = function () {
				if (s) return !1;
				for (var t = Ge || T(), n = Math.max(0, u.startTime + u.duration - t), i = n / u.duration || 0, r = 1 - i, a = 0, l = u.tweens.length; l > a; a++) u.tweens[a].run(r);
				return o.notifyWith(e, [u, r, n]), 1 > r && l ? n : (o.resolveWith(e, [u]), !1)
			},
			u = o.promise({
				elem: e,
				props: Z.extend({}, t),
				opts: Z.extend(!0, {
					specialEasing: {}
				}, n),
				originalProperties: t,
				originalOptions: n,
				startTime: Ge || T(),
				duration: n.duration,
				tweens: [],
				createTween: function (t, n) {
					var i = Z.Tween(e, u.opts, t, n, u.opts.specialEasing[t] || u.opts.easing);
					return u.tweens.push(i), i
				},
				stop: function (t) {
					var n = 0,
						i = t ? u.tweens.length : 0;
					if (s) return this;
					for (s = !0; i > n; n++) u.tweens[n].run(1);
					return t ? o.resolveWith(e, [u, t]) : o.rejectWith(e, [u, t]), this
				}
			}),
			c = u.props;
		for (L(c, u.opts.specialEasing); a > r; r++)
			if (i = tt[r].call(u, e, c, u.opts)) return i;
		return Z.map(c, N, u), Z.isFunction(u.opts.start) && u.opts.start.call(e, u), Z.fx.timer(Z.extend(l, {
			elem: e,
			anim: u,
			queue: u.opts.queue
		})), u.progress(u.opts.progress).done(u.opts.done, u.opts.complete).fail(u.opts.fail).always(u.opts.always)
	}

	function R(e) {
		return function (t, n) {
			"string" != typeof t && (n = t, t = "*");
			var i, s = 0,
				r = t.toLowerCase().match(pe) || [];
			if (Z.isFunction(n))
				for (; i = r[s++];) "+" === i[0] ? (i = i.slice(1) || "*", (e[i] = e[i] || []).unshift(n)) : (e[i] = e[i] || []).push(n)
		}
	}

	function O(e, t, n, i) {
		function s(o) {
			var l;
			return r[o] = !0, Z.each(e[o] || [], function (e, o) {
				var u = o(t, n, i);
				return "string" != typeof u || a || r[u] ? a ? !(l = u) : void 0 : (t.dataTypes.unshift(u), s(u), !1)
			}), l
		}
		var r = {},
			a = e === bt;
		return s(t.dataTypes[0]) || !r["*"] && s("*")
	}

	function M(e, t) {
		var n, i, s = Z.ajaxSettings.flatOptions || {};
		for (n in t) void 0 !== t[n] && ((s[n] ? e : i || (i = {}))[n] = t[n]);
		return i && Z.extend(!0, e, i), e
	}

	function D(e, t, n) {
		for (var i, s, r, a, o = e.contents, l = e.dataTypes;
			"*" === l[0];) l.shift(), void 0 === i && (i = e.mimeType || t.getResponseHeader("Content-Type"));
		if (i)
			for (s in o)
				if (o[s] && o[s].test(i)) {
					l.unshift(s);
					break
				}
		if (l[0] in n) r = l[0];
		else {
			for (s in n) {
				if (!l[0] || e.converters[s + " " + l[0]]) {
					r = s;
					break
				}
				a || (a = s)
			}
			r = r || a
		}
		return r ? (r !== l[0] && l.unshift(r), n[r]) : void 0
	}

	function H(e, t, n, i) {
		var s, r, a, o, l, u = {},
			c = e.dataTypes.slice();
		if (c[1])
			for (a in e.converters) u[a.toLowerCase()] = e.converters[a];
		for (r = c.shift(); r;)
			if (e.responseFields[r] && (n[e.responseFields[r]] = t), !l && i && e.dataFilter && (t = e.dataFilter(t, e.dataType)), l = r, r = c.shift())
				if ("*" === r) r = l;
				else if ("*" !== l && l !== r) {
			if (a = u[l + " " + r] || u["* " + r], !a)
				for (s in u)
					if (o = s.split(" "), o[1] === r && (a = u[l + " " + o[0]] || u["* " + o[0]])) {
						a === !0 ? a = u[s] : u[s] !== !0 && (r = o[0], c.unshift(o[1]));
						break
					}
			if (a !== !0)
				if (a && e["throws"]) t = a(t);
				else try {
					t = a(t)
				} catch (h) {
					return {
						state: "parsererror",
						error: a ? h : "No conversion from " + l + " to " + r
					}
				}
		}
		return {
			state: "success",
			data: t
		}
	}

	function B(e, t, n, i) {
		var s;
		if (Z.isArray(t)) Z.each(t, function (t, s) {
			n || kt.test(e) ? i(e, s) : B(e + "[" + ("object" == typeof s ? t : "") + "]", s, n, i)
		});
		else if (n || "object" !== Z.type(t)) i(e, t);
		else
			for (s in t) B(e + "[" + s + "]", t[s], n, i)
	}

	function I(e) {
		return Z.isWindow(e) ? e : 9 === e.nodeType && e.defaultView
	}
	var V = [],
		W = V.slice,
		U = V.concat,
		$ = V.push,
		z = V.indexOf,
		X = {},
		Y = X.toString,
		J = X.hasOwnProperty,
		G = {},
		Q = e.document,
		K = "2.1.4",
		Z = function (e, t) {
			return new Z.fn.init(e, t)
		},
		ee = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
		te = /^-ms-/,
		ne = /-([\da-z])/gi,
		ie = function (e, t) {
			return t.toUpperCase()
		};
	Z.fn = Z.prototype = {
		jquery: K,
		constructor: Z,
		selector: "",
		length: 0,
		toArray: function () {
			return W.call(this)
		},
		get: function (e) {
			return null != e ? 0 > e ? this[e + this.length] : this[e] : W.call(this)
		},
		pushStack: function (e) {
			var t = Z.merge(this.constructor(), e);
			return t.prevObject = this, t.context = this.context, t
		},
		each: function (e, t) {
			return Z.each(this, e, t)
		},
		map: function (e) {
			return this.pushStack(Z.map(this, function (t, n) {
				return e.call(t, n, t)
			}))
		},
		slice: function () {
			return this.pushStack(W.apply(this, arguments))
		},
		first: function () {
			return this.eq(0)
		},
		last: function () {
			return this.eq(-1)
		},
		eq: function (e) {
			var t = this.length,
				n = +e + (0 > e ? t : 0);
			return this.pushStack(n >= 0 && t > n ? [this[n]] : [])
		},
		end: function () {
			return this.prevObject || this.constructor(null)
		},
		push: $,
		sort: V.sort,
		splice: V.splice
	}, Z.extend = Z.fn.extend = function () {
		var e, t, n, i, s, r, a = arguments[0] || {},
			o = 1,
			l = arguments.length,
			u = !1;
		for ("boolean" == typeof a && (u = a, a = arguments[o] || {}, o++), "object" == typeof a || Z.isFunction(a) || (a = {}), o === l && (a = this, o--); l > o; o++)
			if (null != (e = arguments[o]))
				for (t in e) n = a[t], i = e[t], a !== i && (u && i && (Z.isPlainObject(i) || (s = Z.isArray(i))) ? (s ? (s = !1, r = n && Z.isArray(n) ? n : []) : r = n && Z.isPlainObject(n) ? n : {}, a[t] = Z.extend(u, r, i)) : void 0 !== i && (a[t] = i));
		return a
	}, Z.extend({
		expando: "jQuery" + (K + Math.random()).replace(/\D/g, ""),
		isReady: !0,
		error: function (e) {
			throw new Error(e)
		},
		noop: function () {},
		isFunction: function (e) {
			return "function" === Z.type(e)
		},
		isArray: Array.isArray,
		isWindow: function (e) {
			return null != e && e === e.window
		},
		isNumeric: function (e) {
			return !Z.isArray(e) && e - parseFloat(e) + 1 >= 0
		},
		isPlainObject: function (e) {
			return "object" !== Z.type(e) || e.nodeType || Z.isWindow(e) ? !1 : e.constructor && !J.call(e.constructor.prototype, "isPrototypeOf") ? !1 : !0
		},
		isEmptyObject: function (e) {
			var t;
			for (t in e) return !1;
			return !0
		},
		type: function (e) {
			return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? X[Y.call(e)] || "object" : typeof e
		},
		globalEval: function (e) {
			var t, n = eval;
			e = Z.trim(e), e && (1 === e.indexOf("use strict") ? (t = Q.createElement("script"), t.text = e, Q.head.appendChild(t).parentNode.removeChild(t)) : n(e))
		},
		camelCase: function (e) {
			return e.replace(te, "ms-").replace(ne, ie)
		},
		nodeName: function (e, t) {
			return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
		},
		each: function (e, t, i) {
			var s, r = 0,
				a = e.length,
				o = n(e);
			if (i) {
				if (o)
					for (; a > r && (s = t.apply(e[r], i), s !== !1); r++);
				else
					for (r in e)
						if (s = t.apply(e[r], i), s === !1) break
			} else if (o)
				for (; a > r && (s = t.call(e[r], r, e[r]), s !== !1); r++);
			else
				for (r in e)
					if (s = t.call(e[r], r, e[r]), s === !1) break; return e
		},
		trim: function (e) {
			return null == e ? "" : (e + "").replace(ee, "")
		},
		makeArray: function (e, t) {
			var i = t || [];
			return null != e && (n(Object(e)) ? Z.merge(i, "string" == typeof e ? [e] : e) : $.call(i, e)), i
		},
		inArray: function (e, t, n) {
			return null == t ? -1 : z.call(t, e, n)
		},
		merge: function (e, t) {
			for (var n = +t.length, i = 0, s = e.length; n > i; i++) e[s++] = t[i];
			return e.length = s, e
		},
		grep: function (e, t, n) {
			for (var i, s = [], r = 0, a = e.length, o = !n; a > r; r++) i = !t(e[r], r), i !== o && s.push(e[r]);
			return s
		},
		map: function (e, t, i) {
			var s, r = 0,
				a = e.length,
				o = n(e),
				l = [];
			if (o)
				for (; a > r; r++) s = t(e[r], r, i), null != s && l.push(s);
			else
				for (r in e) s = t(e[r], r, i), null != s && l.push(s);
			return U.apply([], l)
		},
		guid: 1,
		proxy: function (e, t) {
			var n, i, s;
			return "string" == typeof t && (n = e[t], t = e, e = n), Z.isFunction(e) ? (i = W.call(arguments, 2), s = function () {
				return e.apply(t || this, i.concat(W.call(arguments)))
			}, s.guid = e.guid = e.guid || Z.guid++, s) : void 0
		},
		now: Date.now,
		support: G
	}), Z.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function (e, t) {
		X["[object " + t + "]"] = t.toLowerCase()
	});
	var se = function (e) {
		function t(e, t, n, i) {
			var s, r, a, o, l, u, h, p, f, m;
			if ((t ? t.ownerDocument || t : B) !== F && N(t), t = t || F, n = n || [], o = t.nodeType, "string" != typeof e || !e || 1 !== o && 9 !== o && 11 !== o) return n;
			if (!i && A) {
				if (11 !== o && (s = ye.exec(e)))
					if (a = s[1]) {
						if (9 === o) {
							if (r = t.getElementById(a), !r || !r.parentNode) return n;
							if (r.id === a) return n.push(r), n
						} else if (t.ownerDocument && (r = t.ownerDocument.getElementById(a)) && D(t, r) && r.id === a) return n.push(r), n
					} else {
						if (s[2]) return K.apply(n, t.getElementsByTagName(e)), n;
						if ((a = s[3]) && w.getElementsByClassName) return K.apply(n, t.getElementsByClassName(a)), n
					}
				if (w.qsa && (!R || !R.test(e))) {
					if (p = h = H, f = t, m = 1 !== o && e, 1 === o && "object" !== t.nodeName.toLowerCase()) {
						for (u = P(e), (h = t.getAttribute("id")) ? p = h.replace(_e, "\\$&") : t.setAttribute("id", p), p = "[id='" + p + "'] ", l = u.length; l--;) u[l] = p + d(u[l]);
						f = be.test(e) && c(t.parentNode) || t, m = u.join(",")
					}
					if (m) try {
						return K.apply(n, f.querySelectorAll(m)), n
					} catch (g) {} finally {
						h || t.removeAttribute("id")
					}
				}
			}
			return C(e.replace(le, "$1"), t, n, i)
		}

		function n() {
			function e(n, i) {
				return t.push(n + " ") > j.cacheLength && delete e[t.shift()], e[n + " "] = i
			}
			var t = [];
			return e
		}

		function i(e) {
			return e[H] = !0, e
		}

		function s(e) {
			var t = F.createElement("div");
			try {
				return !!e(t)
			} catch (n) {
				return !1
			} finally {
				t.parentNode && t.parentNode.removeChild(t), t = null
			}
		}

		function r(e, t) {
			for (var n = e.split("|"), i = e.length; i--;) j.attrHandle[n[i]] = t
		}

		function a(e, t) {
			var n = t && e,
				i = n && 1 === e.nodeType && 1 === t.nodeType && (~t.sourceIndex || X) - (~e.sourceIndex || X);
			if (i) return i;
			if (n)
				for (; n = n.nextSibling;)
					if (n === t) return -1;
			return e ? 1 : -1
		}

		function o(e) {
			return function (t) {
				var n = t.nodeName.toLowerCase();
				return "input" === n && t.type === e
			}
		}

		function l(e) {
			return function (t) {
				var n = t.nodeName.toLowerCase();
				return ("input" === n || "button" === n) && t.type === e
			}
		}

		function u(e) {
			return i(function (t) {
				return t = +t, i(function (n, i) {
					for (var s, r = e([], n.length, t), a = r.length; a--;) n[s = r[a]] && (n[s] = !(i[s] = n[s]))
				})
			})
		}

		function c(e) {
			return e && "undefined" != typeof e.getElementsByTagName && e
		}

		function h() {}

		function d(e) {
			for (var t = 0, n = e.length, i = ""; n > t; t++) i += e[t].value;
			return i
		}

		function p(e, t, n) {
			var i = t.dir,
				s = n && "parentNode" === i,
				r = V++;
			return t.first ? function (t, n, r) {
				for (; t = t[i];)
					if (1 === t.nodeType || s) return e(t, n, r)
			} : function (t, n, a) {
				var o, l, u = [I, r];
				if (a) {
					for (; t = t[i];)
						if ((1 === t.nodeType || s) && e(t, n, a)) return !0
				} else
					for (; t = t[i];)
						if (1 === t.nodeType || s) {
							if (l = t[H] || (t[H] = {}), (o = l[i]) && o[0] === I && o[1] === r) return u[2] = o[2];
							if (l[i] = u, u[2] = e(t, n, a)) return !0
						}
			}
		}

		function f(e) {
			return e.length > 1 ? function (t, n, i) {
				for (var s = e.length; s--;)
					if (!e[s](t, n, i)) return !1;
				return !0
			} : e[0]
		}

		function m(e, n, i) {
			for (var s = 0, r = n.length; r > s; s++) t(e, n[s], i);
			return i
		}

		function g(e, t, n, i, s) {
			for (var r, a = [], o = 0, l = e.length, u = null != t; l > o; o++)(r = e[o]) && (!n || n(r, i, s)) && (a.push(r), u && t.push(o));
			return a
		}

		function v(e, t, n, s, r, a) {
			return s && !s[H] && (s = v(s)), r && !r[H] && (r = v(r, a)), i(function (i, a, o, l) {
				var u, c, h, d = [],
					p = [],
					f = a.length,
					v = i || m(t || "*", o.nodeType ? [o] : o, []),
					y = !e || !i && t ? v : g(v, d, e, o, l),
					b = n ? r || (i ? e : f || s) ? [] : a : y;
				if (n && n(y, b, o, l), s)
					for (u = g(b, p), s(u, [], o, l), c = u.length; c--;)(h = u[c]) && (b[p[c]] = !(y[p[c]] = h));
				if (i) {
					if (r || e) {
						if (r) {
							for (u = [], c = b.length; c--;)(h = b[c]) && u.push(y[c] = h);
							r(null, b = [], u, l)
						}
						for (c = b.length; c--;)(h = b[c]) && (u = r ? ee(i, h) : d[c]) > -1 && (i[u] = !(a[u] = h))
					}
				} else b = g(b === a ? b.splice(f, b.length) : b), r ? r(null, a, b, l) : K.apply(a, b)
			})
		}

		function y(e) {
			for (var t, n, i, s = e.length, r = j.relative[e[0].type], a = r || j.relative[" "], o = r ? 1 : 0, l = p(function (e) {
					return e === t
				}, a, !0), u = p(function (e) {
					return ee(t, e) > -1
				}, a, !0), c = [function (e, n, i) {
					var s = !r && (i || n !== E) || ((t = n).nodeType ? l(e, n, i) : u(e, n, i));
					return t = null, s
				}]; s > o; o++)
				if (n = j.relative[e[o].type]) c = [p(f(c), n)];
				else {
					if (n = j.filter[e[o].type].apply(null, e[o].matches), n[H]) {
						for (i = ++o; s > i && !j.relative[e[i].type]; i++);
						return v(o > 1 && f(c), o > 1 && d(e.slice(0, o - 1).concat({
							value: " " === e[o - 2].type ? "*" : ""
						})).replace(le, "$1"), n, i > o && y(e.slice(o, i)), s > i && y(e = e.slice(i)), s > i && d(e))
					}
					c.push(n)
				}
			return f(c)
		}

		function b(e, n) {
			var s = n.length > 0,
				r = e.length > 0,
				a = function (i, a, o, l, u) {
					var c, h, d, p = 0,
						f = "0",
						m = i && [],
						v = [],
						y = E,
						b = i || r && j.find.TAG("*", u),
						_ = I += null == y ? 1 : Math.random() || .1,
						w = b.length;
					for (u && (E = a !== F && a); f !== w && null != (c = b[f]); f++) {
						if (r && c) {
							for (h = 0; d = e[h++];)
								if (d(c, a, o)) {
									l.push(c);
									break
								}
							u && (I = _)
						}
						s && ((c = !d && c) && p--, i && m.push(c))
					}
					if (p += f, s && f !== p) {
						for (h = 0; d = n[h++];) d(m, v, a, o);
						if (i) {
							if (p > 0)
								for (; f--;) m[f] || v[f] || (v[f] = G.call(l));
							v = g(v)
						}
						K.apply(l, v), u && !i && v.length > 0 && p + n.length > 1 && t.uniqueSort(l)
					}
					return u && (I = _, E = y), m
				};
			return s ? i(a) : a
		}
		var _, w, j, x, k, P, S, C, E, T, q, N, F, L, A, R, O, M, D, H = "sizzle" + 1 * new Date,
			B = e.document,
			I = 0,
			V = 0,
			W = n(),
			U = n(),
			$ = n(),
			z = function (e, t) {
				return e === t && (q = !0), 0
			},
			X = 1 << 31,
			Y = {}.hasOwnProperty,
			J = [],
			G = J.pop,
			Q = J.push,
			K = J.push,
			Z = J.slice,
			ee = function (e, t) {
				for (var n = 0, i = e.length; i > n; n++)
					if (e[n] === t) return n;
				return -1
			},
			te = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
			ne = "[\\x20\\t\\r\\n\\f]",
			ie = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
			se = ie.replace("w", "w#"),
			re = "\\[" + ne + "*(" + ie + ")(?:" + ne + "*([*^$|!~]?=)" + ne + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + se + "))|)" + ne + "*\\]",
			ae = ":(" + ie + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + re + ")*)|.*)\\)|)",
			oe = new RegExp(ne + "+", "g"),
			le = new RegExp("^" + ne + "+|((?:^|[^\\\\])(?:\\\\.)*)" + ne + "+$", "g"),
			ue = new RegExp("^" + ne + "*," + ne + "*"),
			ce = new RegExp("^" + ne + "*([>+~]|" + ne + ")" + ne + "*"),
			he = new RegExp("=" + ne + "*([^\\]'\"]*?)" + ne + "*\\]", "g"),
			de = new RegExp(ae),
			pe = new RegExp("^" + se + "$"),
			fe = {
				ID: new RegExp("^#(" + ie + ")"),
				CLASS: new RegExp("^\\.(" + ie + ")"),
				TAG: new RegExp("^(" + ie.replace("w", "w*") + ")"),
				ATTR: new RegExp("^" + re),
				PSEUDO: new RegExp("^" + ae),
				CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + ne + "*(even|odd|(([+-]|)(\\d*)n|)" + ne + "*(?:([+-]|)" + ne + "*(\\d+)|))" + ne + "*\\)|)", "i"),
				bool: new RegExp("^(?:" + te + ")$", "i"),
				needsContext: new RegExp("^" + ne + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + ne + "*((?:-\\d)?\\d*)" + ne + "*\\)|)(?=[^-]|$)", "i")
			},
			me = /^(?:input|select|textarea|button)$/i,
			ge = /^h\d$/i,
			ve = /^[^{]+\{\s*\[native \w/,
			ye = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
			be = /[+~]/,
			_e = /'|\\/g,
			we = new RegExp("\\\\([\\da-f]{1,6}" + ne + "?|(" + ne + ")|.)", "ig"),
			je = function (e, t, n) {
				var i = "0x" + t - 65536;
				return i !== i || n ? t : 0 > i ? String.fromCharCode(i + 65536) : String.fromCharCode(i >> 10 | 55296, 1023 & i | 56320)
			},
			xe = function () {
				N()
			};
		try {
			K.apply(J = Z.call(B.childNodes), B.childNodes), J[B.childNodes.length].nodeType
		} catch (ke) {
			K = {
				apply: J.length ? function (e, t) {
					Q.apply(e, Z.call(t))
				} : function (e, t) {
					for (var n = e.length, i = 0; e[n++] = t[i++];);
					e.length = n - 1
				}
			}
		}
		w = t.support = {}, k = t.isXML = function (e) {
			var t = e && (e.ownerDocument || e).documentElement;
			return t ? "HTML" !== t.nodeName : !1
		}, N = t.setDocument = function (e) {
			var t, n, i = e ? e.ownerDocument || e : B;
			return i !== F && 9 === i.nodeType && i.documentElement ? (F = i, L = i.documentElement, n = i.defaultView, n && n !== n.top && (n.addEventListener ? n.addEventListener("unload", xe, !1) : n.attachEvent && n.attachEvent("onunload", xe)), A = !k(i), w.attributes = s(function (e) {
				return e.className = "i", !e.getAttribute("className")
			}), w.getElementsByTagName = s(function (e) {
				return e.appendChild(i.createComment("")), !e.getElementsByTagName("*").length
			}), w.getElementsByClassName = ve.test(i.getElementsByClassName), w.getById = s(function (e) {
				return L.appendChild(e).id = H, !i.getElementsByName || !i.getElementsByName(H).length
			}), w.getById ? (j.find.ID = function (e, t) {
				if ("undefined" != typeof t.getElementById && A) {
					var n = t.getElementById(e);
					return n && n.parentNode ? [n] : []
				}
			}, j.filter.ID = function (e) {
				var t = e.replace(we, je);
				return function (e) {
					return e.getAttribute("id") === t
				}
			}) : (delete j.find.ID, j.filter.ID = function (e) {
				var t = e.replace(we, je);
				return function (e) {
					var n = "undefined" != typeof e.getAttributeNode && e.getAttributeNode("id");
					return n && n.value === t
				}
			}), j.find.TAG = w.getElementsByTagName ? function (e, t) {
				return "undefined" != typeof t.getElementsByTagName ? t.getElementsByTagName(e) : w.qsa ? t.querySelectorAll(e) : void 0
			} : function (e, t) {
				var n, i = [],
					s = 0,
					r = t.getElementsByTagName(e);
				if ("*" === e) {
					for (; n = r[s++];) 1 === n.nodeType && i.push(n);
					return i
				}
				return r
			}, j.find.CLASS = w.getElementsByClassName && function (e, t) {
				return A ? t.getElementsByClassName(e) : void 0
			}, O = [], R = [], (w.qsa = ve.test(i.querySelectorAll)) && (s(function (e) {
				L.appendChild(e).innerHTML = "<a id='" + H + "'></a><select id='" + H + "-\f]' msallowcapture=''><option selected=''></option></select>", e.querySelectorAll("[msallowcapture^='']").length && R.push("[*^$]=" + ne + "*(?:''|\"\")"), e.querySelectorAll("[selected]").length || R.push("\\[" + ne + "*(?:value|" + te + ")"), e.querySelectorAll("[id~=" + H + "-]").length || R.push("~="), e.querySelectorAll(":checked").length || R.push(":checked"), e.querySelectorAll("a#" + H + "+*").length || R.push(".#.+[+~]")
			}), s(function (e) {
				var t = i.createElement("input");
				t.setAttribute("type", "hidden"), e.appendChild(t).setAttribute("name", "D"), e.querySelectorAll("[name=d]").length && R.push("name" + ne + "*[*^$|!~]?="), e.querySelectorAll(":enabled").length || R.push(":enabled", ":disabled"), e.querySelectorAll("*,:x"), R.push(",.*:")
			})), (w.matchesSelector = ve.test(M = L.matches || L.webkitMatchesSelector || L.mozMatchesSelector || L.oMatchesSelector || L.msMatchesSelector)) && s(function (e) {
				w.disconnectedMatch = M.call(e, "div"), M.call(e, "[s!='']:x"), O.push("!=", ae)
			}), R = R.length && new RegExp(R.join("|")), O = O.length && new RegExp(O.join("|")), t = ve.test(L.compareDocumentPosition), D = t || ve.test(L.contains) ? function (e, t) {
				var n = 9 === e.nodeType ? e.documentElement : e,
					i = t && t.parentNode;
				return e === i || !(!i || 1 !== i.nodeType || !(n.contains ? n.contains(i) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(i)))
			} : function (e, t) {
				if (t)
					for (; t = t.parentNode;)
						if (t === e) return !0;
				return !1
			}, z = t ? function (e, t) {
				if (e === t) return q = !0, 0;
				var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
				return n ? n : (n = (e.ownerDocument || e) === (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1, 1 & n || !w.sortDetached && t.compareDocumentPosition(e) === n ? e === i || e.ownerDocument === B && D(B, e) ? -1 : t === i || t.ownerDocument === B && D(B, t) ? 1 : T ? ee(T, e) - ee(T, t) : 0 : 4 & n ? -1 : 1)
			} : function (e, t) {
				if (e === t) return q = !0, 0;
				var n, s = 0,
					r = e.parentNode,
					o = t.parentNode,
					l = [e],
					u = [t];
				if (!r || !o) return e === i ? -1 : t === i ? 1 : r ? -1 : o ? 1 : T ? ee(T, e) - ee(T, t) : 0;
				if (r === o) return a(e, t);
				for (n = e; n = n.parentNode;) l.unshift(n);
				for (n = t; n = n.parentNode;) u.unshift(n);
				for (; l[s] === u[s];) s++;
				return s ? a(l[s], u[s]) : l[s] === B ? -1 : u[s] === B ? 1 : 0
			}, i) : F
		}, t.matches = function (e, n) {
			return t(e, null, null, n)
		}, t.matchesSelector = function (e, n) {
			if ((e.ownerDocument || e) !== F && N(e), n = n.replace(he, "='$1']"), !(!w.matchesSelector || !A || O && O.test(n) || R && R.test(n))) try {
				var i = M.call(e, n);
				if (i || w.disconnectedMatch || e.document && 11 !== e.document.nodeType) return i
			} catch (s) {}
			return t(n, F, null, [e]).length > 0
		}, t.contains = function (e, t) {
			return (e.ownerDocument || e) !== F && N(e), D(e, t)
		}, t.attr = function (e, t) {
			(e.ownerDocument || e) !== F && N(e);
			var n = j.attrHandle[t.toLowerCase()],
				i = n && Y.call(j.attrHandle, t.toLowerCase()) ? n(e, t, !A) : void 0;
			return void 0 !== i ? i : w.attributes || !A ? e.getAttribute(t) : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
		}, t.error = function (e) {
			throw new Error("Syntax error, unrecognized expression: " + e)
		}, t.uniqueSort = function (e) {
			var t, n = [],
				i = 0,
				s = 0;
			if (q = !w.detectDuplicates, T = !w.sortStable && e.slice(0), e.sort(z), q) {
				for (; t = e[s++];) t === e[s] && (i = n.push(s));
				for (; i--;) e.splice(n[i], 1)
			}
			return T = null, e
		}, x = t.getText = function (e) {
			var t, n = "",
				i = 0,
				s = e.nodeType;
			if (s) {
				if (1 === s || 9 === s || 11 === s) {
					if ("string" == typeof e.textContent) return e.textContent;
					for (e = e.firstChild; e; e = e.nextSibling) n += x(e)
				} else if (3 === s || 4 === s) return e.nodeValue
			} else
				for (; t = e[i++];) n += x(t);
			return n
		}, j = t.selectors = {
			cacheLength: 50,
			createPseudo: i,
			match: fe,
			attrHandle: {},
			find: {},
			relative: {
				">": {
					dir: "parentNode",
					first: !0
				},
				" ": {
					dir: "parentNode"
				},
				"+": {
					dir: "previousSibling",
					first: !0
				},
				"~": {
					dir: "previousSibling"
				}
			},
			preFilter: {
				ATTR: function (e) {
					return e[1] = e[1].replace(we, je), e[3] = (e[3] || e[4] || e[5] || "").replace(we, je), "~=" === e[2] && (e[3] = " " + e[3] + " "), e.slice(0, 4)
				},
				CHILD: function (e) {
					return e[1] = e[1].toLowerCase(), "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]), e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])), e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]), e
				},
				PSEUDO: function (e) {
					var t, n = !e[6] && e[2];
					return fe.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && de.test(n) && (t = P(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t), e[2] = n.slice(0, t)), e.slice(0, 3))
				}
			},
			filter: {
				TAG: function (e) {
					var t = e.replace(we, je).toLowerCase();
					return "*" === e ? function () {
						return !0
					} : function (e) {
						return e.nodeName && e.nodeName.toLowerCase() === t
					}
				},
				CLASS: function (e) {
					var t = W[e + " "];
					return t || (t = new RegExp("(^|" + ne + ")" + e + "(" + ne + "|$)")) && W(e, function (e) {
						return t.test("string" == typeof e.className && e.className || "undefined" != typeof e.getAttribute && e.getAttribute("class") || "")
					})
				},
				ATTR: function (e, n, i) {
					return function (s) {
						var r = t.attr(s, e);
						return null == r ? "!=" === n : n ? (r += "", "=" === n ? r === i : "!=" === n ? r !== i : "^=" === n ? i && 0 === r.indexOf(i) : "*=" === n ? i && r.indexOf(i) > -1 : "$=" === n ? i && r.slice(-i.length) === i : "~=" === n ? (" " + r.replace(oe, " ") + " ").indexOf(i) > -1 : "|=" === n ? r === i || r.slice(0, i.length + 1) === i + "-" : !1) : !0
					}
				},
				CHILD: function (e, t, n, i, s) {
					var r = "nth" !== e.slice(0, 3),
						a = "last" !== e.slice(-4),
						o = "of-type" === t;
					return 1 === i && 0 === s ? function (e) {
						return !!e.parentNode
					} : function (t, n, l) {
						var u, c, h, d, p, f, m = r !== a ? "nextSibling" : "previousSibling",
							g = t.parentNode,
							v = o && t.nodeName.toLowerCase(),
							y = !l && !o;
						if (g) {
							if (r) {
								for (; m;) {
									for (h = t; h = h[m];)
										if (o ? h.nodeName.toLowerCase() === v : 1 === h.nodeType) return !1;
									f = m = "only" === e && !f && "nextSibling"
								}
								return !0
							}
							if (f = [a ? g.firstChild : g.lastChild], a && y) {
								for (c = g[H] || (g[H] = {}), u = c[e] || [], p = u[0] === I && u[1], d = u[0] === I && u[2], h = p && g.childNodes[p]; h = ++p && h && h[m] || (d = p = 0) || f.pop();)
									if (1 === h.nodeType && ++d && h === t) {
										c[e] = [I, p, d];
										break
									}
							} else if (y && (u = (t[H] || (t[H] = {}))[e]) && u[0] === I) d = u[1];
							else
								for (;
									(h = ++p && h && h[m] || (d = p = 0) || f.pop()) && ((o ? h.nodeName.toLowerCase() !== v : 1 !== h.nodeType) || !++d || (y && ((h[H] || (h[H] = {}))[e] = [I, d]), h !== t)););
							return d -= s, d === i || d % i === 0 && d / i >= 0
						}
					}
				},
				PSEUDO: function (e, n) {
					var s, r = j.pseudos[e] || j.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
					return r[H] ? r(n) : r.length > 1 ? (s = [e, e, "", n], j.setFilters.hasOwnProperty(e.toLowerCase()) ? i(function (e, t) {
						for (var i, s = r(e, n), a = s.length; a--;) i = ee(e, s[a]), e[i] = !(t[i] = s[a])
					}) : function (e) {
						return r(e, 0, s)
					}) : r
				}
			},
			pseudos: {
				not: i(function (e) {
					var t = [],
						n = [],
						s = S(e.replace(le, "$1"));
					return s[H] ? i(function (e, t, n, i) {
						for (var r, a = s(e, null, i, []), o = e.length; o--;)(r = a[o]) && (e[o] = !(t[o] = r))
					}) : function (e, i, r) {
						return t[0] = e, s(t, null, r, n), t[0] = null, !n.pop()
					}
				}),
				has: i(function (e) {
					return function (n) {
						return t(e, n).length > 0
					}
				}),
				contains: i(function (e) {
					return e = e.replace(we, je),
						function (t) {
							return (t.textContent || t.innerText || x(t)).indexOf(e) > -1
						}
				}),
				lang: i(function (e) {
					return pe.test(e || "") || t.error("unsupported lang: " + e), e = e.replace(we, je).toLowerCase(),
						function (t) {
							var n;
							do
								if (n = A ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang")) return n = n.toLowerCase(), n === e || 0 === n.indexOf(e + "-");
							while ((t = t.parentNode) && 1 === t.nodeType);
							return !1
						}
				}),
				target: function (t) {
					var n = e.location && e.location.hash;
					return n && n.slice(1) === t.id
				},
				root: function (e) {
					return e === L
				},
				focus: function (e) {
					return e === F.activeElement && (!F.hasFocus || F.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
				},
				enabled: function (e) {
					return e.disabled === !1
				},
				disabled: function (e) {
					return e.disabled === !0
				},
				checked: function (e) {
					var t = e.nodeName.toLowerCase();
					return "input" === t && !!e.checked || "option" === t && !!e.selected
				},
				selected: function (e) {
					return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
				},
				empty: function (e) {
					for (e = e.firstChild; e; e = e.nextSibling)
						if (e.nodeType < 6) return !1;
					return !0
				},
				parent: function (e) {
					return !j.pseudos.empty(e)
				},
				header: function (e) {
					return ge.test(e.nodeName)
				},
				input: function (e) {
					return me.test(e.nodeName)
				},
				button: function (e) {
					var t = e.nodeName.toLowerCase();
					return "input" === t && "button" === e.type || "button" === t
				},
				text: function (e) {
					var t;
					return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
				},
				first: u(function () {
					return [0]
				}),
				last: u(function (e, t) {
					return [t - 1]
				}),
				eq: u(function (e, t, n) {
					return [0 > n ? n + t : n]
				}),
				even: u(function (e, t) {
					for (var n = 0; t > n; n += 2) e.push(n);
					return e
				}),
				odd: u(function (e, t) {
					for (var n = 1; t > n; n += 2) e.push(n);
					return e
				}),
				lt: u(function (e, t, n) {
					for (var i = 0 > n ? n + t : n; --i >= 0;) e.push(i);
					return e
				}),
				gt: u(function (e, t, n) {
					for (var i = 0 > n ? n + t : n; ++i < t;) e.push(i);
					return e
				})
			}
		}, j.pseudos.nth = j.pseudos.eq;
		for (_ in {
				radio: !0,
				checkbox: !0,
				file: !0,
				password: !0,
				image: !0
			}) j.pseudos[_] = o(_);
		for (_ in {
				submit: !0,
				reset: !0
			}) j.pseudos[_] = l(_);
		return h.prototype = j.filters = j.pseudos, j.setFilters = new h, P = t.tokenize = function (e, n) {
			var i, s, r, a, o, l, u, c = U[e + " "];
			if (c) return n ? 0 : c.slice(0);
			for (o = e, l = [], u = j.preFilter; o;) {
				(!i || (s = ue.exec(o))) && (s && (o = o.slice(s[0].length) || o), l.push(r = [])), i = !1, (s = ce.exec(o)) && (i = s.shift(), r.push({
					value: i,
					type: s[0].replace(le, " ")
				}), o = o.slice(i.length));
				for (a in j.filter) !(s = fe[a].exec(o)) || u[a] && !(s = u[a](s)) || (i = s.shift(), r.push({
					value: i,
					type: a,
					matches: s
				}), o = o.slice(i.length));
				if (!i) break
			}
			return n ? o.length : o ? t.error(e) : U(e, l).slice(0)
		}, S = t.compile = function (e, t) {
			var n, i = [],
				s = [],
				r = $[e + " "];
			if (!r) {
				for (t || (t = P(e)), n = t.length; n--;) r = y(t[n]), r[H] ? i.push(r) : s.push(r);
				r = $(e, b(s, i)), r.selector = e
			}
			return r
		}, C = t.select = function (e, t, n, i) {
			var s, r, a, o, l, u = "function" == typeof e && e,
				h = !i && P(e = u.selector || e);
			if (n = n || [], 1 === h.length) {
				if (r = h[0] = h[0].slice(0), r.length > 2 && "ID" === (a = r[0]).type && w.getById && 9 === t.nodeType && A && j.relative[r[1].type]) {
					if (t = (j.find.ID(a.matches[0].replace(we, je), t) || [])[0], !t) return n;
					u && (t = t.parentNode), e = e.slice(r.shift().value.length)
				}
				for (s = fe.needsContext.test(e) ? 0 : r.length; s-- && (a = r[s], !j.relative[o = a.type]);)
					if ((l = j.find[o]) && (i = l(a.matches[0].replace(we, je), be.test(r[0].type) && c(t.parentNode) || t))) {
						if (r.splice(s, 1), e = i.length && d(r), !e) return K.apply(n, i), n;
						break
					}
			}
			return (u || S(e, h))(i, t, !A, n, be.test(e) && c(t.parentNode) || t), n
		}, w.sortStable = H.split("").sort(z).join("") === H, w.detectDuplicates = !!q, N(), w.sortDetached = s(function (e) {
			return 1 & e.compareDocumentPosition(F.createElement("div"))
		}), s(function (e) {
			return e.innerHTML = "<a href='#'></a>", "#" === e.firstChild.getAttribute("href")
		}) || r("type|href|height|width", function (e, t, n) {
			return n ? void 0 : e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
		}), w.attributes && s(function (e) {
			return e.innerHTML = "<input/>", e.firstChild.setAttribute("value", ""), "" === e.firstChild.getAttribute("value")
		}) || r("value", function (e, t, n) {
			return n || "input" !== e.nodeName.toLowerCase() ? void 0 : e.defaultValue
		}), s(function (e) {
			return null == e.getAttribute("disabled")
		}) || r(te, function (e, t, n) {
			var i;
			return n ? void 0 : e[t] === !0 ? t.toLowerCase() : (i = e.getAttributeNode(t)) && i.specified ? i.value : null
		}), t
	}(e);
	Z.find = se, Z.expr = se.selectors, Z.expr[":"] = Z.expr.pseudos, Z.unique = se.uniqueSort, Z.text = se.getText, Z.isXMLDoc = se.isXML, Z.contains = se.contains;
	var re = Z.expr.match.needsContext,
		ae = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
		oe = /^.[^:#\[\.,]*$/;
	Z.filter = function (e, t, n) {
		var i = t[0];
		return n && (e = ":not(" + e + ")"), 1 === t.length && 1 === i.nodeType ? Z.find.matchesSelector(i, e) ? [i] : [] : Z.find.matches(e, Z.grep(t, function (e) {
			return 1 === e.nodeType
		}))
	}, Z.fn.extend({
		find: function (e) {
			var t, n = this.length,
				i = [],
				s = this;
			if ("string" != typeof e) return this.pushStack(Z(e).filter(function () {
				for (t = 0; n > t; t++)
					if (Z.contains(s[t], this)) return !0
			}));
			for (t = 0; n > t; t++) Z.find(e, s[t], i);
			return i = this.pushStack(n > 1 ? Z.unique(i) : i), i.selector = this.selector ? this.selector + " " + e : e, i
		},
		filter: function (e) {
			return this.pushStack(i(this, e || [], !1))
		},
		not: function (e) {
			return this.pushStack(i(this, e || [], !0))
		},
		is: function (e) {
			return !!i(this, "string" == typeof e && re.test(e) ? Z(e) : e || [], !1).length
		}
	});
	var le, ue = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
		ce = Z.fn.init = function (e, t) {
			var n, i;
			if (!e) return this;
			if ("string" == typeof e) {
				if (n = "<" === e[0] && ">" === e[e.length - 1] && e.length >= 3 ? [null, e, null] : ue.exec(e), !n || !n[1] && t) return !t || t.jquery ? (t || le).find(e) : this.constructor(t).find(e);
				if (n[1]) {
					if (t = t instanceof Z ? t[0] : t, Z.merge(this, Z.parseHTML(n[1], t && t.nodeType ? t.ownerDocument || t : Q, !0)), ae.test(n[1]) && Z.isPlainObject(t))
						for (n in t) Z.isFunction(this[n]) ? this[n](t[n]) : this.attr(n, t[n]);
					return this
				}
				return i = Q.getElementById(n[2]), i && i.parentNode && (this.length = 1, this[0] = i), this.context = Q, this.selector = e, this
			}
			return e.nodeType ? (this.context = this[0] = e, this.length = 1, this) : Z.isFunction(e) ? "undefined" != typeof le.ready ? le.ready(e) : e(Z) : (void 0 !== e.selector && (this.selector = e.selector, this.context = e.context), Z.makeArray(e, this))
		};
	ce.prototype = Z.fn, le = Z(Q);
	var he = /^(?:parents|prev(?:Until|All))/,
		de = {
			children: !0,
			contents: !0,
			next: !0,
			prev: !0
		};
	Z.extend({
		dir: function (e, t, n) {
			for (var i = [], s = void 0 !== n;
				(e = e[t]) && 9 !== e.nodeType;)
				if (1 === e.nodeType) {
					if (s && Z(e).is(n)) break;
					i.push(e)
				}
			return i
		},
		sibling: function (e, t) {
			for (var n = []; e; e = e.nextSibling) 1 === e.nodeType && e !== t && n.push(e);
			return n
		}
	}), Z.fn.extend({
		has: function (e) {
			var t = Z(e, this),
				n = t.length;
			return this.filter(function () {
				for (var e = 0; n > e; e++)
					if (Z.contains(this, t[e])) return !0
			})
		},
		closest: function (e, t) {
			for (var n, i = 0, s = this.length, r = [], a = re.test(e) || "string" != typeof e ? Z(e, t || this.context) : 0; s > i; i++)
				for (n = this[i]; n && n !== t; n = n.parentNode)
					if (n.nodeType < 11 && (a ? a.index(n) > -1 : 1 === n.nodeType && Z.find.matchesSelector(n, e))) {
						r.push(n);
						break
					}
			return this.pushStack(r.length > 1 ? Z.unique(r) : r)
		},
		index: function (e) {
			return e ? "string" == typeof e ? z.call(Z(e), this[0]) : z.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
		},
		add: function (e, t) {
			return this.pushStack(Z.unique(Z.merge(this.get(), Z(e, t))))
		},
		addBack: function (e) {
			return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
		}
	}), Z.each({
		parent: function (e) {
			var t = e.parentNode;
			return t && 11 !== t.nodeType ? t : null
		},
		parents: function (e) {
			return Z.dir(e, "parentNode")
		},
		parentsUntil: function (e, t, n) {
			return Z.dir(e, "parentNode", n)
		},
		next: function (e) {
			return s(e, "nextSibling")
		},
		prev: function (e) {
			return s(e, "previousSibling")
		},
		nextAll: function (e) {
			return Z.dir(e, "nextSibling")
		},
		prevAll: function (e) {
			return Z.dir(e, "previousSibling")
		},
		nextUntil: function (e, t, n) {
			return Z.dir(e, "nextSibling", n)
		},
		prevUntil: function (e, t, n) {
			return Z.dir(e, "previousSibling", n)
		},
		siblings: function (e) {
			return Z.sibling((e.parentNode || {}).firstChild, e)
		},
		children: function (e) {
			return Z.sibling(e.firstChild)
		},
		contents: function (e) {
			return e.contentDocument || Z.merge([], e.childNodes)
		}
	}, function (e, t) {
		Z.fn[e] = function (n, i) {
			var s = Z.map(this, t, n);
			return "Until" !== e.slice(-5) && (i = n), i && "string" == typeof i && (s = Z.filter(i, s)), this.length > 1 && (de[e] || Z.unique(s), he.test(e) && s.reverse()), this.pushStack(s)
		}
	});
	var pe = /\S+/g,
		fe = {};
	Z.Callbacks = function (e) {
		e = "string" == typeof e ? fe[e] || r(e) : Z.extend({}, e);
		var t, n, i, s, a, o, l = [],
			u = !e.once && [],
			c = function (r) {
				for (t = e.memory && r, n = !0, o = s || 0, s = 0, a = l.length, i = !0; l && a > o; o++)
					if (l[o].apply(r[0], r[1]) === !1 && e.stopOnFalse) {
						t = !1;
						break
					}
				i = !1, l && (u ? u.length && c(u.shift()) : t ? l = [] : h.disable())
			},
			h = {
				add: function () {
					if (l) {
						var n = l.length;
						! function r(t) {
							Z.each(t, function (t, n) {
								var i = Z.type(n);
								"function" === i ? e.unique && h.has(n) || l.push(n) : n && n.length && "string" !== i && r(n)
							})
						}(arguments), i ? a = l.length : t && (s = n, c(t))
					}
					return this
				},
				remove: function () {
					return l && Z.each(arguments, function (e, t) {
						for (var n;
							(n = Z.inArray(t, l, n)) > -1;) l.splice(n, 1), i && (a >= n && a--, o >= n && o--)
					}), this
				},
				has: function (e) {
					return e ? Z.inArray(e, l) > -1 : !(!l || !l.length)
				},
				empty: function () {
					return l = [], a = 0, this
				},
				disable: function () {
					return l = u = t = void 0, this
				},
				disabled: function () {
					return !l
				},
				lock: function () {
					return u = void 0, t || h.disable(), this
				},
				locked: function () {
					return !u
				},
				fireWith: function (e, t) {
					return !l || n && !u || (t = t || [], t = [e, t.slice ? t.slice() : t], i ? u.push(t) : c(t)), this
				},
				fire: function () {
					return h.fireWith(this, arguments), this
				},
				fired: function () {
					return !!n
				}
			};
		return h
	}, Z.extend({
		Deferred: function (e) {
			var t = [
					["resolve", "done", Z.Callbacks("once memory"), "resolved"],
					["reject", "fail", Z.Callbacks("once memory"), "rejected"],
					["notify", "progress", Z.Callbacks("memory")]
				],
				n = "pending",
				i = {
					state: function () {
						return n
					},
					always: function () {
						return s.done(arguments).fail(arguments), this
					},
					then: function () {
						var e = arguments;
						return Z.Deferred(function (n) {
							Z.each(t, function (t, r) {
								var a = Z.isFunction(e[t]) && e[t];
								s[r[1]](function () {
									var e = a && a.apply(this, arguments);
									e && Z.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[r[0] + "With"](this === i ? n.promise() : this, a ? [e] : arguments)
								})
							}), e = null
						}).promise()
					},
					promise: function (e) {
						return null != e ? Z.extend(e, i) : i
					}
				},
				s = {};
			return i.pipe = i.then, Z.each(t, function (e, r) {
				var a = r[2],
					o = r[3];
				i[r[1]] = a.add, o && a.add(function () {
					n = o
				}, t[1 ^ e][2].disable, t[2][2].lock), s[r[0]] = function () {
					return s[r[0] + "With"](this === s ? i : this, arguments), this
				}, s[r[0] + "With"] = a.fireWith
			}), i.promise(s), e && e.call(s, s), s
		},
		when: function (e) {
			var t, n, i, s = 0,
				r = W.call(arguments),
				a = r.length,
				o = 1 !== a || e && Z.isFunction(e.promise) ? a : 0,
				l = 1 === o ? e : Z.Deferred(),
				u = function (e, n, i) {
					return function (s) {
						n[e] = this, i[e] = arguments.length > 1 ? W.call(arguments) : s, i === t ? l.notifyWith(n, i) : --o || l.resolveWith(n, i)
					}
				};
			if (a > 1)
				for (t = new Array(a), n = new Array(a), i = new Array(a); a > s; s++) r[s] && Z.isFunction(r[s].promise) ? r[s].promise().done(u(s, i, r)).fail(l.reject).progress(u(s, n, t)) : --o;
			return o || l.resolveWith(i, r), l.promise()
		}
	});
	var me;
	Z.fn.ready = function (e) {
		return Z.ready.promise().done(e), this
	}, Z.extend({
		isReady: !1,
		readyWait: 1,
		holdReady: function (e) {
			e ? Z.readyWait++ : Z.ready(!0)
		},
		ready: function (e) {
			(e === !0 ? --Z.readyWait : Z.isReady) || (Z.isReady = !0, e !== !0 && --Z.readyWait > 0 || (me.resolveWith(Q, [Z]), Z.fn.triggerHandler && (Z(Q).triggerHandler("ready"), Z(Q).off("ready"))))
		}
	}), Z.ready.promise = function (t) {
		return me || (me = Z.Deferred(), "complete" === Q.readyState ? setTimeout(Z.ready) : (Q.addEventListener("DOMContentLoaded", a, !1), e.addEventListener("load", a, !1))), me.promise(t)
	}, Z.ready.promise();
	var ge = Z.access = function (e, t, n, i, s, r, a) {
		var o = 0,
			l = e.length,
			u = null == n;
		if ("object" === Z.type(n)) {
			s = !0;
			for (o in n) Z.access(e, t, o, n[o], !0, r, a)
		} else if (void 0 !== i && (s = !0, Z.isFunction(i) || (a = !0), u && (a ? (t.call(e, i), t = null) : (u = t, t = function (e, t, n) {
				return u.call(Z(e), n)
			})), t))
			for (; l > o; o++) t(e[o], n, a ? i : i.call(e[o], o, t(e[o], n)));
		return s ? e : u ? t.call(e) : l ? t(e[0], n) : r
	};
	Z.acceptData = function (e) {
		return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
	}, o.uid = 1, o.accepts = Z.acceptData, o.prototype = {
		key: function (e) {
			if (!o.accepts(e)) return 0;
			var t = {},
				n = e[this.expando];
			if (!n) {
				n = o.uid++;
				try {
					t[this.expando] = {
						value: n
					}, Object.defineProperties(e, t)
				} catch (i) {
					t[this.expando] = n, Z.extend(e, t)
				}
			}
			return this.cache[n] || (this.cache[n] = {}), n
		},
		set: function (e, t, n) {
			var i, s = this.key(e),
				r = this.cache[s];
			if ("string" == typeof t) r[t] = n;
			else if (Z.isEmptyObject(r)) Z.extend(this.cache[s], t);
			else
				for (i in t) r[i] = t[i];
			return r
		},
		get: function (e, t) {
			var n = this.cache[this.key(e)];
			return void 0 === t ? n : n[t]
		},
		access: function (e, t, n) {
			var i;
			return void 0 === t || t && "string" == typeof t && void 0 === n ? (i = this.get(e, t), void 0 !== i ? i : this.get(e, Z.camelCase(t))) : (this.set(e, t, n), void 0 !== n ? n : t)
		},
		remove: function (e, t) {
			var n, i, s, r = this.key(e),
				a = this.cache[r];
			if (void 0 === t) this.cache[r] = {};
			else {
				Z.isArray(t) ? i = t.concat(t.map(Z.camelCase)) : (s = Z.camelCase(t), t in a ? i = [t, s] : (i = s, i = i in a ? [i] : i.match(pe) || [])), n = i.length;
				for (; n--;) delete a[i[n]]
			}
		},
		hasData: function (e) {
			return !Z.isEmptyObject(this.cache[e[this.expando]] || {})
		},
		discard: function (e) {
			e[this.expando] && delete this.cache[e[this.expando]]
		}
	};
	var ve = new o,
		ye = new o,
		be = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
		_e = /([A-Z])/g;
	Z.extend({
		hasData: function (e) {
			return ye.hasData(e) || ve.hasData(e)
		},
		data: function (e, t, n) {
			return ye.access(e, t, n)
		},
		removeData: function (e, t) {
			ye.remove(e, t)
		},
		_data: function (e, t, n) {
			return ve.access(e, t, n)
		},
		_removeData: function (e, t) {
			ve.remove(e, t)
		}
	}), Z.fn.extend({
		data: function (e, t) {
			var n, i, s, r = this[0],
				a = r && r.attributes;
			if (void 0 === e) {
				if (this.length && (s = ye.get(r), 1 === r.nodeType && !ve.get(r, "hasDataAttrs"))) {
					for (n = a.length; n--;) a[n] && (i = a[n].name, 0 === i.indexOf("data-") && (i = Z.camelCase(i.slice(5)), l(r, i, s[i])));
					ve.set(r, "hasDataAttrs", !0)
				}
				return s
			}
			return "object" == typeof e ? this.each(function () {
				ye.set(this, e)
			}) : ge(this, function (t) {
				var n, i = Z.camelCase(e);
				if (r && void 0 === t) {
					if (n = ye.get(r, e), void 0 !== n) return n;
					if (n = ye.get(r, i), void 0 !== n) return n;
					if (n = l(r, i, void 0), void 0 !== n) return n
				} else this.each(function () {
					var n = ye.get(this, i);
					ye.set(this, i, t), -1 !== e.indexOf("-") && void 0 !== n && ye.set(this, e, t)
				})
			}, null, t, arguments.length > 1, null, !0)
		},
		removeData: function (e) {
			return this.each(function () {
				ye.remove(this, e)
			})
		}
	}), Z.extend({
		queue: function (e, t, n) {
			var i;
			return e ? (t = (t || "fx") + "queue", i = ve.get(e, t), n && (!i || Z.isArray(n) ? i = ve.access(e, t, Z.makeArray(n)) : i.push(n)), i || []) : void 0
		},
		dequeue: function (e, t) {
			t = t || "fx";
			var n = Z.queue(e, t),
				i = n.length,
				s = n.shift(),
				r = Z._queueHooks(e, t),
				a = function () {
					Z.dequeue(e, t)
				};
			"inprogress" === s && (s = n.shift(), i--), s && ("fx" === t && n.unshift("inprogress"), delete r.stop, s.call(e, a, r)), !i && r && r.empty.fire()
		},
		_queueHooks: function (e, t) {
			var n = t + "queueHooks";
			return ve.get(e, n) || ve.access(e, n, {
				empty: Z.Callbacks("once memory").add(function () {
					ve.remove(e, [t + "queue", n])
				})
			})
		}
	}), Z.fn.extend({
		queue: function (e, t) {
			var n = 2;
			return "string" != typeof e && (t = e, e = "fx", n--), arguments.length < n ? Z.queue(this[0], e) : void 0 === t ? this : this.each(function () {
				var n = Z.queue(this, e, t);
				Z._queueHooks(this, e), "fx" === e && "inprogress" !== n[0] && Z.dequeue(this, e)
			})
		},
		dequeue: function (e) {
			return this.each(function () {
				Z.dequeue(this, e)
			})
		},
		clearQueue: function (e) {
			return this.queue(e || "fx", [])
		},
		promise: function (e, t) {
			var n, i = 1,
				s = Z.Deferred(),
				r = this,
				a = this.length,
				o = function () {
					--i || s.resolveWith(r, [r])
				};
			for ("string" != typeof e && (t = e, e = void 0), e = e || "fx"; a--;) n = ve.get(r[a], e + "queueHooks"), n && n.empty && (i++, n.empty.add(o));
			return o(), s.promise(t)
		}
	});
	var we = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
		je = ["Top", "Right", "Bottom", "Left"],
		xe = function (e, t) {
			return e = t || e, "none" === Z.css(e, "display") || !Z.contains(e.ownerDocument, e)
		},
		ke = /^(?:checkbox|radio)$/i;
	! function () {
		var e = Q.createDocumentFragment(),
			t = e.appendChild(Q.createElement("div")),
			n = Q.createElement("input");
		n.setAttribute("type", "radio"), n.setAttribute("checked", "checked"), n.setAttribute("name", "t"), t.appendChild(n), G.checkClone = t.cloneNode(!0).cloneNode(!0).lastChild.checked, t.innerHTML = "<textarea>x</textarea>", G.noCloneChecked = !!t.cloneNode(!0).lastChild.defaultValue
	}();
	var Pe = "undefined";
	G.focusinBubbles = "onfocusin" in e;
	var Se = /^key/,
		Ce = /^(?:mouse|pointer|contextmenu)|click/,
		Ee = /^(?:focusinfocus|focusoutblur)$/,
		Te = /^([^.]*)(?:\.(.+)|)$/;
	Z.event = {
		global: {},
		add: function (e, t, n, i, s) {
			var r, a, o, l, u, c, h, d, p, f, m, g = ve.get(e);
			if (g)
				for (n.handler && (r = n, n = r.handler, s = r.selector), n.guid || (n.guid = Z.guid++), (l = g.events) || (l = g.events = {}), (a = g.handle) || (a = g.handle = function (t) {
						return typeof Z !== Pe && Z.event.triggered !== t.type ? Z.event.dispatch.apply(e, arguments) : void 0
					}), t = (t || "").match(pe) || [""], u = t.length; u--;) o = Te.exec(t[u]) || [], p = m = o[1], f = (o[2] || "").split(".").sort(), p && (h = Z.event.special[p] || {}, p = (s ? h.delegateType : h.bindType) || p, h = Z.event.special[p] || {}, c = Z.extend({
					type: p,
					origType: m,
					data: i,
					handler: n,
					guid: n.guid,
					selector: s,
					needsContext: s && Z.expr.match.needsContext.test(s),
					namespace: f.join(".")
				}, r), (d = l[p]) || (d = l[p] = [], d.delegateCount = 0, h.setup && h.setup.call(e, i, f, a) !== !1 || e.addEventListener && e.addEventListener(p, a, !1)), h.add && (h.add.call(e, c), c.handler.guid || (c.handler.guid = n.guid)), s ? d.splice(d.delegateCount++, 0, c) : d.push(c), Z.event.global[p] = !0)
		},
		remove: function (e, t, n, i, s) {
			var r, a, o, l, u, c, h, d, p, f, m, g = ve.hasData(e) && ve.get(e);
			if (g && (l = g.events)) {
				for (t = (t || "").match(pe) || [""], u = t.length; u--;)
					if (o = Te.exec(t[u]) || [], p = m = o[1], f = (o[2] || "").split(".").sort(), p) {
						for (h = Z.event.special[p] || {}, p = (i ? h.delegateType : h.bindType) || p, d = l[p] || [], o = o[2] && new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)"), a = r = d.length; r--;) c = d[r], !s && m !== c.origType || n && n.guid !== c.guid || o && !o.test(c.namespace) || i && i !== c.selector && ("**" !== i || !c.selector) || (d.splice(r, 1), c.selector && d.delegateCount--, h.remove && h.remove.call(e, c));
						a && !d.length && (h.teardown && h.teardown.call(e, f, g.handle) !== !1 || Z.removeEvent(e, p, g.handle), delete l[p])
					} else
						for (p in l) Z.event.remove(e, p + t[u], n, i, !0);
				Z.isEmptyObject(l) && (delete g.handle, ve.remove(e, "events"))
			}
		},
		trigger: function (t, n, i, s) {
			var r, a, o, l, u, c, h, d = [i || Q],
				p = J.call(t, "type") ? t.type : t,
				f = J.call(t, "namespace") ? t.namespace.split(".") : [];
			if (a = o = i = i || Q, 3 !== i.nodeType && 8 !== i.nodeType && !Ee.test(p + Z.event.triggered) && (p.indexOf(".") >= 0 && (f = p.split("."), p = f.shift(), f.sort()), u = p.indexOf(":") < 0 && "on" + p, t = t[Z.expando] ? t : new Z.Event(p, "object" == typeof t && t), t.isTrigger = s ? 2 : 3, t.namespace = f.join("."), t.namespace_re = t.namespace ? new RegExp("(^|\\.)" + f.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, t.result = void 0, t.target || (t.target = i), n = null == n ? [t] : Z.makeArray(n, [t]), h = Z.event.special[p] || {}, s || !h.trigger || h.trigger.apply(i, n) !== !1)) {
				if (!s && !h.noBubble && !Z.isWindow(i)) {
					for (l = h.delegateType || p, Ee.test(l + p) || (a = a.parentNode); a; a = a.parentNode) d.push(a), o = a;
					o === (i.ownerDocument || Q) && d.push(o.defaultView || o.parentWindow || e)
				}
				for (r = 0;
					(a = d[r++]) && !t.isPropagationStopped();) t.type = r > 1 ? l : h.bindType || p, c = (ve.get(a, "events") || {})[t.type] && ve.get(a, "handle"), c && c.apply(a, n), c = u && a[u], c && c.apply && Z.acceptData(a) && (t.result = c.apply(a, n), t.result === !1 && t.preventDefault());
				return t.type = p, s || t.isDefaultPrevented() || h._default && h._default.apply(d.pop(), n) !== !1 || !Z.acceptData(i) || u && Z.isFunction(i[p]) && !Z.isWindow(i) && (o = i[u], o && (i[u] = null), Z.event.triggered = p, i[p](), Z.event.triggered = void 0, o && (i[u] = o)), t.result
			}
		},
		dispatch: function (e) {
			e = Z.event.fix(e);
			var t, n, i, s, r, a = [],
				o = W.call(arguments),
				l = (ve.get(this, "events") || {})[e.type] || [],
				u = Z.event.special[e.type] || {};
			if (o[0] = e, e.delegateTarget = this, !u.preDispatch || u.preDispatch.call(this, e) !== !1) {
				for (a = Z.event.handlers.call(this, e, l), t = 0;
					(s = a[t++]) && !e.isPropagationStopped();)
					for (e.currentTarget = s.elem, n = 0;
						(r = s.handlers[n++]) && !e.isImmediatePropagationStopped();)(!e.namespace_re || e.namespace_re.test(r.namespace)) && (e.handleObj = r, e.data = r.data, i = ((Z.event.special[r.origType] || {}).handle || r.handler).apply(s.elem, o), void 0 !== i && (e.result = i) === !1 && (e.preventDefault(), e.stopPropagation()));
				return u.postDispatch && u.postDispatch.call(this, e), e.result
			}
		},
		handlers: function (e, t) {
			var n, i, s, r, a = [],
				o = t.delegateCount,
				l = e.target;
			if (o && l.nodeType && (!e.button || "click" !== e.type))
				for (; l !== this; l = l.parentNode || this)
					if (l.disabled !== !0 || "click" !== e.type) {
						for (i = [], n = 0; o > n; n++) r = t[n], s = r.selector + " ", void 0 === i[s] && (i[s] = r.needsContext ? Z(s, this).index(l) >= 0 : Z.find(s, this, null, [l]).length), i[s] && i.push(r);
						i.length && a.push({
							elem: l,
							handlers: i
						})
					}
			return o < t.length && a.push({
				elem: this,
				handlers: t.slice(o)
			}), a
		},
		props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
		fixHooks: {},
		keyHooks: {
			props: "char charCode key keyCode".split(" "),
			filter: function (e, t) {
				return null == e.which && (e.which = null != t.charCode ? t.charCode : t.keyCode), e
			}
		},
		mouseHooks: {
			props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
			filter: function (e, t) {
				var n, i, s, r = t.button;
				return null == e.pageX && null != t.clientX && (n = e.target.ownerDocument || Q, i = n.documentElement, s = n.body, e.pageX = t.clientX + (i && i.scrollLeft || s && s.scrollLeft || 0) - (i && i.clientLeft || s && s.clientLeft || 0), e.pageY = t.clientY + (i && i.scrollTop || s && s.scrollTop || 0) - (i && i.clientTop || s && s.clientTop || 0)), e.which || void 0 === r || (e.which = 1 & r ? 1 : 2 & r ? 3 : 4 & r ? 2 : 0), e
			}
		},
		fix: function (e) {
			if (e[Z.expando]) return e;
			var t, n, i, s = e.type,
				r = e,
				a = this.fixHooks[s];
			for (a || (this.fixHooks[s] = a = Ce.test(s) ? this.mouseHooks : Se.test(s) ? this.keyHooks : {}), i = a.props ? this.props.concat(a.props) : this.props, e = new Z.Event(r), t = i.length; t--;) n = i[t], e[n] = r[n];
			return e.target || (e.target = Q), 3 === e.target.nodeType && (e.target = e.target.parentNode), a.filter ? a.filter(e, r) : e
		},
		special: {
			load: {
				noBubble: !0
			},
			focus: {
				trigger: function () {
					return this !== h() && this.focus ? (this.focus(), !1) : void 0
				},
				delegateType: "focusin"
			},
			blur: {
				trigger: function () {
					return this === h() && this.blur ? (this.blur(), !1) : void 0
				},
				delegateType: "focusout"
			},
			click: {
				trigger: function () {
					return "checkbox" === this.type && this.click && Z.nodeName(this, "input") ? (this.click(), !1) : void 0
				},
				_default: function (e) {
					return Z.nodeName(e.target, "a")
				}
			},
			beforeunload: {
				postDispatch: function (e) {
					void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
				}
			}
		},
		simulate: function (e, t, n, i) {
			var s = Z.extend(new Z.Event, n, {
				type: e,
				isSimulated: !0,
				originalEvent: {}
			});
			i ? Z.event.trigger(s, null, t) : Z.event.dispatch.call(t, s), s.isDefaultPrevented() && n.preventDefault()
		}
	}, Z.removeEvent = function (e, t, n) {
		e.removeEventListener && e.removeEventListener(t, n, !1)
	}, Z.Event = function (e, t) {
		return this instanceof Z.Event ? (e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && e.returnValue === !1 ? u : c) : this.type = e, t && Z.extend(this, t), this.timeStamp = e && e.timeStamp || Z.now(), void(this[Z.expando] = !0)) : new Z.Event(e, t)
	}, Z.Event.prototype = {
		isDefaultPrevented: c,
		isPropagationStopped: c,
		isImmediatePropagationStopped: c,
		preventDefault: function () {
			var e = this.originalEvent;
			this.isDefaultPrevented = u, e && e.preventDefault && e.preventDefault()
		},
		stopPropagation: function () {
			var e = this.originalEvent;
			this.isPropagationStopped = u, e && e.stopPropagation && e.stopPropagation()
		},
		stopImmediatePropagation: function () {
			var e = this.originalEvent;
			this.isImmediatePropagationStopped = u, e && e.stopImmediatePropagation && e.stopImmediatePropagation(), this.stopPropagation()
		}
	}, Z.each({
		mouseenter: "mouseover",
		mouseleave: "mouseout",
		pointerenter: "pointerover",
		pointerleave: "pointerout"
	}, function (e, t) {
		Z.event.special[e] = {
			delegateType: t,
			bindType: t,
			handle: function (e) {
				var n, i = this,
					s = e.relatedTarget,
					r = e.handleObj;
				return (!s || s !== i && !Z.contains(i, s)) && (e.type = r.origType, n = r.handler.apply(this, arguments), e.type = t), n
			}
		}
	}), G.focusinBubbles || Z.each({
		focus: "focusin",
		blur: "focusout"
	}, function (e, t) {
		var n = function (e) {
			Z.event.simulate(t, e.target, Z.event.fix(e), !0)
		};
		Z.event.special[t] = {
			setup: function () {
				var i = this.ownerDocument || this,
					s = ve.access(i, t);
				s || i.addEventListener(e, n, !0), ve.access(i, t, (s || 0) + 1)
			},
			teardown: function () {
				var i = this.ownerDocument || this,
					s = ve.access(i, t) - 1;
				s ? ve.access(i, t, s) : (i.removeEventListener(e, n, !0), ve.remove(i, t))
			}
		}
	}), Z.fn.extend({
		on: function (e, t, n, i, s) {
			var r, a;
			if ("object" == typeof e) {
				"string" != typeof t && (n = n || t, t = void 0);
				for (a in e) this.on(a, t, n, e[a], s);
				return this
			}
			if (null == n && null == i ? (i = t, n = t = void 0) : null == i && ("string" == typeof t ? (i = n, n = void 0) : (i = n, n = t, t = void 0)), i === !1) i = c;
			else if (!i) return this;
			return 1 === s && (r = i, i = function (e) {
				return Z().off(e), r.apply(this, arguments)
			}, i.guid = r.guid || (r.guid = Z.guid++)), this.each(function () {
				Z.event.add(this, e, i, n, t)
			})
		},
		one: function (e, t, n, i) {
			return this.on(e, t, n, i, 1)
		},
		off: function (e, t, n) {
			var i, s;
			if (e && e.preventDefault && e.handleObj) return i = e.handleObj, Z(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
			if ("object" == typeof e) {
				for (s in e) this.off(s, t, e[s]);
				return this
			}
			return (t === !1 || "function" == typeof t) && (n = t, t = void 0), n === !1 && (n = c), this.each(function () {
				Z.event.remove(this, e, n, t)
			})
		},
		trigger: function (e, t) {
			return this.each(function () {
				Z.event.trigger(e, t, this)
			})
		},
		triggerHandler: function (e, t) {
			var n = this[0];
			return n ? Z.event.trigger(e, t, n, !0) : void 0
		}
	});
	var qe = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
		Ne = /<([\w:]+)/,
		Fe = /<|&#?\w+;/,
		Le = /<(?:script|style|link)/i,
		Ae = /checked\s*(?:[^=]|=\s*.checked.)/i,
		Re = /^$|\/(?:java|ecma)script/i,
		Oe = /^true\/(.*)/,
		Me = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
		De = {
			option: [1, "<select multiple='multiple'>", "</select>"],
			thead: [1, "<table>", "</table>"],
			col: [2, "<table><colgroup>", "</colgroup></table>"],
			tr: [2, "<table><tbody>", "</tbody></table>"],
			td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
			_default: [0, "", ""]
		};
	De.optgroup = De.option, De.tbody = De.tfoot = De.colgroup = De.caption = De.thead, De.th = De.td, Z.extend({
		clone: function (e, t, n) {
			var i, s, r, a, o = e.cloneNode(!0),
				l = Z.contains(e.ownerDocument, e);
			if (!(G.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || Z.isXMLDoc(e)))
				for (a = v(o), r = v(e), i = 0, s = r.length; s > i; i++) y(r[i], a[i]);
			if (t)
				if (n)
					for (r = r || v(e), a = a || v(o), i = 0, s = r.length; s > i; i++) g(r[i], a[i]);
				else g(e, o);
			return a = v(o, "script"), a.length > 0 && m(a, !l && v(e, "script")), o
		},
		buildFragment: function (e, t, n, i) {
			for (var s, r, a, o, l, u, c = t.createDocumentFragment(), h = [], d = 0, p = e.length; p > d; d++)
				if (s = e[d], s || 0 === s)
					if ("object" === Z.type(s)) Z.merge(h, s.nodeType ? [s] : s);
					else if (Fe.test(s)) {
				for (r = r || c.appendChild(t.createElement("div")), a = (Ne.exec(s) || ["", ""])[1].toLowerCase(), o = De[a] || De._default, r.innerHTML = o[1] + s.replace(qe, "<$1></$2>") + o[2], u = o[0]; u--;) r = r.lastChild;
				Z.merge(h, r.childNodes), r = c.firstChild, r.textContent = ""
			} else h.push(t.createTextNode(s));
			for (c.textContent = "", d = 0; s = h[d++];)
				if ((!i || -1 === Z.inArray(s, i)) && (l = Z.contains(s.ownerDocument, s), r = v(c.appendChild(s), "script"), l && m(r), n))
					for (u = 0; s = r[u++];) Re.test(s.type || "") && n.push(s);
			return c
		},
		cleanData: function (e) {
			for (var t, n, i, s, r = Z.event.special, a = 0; void 0 !== (n = e[a]); a++) {
				if (Z.acceptData(n) && (s = n[ve.expando], s && (t = ve.cache[s]))) {
					if (t.events)
						for (i in t.events) r[i] ? Z.event.remove(n, i) : Z.removeEvent(n, i, t.handle);
					ve.cache[s] && delete ve.cache[s]
				}
				delete ye.cache[n[ye.expando]]
			}
		}
	}), Z.fn.extend({
		text: function (e) {
			return ge(this, function (e) {
				return void 0 === e ? Z.text(this) : this.empty().each(function () {
					(1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) && (this.textContent = e)
				})
			}, null, e, arguments.length)
		},
		append: function () {
			return this.domManip(arguments, function (e) {
				if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
					var t = d(this, e);
					t.appendChild(e)
				}
			})
		},
		prepend: function () {
			return this.domManip(arguments, function (e) {
				if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
					var t = d(this, e);
					t.insertBefore(e, t.firstChild)
				}
			})
		},
		before: function () {
			return this.domManip(arguments, function (e) {
				this.parentNode && this.parentNode.insertBefore(e, this)
			})
		},
		after: function () {
			return this.domManip(arguments, function (e) {
				this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
			})
		},
		remove: function (e, t) {
			for (var n, i = e ? Z.filter(e, this) : this, s = 0; null != (n = i[s]); s++) t || 1 !== n.nodeType || Z.cleanData(v(n)), n.parentNode && (t && Z.contains(n.ownerDocument, n) && m(v(n, "script")), n.parentNode.removeChild(n));
			return this
		},
		empty: function () {
			for (var e, t = 0; null != (e = this[t]); t++) 1 === e.nodeType && (Z.cleanData(v(e, !1)), e.textContent = "");
			return this
		},
		clone: function (e, t) {
			return e = null == e ? !1 : e, t = null == t ? e : t, this.map(function () {
				return Z.clone(this, e, t)
			})
		},
		html: function (e) {
			return ge(this, function (e) {
				var t = this[0] || {},
					n = 0,
					i = this.length;
				if (void 0 === e && 1 === t.nodeType) return t.innerHTML;
				if ("string" == typeof e && !Le.test(e) && !De[(Ne.exec(e) || ["", ""])[1].toLowerCase()]) {
					e = e.replace(qe, "<$1></$2>");
					try {
						for (; i > n; n++) t = this[n] || {}, 1 === t.nodeType && (Z.cleanData(v(t, !1)), t.innerHTML = e);
						t = 0
					} catch (s) {}
				}
				t && this.empty().append(e)
			}, null, e, arguments.length)
		},
		replaceWith: function () {
			var e = arguments[0];
			return this.domManip(arguments, function (t) {
				e = this.parentNode, Z.cleanData(v(this)), e && e.replaceChild(t, this)
			}), e && (e.length || e.nodeType) ? this : this.remove()
		},
		detach: function (e) {
			return this.remove(e, !0)
		},
		domManip: function (e, t) {
			e = U.apply([], e);
			var n, i, s, r, a, o, l = 0,
				u = this.length,
				c = this,
				h = u - 1,
				d = e[0],
				m = Z.isFunction(d);
			if (m || u > 1 && "string" == typeof d && !G.checkClone && Ae.test(d)) return this.each(function (n) {
				var i = c.eq(n);
				m && (e[0] = d.call(this, n, i.html())), i.domManip(e, t)
			});
			if (u && (n = Z.buildFragment(e, this[0].ownerDocument, !1, this), i = n.firstChild, 1 === n.childNodes.length && (n = i), i)) {
				for (s = Z.map(v(n, "script"), p), r = s.length; u > l; l++) a = n, l !== h && (a = Z.clone(a, !0, !0), r && Z.merge(s, v(a, "script"))), t.call(this[l], a, l);
				if (r)
					for (o = s[s.length - 1].ownerDocument, Z.map(s, f), l = 0; r > l; l++) a = s[l], Re.test(a.type || "") && !ve.access(a, "globalEval") && Z.contains(o, a) && (a.src ? Z._evalUrl && Z._evalUrl(a.src) : Z.globalEval(a.textContent.replace(Me, "")))
			}
			return this
		}
	}), Z.each({
		appendTo: "append",
		prependTo: "prepend",
		insertBefore: "before",
		insertAfter: "after",
		replaceAll: "replaceWith"
	}, function (e, t) {
		Z.fn[e] = function (e) {
			for (var n, i = [], s = Z(e), r = s.length - 1, a = 0; r >= a; a++) n = a === r ? this : this.clone(!0), Z(s[a])[t](n), $.apply(i, n.get());
			return this.pushStack(i)
		}
	});
	var He, Be = {},
		Ie = /^margin/,
		Ve = new RegExp("^(" + we + ")(?!px)[a-z%]+$", "i"),
		We = function (t) {
			return t.ownerDocument.defaultView.opener ? t.ownerDocument.defaultView.getComputedStyle(t, null) : e.getComputedStyle(t, null)
		};
	! function () {
		function t() {
			a.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;display:block;margin-top:1%;top:1%;border:1px;padding:1px;width:4px;position:absolute", a.innerHTML = "", s.appendChild(r);
			var t = e.getComputedStyle(a, null);
			n = "1%" !== t.top, i = "4px" === t.width, s.removeChild(r)
		}
		var n, i, s = Q.documentElement,
			r = Q.createElement("div"),
			a = Q.createElement("div");
		a.style && (a.style.backgroundClip = "content-box", a.cloneNode(!0).style.backgroundClip = "", G.clearCloneStyle = "content-box" === a.style.backgroundClip, r.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;position:absolute", r.appendChild(a), e.getComputedStyle && Z.extend(G, {
			pixelPosition: function () {
				return t(), n
			},
			boxSizingReliable: function () {
				return null == i && t(), i
			},
			reliableMarginRight: function () {
				var t, n = a.appendChild(Q.createElement("div"));
				return n.style.cssText = a.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;margin:0;border:0;padding:0", n.style.marginRight = n.style.width = "0", a.style.width = "1px", s.appendChild(r), t = !parseFloat(e.getComputedStyle(n, null).marginRight), s.removeChild(r), a.removeChild(n), t
			}
		}))
	}(), Z.swap = function (e, t, n, i) {
		var s, r, a = {};
		for (r in t) a[r] = e.style[r], e.style[r] = t[r];
		s = n.apply(e, i || []);
		for (r in t) e.style[r] = a[r];
		return s
	};
	var Ue = /^(none|table(?!-c[ea]).+)/,
		$e = new RegExp("^(" + we + ")(.*)$", "i"),
		ze = new RegExp("^([+-])=(" + we + ")", "i"),
		Xe = {
			position: "absolute",
			visibility: "hidden",
			display: "block"
		},
		Ye = {
			letterSpacing: "0",
			fontWeight: "400"
		},
		Je = ["Webkit", "O", "Moz", "ms"];
	Z.extend({
		cssHooks: {
			opacity: {
				get: function (e, t) {
					if (t) {
						var n = w(e, "opacity");
						return "" === n ? "1" : n
					}
				}
			}
		},
		cssNumber: {
			columnCount: !0,
			fillOpacity: !0,
			flexGrow: !0,
			flexShrink: !0,
			fontWeight: !0,
			lineHeight: !0,
			opacity: !0,
			order: !0,
			orphans: !0,
			widows: !0,
			zIndex: !0,
			zoom: !0
		},
		cssProps: {
			"float": "cssFloat"
		},
		style: function (e, t, n, i) {
			if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
				var s, r, a, o = Z.camelCase(t),
					l = e.style;
				return t = Z.cssProps[o] || (Z.cssProps[o] = x(l, o)), a = Z.cssHooks[t] || Z.cssHooks[o], void 0 === n ? a && "get" in a && void 0 !== (s = a.get(e, !1, i)) ? s : l[t] : (r = typeof n, "string" === r && (s = ze.exec(n)) && (n = (s[1] + 1) * s[2] + parseFloat(Z.css(e, t)), r = "number"), void(null != n && n === n && ("number" !== r || Z.cssNumber[o] || (n += "px"), G.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"), a && "set" in a && void 0 === (n = a.set(e, n, i)) || (l[t] = n))))
			}
		},
		css: function (e, t, n, i) {
			var s, r, a, o = Z.camelCase(t);
			return t = Z.cssProps[o] || (Z.cssProps[o] = x(e.style, o)), a = Z.cssHooks[t] || Z.cssHooks[o], a && "get" in a && (s = a.get(e, !0, n)), void 0 === s && (s = w(e, t, i)), "normal" === s && t in Ye && (s = Ye[t]), "" === n || n ? (r = parseFloat(s), n === !0 || Z.isNumeric(r) ? r || 0 : s) : s
		}
	}), Z.each(["height", "width"], function (e, t) {
		Z.cssHooks[t] = {
			get: function (e, n, i) {
				return n ? Ue.test(Z.css(e, "display")) && 0 === e.offsetWidth ? Z.swap(e, Xe, function () {
					return S(e, t, i)
				}) : S(e, t, i) : void 0
			},
			set: function (e, n, i) {
				var s = i && We(e);
				return k(e, n, i ? P(e, t, i, "border-box" === Z.css(e, "boxSizing", !1, s), s) : 0)
			}
		}
	}), Z.cssHooks.marginRight = j(G.reliableMarginRight, function (e, t) {
		return t ? Z.swap(e, {
			display: "inline-block"
		}, w, [e, "marginRight"]) : void 0
	}), Z.each({
		margin: "",
		padding: "",
		border: "Width"
	}, function (e, t) {
		Z.cssHooks[e + t] = {
			expand: function (n) {
				for (var i = 0, s = {}, r = "string" == typeof n ? n.split(" ") : [n]; 4 > i; i++) s[e + je[i] + t] = r[i] || r[i - 2] || r[0];
				return s
			}
		}, Ie.test(e) || (Z.cssHooks[e + t].set = k)
	}), Z.fn.extend({
		css: function (e, t) {
			return ge(this, function (e, t, n) {
				var i, s, r = {},
					a = 0;
				if (Z.isArray(t)) {
					for (i = We(e), s = t.length; s > a; a++) r[t[a]] = Z.css(e, t[a], !1, i);
					return r
				}
				return void 0 !== n ? Z.style(e, t, n) : Z.css(e, t)
			}, e, t, arguments.length > 1)
		},
		show: function () {
			return C(this, !0)
		},
		hide: function () {
			return C(this)
		},
		toggle: function (e) {
			return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function () {
				xe(this) ? Z(this).show() : Z(this).hide()
			})
		}
	}), Z.Tween = E, E.prototype = {
		constructor: E,
		init: function (e, t, n, i, s, r) {
			this.elem = e, this.prop = n, this.easing = s || "swing", this.options = t, this.start = this.now = this.cur(), this.end = i, this.unit = r || (Z.cssNumber[n] ? "" : "px")
		},
		cur: function () {
			var e = E.propHooks[this.prop];
			return e && e.get ? e.get(this) : E.propHooks._default.get(this)
		},
		run: function (e) {
			var t, n = E.propHooks[this.prop];
			return this.options.duration ? this.pos = t = Z.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : E.propHooks._default.set(this), this
		}
	}, E.prototype.init.prototype = E.prototype, E.propHooks = {
		_default: {
			get: function (e) {
				var t;
				return null == e.elem[e.prop] || e.elem.style && null != e.elem.style[e.prop] ? (t = Z.css(e.elem, e.prop, ""), t && "auto" !== t ? t : 0) : e.elem[e.prop]
			},
			set: function (e) {
				Z.fx.step[e.prop] ? Z.fx.step[e.prop](e) : e.elem.style && (null != e.elem.style[Z.cssProps[e.prop]] || Z.cssHooks[e.prop]) ? Z.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
			}
		}
	}, E.propHooks.scrollTop = E.propHooks.scrollLeft = {
		set: function (e) {
			e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
		}
	}, Z.easing = {
		linear: function (e) {
			return e
		},
		swing: function (e) {
			return .5 - Math.cos(e * Math.PI) / 2
		}
	}, Z.fx = E.prototype.init, Z.fx.step = {};
	var Ge, Qe, Ke = /^(?:toggle|show|hide)$/,
		Ze = new RegExp("^(?:([+-])=|)(" + we + ")([a-z%]*)$", "i"),
		et = /queueHooks$/,
		tt = [F],
		nt = {
			"*": [function (e, t) {
				var n = this.createTween(e, t),
					i = n.cur(),
					s = Ze.exec(t),
					r = s && s[3] || (Z.cssNumber[e] ? "" : "px"),
					a = (Z.cssNumber[e] || "px" !== r && +i) && Ze.exec(Z.css(n.elem, e)),
					o = 1,
					l = 20;
				if (a && a[3] !== r) {
					r = r || a[3], s = s || [], a = +i || 1;
					do o = o || ".5", a /= o, Z.style(n.elem, e, a + r); while (o !== (o = n.cur() / i) && 1 !== o && --l)
				}
				return s && (a = n.start = +a || +i || 0, n.unit = r, n.end = s[1] ? a + (s[1] + 1) * s[2] : +s[2]), n
			}]
		};
	Z.Animation = Z.extend(A, {
			tweener: function (e, t) {
				Z.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
				for (var n, i = 0, s = e.length; s > i; i++) n = e[i], nt[n] = nt[n] || [], nt[n].unshift(t)
			},
			prefilter: function (e, t) {
				t ? tt.unshift(e) : tt.push(e)
			}
		}), Z.speed = function (e, t, n) {
			var i = e && "object" == typeof e ? Z.extend({}, e) : {
				complete: n || !n && t || Z.isFunction(e) && e,
				duration: e,
				easing: n && t || t && !Z.isFunction(t) && t
			};
			return i.duration = Z.fx.off ? 0 : "number" == typeof i.duration ? i.duration : i.duration in Z.fx.speeds ? Z.fx.speeds[i.duration] : Z.fx.speeds._default, (null == i.queue || i.queue === !0) && (i.queue = "fx"), i.old = i.complete, i.complete = function () {
				Z.isFunction(i.old) && i.old.call(this), i.queue && Z.dequeue(this, i.queue)
			}, i
		}, Z.fn.extend({
			fadeTo: function (e, t, n, i) {
				return this.filter(xe).css("opacity", 0).show().end().animate({
					opacity: t
				}, e, n, i)
			},
			animate: function (e, t, n, i) {
				var s = Z.isEmptyObject(e),
					r = Z.speed(t, n, i),
					a = function () {
						var t = A(this, Z.extend({}, e), r);
						(s || ve.get(this, "finish")) && t.stop(!0)
					};
				return a.finish = a, s || r.queue === !1 ? this.each(a) : this.queue(r.queue, a)
			},
			stop: function (e, t, n) {
				var i = function (e) {
					var t = e.stop;
					delete e.stop, t(n)
				};
				return "string" != typeof e && (n = t, t = e, e = void 0), t && e !== !1 && this.queue(e || "fx", []), this.each(function () {
					var t = !0,
						s = null != e && e + "queueHooks",
						r = Z.timers,
						a = ve.get(this);
					if (s) a[s] && a[s].stop && i(a[s]);
					else
						for (s in a) a[s] && a[s].stop && et.test(s) && i(a[s]);
					for (s = r.length; s--;) r[s].elem !== this || null != e && r[s].queue !== e || (r[s].anim.stop(n), t = !1, r.splice(s, 1));
					(t || !n) && Z.dequeue(this, e)
				})
			},
			finish: function (e) {
				return e !== !1 && (e = e || "fx"), this.each(function () {
					var t, n = ve.get(this),
						i = n[e + "queue"],
						s = n[e + "queueHooks"],
						r = Z.timers,
						a = i ? i.length : 0;
					for (n.finish = !0, Z.queue(this, e, []),
						s && s.stop && s.stop.call(this, !0), t = r.length; t--;) r[t].elem === this && r[t].queue === e && (r[t].anim.stop(!0), r.splice(t, 1));
					for (t = 0; a > t; t++) i[t] && i[t].finish && i[t].finish.call(this);
					delete n.finish
				})
			}
		}), Z.each(["toggle", "show", "hide"], function (e, t) {
			var n = Z.fn[t];
			Z.fn[t] = function (e, i, s) {
				return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(q(t, !0), e, i, s)
			}
		}), Z.each({
			slideDown: q("show"),
			slideUp: q("hide"),
			slideToggle: q("toggle"),
			fadeIn: {
				opacity: "show"
			},
			fadeOut: {
				opacity: "hide"
			},
			fadeToggle: {
				opacity: "toggle"
			}
		}, function (e, t) {
			Z.fn[e] = function (e, n, i) {
				return this.animate(t, e, n, i)
			}
		}), Z.timers = [], Z.fx.tick = function () {
			var e, t = 0,
				n = Z.timers;
			for (Ge = Z.now(); t < n.length; t++) e = n[t], e() || n[t] !== e || n.splice(t--, 1);
			n.length || Z.fx.stop(), Ge = void 0
		}, Z.fx.timer = function (e) {
			Z.timers.push(e), e() ? Z.fx.start() : Z.timers.pop()
		}, Z.fx.interval = 13, Z.fx.start = function () {
			Qe || (Qe = setInterval(Z.fx.tick, Z.fx.interval))
		}, Z.fx.stop = function () {
			clearInterval(Qe), Qe = null
		}, Z.fx.speeds = {
			slow: 600,
			fast: 200,
			_default: 400
		}, Z.fn.delay = function (e, t) {
			return e = Z.fx ? Z.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function (t, n) {
				var i = setTimeout(t, e);
				n.stop = function () {
					clearTimeout(i)
				}
			})
		},
		function () {
			var e = Q.createElement("input"),
				t = Q.createElement("select"),
				n = t.appendChild(Q.createElement("option"));
			e.type = "checkbox", G.checkOn = "" !== e.value, G.optSelected = n.selected, t.disabled = !0, G.optDisabled = !n.disabled, e = Q.createElement("input"), e.value = "t", e.type = "radio", G.radioValue = "t" === e.value
		}();
	var it, st, rt = Z.expr.attrHandle;
	Z.fn.extend({
		attr: function (e, t) {
			return ge(this, Z.attr, e, t, arguments.length > 1)
		},
		removeAttr: function (e) {
			return this.each(function () {
				Z.removeAttr(this, e)
			})
		}
	}), Z.extend({
		attr: function (e, t, n) {
			var i, s, r = e.nodeType;
			return e && 3 !== r && 8 !== r && 2 !== r ? typeof e.getAttribute === Pe ? Z.prop(e, t, n) : (1 === r && Z.isXMLDoc(e) || (t = t.toLowerCase(), i = Z.attrHooks[t] || (Z.expr.match.bool.test(t) ? st : it)), void 0 === n ? i && "get" in i && null !== (s = i.get(e, t)) ? s : (s = Z.find.attr(e, t), null == s ? void 0 : s) : null !== n ? i && "set" in i && void 0 !== (s = i.set(e, n, t)) ? s : (e.setAttribute(t, n + ""), n) : void Z.removeAttr(e, t)) : void 0
		},
		removeAttr: function (e, t) {
			var n, i, s = 0,
				r = t && t.match(pe);
			if (r && 1 === e.nodeType)
				for (; n = r[s++];) i = Z.propFix[n] || n, Z.expr.match.bool.test(n) && (e[i] = !1), e.removeAttribute(n)
		},
		attrHooks: {
			type: {
				set: function (e, t) {
					if (!G.radioValue && "radio" === t && Z.nodeName(e, "input")) {
						var n = e.value;
						return e.setAttribute("type", t), n && (e.value = n), t
					}
				}
			}
		}
	}), st = {
		set: function (e, t, n) {
			return t === !1 ? Z.removeAttr(e, n) : e.setAttribute(n, n), n
		}
	}, Z.each(Z.expr.match.bool.source.match(/\w+/g), function (e, t) {
		var n = rt[t] || Z.find.attr;
		rt[t] = function (e, t, i) {
			var s, r;
			return i || (r = rt[t], rt[t] = s, s = null != n(e, t, i) ? t.toLowerCase() : null, rt[t] = r), s
		}
	});
	var at = /^(?:input|select|textarea|button)$/i;
	Z.fn.extend({
		prop: function (e, t) {
			return ge(this, Z.prop, e, t, arguments.length > 1)
		},
		removeProp: function (e) {
			return this.each(function () {
				delete this[Z.propFix[e] || e]
			})
		}
	}), Z.extend({
		propFix: {
			"for": "htmlFor",
			"class": "className"
		},
		prop: function (e, t, n) {
			var i, s, r, a = e.nodeType;
			return e && 3 !== a && 8 !== a && 2 !== a ? (r = 1 !== a || !Z.isXMLDoc(e), r && (t = Z.propFix[t] || t, s = Z.propHooks[t]), void 0 !== n ? s && "set" in s && void 0 !== (i = s.set(e, n, t)) ? i : e[t] = n : s && "get" in s && null !== (i = s.get(e, t)) ? i : e[t]) : void 0
		},
		propHooks: {
			tabIndex: {
				get: function (e) {
					return e.hasAttribute("tabindex") || at.test(e.nodeName) || e.href ? e.tabIndex : -1
				}
			}
		}
	}), G.optSelected || (Z.propHooks.selected = {
		get: function (e) {
			var t = e.parentNode;
			return t && t.parentNode && t.parentNode.selectedIndex, null
		}
	}), Z.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function () {
		Z.propFix[this.toLowerCase()] = this
	});
	var ot = /[\t\r\n\f]/g;
	Z.fn.extend({
		addClass: function (e) {
			var t, n, i, s, r, a, o = "string" == typeof e && e,
				l = 0,
				u = this.length;
			if (Z.isFunction(e)) return this.each(function (t) {
				Z(this).addClass(e.call(this, t, this.className))
			});
			if (o)
				for (t = (e || "").match(pe) || []; u > l; l++)
					if (n = this[l], i = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(ot, " ") : " ")) {
						for (r = 0; s = t[r++];) i.indexOf(" " + s + " ") < 0 && (i += s + " ");
						a = Z.trim(i), n.className !== a && (n.className = a)
					}
			return this
		},
		removeClass: function (e) {
			var t, n, i, s, r, a, o = 0 === arguments.length || "string" == typeof e && e,
				l = 0,
				u = this.length;
			if (Z.isFunction(e)) return this.each(function (t) {
				Z(this).removeClass(e.call(this, t, this.className))
			});
			if (o)
				for (t = (e || "").match(pe) || []; u > l; l++)
					if (n = this[l], i = 1 === n.nodeType && (n.className ? (" " + n.className + " ").replace(ot, " ") : "")) {
						for (r = 0; s = t[r++];)
							for (; i.indexOf(" " + s + " ") >= 0;) i = i.replace(" " + s + " ", " ");
						a = e ? Z.trim(i) : "", n.className !== a && (n.className = a)
					}
			return this
		},
		toggleClass: function (e, t) {
			var n = typeof e;
			return "boolean" == typeof t && "string" === n ? t ? this.addClass(e) : this.removeClass(e) : this.each(Z.isFunction(e) ? function (n) {
				Z(this).toggleClass(e.call(this, n, this.className, t), t)
			} : function () {
				if ("string" === n)
					for (var t, i = 0, s = Z(this), r = e.match(pe) || []; t = r[i++];) s.hasClass(t) ? s.removeClass(t) : s.addClass(t);
				else(n === Pe || "boolean" === n) && (this.className && ve.set(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : ve.get(this, "__className__") || "")
			})
		},
		hasClass: function (e) {
			for (var t = " " + e + " ", n = 0, i = this.length; i > n; n++)
				if (1 === this[n].nodeType && (" " + this[n].className + " ").replace(ot, " ").indexOf(t) >= 0) return !0;
			return !1
		}
	});
	var lt = /\r/g;
	Z.fn.extend({
		val: function (e) {
			var t, n, i, s = this[0];
			return arguments.length ? (i = Z.isFunction(e), this.each(function (n) {
				var s;
				1 === this.nodeType && (s = i ? e.call(this, n, Z(this).val()) : e, null == s ? s = "" : "number" == typeof s ? s += "" : Z.isArray(s) && (s = Z.map(s, function (e) {
					return null == e ? "" : e + ""
				})), t = Z.valHooks[this.type] || Z.valHooks[this.nodeName.toLowerCase()], t && "set" in t && void 0 !== t.set(this, s, "value") || (this.value = s))
			})) : s ? (t = Z.valHooks[s.type] || Z.valHooks[s.nodeName.toLowerCase()], t && "get" in t && void 0 !== (n = t.get(s, "value")) ? n : (n = s.value, "string" == typeof n ? n.replace(lt, "") : null == n ? "" : n)) : void 0
		}
	}), Z.extend({
		valHooks: {
			option: {
				get: function (e) {
					var t = Z.find.attr(e, "value");
					return null != t ? t : Z.trim(Z.text(e))
				}
			},
			select: {
				get: function (e) {
					for (var t, n, i = e.options, s = e.selectedIndex, r = "select-one" === e.type || 0 > s, a = r ? null : [], o = r ? s + 1 : i.length, l = 0 > s ? o : r ? s : 0; o > l; l++)
						if (n = i[l], !(!n.selected && l !== s || (G.optDisabled ? n.disabled : null !== n.getAttribute("disabled")) || n.parentNode.disabled && Z.nodeName(n.parentNode, "optgroup"))) {
							if (t = Z(n).val(), r) return t;
							a.push(t)
						}
					return a
				},
				set: function (e, t) {
					for (var n, i, s = e.options, r = Z.makeArray(t), a = s.length; a--;) i = s[a], (i.selected = Z.inArray(i.value, r) >= 0) && (n = !0);
					return n || (e.selectedIndex = -1), r
				}
			}
		}
	}), Z.each(["radio", "checkbox"], function () {
		Z.valHooks[this] = {
			set: function (e, t) {
				return Z.isArray(t) ? e.checked = Z.inArray(Z(e).val(), t) >= 0 : void 0
			}
		}, G.checkOn || (Z.valHooks[this].get = function (e) {
			return null === e.getAttribute("value") ? "on" : e.value
		})
	}), Z.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (e, t) {
		Z.fn[t] = function (e, n) {
			return arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
		}
	}), Z.fn.extend({
		hover: function (e, t) {
			return this.mouseenter(e).mouseleave(t || e)
		},
		bind: function (e, t, n) {
			return this.on(e, null, t, n)
		},
		unbind: function (e, t) {
			return this.off(e, null, t)
		},
		delegate: function (e, t, n, i) {
			return this.on(t, e, n, i)
		},
		undelegate: function (e, t, n) {
			return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
		}
	});
	var ut = Z.now(),
		ct = /\?/;
	Z.parseJSON = function (e) {
		return JSON.parse(e + "")
	}, Z.parseXML = function (e) {
		var t, n;
		if (!e || "string" != typeof e) return null;
		try {
			n = new DOMParser, t = n.parseFromString(e, "text/xml")
		} catch (i) {
			t = void 0
		}
		return (!t || t.getElementsByTagName("parsererror").length) && Z.error("Invalid XML: " + e), t
	};
	var ht = /#.*$/,
		dt = /([?&])_=[^&]*/,
		pt = /^(.*?):[ \t]*([^\r\n]*)$/gm,
		ft = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
		mt = /^(?:GET|HEAD)$/,
		gt = /^\/\//,
		vt = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
		yt = {},
		bt = {},
		_t = "*/".concat("*"),
		wt = e.location.href,
		jt = vt.exec(wt.toLowerCase()) || [];
	Z.extend({
		active: 0,
		lastModified: {},
		etag: {},
		ajaxSettings: {
			url: wt,
			type: "GET",
			isLocal: ft.test(jt[1]),
			global: !0,
			processData: !0,
			async: !0,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			accepts: {
				"*": _t,
				text: "text/plain",
				html: "text/html",
				xml: "application/xml, text/xml",
				json: "application/json, text/javascript"
			},
			contents: {
				xml: /xml/,
				html: /html/,
				json: /json/
			},
			responseFields: {
				xml: "responseXML",
				text: "responseText",
				json: "responseJSON"
			},
			converters: {
				"* text": String,
				"text html": !0,
				"text json": Z.parseJSON,
				"text xml": Z.parseXML
			},
			flatOptions: {
				url: !0,
				context: !0
			}
		},
		ajaxSetup: function (e, t) {
			return t ? M(M(e, Z.ajaxSettings), t) : M(Z.ajaxSettings, e)
		},
		ajaxPrefilter: R(yt),
		ajaxTransport: R(bt),
		ajax: function (e, t) {
			function n(e, t, n, a) {
				var l, c, v, y, _, j = t;
				2 !== b && (b = 2, o && clearTimeout(o), i = void 0, r = a || "", w.readyState = e > 0 ? 4 : 0, l = e >= 200 && 300 > e || 304 === e, n && (y = D(h, w, n)), y = H(h, y, w, l), l ? (h.ifModified && (_ = w.getResponseHeader("Last-Modified"), _ && (Z.lastModified[s] = _), _ = w.getResponseHeader("etag"), _ && (Z.etag[s] = _)), 204 === e || "HEAD" === h.type ? j = "nocontent" : 304 === e ? j = "notmodified" : (j = y.state, c = y.data, v = y.error, l = !v)) : (v = j, (e || !j) && (j = "error", 0 > e && (e = 0))), w.status = e, w.statusText = (t || j) + "", l ? f.resolveWith(d, [c, j, w]) : f.rejectWith(d, [w, j, v]), w.statusCode(g), g = void 0, u && p.trigger(l ? "ajaxSuccess" : "ajaxError", [w, h, l ? c : v]), m.fireWith(d, [w, j]), u && (p.trigger("ajaxComplete", [w, h]), --Z.active || Z.event.trigger("ajaxStop")))
			}
			"object" == typeof e && (t = e, e = void 0), t = t || {};
			var i, s, r, a, o, l, u, c, h = Z.ajaxSetup({}, t),
				d = h.context || h,
				p = h.context && (d.nodeType || d.jquery) ? Z(d) : Z.event,
				f = Z.Deferred(),
				m = Z.Callbacks("once memory"),
				g = h.statusCode || {},
				v = {},
				y = {},
				b = 0,
				_ = "canceled",
				w = {
					readyState: 0,
					getResponseHeader: function (e) {
						var t;
						if (2 === b) {
							if (!a)
								for (a = {}; t = pt.exec(r);) a[t[1].toLowerCase()] = t[2];
							t = a[e.toLowerCase()]
						}
						return null == t ? null : t
					},
					getAllResponseHeaders: function () {
						return 2 === b ? r : null
					},
					setRequestHeader: function (e, t) {
						var n = e.toLowerCase();
						return b || (e = y[n] = y[n] || e, v[e] = t), this
					},
					overrideMimeType: function (e) {
						return b || (h.mimeType = e), this
					},
					statusCode: function (e) {
						var t;
						if (e)
							if (2 > b)
								for (t in e) g[t] = [g[t], e[t]];
							else w.always(e[w.status]);
						return this
					},
					abort: function (e) {
						var t = e || _;
						return i && i.abort(t), n(0, t), this
					}
				};
			if (f.promise(w).complete = m.add, w.success = w.done, w.error = w.fail, h.url = ((e || h.url || wt) + "").replace(ht, "").replace(gt, jt[1] + "//"), h.type = t.method || t.type || h.method || h.type, h.dataTypes = Z.trim(h.dataType || "*").toLowerCase().match(pe) || [""], null == h.crossDomain && (l = vt.exec(h.url.toLowerCase()), h.crossDomain = !(!l || l[1] === jt[1] && l[2] === jt[2] && (l[3] || ("http:" === l[1] ? "80" : "443")) === (jt[3] || ("http:" === jt[1] ? "80" : "443")))), h.data && h.processData && "string" != typeof h.data && (h.data = Z.param(h.data, h.traditional)), O(yt, h, t, w), 2 === b) return w;
			u = Z.event && h.global, u && 0 === Z.active++ && Z.event.trigger("ajaxStart"), h.type = h.type.toUpperCase(), h.hasContent = !mt.test(h.type), s = h.url, h.hasContent || (h.data && (s = h.url += (ct.test(s) ? "&" : "?") + h.data, delete h.data), h.cache === !1 && (h.url = dt.test(s) ? s.replace(dt, "$1_=" + ut++) : s + (ct.test(s) ? "&" : "?") + "_=" + ut++)), h.ifModified && (Z.lastModified[s] && w.setRequestHeader("If-Modified-Since", Z.lastModified[s]), Z.etag[s] && w.setRequestHeader("If-None-Match", Z.etag[s])), (h.data && h.hasContent && h.contentType !== !1 || t.contentType) && w.setRequestHeader("Content-Type", h.contentType), w.setRequestHeader("Accept", h.dataTypes[0] && h.accepts[h.dataTypes[0]] ? h.accepts[h.dataTypes[0]] + ("*" !== h.dataTypes[0] ? ", " + _t + "; q=0.01" : "") : h.accepts["*"]);
			for (c in h.headers) w.setRequestHeader(c, h.headers[c]);
			if (h.beforeSend && (h.beforeSend.call(d, w, h) === !1 || 2 === b)) return w.abort();
			_ = "abort";
			for (c in {
					success: 1,
					error: 1,
					complete: 1
				}) w[c](h[c]);
			if (i = O(bt, h, t, w)) {
				w.readyState = 1, u && p.trigger("ajaxSend", [w, h]), h.async && h.timeout > 0 && (o = setTimeout(function () {
					w.abort("timeout")
				}, h.timeout));
				try {
					b = 1, i.send(v, n)
				} catch (j) {
					if (!(2 > b)) throw j;
					n(-1, j)
				}
			} else n(-1, "No Transport");
			return w
		},
		getJSON: function (e, t, n) {
			return Z.get(e, t, n, "json")
		},
		getScript: function (e, t) {
			return Z.get(e, void 0, t, "script")
		}
	}), Z.each(["get", "post"], function (e, t) {
		Z[t] = function (e, n, i, s) {
			return Z.isFunction(n) && (s = s || i, i = n, n = void 0), Z.ajax({
				url: e,
				type: t,
				dataType: s,
				data: n,
				success: i
			})
		}
	}), Z._evalUrl = function (e) {
		return Z.ajax({
			url: e,
			type: "GET",
			dataType: "script",
			async: !1,
			global: !1,
			"throws": !0
		})
	}, Z.fn.extend({
		wrapAll: function (e) {
			var t;
			return Z.isFunction(e) ? this.each(function (t) {
				Z(this).wrapAll(e.call(this, t))
			}) : (this[0] && (t = Z(e, this[0].ownerDocument).eq(0).clone(!0), this[0].parentNode && t.insertBefore(this[0]), t.map(function () {
				for (var e = this; e.firstElementChild;) e = e.firstElementChild;
				return e
			}).append(this)), this)
		},
		wrapInner: function (e) {
			return this.each(Z.isFunction(e) ? function (t) {
				Z(this).wrapInner(e.call(this, t))
			} : function () {
				var t = Z(this),
					n = t.contents();
				n.length ? n.wrapAll(e) : t.append(e)
			})
		},
		wrap: function (e) {
			var t = Z.isFunction(e);
			return this.each(function (n) {
				Z(this).wrapAll(t ? e.call(this, n) : e)
			})
		},
		unwrap: function () {
			return this.parent().each(function () {
				Z.nodeName(this, "body") || Z(this).replaceWith(this.childNodes)
			}).end()
		}
	}), Z.expr.filters.hidden = function (e) {
		return e.offsetWidth <= 0 && e.offsetHeight <= 0
	}, Z.expr.filters.visible = function (e) {
		return !Z.expr.filters.hidden(e)
	};
	var xt = /%20/g,
		kt = /\[\]$/,
		Pt = /\r?\n/g,
		St = /^(?:submit|button|image|reset|file)$/i,
		Ct = /^(?:input|select|textarea|keygen)/i;
	Z.param = function (e, t) {
		var n, i = [],
			s = function (e, t) {
				t = Z.isFunction(t) ? t() : null == t ? "" : t, i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
			};
		if (void 0 === t && (t = Z.ajaxSettings && Z.ajaxSettings.traditional), Z.isArray(e) || e.jquery && !Z.isPlainObject(e)) Z.each(e, function () {
			s(this.name, this.value)
		});
		else
			for (n in e) B(n, e[n], t, s);
		return i.join("&").replace(xt, "+")
	}, Z.fn.extend({
		serialize: function () {
			return Z.param(this.serializeArray())
		},
		serializeArray: function () {
			return this.map(function () {
				var e = Z.prop(this, "elements");
				return e ? Z.makeArray(e) : this
			}).filter(function () {
				var e = this.type;
				return this.name && !Z(this).is(":disabled") && Ct.test(this.nodeName) && !St.test(e) && (this.checked || !ke.test(e))
			}).map(function (e, t) {
				var n = Z(this).val();
				return null == n ? null : Z.isArray(n) ? Z.map(n, function (e) {
					return {
						name: t.name,
						value: e.replace(Pt, "\r\n")
					}
				}) : {
					name: t.name,
					value: n.replace(Pt, "\r\n")
				}
			}).get()
		}
	}), Z.ajaxSettings.xhr = function () {
		try {
			return new XMLHttpRequest
		} catch (e) {}
	};
	var Et = 0,
		Tt = {},
		qt = {
			0: 200,
			1223: 204
		},
		Nt = Z.ajaxSettings.xhr();
	e.attachEvent && e.attachEvent("onunload", function () {
		for (var e in Tt) Tt[e]()
	}), G.cors = !!Nt && "withCredentials" in Nt, G.ajax = Nt = !!Nt, Z.ajaxTransport(function (e) {
		var t;
		return G.cors || Nt && !e.crossDomain ? {
			send: function (n, i) {
				var s, r = e.xhr(),
					a = ++Et;
				if (r.open(e.type, e.url, e.async, e.username, e.password), e.xhrFields)
					for (s in e.xhrFields) r[s] = e.xhrFields[s];
				e.mimeType && r.overrideMimeType && r.overrideMimeType(e.mimeType), e.crossDomain || n["X-Requested-With"] || (n["X-Requested-With"] = "XMLHttpRequest");
				for (s in n) r.setRequestHeader(s, n[s]);
				t = function (e) {
					return function () {
						t && (delete Tt[a], t = r.onload = r.onerror = null, "abort" === e ? r.abort() : "error" === e ? i(r.status, r.statusText) : i(qt[r.status] || r.status, r.statusText, "string" == typeof r.responseText ? {
							text: r.responseText
						} : void 0, r.getAllResponseHeaders()))
					}
				}, r.onload = t(), r.onerror = t("error"), t = Tt[a] = t("abort");
				try {
					r.send(e.hasContent && e.data || null)
				} catch (o) {
					if (t) throw o
				}
			},
			abort: function () {
				t && t()
			}
		} : void 0
	}), Z.ajaxSetup({
		accepts: {
			script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
		},
		contents: {
			script: /(?:java|ecma)script/
		},
		converters: {
			"text script": function (e) {
				return Z.globalEval(e), e
			}
		}
	}), Z.ajaxPrefilter("script", function (e) {
		void 0 === e.cache && (e.cache = !1), e.crossDomain && (e.type = "GET")
	}), Z.ajaxTransport("script", function (e) {
		if (e.crossDomain) {
			var t, n;
			return {
				send: function (i, s) {
					t = Z("<script>").prop({
						async: !0,
						charset: e.scriptCharset,
						src: e.url
					}).on("load error", n = function (e) {
						t.remove(), n = null, e && s("error" === e.type ? 404 : 200, e.type)
					}), Q.head.appendChild(t[0])
				},
				abort: function () {
					n && n()
				}
			}
		}
	});
	var Ft = [],
		Lt = /(=)\?(?=&|$)|\?\?/;
	Z.ajaxSetup({
		jsonp: "callback",
		jsonpCallback: function () {
			var e = Ft.pop() || Z.expando + "_" + ut++;
			return this[e] = !0, e
		}
	}), Z.ajaxPrefilter("json jsonp", function (t, n, i) {
		var s, r, a, o = t.jsonp !== !1 && (Lt.test(t.url) ? "url" : "string" == typeof t.data && !(t.contentType || "").indexOf("application/x-www-form-urlencoded") && Lt.test(t.data) && "data");
		return o || "jsonp" === t.dataTypes[0] ? (s = t.jsonpCallback = Z.isFunction(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback, o ? t[o] = t[o].replace(Lt, "$1" + s) : t.jsonp !== !1 && (t.url += (ct.test(t.url) ? "&" : "?") + t.jsonp + "=" + s), t.converters["script json"] = function () {
			return a || Z.error(s + " was not called"), a[0]
		}, t.dataTypes[0] = "json", r = e[s], e[s] = function () {
			a = arguments
		}, i.always(function () {
			e[s] = r, t[s] && (t.jsonpCallback = n.jsonpCallback, Ft.push(s)), a && Z.isFunction(r) && r(a[0]), a = r = void 0
		}), "script") : void 0
	}), Z.parseHTML = function (e, t, n) {
		if (!e || "string" != typeof e) return null;
		"boolean" == typeof t && (n = t, t = !1), t = t || Q;
		var i = ae.exec(e),
			s = !n && [];
		return i ? [t.createElement(i[1])] : (i = Z.buildFragment([e], t, s), s && s.length && Z(s).remove(), Z.merge([], i.childNodes))
	};
	var At = Z.fn.load;
	Z.fn.load = function (e, t, n) {
		if ("string" != typeof e && At) return At.apply(this, arguments);
		var i, s, r, a = this,
			o = e.indexOf(" ");
		return o >= 0 && (i = Z.trim(e.slice(o)), e = e.slice(0, o)), Z.isFunction(t) ? (n = t, t = void 0) : t && "object" == typeof t && (s = "POST"), a.length > 0 && Z.ajax({
			url: e,
			type: s,
			dataType: "html",
			data: t
		}).done(function (e) {
			r = arguments, a.html(i ? Z("<div>").append(Z.parseHTML(e)).find(i) : e)
		}).complete(n && function (e, t) {
			a.each(n, r || [e.responseText, t, e])
		}), this
	}, Z.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function (e, t) {
		Z.fn[t] = function (e) {
			return this.on(t, e)
		}
	}), Z.expr.filters.animated = function (e) {
		return Z.grep(Z.timers, function (t) {
			return e === t.elem
		}).length
	};
	var Rt = e.document.documentElement;
	Z.offset = {
		setOffset: function (e, t, n) {
			var i, s, r, a, o, l, u, c = Z.css(e, "position"),
				h = Z(e),
				d = {};
			"static" === c && (e.style.position = "relative"), o = h.offset(), r = Z.css(e, "top"), l = Z.css(e, "left"), u = ("absolute" === c || "fixed" === c) && (r + l).indexOf("auto") > -1, u ? (i = h.position(), a = i.top, s = i.left) : (a = parseFloat(r) || 0, s = parseFloat(l) || 0), Z.isFunction(t) && (t = t.call(e, n, o)), null != t.top && (d.top = t.top - o.top + a), null != t.left && (d.left = t.left - o.left + s), "using" in t ? t.using.call(e, d) : h.css(d)
		}
	}, Z.fn.extend({
		offset: function (e) {
			if (arguments.length) return void 0 === e ? this : this.each(function (t) {
				Z.offset.setOffset(this, e, t)
			});
			var t, n, i = this[0],
				s = {
					top: 0,
					left: 0
				},
				r = i && i.ownerDocument;
			return r ? (t = r.documentElement, Z.contains(t, i) ? (typeof i.getBoundingClientRect !== Pe && (s = i.getBoundingClientRect()), n = I(r), {
				top: s.top + n.pageYOffset - t.clientTop,
				left: s.left + n.pageXOffset - t.clientLeft
			}) : s) : void 0
		},
		position: function () {
			if (this[0]) {
				var e, t, n = this[0],
					i = {
						top: 0,
						left: 0
					};
				return "fixed" === Z.css(n, "position") ? t = n.getBoundingClientRect() : (e = this.offsetParent(), t = this.offset(), Z.nodeName(e[0], "html") || (i = e.offset()), i.top += Z.css(e[0], "borderTopWidth", !0), i.left += Z.css(e[0], "borderLeftWidth", !0)), {
					top: t.top - i.top - Z.css(n, "marginTop", !0),
					left: t.left - i.left - Z.css(n, "marginLeft", !0)
				}
			}
		},
		offsetParent: function () {
			return this.map(function () {
				for (var e = this.offsetParent || Rt; e && !Z.nodeName(e, "html") && "static" === Z.css(e, "position");) e = e.offsetParent;
				return e || Rt
			})
		}
	}), Z.each({
		scrollLeft: "pageXOffset",
		scrollTop: "pageYOffset"
	}, function (t, n) {
		var i = "pageYOffset" === n;
		Z.fn[t] = function (s) {
			return ge(this, function (t, s, r) {
				var a = I(t);
				return void 0 === r ? a ? a[n] : t[s] : void(a ? a.scrollTo(i ? e.pageXOffset : r, i ? r : e.pageYOffset) : t[s] = r)
			}, t, s, arguments.length, null)
		}
	}), Z.each(["top", "left"], function (e, t) {
		Z.cssHooks[t] = j(G.pixelPosition, function (e, n) {
			return n ? (n = w(e, t), Ve.test(n) ? Z(e).position()[t] + "px" : n) : void 0
		})
	}), Z.each({
		Height: "height",
		Width: "width"
	}, function (e, t) {
		Z.each({
			padding: "inner" + e,
			content: t,
			"": "outer" + e
		}, function (n, i) {
			Z.fn[i] = function (i, s) {
				var r = arguments.length && (n || "boolean" != typeof i),
					a = n || (i === !0 || s === !0 ? "margin" : "border");
				return ge(this, function (t, n, i) {
					var s;
					return Z.isWindow(t) ? t.document.documentElement["client" + e] : 9 === t.nodeType ? (s = t.documentElement, Math.max(t.body["scroll" + e], s["scroll" + e], t.body["offset" + e], s["offset" + e], s["client" + e])) : void 0 === i ? Z.css(t, n, a) : Z.style(t, n, i, a)
				}, t, r ? i : void 0, r, null)
			}
		})
	}), Z.fn.size = function () {
		return this.length
	}, Z.fn.andSelf = Z.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function () {
		return Z
	});
	var Ot = e.jQuery,
		Mt = e.$;
	return Z.noConflict = function (t) {
		return e.$ === Z && (e.$ = Mt), t && e.jQuery === Z && (e.jQuery = Ot), Z
	}, typeof t === Pe && (e.jQuery = e.$ = Z), Z
}), /*! jPlayer 2.9.2 for jQuery ~ (c) 2009-2014 Happyworm Ltd ~ MIT License */ ! function (e, t) {
	"function" == typeof define && define.amd ? define(["jquery"], t) : t("object" == typeof exports ? require("jquery") : e.jQuery ? e.jQuery : e.Zepto)
}(this, function (e, t) {
	e.fn.jPlayer = function (n) {
		var i = "jPlayer",
			s = "string" == typeof n,
			r = Array.prototype.slice.call(arguments, 1),
			a = this;
		return n = !s && r.length ? e.extend.apply(null, [!0, n].concat(r)) : n, s && "_" === n.charAt(0) ? a : (this.each(s ? function () {
			var s = e(this).data(i),
				o = s && e.isFunction(s[n]) ? s[n].apply(s, r) : s;
			return o !== s && o !== t ? (a = o, !1) : void 0
		} : function () {
			var t = e(this).data(i);
			t ? t.option(n || {}) : e(this).data(i, new e.jPlayer(n, this))
		}), a)
	}, e.jPlayer = function (t, n) {
		if (arguments.length) {
			this.element = e(n), this.options = e.extend(!0, {}, this.options, t);
			var i = this;
			this.element.bind("remove.jPlayer", function () {
				i.destroy()
			}), this._init()
		}
	}, "function" != typeof e.fn.stop && (e.fn.stop = function () {}), e.jPlayer.emulateMethods = "load play pause", e.jPlayer.emulateStatus = "src readyState networkState currentTime duration paused ended playbackRate", e.jPlayer.emulateOptions = "muted volume", e.jPlayer.reservedEvent = "ready flashreset resize repeat error warning", e.jPlayer.event = {}, e.each(["ready", "setmedia", "flashreset", "resize", "repeat", "click", "error", "warning", "loadstart", "progress", "suspend", "abort", "emptied", "stalled", "play", "pause", "loadedmetadata", "loadeddata", "waiting", "playing", "canplay", "canplaythrough", "seeking", "seeked", "timeupdate", "ended", "ratechange", "durationchange", "volumechange"], function () {
		e.jPlayer.event[this] = "jPlayer_" + this
	}), e.jPlayer.htmlEvent = ["loadstart", "abort", "emptied", "stalled", "loadedmetadata", "canplay", "canplaythrough"], e.jPlayer.pause = function () {
		e.jPlayer.prototype.destroyRemoved(), e.each(e.jPlayer.prototype.instances, function (e, t) {
			t.data("jPlayer").status.srcSet && t.jPlayer("pause")
		})
	}, e.jPlayer.timeFormat = {
		showHour: !1,
		showMin: !0,
		showSec: !0,
		padHour: !1,
		padMin: !0,
		padSec: !0,
		sepHour: ":",
		sepMin: ":",
		sepSec: ""
	};
	var n = function () {
		this.init()
	};
	n.prototype = {
		init: function () {
			this.options = {
				timeFormat: e.jPlayer.timeFormat
			}
		},
		time: function (e) {
			e = e && "number" == typeof e ? e : 0;
			var t = new Date(1e3 * e),
				n = t.getUTCHours(),
				i = this.options.timeFormat.showHour ? t.getUTCMinutes() : t.getUTCMinutes() + 60 * n,
				s = this.options.timeFormat.showMin ? t.getUTCSeconds() : t.getUTCSeconds() + 60 * i,
				r = this.options.timeFormat.padHour && 10 > n ? "0" + n : n,
				a = this.options.timeFormat.padMin && 10 > i ? "0" + i : i,
				o = this.options.timeFormat.padSec && 10 > s ? "0" + s : s,
				l = "";
			return l += this.options.timeFormat.showHour ? r + this.options.timeFormat.sepHour : "", l += this.options.timeFormat.showMin ? a + this.options.timeFormat.sepMin : "", l += this.options.timeFormat.showSec ? o + this.options.timeFormat.sepSec : ""
		}
	};
	var i = new n;
	e.jPlayer.convertTime = function (e) {
		return i.time(e)
	}, e.jPlayer.uaBrowser = function (e) {
		var t = e.toLowerCase(),
			n = /(webkit)[ \/]([\w.]+)/,
			i = /(opera)(?:.*version)?[ \/]([\w.]+)/,
			s = /(msie) ([\w.]+)/,
			r = /(mozilla)(?:.*? rv:([\w.]+))?/,
			a = n.exec(t) || i.exec(t) || s.exec(t) || t.indexOf("compatible") < 0 && r.exec(t) || [];
		return {
			browser: a[1] || "",
			version: a[2] || "0"
		}
	}, e.jPlayer.uaPlatform = function (e) {
		var t = e.toLowerCase(),
			n = /(ipad|iphone|ipod|android|blackberry|playbook|windows ce|webos)/,
			i = /(ipad|playbook)/,
			s = /(android)/,
			r = /(mobile)/,
			a = n.exec(t) || [],
			o = i.exec(t) || !r.exec(t) && s.exec(t) || [];
		return a[1] && (a[1] = a[1].replace(/\s/g, "_")), {
			platform: a[1] || "",
			tablet: o[1] || ""
		}
	}, e.jPlayer.browser = {}, e.jPlayer.platform = {};
	var s = e.jPlayer.uaBrowser(navigator.userAgent);
	s.browser && (e.jPlayer.browser[s.browser] = !0, e.jPlayer.browser.version = s.version);
	var r = e.jPlayer.uaPlatform(navigator.userAgent);
	r.platform && (e.jPlayer.platform[r.platform] = !0, e.jPlayer.platform.mobile = !r.tablet, e.jPlayer.platform.tablet = !!r.tablet), e.jPlayer.getDocMode = function () {
		var t;
		return e.jPlayer.browser.msie && (document.documentMode ? t = document.documentMode : (t = 5, document.compatMode && "CSS1Compat" === document.compatMode && (t = 7))), t
	}, e.jPlayer.browser.documentMode = e.jPlayer.getDocMode(), e.jPlayer.nativeFeatures = {
		init: function () {
			var e, t, n, i = document,
				s = i.createElement("video"),
				r = {
					w3c: ["fullscreenEnabled", "fullscreenElement", "requestFullscreen", "exitFullscreen", "fullscreenchange", "fullscreenerror"],
					moz: ["mozFullScreenEnabled", "mozFullScreenElement", "mozRequestFullScreen", "mozCancelFullScreen", "mozfullscreenchange", "mozfullscreenerror"],
					webkit: ["", "webkitCurrentFullScreenElement", "webkitRequestFullScreen", "webkitCancelFullScreen", "webkitfullscreenchange", ""],
					webkitVideo: ["webkitSupportsFullscreen", "webkitDisplayingFullscreen", "webkitEnterFullscreen", "webkitExitFullscreen", "", ""],
					ms: ["", "msFullscreenElement", "msRequestFullscreen", "msExitFullscreen", "MSFullscreenChange", "MSFullscreenError"]
				},
				a = ["w3c", "moz", "webkit", "webkitVideo", "ms"];
			for (this.fullscreen = e = {
					support: {
						w3c: !!i[r.w3c[0]],
						moz: !!i[r.moz[0]],
						webkit: "function" == typeof i[r.webkit[3]],
						webkitVideo: "function" == typeof s[r.webkitVideo[2]],
						ms: "function" == typeof s[r.ms[2]]
					},
					used: {}
				}, t = 0, n = a.length; n > t; t++) {
				var o = a[t];
				if (e.support[o]) {
					e.spec = o, e.used[o] = !0;
					break
				}
			}
			if (e.spec) {
				var l = r[e.spec];
				e.api = {
					fullscreenEnabled: !0,
					fullscreenElement: function (e) {
						return e = e ? e : i, e[l[1]]
					},
					requestFullscreen: function (e) {
						return e[l[2]]()
					},
					exitFullscreen: function (e) {
						return e = e ? e : i, e[l[3]]()
					}
				}, e.event = {
					fullscreenchange: l[4],
					fullscreenerror: l[5]
				}
			} else e.api = {
				fullscreenEnabled: !1,
				fullscreenElement: function () {
					return null
				},
				requestFullscreen: function () {},
				exitFullscreen: function () {}
			}, e.event = {}
		}
	}, e.jPlayer.nativeFeatures.init(), e.jPlayer.focus = null, e.jPlayer.keyIgnoreElementNames = "A INPUT TEXTAREA SELECT BUTTON";
	var a = function (t) {
		var n, i = e.jPlayer.focus;
		i && (e.each(e.jPlayer.keyIgnoreElementNames.split(/\s+/g), function (e, i) {
			return t.target.nodeName.toUpperCase() === i.toUpperCase() ? (n = !0, !1) : void 0
		}), n || e.each(i.options.keyBindings, function (n, s) {
			return s && e.isFunction(s.fn) && ("number" == typeof s.key && t.which === s.key || "string" == typeof s.key && t.key === s.key) ? (t.preventDefault(), s.fn(i), !1) : void 0
		}))
	};
	e.jPlayer.keys = function (t) {
		var n = "keydown.jPlayer";
		e(document.documentElement).unbind(n), t && e(document.documentElement).bind(n, a)
	}, e.jPlayer.keys(!0), e.jPlayer.prototype = {
		count: 0,
		version: {
			script: "2.9.2",
			needFlash: "2.9.0",
			flash: "unknown"
		},
		options: {
			swfPath: "js",
			solution: "html, flash",
			supplied: "mp3",
			auroraFormats: "wav",
			preload: "metadata",
			volume: .8,
			muted: !1,
			remainingDuration: !1,
			toggleDuration: !1,
			captureDuration: !0,
			playbackRate: 1,
			defaultPlaybackRate: 1,
			minPlaybackRate: .5,
			maxPlaybackRate: 4,
			wmode: "opaque",
			backgroundColor: "#000000",
			cssSelectorAncestor: "#jp_container_1",
			cssSelector: {
				videoPlay: ".jp-video-play",
				play: ".jp-play",
				pause: ".jp-pause",
				stop: ".jp-stop",
				seekBar: ".jp-seek-bar",
				playBar: ".jp-play-bar",
				mute: ".jp-mute",
				unmute: ".jp-unmute",
				volumeBar: ".jp-volume-bar",
				volumeBarValue: ".jp-volume-bar-value",
				volumeMax: ".jp-volume-max",
				playbackRateBar: ".jp-playback-rate-bar",
				playbackRateBarValue: ".jp-playback-rate-bar-value",
				currentTime: ".jp-current-time",
				duration: ".jp-duration",
				title: ".jp-title",
				fullScreen: ".jp-full-screen",
				restoreScreen: ".jp-restore-screen",
				repeat: ".jp-repeat",
				repeatOff: ".jp-repeat-off",
				gui: ".jp-gui",
				noSolution: ".jp-no-solution"
			},
			stateClass: {
				playing: "jp-state-playing",
				seeking: "jp-state-seeking",
				muted: "jp-state-muted",
				looped: "jp-state-looped",
				fullScreen: "jp-state-full-screen",
				noVolume: "jp-state-no-volume"
			},
			useStateClassSkin: !1,
			autoBlur: !0,
			smoothPlayBar: !1,
			fullScreen: !1,
			fullWindow: !1,
			autohide: {
				restored: !1,
				full: !0,
				fadeIn: 200,
				fadeOut: 600,
				hold: 1e3
			},
			loop: !1,
			repeat: function (t) {
				t.jPlayer.options.loop ? e(this).unbind(".jPlayerRepeat").bind(e.jPlayer.event.ended + ".jPlayer.jPlayerRepeat", function () {
					e(this).jPlayer("play")
				}) : e(this).unbind(".jPlayerRepeat")
			},
			nativeVideoControls: {},
			noFullWindow: {
				msie: /msie [0-6]\./,
				ipad: /ipad.*?os [0-4]\./,
				iphone: /iphone/,
				ipod: /ipod/,
				android_pad: /android [0-3]\.(?!.*?mobile)/,
				android_phone: /(?=.*android)(?!.*chrome)(?=.*mobile)/,
				blackberry: /blackberry/,
				windows_ce: /windows ce/,
				iemobile: /iemobile/,
				webos: /webos/
			},
			noVolume: {
				ipad: /ipad/,
				iphone: /iphone/,
				ipod: /ipod/,
				android_pad: /android(?!.*?mobile)/,
				android_phone: /android.*?mobile/,
				blackberry: /blackberry/,
				windows_ce: /windows ce/,
				iemobile: /iemobile/,
				webos: /webos/,
				playbook: /playbook/
			},
			timeFormat: {},
			keyEnabled: !1,
			audioFullScreen: !1,
			keyBindings: {
				play: {
					key: 80,
					fn: function (e) {
						e.status.paused ? e.play() : e.pause()
					}
				},
				fullScreen: {
					key: 70,
					fn: function (e) {
						(e.status.video || e.options.audioFullScreen) && e._setOption("fullScreen", !e.options.fullScreen)
					}
				},
				muted: {
					key: 77,
					fn: function (e) {
						e._muted(!e.options.muted)
					}
				},
				volumeUp: {
					key: 190,
					fn: function (e) {
						e.volume(e.options.volume + .1)
					}
				},
				volumeDown: {
					key: 188,
					fn: function (e) {
						e.volume(e.options.volume - .1)
					}
				},
				loop: {
					key: 76,
					fn: function (e) {
						e._loop(!e.options.loop)
					}
				}
			},
			verticalVolume: !1,
			verticalPlaybackRate: !1,
			globalVolume: !1,
			idPrefix: "jp",
			noConflict: "jQuery",
			emulateHtml: !1,
			consoleAlerts: !0,
			errorAlerts: !1,
			warningAlerts: !1
		},
		optionsAudio: {
			size: {
				width: "0px",
				height: "0px",
				cssClass: ""
			},
			sizeFull: {
				width: "0px",
				height: "0px",
				cssClass: ""
			}
		},
		optionsVideo: {
			size: {
				width: "480px",
				height: "270px",
				cssClass: "jp-video-270p"
			},
			sizeFull: {
				width: "100%",
				height: "100%",
				cssClass: "jp-video-full"
			}
		},
		instances: {},
		status: {
			src: "",
			media: {},
			paused: !0,
			format: {},
			formatType: "",
			waitForPlay: !0,
			waitForLoad: !0,
			srcSet: !1,
			video: !1,
			seekPercent: 0,
			currentPercentRelative: 0,
			currentPercentAbsolute: 0,
			currentTime: 0,
			duration: 0,
			remaining: 0,
			videoWidth: 0,
			videoHeight: 0,
			readyState: 0,
			networkState: 0,
			playbackRate: 1,
			ended: 0
		},
		internal: {
			ready: !1
		},
		solution: {
			html: !0,
			aurora: !0,
			flash: !0
		},
		format: {
			mp3: {
				codec: "audio/mpeg",
				flashCanPlay: !0,
				media: "audio"
			},
			m4a: {
				codec: 'audio/mp4; codecs="mp4a.40.2"',
				flashCanPlay: !0,
				media: "audio"
			},
			m3u8a: {
				codec: 'application/vnd.apple.mpegurl; codecs="mp4a.40.2"',
				flashCanPlay: !1,
				media: "audio"
			},
			m3ua: {
				codec: "audio/mpegurl",
				flashCanPlay: !1,
				media: "audio"
			},
			oga: {
				codec: 'audio/ogg; codecs="vorbis, opus"',
				flashCanPlay: !1,
				media: "audio"
			},
			flac: {
				codec: "audio/x-flac",
				flashCanPlay: !1,
				media: "audio"
			},
			wav: {
				codec: 'audio/wav; codecs="1"',
				flashCanPlay: !1,
				media: "audio"
			},
			webma: {
				codec: 'audio/webm; codecs="vorbis"',
				flashCanPlay: !1,
				media: "audio"
			},
			fla: {
				codec: "audio/x-flv",
				flashCanPlay: !0,
				media: "audio"
			},
			rtmpa: {
				codec: 'audio/rtmp; codecs="rtmp"',
				flashCanPlay: !0,
				media: "audio"
			},
			m4v: {
				codec: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',
				flashCanPlay: !0,
				media: "video"
			},
			m3u8v: {
				codec: 'application/vnd.apple.mpegurl; codecs="avc1.42E01E, mp4a.40.2"',
				flashCanPlay: !1,
				media: "video"
			},
			m3uv: {
				codec: "audio/mpegurl",
				flashCanPlay: !1,
				media: "video"
			},
			ogv: {
				codec: 'video/ogg; codecs="theora, vorbis"',
				flashCanPlay: !1,
				media: "video"
			},
			webmv: {
				codec: 'video/webm; codecs="vorbis, vp8"',
				flashCanPlay: !1,
				media: "video"
			},
			flv: {
				codec: "video/x-flv",
				flashCanPlay: !0,
				media: "video"
			},
			rtmpv: {
				codec: 'video/rtmp; codecs="rtmp"',
				flashCanPlay: !0,
				media: "video"
			}
		},
		_init: function () {
			var n = this;
			if (this.element.empty(), this.status = e.extend({}, this.status), this.internal = e.extend({}, this.internal), this.options.timeFormat = e.extend({}, e.jPlayer.timeFormat, this.options.timeFormat), this.internal.cmdsIgnored = e.jPlayer.platform.ipad || e.jPlayer.platform.iphone || e.jPlayer.platform.ipod, this.internal.domNode = this.element.get(0), this.options.keyEnabled && !e.jPlayer.focus && (e.jPlayer.focus = this), this.androidFix = {
					setMedia: !1,
					play: !1,
					pause: !1,
					time: NaN
				}, e.jPlayer.platform.android && (this.options.preload = "auto" !== this.options.preload ? "metadata" : "auto"), this.formats = [], this.solutions = [], this.require = {}, this.htmlElement = {}, this.html = {}, this.html.audio = {}, this.html.video = {}, this.aurora = {}, this.aurora.formats = [], this.aurora.properties = [], this.flash = {}, this.css = {}, this.css.cs = {}, this.css.jq = {}, this.ancestorJq = [], this.options.volume = this._limitValue(this.options.volume, 0, 1), e.each(this.options.supplied.toLowerCase().split(","), function (t, i) {
					var s = i.replace(/^\s+|\s+$/g, "");
					if (n.format[s]) {
						var r = !1;
						e.each(n.formats, function (e, t) {
							return s === t ? (r = !0, !1) : void 0
						}), r || n.formats.push(s)
					}
				}), e.each(this.options.solution.toLowerCase().split(","), function (t, i) {
					var s = i.replace(/^\s+|\s+$/g, "");
					if (n.solution[s]) {
						var r = !1;
						e.each(n.solutions, function (e, t) {
							return s === t ? (r = !0, !1) : void 0
						}), r || n.solutions.push(s)
					}
				}), e.each(this.options.auroraFormats.toLowerCase().split(","), function (t, i) {
					var s = i.replace(/^\s+|\s+$/g, "");
					if (n.format[s]) {
						var r = !1;
						e.each(n.aurora.formats, function (e, t) {
							return s === t ? (r = !0, !1) : void 0
						}), r || n.aurora.formats.push(s)
					}
				}), this.internal.instance = "jp_" + this.count, this.instances[this.internal.instance] = this.element, this.element.attr("id") || this.element.attr("id", this.options.idPrefix + "_jplayer_" + this.count), this.internal.self = e.extend({}, {
					id: this.element.attr("id"),
					jq: this.element
				}), this.internal.audio = e.extend({}, {
					id: this.options.idPrefix + "_audio_" + this.count,
					jq: t
				}), this.internal.video = e.extend({}, {
					id: this.options.idPrefix + "_video_" + this.count,
					jq: t
				}), this.internal.flash = e.extend({}, {
					id: this.options.idPrefix + "_flash_" + this.count,
					jq: t,
					swf: this.options.swfPath + (".swf" !== this.options.swfPath.toLowerCase().slice(-4) ? (this.options.swfPath && "/" !== this.options.swfPath.slice(-1) ? "/" : "") + "jquery.jplayer.swf" : "")
				}), this.internal.poster = e.extend({}, {
					id: this.options.idPrefix + "_poster_" + this.count,
					jq: t
				}), e.each(e.jPlayer.event, function (e, i) {
					n.options[e] !== t && (n.element.bind(i + ".jPlayer", n.options[e]), n.options[e] = t)
				}), this.require.audio = !1, this.require.video = !1, e.each(this.formats, function (e, t) {
					n.require[n.format[t].media] = !0
				}), this.options = this.require.video ? e.extend(!0, {}, this.optionsVideo, this.options) : e.extend(!0, {}, this.optionsAudio, this.options), this._setSize(), this.status.nativeVideoControls = this._uaBlocklist(this.options.nativeVideoControls), this.status.noFullWindow = this._uaBlocklist(this.options.noFullWindow), this.status.noVolume = this._uaBlocklist(this.options.noVolume), e.jPlayer.nativeFeatures.fullscreen.api.fullscreenEnabled && this._fullscreenAddEventListeners(), this._restrictNativeVideoControls(), this.htmlElement.poster = document.createElement("img"), this.htmlElement.poster.id = this.internal.poster.id, this.htmlElement.poster.onload = function () {
					(!n.status.video || n.status.waitForPlay) && n.internal.poster.jq.show()
				}, this.element.append(this.htmlElement.poster), this.internal.poster.jq = e("#" + this.internal.poster.id), this.internal.poster.jq.css({
					width: this.status.width,
					height: this.status.height
				}), this.internal.poster.jq.hide(), this.internal.poster.jq.bind("click.jPlayer", function () {
					n._trigger(e.jPlayer.event.click)
				}), this.html.audio.available = !1, this.require.audio && (this.htmlElement.audio = document.createElement("audio"), this.htmlElement.audio.id = this.internal.audio.id, this.html.audio.available = !!this.htmlElement.audio.canPlayType && this._testCanPlayType(this.htmlElement.audio)), this.html.video.available = !1, this.require.video && (this.htmlElement.video = document.createElement("video"), this.htmlElement.video.id = this.internal.video.id, this.html.video.available = !!this.htmlElement.video.canPlayType && this._testCanPlayType(this.htmlElement.video)), this.flash.available = this._checkForFlash(10.1), this.html.canPlay = {}, this.aurora.canPlay = {}, this.flash.canPlay = {}, e.each(this.formats, function (t, i) {
					n.html.canPlay[i] = n.html[n.format[i].media].available && "" !== n.htmlElement[n.format[i].media].canPlayType(n.format[i].codec), n.aurora.canPlay[i] = e.inArray(i, n.aurora.formats) > -1, n.flash.canPlay[i] = n.format[i].flashCanPlay && n.flash.available
				}), this.html.desired = !1, this.aurora.desired = !1, this.flash.desired = !1, e.each(this.solutions, function (t, i) {
					if (0 === t) n[i].desired = !0;
					else {
						var s = !1,
							r = !1;
						e.each(n.formats, function (e, t) {
							n[n.solutions[0]].canPlay[t] && ("video" === n.format[t].media ? r = !0 : s = !0)
						}), n[i].desired = n.require.audio && !s || n.require.video && !r
					}
				}), this.html.support = {}, this.aurora.support = {}, this.flash.support = {}, e.each(this.formats, function (e, t) {
					n.html.support[t] = n.html.canPlay[t] && n.html.desired, n.aurora.support[t] = n.aurora.canPlay[t] && n.aurora.desired, n.flash.support[t] = n.flash.canPlay[t] && n.flash.desired
				}), this.html.used = !1, this.aurora.used = !1, this.flash.used = !1, e.each(this.solutions, function (t, i) {
					e.each(n.formats, function (e, t) {
						return n[i].support[t] ? (n[i].used = !0, !1) : void 0
					})
				}), this._resetActive(), this._resetGate(), this._cssSelectorAncestor(this.options.cssSelectorAncestor), this.html.used || this.aurora.used || this.flash.used ? this.css.jq.noSolution.length && this.css.jq.noSolution.hide() : (this._error({
					type: e.jPlayer.error.NO_SOLUTION,
					context: "{solution:'" + this.options.solution + "', supplied:'" + this.options.supplied + "'}",
					message: e.jPlayer.errorMsg.NO_SOLUTION,
					hint: e.jPlayer.errorHint.NO_SOLUTION
				}), this.css.jq.noSolution.length && this.css.jq.noSolution.show()), this.flash.used) {
				var i, s = "jQuery=" + encodeURI(this.options.noConflict) + "&id=" + encodeURI(this.internal.self.id) + "&vol=" + this.options.volume + "&muted=" + this.options.muted;
				if (e.jPlayer.browser.msie && (Number(e.jPlayer.browser.version) < 9 || e.jPlayer.browser.documentMode < 9)) {
					var r = '<object id="' + this.internal.flash.id + '" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="0" height="0" tabindex="-1"></object>',
						a = ['<param name="movie" value="' + this.internal.flash.swf + '" />', '<param name="FlashVars" value="' + s + '" />', '<param name="allowScriptAccess" value="always" />', '<param name="bgcolor" value="' + this.options.backgroundColor + '" />', '<param name="wmode" value="' + this.options.wmode + '" />'];
					i = document.createElement(r);
					for (var o = 0; o < a.length; o++) i.appendChild(document.createElement(a[o]))
				} else {
					var l = function (e, t, n) {
						var i = document.createElement("param");
						i.setAttribute("name", t), i.setAttribute("value", n), e.appendChild(i)
					};
					i = document.createElement("object"), i.setAttribute("id", this.internal.flash.id), i.setAttribute("name", this.internal.flash.id), i.setAttribute("data", this.internal.flash.swf), i.setAttribute("type", "application/x-shockwave-flash"), i.setAttribute("width", "1"), i.setAttribute("height", "1"), i.setAttribute("tabindex", "-1"), l(i, "flashvars", s), l(i, "allowscriptaccess", "always"), l(i, "bgcolor", this.options.backgroundColor), l(i, "wmode", this.options.wmode)
				}
				this.element.append(i), this.internal.flash.jq = e(i)
			}
			this.status.playbackRateEnabled = this.html.used && !this.flash.used ? this._testPlaybackRate("audio") : !1, this._updatePlaybackRate(), this.html.used && (this.html.audio.available && (this._addHtmlEventListeners(this.htmlElement.audio, this.html.audio), this.element.append(this.htmlElement.audio), this.internal.audio.jq = e("#" + this.internal.audio.id)), this.html.video.available && (this._addHtmlEventListeners(this.htmlElement.video, this.html.video), this.element.append(this.htmlElement.video), this.internal.video.jq = e("#" + this.internal.video.id), this.internal.video.jq.css(this.status.nativeVideoControls ? {
				width: this.status.width,
				height: this.status.height
			} : {
				width: "0px",
				height: "0px"
			}), this.internal.video.jq.bind("click.jPlayer", function () {
				n._trigger(e.jPlayer.event.click)
			}))), this.aurora.used, this.options.emulateHtml && this._emulateHtmlBridge(), !this.html.used && !this.aurora.used || this.flash.used || setTimeout(function () {
				n.internal.ready = !0, n.version.flash = "n/a", n._trigger(e.jPlayer.event.repeat), n._trigger(e.jPlayer.event.ready)
			}, 100), this._updateNativeVideoControls(), this.css.jq.videoPlay.length && this.css.jq.videoPlay.hide(), e.jPlayer.prototype.count++
		},
		destroy: function () {
			this.clearMedia(), this._removeUiClass(), this.css.jq.currentTime.length && this.css.jq.currentTime.text(""), this.css.jq.duration.length && this.css.jq.duration.text(""), e.each(this.css.jq, function (e, t) {
				t.length && t.unbind(".jPlayer")
			}), this.internal.poster.jq.unbind(".jPlayer"), this.internal.video.jq && this.internal.video.jq.unbind(".jPlayer"), this._fullscreenRemoveEventListeners(), this === e.jPlayer.focus && (e.jPlayer.focus = null), this.options.emulateHtml && this._destroyHtmlBridge(), this.element.removeData("jPlayer"), this.element.unbind(".jPlayer"), this.element.empty(), delete this.instances[this.internal.instance]
		},
		destroyRemoved: function () {
			var t = this;
			e.each(this.instances, function (e, n) {
				t.element !== n && (n.data("jPlayer") || (n.jPlayer("destroy"), delete t.instances[e]))
			})
		},
		enable: function () {},
		disable: function () {},
		_testCanPlayType: function (e) {
			try {
				return e.canPlayType(this.format.mp3.codec), !0
			} catch (t) {
				return !1
			}
		},
		_testPlaybackRate: function (e) {
			var t, n = .5;
			e = "string" == typeof e ? e : "audio", t = document.createElement(e);
			try {
				return "playbackRate" in t ? (t.playbackRate = n, t.playbackRate === n) : !1
			} catch (i) {
				return !1
			}
		},
		_uaBlocklist: function (t) {
			var n = navigator.userAgent.toLowerCase(),
				i = !1;
			return e.each(t, function (e, t) {
				return t && t.test(n) ? (i = !0, !1) : void 0
			}), i
		},
		_restrictNativeVideoControls: function () {
			this.require.audio && this.status.nativeVideoControls && (this.status.nativeVideoControls = !1, this.status.noFullWindow = !0)
		},
		_updateNativeVideoControls: function () {
			this.html.video.available && this.html.used && (this.htmlElement.video.controls = this.status.nativeVideoControls, this._updateAutohide(), this.status.nativeVideoControls && this.require.video ? (this.internal.poster.jq.hide(), this.internal.video.jq.css({
				width: this.status.width,
				height: this.status.height
			})) : this.status.waitForPlay && this.status.video && (this.internal.poster.jq.show(), this.internal.video.jq.css({
				width: "0px",
				height: "0px"
			})))
		},
		_addHtmlEventListeners: function (t, n) {
			var i = this;
			t.preload = this.options.preload, t.muted = this.options.muted, t.volume = this.options.volume, this.status.playbackRateEnabled && (t.defaultPlaybackRate = this.options.defaultPlaybackRate, t.playbackRate = this.options.playbackRate), t.addEventListener("progress", function () {
				n.gate && (i.internal.cmdsIgnored && this.readyState > 0 && (i.internal.cmdsIgnored = !1), i._getHtmlStatus(t), i._updateInterface(), i._trigger(e.jPlayer.event.progress))
			}, !1), t.addEventListener("loadeddata", function () {
				n.gate && (i.androidFix.setMedia = !1, i.androidFix.play && (i.androidFix.play = !1, i.play(i.androidFix.time)), i.androidFix.pause && (i.androidFix.pause = !1, i.pause(i.androidFix.time)), i._trigger(e.jPlayer.event.loadeddata))
			}, !1), t.addEventListener("timeupdate", function () {
				n.gate && (i._getHtmlStatus(t), i._updateInterface(), i._trigger(e.jPlayer.event.timeupdate))
			}, !1), t.addEventListener("durationchange", function () {
				n.gate && (i._getHtmlStatus(t), i._updateInterface(), i._trigger(e.jPlayer.event.durationchange))
			}, !1), t.addEventListener("play", function () {
				n.gate && (i._updateButtons(!0), i._html_checkWaitForPlay(), i._trigger(e.jPlayer.event.play))
			}, !1), t.addEventListener("playing", function () {
				n.gate && (i._updateButtons(!0), i._seeked(), i._trigger(e.jPlayer.event.playing))
			}, !1), t.addEventListener("pause", function () {
				n.gate && (i._updateButtons(!1), i._trigger(e.jPlayer.event.pause))
			}, !1), t.addEventListener("waiting", function () {
				n.gate && (i._seeking(), i._trigger(e.jPlayer.event.waiting))
			}, !1), t.addEventListener("seeking", function () {
				n.gate && (i._seeking(), i._trigger(e.jPlayer.event.seeking))
			}, !1), t.addEventListener("seeked", function () {
				n.gate && (i._seeked(), i._trigger(e.jPlayer.event.seeked))
			}, !1), t.addEventListener("volumechange", function () {
				n.gate && (i.options.volume = t.volume, i.options.muted = t.muted, i._updateMute(), i._updateVolume(), i._trigger(e.jPlayer.event.volumechange))
			}, !1), t.addEventListener("ratechange", function () {
				n.gate && (i.options.defaultPlaybackRate = t.defaultPlaybackRate, i.options.playbackRate = t.playbackRate, i._updatePlaybackRate(), i._trigger(e.jPlayer.event.ratechange))
			}, !1), t.addEventListener("suspend", function () {
				n.gate && (i._seeked(), i._trigger(e.jPlayer.event.suspend))
			}, !1), t.addEventListener("ended", function () {
				n.gate && (e.jPlayer.browser.webkit || (i.htmlElement.media.currentTime = 0), i.htmlElement.media.pause(), i._updateButtons(!1), i._getHtmlStatus(t, !0), i._updateInterface(), i._trigger(e.jPlayer.event.ended))
			}, !1), t.addEventListener("error", function () {
				n.gate && (i._updateButtons(!1), i._seeked(), i.status.srcSet && (clearTimeout(i.internal.htmlDlyCmdId), i.status.waitForLoad = !0, i.status.waitForPlay = !0, i.status.video && !i.status.nativeVideoControls && i.internal.video.jq.css({
					width: "0px",
					height: "0px"
				}), i._validString(i.status.media.poster) && !i.status.nativeVideoControls && i.internal.poster.jq.show(), i.css.jq.videoPlay.length && i.css.jq.videoPlay.show(), i._error({
					type: e.jPlayer.error.URL,
					context: i.status.src,
					message: e.jPlayer.errorMsg.URL,
					hint: e.jPlayer.errorHint.URL
				})))
			}, !1), e.each(e.jPlayer.htmlEvent, function (s, r) {
				t.addEventListener(this, function () {
					n.gate && i._trigger(e.jPlayer.event[r])
				}, !1)
			})
		},
		_addAuroraEventListeners: function (t, n) {
			var i = this;
			t.volume = 100 * this.options.volume, t.on("progress", function () {
				n.gate && (i.internal.cmdsIgnored && this.readyState > 0 && (i.internal.cmdsIgnored = !1), i._getAuroraStatus(t), i._updateInterface(), i._trigger(e.jPlayer.event.progress), t.duration > 0 && i._trigger(e.jPlayer.event.timeupdate))
			}, !1), t.on("ready", function () {
				n.gate && i._trigger(e.jPlayer.event.loadeddata)
			}, !1), t.on("duration", function () {
				n.gate && (i._getAuroraStatus(t), i._updateInterface(), i._trigger(e.jPlayer.event.durationchange))
			}, !1), t.on("end", function () {
				n.gate && (i._updateButtons(!1), i._getAuroraStatus(t, !0), i._updateInterface(), i._trigger(e.jPlayer.event.ended))
			}, !1), t.on("error", function () {
				n.gate && (i._updateButtons(!1), i._seeked(), i.status.srcSet && (i.status.waitForLoad = !0, i.status.waitForPlay = !0, i.status.video && !i.status.nativeVideoControls && i.internal.video.jq.css({
					width: "0px",
					height: "0px"
				}), i._validString(i.status.media.poster) && !i.status.nativeVideoControls && i.internal.poster.jq.show(), i.css.jq.videoPlay.length && i.css.jq.videoPlay.show(), i._error({
					type: e.jPlayer.error.URL,
					context: i.status.src,
					message: e.jPlayer.errorMsg.URL,
					hint: e.jPlayer.errorHint.URL
				})))
			}, !1)
		},
		_getHtmlStatus: function (e, t) {
			var n = 0,
				i = 0,
				s = 0,
				r = 0;
			isFinite(e.duration) && (this.status.duration = e.duration), n = e.currentTime, i = this.status.duration > 0 ? 100 * n / this.status.duration : 0, "object" == typeof e.seekable && e.seekable.length > 0 ? (s = this.status.duration > 0 ? 100 * e.seekable.end(e.seekable.length - 1) / this.status.duration : 100, r = this.status.duration > 0 ? 100 * e.currentTime / e.seekable.end(e.seekable.length - 1) : 0) : (s = 100, r = i), t && (n = 0, r = 0, i = 0), this.status.seekPercent = s, this.status.currentPercentRelative = r, this.status.currentPercentAbsolute = i, this.status.currentTime = n, this.status.remaining = this.status.duration - this.status.currentTime, this.status.videoWidth = e.videoWidth, this.status.videoHeight = e.videoHeight, this.status.readyState = e.readyState, this.status.networkState = e.networkState, this.status.playbackRate = e.playbackRate, this.status.ended = e.ended
		},
		_getAuroraStatus: function (e, t) {
			var n = 0,
				i = 0,
				s = 0,
				r = 0;
			this.status.duration = e.duration / 1e3, n = e.currentTime / 1e3, i = this.status.duration > 0 ? 100 * n / this.status.duration : 0, e.buffered > 0 ? (s = this.status.duration > 0 ? e.buffered * this.status.duration / this.status.duration : 100, r = this.status.duration > 0 ? n / (e.buffered * this.status.duration) : 0) : (s = 100, r = i), t && (n = 0, r = 0, i = 0), this.status.seekPercent = s, this.status.currentPercentRelative = r, this.status.currentPercentAbsolute = i, this.status.currentTime = n, this.status.remaining = this.status.duration - this.status.currentTime, this.status.readyState = 4, this.status.networkState = 0, this.status.playbackRate = 1, this.status.ended = !1
		},
		_resetStatus: function () {
			this.status = e.extend({}, this.status, e.jPlayer.prototype.status)
		},
		_trigger: function (t, n, i) {
			var s = e.Event(t);
			s.jPlayer = {}, s.jPlayer.version = e.extend({}, this.version), s.jPlayer.options = e.extend(!0, {}, this.options), s.jPlayer.status = e.extend(!0, {}, this.status), s.jPlayer.html = e.extend(!0, {}, this.html), s.jPlayer.aurora = e.extend(!0, {}, this.aurora), s.jPlayer.flash = e.extend(!0, {}, this.flash), n && (s.jPlayer.error = e.extend({}, n)), i && (s.jPlayer.warning = e.extend({}, i)), this.element.trigger(s)
		},
		jPlayerFlashEvent: function (t, n) {
			if (t === e.jPlayer.event.ready)
				if (this.internal.ready) {
					if (this.flash.gate) {
						if (this.status.srcSet) {
							var i = this.status.currentTime,
								s = this.status.paused;
							this.setMedia(this.status.media), this.volumeWorker(this.options.volume), i > 0 && (s ? this.pause(i) : this.play(i))
						}
						this._trigger(e.jPlayer.event.flashreset)
					}
				} else this.internal.ready = !0, this.internal.flash.jq.css({
					width: "0px",
					height: "0px"
				}), this.version.flash = n.version, this.version.needFlash !== this.version.flash && this._error({
					type: e.jPlayer.error.VERSION,
					context: this.version.flash,
					message: e.jPlayer.errorMsg.VERSION + this.version.flash,
					hint: e.jPlayer.errorHint.VERSION
				}), this._trigger(e.jPlayer.event.repeat), this._trigger(t);
			if (this.flash.gate) switch (t) {
				case e.jPlayer.event.progress:
					this._getFlashStatus(n), this._updateInterface(), this._trigger(t);
					break;
				case e.jPlayer.event.timeupdate:
					this._getFlashStatus(n), this._updateInterface(), this._trigger(t);
					break;
				case e.jPlayer.event.play:
					this._seeked(), this._updateButtons(!0), this._trigger(t);
					break;
				case e.jPlayer.event.pause:
					this._updateButtons(!1), this._trigger(t);
					break;
				case e.jPlayer.event.ended:
					this._updateButtons(!1), this._trigger(t);
					break;
				case e.jPlayer.event.click:
					this._trigger(t);
					break;
				case e.jPlayer.event.error:
					this.status.waitForLoad = !0, this.status.waitForPlay = !0, this.status.video && this.internal.flash.jq.css({
						width: "0px",
						height: "0px"
					}), this._validString(this.status.media.poster) && this.internal.poster.jq.show(), this.css.jq.videoPlay.length && this.status.video && this.css.jq.videoPlay.show(), this.status.video ? this._flash_setVideo(this.status.media) : this._flash_setAudio(this.status.media), this._updateButtons(!1), this._error({
						type: e.jPlayer.error.URL,
						context: n.src,
						message: e.jPlayer.errorMsg.URL,
						hint: e.jPlayer.errorHint.URL
					});
					break;
				case e.jPlayer.event.seeking:
					this._seeking(), this._trigger(t);
					break;
				case e.jPlayer.event.seeked:
					this._seeked(), this._trigger(t);
					break;
				case e.jPlayer.event.ready:
					break;
				default:
					this._trigger(t)
			}
			return !1
		},
		_getFlashStatus: function (e) {
			this.status.seekPercent = e.seekPercent, this.status.currentPercentRelative = e.currentPercentRelative, this.status.currentPercentAbsolute = e.currentPercentAbsolute, this.status.currentTime = e.currentTime, this.status.duration = e.duration, this.status.remaining = e.duration - e.currentTime, this.status.videoWidth = e.videoWidth, this.status.videoHeight = e.videoHeight, this.status.readyState = 4, this.status.networkState = 0, this.status.playbackRate = 1, this.status.ended = !1
		},
		_updateButtons: function (e) {
			e === t ? e = !this.status.paused : this.status.paused = !e, e ? this.addStateClass("playing") : this.removeStateClass("playing"), !this.status.noFullWindow && this.options.fullWindow ? this.addStateClass("fullScreen") : this.removeStateClass("fullScreen"), this.options.loop ? this.addStateClass("looped") : this.removeStateClass("looped"), this.css.jq.play.length && this.css.jq.pause.length && (e ? (this.css.jq.play.hide(), this.css.jq.pause.show()) : (this.css.jq.play.show(), this.css.jq.pause.hide())), this.css.jq.restoreScreen.length && this.css.jq.fullScreen.length && (this.status.noFullWindow ? (this.css.jq.fullScreen.hide(), this.css.jq.restoreScreen.hide()) : this.options.fullWindow ? (this.css.jq.fullScreen.hide(), this.css.jq.restoreScreen.show()) : (this.css.jq.fullScreen.show(), this.css.jq.restoreScreen.hide())), this.css.jq.repeat.length && this.css.jq.repeatOff.length && (this.options.loop ? (this.css.jq.repeat.hide(), this.css.jq.repeatOff.show()) : (this.css.jq.repeat.show(), this.css.jq.repeatOff.hide()))
		},
		_updateInterface: function () {
			this.css.jq.seekBar.length && this.css.jq.seekBar.width(this.status.seekPercent + "%"), this.css.jq.playBar.length && (this.options.smoothPlayBar ? this.css.jq.playBar.stop().animate({
				width: this.status.currentPercentAbsolute + "%"
			}, 250, "linear") : this.css.jq.playBar.width(this.status.currentPercentRelative + "%"));
			var e = "";
			this.css.jq.currentTime.length && (e = this._convertTime(this.status.currentTime), e !== this.css.jq.currentTime.text() && this.css.jq.currentTime.text(this._convertTime(this.status.currentTime)));
			var t = "",
				n = this.status.duration,
				i = this.status.remaining;
			this.css.jq.duration.length && ("string" == typeof this.status.media.duration ? t = this.status.media.duration : ("number" == typeof this.status.media.duration && (n = this.status.media.duration, i = n - this.status.currentTime), t = this.options.remainingDuration ? (i > 0 ? "-" : "") + this._convertTime(i) : this._convertTime(n)), t !== this.css.jq.duration.text() && this.css.jq.duration.text(t))
		},
		_convertTime: n.prototype.time,
		_seeking: function () {
			this.css.jq.seekBar.length && this.css.jq.seekBar.addClass("jp-seeking-bg"), this.addStateClass("seeking")
		},
		_seeked: function () {
			this.css.jq.seekBar.length && this.css.jq.seekBar.removeClass("jp-seeking-bg"), this.removeStateClass("seeking")
		},
		_resetGate: function () {
			this.html.audio.gate = !1, this.html.video.gate = !1, this.aurora.gate = !1, this.flash.gate = !1
		},
		_resetActive: function () {
			this.html.active = !1, this.aurora.active = !1, this.flash.active = !1
		},
		_escapeHtml: function (e) {
			return e.split("&").join("&amp;").split("<").join("&lt;").split(">").join("&gt;").split('"').join("&quot;")
		},
		_qualifyURL: function (e) {
			var t = document.createElement("div");
			return t.innerHTML = '<a href="' + this._escapeHtml(e) + '">x</a>', t.firstChild.href
		},
		_absoluteMediaUrls: function (t) {
			var n = this;
			return e.each(t, function (e, i) {
				i && n.format[e] && "data:" !== i.substr(0, 5) && (t[e] = n._qualifyURL(i))
			}), t
		},
		addStateClass: function (e) {
			this.ancestorJq.length && this.ancestorJq.addClass(this.options.stateClass[e])
		},
		removeStateClass: function (e) {
			this.ancestorJq.length && this.ancestorJq.removeClass(this.options.stateClass[e])
		},
		setMedia: function (t) {
			var n = this,
				i = !1,
				s = this.status.media.poster !== t.poster;
			this._resetMedia(), this._resetGate(), this._resetActive(), this.androidFix.setMedia = !1, this.androidFix.play = !1, this.androidFix.pause = !1, t = this._absoluteMediaUrls(t), e.each(this.formats, function (s, r) {
				var a = "video" === n.format[r].media;
				return e.each(n.solutions, function (s, o) {
					if (n[o].support[r] && n._validString(t[r])) {
						var l = "html" === o,
							u = "aurora" === o;
						return a ? (l ? (n.html.video.gate = !0, n._html_setVideo(t), n.html.active = !0) : (n.flash.gate = !0, n._flash_setVideo(t), n.flash.active = !0), n.css.jq.videoPlay.length && n.css.jq.videoPlay.show(), n.status.video = !0) : (l ? (n.html.audio.gate = !0, n._html_setAudio(t), n.html.active = !0, e.jPlayer.platform.android && (n.androidFix.setMedia = !0)) : u ? (n.aurora.gate = !0, n._aurora_setAudio(t), n.aurora.active = !0) : (n.flash.gate = !0, n._flash_setAudio(t), n.flash.active = !0), n.css.jq.videoPlay.length && n.css.jq.videoPlay.hide(), n.status.video = !1), i = !0, !1
					}
				}), i ? !1 : void 0
			}), i ? (this.status.nativeVideoControls && this.html.video.gate || this._validString(t.poster) && (s ? this.htmlElement.poster.src = t.poster : this.internal.poster.jq.show()), "string" == typeof t.title && (this.css.jq.title.length && this.css.jq.title.html(t.title), this.htmlElement.audio && this.htmlElement.audio.setAttribute("title", t.title), this.htmlElement.video && this.htmlElement.video.setAttribute("title", t.title)), this.status.srcSet = !0, this.status.media = e.extend({}, t), this._updateButtons(!1), this._updateInterface(), this._trigger(e.jPlayer.event.setmedia)) : this._error({
				type: e.jPlayer.error.NO_SUPPORT,
				context: "{supplied:'" + this.options.supplied + "'}",
				message: e.jPlayer.errorMsg.NO_SUPPORT,
				hint: e.jPlayer.errorHint.NO_SUPPORT
			})
		},
		_resetMedia: function () {
			this._resetStatus(), this._updateButtons(!1), this._updateInterface(), this._seeked(), this.internal.poster.jq.hide(), clearTimeout(this.internal.htmlDlyCmdId), this.html.active ? this._html_resetMedia() : this.aurora.active ? this._aurora_resetMedia() : this.flash.active && this._flash_resetMedia()
		},
		clearMedia: function () {
			this._resetMedia(), this.html.active ? this._html_clearMedia() : this.aurora.active ? this._aurora_clearMedia() : this.flash.active && this._flash_clearMedia(), this._resetGate(), this._resetActive()
		},
		load: function () {
			this.status.srcSet ? this.html.active ? this._html_load() : this.aurora.active ? this._aurora_load() : this.flash.active && this._flash_load() : this._urlNotSetError("load")
		},
		focus: function () {
			this.options.keyEnabled && (e.jPlayer.focus = this)
		},
		play: function (e) {
			var t = "object" == typeof e;
			t && this.options.useStateClassSkin && !this.status.paused ? this.pause(e) : (e = "number" == typeof e ? e : NaN, this.status.srcSet ? (this.focus(), this.html.active ? this._html_play(e) : this.aurora.active ? this._aurora_play(e) : this.flash.active && this._flash_play(e)) : this._urlNotSetError("play"))
		},
		videoPlay: function () {
			this.play()
		},
		pause: function (e) {
			e = "number" == typeof e ? e : NaN, this.status.srcSet ? this.html.active ? this._html_pause(e) : this.aurora.active ? this._aurora_pause(e) : this.flash.active && this._flash_pause(e) : this._urlNotSetError("pause")
		},
		tellOthers: function (t, n) {
			var i = this,
				s = "function" == typeof n,
				r = Array.prototype.slice.call(arguments);
			"string" == typeof t && (s && r.splice(1, 1), e.jPlayer.prototype.destroyRemoved(), e.each(this.instances, function () {
				i.element !== this && (!s || n.call(this.data("jPlayer"), i)) && this.jPlayer.apply(this, r)
			}))
		},
		pauseOthers: function (e) {
			this.tellOthers("pause", function () {
				return this.status.srcSet
			}, e)
		},
		stop: function () {
			this.status.srcSet ? this.html.active ? this._html_pause(0) : this.aurora.active ? this._aurora_pause(0) : this.flash.active && this._flash_pause(0) : this._urlNotSetError("stop")
		},
		playHead: function (e) {
			e = this._limitValue(e, 0, 100), this.status.srcSet ? this.html.active ? this._html_playHead(e) : this.aurora.active ? this._aurora_playHead(e) : this.flash.active && this._flash_playHead(e) : this._urlNotSetError("playHead")
		},
		_muted: function (e) {
			this.mutedWorker(e), this.options.globalVolume && this.tellOthers("mutedWorker", function () {
				return this.options.globalVolume
			}, e)
		},
		mutedWorker: function (t) {
			this.options.muted = t, this.html.used && this._html_setProperty("muted", t), this.aurora.used && this._aurora_mute(t), this.flash.used && this._flash_mute(t), this.html.video.gate || this.html.audio.gate || (this._updateMute(t), this._updateVolume(this.options.volume), this._trigger(e.jPlayer.event.volumechange))
		},
		mute: function (e) {
			var n = "object" == typeof e;
			n && this.options.useStateClassSkin && this.options.muted ? this._muted(!1) : (e = e === t ? !0 : !!e, this._muted(e))
		},
		unmute: function (e) {
			e = e === t ? !0 : !!e, this._muted(!e)
		},
		_updateMute: function (e) {
			e === t && (e = this.options.muted), e ? this.addStateClass("muted") : this.removeStateClass("muted"), this.css.jq.mute.length && this.css.jq.unmute.length && (this.status.noVolume ? (this.css.jq.mute.hide(), this.css.jq.unmute.hide()) : e ? (this.css.jq.mute.hide(), this.css.jq.unmute.show()) : (this.css.jq.mute.show(), this.css.jq.unmute.hide()))
		},
		volume: function (e) {
			this.volumeWorker(e), this.options.globalVolume && this.tellOthers("volumeWorker", function () {
				return this.options.globalVolume
			}, e)
		},
		volumeWorker: function (t) {
			t = this._limitValue(t, 0, 1), this.options.volume = t, this.html.used && this._html_setProperty("volume", t), this.aurora.used && this._aurora_volume(t), this.flash.used && this._flash_volume(t), this.html.video.gate || this.html.audio.gate || (this._updateVolume(t), this._trigger(e.jPlayer.event.volumechange))
		},
		volumeBar: function (t) {
			if (this.css.jq.volumeBar.length) {
				var n = e(t.currentTarget),
					i = n.offset(),
					s = t.pageX - i.left,
					r = n.width(),
					a = n.height() - t.pageY + i.top,
					o = n.height();
				this.volume(this.options.verticalVolume ? a / o : s / r)
			}
			this.options.muted && this._muted(!1)
		},
		_updateVolume: function (e) {
			e === t && (e = this.options.volume), e = this.options.muted ? 0 : e, this.status.noVolume ? (this.addStateClass("noVolume"), this.css.jq.volumeBar.length && this.css.jq.volumeBar.hide(), this.css.jq.volumeBarValue.length && this.css.jq.volumeBarValue.hide(), this.css.jq.volumeMax.length && this.css.jq.volumeMax.hide()) : (this.removeStateClass("noVolume"), this.css.jq.volumeBar.length && this.css.jq.volumeBar.show(), this.css.jq.volumeBarValue.length && (this.css.jq.volumeBarValue.show(), this.css.jq.volumeBarValue[this.options.verticalVolume ? "height" : "width"](100 * e + "%")), this.css.jq.volumeMax.length && this.css.jq.volumeMax.show())
		},
		volumeMax: function () {
			this.volume(1), this.options.muted && this._muted(!1)
		},
		_cssSelectorAncestor: function (t) {
			var n = this;
			this.options.cssSelectorAncestor = t, this._removeUiClass(), this.ancestorJq = t ? e(t) : [], t && 1 !== this.ancestorJq.length && this._warning({
				type: e.jPlayer.warning.CSS_SELECTOR_COUNT,
				context: t,
				message: e.jPlayer.warningMsg.CSS_SELECTOR_COUNT + this.ancestorJq.length + " found for cssSelectorAncestor.",
				hint: e.jPlayer.warningHint.CSS_SELECTOR_COUNT
			}), this._addUiClass(), e.each(this.options.cssSelector, function (e, t) {
				n._cssSelector(e, t)
			}), this._updateInterface(), this._updateButtons(), this._updateAutohide(), this._updateVolume(), this._updateMute()
		},
		_cssSelector: function (t, n) {
			var i = this;
			if ("string" == typeof n)
				if (e.jPlayer.prototype.options.cssSelector[t]) {
					if (this.css.jq[t] && this.css.jq[t].length && this.css.jq[t].unbind(".jPlayer"), this.options.cssSelector[t] = n, this.css.cs[t] = this.options.cssSelectorAncestor + " " + n, this.css.jq[t] = n ? e(this.css.cs[t]) : [], this.css.jq[t].length && this[t]) {
						var s = function (n) {
							n.preventDefault(), i[t](n), i.options.autoBlur ? e(this).blur() : e(this).focus()
						};
						this.css.jq[t].bind("click.jPlayer", s)
					}
					n && 1 !== this.css.jq[t].length && this._warning({
						type: e.jPlayer.warning.CSS_SELECTOR_COUNT,
						context: this.css.cs[t],
						message: e.jPlayer.warningMsg.CSS_SELECTOR_COUNT + this.css.jq[t].length + " found for " + t + " method.",
						hint: e.jPlayer.warningHint.CSS_SELECTOR_COUNT
					})
				} else this._warning({
					type: e.jPlayer.warning.CSS_SELECTOR_METHOD,
					context: t,
					message: e.jPlayer.warningMsg.CSS_SELECTOR_METHOD,
					hint: e.jPlayer.warningHint.CSS_SELECTOR_METHOD
				});
			else this._warning({
				type: e.jPlayer.warning.CSS_SELECTOR_STRING,
				context: n,
				message: e.jPlayer.warningMsg.CSS_SELECTOR_STRING,
				hint: e.jPlayer.warningHint.CSS_SELECTOR_STRING
			})
		},
		duration: function (e) {
			this.options.toggleDuration && (this.options.captureDuration && e.stopPropagation(), this._setOption("remainingDuration", !this.options.remainingDuration))
		},
		seekBar: function (t) {
			if (this.css.jq.seekBar.length) {
				var n = e(t.currentTarget),
					i = n.offset(),
					s = t.pageX - i.left,
					r = n.width(),
					a = 100 * s / r;
				this.playHead(a)
			}
		},
		playbackRate: function (e) {
			this._setOption("playbackRate", e)
		},
		playbackRateBar: function (t) {
			if (this.css.jq.playbackRateBar.length) {
				var n, i, s = e(t.currentTarget),
					r = s.offset(),
					a = t.pageX - r.left,
					o = s.width(),
					l = s.height() - t.pageY + r.top,
					u = s.height();
				n = this.options.verticalPlaybackRate ? l / u : a / o, i = n * (this.options.maxPlaybackRate - this.options.minPlaybackRate) + this.options.minPlaybackRate, this.playbackRate(i)
			}
		},
		_updatePlaybackRate: function () {
			var e = this.options.playbackRate,
				t = (e - this.options.minPlaybackRate) / (this.options.maxPlaybackRate - this.options.minPlaybackRate);
			this.status.playbackRateEnabled ? (this.css.jq.playbackRateBar.length && this.css.jq.playbackRateBar.show(), this.css.jq.playbackRateBarValue.length && (this.css.jq.playbackRateBarValue.show(), this.css.jq.playbackRateBarValue[this.options.verticalPlaybackRate ? "height" : "width"](100 * t + "%"))) : (this.css.jq.playbackRateBar.length && this.css.jq.playbackRateBar.hide(), this.css.jq.playbackRateBarValue.length && this.css.jq.playbackRateBarValue.hide())
		},
		repeat: function (e) {
			var t = "object" == typeof e;
			this._loop(t && this.options.useStateClassSkin && this.options.loop ? !1 : !0)
		},
		repeatOff: function () {
			this._loop(!1)
		},
		_loop: function (t) {
			this.options.loop !== t && (this.options.loop = t, this._updateButtons(), this._trigger(e.jPlayer.event.repeat))
		},
		option: function (n, i) {
			var s = n;
			if (0 === arguments.length) return e.extend(!0, {}, this.options);
			if ("string" == typeof n) {
				var r = n.split(".");
				if (i === t) {
					for (var a = e.extend(!0, {}, this.options), o = 0; o < r.length; o++) {
						if (a[r[o]] === t) return this._warning({
							type: e.jPlayer.warning.OPTION_KEY,
							context: n,
							message: e.jPlayer.warningMsg.OPTION_KEY,
							hint: e.jPlayer.warningHint.OPTION_KEY
						}), t;
						a = a[r[o]]
					}
					return a
				}
				s = {};
				for (var l = s, u = 0; u < r.length; u++) u < r.length - 1 ? (l[r[u]] = {}, l = l[r[u]]) : l[r[u]] = i
			}
			return this._setOptions(s), this
		},
		_setOptions: function (t) {
			var n = this;
			return e.each(t, function (e, t) {
				n._setOption(e, t)
			}), this
		},
		_setOption: function (t, n) {
			var i = this;
			switch (t) {
				case "volume":
					this.volume(n);
					break;
				case "muted":
					this._muted(n);
					break;
				case "globalVolume":
					this.options[t] = n;
					break;
				case "cssSelectorAncestor":
					this._cssSelectorAncestor(n);
					break;
				case "cssSelector":
					e.each(n, function (e, t) {
						i._cssSelector(e, t)
					});
					break;
				case "playbackRate":
					this.options[t] = n = this._limitValue(n, this.options.minPlaybackRate, this.options.maxPlaybackRate), this.html.used && this._html_setProperty("playbackRate", n), this._updatePlaybackRate();
					break;
				case "defaultPlaybackRate":
					this.options[t] = n = this._limitValue(n, this.options.minPlaybackRate, this.options.maxPlaybackRate), this.html.used && this._html_setProperty("defaultPlaybackRate", n), this._updatePlaybackRate();
					break;
				case "minPlaybackRate":
					this.options[t] = n = this._limitValue(n, .1, this.options.maxPlaybackRate - .1), this._updatePlaybackRate();
					break;
				case "maxPlaybackRate":
					this.options[t] = n = this._limitValue(n, this.options.minPlaybackRate + .1, 16), this._updatePlaybackRate();
					break;
				case "fullScreen":
					if (this.options[t] !== n) {
						var s = e.jPlayer.nativeFeatures.fullscreen.used.webkitVideo;
						(!s || s && !this.status.waitForPlay) && (s || (this.options[t] = n), n ? this._requestFullscreen() : this._exitFullscreen(), s || this._setOption("fullWindow", n))
					}
					break;
				case "fullWindow":
					this.options[t] !== n && (this._removeUiClass(), this.options[t] = n, this._refreshSize());
					break;
				case "size":
					this.options.fullWindow || this.options[t].cssClass === n.cssClass || this._removeUiClass(), this.options[t] = e.extend({}, this.options[t], n), this._refreshSize();
					break;
				case "sizeFull":
					this.options.fullWindow && this.options[t].cssClass !== n.cssClass && this._removeUiClass(), this.options[t] = e.extend({}, this.options[t], n), this._refreshSize();
					break;
				case "autohide":
					this.options[t] = e.extend({}, this.options[t], n), this._updateAutohide();
					break;
				case "loop":
					this._loop(n);
					break;
				case "remainingDuration":
					this.options[t] = n, this._updateInterface();
					break;
				case "toggleDuration":
					this.options[t] = n;
					break;
				case "nativeVideoControls":
					this.options[t] = e.extend({}, this.options[t], n), this.status.nativeVideoControls = this._uaBlocklist(this.options.nativeVideoControls), this._restrictNativeVideoControls(), this._updateNativeVideoControls();
					break;
				case "noFullWindow":
					this.options[t] = e.extend({}, this.options[t], n), this.status.nativeVideoControls = this._uaBlocklist(this.options.nativeVideoControls), this.status.noFullWindow = this._uaBlocklist(this.options.noFullWindow), this._restrictNativeVideoControls(), this._updateButtons();
					break;
				case "noVolume":
					this.options[t] = e.extend({}, this.options[t], n), this.status.noVolume = this._uaBlocklist(this.options.noVolume), this._updateVolume(), this._updateMute();
					break;
				case "emulateHtml":
					this.options[t] !== n && (this.options[t] = n, n ? this._emulateHtmlBridge() : this._destroyHtmlBridge());
					break;
				case "timeFormat":
					this.options[t] = e.extend({}, this.options[t], n);
					break;
				case "keyEnabled":
					this.options[t] = n, n || this !== e.jPlayer.focus || (e.jPlayer.focus = null);
					break;
				case "keyBindings":
					this.options[t] = e.extend(!0, {}, this.options[t], n);
					break;
				case "audioFullScreen":
					this.options[t] = n;
					break;
				case "autoBlur":
					this.options[t] = n
			}
			return this
		},
		_refreshSize: function () {
			this._setSize(), this._addUiClass(), this._updateSize(), this._updateButtons(), this._updateAutohide(), this._trigger(e.jPlayer.event.resize)
		},
		_setSize: function () {
			this.options.fullWindow ? (this.status.width = this.options.sizeFull.width, this.status.height = this.options.sizeFull.height, this.status.cssClass = this.options.sizeFull.cssClass) : (this.status.width = this.options.size.width, this.status.height = this.options.size.height, this.status.cssClass = this.options.size.cssClass), this.element.css({
				width: this.status.width,
				height: this.status.height
			})
		},
		_addUiClass: function () {
			this.ancestorJq.length && this.ancestorJq.addClass(this.status.cssClass)
		},
		_removeUiClass: function () {
			this.ancestorJq.length && this.ancestorJq.removeClass(this.status.cssClass)
		},
		_updateSize: function () {
			this.internal.poster.jq.css({
				width: this.status.width,
				height: this.status.height
			}), !this.status.waitForPlay && this.html.active && this.status.video || this.html.video.available && this.html.used && this.status.nativeVideoControls ? this.internal.video.jq.css({
				width: this.status.width,
				height: this.status.height
			}) : !this.status.waitForPlay && this.flash.active && this.status.video && this.internal.flash.jq.css({
				width: this.status.width,
				height: this.status.height
			})
		},
		_updateAutohide: function () {
			var e = this,
				t = "mousemove.jPlayer",
				n = ".jPlayerAutohide",
				i = t + n,
				s = function (t) {
					var n, i, s = !1;
					"undefined" != typeof e.internal.mouse ? (n = e.internal.mouse.x - t.pageX, i = e.internal.mouse.y - t.pageY, s = Math.floor(n) > 0 || Math.floor(i) > 0) : s = !0, e.internal.mouse = {
						x: t.pageX,
						y: t.pageY
					}, s && e.css.jq.gui.fadeIn(e.options.autohide.fadeIn, function () {
						clearTimeout(e.internal.autohideId), e.internal.autohideId = setTimeout(function () {
							e.css.jq.gui.fadeOut(e.options.autohide.fadeOut)
						}, e.options.autohide.hold)
					})
				};
			this.css.jq.gui.length && (this.css.jq.gui.stop(!0, !0), clearTimeout(this.internal.autohideId), delete this.internal.mouse, this.element.unbind(n), this.css.jq.gui.unbind(n), this.status.nativeVideoControls ? this.css.jq.gui.hide() : this.options.fullWindow && this.options.autohide.full || !this.options.fullWindow && this.options.autohide.restored ? (this.element.bind(i, s), this.css.jq.gui.bind(i, s), this.css.jq.gui.hide()) : this.css.jq.gui.show())
		},
		fullScreen: function (e) {
			var t = "object" == typeof e;
			t && this.options.useStateClassSkin && this.options.fullScreen ? this._setOption("fullScreen", !1) : this._setOption("fullScreen", !0)
		},
		restoreScreen: function () {
			this._setOption("fullScreen", !1)
		},
		_fullscreenAddEventListeners: function () {
			var t = this,
				n = e.jPlayer.nativeFeatures.fullscreen;
			n.api.fullscreenEnabled && n.event.fullscreenchange && ("function" != typeof this.internal.fullscreenchangeHandler && (this.internal.fullscreenchangeHandler = function () {
				t._fullscreenchange()
			}), document.addEventListener(n.event.fullscreenchange, this.internal.fullscreenchangeHandler, !1))
		},
		_fullscreenRemoveEventListeners: function () {
			var t = e.jPlayer.nativeFeatures.fullscreen;
			this.internal.fullscreenchangeHandler && document.removeEventListener(t.event.fullscreenchange, this.internal.fullscreenchangeHandler, !1)
		},
		_fullscreenchange: function () {
			this.options.fullScreen && !e.jPlayer.nativeFeatures.fullscreen.api.fullscreenElement() && this._setOption("fullScreen", !1)
		},
		_requestFullscreen: function () {
			var t = this.ancestorJq.length ? this.ancestorJq[0] : this.element[0],
				n = e.jPlayer.nativeFeatures.fullscreen;
			n.used.webkitVideo && (t = this.htmlElement.video), n.api.fullscreenEnabled && n.api.requestFullscreen(t)
		},
		_exitFullscreen: function () {
			var t, n = e.jPlayer.nativeFeatures.fullscreen;
			n.used.webkitVideo && (t = this.htmlElement.video), n.api.fullscreenEnabled && n.api.exitFullscreen(t)
		},
		_html_initMedia: function (t) {
			var n = e(this.htmlElement.media).empty();
			e.each(t.track || [], function (e, t) {
				var i = document.createElement("track");
				i.setAttribute("kind", t.kind ? t.kind : ""), i.setAttribute("src", t.src ? t.src : ""), i.setAttribute("srclang", t.srclang ? t.srclang : ""), i.setAttribute("label", t.label ? t.label : ""), t.def && i.setAttribute("default", t.def), n.append(i)
			}), this.htmlElement.media.src = this.status.src, "none" !== this.options.preload && this._html_load(), this._trigger(e.jPlayer.event.timeupdate)
		},
		_html_setFormat: function (t) {
			var n = this;
			e.each(this.formats, function (e, i) {
				return n.html.support[i] && t[i] ? (n.status.src = t[i], n.status.format[i] = !0, n.status.formatType = i, !1) : void 0
			})
		},
		_html_setAudio: function (e) {
			this._html_setFormat(e), this.htmlElement.media = this.htmlElement.audio, this._html_initMedia(e)
		},
		_html_setVideo: function (e) {
			this._html_setFormat(e), this.status.nativeVideoControls && (this.htmlElement.video.poster = this._validString(e.poster) ? e.poster : ""), this.htmlElement.media = this.htmlElement.video, this._html_initMedia(e)
		},
		_html_resetMedia: function () {
			this.htmlElement.media && (this.htmlElement.media.id !== this.internal.video.id || this.status.nativeVideoControls || this.internal.video.jq.css({
				width: "0px",
				height: "0px"
			}), this.htmlElement.media.pause())
		},
		_html_clearMedia: function () {
			this.htmlElement.media && (this.htmlElement.media.src = "about:blank", this.htmlElement.media.load())
		},
		_html_load: function () {
			this.status.waitForLoad && (this.status.waitForLoad = !1, this.htmlElement.media.load()), clearTimeout(this.internal.htmlDlyCmdId)
		},
		_html_play: function (e) {
			var t = this,
				n = this.htmlElement.media;
			if (this.androidFix.pause = !1, this._html_load(), this.androidFix.setMedia) this.androidFix.play = !0, this.androidFix.time = e;
			else if (isNaN(e)) n.play();
			else {
				this.internal.cmdsIgnored && n.play();
				try {
					if (n.seekable && !("object" == typeof n.seekable && n.seekable.length > 0)) throw 1;
					n.currentTime = e, n.play()
				} catch (i) {
					return void(this.internal.htmlDlyCmdId = setTimeout(function () {
						t.play(e)
					}, 250))
				}
			}
			this._html_checkWaitForPlay()
		},
		_html_pause: function (e) {
			var t = this,
				n = this.htmlElement.media;
			if (this.androidFix.play = !1, e > 0 ? this._html_load() : clearTimeout(this.internal.htmlDlyCmdId), n.pause(), this.androidFix.setMedia) this.androidFix.pause = !0, this.androidFix.time = e;
			else if (!isNaN(e)) try {
				if (n.seekable && !("object" == typeof n.seekable && n.seekable.length > 0)) throw 1;
				n.currentTime = e
			} catch (i) {
				return void(this.internal.htmlDlyCmdId = setTimeout(function () {
					t.pause(e)
				}, 250))
			}
			e > 0 && this._html_checkWaitForPlay()
		},
		_html_playHead: function (e) {
			var t = this,
				n = this.htmlElement.media;
			this._html_load();
			try {
				if ("object" == typeof n.seekable && n.seekable.length > 0) n.currentTime = e * n.seekable.end(n.seekable.length - 1) / 100;
				else {
					if (!(n.duration > 0) || isNaN(n.duration)) throw "e";
					n.currentTime = e * n.duration / 100
				}
			} catch (i) {
				return void(this.internal.htmlDlyCmdId = setTimeout(function () {
					t.playHead(e)
				}, 250))
			}
			this.status.waitForLoad || this._html_checkWaitForPlay()
		},
		_html_checkWaitForPlay: function () {
			this.status.waitForPlay && (this.status.waitForPlay = !1, this.css.jq.videoPlay.length && this.css.jq.videoPlay.hide(), this.status.video && (this.internal.poster.jq.hide(), this.internal.video.jq.css({
				width: this.status.width,
				height: this.status.height
			})))
		},
		_html_setProperty: function (e, t) {
			this.html.audio.available && (this.htmlElement.audio[e] = t), this.html.video.available && (this.htmlElement.video[e] = t)
		},
		_aurora_setAudio: function (t) {
			var n = this;
			e.each(this.formats, function (e, i) {
				return n.aurora.support[i] && t[i] ? (n.status.src = t[i], n.status.format[i] = !0, n.status.formatType = i, !1) : void 0
			}), this.aurora.player = new AV.Player.fromURL(this.status.src), this._addAuroraEventListeners(this.aurora.player, this.aurora), "auto" === this.options.preload && (this._aurora_load(), this.status.waitForLoad = !1)
		},
		_aurora_resetMedia: function () {
			this.aurora.player && this.aurora.player.stop()
		},
		_aurora_clearMedia: function () {},
		_aurora_load: function () {
			this.status.waitForLoad && (this.status.waitForLoad = !1, this.aurora.player.preload())
		},
		_aurora_play: function (t) {
			this.status.waitForLoad || isNaN(t) || this.aurora.player.seek(t), this.aurora.player.playing || this.aurora.player.play(), this.status.waitForLoad = !1, this._aurora_checkWaitForPlay(), this._updateButtons(!0), this._trigger(e.jPlayer.event.play)
		},
		_aurora_pause: function (t) {
			isNaN(t) || this.aurora.player.seek(1e3 * t), this.aurora.player.pause(), t > 0 && this._aurora_checkWaitForPlay(), this._updateButtons(!1), this._trigger(e.jPlayer.event.pause)
		},
		_aurora_playHead: function (e) {
			this.aurora.player.duration > 0 && this.aurora.player.seek(e * this.aurora.player.duration / 100), this.status.waitForLoad || this._aurora_checkWaitForPlay()
		},
		_aurora_checkWaitForPlay: function () {
			this.status.waitForPlay && (this.status.waitForPlay = !1)
		},
		_aurora_volume: function (e) {
			this.aurora.player.volume = 100 * e
		},
		_aurora_mute: function (e) {
			e ? (this.aurora.properties.lastvolume = this.aurora.player.volume, this.aurora.player.volume = 0) : this.aurora.player.volume = this.aurora.properties.lastvolume, this.aurora.properties.muted = e
		},
		_flash_setAudio: function (t) {
			var n = this;
			try {
				e.each(this.formats, function (e, i) {
					if (n.flash.support[i] && t[i]) {
						switch (i) {
							case "m4a":
							case "fla":
								n._getMovie().fl_setAudio_m4a(t[i]);
								break;
							case "mp3":
								n._getMovie().fl_setAudio_mp3(t[i]);
								break;
							case "rtmpa":
								n._getMovie().fl_setAudio_rtmp(t[i])
						}
						return n.status.src = t[i], n.status.format[i] = !0, n.status.formatType = i, !1
					}
				}), "auto" === this.options.preload && (this._flash_load(), this.status.waitForLoad = !1)
			} catch (i) {
				this._flashError(i)
			}
		},
		_flash_setVideo: function (t) {
			var n = this;
			try {
				e.each(this.formats, function (e, i) {
					if (n.flash.support[i] && t[i]) {
						switch (i) {
							case "m4v":
							case "flv":
								n._getMovie().fl_setVideo_m4v(t[i]);
								break;
							case "rtmpv":
								n._getMovie().fl_setVideo_rtmp(t[i])
						}
						return n.status.src = t[i], n.status.format[i] = !0, n.status.formatType = i, !1
					}
				}), "auto" === this.options.preload && (this._flash_load(), this.status.waitForLoad = !1)
			} catch (i) {
				this._flashError(i)
			}
		},
		_flash_resetMedia: function () {
			this.internal.flash.jq.css({
				width: "0px",
				height: "0px"
			}), this._flash_pause(NaN)
		},
		_flash_clearMedia: function () {
			try {
				this._getMovie().fl_clearMedia()
			} catch (e) {
				this._flashError(e)
			}
		},
		_flash_load: function () {
			try {
				this._getMovie().fl_load()
			} catch (e) {
				this._flashError(e)
			}
			this.status.waitForLoad = !1
		},
		_flash_play: function (e) {
			try {
				this._getMovie().fl_play(e)
			} catch (t) {
				this._flashError(t)
			}
			this.status.waitForLoad = !1, this._flash_checkWaitForPlay()
		},
		_flash_pause: function (e) {
			try {
				this._getMovie().fl_pause(e)
			} catch (t) {
				this._flashError(t)
			}
			e > 0 && (this.status.waitForLoad = !1, this._flash_checkWaitForPlay())
		},
		_flash_playHead: function (e) {
			try {
				this._getMovie().fl_play_head(e)
			} catch (t) {
				this._flashError(t)
			}
			this.status.waitForLoad || this._flash_checkWaitForPlay()
		},
		_flash_checkWaitForPlay: function () {
			this.status.waitForPlay && (this.status.waitForPlay = !1, this.css.jq.videoPlay.length && this.css.jq.videoPlay.hide(), this.status.video && (this.internal.poster.jq.hide(), this.internal.flash.jq.css({
				width: this.status.width,
				height: this.status.height
			})))
		},
		_flash_volume: function (e) {
			try {
				this._getMovie().fl_volume(e)
			} catch (t) {
				this._flashError(t)
			}
		},
		_flash_mute: function (e) {
			try {
				this._getMovie().fl_mute(e)
			} catch (t) {
				this._flashError(t)
			}
		},
		_getMovie: function () {
			return document[this.internal.flash.id]
		},
		_getFlashPluginVersion: function () {
			var e, t = 0;
			if (window.ActiveXObject) try {
				if (e = new ActiveXObject("ShockwaveFlash.ShockwaveFlash")) {
					var n = e.GetVariable("$version");
					n && (n = n.split(" ")[1].split(","), t = parseInt(n[0], 10) + "." + parseInt(n[1], 10))
				}
			} catch (i) {} else navigator.plugins && navigator.mimeTypes.length > 0 && (e = navigator.plugins["Shockwave Flash"], e && (t = navigator.plugins["Shockwave Flash"].description.replace(/.*\s(\d+\.\d+).*/, "$1")));
			return 1 * t
		},
		_checkForFlash: function (e) {
			var t = !1;
			return this._getFlashPluginVersion() >= e && (t = !0), t
		},
		_validString: function (e) {
			return e && "string" == typeof e
		},
		_limitValue: function (e, t, n) {
			return t > e ? t : e > n ? n : e
		},
		_urlNotSetError: function (t) {
			this._error({
				type: e.jPlayer.error.URL_NOT_SET,
				context: t,
				message: e.jPlayer.errorMsg.URL_NOT_SET,
				hint: e.jPlayer.errorHint.URL_NOT_SET
			})
		},
		_flashError: function (t) {
			var n;
			n = this.internal.ready ? "FLASH_DISABLED" : "FLASH", this._error({
				type: e.jPlayer.error[n],
				context: this.internal.flash.swf,
				message: e.jPlayer.errorMsg[n] + t.message,
				hint: e.jPlayer.errorHint[n]
			}), this.internal.flash.jq.css({
				width: "1px",
				height: "1px"
			})
		},
		_error: function (t) {
			this._trigger(e.jPlayer.event.error, t), this.options.errorAlerts && this._alert("Error!" + (t.message ? "\n" + t.message : "") + (t.hint ? "\n" + t.hint : "") + "\nContext: " + t.context)
		},
		_warning: function (n) {
			this._trigger(e.jPlayer.event.warning, t, n), this.options.warningAlerts && this._alert("Warning!" + (n.message ? "\n" + n.message : "") + (n.hint ? "\n" + n.hint : "") + "\nContext: " + n.context)
		},
		_alert: function (e) {
			var t = "jPlayer " + this.version.script + " : id='" + this.internal.self.id + "' : " + e;
			this.options.consoleAlerts ? window.console && window.console.log && window.console.log(t) : alert(t)
		},
		_emulateHtmlBridge: function () {
			var t = this;
			e.each(e.jPlayer.emulateMethods.split(/\s+/g), function (e, n) {
				t.internal.domNode[n] = function (e) {
					t[n](e)
				}
			}), e.each(e.jPlayer.event, function (n, i) {
				var s = !0;
				e.each(e.jPlayer.reservedEvent.split(/\s+/g), function (e, t) {
					return t === n ? (s = !1, !1) : void 0
				}), s && t.element.bind(i + ".jPlayer.jPlayerHtml", function () {
					t._emulateHtmlUpdate();
					var e = document.createEvent("Event");
					e.initEvent(n, !1, !0), t.internal.domNode.dispatchEvent(e)
				})
			})
		},
		_emulateHtmlUpdate: function () {
			var t = this;
			e.each(e.jPlayer.emulateStatus.split(/\s+/g), function (e, n) {
				t.internal.domNode[n] = t.status[n]
			}), e.each(e.jPlayer.emulateOptions.split(/\s+/g), function (e, n) {
				t.internal.domNode[n] = t.options[n]
			})
		},
		_destroyHtmlBridge: function () {
			var t = this;
			this.element.unbind(".jPlayerHtml");
			var n = e.jPlayer.emulateMethods + " " + e.jPlayer.emulateStatus + " " + e.jPlayer.emulateOptions;
			e.each(n.split(/\s+/g), function (e, n) {
				delete t.internal.domNode[n]
			})
		}
	}, e.jPlayer.error = {
		FLASH: "e_flash",
		FLASH_DISABLED: "e_flash_disabled",
		NO_SOLUTION: "e_no_solution",
		NO_SUPPORT: "e_no_support",
		URL: "e_url",
		URL_NOT_SET: "e_url_not_set",
		VERSION: "e_version"
	}, e.jPlayer.errorMsg = {
		FLASH: "jPlayer's Flash fallback is not configured correctly, or a command was issued before the jPlayer Ready event. Details: ",
		FLASH_DISABLED: "jPlayer's Flash fallback has been disabled by the browser due to the CSS rules you have used. Details: ",
		NO_SOLUTION: "No solution can be found by jPlayer in this browser. Neither HTML nor Flash can be used.",
		NO_SUPPORT: "It is not possible to play any media format provided in setMedia() on this browser using your current options.",
		URL: "Media URL could not be loaded.",
		URL_NOT_SET: "Attempt to issue media playback commands, while no media url is set.",
		VERSION: "jPlayer " + e.jPlayer.prototype.version.script + " needs Jplayer.swf version " + e.jPlayer.prototype.version.needFlash + " but found "
	}, e.jPlayer.errorHint = {
		FLASH: "Check your swfPath option and that Jplayer.swf is there.",
		FLASH_DISABLED: "Check that you have not display:none; the jPlayer entity or any ancestor.",
		NO_SOLUTION: "Review the jPlayer options: support and supplied.",
		NO_SUPPORT: "Video or audio formats defined in the supplied option are missing.",
		URL: "Check media URL is valid.",
		URL_NOT_SET: "Use setMedia() to set the media URL.",
		VERSION: "Update jPlayer files."
	}, e.jPlayer.warning = {
		CSS_SELECTOR_COUNT: "e_css_selector_count",
		CSS_SELECTOR_METHOD: "e_css_selector_method",
		CSS_SELECTOR_STRING: "e_css_selector_string",
		OPTION_KEY: "e_option_key"
	}, e.jPlayer.warningMsg = {
		CSS_SELECTOR_COUNT: "The number of css selectors found did not equal one: ",
		CSS_SELECTOR_METHOD: "The methodName given in jPlayer('cssSelector') is not a valid jPlayer method.",
		CSS_SELECTOR_STRING: "The methodCssSelector given in jPlayer('cssSelector') is not a String or is empty.",
		OPTION_KEY: "The option requested in jPlayer('option') is undefined."
	}, e.jPlayer.warningHint = {
		CSS_SELECTOR_COUNT: "Check your css selector and the ancestor.",
		CSS_SELECTOR_METHOD: "Check your method name.",
		CSS_SELECTOR_STRING: "Check your css selector is a string.",
		OPTION_KEY: "Check your option name."
	}
}),
function e(t, n, i) {
	function s(a, o) {
		if (!n[a]) {
			if (!t[a]) {
				var l = "function" == typeof require && require;
				if (!o && l) return l(a, !0);
				if (r) return r(a, !0);
				var u = new Error("Cannot find module '" + a + "'");
				throw u.code = "MODULE_NOT_FOUND", u
			}
			var c = n[a] = {
				exports: {}
			};
			t[a][0].call(c.exports, function (e) {
				var n = t[a][1][e];
				return s(n ? n : e)
			}, c, c.exports, e, t, n, i)
		}
		return n[a].exports
	}
	for (var r = "function" == typeof require && require, a = 0; a < i.length; a++) s(i[a]);
	return s
}({
	"/Users/ross/Projects/urban-radio/src/scripts/app.js": [function (e, t, n) {
		"use strict";
		e("fun");
		$(document).ready(function () {
			var e = $(".js-singer"),
				t = $(".js-song"),
				n = void 0,
				i = void 0,
				s = function (s) {
					var r = s.query.results.json;
					i !== r.artist && (e.html(r.artist), i = r.artist), n !== r.title && (t.html(r.title), n = r.title)
				},
				r = function () {
					$.getJSON("http://query.yahooapis.com/v1/public/yql", {
						q: 'select * from json where url="http://mjoy.ua/radio/station/urban-space-radio/playlist.json"',
						format: "json"
					}).done(s)
				};
			r(), setInterval(r, 5e3);
			var a = {
					mp3: "http://stream.mjoy.ua:8000/urban-space-radio",
					m4a: "http://stream.mjoy.ua:8000/urban-space-radio-aac"
				},
				o = !1,
				l = navigator.userAgent.toLowerCase().indexOf("chrome") > -1,
				u = "undefined" != typeof window.orientation,
				c = l && !u;
			$("#jquery_jplayer_1").jPlayer({
				ready: function () {
					o = !0, $(this).jPlayer("setMedia", a).jPlayer("play")
				},
				pause: function () {
					$(this).jPlayer("clearMedia")
				},
				error: function (e) {
					o && e.jPlayer.error.type === $.jPlayer.error.URL_NOT_SET && $(this).jPlayer("setMedia", a).jPlayer("play")
				},
				swfPath: "http://jplayer.org/latest/dist/jplayer",
				supplied: c ? "m4a,mp3" : "mp3",
				solution: "html",
				preload: "none",
				wmode: "window",
				useStateClassSkin: !0,
				autoBlur: !1,
				keyEnabled: !0
			}), FastClick.attach(document.body)
		})
	}, {
		fun: "/Users/ross/Projects/urban-radio/src/scripts/fun.js"
	}],
	"/Users/ross/Projects/urban-radio/src/scripts/fun.js": [function (e, t, n) {
		"use strict";
		t.exports = function () {
			function e() {
				t = t.map(function () {
					return 6 * Math.random() + 1 << 0
				});
				var s = n.map(function (e, n) {
					return t.map(function (e) {
						return e > n ? " " : "$"
					}).join("")
				}).join("\n");
				console && console.log && console.log(i + s), setTimeout(e, 1e3)
			}
			var t = Array(87).fill(0),
				n = Array(7).fill(0),
				i = "\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n██╗   ██╗██████╗ ██████╗  █████╗ ███╗   ██╗    ███████╗██████╗  █████╗  ██████╗███████╗\n██║   ██║██╔══██╗██╔══██╗██╔══██╗████╗  ██║    ██╔════╝██╔══██╗██╔══██╗██╔════╝██╔════╝\n██║   ██║██████╔╝██████╔╝███████║██╔██╗ ██║    ███████╗██████╔╝███████║██║     █████╗\n██║   ██║██╔══██╗██╔══██╗██╔══██║██║╚██╗██║    ╚════██║██╔═══╝ ██╔══██║██║     ██╔══╝\n╚██████╔╝██║  ██║██████╔╝██║  ██║██║ ╚████║    ███████║██║     ██║  ██║╚██████╗███████╗\n ╚═════╝ ╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝    ╚══════╝╚═╝     ╚═╝  ╚═╝ ╚═════╝╚══════╝\n\n                        ██████╗  █████╗ ██████╗ ██╗ ██████╗\n                        ██╔══██╗██╔══██╗██╔══██╗██║██╔═══██╗\n                        ██████╔╝███████║██║  ██║██║██║   ██║\n                        ██╔══██╗██╔══██║██║  ██║██║██║   ██║\n                        ██║  ██║██║  ██║██████╔╝██║╚██████╔╝\n                        ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚═╝ ╚═════╝\n";
			e()
		}
	}, {}]
}, {}, ["/Users/ross/Projects/urban-radio/src/scripts/app.js"]);
