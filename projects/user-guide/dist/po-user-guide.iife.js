/*! @po-ui/user-guide | MIT License | https://po-ui.io | inclui driver.js (MIT) e DOMPurify (MPL-2.0) */
var PoUserGuide = (function () {
  'use strict';
  let e,
    t = {};
  function n(e = {}) {
    t = {
      animate: !0,
      allowClose: !0,
      overlayClickBehavior: 'close',
      overlayOpacity: 0.7,
      smoothScroll: !1,
      disableActiveInteraction: !1,
      showProgress: !1,
      stagePadding: 10,
      stageRadius: 5,
      popoverOffset: 10,
      showButtons: ['next', 'previous', 'close'],
      disableButtons: [],
      overlayColor: '#000',
      ...e
    };
  }
  function o(e) {
    return e ? t[e] : t;
  }
  function i() {
    return e;
  }
  let r = {};
  function s(e, t) {
    r[e] = t;
  }
  function a(e) {
    var t;
    null == (t = r[e]) || t.call(r);
  }
  function l(e, t, n, o) {
    return (e /= o / 2) < 1 ? (n / 2) * e * e + t : (-n / 2) * (--e * (e - 2) - 1) + t;
  }
  function c(e) {
    const t =
      'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])';
    return e
      .flatMap(e => {
        const n = e.matches(t),
          o = Array.from(e.querySelectorAll(t));
        return [...(n ? [e] : []), ...o];
      })
      .filter(
        e =>
          'none' !== getComputedStyle(e).pointerEvents &&
          (function (e) {
            return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
          })(e)
      );
  }
  function d(e) {
    if (
      !e ||
      (function (e) {
        const t = e.getBoundingClientRect();
        return (
          t.top >= 0 &&
          t.left >= 0 &&
          t.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
          t.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
      })(e)
    )
      return;
    const t = o('smoothScroll'),
      n = e.offsetHeight > window.innerHeight;
    e.scrollIntoView({ behavior: !t || p(e) ? 'auto' : 'smooth', inline: 'center', block: n ? 'start' : 'center' });
  }
  function p(e) {
    if (!e || !e.parentElement) return;
    const t = e.parentElement;
    return t.scrollHeight > t.clientHeight;
  }
  let u = {};
  function m(e, t) {
    u[e] = t;
  }
  function f(e) {
    return e ? u[e] : u;
  }
  function h() {
    u = {};
  }
  function v(e) {
    if (!e) return;
    const t = e.getBoundingClientRect(),
      n = { x: t.x, y: t.y, width: t.width, height: t.height };
    (m('__activeStagePosition', n), y(n));
  }
  function g(e) {
    const t = (function (e) {
      const t = window.innerWidth,
        n = window.innerHeight,
        i = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      (i.classList.add('driver-overlay', 'driver-overlay-animated'),
        i.setAttribute('viewBox', `0 0 ${t} ${n}`),
        i.setAttribute('xmlSpace', 'preserve'),
        i.setAttribute('xmlnsXlink', 'http://www.w3.org/1999/xlink'),
        i.setAttribute('version', '1.1'),
        i.setAttribute('preserveAspectRatio', 'xMinYMin slice'),
        (i.style.fillRule = 'evenodd'),
        (i.style.clipRule = 'evenodd'),
        (i.style.strokeLinejoin = 'round'),
        (i.style.strokeMiterlimit = '2'),
        (i.style.zIndex = '10000'),
        (i.style.position = 'fixed'),
        (i.style.top = '0'),
        (i.style.left = '0'),
        (i.style.width = '100%'),
        (i.style.height = '100%'));
      const r = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      return (
        r.setAttribute('d', w(e)),
        (r.style.fill = o('overlayColor') || 'rgb(0,0,0)'),
        (r.style.opacity = `${o('overlayOpacity')}`),
        (r.style.pointerEvents = 'auto'),
        (r.style.cursor = 'auto'),
        i.appendChild(r),
        i
      );
    })(e);
    (document.body.appendChild(t),
      E(t, e => {
        'path' === e.target.tagName && a('overlayClick');
      }),
      m('__overlaySvg', t));
  }
  function y(e) {
    const t = f('__overlaySvg');
    if (!t) return void g(e);
    const n = t.firstElementChild;
    if ('path' !== (null == n ? void 0 : n.tagName)) throw new Error('no path element found in stage svg');
    n.setAttribute('d', w(e));
  }
  function w(e) {
    const t = window.innerWidth,
      n = window.innerHeight,
      i = o('stagePadding') || 0,
      r = o('stageRadius') || 0,
      s = e.width + 2 * i,
      a = e.height + 2 * i,
      l = Math.min(r, s / 2, a / 2),
      c = Math.floor(Math.max(l, 0)),
      d = s - 2 * c,
      p = a - 2 * c;
    return `M${t},0L0,0L0,${n}L${t},${n}L${t},0Z\n    M${e.x - i + c},${e.y - i} h${d} a${c},${c} 0 0 1 ${c},${c} v${p} a${c},${c} 0 0 1 -${c},${c} h-${d} a${c},${c} 0 0 1 -${c},-${c} v-${p} a${c},${c} 0 0 1 ${c},-${c} z`;
  }
  function b(e) {
    const { element: t } = e;
    let n = 'function' == typeof t ? t() : 'string' == typeof t ? document.querySelector(t) : t;
    (n ||
      (n = (function () {
        const e = document.getElementById('driver-dummy-element');
        if (e) return e;
        let t = document.createElement('div');
        return (
          (t.id = 'driver-dummy-element'),
          (t.style.width = '0'),
          (t.style.height = '0'),
          (t.style.pointerEvents = 'none'),
          (t.style.opacity = '0'),
          (t.style.position = 'fixed'),
          (t.style.top = '50%'),
          (t.style.left = '50%'),
          document.body.appendChild(t),
          t
        );
      })()),
      (function (e, t) {
        var n;
        const r = Date.now(),
          s = f('__activeStep'),
          a = f('__activeElement') || e,
          c = !a || a === e,
          p = 'driver-dummy-element' === e.id,
          u = 'driver-dummy-element' === a.id,
          h = o('animate'),
          g = t.onHighlightStarted || o('onHighlightStarted'),
          w = (null == t ? void 0 : t.onHighlighted) || o('onHighlighted'),
          b = (null == s ? void 0 : s.onDeselected) || o('onDeselected'),
          T = o(),
          x = f();
        (!c && b && b(u ? void 0 : a, s, { config: T, state: x, driver: i() }),
          g && g(p ? void 0 : e, t, { config: T, state: x, driver: i() }));
        const S = !c && h;
        let A = !1;
        ((function () {
          const e = f('popover');
          e && (e.wrapper.style.display = 'none');
        })(),
          m('previousStep', s),
          m('previousElement', a),
          m('activeStep', t),
          m('activeElement', e));
        const E = () => {
          if (f('__transitionCallback') !== E) return;
          const n = Date.now() - r,
            c = 400 - n <= 200;
          (t.popover && c && !A && S && (_(e, t), (A = !0)),
            o('animate') && n < 400
              ? (function (e, t, n, o) {
                  let i = f('__activeStagePosition');
                  const r = i || n.getBoundingClientRect(),
                    s = o.getBoundingClientRect();
                  ((i = {
                    x: l(e, r.x, s.x - r.x, t),
                    y: l(e, r.y, s.y - r.y, t),
                    width: l(e, r.width, s.width - r.width, t),
                    height: l(e, r.height, s.height - r.height, t)
                  }),
                    y(i),
                    m('__activeStagePosition', i));
                })(n, 400, a, e)
              : (v(e),
                w && w(p ? void 0 : e, t, { config: o(), state: f(), driver: i() }),
                m('__transitionCallback', void 0),
                m('__previousStep', s),
                m('__previousElement', a),
                m('__activeStep', t),
                m('__activeElement', e)),
            window.requestAnimationFrame(E));
        };
        (m('__transitionCallback', E),
          window.requestAnimationFrame(E),
          d(e),
          !S && t.popover && _(e, t),
          a.classList.remove('driver-active-element', 'driver-no-interaction'),
          a.removeAttribute('aria-haspopup'),
          a.removeAttribute('aria-expanded'),
          a.removeAttribute('aria-controls'),
          (null != (n = t.disableActiveInteraction) ? n : o('disableActiveInteraction')) &&
            e.classList.add('driver-no-interaction'),
          e.classList.add('driver-active-element'),
          e.setAttribute('aria-haspopup', 'dialog'),
          e.setAttribute('aria-expanded', 'true'),
          e.setAttribute('aria-controls', 'driver-popover-content'));
      })(n, e));
  }
  function T() {
    const e = f('__activeElement'),
      t = f('__activeStep');
    e &&
      (v(e),
      (function () {
        const e = f('__activeStagePosition'),
          t = f('__overlaySvg');
        if (!e) return;
        if (!t) return void console.warn('No stage svg found.');
        const n = window.innerWidth,
          o = window.innerHeight;
        t.setAttribute('viewBox', `0 0 ${n} ${o}`);
      })(),
      L(e, t));
  }
  function x() {
    const e = f('__resizeTimeout');
    (e && window.cancelAnimationFrame(e), m('__resizeTimeout', window.requestAnimationFrame(T)));
  }
  function S(e) {
    var t;
    if (!f('isInitialized') || ('Tab' !== e.key && 9 !== e.keyCode)) return;
    const n = f('__activeElement'),
      o = null == (t = f('popover')) ? void 0 : t.wrapper,
      i = c([...(o ? [o] : []), ...(n ? [n] : [])]),
      r = i[0],
      s = i[i.length - 1];
    if ((e.preventDefault(), e.shiftKey)) {
      const e = i[i.indexOf(document.activeElement) - 1] || s;
      null == e || e.focus();
    } else {
      const e = i[i.indexOf(document.activeElement) + 1] || r;
      null == e || e.focus();
    }
  }
  function A(e) {
    var t;
    (null == (t = o('allowKeyboardControl')) || t) &&
      ('Escape' === e.key
        ? a('escapePress')
        : 'ArrowRight' === e.key
          ? a('arrowRightPress')
          : 'ArrowLeft' === e.key && a('arrowLeftPress'));
  }
  function E(e, t, n) {
    const o = (t, o) => {
      const i = t.target;
      e.contains(i) &&
        ((!n || n(i)) && (t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation()), null == o || o(t));
    };
    (document.addEventListener('pointerdown', o, !0),
      document.addEventListener('mousedown', o, !0),
      document.addEventListener('pointerup', o, !0),
      document.addEventListener('mouseup', o, !0),
      document.addEventListener(
        'click',
        e => {
          o(e, t);
        },
        !0
      ));
  }
  function _(e, t) {
    var n, r;
    let s = f('popover');
    (s && document.body.removeChild(s.wrapper),
      (s = (function () {
        const e = document.createElement('div');
        e.classList.add('driver-popover');
        const t = document.createElement('div');
        t.classList.add('driver-popover-arrow');
        const n = document.createElement('header');
        ((n.id = 'driver-popover-title'),
          n.classList.add('driver-popover-title'),
          (n.style.display = 'none'),
          (n.innerText = 'Popover Title'));
        const o = document.createElement('div');
        ((o.id = 'driver-popover-description'),
          o.classList.add('driver-popover-description'),
          (o.style.display = 'none'),
          (o.innerText = 'Popover description is here'));
        const i = document.createElement('button');
        ((i.type = 'button'),
          i.classList.add('driver-popover-close-btn'),
          i.setAttribute('aria-label', 'Close'),
          (i.innerHTML = '&times;'));
        const r = document.createElement('footer');
        r.classList.add('driver-popover-footer');
        const s = document.createElement('span');
        (s.classList.add('driver-popover-progress-text'), (s.innerText = ''));
        const a = document.createElement('span');
        a.classList.add('driver-popover-navigation-btns');
        const l = document.createElement('button');
        ((l.type = 'button'), l.classList.add('driver-popover-prev-btn'), (l.innerHTML = '&larr; Previous'));
        const c = document.createElement('button');
        return (
          (c.type = 'button'),
          c.classList.add('driver-popover-next-btn'),
          (c.innerHTML = 'Next &rarr;'),
          a.appendChild(l),
          a.appendChild(c),
          r.appendChild(s),
          r.appendChild(a),
          e.appendChild(i),
          e.appendChild(t),
          e.appendChild(n),
          e.appendChild(o),
          e.appendChild(r),
          {
            wrapper: e,
            arrow: t,
            title: n,
            description: o,
            footer: r,
            previousButton: l,
            nextButton: c,
            closeButton: i,
            footerButtons: a,
            progress: s
          }
        );
      })()),
      document.body.appendChild(s.wrapper));
    const {
      title: l,
      description: p,
      showButtons: u,
      disableButtons: h,
      showProgress: v,
      nextBtnText: g = o('nextBtnText') || 'Next &rarr;',
      prevBtnText: y = o('prevBtnText') || '&larr; Previous',
      progressText: w = o('progressText') || '{current} of {total}'
    } = t.popover || {};
    ((s.nextButton.innerHTML = g),
      (s.previousButton.innerHTML = y),
      (s.progress.innerHTML = w),
      l ? ((s.title.innerHTML = l), (s.title.style.display = 'block')) : (s.title.style.display = 'none'),
      p
        ? ((s.description.innerHTML = p), (s.description.style.display = 'block'))
        : (s.description.style.display = 'none'));
    const b = u || o('showButtons'),
      T = v || o('showProgress') || !1,
      x = (null == b ? void 0 : b.includes('next')) || (null == b ? void 0 : b.includes('previous')) || T;
    ((s.closeButton.style.display = b.includes('close') ? 'block' : 'none'),
      x
        ? ((s.footer.style.display = 'flex'),
          (s.progress.style.display = T ? 'block' : 'none'),
          (s.nextButton.style.display = b.includes('next') ? 'block' : 'none'),
          (s.previousButton.style.display = b.includes('previous') ? 'block' : 'none'))
        : (s.footer.style.display = 'none'));
    const S = h || o('disableButtons') || [];
    (null != S &&
      S.includes('next') &&
      ((s.nextButton.disabled = !0), s.nextButton.classList.add('driver-popover-btn-disabled')),
      null != S &&
        S.includes('previous') &&
        ((s.previousButton.disabled = !0), s.previousButton.classList.add('driver-popover-btn-disabled')),
      null != S &&
        S.includes('close') &&
        ((s.closeButton.disabled = !0), s.closeButton.classList.add('driver-popover-btn-disabled')));
    const A = s.wrapper;
    ((A.style.display = 'block'),
      (A.style.left = ''),
      (A.style.top = ''),
      (A.style.bottom = ''),
      (A.style.right = ''),
      (A.id = 'driver-popover-content'),
      A.setAttribute('role', 'dialog'),
      A.setAttribute('aria-labelledby', 'driver-popover-title'),
      A.setAttribute('aria-describedby', 'driver-popover-description'));
    s.arrow.className = 'driver-popover-arrow';
    const _ = (null == (n = t.popover) ? void 0 : n.popoverClass) || o('popoverClass') || '';
    ((A.className = `driver-popover ${_}`.trim()),
      E(
        s.wrapper,
        n => {
          var r, s, l;
          const c = n.target,
            d = (null == (r = t.popover) ? void 0 : r.onNextClick) || o('onNextClick'),
            p = (null == (s = t.popover) ? void 0 : s.onPrevClick) || o('onPrevClick'),
            u = (null == (l = t.popover) ? void 0 : l.onCloseClick) || o('onCloseClick');
          return c.closest('.driver-popover-next-btn')
            ? d
              ? d(e, t, { config: o(), state: f(), driver: i() })
              : a('nextClick')
            : c.closest('.driver-popover-prev-btn')
              ? p
                ? p(e, t, { config: o(), state: f(), driver: i() })
                : a('prevClick')
              : c.closest('.driver-popover-close-btn')
                ? u
                  ? u(e, t, { config: o(), state: f(), driver: i() })
                  : a('closeClick')
                : void 0;
        },
        e =>
          !(null != s && s.description.contains(e)) &&
          !(null != s && s.title.contains(e)) &&
          'string' == typeof e.className &&
          e.className.includes('driver-popover')
      ),
      m('popover', s));
    const C = (null == (r = t.popover) ? void 0 : r.onPopoverRender) || o('onPopoverRender');
    (C && C(s, { config: o(), state: f(), driver: i() }), L(e, t), d(A));
    const N = c([A, ...(e.classList.contains('driver-dummy-element') ? [] : [e])]);
    N.length > 0 && N[0].focus();
  }
  function C() {
    const e = f('popover');
    if (null == e || !e.wrapper) return;
    const t = e.wrapper.getBoundingClientRect(),
      n = o('stagePadding') || 0,
      i = o('popoverOffset') || 0;
    return { width: t.width + n + i, height: t.height + n + i, realWidth: t.width, realHeight: t.height };
  }
  function N(e, t) {
    const { elementDimensions: n, popoverDimensions: o, popoverPadding: i, popoverArrowDimensions: r } = t;
    return 'start' === e
      ? Math.max(Math.min(n.top - i, window.innerHeight - o.realHeight - r.width), r.width)
      : 'end' === e
        ? Math.max(
            Math.min(
              n.top - (null == o ? void 0 : o.realHeight) + n.height + i,
              window.innerHeight - (null == o ? void 0 : o.realHeight) - r.width
            ),
            r.width
          )
        : 'center' === e
          ? Math.max(
              Math.min(
                n.top + n.height / 2 - (null == o ? void 0 : o.realHeight) / 2,
                window.innerHeight - (null == o ? void 0 : o.realHeight) - r.width
              ),
              r.width
            )
          : 0;
  }
  function I(e, t) {
    const { elementDimensions: n, popoverDimensions: o, popoverPadding: i, popoverArrowDimensions: r } = t;
    return 'start' === e
      ? Math.max(Math.min(n.left - i, window.innerWidth - o.realWidth - r.width), r.width)
      : 'end' === e
        ? Math.max(
            Math.min(
              n.left - (null == o ? void 0 : o.realWidth) + n.width + i,
              window.innerWidth - (null == o ? void 0 : o.realWidth) - r.width
            ),
            r.width
          )
        : 'center' === e
          ? Math.max(
              Math.min(
                n.left + n.width / 2 - (null == o ? void 0 : o.realWidth) / 2,
                window.innerWidth - (null == o ? void 0 : o.realWidth) - r.width
              ),
              r.width
            )
          : 0;
  }
  function L(e, t) {
    const n = f('popover');
    if (!n) return;
    const { align: i = 'start', side: r = 'left' } = (null == t ? void 0 : t.popover) || {},
      s = i,
      a = 'driver-dummy-element' === e.id ? 'over' : r,
      l = o('stagePadding') || 0,
      c = C(),
      d = n.arrow.getBoundingClientRect(),
      p = e.getBoundingClientRect(),
      u = p.top - c.height;
    let m = u >= 0;
    const h = window.innerHeight - (p.bottom + c.height);
    let v = h >= 0;
    const g = p.left - c.width;
    let y = g >= 0;
    const w = window.innerWidth - (p.right + c.width);
    let b = w >= 0;
    const T = !(m || v || y || b);
    let x = a;
    if (
      ('top' === a && m
        ? (b = y = v = !1)
        : 'bottom' === a && v
          ? (b = y = m = !1)
          : 'left' === a && y
            ? (b = m = v = !1)
            : 'right' === a && b && (y = m = v = !1),
      'over' === a)
    ) {
      const e = window.innerWidth / 2 - c.realWidth / 2,
        t = window.innerHeight / 2 - c.realHeight / 2;
      ((n.wrapper.style.left = `${e}px`),
        (n.wrapper.style.right = 'auto'),
        (n.wrapper.style.top = `${t}px`),
        (n.wrapper.style.bottom = 'auto'));
    } else if (T) {
      const e = window.innerWidth / 2 - (null == c ? void 0 : c.realWidth) / 2,
        t = 10;
      ((n.wrapper.style.left = `${e}px`),
        (n.wrapper.style.right = 'auto'),
        (n.wrapper.style.bottom = `${t}px`),
        (n.wrapper.style.top = 'auto'));
    } else if (y) {
      const e = Math.min(g, window.innerWidth - (null == c ? void 0 : c.realWidth) - d.width),
        t = N(s, { elementDimensions: p, popoverDimensions: c, popoverPadding: l, popoverArrowDimensions: d });
      ((n.wrapper.style.left = `${e}px`),
        (n.wrapper.style.top = `${t}px`),
        (n.wrapper.style.bottom = 'auto'),
        (n.wrapper.style.right = 'auto'),
        (x = 'left'));
    } else if (b) {
      const e = Math.min(w, window.innerWidth - (null == c ? void 0 : c.realWidth) - d.width),
        t = N(s, { elementDimensions: p, popoverDimensions: c, popoverPadding: l, popoverArrowDimensions: d });
      ((n.wrapper.style.right = `${e}px`),
        (n.wrapper.style.top = `${t}px`),
        (n.wrapper.style.bottom = 'auto'),
        (n.wrapper.style.left = 'auto'),
        (x = 'right'));
    } else if (m) {
      const e = Math.min(u, window.innerHeight - c.realHeight - d.width);
      let t = I(s, { elementDimensions: p, popoverDimensions: c, popoverPadding: l, popoverArrowDimensions: d });
      ((n.wrapper.style.top = `${e}px`),
        (n.wrapper.style.left = `${t}px`),
        (n.wrapper.style.bottom = 'auto'),
        (n.wrapper.style.right = 'auto'),
        (x = 'top'));
    } else if (v) {
      const e = Math.min(h, window.innerHeight - (null == c ? void 0 : c.realHeight) - d.width);
      let t = I(s, { elementDimensions: p, popoverDimensions: c, popoverPadding: l, popoverArrowDimensions: d });
      ((n.wrapper.style.left = `${t}px`),
        (n.wrapper.style.bottom = `${e}px`),
        (n.wrapper.style.top = 'auto'),
        (n.wrapper.style.right = 'auto'),
        (x = 'bottom'));
    }
    T
      ? n.arrow.classList.add('driver-popover-arrow-none')
      : (function (e, t, n) {
          const i = f('popover');
          if (!i) return;
          const r = n.getBoundingClientRect(),
            s = C(),
            a = i.arrow,
            l = s.width,
            c = window.innerWidth,
            d = r.width,
            p = r.left,
            u = s.height,
            m = window.innerHeight,
            h = r.top,
            v = r.height;
          a.className = 'driver-popover-arrow';
          let g = t,
            y = e;
          if (
            ('top' === t
              ? (p + d <= 0 ? ((g = 'right'), (y = 'end')) : p + d - l <= 0 && ((g = 'top'), (y = 'start')),
                p >= c ? ((g = 'left'), (y = 'end')) : p + l >= c && ((g = 'top'), (y = 'end')))
              : 'bottom' === t
                ? (p + d <= 0 ? ((g = 'right'), (y = 'start')) : p + d - l <= 0 && ((g = 'bottom'), (y = 'start')),
                  p >= c ? ((g = 'left'), (y = 'start')) : p + l >= c && ((g = 'bottom'), (y = 'end')))
                : 'left' === t
                  ? (h + v <= 0 ? ((g = 'bottom'), (y = 'end')) : h + v - u <= 0 && ((g = 'left'), (y = 'start')),
                    h >= m ? ((g = 'top'), (y = 'end')) : h + u >= m && ((g = 'left'), (y = 'end')))
                  : 'right' === t &&
                    (h + v <= 0 ? ((g = 'bottom'), (y = 'start')) : h + v - u <= 0 && ((g = 'right'), (y = 'start')),
                    h >= m ? ((g = 'top'), (y = 'start')) : h + u >= m && ((g = 'right'), (y = 'end'))),
            g)
          ) {
            (a.classList.add(`driver-popover-arrow-side-${g}`), a.classList.add(`driver-popover-arrow-align-${y}`));
            const e = n.getBoundingClientRect(),
              r = a.getBoundingClientRect(),
              s = o('stagePadding') || 0,
              l =
                e.left - s < window.innerWidth && e.right + s > 0 && e.top - s < window.innerHeight && e.bottom + s > 0;
            'bottom' === t &&
              l &&
              (r.x > e.x && r.x + r.width < e.x + e.width
                ? (i.wrapper.style.transform = 'translateY(0)')
                : (a.classList.remove(`driver-popover-arrow-align-${y}`),
                  a.classList.add('driver-popover-arrow-none'),
                  (i.wrapper.style.transform = `translateY(-${s / 2}px)`)));
          } else a.classList.add('driver-popover-arrow-none');
        })(s, x, e);
  }
  function O(t = {}) {
    function a() {
      o('allowClose') && y();
    }
    function l() {
      const e = o('overlayClickBehavior');
      if (o('allowClose') && 'close' === e) y();
      else {
        if ('function' == typeof e) {
          const t = f('__activeStep');
          return void e(f('__activeElement'), t, { config: o(), state: f(), driver: i() });
        }
        'nextStep' === e && c();
      }
    }
    function c() {
      const e = f('activeIndex'),
        t = o('steps') || [];
      if (void 0 === e) return;
      const n = e + 1;
      t[n] ? g(n) : y();
    }
    function d() {
      const e = f('activeIndex'),
        t = o('steps') || [];
      if (void 0 === e) return;
      const n = e - 1;
      t[n] ? g(n) : y();
    }
    function p() {
      var e;
      if (f('__transitionCallback')) return;
      const t = f('activeIndex'),
        n = f('__activeStep'),
        r = f('__activeElement');
      if (void 0 === t || void 0 === n || void 0 === f('activeIndex')) return;
      const s = (null == (e = n.popover) ? void 0 : e.onPrevClick) || o('onPrevClick');
      if (s) return s(r, n, { config: o(), state: f(), driver: i() });
      d();
    }
    function u() {
      var e;
      if (f('__transitionCallback')) return;
      const t = f('activeIndex'),
        n = f('__activeStep'),
        r = f('__activeElement');
      if (void 0 === t || void 0 === n) return;
      const s = (null == (e = n.popover) ? void 0 : e.onNextClick) || o('onNextClick');
      if (s) return s(r, n, { config: o(), state: f(), driver: i() });
      c();
    }
    function v() {
      f('isInitialized') ||
        (m('isInitialized', !0),
        document.body.classList.add('driver-active', o('animate') ? 'driver-fade' : 'driver-simple'),
        window.addEventListener('keyup', A, !1),
        window.addEventListener('keydown', S, !1),
        window.addEventListener('resize', x),
        window.addEventListener('scroll', x),
        s('overlayClick', l),
        s('escapePress', a),
        s('arrowLeftPress', p),
        s('arrowRightPress', u));
    }
    function g(e = 0) {
      var t, n, i, r, s, a, l, c;
      const d = o('steps');
      if (!d) return (console.error('No steps to drive through'), void y());
      if (!d[e]) return void y();
      (m('__activeOnDestroyed', document.activeElement), m('activeIndex', e));
      const p = d[e],
        u = d[e + 1],
        f = d[e - 1],
        h = (null == (t = p.popover) ? void 0 : t.doneBtnText) || o('doneBtnText') || 'Done',
        v = o('allowClose'),
        w =
          void 0 !== (null == (n = p.popover) ? void 0 : n.showProgress)
            ? null == (i = p.popover)
              ? void 0
              : i.showProgress
            : o('showProgress'),
        T = ((null == (r = p.popover) ? void 0 : r.progressText) || o('progressText') || '{{current}} of {{total}}')
          .replace('{{current}}', `${e + 1}`)
          .replace('{{total}}', `${d.length}`),
        x = (null == (s = p.popover) ? void 0 : s.showButtons) || o('showButtons'),
        S = ['next', 'previous', ...(v ? ['close'] : [])].filter(e => !(null != x && x.length) || x.includes(e)),
        A = (null == (a = p.popover) ? void 0 : a.onNextClick) || o('onNextClick'),
        E = (null == (l = p.popover) ? void 0 : l.onPrevClick) || o('onPrevClick'),
        _ = (null == (c = p.popover) ? void 0 : c.onCloseClick) || o('onCloseClick');
      b({
        ...p,
        popover: {
          showButtons: S,
          nextBtnText: u ? void 0 : h,
          disableButtons: [...(f ? [] : ['previous'])],
          showProgress: w,
          progressText: T,
          onNextClick:
            A ||
            (() => {
              u ? g(e + 1) : y();
            }),
          onPrevClick:
            E ||
            (() => {
              g(e - 1);
            }),
          onCloseClick:
            _ ||
            (() => {
              y();
            }),
          ...((null == p ? void 0 : p.popover) || {})
        }
      });
    }
    function y(e = !0) {
      const t = f('__activeElement'),
        n = f('__activeStep'),
        s = f('__activeOnDestroyed'),
        a = o('onDestroyStarted');
      if (e && a) {
        return void a(!t || 'driver-dummy-element' === (null == t ? void 0 : t.id) ? void 0 : t, n, {
          config: o(),
          state: f(),
          driver: i()
        });
      }
      const l = (null == n ? void 0 : n.onDeselected) || o('onDeselected'),
        c = o('onDestroyed');
      if (
        (document.body.classList.remove('driver-active', 'driver-fade', 'driver-simple'),
        window.removeEventListener('keyup', A),
        window.removeEventListener('resize', x),
        window.removeEventListener('scroll', x),
        (function () {
          var e;
          const t = f('popover');
          t && (null == (e = t.wrapper.parentElement) || e.removeChild(t.wrapper));
        })(),
        (function () {
          var e;
          (null == (e = document.getElementById('driver-dummy-element')) || e.remove(),
            document.querySelectorAll('.driver-active-element').forEach(e => {
              (e.classList.remove('driver-active-element', 'driver-no-interaction'),
                e.removeAttribute('aria-haspopup'),
                e.removeAttribute('aria-expanded'),
                e.removeAttribute('aria-controls'));
            }));
        })(),
        (function () {
          const e = f('__overlaySvg');
          e && e.remove();
        })(),
        (r = {}),
        h(),
        t && n)
      ) {
        const e = 'driver-dummy-element' === t.id;
        (l && l(e ? void 0 : t, n, { config: o(), state: f(), driver: i() }),
          c && c(e ? void 0 : t, n, { config: o(), state: f(), driver: i() }));
      }
      s && s.focus();
    }
    n(t);
    const w = {
      isActive: () => f('isInitialized') || !1,
      refresh: x,
      drive: (e = 0) => {
        (v(), g(e));
      },
      setConfig: n,
      setSteps: e => {
        (h(), n({ ...o(), steps: e }));
      },
      getConfig: o,
      getState: f,
      getActiveIndex: () => f('activeIndex'),
      isFirstStep: () => 0 === f('activeIndex'),
      isLastStep: () => {
        const e = o('steps') || [],
          t = f('activeIndex');
        return void 0 !== t && t === e.length - 1;
      },
      getActiveStep: () => f('activeStep'),
      getActiveElement: () => f('activeElement'),
      getPreviousElement: () => f('previousElement'),
      getPreviousStep: () => f('previousStep'),
      moveNext: c,
      movePrevious: d,
      moveTo: function (e) {
        (o('steps') || [])[e] ? g(e) : y();
      },
      hasNextStep: () => {
        const e = o('steps') || [],
          t = f('activeIndex');
        return void 0 !== t && !!e[t + 1];
      },
      hasPreviousStep: () => {
        const e = o('steps') || [],
          t = f('activeIndex');
        return void 0 !== t && !!e[t - 1];
      },
      highlight: e => {
        (v(),
          b({
            ...e,
            popover: e.popover ? { showButtons: [], showProgress: !1, progressText: '', ...e.popover } : void 0
          }));
      },
      destroy: () => {
        y(!1);
      }
    };
    return (
      (function (t) {
        e = t;
      })(w),
      w
    );
    /*! @license DOMPurify 3.4.7 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.7/LICENSE */
  }
  function k(e, t) {
    (null == t || t > e.length) && (t = e.length);
    for (var n = 0, o = Array(t); n < t; n++) o[n] = e[n];
    return o;
  }
  function D(e, t) {
    return (
      (function (e) {
        if (Array.isArray(e)) return e;
      })(e) ||
      (function (e, t) {
        var n = null == e ? null : ('undefined' != typeof Symbol && e[Symbol.iterator]) || e['@@iterator'];
        if (null != n) {
          var o,
            i,
            r,
            s,
            a = [],
            l = !0,
            c = !1;
          try {
            if (((r = (n = n.call(e)).next), 0 === t));
            else for (; !(l = (o = r.call(n)).done) && (a.push(o.value), a.length !== t); l = !0);
          } catch (e) {
            ((c = !0), (i = e));
          } finally {
            try {
              if (!l && null != n.return && ((s = n.return()), Object(s) !== s)) return;
            } finally {
              if (c) throw i;
            }
          }
          return a;
        }
      })(e, t) ||
      (function (e, t) {
        if (e) {
          if ('string' == typeof e) return k(e, t);
          var n = {}.toString.call(e).slice(8, -1);
          return (
            'Object' === n && e.constructor && (n = e.constructor.name),
            'Map' === n || 'Set' === n
              ? Array.from(e)
              : 'Arguments' === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                ? k(e, t)
                : void 0
          );
        }
      })(e, t) ||
      (function () {
        throw new TypeError(
          'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
        );
      })()
    );
  }
  const R = Object.entries,
    P = Object.setPrototypeOf,
    M = Object.isFrozen,
    B = Object.getPrototypeOf,
    H = Object.getOwnPropertyDescriptor;
  let z = Object.freeze,
    F = Object.seal,
    U = Object.create,
    $ = 'undefined' != typeof Reflect && Reflect,
    W = $.apply,
    G = $.construct;
  (z ||
    (z = function (e) {
      return e;
    }),
    F ||
      (F = function (e) {
        return e;
      }),
    W ||
      (W = function (e, t) {
        for (var n = arguments.length, o = new Array(n > 2 ? n - 2 : 0), i = 2; i < n; i++) o[i - 2] = arguments[i];
        return e.apply(t, o);
      }),
    G ||
      (G = function (e) {
        for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), o = 1; o < t; o++) n[o - 1] = arguments[o];
        return new e(...n);
      }));
  const j = ue(Array.prototype.forEach),
    Y = ue(Array.prototype.lastIndexOf),
    q = ue(Array.prototype.pop),
    X = ue(Array.prototype.push),
    K = ue(Array.prototype.splice),
    V = Array.isArray,
    Z = ue(String.prototype.toLowerCase),
    J = ue(String.prototype.toString),
    Q = ue(String.prototype.match),
    ee = ue(String.prototype.replace),
    te = ue(String.prototype.indexOf),
    ne = ue(String.prototype.trim),
    oe = ue(Number.prototype.toString),
    ie = ue(Boolean.prototype.toString),
    re = 'undefined' == typeof BigInt ? null : ue(BigInt.prototype.toString),
    se = 'undefined' == typeof Symbol ? null : ue(Symbol.prototype.toString),
    ae = ue(Object.prototype.hasOwnProperty),
    le = ue(Object.prototype.toString),
    ce = ue(RegExp.prototype.test),
    de =
      ((pe = TypeError),
      function () {
        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
        return G(pe, t);
      });
  var pe;
  function ue(e) {
    return function (t) {
      t instanceof RegExp && (t.lastIndex = 0);
      for (var n = arguments.length, o = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++) o[i - 1] = arguments[i];
      return W(e, t, o);
    };
  }
  function me(e, t) {
    let n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : Z;
    if ((P && P(e, null), !V(t))) return e;
    let o = t.length;
    for (; o--; ) {
      let i = t[o];
      if ('string' == typeof i) {
        const e = n(i);
        e !== i && (M(t) || (t[o] = e), (i = e));
      }
      e[i] = !0;
    }
    return e;
  }
  function fe(e) {
    for (let t = 0; t < e.length; t++) {
      ae(e, t) || (e[t] = null);
    }
    return e;
  }
  function he(e) {
    const t = U(null);
    for (const o of R(e)) {
      var n = D(o, 2);
      const i = n[0],
        r = n[1];
      ae(e, i) &&
        (V(r) ? (t[i] = fe(r)) : r && 'object' == typeof r && r.constructor === Object ? (t[i] = he(r)) : (t[i] = r));
    }
    return t;
  }
  function ve(e, t) {
    for (; null !== e; ) {
      const n = H(e, t);
      if (n) {
        if (n.get) return ue(n.get);
        if ('function' == typeof n.value) return ue(n.value);
      }
      e = B(e);
    }
    return function () {
      return null;
    };
  }
  const ge = z([
      'a',
      'abbr',
      'acronym',
      'address',
      'area',
      'article',
      'aside',
      'audio',
      'b',
      'bdi',
      'bdo',
      'big',
      'blink',
      'blockquote',
      'body',
      'br',
      'button',
      'canvas',
      'caption',
      'center',
      'cite',
      'code',
      'col',
      'colgroup',
      'content',
      'data',
      'datalist',
      'dd',
      'decorator',
      'del',
      'details',
      'dfn',
      'dialog',
      'dir',
      'div',
      'dl',
      'dt',
      'element',
      'em',
      'fieldset',
      'figcaption',
      'figure',
      'font',
      'footer',
      'form',
      'h1',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'head',
      'header',
      'hgroup',
      'hr',
      'html',
      'i',
      'img',
      'input',
      'ins',
      'kbd',
      'label',
      'legend',
      'li',
      'main',
      'map',
      'mark',
      'marquee',
      'menu',
      'menuitem',
      'meter',
      'nav',
      'nobr',
      'ol',
      'optgroup',
      'option',
      'output',
      'p',
      'picture',
      'pre',
      'progress',
      'q',
      'rp',
      'rt',
      'ruby',
      's',
      'samp',
      'search',
      'section',
      'select',
      'shadow',
      'slot',
      'small',
      'source',
      'spacer',
      'span',
      'strike',
      'strong',
      'style',
      'sub',
      'summary',
      'sup',
      'table',
      'tbody',
      'td',
      'template',
      'textarea',
      'tfoot',
      'th',
      'thead',
      'time',
      'tr',
      'track',
      'tt',
      'u',
      'ul',
      'var',
      'video',
      'wbr'
    ]),
    ye = z([
      'svg',
      'a',
      'altglyph',
      'altglyphdef',
      'altglyphitem',
      'animatecolor',
      'animatemotion',
      'animatetransform',
      'circle',
      'clippath',
      'defs',
      'desc',
      'ellipse',
      'enterkeyhint',
      'exportparts',
      'filter',
      'font',
      'g',
      'glyph',
      'glyphref',
      'hkern',
      'image',
      'inputmode',
      'line',
      'lineargradient',
      'marker',
      'mask',
      'metadata',
      'mpath',
      'part',
      'path',
      'pattern',
      'polygon',
      'polyline',
      'radialgradient',
      'rect',
      'stop',
      'style',
      'switch',
      'symbol',
      'text',
      'textpath',
      'title',
      'tref',
      'tspan',
      'view',
      'vkern'
    ]),
    we = z([
      'feBlend',
      'feColorMatrix',
      'feComponentTransfer',
      'feComposite',
      'feConvolveMatrix',
      'feDiffuseLighting',
      'feDisplacementMap',
      'feDistantLight',
      'feDropShadow',
      'feFlood',
      'feFuncA',
      'feFuncB',
      'feFuncG',
      'feFuncR',
      'feGaussianBlur',
      'feImage',
      'feMerge',
      'feMergeNode',
      'feMorphology',
      'feOffset',
      'fePointLight',
      'feSpecularLighting',
      'feSpotLight',
      'feTile',
      'feTurbulence'
    ]),
    be = z([
      'animate',
      'color-profile',
      'cursor',
      'discard',
      'font-face',
      'font-face-format',
      'font-face-name',
      'font-face-src',
      'font-face-uri',
      'foreignobject',
      'hatch',
      'hatchpath',
      'mesh',
      'meshgradient',
      'meshpatch',
      'meshrow',
      'missing-glyph',
      'script',
      'set',
      'solidcolor',
      'unknown',
      'use'
    ]),
    Te = z([
      'math',
      'menclose',
      'merror',
      'mfenced',
      'mfrac',
      'mglyph',
      'mi',
      'mlabeledtr',
      'mmultiscripts',
      'mn',
      'mo',
      'mover',
      'mpadded',
      'mphantom',
      'mroot',
      'mrow',
      'ms',
      'mspace',
      'msqrt',
      'mstyle',
      'msub',
      'msup',
      'msubsup',
      'mtable',
      'mtd',
      'mtext',
      'mtr',
      'munder',
      'munderover',
      'mprescripts'
    ]),
    xe = z([
      'maction',
      'maligngroup',
      'malignmark',
      'mlongdiv',
      'mscarries',
      'mscarry',
      'msgroup',
      'mstack',
      'msline',
      'msrow',
      'semantics',
      'annotation',
      'annotation-xml',
      'mprescripts',
      'none'
    ]),
    Se = z(['#text']),
    Ae = z([
      'accept',
      'action',
      'align',
      'alt',
      'autocapitalize',
      'autocomplete',
      'autopictureinpicture',
      'autoplay',
      'background',
      'bgcolor',
      'border',
      'capture',
      'cellpadding',
      'cellspacing',
      'checked',
      'cite',
      'class',
      'clear',
      'color',
      'cols',
      'colspan',
      'command',
      'commandfor',
      'controls',
      'controlslist',
      'coords',
      'crossorigin',
      'datetime',
      'decoding',
      'default',
      'dir',
      'disabled',
      'disablepictureinpicture',
      'disableremoteplayback',
      'download',
      'draggable',
      'enctype',
      'enterkeyhint',
      'exportparts',
      'face',
      'for',
      'headers',
      'height',
      'hidden',
      'high',
      'href',
      'hreflang',
      'id',
      'inert',
      'inputmode',
      'integrity',
      'ismap',
      'kind',
      'label',
      'lang',
      'list',
      'loading',
      'loop',
      'low',
      'max',
      'maxlength',
      'media',
      'method',
      'min',
      'minlength',
      'multiple',
      'muted',
      'name',
      'nonce',
      'noshade',
      'novalidate',
      'nowrap',
      'open',
      'optimum',
      'part',
      'pattern',
      'placeholder',
      'playsinline',
      'popover',
      'popovertarget',
      'popovertargetaction',
      'poster',
      'preload',
      'pubdate',
      'radiogroup',
      'readonly',
      'rel',
      'required',
      'rev',
      'reversed',
      'role',
      'rows',
      'rowspan',
      'spellcheck',
      'scope',
      'selected',
      'shape',
      'size',
      'sizes',
      'slot',
      'span',
      'srclang',
      'start',
      'src',
      'srcset',
      'step',
      'style',
      'summary',
      'tabindex',
      'title',
      'translate',
      'type',
      'usemap',
      'valign',
      'value',
      'width',
      'wrap',
      'xmlns'
    ]),
    Ee = z([
      'accent-height',
      'accumulate',
      'additive',
      'alignment-baseline',
      'amplitude',
      'ascent',
      'attributename',
      'attributetype',
      'azimuth',
      'basefrequency',
      'baseline-shift',
      'begin',
      'bias',
      'by',
      'class',
      'clip',
      'clippathunits',
      'clip-path',
      'clip-rule',
      'color',
      'color-interpolation',
      'color-interpolation-filters',
      'color-profile',
      'color-rendering',
      'cx',
      'cy',
      'd',
      'dx',
      'dy',
      'diffuseconstant',
      'direction',
      'display',
      'divisor',
      'dur',
      'edgemode',
      'elevation',
      'end',
      'exponent',
      'fill',
      'fill-opacity',
      'fill-rule',
      'filter',
      'filterunits',
      'flood-color',
      'flood-opacity',
      'font-family',
      'font-size',
      'font-size-adjust',
      'font-stretch',
      'font-style',
      'font-variant',
      'font-weight',
      'fx',
      'fy',
      'g1',
      'g2',
      'glyph-name',
      'glyphref',
      'gradientunits',
      'gradienttransform',
      'height',
      'href',
      'id',
      'image-rendering',
      'in',
      'in2',
      'intercept',
      'k',
      'k1',
      'k2',
      'k3',
      'k4',
      'kerning',
      'keypoints',
      'keysplines',
      'keytimes',
      'lang',
      'lengthadjust',
      'letter-spacing',
      'kernelmatrix',
      'kernelunitlength',
      'lighting-color',
      'local',
      'marker-end',
      'marker-mid',
      'marker-start',
      'markerheight',
      'markerunits',
      'markerwidth',
      'maskcontentunits',
      'maskunits',
      'max',
      'mask',
      'mask-type',
      'media',
      'method',
      'mode',
      'min',
      'name',
      'numoctaves',
      'offset',
      'operator',
      'opacity',
      'order',
      'orient',
      'orientation',
      'origin',
      'overflow',
      'paint-order',
      'path',
      'pathlength',
      'patterncontentunits',
      'patterntransform',
      'patternunits',
      'points',
      'preservealpha',
      'preserveaspectratio',
      'primitiveunits',
      'r',
      'rx',
      'ry',
      'radius',
      'refx',
      'refy',
      'repeatcount',
      'repeatdur',
      'restart',
      'result',
      'rotate',
      'scale',
      'seed',
      'shape-rendering',
      'slope',
      'specularconstant',
      'specularexponent',
      'spreadmethod',
      'startoffset',
      'stddeviation',
      'stitchtiles',
      'stop-color',
      'stop-opacity',
      'stroke-dasharray',
      'stroke-dashoffset',
      'stroke-linecap',
      'stroke-linejoin',
      'stroke-miterlimit',
      'stroke-opacity',
      'stroke',
      'stroke-width',
      'style',
      'surfacescale',
      'systemlanguage',
      'tabindex',
      'tablevalues',
      'targetx',
      'targety',
      'transform',
      'transform-origin',
      'text-anchor',
      'text-decoration',
      'text-rendering',
      'textlength',
      'type',
      'u1',
      'u2',
      'unicode',
      'values',
      'viewbox',
      'visibility',
      'version',
      'vert-adv-y',
      'vert-origin-x',
      'vert-origin-y',
      'width',
      'word-spacing',
      'wrap',
      'writing-mode',
      'xchannelselector',
      'ychannelselector',
      'x',
      'x1',
      'x2',
      'xmlns',
      'y',
      'y1',
      'y2',
      'z',
      'zoomandpan'
    ]),
    _e = z([
      'accent',
      'accentunder',
      'align',
      'bevelled',
      'close',
      'columnalign',
      'columnlines',
      'columnspacing',
      'columnspan',
      'denomalign',
      'depth',
      'dir',
      'display',
      'displaystyle',
      'encoding',
      'fence',
      'frame',
      'height',
      'href',
      'id',
      'largeop',
      'length',
      'linethickness',
      'lquote',
      'lspace',
      'mathbackground',
      'mathcolor',
      'mathsize',
      'mathvariant',
      'maxsize',
      'minsize',
      'movablelimits',
      'notation',
      'numalign',
      'open',
      'rowalign',
      'rowlines',
      'rowspacing',
      'rowspan',
      'rspace',
      'rquote',
      'scriptlevel',
      'scriptminsize',
      'scriptsizemultiplier',
      'selection',
      'separator',
      'separators',
      'stretchy',
      'subscriptshift',
      'supscriptshift',
      'symmetric',
      'voffset',
      'width',
      'xmlns'
    ]),
    Ce = z(['xlink:href', 'xml:id', 'xlink:title', 'xml:space', 'xmlns:xlink']),
    Ne = F(/{{[\w\W]*|^[\w\W]*}}/g),
    Ie = F(/<%[\w\W]*|^[\w\W]*%>/g),
    Le = F(/\${[\w\W]*/g),
    Oe = F(/^data-[\-\w.\u00B7-\uFFFF]+$/),
    ke = F(/^aria-[\-\w]+$/),
    De = F(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),
    Re = F(/^(?:\w+script|data):/i),
    Pe = F(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),
    Me = F(/^html$/i),
    Be = F(/^[a-z][.\w]*(-[.\w]+)+$/i),
    He = 1,
    ze = 3,
    Fe = 7,
    Ue = 8,
    $e = 9,
    We = 11,
    Ge = function () {
      return 'undefined' == typeof window ? null : window;
    };
  var je = (function e() {
    let t = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : Ge();
    const n = t => e(t);
    if (((n.version = '3.4.7'), (n.removed = []), !t || !t.document || t.document.nodeType !== $e || !t.Element))
      return ((n.isSupported = !1), n);
    let o = t.document;
    const i = o,
      r = i.currentScript;
    t.DocumentFragment;
    const s = t.HTMLTemplateElement,
      a = t.Node,
      l = t.Element,
      c = t.NodeFilter,
      d = t.NamedNodeMap;
    (void 0 === d && (t.NamedNodeMap || t.MozNamedAttrMap), t.HTMLFormElement);
    const p = t.DOMParser,
      u = t.trustedTypes,
      m = l.prototype,
      f = ve(m, 'cloneNode'),
      h = ve(m, 'remove'),
      v = ve(m, 'nextSibling'),
      g = ve(m, 'childNodes'),
      y = ve(m, 'parentNode'),
      w = ve(m, 'shadowRoot'),
      b = ve(m, 'attributes'),
      T = a && a.prototype ? ve(a.prototype, 'nodeType') : null,
      x = a && a.prototype ? ve(a.prototype, 'nodeName') : null;
    if ('function' == typeof s) {
      const e = o.createElement('template');
      e.content && e.content.ownerDocument && (o = e.content.ownerDocument);
    }
    let S,
      A = '';
    const E = o,
      _ = E.implementation,
      C = E.createNodeIterator,
      N = E.createDocumentFragment,
      I = E.getElementsByTagName,
      L = i.importNode;
    let O = {
      afterSanitizeAttributes: [],
      afterSanitizeElements: [],
      afterSanitizeShadowDOM: [],
      beforeSanitizeAttributes: [],
      beforeSanitizeElements: [],
      beforeSanitizeShadowDOM: [],
      uponSanitizeAttribute: [],
      uponSanitizeElement: [],
      uponSanitizeShadowNode: []
    };
    n.isSupported = 'function' == typeof R && 'function' == typeof y && _ && void 0 !== _.createHTMLDocument;
    const k = Ne,
      D = Ie,
      P = Le,
      M = Oe,
      B = ke,
      H = Re,
      F = Pe,
      $ = Be;
    let W = De,
      G = null;
    const pe = me({}, [...ge, ...ye, ...we, ...Te, ...Se]);
    let ue = null;
    const fe = me({}, [...Ae, ...Ee, ..._e, ...Ce]);
    let je = Object.seal(
        U(null, {
          tagNameCheck: { writable: !0, configurable: !1, enumerable: !0, value: null },
          attributeNameCheck: { writable: !0, configurable: !1, enumerable: !0, value: null },
          allowCustomizedBuiltInElements: { writable: !0, configurable: !1, enumerable: !0, value: !1 }
        })
      ),
      Ye = null,
      qe = null;
    const Xe = Object.seal(
      U(null, {
        tagCheck: { writable: !0, configurable: !1, enumerable: !0, value: null },
        attributeCheck: { writable: !0, configurable: !1, enumerable: !0, value: null }
      })
    );
    let Ke = !0,
      Ve = !0,
      Ze = !1,
      Je = !0,
      Qe = !1,
      et = !0,
      tt = !1,
      nt = !1,
      ot = !1,
      it = !1,
      rt = !1,
      st = !1,
      at = !0,
      lt = !1;
    const ct = 'user-content-';
    let dt = !0,
      pt = !1,
      ut = {},
      mt = null;
    const ft = me({}, [
      'annotation-xml',
      'audio',
      'colgroup',
      'desc',
      'foreignobject',
      'head',
      'iframe',
      'math',
      'mi',
      'mn',
      'mo',
      'ms',
      'mtext',
      'noembed',
      'noframes',
      'noscript',
      'plaintext',
      'script',
      'style',
      'svg',
      'template',
      'thead',
      'title',
      'video',
      'xmp'
    ]);
    let ht = null;
    const vt = me({}, ['audio', 'video', 'img', 'source', 'image', 'track']);
    let gt = null;
    const yt = me({}, [
        'alt',
        'class',
        'for',
        'id',
        'label',
        'name',
        'pattern',
        'placeholder',
        'role',
        'summary',
        'title',
        'value',
        'style',
        'xmlns'
      ]),
      wt = 'http://www.w3.org/1998/Math/MathML',
      bt = 'http://www.w3.org/2000/svg',
      Tt = 'http://www.w3.org/1999/xhtml';
    let xt = Tt,
      St = !1,
      At = null;
    const Et = me({}, [wt, bt, Tt], J);
    let _t = me({}, ['mi', 'mo', 'mn', 'ms', 'mtext']),
      Ct = me({}, ['annotation-xml']);
    const Nt = me({}, ['title', 'style', 'font', 'a', 'script']);
    let It = null;
    const Lt = ['application/xhtml+xml', 'text/html'];
    let Ot = null,
      kt = null;
    const Dt = o.createElement('form'),
      Rt = function (e) {
        return e instanceof RegExp || e instanceof Function;
      },
      Pt = function () {
        let e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        if (kt && kt === e) return;
        ((e && 'object' == typeof e) || (e = {}),
          (e = he(e)),
          (It = -1 === Lt.indexOf(e.PARSER_MEDIA_TYPE) ? 'text/html' : e.PARSER_MEDIA_TYPE),
          (Ot = 'application/xhtml+xml' === It ? J : Z),
          (G = ae(e, 'ALLOWED_TAGS') && V(e.ALLOWED_TAGS) ? me({}, e.ALLOWED_TAGS, Ot) : pe),
          (ue = ae(e, 'ALLOWED_ATTR') && V(e.ALLOWED_ATTR) ? me({}, e.ALLOWED_ATTR, Ot) : fe),
          (At = ae(e, 'ALLOWED_NAMESPACES') && V(e.ALLOWED_NAMESPACES) ? me({}, e.ALLOWED_NAMESPACES, J) : Et),
          (gt = ae(e, 'ADD_URI_SAFE_ATTR') && V(e.ADD_URI_SAFE_ATTR) ? me(he(yt), e.ADD_URI_SAFE_ATTR, Ot) : yt),
          (ht = ae(e, 'ADD_DATA_URI_TAGS') && V(e.ADD_DATA_URI_TAGS) ? me(he(vt), e.ADD_DATA_URI_TAGS, Ot) : vt),
          (mt = ae(e, 'FORBID_CONTENTS') && V(e.FORBID_CONTENTS) ? me({}, e.FORBID_CONTENTS, Ot) : ft),
          (Ye = ae(e, 'FORBID_TAGS') && V(e.FORBID_TAGS) ? me({}, e.FORBID_TAGS, Ot) : he({})),
          (qe = ae(e, 'FORBID_ATTR') && V(e.FORBID_ATTR) ? me({}, e.FORBID_ATTR, Ot) : he({})),
          (ut =
            !!ae(e, 'USE_PROFILES') &&
            (e.USE_PROFILES && 'object' == typeof e.USE_PROFILES ? he(e.USE_PROFILES) : e.USE_PROFILES)),
          (Ke = !1 !== e.ALLOW_ARIA_ATTR),
          (Ve = !1 !== e.ALLOW_DATA_ATTR),
          (Ze = e.ALLOW_UNKNOWN_PROTOCOLS || !1),
          (Je = !1 !== e.ALLOW_SELF_CLOSE_IN_ATTR),
          (Qe = e.SAFE_FOR_TEMPLATES || !1),
          (et = !1 !== e.SAFE_FOR_XML),
          (tt = e.WHOLE_DOCUMENT || !1),
          (it = e.RETURN_DOM || !1),
          (rt = e.RETURN_DOM_FRAGMENT || !1),
          (st = e.RETURN_TRUSTED_TYPE || !1),
          (ot = e.FORCE_BODY || !1),
          (at = !1 !== e.SANITIZE_DOM),
          (lt = e.SANITIZE_NAMED_PROPS || !1),
          (dt = !1 !== e.KEEP_CONTENT),
          (pt = e.IN_PLACE || !1),
          (W = (function (e) {
            try {
              return (ce(e, ''), !0);
            } catch (e) {
              return !1;
            }
          })(e.ALLOWED_URI_REGEXP)
            ? e.ALLOWED_URI_REGEXP
            : De),
          (xt = 'string' == typeof e.NAMESPACE ? e.NAMESPACE : Tt),
          (_t =
            ae(e, 'MATHML_TEXT_INTEGRATION_POINTS') &&
            e.MATHML_TEXT_INTEGRATION_POINTS &&
            'object' == typeof e.MATHML_TEXT_INTEGRATION_POINTS
              ? he(e.MATHML_TEXT_INTEGRATION_POINTS)
              : me({}, ['mi', 'mo', 'mn', 'ms', 'mtext'])),
          (Ct =
            ae(e, 'HTML_INTEGRATION_POINTS') &&
            e.HTML_INTEGRATION_POINTS &&
            'object' == typeof e.HTML_INTEGRATION_POINTS
              ? he(e.HTML_INTEGRATION_POINTS)
              : me({}, ['annotation-xml'])));
        const t =
          ae(e, 'CUSTOM_ELEMENT_HANDLING') && e.CUSTOM_ELEMENT_HANDLING && 'object' == typeof e.CUSTOM_ELEMENT_HANDLING
            ? he(e.CUSTOM_ELEMENT_HANDLING)
            : U(null);
        if (
          ((je = U(null)),
          ae(t, 'tagNameCheck') && Rt(t.tagNameCheck) && (je.tagNameCheck = t.tagNameCheck),
          ae(t, 'attributeNameCheck') && Rt(t.attributeNameCheck) && (je.attributeNameCheck = t.attributeNameCheck),
          ae(t, 'allowCustomizedBuiltInElements') &&
            'boolean' == typeof t.allowCustomizedBuiltInElements &&
            (je.allowCustomizedBuiltInElements = t.allowCustomizedBuiltInElements),
          Qe && (Ve = !1),
          rt && (it = !0),
          ut &&
            ((G = me({}, Se)),
            (ue = U(null)),
            !0 === ut.html && (me(G, ge), me(ue, Ae)),
            !0 === ut.svg && (me(G, ye), me(ue, Ee), me(ue, Ce)),
            !0 === ut.svgFilters && (me(G, we), me(ue, Ee), me(ue, Ce)),
            !0 === ut.mathMl && (me(G, Te), me(ue, _e), me(ue, Ce))),
          (Xe.tagCheck = null),
          (Xe.attributeCheck = null),
          ae(e, 'ADD_TAGS') &&
            ('function' == typeof e.ADD_TAGS
              ? (Xe.tagCheck = e.ADD_TAGS)
              : V(e.ADD_TAGS) && (G === pe && (G = he(G)), me(G, e.ADD_TAGS, Ot))),
          ae(e, 'ADD_ATTR') &&
            ('function' == typeof e.ADD_ATTR
              ? (Xe.attributeCheck = e.ADD_ATTR)
              : V(e.ADD_ATTR) && (ue === fe && (ue = he(ue)), me(ue, e.ADD_ATTR, Ot))),
          ae(e, 'ADD_URI_SAFE_ATTR') && V(e.ADD_URI_SAFE_ATTR) && me(gt, e.ADD_URI_SAFE_ATTR, Ot),
          ae(e, 'FORBID_CONTENTS') &&
            V(e.FORBID_CONTENTS) &&
            (mt === ft && (mt = he(mt)), me(mt, e.FORBID_CONTENTS, Ot)),
          ae(e, 'ADD_FORBID_CONTENTS') &&
            V(e.ADD_FORBID_CONTENTS) &&
            (mt === ft && (mt = he(mt)), me(mt, e.ADD_FORBID_CONTENTS, Ot)),
          dt && (G['#text'] = !0),
          tt && me(G, ['html', 'head', 'body']),
          G.table && (me(G, ['tbody']), delete Ye.tbody),
          e.TRUSTED_TYPES_POLICY)
        ) {
          if ('function' != typeof e.TRUSTED_TYPES_POLICY.createHTML)
            throw de('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
          if ('function' != typeof e.TRUSTED_TYPES_POLICY.createScriptURL)
            throw de('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
          ((S = e.TRUSTED_TYPES_POLICY), (A = S.createHTML('')));
        } else
          (void 0 === S &&
            (S = (function (e, t) {
              if ('object' != typeof e || 'function' != typeof e.createPolicy) return null;
              let n = null;
              const o = 'data-tt-policy-suffix';
              t && t.hasAttribute(o) && (n = t.getAttribute(o));
              const i = 'dompurify' + (n ? '#' + n : '');
              try {
                return e.createPolicy(i, { createHTML: e => e, createScriptURL: e => e });
              } catch (e) {
                return (console.warn('TrustedTypes policy ' + i + ' could not be created.'), null);
              }
            })(u, r)),
            null !== S && 'string' == typeof A && (A = S.createHTML('')));
        ((O.uponSanitizeElement.length > 0 || O.uponSanitizeAttribute.length > 0) && G === pe && (G = he(G)),
          O.uponSanitizeAttribute.length > 0 && ue === fe && (ue = he(ue)),
          z && z(e),
          (kt = e));
      },
      Mt = me({}, [...ye, ...we, ...be]),
      Bt = me({}, [...Te, ...xe]),
      Ht = function (e) {
        X(n.removed, { element: e });
        try {
          y(e).removeChild(e);
        } catch (t) {
          h(e);
        }
      },
      zt = function (e, t) {
        try {
          X(n.removed, { attribute: t.getAttributeNode(e), from: t });
        } catch (e) {
          X(n.removed, { attribute: null, from: t });
        }
        if ((t.removeAttribute(e), 'is' === e))
          if (it || rt)
            try {
              Ht(t);
            } catch (e) {}
          else
            try {
              t.setAttribute(e, '');
            } catch (e) {}
      },
      Ft = function (e) {
        let t = null,
          n = null;
        if (ot) e = '<remove></remove>' + e;
        else {
          const t = Q(e, /^[\r\n\t ]+/);
          n = t && t[0];
        }
        'application/xhtml+xml' === It &&
          xt === Tt &&
          (e = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + e + '</body></html>');
        const i = S ? S.createHTML(e) : e;
        if (xt === Tt)
          try {
            t = new p().parseFromString(i, It);
          } catch (e) {}
        if (!t || !t.documentElement) {
          t = _.createDocument(xt, 'template', null);
          try {
            t.documentElement.innerHTML = St ? A : i;
          } catch (e) {}
        }
        const r = t.body || t.documentElement;
        return (
          e && n && r.insertBefore(o.createTextNode(n), r.childNodes[0] || null),
          xt === Tt ? I.call(t, tt ? 'html' : 'body')[0] : tt ? t.documentElement : r
        );
      },
      Ut = function (e) {
        return C.call(
          e.ownerDocument || e,
          e,
          c.SHOW_ELEMENT | c.SHOW_COMMENT | c.SHOW_TEXT | c.SHOW_PROCESSING_INSTRUCTION | c.SHOW_CDATA_SECTION,
          null
        );
      },
      $t = function (e) {
        e.normalize();
        const t = C.call(
          e.ownerDocument || e,
          e,
          c.SHOW_TEXT | c.SHOW_COMMENT | c.SHOW_CDATA_SECTION | c.SHOW_PROCESSING_INSTRUCTION,
          null
        );
        let n = t.nextNode();
        for (; n; ) {
          let e = n.data;
          (j([k, D, P], t => {
            e = ee(e, t, ' ');
          }),
            (n.data = e),
            (n = t.nextNode()));
        }
      },
      Wt = function (e) {
        const t = x ? x(e) : null;
        return (
          'string' == typeof t &&
          'form' === Ot(t) &&
          ('string' != typeof e.nodeName ||
            'string' != typeof e.textContent ||
            'function' != typeof e.removeChild ||
            e.attributes !== b(e) ||
            'function' != typeof e.removeAttribute ||
            'function' != typeof e.setAttribute ||
            'string' != typeof e.namespaceURI ||
            'function' != typeof e.insertBefore ||
            'function' != typeof e.hasChildNodes ||
            e.nodeType !== T(e) ||
            e.childNodes !== g(e))
        );
      },
      Gt = function (e) {
        if (!T || 'object' != typeof e || null === e) return !1;
        try {
          return T(e) === We;
        } catch (e) {
          return !1;
        }
      },
      jt = function (e) {
        if (!T || 'object' != typeof e || null === e) return !1;
        try {
          return 'number' == typeof T(e);
        } catch (e) {
          return !1;
        }
      };
    function Yt(e, t, o) {
      j(e, e => {
        e.call(n, t, o, kt);
      });
    }
    const qt = function (e) {
        let t = null;
        if ((Yt(O.beforeSanitizeElements, e, null), Wt(e))) return (Ht(e), !0);
        const o = Ot(e.nodeName);
        if (
          (Yt(O.uponSanitizeElement, e, { tagName: o, allowedTags: G }),
          et &&
            e.hasChildNodes() &&
            !jt(e.firstElementChild) &&
            ce(/<[/\w!]/g, e.innerHTML) &&
            ce(/<[/\w!]/g, e.textContent))
        )
          return (Ht(e), !0);
        if (et && e.namespaceURI === Tt && 'style' === o && jt(e.firstElementChild)) return (Ht(e), !0);
        if (e.nodeType === Fe) return (Ht(e), !0);
        if (et && e.nodeType === Ue && ce(/<[/\w]/g, e.data)) return (Ht(e), !0);
        if (Ye[o] || (!(Xe.tagCheck instanceof Function && Xe.tagCheck(o)) && !G[o])) {
          if (!Ye[o] && Vt(o)) {
            if (je.tagNameCheck instanceof RegExp && ce(je.tagNameCheck, o)) return !1;
            if (je.tagNameCheck instanceof Function && je.tagNameCheck(o)) return !1;
          }
          if (dt && !mt[o]) {
            const t = y(e),
              n = g(e);
            if (n && t) {
              for (let o = n.length - 1; o >= 0; --o) {
                const i = f(n[o], !0);
                t.insertBefore(i, v(e));
              }
            }
          }
          return (Ht(e), !0);
        }
        return ((T ? T(e) : e.nodeType) !== He ||
          (function (e) {
            let t = y(e);
            (t && t.tagName) || (t = { namespaceURI: xt, tagName: 'template' });
            const n = Z(e.tagName),
              o = Z(t.tagName);
            return (
              !!At[e.namespaceURI] &&
              (e.namespaceURI === bt
                ? t.namespaceURI === Tt
                  ? 'svg' === n
                  : t.namespaceURI === wt
                    ? 'svg' === n && ('annotation-xml' === o || _t[o])
                    : Boolean(Mt[n])
                : e.namespaceURI === wt
                  ? t.namespaceURI === Tt
                    ? 'math' === n
                    : t.namespaceURI === bt
                      ? 'math' === n && Ct[o]
                      : Boolean(Bt[n])
                  : e.namespaceURI === Tt
                    ? !(t.namespaceURI === bt && !Ct[o]) &&
                      !(t.namespaceURI === wt && !_t[o]) &&
                      !Bt[n] &&
                      (Nt[n] || !Mt[n])
                    : !('application/xhtml+xml' !== It || !At[e.namespaceURI]))
            );
          })(e)) &&
          (('noscript' !== o && 'noembed' !== o && 'noframes' !== o) || !ce(/<\/no(script|embed|frames)/i, e.innerHTML))
          ? (Qe &&
              e.nodeType === ze &&
              ((t = e.textContent),
              j([k, D, P], e => {
                t = ee(t, e, ' ');
              }),
              e.textContent !== t && (X(n.removed, { element: e.cloneNode() }), (e.textContent = t))),
            Yt(O.afterSanitizeElements, e, null),
            !1)
          : (Ht(e), !0);
      },
      Xt = function (e, t, n) {
        if (qe[t]) return !1;
        if (at && ('id' === t || 'name' === t) && (n in o || n in Dt)) return !1;
        const i = ue[t] || (Xe.attributeCheck instanceof Function && Xe.attributeCheck(t, e));
        if (Ve && !qe[t] && ce(M, t));
        else if (Ke && ce(B, t));
        else if (!i || qe[t]) {
          if (
            !(
              (Vt(e) &&
                ((je.tagNameCheck instanceof RegExp && ce(je.tagNameCheck, e)) ||
                  (je.tagNameCheck instanceof Function && je.tagNameCheck(e))) &&
                ((je.attributeNameCheck instanceof RegExp && ce(je.attributeNameCheck, t)) ||
                  (je.attributeNameCheck instanceof Function && je.attributeNameCheck(t, e)))) ||
              ('is' === t &&
                je.allowCustomizedBuiltInElements &&
                ((je.tagNameCheck instanceof RegExp && ce(je.tagNameCheck, n)) ||
                  (je.tagNameCheck instanceof Function && je.tagNameCheck(n))))
            )
          )
            return !1;
        } else if (gt[t]);
        else if (ce(W, ee(n, F, '')));
        else if (
          ('src' !== t && 'xlink:href' !== t && 'href' !== t) ||
          'script' === e ||
          0 !== te(n, 'data:') ||
          !ht[e]
        ) {
          if (Ze && !ce(H, ee(n, F, '')));
          else if (n) return !1;
        } else;
        return !0;
      },
      Kt = me({}, [
        'annotation-xml',
        'color-profile',
        'font-face',
        'font-face-format',
        'font-face-name',
        'font-face-src',
        'font-face-uri',
        'missing-glyph'
      ]),
      Vt = function (e) {
        return !Kt[Z(e)] && ce($, e);
      },
      Zt = function (e) {
        Yt(O.beforeSanitizeAttributes, e, null);
        const t = e.attributes;
        if (!t || Wt(e)) return;
        const o = { attrName: '', attrValue: '', keepAttr: !0, allowedAttributes: ue, forceKeepAttr: void 0 };
        let i = t.length;
        for (; i--; ) {
          const r = t[i],
            s = r.name,
            a = r.namespaceURI,
            l = r.value,
            c = Ot(s),
            d = l;
          let p = 'value' === s ? d : ne(d);
          if (
            ((o.attrName = c),
            (o.attrValue = p),
            (o.keepAttr = !0),
            (o.forceKeepAttr = void 0),
            Yt(O.uponSanitizeAttribute, e, o),
            (p = o.attrValue),
            !lt || ('id' !== c && 'name' !== c) || 0 === te(p, ct) || (zt(s, e), (p = ct + p)),
            et && ce(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, p))
          ) {
            zt(s, e);
            continue;
          }
          if ('attributename' === c && Q(p, 'href')) {
            zt(s, e);
            continue;
          }
          if (o.forceKeepAttr) continue;
          if (!o.keepAttr) {
            zt(s, e);
            continue;
          }
          if (!Je && ce(/\/>/i, p)) {
            zt(s, e);
            continue;
          }
          Qe &&
            j([k, D, P], e => {
              p = ee(p, e, ' ');
            });
          const m = Ot(e.nodeName);
          if (Xt(m, c, p)) {
            if (S && 'object' == typeof u && 'function' == typeof u.getAttributeType)
              if (a);
              else
                switch (u.getAttributeType(m, c)) {
                  case 'TrustedHTML':
                    p = S.createHTML(p);
                    break;
                  case 'TrustedScriptURL':
                    p = S.createScriptURL(p);
                }
            if (p !== d)
              try {
                (a ? e.setAttributeNS(a, s, p) : e.setAttribute(s, p), Wt(e) ? Ht(e) : q(n.removed));
              } catch (t) {
                zt(s, e);
              }
          } else zt(s, e);
        }
        Yt(O.afterSanitizeAttributes, e, null);
      },
      Jt = function (e) {
        let t = null;
        const n = Ut(e);
        for (Yt(O.beforeSanitizeShadowDOM, e, null); (t = n.nextNode()); ) {
          (Yt(O.uponSanitizeShadowNode, t, null), qt(t), Zt(t), Gt(t.content) && Jt(t.content));
          if ((T ? T(t) : t.nodeType) === He) {
            const e = w ? w(t) : t.shadowRoot;
            Gt(e) && (Qt(e), Jt(e));
          }
        }
        Yt(O.afterSanitizeShadowDOM, e, null);
      },
      Qt = function (e) {
        const t = T ? T(e) : e.nodeType;
        if (t === He) {
          const t = w ? w(e) : e.shadowRoot;
          Gt(t) && (Qt(t), Jt(t));
        }
        const n = g ? g(e) : e.childNodes;
        if (!n) return;
        const o = [];
        j(n, e => {
          X(o, e);
        });
        for (const e of o) Qt(e);
        if (t === He) {
          const t = x ? x(e) : null;
          if ('string' == typeof t && 'template' === Ot(t)) {
            const t = e.content;
            Gt(t) && Qt(t);
          }
        }
      };
    return (
      (n.sanitize = function (e) {
        let t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
          o = null,
          r = null,
          s = null,
          a = null;
        if (
          ((St = !e),
          St && (e = '\x3c!--\x3e'),
          'string' != typeof e &&
            !jt(e) &&
            'string' !=
              typeof (e = (function (e) {
                switch (typeof e) {
                  case 'string':
                    return e;
                  case 'number':
                    return oe(e);
                  case 'boolean':
                    return ie(e);
                  case 'bigint':
                    return re ? re(e) : '0';
                  case 'symbol':
                    return se ? se(e) : 'Symbol()';
                  case 'undefined':
                  default:
                    return le(e);
                  case 'function':
                  case 'object': {
                    if (null === e) return le(e);
                    const t = e,
                      n = ve(t, 'toString');
                    if ('function' == typeof n) {
                      const e = n(t);
                      return 'string' == typeof e ? e : le(e);
                    }
                    return le(e);
                  }
                }
              })(e)))
        )
          throw de('dirty is not a string, aborting');
        if (!n.isSupported) return e;
        if ((nt || Pt(t), (n.removed = []), 'string' == typeof e && (pt = !1), pt)) {
          const t = x ? x(e) : e.nodeName;
          if ('string' == typeof t) {
            const e = Ot(t);
            if (!G[e] || Ye[e]) throw de('root node is forbidden and cannot be sanitized in-place');
          }
          if (Wt(e)) throw de('root node is clobbered and cannot be sanitized in-place');
          Qt(e);
        } else if (jt(e))
          ((o = Ft('\x3c!----\x3e')),
            (r = o.ownerDocument.importNode(e, !0)),
            (r.nodeType === He && 'BODY' === r.nodeName) || 'HTML' === r.nodeName ? (o = r) : o.appendChild(r),
            Qt(r));
        else {
          if (!it && !Qe && !tt && -1 === e.indexOf('<')) return S && st ? S.createHTML(e) : e;
          if (((o = Ft(e)), !o)) return it ? null : st ? A : '';
        }
        o && ot && Ht(o.firstChild);
        const l = Ut(pt ? e : o);
        for (; (s = l.nextNode()); ) (qt(s), Zt(s), Gt(s.content) && Jt(s.content));
        if (pt) return (Qe && $t(e), e);
        if (it) {
          if ((Qe && $t(o), rt)) for (a = N.call(o.ownerDocument); o.firstChild; ) a.appendChild(o.firstChild);
          else a = o;
          return ((ue.shadowroot || ue.shadowrootmode) && (a = L.call(i, a, !0)), a);
        }
        let c = tt ? o.outerHTML : o.innerHTML;
        return (
          tt &&
            G['!doctype'] &&
            o.ownerDocument &&
            o.ownerDocument.doctype &&
            o.ownerDocument.doctype.name &&
            ce(Me, o.ownerDocument.doctype.name) &&
            (c = '<!DOCTYPE ' + o.ownerDocument.doctype.name + '>\n' + c),
          Qe &&
            j([k, D, P], e => {
              c = ee(c, e, ' ');
            }),
          S && st ? S.createHTML(c) : c
        );
      }),
      (n.setConfig = function () {
        (Pt(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}), (nt = !0));
      }),
      (n.clearConfig = function () {
        ((kt = null), (nt = !1));
      }),
      (n.isValidAttribute = function (e, t, n) {
        kt || Pt({});
        const o = Ot(e),
          i = Ot(t);
        return Xt(o, i, n);
      }),
      (n.addHook = function (e, t) {
        'function' == typeof t && X(O[e], t);
      }),
      (n.removeHook = function (e, t) {
        if (void 0 !== t) {
          const n = Y(O[e], t);
          return -1 === n ? void 0 : K(O[e], n, 1)[0];
        }
        return q(O[e]);
      }),
      (n.removeHooks = function (e) {
        O[e] = [];
      }),
      (n.removeAllHooks = function () {
        O = {
          afterSanitizeAttributes: [],
          afterSanitizeElements: [],
          afterSanitizeShadowDOM: [],
          beforeSanitizeAttributes: [],
          beforeSanitizeElements: [],
          beforeSanitizeShadowDOM: [],
          uponSanitizeAttribute: [],
          uponSanitizeElement: [],
          uponSanitizeShadowNode: []
        };
      }),
      n
    );
  })();
  class Ye {
    constructor() {
      (Object.defineProperty(this, 'steps', { enumerable: !0, configurable: !0, writable: !0, value: [] }),
        Object.defineProperty(this, 'options', { enumerable: !0, configurable: !0, writable: !0, value: {} }),
        Object.defineProperty(this, 'driverInstance', { enumerable: !0, configurable: !0, writable: !0, value: null }),
        Object.defineProperty(this, 'currentIndex', { enumerable: !0, configurable: !0, writable: !0, value: -1 }),
        Object.defineProperty(this, 'pendingEndReason', {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: null
        }));
    }
    static create() {
      return new Ye();
    }
    setSteps(e) {
      return (this.validateSteps(e), (this.steps = [...e]), this);
    }
    setOptions(e) {
      return ((this.options = this.resolveOptions(e)), this);
    }
    start(e = 0) {
      if ('undefined' == typeof window || 'undefined' == typeof document) return;
      if (!Array.isArray(this.steps) || 0 === this.steps.length)
        throw new Error('PoUserGuide: a lista de passos não foi configurada. Chame setSteps() antes de start().');
      if ('number' != typeof e || !Number.isInteger(e) || e < 0 || e >= this.steps.length)
        throw new Error(`PoUserGuide: startIndex (${e}) está fora do intervalo [0, ${this.steps.length - 1}].`);
      (null !== this.driverInstance && this.close(),
        0 === Object.keys(this.options).length && (this.options = this.resolveOptions()),
        this.injectStyles());
      const t = this.buildDriverConfig();
      if (((this.driverInstance = O(t)), 'function' == typeof this.options.onTourStart)) {
        const t = { totalSteps: this.steps.length, startIndex: e, timestamp: Date.now() };
        this.options.onTourStart(t);
      }
      this.driverInstance.drive(e);
    }
    next() {
      if (null !== this.driverInstance)
        return this.currentIndex === this.steps.length - 1
          ? ((this.pendingEndReason = 'completed'), void this.driverInstance.destroy())
          : void this.driverInstance.moveNext();
    }
    previous() {
      null === this.driverInstance || this.currentIndex <= 0 || this.driverInstance.movePrevious();
    }
    goTo(e) {
      if ('number' != typeof e || !Number.isInteger(e) || e < 0 || e >= this.steps.length)
        throw new Error(`PoUserGuide: goTo(${e}) está fora do intervalo [0, ${this.steps.length - 1}].`);
      null !== this.driverInstance ? this.driverInstance.moveTo(e) : this.start(e);
    }
    close() {
      null !== this.driverInstance &&
        ((this.pendingEndReason = this.pendingEndReason ?? 'closed'), this.driverInstance.destroy());
    }
    isActive() {
      return null !== this.driverInstance && this.currentIndex >= 0;
    }
    getCurrentStep() {
      return this.isActive() ? this.steps[this.currentIndex] : null;
    }
    getCurrentIndex() {
      return this.isActive() ? this.currentIndex : -1;
    }
    validateSteps(e) {
      if (null == e) throw new Error('PoUserGuide: a lista de passos é obrigatória.');
      if (!Array.isArray(e)) throw new Error('PoUserGuide: a lista de passos deve ser um array.');
      if (0 === e.length) throw new Error('PoUserGuide: a lista de passos não pode ser vazia.');
      const t = 'undefined' != typeof document;
      for (let n = 0; n < e.length; n++) {
        const o = e[n];
        if (null == o || 'object' != typeof o) throw new Error(`PoUserGuide: passo no índice ${n} é inválido.`);
        if (null === o.content || void 0 === o.content || '' === o.content.trim())
          throw new Error(`PoUserGuide: o passo no índice ${n} precisa ter a propriedade 'content' definida.`);
        if ('string' == typeof o.element && t)
          try {
            document.querySelector(o.element);
          } catch {
            throw new Error(`PoUserGuide: seletor CSS inválido no passo no índice ${n}: "${o.element}".`);
          }
      }
    }
    resolveOptions(e) {
      const t = {
          allowClose: !0,
          allowScroll: !1,
          showProgress: !0,
          keyboardControl: !0,
          overlayOpacity: 0.7,
          nextLabel: 'Próximo',
          previousLabel: 'Anterior',
          doneLabel: 'Finalizar',
          closeLabel: 'Fechar',
          progressTemplate: '{{current}} de {{total}}'
        },
        n = { ...t, ...(e ?? {}) };
      return (
        'number' == typeof n.overlayOpacity && Number.isFinite(n.overlayOpacity)
          ? (n.overlayOpacity = Math.min(1, Math.max(0, n.overlayOpacity)))
          : (n.overlayOpacity = t.overlayOpacity),
        n
      );
    }
    sanitize(e) {
      return 'string' != typeof e ? e : je.sanitize(e, { USE_PROFILES: { html: !0 } });
    }
    injectStyles() {
      if ('undefined' == typeof document) return;
      if (null !== document.head.querySelector(`style[${Ye.STYLES_FLAG}="true"]`)) return;
      const e = document.createElement('style');
      (e.setAttribute(Ye.STYLES_FLAG, 'true'),
        (e.textContent =
          '.po-user-guide-popover { font-family: var(--font-family-theme, system-ui, -apple-system, sans-serif); }'),
        document.head.appendChild(e));
    }
    buildDriverConfig() {
      const e = this.options;
      return {
        steps: this.mapSteps(),
        allowClose: e.allowClose,
        showProgress: e.showProgress,
        allowKeyboardControl: e.keyboardControl,
        overlayOpacity: e.overlayOpacity,
        overlayColor: 'var(--color-po-user-guide-overlay, rgb(0, 0, 0))',
        nextBtnText: this.sanitize(e.nextLabel),
        prevBtnText: this.sanitize(e.previousLabel),
        doneBtnText: this.sanitize(e.doneLabel),
        progressText: this.sanitize(e.progressTemplate),
        popoverClass: ['po-user-guide-popover', e.popoverClass].filter(Boolean).join(' '),
        stagePadding: 6,
        onHighlightStarted: (e, t, n) => this.handleHighlight(n),
        onDestroyed: () => this.handleDestroyed(),
        onCloseClick: () => this.handleCloseClick()
      };
    }
    mapSteps() {
      const e = this.options;
      return this.steps.map((t, n) => ({
        element: t.element,
        popover: {
          title: this.sanitize(t.title),
          description: this.sanitize(t.content),
          side: t.position && 'auto' !== t.position ? t.position : void 0,
          align: t.align ?? void 0,
          nextBtnText: this.sanitize(t.nextLabel ?? e.nextLabel),
          prevBtnText: this.sanitize(t.previousLabel ?? e.previousLabel),
          doneBtnText: this.sanitize(t.doneLabel ?? e.doneLabel),
          popoverClass: ['po-user-guide-popover', e.popoverClass].filter(Boolean).join(' '),
          showButtons: this.resolveShowButtons(t),
          onPopoverRender: e => this.renderPopover(e, t, n)
        }
      }));
    }
    resolveShowButtons(e) {
      const t = e.showButtons;
      return !1 === this.options.allowClose && Array.isArray(t)
        ? t.filter(e => 'close' !== e)
        : !1 === this.options.allowClose
          ? ['next', 'previous']
          : t;
    }
    renderPopover(e, t, n) {
      if (!e?.wrapper) return;
      e.wrapper.setAttribute('role', 'dialog');
      const o = 'string' == typeof t.title && t.title.length > 0 ? t.title : t.content.slice(0, 100);
      e.wrapper.setAttribute('aria-label', o);
      const i = n === this.steps.length - 1,
        r = e.previousButton,
        s = e.nextButton,
        a = e.closeButton;
      if (
        (r &&
          (r.classList.add('po-user-guide-button', 'po-user-guide-button-tertiary'), r.setAttribute('type', 'button')),
        s &&
          (s.classList.add('po-user-guide-button', 'po-user-guide-button-primary'),
          s.setAttribute('type', 'button'),
          i))
      ) {
        const e = t.doneLabel ?? this.options.doneLabel;
        'string' == typeof e && e.length > 0 && ((s.textContent = e), s.setAttribute('aria-label', e));
      }
      if (a) {
        (a.classList.add('po-user-guide-button-close'), a.setAttribute('type', 'button'));
        const e = this.options.closeLabel ?? 'Fechar';
        a.setAttribute('aria-label', e);
      }
    }
    handleHighlight(e) {
      let t = null;
      if (e?.state && 'number' == typeof e.state.activeIndex) t = e.state.activeIndex;
      else if (this.driverInstance && 'function' == typeof this.driverInstance.getActiveIndex)
        try {
          const e = this.driverInstance.getActiveIndex();
          'number' == typeof e && (t = e);
        } catch {}
      if (null === t || t < 0 || t >= this.steps.length) return;
      const n = this.currentIndex;
      let o;
      if (
        ((o = -1 === n ? 'start' : t === n + 1 ? 'next' : t === n - 1 ? 'previous' : 'goto'),
        (this.currentIndex = t),
        'function' == typeof this.options.onStepChange)
      ) {
        const e = { step: this.steps[t], index: t, direction: o, totalSteps: this.steps.length };
        this.options.onStepChange(e);
      }
    }
    handleDestroyed() {
      if (null === this.driverInstance && -1 === this.currentIndex) return;
      const e = this.pendingEndReason ?? 'closed',
        t = this.currentIndex >= 0 ? this.currentIndex : 0,
        n = this.steps.length;
      if (
        ((this.driverInstance = null),
        (this.currentIndex = -1),
        (this.pendingEndReason = null),
        'function' == typeof this.options.onTourEnd)
      ) {
        const o = { reason: e, lastIndex: t, totalSteps: n };
        this.options.onTourEnd(o);
      }
    }
    handleCloseClick() {
      !1 !== this.options.allowClose &&
        ((this.pendingEndReason = 'closed'), null !== this.driverInstance && this.driverInstance.destroy());
    }
  }
  return (
    Object.defineProperty(Ye, 'STYLES_FLAG', {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: 'data-po-user-guide-styles'
    }),
    Ye
  );
})();
window.PoUserGuide = (window.PoUserGuide && window.PoUserGuide.default) || window.PoUserGuide;
//# sourceMappingURL=po-user-guide.iife.js.map
