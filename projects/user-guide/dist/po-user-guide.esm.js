/*! @po-ui/user-guide | MIT License | https://po-ui.io | inclui driver.js (MIT) e DOMPurify (MPL-2.0) */
let z = {},
  J;
function F(e = {}) {
  z = {
    animate: true,
    allowClose: true,
    overlayClickBehavior: 'close',
    overlayOpacity: 0.7,
    smoothScroll: false,
    disableActiveInteraction: false,
    showProgress: false,
    stagePadding: 10,
    stageRadius: 5,
    popoverOffset: 10,
    showButtons: ['next', 'previous', 'close'],
    disableButtons: [],
    overlayColor: '#000',
    ...e
  };
}
function s(e) {
  return e ? z[e] : z;
}
function le(e) {
  J = e;
}
function _() {
  return J;
}
let I = {};
function N(e, o) {
  I[e] = o;
}
function L(e) {
  var o;
  (o = I[e]) == null || o.call(I);
}
function de() {
  I = {};
}
function O(e, o, t, i) {
  return (e /= i / 2) < 1 ? (t / 2) * e * e + o : (-t / 2) * (--e * (e - 2) - 1) + o;
}
function U(e) {
  const o =
    'a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])';
  return e
    .flatMap(t => {
      const i = t.matches(o),
        d = Array.from(t.querySelectorAll(o));
      return [...(i ? [t] : []), ...d];
    })
    .filter(t => getComputedStyle(t).pointerEvents !== 'none' && ve(t));
}
function ee(e) {
  if (!e || ue(e)) return;
  const o = s('smoothScroll'),
    t = e.offsetHeight > window.innerHeight;
  e.scrollIntoView({
    // Removing the smooth scrolling for elements which exist inside the scrollable parent
    // This was causing the highlight to not properly render
    behavior: !o || pe(e) ? 'auto' : 'smooth',
    inline: 'center',
    block: t ? 'start' : 'center'
  });
}
function pe(e) {
  if (!e || !e.parentElement) return;
  const o = e.parentElement;
  return o.scrollHeight > o.clientHeight;
}
function ue(e) {
  const o = e.getBoundingClientRect();
  return (
    o.top >= 0 &&
    o.left >= 0 &&
    o.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    o.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}
function ve(e) {
  return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length);
}
let D = {};
function k(e, o) {
  D[e] = o;
}
function l(e) {
  return e ? D[e] : D;
}
function X() {
  D = {};
}
function fe(e, o, t, i) {
  let d = l('__activeStagePosition');
  const n = d || t.getBoundingClientRect(),
    f = i.getBoundingClientRect(),
    w = O(e, n.x, f.x - n.x, o),
    r = O(e, n.y, f.y - n.y, o),
    v = O(e, n.width, f.width - n.width, o),
    g = O(e, n.height, f.height - n.height, o);
  ((d = {
    x: w,
    y: r,
    width: v,
    height: g
  }),
    oe(d),
    k('__activeStagePosition', d));
}
function te(e) {
  if (!e) return;
  const o = e.getBoundingClientRect(),
    t = {
      x: o.x,
      y: o.y,
      width: o.width,
      height: o.height
    };
  (k('__activeStagePosition', t), oe(t));
}
function he() {
  const e = l('__activeStagePosition'),
    o = l('__overlaySvg');
  if (!e) return;
  if (!o) {
    console.warn('No stage svg found.');
    return;
  }
  const t = window.innerWidth,
    i = window.innerHeight;
  o.setAttribute('viewBox', `0 0 ${t} ${i}`);
}
function ge(e) {
  const o = we(e);
  (document.body.appendChild(o),
    re(o, t => {
      t.target.tagName === 'path' && L('overlayClick');
    }),
    k('__overlaySvg', o));
}
function oe(e) {
  const o = l('__overlaySvg');
  if (!o) {
    ge(e);
    return;
  }
  const t = o.firstElementChild;
  if ((t == null ? void 0 : t.tagName) !== 'path') throw new Error('no path element found in stage svg');
  t.setAttribute('d', ie(e));
}
function we(e) {
  const o = window.innerWidth,
    t = window.innerHeight,
    i = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  (i.classList.add('driver-overlay', 'driver-overlay-animated'),
    i.setAttribute('viewBox', `0 0 ${o} ${t}`),
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
  const d = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  return (
    d.setAttribute('d', ie(e)),
    (d.style.fill = s('overlayColor') || 'rgb(0,0,0)'),
    (d.style.opacity = `${s('overlayOpacity')}`),
    (d.style.pointerEvents = 'auto'),
    (d.style.cursor = 'auto'),
    i.appendChild(d),
    i
  );
}
function ie(e) {
  const o = window.innerWidth,
    t = window.innerHeight,
    i = s('stagePadding') || 0,
    d = s('stageRadius') || 0,
    n = e.width + i * 2,
    f = e.height + i * 2,
    w = Math.min(d, n / 2, f / 2),
    r = Math.floor(Math.max(w, 0)),
    v = e.x - i + r,
    g = e.y - i,
    y = n - r * 2,
    a = f - r * 2;
  return `M${o},0L0,0L0,${t}L${o},${t}L${o},0Z
    M${v},${g} h${y} a${r},${r} 0 0 1 ${r},${r} v${a} a${r},${r} 0 0 1 -${r},${r} h-${y} a${r},${r} 0 0 1 -${r},-${r} v-${a} a${r},${r} 0 0 1 ${r},-${r} z`;
}
function me() {
  const e = l('__overlaySvg');
  e && e.remove();
}
function ye() {
  const e = document.getElementById('driver-dummy-element');
  if (e) return e;
  let o = document.createElement('div');
  return (
    (o.id = 'driver-dummy-element'),
    (o.style.width = '0'),
    (o.style.height = '0'),
    (o.style.pointerEvents = 'none'),
    (o.style.opacity = '0'),
    (o.style.position = 'fixed'),
    (o.style.top = '50%'),
    (o.style.left = '50%'),
    document.body.appendChild(o),
    o
  );
}
function j(e) {
  const { element: o } = e;
  let t = typeof o == 'function' ? o() : typeof o == 'string' ? document.querySelector(o) : o;
  (t || (t = ye()), be(t, e));
}
function xe() {
  const e = l('__activeElement'),
    o = l('__activeStep');
  e && (te(e), he(), ae(e, o));
}
function be(e, o) {
  var C;
  const i = Date.now(),
    d = l('__activeStep'),
    n = l('__activeElement') || e,
    f = !n || n === e,
    w = e.id === 'driver-dummy-element',
    r = n.id === 'driver-dummy-element',
    v = s('animate'),
    g = o.onHighlightStarted || s('onHighlightStarted'),
    y = (o == null ? void 0 : o.onHighlighted) || s('onHighlighted'),
    a = (d == null ? void 0 : d.onDeselected) || s('onDeselected'),
    p = s(),
    c = l();
  (!f &&
    a &&
    a(r ? void 0 : n, d, {
      config: p,
      state: c,
      driver: _()
    }),
    g &&
      g(w ? void 0 : e, o, {
        config: p,
        state: c,
        driver: _()
      }));
  const u = !f && v;
  let h = false;
  (Se(), k('previousStep', d), k('previousElement', n), k('activeStep', o), k('activeElement', e));
  const m = () => {
    if (l('__transitionCallback') !== m) return;
    const b = Date.now() - i,
      E = 400 - b <= 400 / 2;
    (o.popover && E && !h && u && (Q(e, o), (h = true)),
      s('animate') && b < 400
        ? fe(b, 400, n, e)
        : (te(e),
          y &&
            y(w ? void 0 : e, o, {
              config: s(),
              state: l(),
              driver: _()
            }),
          k('__transitionCallback', void 0),
          k('__previousStep', d),
          k('__previousElement', n),
          k('__activeStep', o),
          k('__activeElement', e)),
      window.requestAnimationFrame(m));
  };
  (k('__transitionCallback', m),
    window.requestAnimationFrame(m),
    ee(e),
    !u && o.popover && Q(e, o),
    n.classList.remove('driver-active-element', 'driver-no-interaction'),
    n.removeAttribute('aria-haspopup'),
    n.removeAttribute('aria-expanded'),
    n.removeAttribute('aria-controls'),
    ((C = o.disableActiveInteraction) != null ? C : s('disableActiveInteraction')) &&
      e.classList.add('driver-no-interaction'),
    e.classList.add('driver-active-element'),
    e.setAttribute('aria-haspopup', 'dialog'),
    e.setAttribute('aria-expanded', 'true'),
    e.setAttribute('aria-controls', 'driver-popover-content'));
}
function Ce() {
  var e;
  ((e = document.getElementById('driver-dummy-element')) == null || e.remove(),
    document.querySelectorAll('.driver-active-element').forEach(o => {
      (o.classList.remove('driver-active-element', 'driver-no-interaction'),
        o.removeAttribute('aria-haspopup'),
        o.removeAttribute('aria-expanded'),
        o.removeAttribute('aria-controls'));
    }));
}
function M() {
  const e = l('__resizeTimeout');
  (e && window.cancelAnimationFrame(e), k('__resizeTimeout', window.requestAnimationFrame(xe)));
}
function Pe(e) {
  var r;
  if (!l('isInitialized') || !(e.key === 'Tab' || e.keyCode === 9)) return;
  const i = l('__activeElement'),
    d = (r = l('popover')) == null ? void 0 : r.wrapper,
    n = U([...(d ? [d] : []), ...(i ? [i] : [])]),
    f = n[0],
    w = n[n.length - 1];
  if ((e.preventDefault(), e.shiftKey)) {
    const v = n[n.indexOf(document.activeElement) - 1] || w;
    v == null || v.focus();
  } else {
    const v = n[n.indexOf(document.activeElement) + 1] || f;
    v == null || v.focus();
  }
}
function ne(e) {
  var t;
  ((t = s('allowKeyboardControl')) == null || t) &&
    (e.key === 'Escape'
      ? L('escapePress')
      : e.key === 'ArrowRight'
        ? L('arrowRightPress')
        : e.key === 'ArrowLeft' && L('arrowLeftPress'));
}
function re(e, o, t) {
  const i = (n, f) => {
    const w = n.target;
    e.contains(w) &&
      ((!t || t(w)) && (n.preventDefault(), n.stopPropagation(), n.stopImmediatePropagation()), f == null || f(n));
  };
  (document.addEventListener('pointerdown', i, true),
    document.addEventListener('mousedown', i, true),
    document.addEventListener('pointerup', i, true),
    document.addEventListener('mouseup', i, true),
    document.addEventListener(
      'click',
      n => {
        i(n, o);
      },
      true
    ));
}
function ke() {
  (window.addEventListener('keyup', ne, false),
    window.addEventListener('keydown', Pe, false),
    window.addEventListener('resize', M),
    window.addEventListener('scroll', M));
}
function _e() {
  (window.removeEventListener('keyup', ne),
    window.removeEventListener('resize', M),
    window.removeEventListener('scroll', M));
}
function Se() {
  const e = l('popover');
  e && (e.wrapper.style.display = 'none');
}
function Q(e, o) {
  var b, P;
  let t = l('popover');
  (t && document.body.removeChild(t.wrapper), (t = Le()), document.body.appendChild(t.wrapper));
  const {
    title: i,
    description: d,
    showButtons: n,
    disableButtons: f,
    showProgress: w,
    nextBtnText: r = s('nextBtnText') || 'Next &rarr;',
    prevBtnText: v = s('prevBtnText') || '&larr; Previous',
    progressText: g = s('progressText') || '{current} of {total}'
  } = o.popover || {};
  ((t.nextButton.innerHTML = r),
    (t.previousButton.innerHTML = v),
    (t.progress.innerHTML = g),
    i ? ((t.title.innerHTML = i), (t.title.style.display = 'block')) : (t.title.style.display = 'none'),
    d
      ? ((t.description.innerHTML = d), (t.description.style.display = 'block'))
      : (t.description.style.display = 'none'));
  const y = n || s('showButtons'),
    a = w || s('showProgress') || false,
    p = (y == null ? void 0 : y.includes('next')) || (y == null ? void 0 : y.includes('previous')) || a;
  ((t.closeButton.style.display = y.includes('close') ? 'block' : 'none'),
    p
      ? ((t.footer.style.display = 'flex'),
        (t.progress.style.display = a ? 'block' : 'none'),
        (t.nextButton.style.display = y.includes('next') ? 'block' : 'none'),
        (t.previousButton.style.display = y.includes('previous') ? 'block' : 'none'))
      : (t.footer.style.display = 'none'));
  const c = f || s('disableButtons') || [];
  (c != null &&
    c.includes('next') &&
    ((t.nextButton.disabled = true), t.nextButton.classList.add('driver-popover-btn-disabled')),
    c != null &&
      c.includes('previous') &&
      ((t.previousButton.disabled = true), t.previousButton.classList.add('driver-popover-btn-disabled')),
    c != null &&
      c.includes('close') &&
      ((t.closeButton.disabled = true), t.closeButton.classList.add('driver-popover-btn-disabled')));
  const u = t.wrapper;
  ((u.style.display = 'block'),
    (u.style.left = ''),
    (u.style.top = ''),
    (u.style.bottom = ''),
    (u.style.right = ''),
    (u.id = 'driver-popover-content'),
    u.setAttribute('role', 'dialog'),
    u.setAttribute('aria-labelledby', 'driver-popover-title'),
    u.setAttribute('aria-describedby', 'driver-popover-description'));
  const h = t.arrow;
  h.className = 'driver-popover-arrow';
  const m = ((b = o.popover) == null ? void 0 : b.popoverClass) || s('popoverClass') || '';
  ((u.className = `driver-popover ${m}`.trim()),
    re(
      t.wrapper,
      E => {
        var B, R, W;
        const T = E.target,
          A = ((B = o.popover) == null ? void 0 : B.onNextClick) || s('onNextClick'),
          H = ((R = o.popover) == null ? void 0 : R.onPrevClick) || s('onPrevClick'),
          $ = ((W = o.popover) == null ? void 0 : W.onCloseClick) || s('onCloseClick');
        if (T.closest('.driver-popover-next-btn'))
          return A
            ? A(e, o, {
                config: s(),
                state: l(),
                driver: _()
              })
            : L('nextClick');
        if (T.closest('.driver-popover-prev-btn'))
          return H
            ? H(e, o, {
                config: s(),
                state: l(),
                driver: _()
              })
            : L('prevClick');
        if (T.closest('.driver-popover-close-btn'))
          return $
            ? $(e, o, {
                config: s(),
                state: l(),
                driver: _()
              })
            : L('closeClick');
      },
      E =>
        !(t != null && t.description.contains(E)) &&
        !(t != null && t.title.contains(E)) &&
        typeof E.className == 'string' &&
        E.className.includes('driver-popover')
    ),
    k('popover', t));
  const x = ((P = o.popover) == null ? void 0 : P.onPopoverRender) || s('onPopoverRender');
  (x &&
    x(t, {
      config: s(),
      state: l(),
      driver: _()
    }),
    ae(e, o),
    ee(u));
  const C = e.classList.contains('driver-dummy-element'),
    S = U([u, ...(C ? [] : [e])]);
  S.length > 0 && S[0].focus();
}
function se() {
  const e = l('popover');
  if (!(e != null && e.wrapper)) return;
  const o = e.wrapper.getBoundingClientRect(),
    t = s('stagePadding') || 0,
    i = s('popoverOffset') || 0;
  return {
    width: o.width + t + i,
    height: o.height + t + i,
    realWidth: o.width,
    realHeight: o.height
  };
}
function Z(e, o) {
  const { elementDimensions: t, popoverDimensions: i, popoverPadding: d, popoverArrowDimensions: n } = o;
  return e === 'start'
    ? Math.max(Math.min(t.top - d, window.innerHeight - i.realHeight - n.width), n.width)
    : e === 'end'
      ? Math.max(
          Math.min(
            t.top - (i == null ? void 0 : i.realHeight) + t.height + d,
            window.innerHeight - (i == null ? void 0 : i.realHeight) - n.width
          ),
          n.width
        )
      : e === 'center'
        ? Math.max(
            Math.min(
              t.top + t.height / 2 - (i == null ? void 0 : i.realHeight) / 2,
              window.innerHeight - (i == null ? void 0 : i.realHeight) - n.width
            ),
            n.width
          )
        : 0;
}
function G(e, o) {
  const { elementDimensions: t, popoverDimensions: i, popoverPadding: d, popoverArrowDimensions: n } = o;
  return e === 'start'
    ? Math.max(Math.min(t.left - d, window.innerWidth - i.realWidth - n.width), n.width)
    : e === 'end'
      ? Math.max(
          Math.min(
            t.left - (i == null ? void 0 : i.realWidth) + t.width + d,
            window.innerWidth - (i == null ? void 0 : i.realWidth) - n.width
          ),
          n.width
        )
      : e === 'center'
        ? Math.max(
            Math.min(
              t.left + t.width / 2 - (i == null ? void 0 : i.realWidth) / 2,
              window.innerWidth - (i == null ? void 0 : i.realWidth) - n.width
            ),
            n.width
          )
        : 0;
}
function ae(e, o) {
  const t = l('popover');
  if (!t) return;
  const { align: i = 'start', side: d = 'left' } = (o == null ? void 0 : o.popover) || {},
    n = i,
    f = e.id === 'driver-dummy-element' ? 'over' : d,
    w = s('stagePadding') || 0,
    r = se(),
    v = t.arrow.getBoundingClientRect(),
    g = e.getBoundingClientRect(),
    y = g.top - r.height;
  let a = y >= 0;
  const p = window.innerHeight - (g.bottom + r.height);
  let c = p >= 0;
  const u = g.left - r.width;
  let h = u >= 0;
  const m = window.innerWidth - (g.right + r.width);
  let x = m >= 0;
  const C = !a && !c && !h && !x;
  let S = f;
  if (
    (f === 'top' && a
      ? (x = h = c = false)
      : f === 'bottom' && c
        ? (x = h = a = false)
        : f === 'left' && h
          ? (x = a = c = false)
          : f === 'right' && x && (h = a = c = false),
    f === 'over')
  ) {
    const b = window.innerWidth / 2 - r.realWidth / 2,
      P = window.innerHeight / 2 - r.realHeight / 2;
    ((t.wrapper.style.left = `${b}px`),
      (t.wrapper.style.right = 'auto'),
      (t.wrapper.style.top = `${P}px`),
      (t.wrapper.style.bottom = 'auto'));
  } else if (C) {
    const b = window.innerWidth / 2 - (r == null ? void 0 : r.realWidth) / 2,
      P = 10;
    ((t.wrapper.style.left = `${b}px`),
      (t.wrapper.style.right = 'auto'),
      (t.wrapper.style.bottom = `${P}px`),
      (t.wrapper.style.top = 'auto'));
  } else if (h) {
    const b = Math.min(u, window.innerWidth - (r == null ? void 0 : r.realWidth) - v.width),
      P = Z(n, {
        elementDimensions: g,
        popoverDimensions: r,
        popoverPadding: w,
        popoverArrowDimensions: v
      });
    ((t.wrapper.style.left = `${b}px`),
      (t.wrapper.style.top = `${P}px`),
      (t.wrapper.style.bottom = 'auto'),
      (t.wrapper.style.right = 'auto'),
      (S = 'left'));
  } else if (x) {
    const b = Math.min(m, window.innerWidth - (r == null ? void 0 : r.realWidth) - v.width),
      P = Z(n, {
        elementDimensions: g,
        popoverDimensions: r,
        popoverPadding: w,
        popoverArrowDimensions: v
      });
    ((t.wrapper.style.right = `${b}px`),
      (t.wrapper.style.top = `${P}px`),
      (t.wrapper.style.bottom = 'auto'),
      (t.wrapper.style.left = 'auto'),
      (S = 'right'));
  } else if (a) {
    const b = Math.min(y, window.innerHeight - r.realHeight - v.width);
    let P = G(n, {
      elementDimensions: g,
      popoverDimensions: r,
      popoverPadding: w,
      popoverArrowDimensions: v
    });
    ((t.wrapper.style.top = `${b}px`),
      (t.wrapper.style.left = `${P}px`),
      (t.wrapper.style.bottom = 'auto'),
      (t.wrapper.style.right = 'auto'),
      (S = 'top'));
  } else if (c) {
    const b = Math.min(p, window.innerHeight - (r == null ? void 0 : r.realHeight) - v.width);
    let P = G(n, {
      elementDimensions: g,
      popoverDimensions: r,
      popoverPadding: w,
      popoverArrowDimensions: v
    });
    ((t.wrapper.style.left = `${P}px`),
      (t.wrapper.style.bottom = `${b}px`),
      (t.wrapper.style.top = 'auto'),
      (t.wrapper.style.right = 'auto'),
      (S = 'bottom'));
  }
  C ? t.arrow.classList.add('driver-popover-arrow-none') : Ee(n, S, e);
}
function Ee(e, o, t) {
  const i = l('popover');
  if (!i) return;
  const d = t.getBoundingClientRect(),
    n = se(),
    f = i.arrow,
    w = n.width,
    r = window.innerWidth,
    v = d.width,
    g = d.left,
    y = n.height,
    a = window.innerHeight,
    p = d.top,
    c = d.height;
  f.className = 'driver-popover-arrow';
  let u = o,
    h = e;
  if (
    (o === 'top'
      ? (g + v <= 0 ? ((u = 'right'), (h = 'end')) : g + v - w <= 0 && ((u = 'top'), (h = 'start')),
        g >= r ? ((u = 'left'), (h = 'end')) : g + w >= r && ((u = 'top'), (h = 'end')))
      : o === 'bottom'
        ? (g + v <= 0 ? ((u = 'right'), (h = 'start')) : g + v - w <= 0 && ((u = 'bottom'), (h = 'start')),
          g >= r ? ((u = 'left'), (h = 'start')) : g + w >= r && ((u = 'bottom'), (h = 'end')))
        : o === 'left'
          ? (p + c <= 0 ? ((u = 'bottom'), (h = 'end')) : p + c - y <= 0 && ((u = 'left'), (h = 'start')),
            p >= a ? ((u = 'top'), (h = 'end')) : p + y >= a && ((u = 'left'), (h = 'end')))
          : o === 'right' &&
            (p + c <= 0 ? ((u = 'bottom'), (h = 'start')) : p + c - y <= 0 && ((u = 'right'), (h = 'start')),
            p >= a ? ((u = 'top'), (h = 'start')) : p + y >= a && ((u = 'right'), (h = 'end'))),
    !u)
  )
    f.classList.add('driver-popover-arrow-none');
  else {
    (f.classList.add(`driver-popover-arrow-side-${u}`), f.classList.add(`driver-popover-arrow-align-${h}`));
    const m = t.getBoundingClientRect(),
      x = f.getBoundingClientRect(),
      C = s('stagePadding') || 0,
      S = m.left - C < window.innerWidth && m.right + C > 0 && m.top - C < window.innerHeight && m.bottom + C > 0;
    o === 'bottom' &&
      S &&
      (x.x > m.x && x.x + x.width < m.x + m.width
        ? (i.wrapper.style.transform = 'translateY(0)')
        : (f.classList.remove(`driver-popover-arrow-align-${h}`),
          f.classList.add('driver-popover-arrow-none'),
          (i.wrapper.style.transform = `translateY(-${C / 2}px)`)));
  }
}
function Le() {
  const e = document.createElement('div');
  e.classList.add('driver-popover');
  const o = document.createElement('div');
  o.classList.add('driver-popover-arrow');
  const t = document.createElement('header');
  ((t.id = 'driver-popover-title'),
    t.classList.add('driver-popover-title'),
    (t.style.display = 'none'),
    (t.innerText = 'Popover Title'));
  const i = document.createElement('div');
  ((i.id = 'driver-popover-description'),
    i.classList.add('driver-popover-description'),
    (i.style.display = 'none'),
    (i.innerText = 'Popover description is here'));
  const d = document.createElement('button');
  ((d.type = 'button'),
    d.classList.add('driver-popover-close-btn'),
    d.setAttribute('aria-label', 'Close'),
    (d.innerHTML = '&times;'));
  const n = document.createElement('footer');
  n.classList.add('driver-popover-footer');
  const f = document.createElement('span');
  (f.classList.add('driver-popover-progress-text'), (f.innerText = ''));
  const w = document.createElement('span');
  w.classList.add('driver-popover-navigation-btns');
  const r = document.createElement('button');
  ((r.type = 'button'), r.classList.add('driver-popover-prev-btn'), (r.innerHTML = '&larr; Previous'));
  const v = document.createElement('button');
  return (
    (v.type = 'button'),
    v.classList.add('driver-popover-next-btn'),
    (v.innerHTML = 'Next &rarr;'),
    w.appendChild(r),
    w.appendChild(v),
    n.appendChild(f),
    n.appendChild(w),
    e.appendChild(d),
    e.appendChild(o),
    e.appendChild(t),
    e.appendChild(i),
    e.appendChild(n),
    {
      wrapper: e,
      arrow: o,
      title: t,
      description: i,
      footer: n,
      previousButton: r,
      nextButton: v,
      closeButton: d,
      footerButtons: w,
      progress: f
    }
  );
}
function Te() {
  var o;
  const e = l('popover');
  e && ((o = e.wrapper.parentElement) == null || o.removeChild(e.wrapper));
}
function Ae(e = {}) {
  F(e);
  function o() {
    s('allowClose') && g();
  }
  function t() {
    const a = s('overlayClickBehavior');
    if (s('allowClose') && a === 'close') {
      g();
      return;
    }
    if (typeof a == 'function') {
      const p = l('__activeStep'),
        c = l('__activeElement');
      a(c, p, {
        config: s(),
        state: l(),
        driver: _()
      });
      return;
    }
    a === 'nextStep' && i();
  }
  function i() {
    const a = l('activeIndex'),
      p = s('steps') || [];
    if (typeof a == 'undefined') return;
    const c = a + 1;
    p[c] ? v(c) : g();
  }
  function d() {
    const a = l('activeIndex'),
      p = s('steps') || [];
    if (typeof a == 'undefined') return;
    const c = a - 1;
    p[c] ? v(c) : g();
  }
  function n(a) {
    (s('steps') || [])[a] ? v(a) : g();
  }
  function f() {
    var x;
    if (l('__transitionCallback')) return;
    const p = l('activeIndex'),
      c = l('__activeStep'),
      u = l('__activeElement');
    if (typeof p == 'undefined' || typeof c == 'undefined' || typeof l('activeIndex') == 'undefined') return;
    const m = ((x = c.popover) == null ? void 0 : x.onPrevClick) || s('onPrevClick');
    if (m)
      return m(u, c, {
        config: s(),
        state: l(),
        driver: _()
      });
    d();
  }
  function w() {
    var m;
    if (l('__transitionCallback')) return;
    const p = l('activeIndex'),
      c = l('__activeStep'),
      u = l('__activeElement');
    if (typeof p == 'undefined' || typeof c == 'undefined') return;
    const h = ((m = c.popover) == null ? void 0 : m.onNextClick) || s('onNextClick');
    if (h)
      return h(u, c, {
        config: s(),
        state: l(),
        driver: _()
      });
    i();
  }
  function r() {
    l('isInitialized') ||
      (k('isInitialized', true),
      document.body.classList.add('driver-active', s('animate') ? 'driver-fade' : 'driver-simple'),
      ke(),
      N('overlayClick', t),
      N('escapePress', o),
      N('arrowLeftPress', f),
      N('arrowRightPress', w));
  }
  function v(a = 0) {
    var $, B, R, W, V, q, K, Y;
    const p = s('steps');
    if (!p) {
      (console.error('No steps to drive through'), g());
      return;
    }
    if (!p[a]) {
      g();
      return;
    }
    (k('__activeOnDestroyed', document.activeElement), k('activeIndex', a));
    const c = p[a],
      u = p[a + 1],
      h = p[a - 1],
      m = (($ = c.popover) == null ? void 0 : $.doneBtnText) || s('doneBtnText') || 'Done',
      x = s('allowClose'),
      C =
        typeof ((B = c.popover) == null ? void 0 : B.showProgress) != 'undefined'
          ? (R = c.popover) == null
            ? void 0
            : R.showProgress
          : s('showProgress'),
      b = (((W = c.popover) == null ? void 0 : W.progressText) || s('progressText') || '{{current}} of {{total}}')
        .replace('{{current}}', `${a + 1}`)
        .replace('{{total}}', `${p.length}`),
      P = ((V = c.popover) == null ? void 0 : V.showButtons) || s('showButtons'),
      E = ['next', 'previous', ...(x ? ['close'] : [])].filter(ce => !(P != null && P.length) || P.includes(ce)),
      T = ((q = c.popover) == null ? void 0 : q.onNextClick) || s('onNextClick'),
      A = ((K = c.popover) == null ? void 0 : K.onPrevClick) || s('onPrevClick'),
      H = ((Y = c.popover) == null ? void 0 : Y.onCloseClick) || s('onCloseClick');
    j({
      ...c,
      popover: {
        showButtons: E,
        nextBtnText: u ? void 0 : m,
        disableButtons: [...(h ? [] : ['previous'])],
        showProgress: C,
        progressText: b,
        onNextClick:
          T ||
          (() => {
            u ? v(a + 1) : g();
          }),
        onPrevClick:
          A ||
          (() => {
            v(a - 1);
          }),
        onCloseClick:
          H ||
          (() => {
            g();
          }),
        ...((c == null ? void 0 : c.popover) || {})
      }
    });
  }
  function g(a = true) {
    const p = l('__activeElement'),
      c = l('__activeStep'),
      u = l('__activeOnDestroyed'),
      h = s('onDestroyStarted');
    if (a && h) {
      const C = !p || (p == null ? void 0 : p.id) === 'driver-dummy-element';
      h(C ? void 0 : p, c, {
        config: s(),
        state: l(),
        driver: _()
      });
      return;
    }
    const m = (c == null ? void 0 : c.onDeselected) || s('onDeselected'),
      x = s('onDestroyed');
    if (
      (document.body.classList.remove('driver-active', 'driver-fade', 'driver-simple'),
      _e(),
      Te(),
      Ce(),
      me(),
      de(),
      X(),
      p && c)
    ) {
      const C = p.id === 'driver-dummy-element';
      (m &&
        m(C ? void 0 : p, c, {
          config: s(),
          state: l(),
          driver: _()
        }),
        x &&
          x(C ? void 0 : p, c, {
            config: s(),
            state: l(),
            driver: _()
          }));
    }
    u && u.focus();
  }
  const y = {
    isActive: () => l('isInitialized') || false,
    refresh: M,
    drive: (a = 0) => {
      (r(), v(a));
    },
    setConfig: F,
    setSteps: a => {
      (X(),
        F({
          ...s(),
          steps: a
        }));
    },
    getConfig: s,
    getState: l,
    getActiveIndex: () => l('activeIndex'),
    isFirstStep: () => l('activeIndex') === 0,
    isLastStep: () => {
      const a = s('steps') || [],
        p = l('activeIndex');
      return p !== void 0 && p === a.length - 1;
    },
    getActiveStep: () => l('activeStep'),
    getActiveElement: () => l('activeElement'),
    getPreviousElement: () => l('previousElement'),
    getPreviousStep: () => l('previousStep'),
    moveNext: i,
    movePrevious: d,
    moveTo: n,
    hasNextStep: () => {
      const a = s('steps') || [],
        p = l('activeIndex');
      return p !== void 0 && !!a[p + 1];
    },
    hasPreviousStep: () => {
      const a = s('steps') || [],
        p = l('activeIndex');
      return p !== void 0 && !!a[p - 1];
    },
    highlight: a => {
      (r(),
        j({
          ...a,
          popover: a.popover
            ? {
                showButtons: [],
                showProgress: false,
                progressText: '',
                ...a.popover
              }
            : void 0
        }));
    },
    destroy: () => {
      g(false);
    }
  };
  return (le(y), y);
}

/*! @license DOMPurify 3.4.7 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.4.7/LICENSE */

function _arrayLikeToArray(r, a) {
  (null == a || a > r.length) && (a = r.length);
  for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
  return n;
}
function _arrayWithHoles(r) {
  if (Array.isArray(r)) return r;
}
function _iterableToArrayLimit(r, l) {
  var t = null == r ? null : ('undefined' != typeof Symbol && r[Symbol.iterator]) || r['@@iterator'];
  if (null != t) {
    var e,
      n,
      i,
      u,
      a = [],
      f = true,
      o = false;
    try {
      if (((i = (t = t.call(r)).next), 0 === l));
      else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
    } catch (r) {
      ((o = true), (n = r));
    } finally {
      try {
        if (!f && null != t.return && ((u = t.return()), Object(u) !== u)) return;
      } finally {
        if (o) throw n;
      }
    }
    return a;
  }
}
function _nonIterableRest() {
  throw new TypeError(
    'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
  );
}
function _slicedToArray(r, e) {
  return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
}
function _unsupportedIterableToArray(r, a) {
  if (r) {
    if ('string' == typeof r) return _arrayLikeToArray(r, a);
    var t = {}.toString.call(r).slice(8, -1);
    return (
      'Object' === t && r.constructor && (t = r.constructor.name),
      'Map' === t || 'Set' === t
        ? Array.from(r)
        : 'Arguments' === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)
          ? _arrayLikeToArray(r, a)
          : void 0
    );
  }
}

const entries = Object.entries,
  setPrototypeOf = Object.setPrototypeOf,
  isFrozen = Object.isFrozen,
  getPrototypeOf = Object.getPrototypeOf,
  getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
let freeze = Object.freeze,
  seal = Object.seal,
  create = Object.create; // eslint-disable-line import/no-mutable-exports
let _ref = typeof Reflect !== 'undefined' && Reflect,
  apply = _ref.apply,
  construct = _ref.construct;
if (!freeze) {
  freeze = function freeze(x) {
    return x;
  };
}
if (!seal) {
  seal = function seal(x) {
    return x;
  };
}
if (!apply) {
  apply = function apply(func, thisArg) {
    for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }
    return func.apply(thisArg, args);
  };
}
if (!construct) {
  construct = function construct(Func) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    return new Func(...args);
  };
}
const arrayForEach = unapply(Array.prototype.forEach);
const arrayLastIndexOf = unapply(Array.prototype.lastIndexOf);
const arrayPop = unapply(Array.prototype.pop);
const arrayPush = unapply(Array.prototype.push);
const arraySplice = unapply(Array.prototype.splice);
const arrayIsArray = Array.isArray;
const stringToLowerCase = unapply(String.prototype.toLowerCase);
const stringToString = unapply(String.prototype.toString);
const stringMatch = unapply(String.prototype.match);
const stringReplace = unapply(String.prototype.replace);
const stringIndexOf = unapply(String.prototype.indexOf);
const stringTrim = unapply(String.prototype.trim);
const numberToString = unapply(Number.prototype.toString);
const booleanToString = unapply(Boolean.prototype.toString);
const bigintToString = typeof BigInt === 'undefined' ? null : unapply(BigInt.prototype.toString);
const symbolToString = typeof Symbol === 'undefined' ? null : unapply(Symbol.prototype.toString);
const objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
const objectToString = unapply(Object.prototype.toString);
const regExpTest = unapply(RegExp.prototype.test);
const typeErrorCreate = unconstruct(TypeError);
/**
 * Creates a new function that calls the given function with a specified thisArg and arguments.
 *
 * @param func - The function to be wrapped and called.
 * @returns A new function that calls the given function with a specified thisArg and arguments.
 */
function unapply(func) {
  return function (thisArg) {
    if (thisArg instanceof RegExp) {
      thisArg.lastIndex = 0;
    }
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    return apply(func, thisArg, args);
  };
}
/**
 * Creates a new function that constructs an instance of the given constructor function with the provided arguments.
 *
 * @param func - The constructor function to be wrapped and called.
 * @returns A new function that constructs an instance of the given constructor function with the provided arguments.
 */
function unconstruct(Func) {
  return function () {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return construct(Func, args);
  };
}
/**
 * Add properties to a lookup table
 *
 * @param set - The set to which elements will be added.
 * @param array - The array containing elements to be added to the set.
 * @param transformCaseFunc - An optional function to transform the case of each element before adding to the set.
 * @returns The modified set with added elements.
 */
function addToSet(set, array) {
  let transformCaseFunc = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : stringToLowerCase;
  if (setPrototypeOf) {
    // Make 'in' and truthy checks like Boolean(set.constructor)
    // independent of any properties defined on Object.prototype.
    // Prevent prototype setters from intercepting set as a this value.
    setPrototypeOf(set, null);
  }
  if (!arrayIsArray(array)) {
    return set;
  }
  let l = array.length;
  while (l--) {
    let element = array[l];
    if (typeof element === 'string') {
      const lcElement = transformCaseFunc(element);
      if (lcElement !== element) {
        // Config presets (e.g. tags.js, attrs.js) are immutable.
        if (!isFrozen(array)) {
          array[l] = lcElement;
        }
        element = lcElement;
      }
    }
    set[element] = true;
  }
  return set;
}
/**
 * Clean up an array to harden against CSPP
 *
 * @param array - The array to be cleaned.
 * @returns The cleaned version of the array
 */
function cleanArray(array) {
  for (let index = 0; index < array.length; index++) {
    const isPropertyExist = objectHasOwnProperty(array, index);
    if (!isPropertyExist) {
      array[index] = null;
    }
  }
  return array;
}
/**
 * Shallow clone an object
 *
 * @param object - The object to be cloned.
 * @returns A new object that copies the original.
 */
function clone(object) {
  const newObject = create(null);
  for (const _ref2 of entries(object)) {
    var _ref3 = _slicedToArray(_ref2, 2);
    const property = _ref3[0];
    const value = _ref3[1];
    const isPropertyExist = objectHasOwnProperty(object, property);
    if (isPropertyExist) {
      if (arrayIsArray(value)) {
        newObject[property] = cleanArray(value);
      } else if (value && typeof value === 'object' && value.constructor === Object) {
        newObject[property] = clone(value);
      } else {
        newObject[property] = value;
      }
    }
  }
  return newObject;
}
/**
 * Convert non-node values into strings without depending on direct property access.
 *
 * @param value - The value to stringify.
 * @returns A string representation of the provided value.
 */
function stringifyValue(value) {
  switch (typeof value) {
    case 'string': {
      return value;
    }
    case 'number': {
      return numberToString(value);
    }
    case 'boolean': {
      return booleanToString(value);
    }
    case 'bigint': {
      return bigintToString ? bigintToString(value) : '0';
    }
    case 'symbol': {
      return symbolToString ? symbolToString(value) : 'Symbol()';
    }
    case 'undefined': {
      return objectToString(value);
    }
    case 'function':
    case 'object': {
      if (value === null) {
        return objectToString(value);
      }
      const valueAsRecord = value;
      const valueToString = lookupGetter(valueAsRecord, 'toString');
      if (typeof valueToString === 'function') {
        const stringified = valueToString(valueAsRecord);
        return typeof stringified === 'string' ? stringified : objectToString(stringified);
      }
      return objectToString(value);
    }
    default: {
      return objectToString(value);
    }
  }
}
/**
 * This method automatically checks if the prop is function or getter and behaves accordingly.
 *
 * @param object - The object to look up the getter function in its prototype chain.
 * @param prop - The property name for which to find the getter function.
 * @returns The getter function found in the prototype chain or a fallback function.
 */
function lookupGetter(object, prop) {
  while (object !== null) {
    const desc = getOwnPropertyDescriptor(object, prop);
    if (desc) {
      if (desc.get) {
        return unapply(desc.get);
      }
      if (typeof desc.value === 'function') {
        return unapply(desc.value);
      }
    }
    object = getPrototypeOf(object);
  }
  function fallbackValue() {
    return null;
  }
  return fallbackValue;
}
function isRegex(value) {
  try {
    regExpTest(value, '');
    return true;
  } catch (_unused) {
    return false;
  }
}

const html$1 = freeze([
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
]);
const svg$1 = freeze([
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
]);
const svgFilters = freeze([
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
]);
// List of SVG elements that are disallowed by default.
// We still need to know them so that we can do namespace
// checks properly in case one wants to add them to
// allow-list.
const svgDisallowed = freeze([
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
]);
const mathMl$1 = freeze([
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
]);
// Similarly to SVG, we want to know all MathML elements,
// even those that we disallow by default.
const mathMlDisallowed = freeze([
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
]);
const text = freeze(['#text']);

const html = freeze([
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
]);
const svg = freeze([
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
]);
const mathMl = freeze([
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
]);
const xml = freeze(['xlink:href', 'xml:id', 'xlink:title', 'xml:space', 'xmlns:xlink']);

const MUSTACHE_EXPR = seal(/{{[\w\W]*|^[\w\W]*}}/g);
const ERB_EXPR = seal(/<%[\w\W]*|^[\w\W]*%>/g);
const TMPLIT_EXPR = seal(/\${[\w\W]*/g);
const DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]+$/); // eslint-disable-line no-useless-escape
const ARIA_ATTR = seal(/^aria-[\-\w]+$/); // eslint-disable-line no-useless-escape
const IS_ALLOWED_URI = seal(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i // eslint-disable-line no-useless-escape
);
const IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
const ATTR_WHITESPACE = seal(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g // eslint-disable-line no-control-regex
);
const DOCTYPE_NAME = seal(/^html$/i);
const CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);

/* eslint-disable @typescript-eslint/indent */
// https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
const NODE_TYPE = {
  element: 1,
  attribute: 2,
  text: 3,
  cdataSection: 4,
  entityReference: 5,
  // Deprecated
  entityNode: 6,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9,
  documentType: 10,
  documentFragment: 11,
  notation: 12 // Deprecated
};
const getGlobal = function getGlobal() {
  return typeof window === 'undefined' ? null : window;
};
/**
 * Creates a no-op policy for internal use only.
 * Don't export this function outside this module!
 * @param trustedTypes The policy factory.
 * @param purifyHostElement The Script element used to load DOMPurify (to determine policy name suffix).
 * @return The policy created (or null, if Trusted Types
 * are not supported or creating the policy failed).
 */
const _createTrustedTypesPolicy = function _createTrustedTypesPolicy(trustedTypes, purifyHostElement) {
  if (typeof trustedTypes !== 'object' || typeof trustedTypes.createPolicy !== 'function') {
    return null;
  }
  // Allow the callers to control the unique policy name
  // by adding a data-tt-policy-suffix to the script element with the DOMPurify.
  // Policy creation with duplicate names throws in Trusted Types.
  let suffix = null;
  const ATTR_NAME = 'data-tt-policy-suffix';
  if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
    suffix = purifyHostElement.getAttribute(ATTR_NAME);
  }
  const policyName = 'dompurify' + (suffix ? '#' + suffix : '');
  try {
    return trustedTypes.createPolicy(policyName, {
      createHTML(html) {
        return html;
      },
      createScriptURL(scriptUrl) {
        return scriptUrl;
      }
    });
  } catch (_) {
    // Policy creation failed (most likely another DOMPurify script has
    // already run). Skip creating the policy, as this will only cause errors
    // if TT are enforced.
    console.warn('TrustedTypes policy ' + policyName + ' could not be created.');
    return null;
  }
};
const _createHooksMap = function _createHooksMap() {
  return {
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
};
function createDOMPurify() {
  let window = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : getGlobal();
  const DOMPurify = root => createDOMPurify(root);
  DOMPurify.version = '3.4.7';
  DOMPurify.removed = [];
  if (!window || !window.document || window.document.nodeType !== NODE_TYPE.document || !window.Element) {
    // Not running in a browser, provide a factory function
    // so that you can pass your own Window
    DOMPurify.isSupported = false;
    return DOMPurify;
  }
  let document = window.document;
  const originalDocument = document;
  const currentScript = originalDocument.currentScript;
  window.DocumentFragment;
  const HTMLTemplateElement = window.HTMLTemplateElement,
    Node = window.Node,
    Element = window.Element,
    NodeFilter = window.NodeFilter,
    _window$NamedNodeMap = window.NamedNodeMap;
  _window$NamedNodeMap === void 0 ? window.NamedNodeMap || window.MozNamedAttrMap : _window$NamedNodeMap;
  window.HTMLFormElement;
  const DOMParser = window.DOMParser,
    trustedTypes = window.trustedTypes;
  const ElementPrototype = Element.prototype;
  const cloneNode = lookupGetter(ElementPrototype, 'cloneNode');
  const remove = lookupGetter(ElementPrototype, 'remove');
  const getNextSibling = lookupGetter(ElementPrototype, 'nextSibling');
  const getChildNodes = lookupGetter(ElementPrototype, 'childNodes');
  const getParentNode = lookupGetter(ElementPrototype, 'parentNode');
  const getShadowRoot = lookupGetter(ElementPrototype, 'shadowRoot');
  const getAttributes = lookupGetter(ElementPrototype, 'attributes');
  const getNodeType = Node && Node.prototype ? lookupGetter(Node.prototype, 'nodeType') : null;
  const getNodeName = Node && Node.prototype ? lookupGetter(Node.prototype, 'nodeName') : null;
  // As per issue #47, the web-components registry is inherited by a
  // new document created via createHTMLDocument. As per the spec
  // (http://w3c.github.io/webcomponents/spec/custom/#creating-and-passing-registries)
  // a new empty registry is used when creating a template contents owner
  // document, so we use that as our parent document to ensure nothing
  // is inherited.
  if (typeof HTMLTemplateElement === 'function') {
    const template = document.createElement('template');
    if (template.content && template.content.ownerDocument) {
      document = template.content.ownerDocument;
    }
  }
  let trustedTypesPolicy;
  let emptyHTML = '';
  const _document = document,
    implementation = _document.implementation,
    createNodeIterator = _document.createNodeIterator,
    createDocumentFragment = _document.createDocumentFragment,
    getElementsByTagName = _document.getElementsByTagName;
  const importNode = originalDocument.importNode;
  let hooks = _createHooksMap();
  /**
   * Expose whether this browser supports running the full DOMPurify.
   */
  DOMPurify.isSupported =
    typeof entries === 'function' &&
    typeof getParentNode === 'function' &&
    implementation &&
    implementation.createHTMLDocument !== undefined;
  const MUSTACHE_EXPR$1 = MUSTACHE_EXPR,
    ERB_EXPR$1 = ERB_EXPR,
    TMPLIT_EXPR$1 = TMPLIT_EXPR,
    DATA_ATTR$1 = DATA_ATTR,
    ARIA_ATTR$1 = ARIA_ATTR,
    IS_SCRIPT_OR_DATA$1 = IS_SCRIPT_OR_DATA,
    ATTR_WHITESPACE$1 = ATTR_WHITESPACE,
    CUSTOM_ELEMENT$1 = CUSTOM_ELEMENT;
  let IS_ALLOWED_URI$1 = IS_ALLOWED_URI;
  /**
   * We consider the elements and attributes below to be safe. Ideally
   * don't add any new ones but feel free to remove unwanted ones.
   */
  /* allowed element names */
  let ALLOWED_TAGS = null;
  const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
  /* Allowed attribute names */
  let ALLOWED_ATTR = null;
  const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
  /*
   * Configure how DOMPurify should handle custom elements and their attributes as well as customized built-in elements.
   * @property {RegExp|Function|null} tagNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any custom elements)
   * @property {RegExp|Function|null} attributeNameCheck one of [null, regexPattern, predicate]. Default: `null` (disallow any attributes not on the allow list)
   * @property {boolean} allowCustomizedBuiltInElements allow custom elements derived from built-ins if they pass CUSTOM_ELEMENT_HANDLING.tagNameCheck. Default: `false`.
   */
  let CUSTOM_ELEMENT_HANDLING = Object.seal(
    create(null, {
      tagNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      attributeNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      allowCustomizedBuiltInElements: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: false
      }
    })
  );
  /* Explicitly forbidden tags (overrides ALLOWED_TAGS/ADD_TAGS) */
  let FORBID_TAGS = null;
  /* Explicitly forbidden attributes (overrides ALLOWED_ATTR/ADD_ATTR) */
  let FORBID_ATTR = null;
  /* Config object to store ADD_TAGS/ADD_ATTR functions (when used as functions) */
  const EXTRA_ELEMENT_HANDLING = Object.seal(
    create(null, {
      tagCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      attributeCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      }
    })
  );
  /* Decide if ARIA attributes are okay */
  let ALLOW_ARIA_ATTR = true;
  /* Decide if custom data attributes are okay */
  let ALLOW_DATA_ATTR = true;
  /* Decide if unknown protocols are okay */
  let ALLOW_UNKNOWN_PROTOCOLS = false;
  /* Decide if self-closing tags in attributes are allowed.
   * Usually removed due to a mXSS issue in jQuery 3.0 */
  let ALLOW_SELF_CLOSE_IN_ATTR = true;
  /* Output should be safe for common template engines.
   * This means, DOMPurify removes data attributes, mustaches and ERB
   */
  let SAFE_FOR_TEMPLATES = false;
  /* Output should be safe even for XML used within HTML and alike.
   * This means, DOMPurify removes comments when containing risky content.
   */
  let SAFE_FOR_XML = true;
  /* Decide if document with <html>... should be returned */
  let WHOLE_DOCUMENT = false;
  /* Track whether config is already set on this instance of DOMPurify. */
  let SET_CONFIG = false;
  /* Decide if all elements (e.g. style, script) must be children of
   * document.body. By default, browsers might move them to document.head */
  let FORCE_BODY = false;
  /* Decide if a DOM `HTMLBodyElement` should be returned, instead of a html
   * string (or a TrustedHTML object if Trusted Types are supported).
   * If `WHOLE_DOCUMENT` is enabled a `HTMLHtmlElement` will be returned instead
   */
  let RETURN_DOM = false;
  /* Decide if a DOM `DocumentFragment` should be returned, instead of a html
   * string  (or a TrustedHTML object if Trusted Types are supported) */
  let RETURN_DOM_FRAGMENT = false;
  /* Try to return a Trusted Type object instead of a string, return a string in
   * case Trusted Types are not supported  */
  let RETURN_TRUSTED_TYPE = false;
  /* Output should be free from DOM clobbering attacks?
   * This sanitizes markups named with colliding, clobberable built-in DOM APIs.
   */
  let SANITIZE_DOM = true;
  /* Achieve full DOM Clobbering protection by isolating the namespace of named
   * properties and JS variables, mitigating attacks that abuse the HTML/DOM spec rules.
   *
   * HTML/DOM spec rules that enable DOM Clobbering:
   *   - Named Access on Window (§7.3.3)
   *   - DOM Tree Accessors (§3.1.5)
   *   - Form Element Parent-Child Relations (§4.10.3)
   *   - Iframe srcdoc / Nested WindowProxies (§4.8.5)
   *   - HTMLCollection (§4.2.10.2)
   *
   * Namespace isolation is implemented by prefixing `id` and `name` attributes
   * with a constant string, i.e., `user-content-`
   */
  let SANITIZE_NAMED_PROPS = false;
  const SANITIZE_NAMED_PROPS_PREFIX = 'user-content-';
  /* Keep element content when removing element? */
  let KEEP_CONTENT = true;
  /* If a `Node` is passed to sanitize(), then performs sanitization in-place instead
   * of importing it into a new Document and returning a sanitized copy */
  let IN_PLACE = false;
  /* Allow usage of profiles like html, svg and mathMl */
  let USE_PROFILES = {};
  /* Tags to ignore content of when KEEP_CONTENT is true */
  let FORBID_CONTENTS = null;
  const DEFAULT_FORBID_CONTENTS = addToSet({}, [
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
  /* Tags that are safe for data: URIs */
  let DATA_URI_TAGS = null;
  const DEFAULT_DATA_URI_TAGS = addToSet({}, ['audio', 'video', 'img', 'source', 'image', 'track']);
  /* Attributes safe for values like "javascript:" */
  let URI_SAFE_ATTRIBUTES = null;
  const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, [
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
  ]);
  const MATHML_NAMESPACE = 'http://www.w3.org/1998/Math/MathML';
  const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';
  const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml';
  /* Document namespace */
  let NAMESPACE = HTML_NAMESPACE;
  let IS_EMPTY_INPUT = false;
  /* Allowed XHTML+XML namespaces */
  let ALLOWED_NAMESPACES = null;
  const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
  let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ['mi', 'mo', 'mn', 'ms', 'mtext']);
  let HTML_INTEGRATION_POINTS = addToSet({}, ['annotation-xml']);
  // Certain elements are allowed in both SVG and HTML
  // namespace. We need to specify them explicitly
  // so that they don't get erroneously deleted from
  // HTML namespace.
  const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ['title', 'style', 'font', 'a', 'script']);
  /* Parsing of strict XHTML documents */
  let PARSER_MEDIA_TYPE = null;
  const SUPPORTED_PARSER_MEDIA_TYPES = ['application/xhtml+xml', 'text/html'];
  const DEFAULT_PARSER_MEDIA_TYPE = 'text/html';
  let transformCaseFunc = null;
  /* Keep a reference to config to pass to hooks */
  let CONFIG = null;
  /* Ideally, do not touch anything below this line */
  /* ______________________________________________ */
  const formElement = document.createElement('form');
  const isRegexOrFunction = function isRegexOrFunction(testValue) {
    return testValue instanceof RegExp || testValue instanceof Function;
  };
  /**
   * _parseConfig
   *
   * @param cfg optional config literal
   */
  // eslint-disable-next-line complexity
  const _parseConfig = function _parseConfig() {
    let cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    if (CONFIG && CONFIG === cfg) {
      return;
    }
    /* Shield configuration object from tampering */
    if (!cfg || typeof cfg !== 'object') {
      cfg = {};
    }
    /* Shield configuration object from prototype pollution */
    cfg = clone(cfg);
    PARSER_MEDIA_TYPE =
      // eslint-disable-next-line unicorn/prefer-includes
      SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1
        ? DEFAULT_PARSER_MEDIA_TYPE
        : cfg.PARSER_MEDIA_TYPE;
    // HTML tags and attributes are not case-sensitive, converting to lowercase. Keeping XHTML as is.
    transformCaseFunc = PARSER_MEDIA_TYPE === 'application/xhtml+xml' ? stringToString : stringToLowerCase;
    /* Set configuration parameters */
    ALLOWED_TAGS =
      objectHasOwnProperty(cfg, 'ALLOWED_TAGS') && arrayIsArray(cfg.ALLOWED_TAGS)
        ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc)
        : DEFAULT_ALLOWED_TAGS;
    ALLOWED_ATTR =
      objectHasOwnProperty(cfg, 'ALLOWED_ATTR') && arrayIsArray(cfg.ALLOWED_ATTR)
        ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc)
        : DEFAULT_ALLOWED_ATTR;
    ALLOWED_NAMESPACES =
      objectHasOwnProperty(cfg, 'ALLOWED_NAMESPACES') && arrayIsArray(cfg.ALLOWED_NAMESPACES)
        ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString)
        : DEFAULT_ALLOWED_NAMESPACES;
    URI_SAFE_ATTRIBUTES =
      objectHasOwnProperty(cfg, 'ADD_URI_SAFE_ATTR') && arrayIsArray(cfg.ADD_URI_SAFE_ATTR)
        ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR, transformCaseFunc)
        : DEFAULT_URI_SAFE_ATTRIBUTES;
    DATA_URI_TAGS =
      objectHasOwnProperty(cfg, 'ADD_DATA_URI_TAGS') && arrayIsArray(cfg.ADD_DATA_URI_TAGS)
        ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS, transformCaseFunc)
        : DEFAULT_DATA_URI_TAGS;
    FORBID_CONTENTS =
      objectHasOwnProperty(cfg, 'FORBID_CONTENTS') && arrayIsArray(cfg.FORBID_CONTENTS)
        ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc)
        : DEFAULT_FORBID_CONTENTS;
    FORBID_TAGS =
      objectHasOwnProperty(cfg, 'FORBID_TAGS') && arrayIsArray(cfg.FORBID_TAGS)
        ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc)
        : clone({});
    FORBID_ATTR =
      objectHasOwnProperty(cfg, 'FORBID_ATTR') && arrayIsArray(cfg.FORBID_ATTR)
        ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc)
        : clone({});
    USE_PROFILES = objectHasOwnProperty(cfg, 'USE_PROFILES')
      ? cfg.USE_PROFILES && typeof cfg.USE_PROFILES === 'object'
        ? clone(cfg.USE_PROFILES)
        : cfg.USE_PROFILES
      : false;
    ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false; // Default true
    ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false; // Default true
    ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false; // Default false
    ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false; // Default true
    SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false; // Default false
    SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false; // Default true
    WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false; // Default false
    RETURN_DOM = cfg.RETURN_DOM || false; // Default false
    RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false; // Default false
    RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false; // Default false
    FORCE_BODY = cfg.FORCE_BODY || false; // Default false
    SANITIZE_DOM = cfg.SANITIZE_DOM !== false; // Default true
    SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false; // Default false
    KEEP_CONTENT = cfg.KEEP_CONTENT !== false; // Default true
    IN_PLACE = cfg.IN_PLACE || false; // Default false
    IS_ALLOWED_URI$1 = isRegex(cfg.ALLOWED_URI_REGEXP) ? cfg.ALLOWED_URI_REGEXP : IS_ALLOWED_URI; // Default regexp
    NAMESPACE = typeof cfg.NAMESPACE === 'string' ? cfg.NAMESPACE : HTML_NAMESPACE; // Default HTML namespace
    MATHML_TEXT_INTEGRATION_POINTS =
      objectHasOwnProperty(cfg, 'MATHML_TEXT_INTEGRATION_POINTS') &&
      cfg.MATHML_TEXT_INTEGRATION_POINTS &&
      typeof cfg.MATHML_TEXT_INTEGRATION_POINTS === 'object'
        ? clone(cfg.MATHML_TEXT_INTEGRATION_POINTS)
        : addToSet({}, ['mi', 'mo', 'mn', 'ms', 'mtext']); // Default built-in map
    HTML_INTEGRATION_POINTS =
      objectHasOwnProperty(cfg, 'HTML_INTEGRATION_POINTS') &&
      cfg.HTML_INTEGRATION_POINTS &&
      typeof cfg.HTML_INTEGRATION_POINTS === 'object'
        ? clone(cfg.HTML_INTEGRATION_POINTS)
        : addToSet({}, ['annotation-xml']); // Default built-in map
    const customElementHandling =
      objectHasOwnProperty(cfg, 'CUSTOM_ELEMENT_HANDLING') &&
      cfg.CUSTOM_ELEMENT_HANDLING &&
      typeof cfg.CUSTOM_ELEMENT_HANDLING === 'object'
        ? clone(cfg.CUSTOM_ELEMENT_HANDLING)
        : create(null);
    CUSTOM_ELEMENT_HANDLING = create(null);
    if (
      objectHasOwnProperty(customElementHandling, 'tagNameCheck') &&
      isRegexOrFunction(customElementHandling.tagNameCheck)
    ) {
      CUSTOM_ELEMENT_HANDLING.tagNameCheck = customElementHandling.tagNameCheck; // Default undefined
    }
    if (
      objectHasOwnProperty(customElementHandling, 'attributeNameCheck') &&
      isRegexOrFunction(customElementHandling.attributeNameCheck)
    ) {
      CUSTOM_ELEMENT_HANDLING.attributeNameCheck = customElementHandling.attributeNameCheck; // Default undefined
    }
    if (
      objectHasOwnProperty(customElementHandling, 'allowCustomizedBuiltInElements') &&
      typeof customElementHandling.allowCustomizedBuiltInElements === 'boolean'
    ) {
      CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = customElementHandling.allowCustomizedBuiltInElements; // Default undefined
    }
    if (SAFE_FOR_TEMPLATES) {
      ALLOW_DATA_ATTR = false;
    }
    if (RETURN_DOM_FRAGMENT) {
      RETURN_DOM = true;
    }
    /* Parse profile info */
    if (USE_PROFILES) {
      ALLOWED_TAGS = addToSet({}, text);
      ALLOWED_ATTR = create(null);
      if (USE_PROFILES.html === true) {
        addToSet(ALLOWED_TAGS, html$1);
        addToSet(ALLOWED_ATTR, html);
      }
      if (USE_PROFILES.svg === true) {
        addToSet(ALLOWED_TAGS, svg$1);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.svgFilters === true) {
        addToSet(ALLOWED_TAGS, svgFilters);
        addToSet(ALLOWED_ATTR, svg);
        addToSet(ALLOWED_ATTR, xml);
      }
      if (USE_PROFILES.mathMl === true) {
        addToSet(ALLOWED_TAGS, mathMl$1);
        addToSet(ALLOWED_ATTR, mathMl);
        addToSet(ALLOWED_ATTR, xml);
      }
    }
    /* Always reset function-based ADD_TAGS / ADD_ATTR checks to prevent
     * leaking across calls when switching from function to array config */
    EXTRA_ELEMENT_HANDLING.tagCheck = null;
    EXTRA_ELEMENT_HANDLING.attributeCheck = null;
    /* Merge configuration parameters */
    if (objectHasOwnProperty(cfg, 'ADD_TAGS')) {
      if (typeof cfg.ADD_TAGS === 'function') {
        EXTRA_ELEMENT_HANDLING.tagCheck = cfg.ADD_TAGS;
      } else if (arrayIsArray(cfg.ADD_TAGS)) {
        if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
          ALLOWED_TAGS = clone(ALLOWED_TAGS);
        }
        addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
      }
    }
    if (objectHasOwnProperty(cfg, 'ADD_ATTR')) {
      if (typeof cfg.ADD_ATTR === 'function') {
        EXTRA_ELEMENT_HANDLING.attributeCheck = cfg.ADD_ATTR;
      } else if (arrayIsArray(cfg.ADD_ATTR)) {
        if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
          ALLOWED_ATTR = clone(ALLOWED_ATTR);
        }
        addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
      }
    }
    if (objectHasOwnProperty(cfg, 'ADD_URI_SAFE_ATTR') && arrayIsArray(cfg.ADD_URI_SAFE_ATTR)) {
      addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
    }
    if (objectHasOwnProperty(cfg, 'FORBID_CONTENTS') && arrayIsArray(cfg.FORBID_CONTENTS)) {
      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
        FORBID_CONTENTS = clone(FORBID_CONTENTS);
      }
      addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
    }
    if (objectHasOwnProperty(cfg, 'ADD_FORBID_CONTENTS') && arrayIsArray(cfg.ADD_FORBID_CONTENTS)) {
      if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
        FORBID_CONTENTS = clone(FORBID_CONTENTS);
      }
      addToSet(FORBID_CONTENTS, cfg.ADD_FORBID_CONTENTS, transformCaseFunc);
    }
    /* Add #text in case KEEP_CONTENT is set to true */
    if (KEEP_CONTENT) {
      ALLOWED_TAGS['#text'] = true;
    }
    /* Add html, head and body to ALLOWED_TAGS in case WHOLE_DOCUMENT is true */
    if (WHOLE_DOCUMENT) {
      addToSet(ALLOWED_TAGS, ['html', 'head', 'body']);
    }
    /* Add tbody to ALLOWED_TAGS in case tables are permitted, see #286, #365 */
    if (ALLOWED_TAGS.table) {
      addToSet(ALLOWED_TAGS, ['tbody']);
      delete FORBID_TAGS.tbody;
    }
    if (cfg.TRUSTED_TYPES_POLICY) {
      if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== 'function') {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
      }
      if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== 'function') {
        throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
      }
      // Overwrite existing TrustedTypes policy.
      trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
      // Sign local variables required by `sanitize`.
      emptyHTML = trustedTypesPolicy.createHTML('');
    } else {
      // Uninitialized policy, attempt to initialize the internal dompurify policy.
      if (trustedTypesPolicy === undefined) {
        trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
      }
      // If creating the internal policy succeeded sign internal variables.
      if (trustedTypesPolicy !== null && typeof emptyHTML === 'string') {
        emptyHTML = trustedTypesPolicy.createHTML('');
      }
    }
    /*
     * Mirror the clone-before-mutate pattern already applied above for
     * cfg.ADD_TAGS / cfg.ADD_ATTR: if any uponSanitize* hook is
     * registered AND the set still points at the default constant,
     * clone it. The hook then mutates the clone (in-call widening
     * still works exactly as documented) and the next default-cfg
     * call rebinds to the untouched original via the reassignment at
     * the top of this function.
     */
    if (
      (hooks.uponSanitizeElement.length > 0 || hooks.uponSanitizeAttribute.length > 0) &&
      ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS
    ) {
      ALLOWED_TAGS = clone(ALLOWED_TAGS);
    }
    if (hooks.uponSanitizeAttribute.length > 0 && ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
      ALLOWED_ATTR = clone(ALLOWED_ATTR);
    }
    // Prevent further manipulation of configuration.
    // Not available in IE8, Safari 5, etc.
    if (freeze) {
      freeze(cfg);
    }
    CONFIG = cfg;
  };
  /* Keep track of all possible SVG and MathML tags
   * so that we can perform the namespace checks
   * correctly. */
  const ALL_SVG_TAGS = addToSet({}, [...svg$1, ...svgFilters, ...svgDisallowed]);
  const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
  /**
   * @param element a DOM element whose namespace is being checked
   * @returns Return false if the element has a
   *  namespace that a spec-compliant parser would never
   *  return. Return true otherwise.
   */
  const _checkValidNamespace = function _checkValidNamespace(element) {
    let parent = getParentNode(element);
    // In JSDOM, if we're inside shadow DOM, then parentNode
    // can be null. We just simulate parent in this case.
    if (!parent || !parent.tagName) {
      parent = {
        namespaceURI: NAMESPACE,
        tagName: 'template'
      };
    }
    const tagName = stringToLowerCase(element.tagName);
    const parentTagName = stringToLowerCase(parent.tagName);
    if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
      return false;
    }
    if (element.namespaceURI === SVG_NAMESPACE) {
      // The only way to switch from HTML namespace to SVG
      // is via <svg>. If it happens via any other tag, then
      // it should be killed.
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === 'svg';
      }
      // The only way to switch from MathML to SVG is via`
      // svg if parent is either <annotation-xml> or MathML
      // text integration points.
      if (parent.namespaceURI === MATHML_NAMESPACE) {
        return (
          tagName === 'svg' && (parentTagName === 'annotation-xml' || MATHML_TEXT_INTEGRATION_POINTS[parentTagName])
        );
      }
      // We only allow elements that are defined in SVG
      // spec. All others are disallowed in SVG namespace.
      return Boolean(ALL_SVG_TAGS[tagName]);
    }
    if (element.namespaceURI === MATHML_NAMESPACE) {
      // The only way to switch from HTML namespace to MathML
      // is via <math>. If it happens via any other tag, then
      // it should be killed.
      if (parent.namespaceURI === HTML_NAMESPACE) {
        return tagName === 'math';
      }
      // The only way to switch from SVG to MathML is via
      // <math> and HTML integration points
      if (parent.namespaceURI === SVG_NAMESPACE) {
        return tagName === 'math' && HTML_INTEGRATION_POINTS[parentTagName];
      }
      // We only allow elements that are defined in MathML
      // spec. All others are disallowed in MathML namespace.
      return Boolean(ALL_MATHML_TAGS[tagName]);
    }
    if (element.namespaceURI === HTML_NAMESPACE) {
      // The only way to switch from SVG to HTML is via
      // HTML integration points, and from MathML to HTML
      // is via MathML text integration points
      if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
        return false;
      }
      // We disallow tags that are specific for MathML
      // or SVG and should never appear in HTML namespace
      return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
    }
    // For XHTML and XML documents that support custom namespaces
    if (PARSER_MEDIA_TYPE === 'application/xhtml+xml' && ALLOWED_NAMESPACES[element.namespaceURI]) {
      return true;
    }
    // The code should never reach this place (this means
    // that the element somehow got namespace that is not
    // HTML, SVG, MathML or allowed via ALLOWED_NAMESPACES).
    // Return false just in case.
    return false;
  };
  /**
   * _forceRemove
   *
   * @param node a DOM node
   */
  const _forceRemove = function _forceRemove(node) {
    arrayPush(DOMPurify.removed, {
      element: node
    });
    try {
      // eslint-disable-next-line unicorn/prefer-dom-node-remove
      getParentNode(node).removeChild(node);
    } catch (_) {
      remove(node);
    }
  };
  /**
   * _removeAttribute
   *
   * @param name an Attribute name
   * @param element a DOM node
   */
  const _removeAttribute = function _removeAttribute(name, element) {
    try {
      arrayPush(DOMPurify.removed, {
        attribute: element.getAttributeNode(name),
        from: element
      });
    } catch (_) {
      arrayPush(DOMPurify.removed, {
        attribute: null,
        from: element
      });
    }
    element.removeAttribute(name);
    // We void attribute values for unremovable "is" attributes
    if (name === 'is') {
      if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
        try {
          _forceRemove(element);
        } catch (_) {}
      } else {
        try {
          element.setAttribute(name, '');
        } catch (_) {}
      }
    }
  };
  /**
   * _initDocument
   *
   * @param dirty - a string of dirty markup
   * @return a DOM, filled with the dirty markup
   */
  const _initDocument = function _initDocument(dirty) {
    /* Create a HTML document */
    let doc = null;
    let leadingWhitespace = null;
    if (FORCE_BODY) {
      dirty = '<remove></remove>' + dirty;
    } else {
      /* If FORCE_BODY isn't used, leading whitespace needs to be preserved manually */
      const matches = stringMatch(dirty, /^[\r\n\t ]+/);
      leadingWhitespace = matches && matches[0];
    }
    if (PARSER_MEDIA_TYPE === 'application/xhtml+xml' && NAMESPACE === HTML_NAMESPACE) {
      // Root of XHTML doc must contain xmlns declaration (see https://www.w3.org/TR/xhtml1/normative.html#strict)
      dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + '</body></html>';
    }
    const dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
    /*
     * Use the DOMParser API by default, fallback later if needs be
     * DOMParser not work for svg when has multiple root element.
     */
    if (NAMESPACE === HTML_NAMESPACE) {
      try {
        doc = new DOMParser().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
      } catch (_) {}
    }
    /* Use createHTMLDocument in case DOMParser is not available */
    if (!doc || !doc.documentElement) {
      doc = implementation.createDocument(NAMESPACE, 'template', null);
      try {
        doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
      } catch (_) {
        // Syntax error if dirtyPayload is invalid xml
      }
    }
    const body = doc.body || doc.documentElement;
    if (dirty && leadingWhitespace) {
      body.insertBefore(document.createTextNode(leadingWhitespace), body.childNodes[0] || null);
    }
    /* Work on whole document or just its body */
    if (NAMESPACE === HTML_NAMESPACE) {
      return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? 'html' : 'body')[0];
    }
    return WHOLE_DOCUMENT ? doc.documentElement : body;
  };
  /**
   * Creates a NodeIterator object that you can use to traverse filtered lists of nodes or elements in a document.
   *
   * @param root The root element or node to start traversing on.
   * @return The created NodeIterator
   */
  const _createNodeIterator = function _createNodeIterator(root) {
    return createNodeIterator.call(
      root.ownerDocument || root,
      root,
      // eslint-disable-next-line no-bitwise
      NodeFilter.SHOW_ELEMENT |
        NodeFilter.SHOW_COMMENT |
        NodeFilter.SHOW_TEXT |
        NodeFilter.SHOW_PROCESSING_INSTRUCTION |
        NodeFilter.SHOW_CDATA_SECTION,
      null
    );
  };
  /**
   * Strip template-engine expressions ({{...}}, ${...}, <%...%>) from the
   * character data of an element subtree. Used as the final safety net for
   * SAFE_FOR_TEMPLATES on every DOM-returning code path so that expressions
   * which only form after text-node normalization (e.g. fragments split across
   * stripped elements) cannot survive into a template-evaluating framework.
   *
   * Walks text/comment/CDATA/processing-instruction nodes and mutates `.data`
   * in place rather than round-tripping through innerHTML. This preserves
   * descendant node references (important for IN_PLACE callers), avoids a
   * serialize/reparse cycle, and reads literal character data — which means
   * `<%...%>` in text content matches the ERB regex against its real bytes
   * instead of the HTML-entity-escaped form innerHTML would produce.
   *
   * Attribute values are not visited here; SAFE_FOR_TEMPLATES handling for
   * attributes is performed during the per-node `_sanitizeAttributes` pass.
   *
   * @param node The root element whose character data should be scrubbed.
   */
  const _scrubTemplateExpressions = function _scrubTemplateExpressions(node) {
    node.normalize();
    const walker = createNodeIterator.call(
      node.ownerDocument || node,
      node,
      // eslint-disable-next-line no-bitwise
      NodeFilter.SHOW_TEXT |
        NodeFilter.SHOW_COMMENT |
        NodeFilter.SHOW_CDATA_SECTION |
        NodeFilter.SHOW_PROCESSING_INSTRUCTION,
      null
    );
    let currentNode = walker.nextNode();
    while (currentNode) {
      let data = currentNode.data;
      arrayForEach([MUSTACHE_EXPR$1, ERB_EXPR$1, TMPLIT_EXPR$1], expr => {
        data = stringReplace(data, expr, ' ');
      });
      currentNode.data = data;
      currentNode = walker.nextNode();
    }
  };
  /**
   * _isClobbered
   *
   * Detect DOM-clobbering on HTMLFormElement nodes. Form is the only HTML
   * interface with [LegacyOverrideBuiltIns]; a descendant element with a
   * `name` attribute matching a prototype property shadows that property
   * on direct reads. We use this check at the IN_PLACE entry-point and
   * during attribute sanitization to refuse clobbered forms.
   *
   * @param element element to check for clobbering attacks
   * @return true if clobbered, false if safe
   */
  const _isClobbered = function _isClobbered(element) {
    // Realm-independent tag-name probe. If we can't determine the tag
    // name at all, we can't reason about clobbering — return false
    // (the caller's other defences still apply).
    const realTagName = getNodeName ? getNodeName(element) : null;
    if (typeof realTagName !== 'string') {
      return false;
    }
    if (transformCaseFunc(realTagName) !== 'form') {
      return false;
    }
    return (
      typeof element.nodeName !== 'string' ||
      typeof element.textContent !== 'string' ||
      typeof element.removeChild !== 'function' ||
      // Realm-safe NamedNodeMap detection: equality against the cached
      // prototype getter. Clobbered .attributes (e.g. <input name="attributes">)
      // makes the direct read diverge from the cached read; a clean form
      // (same-realm OR foreign-realm) has both reads pointing at the same
      // canonical NamedNodeMap.
      element.attributes !== getAttributes(element) ||
      typeof element.removeAttribute !== 'function' ||
      typeof element.setAttribute !== 'function' ||
      typeof element.namespaceURI !== 'string' ||
      typeof element.insertBefore !== 'function' ||
      typeof element.hasChildNodes !== 'function' ||
      // NodeType clobbering probe. Cached Node.prototype.nodeType getter
      // returns the integer 1 for any Element regardless of realm; direct
      // read on a clobbered form (e.g. <input name="nodeType">) returns
      // the named child element. Cheap addition — nodeType is read from
      // an internal slot, no serialization cost — and removes a residual
      // clobbering surface used by several mXSS / PI / comment branches
      // in _sanitizeElements that compare currentNode.nodeType directly.
      element.nodeType !== getNodeType(element) ||
      // HTMLFormElement has [LegacyOverrideBuiltIns]: a descendant named
      // "childNodes" shadows the prototype getter. Direct reads of
      // form.childNodes from a clobbered form return the named child
      // instead of the real NodeList, so any walk that reads it directly
      // skips the form's real children. Compare the direct read to the
      // cached Node.prototype getter — when the form's named-property
      // getter intercepts the read, the two values differ and we flag
      // the form. This catches every clobbering child type (input,
      // select, etc.) regardless of whether the named child happens to
      // carry a numeric .length, which a typeof-based probe would miss
      // (e.g. HTMLSelectElement.length is a defined unsigned-long).
      element.childNodes !== getChildNodes(element)
    );
  };
  /**
   * Checks whether the given value is a DocumentFragment from any realm.
   *
   * The realm-independent replacement reads `nodeType` through the cached
   * Node.prototype getter and compares to the DOCUMENT_FRAGMENT_NODE
   * constant (11). nodeType is a numeric value resolved from the node's
   * internal slot, identical across realms for the same kind of node.
   *
   * @param value object to check
   * @return true if value is a DocumentFragment-shaped node from any realm
   */
  const _isDocumentFragment = function _isDocumentFragment(value) {
    if (!getNodeType || typeof value !== 'object' || value === null) {
      return false;
    }
    try {
      return getNodeType(value) === NODE_TYPE.documentFragment;
    } catch (_) {
      return false;
    }
  };
  /**
   * Checks whether the given object is a DOM node, including nodes that
   * originate from a different window/realm (e.g. an iframe's
   * contentDocument). The previous `value instanceof Node` check was
   * realm-bound: nodes from a different window failed it, causing
   * sanitize() to silently stringify them and reset IN_PLACE to false,
   * returning the original node unsanitized. See GHSA-4w3q-35jp-p934.
   *
   * @param value object to check whether it's a DOM node
   * @return true if value is a DOM node from any realm
   */
  const _isNode = function _isNode(value) {
    if (!getNodeType || typeof value !== 'object' || value === null) {
      return false;
    }
    try {
      return typeof getNodeType(value) === 'number';
    } catch (_) {
      return false;
    }
  };
  function _executeHooks(hooks, currentNode, data) {
    arrayForEach(hooks, hook => {
      hook.call(DOMPurify, currentNode, data, CONFIG);
    });
  }
  /**
   * _sanitizeElements
   *
   * @protect nodeName
   * @protect textContent
   * @protect removeChild
   * @param currentNode to check for permission to exist
   * @return true if node was killed, false if left alive
   */
  const _sanitizeElements = function _sanitizeElements(currentNode) {
    let content = null;
    /* Execute a hook if present */
    _executeHooks(hooks.beforeSanitizeElements, currentNode, null);
    /* Check if element is clobbered or can clobber */
    if (_isClobbered(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Now let's check the element's type and name */
    const tagName = transformCaseFunc(currentNode.nodeName);
    /* Execute a hook if present */
    _executeHooks(hooks.uponSanitizeElement, currentNode, {
      tagName,
      allowedTags: ALLOWED_TAGS
    });
    /* Detect mXSS attempts abusing namespace confusion */
    if (
      SAFE_FOR_XML &&
      currentNode.hasChildNodes() &&
      !_isNode(currentNode.firstElementChild) &&
      regExpTest(/<[/\w!]/g, currentNode.innerHTML) &&
      regExpTest(/<[/\w!]/g, currentNode.textContent)
    ) {
      _forceRemove(currentNode);
      return true;
    }
    /* Remove risky CSS construction leading to mXSS */
    if (
      SAFE_FOR_XML &&
      currentNode.namespaceURI === HTML_NAMESPACE &&
      tagName === 'style' &&
      _isNode(currentNode.firstElementChild)
    ) {
      _forceRemove(currentNode);
      return true;
    }
    /* Remove any occurrence of processing instructions */
    if (currentNode.nodeType === NODE_TYPE.progressingInstruction) {
      _forceRemove(currentNode);
      return true;
    }
    /* Remove any kind of possibly harmful comments */
    if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(/<[/\w]/g, currentNode.data)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Remove element if anything forbids its presence */
    if (
      FORBID_TAGS[tagName] ||
      (!(EXTRA_ELEMENT_HANDLING.tagCheck instanceof Function && EXTRA_ELEMENT_HANDLING.tagCheck(tagName)) &&
        !ALLOWED_TAGS[tagName])
    ) {
      /* Check if we have a custom element to handle */
      if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
        if (
          CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp &&
          regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)
        ) {
          return false;
        }
        if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) {
          return false;
        }
      }
      /* Keep content except for bad-listed elements.
         Use the cached prototype getters exclusively — the previous code
         had `|| currentNode.parentNode` / `|| currentNode.childNodes`
         fallbacks, but the cached getters always return the canonical
         value (or null for a real parent-less node), so the fallback
         path was dead in safe cases and a clobbering surface in unsafe
         ones. Falsy cached results stay falsy; the `if (childNodes &&
         parentNode)` check already gates correctly. */
      if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
        const parentNode = getParentNode(currentNode);
        const childNodes = getChildNodes(currentNode);
        if (childNodes && parentNode) {
          const childCount = childNodes.length;
          for (let i = childCount - 1; i >= 0; --i) {
            const childClone = cloneNode(childNodes[i], true);
            parentNode.insertBefore(childClone, getNextSibling(currentNode));
          }
        }
      }
      _forceRemove(currentNode);
      return true;
    }
    /* Check whether element has a valid namespace.
       Realm-safe check (GHSA-hpcv-96wg-7vj8): use the cached Node.prototype
       nodeType getter rather than `instanceof Element`, which is realm-
       bound and short-circuits to false for any node minted in a different
       realm — letting a foreign-realm element with a forbidden namespace
       slip past the namespace check entirely. */
    const nt = getNodeType ? getNodeType(currentNode) : currentNode.nodeType;
    if (nt === NODE_TYPE.element && !_checkValidNamespace(currentNode)) {
      _forceRemove(currentNode);
      return true;
    }
    /* Make sure that older browsers don't get fallback-tag mXSS */
    if (
      (tagName === 'noscript' || tagName === 'noembed' || tagName === 'noframes') &&
      regExpTest(/<\/no(script|embed|frames)/i, currentNode.innerHTML)
    ) {
      _forceRemove(currentNode);
      return true;
    }
    /* Sanitize element content to be template-safe */
    if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
      /* Get the element's text content */
      content = currentNode.textContent;
      arrayForEach([MUSTACHE_EXPR$1, ERB_EXPR$1, TMPLIT_EXPR$1], expr => {
        content = stringReplace(content, expr, ' ');
      });
      if (currentNode.textContent !== content) {
        arrayPush(DOMPurify.removed, {
          element: currentNode.cloneNode()
        });
        currentNode.textContent = content;
      }
    }
    /* Execute a hook if present */
    _executeHooks(hooks.afterSanitizeElements, currentNode, null);
    return false;
  };
  /**
   * _isValidAttribute
   *
   * @param lcTag Lowercase tag name of containing element.
   * @param lcName Lowercase attribute name.
   * @param value Attribute value.
   * @return Returns true if `value` is valid, otherwise false.
   */
  // eslint-disable-next-line complexity
  const _isValidAttribute = function _isValidAttribute(lcTag, lcName, value) {
    /* FORBID_ATTR must always win, even if ADD_ATTR predicate would allow it */
    if (FORBID_ATTR[lcName]) {
      return false;
    }
    /* Make sure attribute cannot clobber */
    if (SANITIZE_DOM && (lcName === 'id' || lcName === 'name') && (value in document || value in formElement)) {
      return false;
    }
    const nameIsPermitted =
      ALLOWED_ATTR[lcName] ||
      (EXTRA_ELEMENT_HANDLING.attributeCheck instanceof Function &&
        EXTRA_ELEMENT_HANDLING.attributeCheck(lcName, lcTag));
    /* Allow valid data-* attributes: At least one character after "-"
        (https://html.spec.whatwg.org/multipage/dom.html#embedding-custom-non-visible-data-with-the-data-*-attributes)
        XML-compatible (https://html.spec.whatwg.org/multipage/infrastructure.html#xml-compatible and http://www.w3.org/TR/xml/#d0e804)
        We don't need to check the value; it's always URI safe. */
    if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR$1, lcName));
    else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$1, lcName));
    else if (!nameIsPermitted || FORBID_ATTR[lcName]) {
      if (
        // First condition does a very basic check if a) it's basically a valid custom element tagname AND
        // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
        // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
        (_isBasicCustomElement(lcTag) &&
          ((CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp &&
            regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag)) ||
            (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function &&
              CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag))) &&
          ((CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp &&
            regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName)) ||
            (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function &&
              CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName, lcTag)))) ||
        // Alternative, second condition checks if it's an `is`-attribute, AND
        // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
        (lcName === 'is' &&
          CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements &&
          ((CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp &&
            regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value)) ||
            (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))))
      );
      else {
        return false;
      }
      /* Check value is safe. First, is attr inert? If so, is safe */
    } else if (URI_SAFE_ATTRIBUTES[lcName]);
    else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE$1, '')));
    else if (
      (lcName === 'src' || lcName === 'xlink:href' || lcName === 'href') &&
      lcTag !== 'script' &&
      stringIndexOf(value, 'data:') === 0 &&
      DATA_URI_TAGS[lcTag]
    );
    else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$1, stringReplace(value, ATTR_WHITESPACE$1, '')));
    else if (value) {
      return false;
    } else;
    return true;
  };
  /* Names the HTML spec reserves from valid-custom-element-name; these must
   * never be treated as basic custom elements even when a permissive
   * CUSTOM_ELEMENT_HANDLING.tagNameCheck is configured. */
  const RESERVED_CUSTOM_ELEMENT_NAMES = addToSet({}, [
    'annotation-xml',
    'color-profile',
    'font-face',
    'font-face-format',
    'font-face-name',
    'font-face-src',
    'font-face-uri',
    'missing-glyph'
  ]);
  /**
   * _isBasicCustomElement
   * checks if at least one dash is included in tagName, and it's not the first char
   * for more sophisticated checking see https://github.com/sindresorhus/validate-element-name
   *
   * @param tagName name of the tag of the node to sanitize
   * @returns Returns true if the tag name meets the basic criteria for a custom element, otherwise false.
   */
  const _isBasicCustomElement = function _isBasicCustomElement(tagName) {
    return !RESERVED_CUSTOM_ELEMENT_NAMES[stringToLowerCase(tagName)] && regExpTest(CUSTOM_ELEMENT$1, tagName);
  };
  /**
   * _sanitizeAttributes
   *
   * @protect attributes
   * @protect nodeName
   * @protect removeAttribute
   * @protect setAttribute
   *
   * @param currentNode to sanitize
   */
  const _sanitizeAttributes = function _sanitizeAttributes(currentNode) {
    /* Execute a hook if present */
    _executeHooks(hooks.beforeSanitizeAttributes, currentNode, null);
    const attributes = currentNode.attributes;
    /* Check if we have attributes; if not we might have a text node */
    if (!attributes || _isClobbered(currentNode)) {
      return;
    }
    const hookEvent = {
      attrName: '',
      attrValue: '',
      keepAttr: true,
      allowedAttributes: ALLOWED_ATTR,
      forceKeepAttr: undefined
    };
    let l = attributes.length;
    /* Go backwards over all attributes; safely remove bad ones */
    while (l--) {
      const attr = attributes[l];
      const name = attr.name,
        namespaceURI = attr.namespaceURI,
        attrValue = attr.value;
      const lcName = transformCaseFunc(name);
      const initValue = attrValue;
      let value = name === 'value' ? initValue : stringTrim(initValue);
      /* Execute a hook if present */
      hookEvent.attrName = lcName;
      hookEvent.attrValue = value;
      hookEvent.keepAttr = true;
      hookEvent.forceKeepAttr = undefined; // Allows developers to see this is a property they can set
      _executeHooks(hooks.uponSanitizeAttribute, currentNode, hookEvent);
      value = hookEvent.attrValue;
      /* Full DOM Clobbering protection via namespace isolation,
       * Prefix id and name attributes with `user-content-`
       */
      if (
        SANITIZE_NAMED_PROPS &&
        (lcName === 'id' || lcName === 'name') &&
        stringIndexOf(value, SANITIZE_NAMED_PROPS_PREFIX) !== 0
      ) {
        // Remove the attribute with this value
        _removeAttribute(name, currentNode);
        // Prefix the value and later re-create the attribute with the sanitized value
        value = SANITIZE_NAMED_PROPS_PREFIX + value;
      }
      // Else: already prefixed, leave the attribute alone — the prefix is
      // itself the clobbering protection, and re-applying it is incorrect.
      /* Work around a security issue with comments inside attributes */
      if (
        SAFE_FOR_XML &&
        regExpTest(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, value)
      ) {
        _removeAttribute(name, currentNode);
        continue;
      }
      /* Make sure we cannot easily use animated hrefs, even if animations are allowed */
      if (lcName === 'attributename' && stringMatch(value, 'href')) {
        _removeAttribute(name, currentNode);
        continue;
      }
      /* Did the hooks approve of the attribute? */
      if (hookEvent.forceKeepAttr) {
        continue;
      }
      /* Did the hooks approve of the attribute? */
      if (!hookEvent.keepAttr) {
        _removeAttribute(name, currentNode);
        continue;
      }
      /* Work around a security issue in jQuery 3.0 */
      if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      /* Sanitize attribute content to be template-safe */
      if (SAFE_FOR_TEMPLATES) {
        arrayForEach([MUSTACHE_EXPR$1, ERB_EXPR$1, TMPLIT_EXPR$1], expr => {
          value = stringReplace(value, expr, ' ');
        });
      }
      /* Is `value` valid for this attribute? */
      const lcTag = transformCaseFunc(currentNode.nodeName);
      if (!_isValidAttribute(lcTag, lcName, value)) {
        _removeAttribute(name, currentNode);
        continue;
      }
      /* Handle attributes that require Trusted Types */
      if (
        trustedTypesPolicy &&
        typeof trustedTypes === 'object' &&
        typeof trustedTypes.getAttributeType === 'function'
      ) {
        if (namespaceURI);
        else {
          switch (trustedTypes.getAttributeType(lcTag, lcName)) {
            case 'TrustedHTML': {
              value = trustedTypesPolicy.createHTML(value);
              break;
            }
            case 'TrustedScriptURL': {
              value = trustedTypesPolicy.createScriptURL(value);
              break;
            }
          }
        }
      }
      /* Handle invalid data-* attribute set by try-catching it */
      if (value !== initValue) {
        try {
          if (namespaceURI) {
            currentNode.setAttributeNS(namespaceURI, name, value);
          } else {
            /* Fallback to setAttribute() for browser-unrecognized namespaces e.g. "x-schema". */
            currentNode.setAttribute(name, value);
          }
          if (_isClobbered(currentNode)) {
            _forceRemove(currentNode);
          } else {
            arrayPop(DOMPurify.removed);
          }
        } catch (_) {
          _removeAttribute(name, currentNode);
        }
      }
    }
    /* Execute a hook if present */
    _executeHooks(hooks.afterSanitizeAttributes, currentNode, null);
  };
  /**
   * _sanitizeShadowDOM
   *
   * @param fragment to iterate over recursively
   */
  const _sanitizeShadowDOM2 = function _sanitizeShadowDOM(fragment) {
    let shadowNode = null;
    const shadowIterator = _createNodeIterator(fragment);
    /* Execute a hook if present */
    _executeHooks(hooks.beforeSanitizeShadowDOM, fragment, null);
    while ((shadowNode = shadowIterator.nextNode())) {
      /* Execute a hook if present */
      _executeHooks(hooks.uponSanitizeShadowNode, shadowNode, null);
      /* Sanitize tags and elements */
      _sanitizeElements(shadowNode);
      /* Check attributes next */
      _sanitizeAttributes(shadowNode);
      /* Deep shadow DOM detected.
         Realm-safe check (GHSA-hpcv-96wg-7vj8): use nodeType against the
         DOCUMENT_FRAGMENT_NODE constant rather than instanceof, so we
         recurse into <template>.content from foreign realms too. */
      if (_isDocumentFragment(shadowNode.content)) {
        _sanitizeShadowDOM2(shadowNode.content);
      }
      /* An element iterated here may itself host an attached
         shadow root. The default NodeIterator does not enter shadow
         trees, so a shadow root nested inside template.content was
         previously reached by no walk at all (the pre-pass at
         _sanitizeAttachedShadowRoots descends via childNodes, which
         doesn't enter template.content; the template-content recursion
         above iterates the content but never inspected shadowRoot).
         Walk it explicitly. The nodeType guard avoids reading
         shadowRoot off text / comment / CDATA / PI nodes that the
         iterator also surfaces. */
      const shadowNodeType = getNodeType ? getNodeType(shadowNode) : shadowNode.nodeType;
      if (shadowNodeType === NODE_TYPE.element) {
        const innerSr = getShadowRoot ? getShadowRoot(shadowNode) : shadowNode.shadowRoot;
        if (_isDocumentFragment(innerSr)) {
          _sanitizeAttachedShadowRoots2(innerSr);
          _sanitizeShadowDOM2(innerSr);
        }
      }
    }
    /* Execute a hook if present */
    _executeHooks(hooks.afterSanitizeShadowDOM, fragment, null);
  };
  /**
   * _sanitizeAttachedShadowRoots
   *
   * Walks `root` and feeds every attached shadow root we encounter into
   * the existing _sanitizeShadowDOM pipeline. The default node iterator
   * does not descend into shadow trees, so nodes inside an attached
   * shadow root would otherwise be skipped entirely.
   *
   * Two real input paths put attached shadow roots in front of us:
   *   1. IN_PLACE on a DOM node that already has shadow roots attached.
   *   2. DOM-node input where importNode(dirty, true) deep-clones the
   *      shadow root because it was created with `clonable: true`.
   *
   * This pass runs once, up front, so the main iteration loop (and the
   * existing _sanitizeShadowDOM template-content recursion) stay
   * untouched — string-input paths are not affected.
   *
   * @param root the subtree root to walk for attached shadow roots
   */
  const _sanitizeAttachedShadowRoots2 = function _sanitizeAttachedShadowRoots(root) {
    const nodeType = getNodeType ? getNodeType(root) : root.nodeType;
    if (nodeType === NODE_TYPE.element) {
      const sr = getShadowRoot ? getShadowRoot(root) : root.shadowRoot;
      // Realm-safe check (GHSA-hpcv-96wg-7vj8): use nodeType-based
      // detection rather than `instanceof DocumentFragment`, which is
      // realm-bound and silently skipped shadow roots whose host element
      // belonged to a foreign realm (e.g. iframe.contentDocument
      // attachShadow). A foreign-realm ShadowRoot extends the foreign
      // realm's DocumentFragment, not ours, so the old instanceof check
      // returned false and the shadow subtree was never walked.
      if (_isDocumentFragment(sr)) {
        // Recurse first so that nested shadow roots are reached even if
        // _sanitizeShadowDOM removes hosts at this level.
        _sanitizeAttachedShadowRoots2(sr);
        _sanitizeShadowDOM2(sr);
      }
    }
    // Snapshot children before recursing. Sanitization of one subtree
    // (e.g. via an uponSanitizeShadowNode hook) may detach siblings,
    // and naive nextSibling traversal would silently skip the rest of
    // the list once a node is detached.
    const childNodes = getChildNodes ? getChildNodes(root) : root.childNodes;
    if (!childNodes) {
      return;
    }
    const snapshot = [];
    arrayForEach(childNodes, child => {
      arrayPush(snapshot, child);
    });
    for (const child of snapshot) {
      _sanitizeAttachedShadowRoots2(child);
    }
    /* When the root is a <template>, also descend into root.content */
    if (nodeType === NODE_TYPE.element) {
      const rootName = getNodeName ? getNodeName(root) : null;
      if (typeof rootName === 'string' && transformCaseFunc(rootName) === 'template') {
        const content = root.content;
        if (_isDocumentFragment(content)) {
          _sanitizeAttachedShadowRoots2(content);
        }
      }
    }
  };
  // eslint-disable-next-line complexity
  DOMPurify.sanitize = function (dirty) {
    let cfg = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    let body = null;
    let importedNode = null;
    let currentNode = null;
    let returnNode = null;
    /* Make sure we have a string to sanitize.
      DO NOT return early, as this will return the wrong type if
      the user has requested a DOM object rather than a string */
    IS_EMPTY_INPUT = !dirty;
    if (IS_EMPTY_INPUT) {
      dirty = '<!-->';
    }
    /* Stringify, in case dirty is an object */
    if (typeof dirty !== 'string' && !_isNode(dirty)) {
      dirty = stringifyValue(dirty);
      if (typeof dirty !== 'string') {
        throw typeErrorCreate('dirty is not a string, aborting');
      }
    }
    /* Return dirty HTML if DOMPurify cannot run */
    if (!DOMPurify.isSupported) {
      return dirty;
    }
    /* Assign config vars */
    if (!SET_CONFIG) {
      _parseConfig(cfg);
    }
    /* Clean up removed elements */
    DOMPurify.removed = [];
    /* Check if dirty is correctly typed for IN_PLACE */
    if (typeof dirty === 'string') {
      IN_PLACE = false;
    }
    if (IN_PLACE) {
      /* Do some early pre-sanitization to avoid unsafe root nodes.
         Read nodeName through the cached prototype getter — a clobbering
         child named "nodeName" on the form root would otherwise shadow
         the property and let this check skip the root-allowlist
         validation entirely. */
      const nn = getNodeName ? getNodeName(dirty) : dirty.nodeName;
      if (typeof nn === 'string') {
        const tagName = transformCaseFunc(nn);
        if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
          throw typeErrorCreate('root node is forbidden and cannot be sanitized in-place');
        }
      }
      /* Pre-flight the root through _isClobbered. The iterator-driven
         removal path can not detach a parent-less root: _forceRemove
         falls through to Element.prototype.remove(), which per spec
         is a no-op on a node with no parent. A clobbered root would
         then survive the main loop with its attributes uninspected,
         because _sanitizeAttributes early-returns on _isClobbered. The
         result would be an attacker-controlled form, complete with any
         event-handler attributes the caller passed in, handed back to
         the application unsanitized. Refuse to sanitize such a root
         the same way we refuse a forbidden tag. GHSA-r47g-fvhr-h676. */
      if (_isClobbered(dirty)) {
        throw typeErrorCreate('root node is clobbered and cannot be sanitized in-place');
      }
      /* Sanitize attached shadow roots before the main iterator runs.
         The iterator does not descend into shadow trees. */
      _sanitizeAttachedShadowRoots2(dirty);
    } else if (_isNode(dirty)) {
      /* If dirty is a DOM element, append to an empty document to avoid
         elements being stripped by the parser */
      body = _initDocument('<!---->');
      importedNode = body.ownerDocument.importNode(dirty, true);
      if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === 'BODY') {
        /* Node is already a body, use as is */
        body = importedNode;
      } else if (importedNode.nodeName === 'HTML') {
        body = importedNode;
      } else {
        // eslint-disable-next-line unicorn/prefer-dom-node-append
        body.appendChild(importedNode);
      }
      /* Clonable shadow roots are deep-cloned by importNode(); sanitize
         them before the main iterator runs, since the iterator does not
         descend into shadow trees. The walk routes every read through a
         cached prototype getter so clobbering descendants on a form root
         cannot hide a shadow host from this pass. */
      _sanitizeAttachedShadowRoots2(importedNode);
    } else {
      /* Exit directly if we have nothing to do */
      if (
        !RETURN_DOM &&
        !SAFE_FOR_TEMPLATES &&
        !WHOLE_DOCUMENT &&
        // eslint-disable-next-line unicorn/prefer-includes
        dirty.indexOf('<') === -1
      ) {
        return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
      }
      /* Initialize the document to work on */
      body = _initDocument(dirty);
      /* Check we have a DOM node from the data */
      if (!body) {
        return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : '';
      }
    }
    /* Remove first element node (ours) if FORCE_BODY is set */
    if (body && FORCE_BODY) {
      _forceRemove(body.firstChild);
    }
    /* Get node iterator */
    const nodeIterator = _createNodeIterator(IN_PLACE ? dirty : body);
    /* Now start iterating over the created document */
    while ((currentNode = nodeIterator.nextNode())) {
      /* Sanitize tags and elements */
      _sanitizeElements(currentNode);
      /* Check attributes next */
      _sanitizeAttributes(currentNode);
      /* Shadow DOM detected, sanitize it.
         Realm-safe check (GHSA-hpcv-96wg-7vj8): nodeType-based detection
         instead of instanceof, so foreign-realm <template>.content is
         walked correctly. */
      if (_isDocumentFragment(currentNode.content)) {
        _sanitizeShadowDOM2(currentNode.content);
      }
    }
    /* If we sanitized `dirty` in-place, return it. */
    if (IN_PLACE) {
      if (SAFE_FOR_TEMPLATES) {
        _scrubTemplateExpressions(dirty);
      }
      return dirty;
    }
    /* Return sanitized string or DOM */
    if (RETURN_DOM) {
      if (SAFE_FOR_TEMPLATES) {
        _scrubTemplateExpressions(body);
      }
      if (RETURN_DOM_FRAGMENT) {
        returnNode = createDocumentFragment.call(body.ownerDocument);
        while (body.firstChild) {
          // eslint-disable-next-line unicorn/prefer-dom-node-append
          returnNode.appendChild(body.firstChild);
        }
      } else {
        returnNode = body;
      }
      if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
        /*
          AdoptNode() is not used because internal state is not reset
          (e.g. the past names map of a HTMLFormElement), this is safe
          in theory but we would rather not risk another attack vector.
          The state that is cloned by importNode() is explicitly defined
          by the specs.
        */
        returnNode = importNode.call(originalDocument, returnNode, true);
      }
      return returnNode;
    }
    let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
    /* Serialize doctype if allowed */
    if (
      WHOLE_DOCUMENT &&
      ALLOWED_TAGS['!doctype'] &&
      body.ownerDocument &&
      body.ownerDocument.doctype &&
      body.ownerDocument.doctype.name &&
      regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)
    ) {
      serializedHTML = '<!DOCTYPE ' + body.ownerDocument.doctype.name + '>\n' + serializedHTML;
    }
    /* Sanitize final string template-safe */
    if (SAFE_FOR_TEMPLATES) {
      arrayForEach([MUSTACHE_EXPR$1, ERB_EXPR$1, TMPLIT_EXPR$1], expr => {
        serializedHTML = stringReplace(serializedHTML, expr, ' ');
      });
    }
    return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
  };
  DOMPurify.setConfig = function () {
    let cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _parseConfig(cfg);
    SET_CONFIG = true;
  };
  DOMPurify.clearConfig = function () {
    CONFIG = null;
    SET_CONFIG = false;
  };
  DOMPurify.isValidAttribute = function (tag, attr, value) {
    /* Initialize shared config vars if necessary. */
    if (!CONFIG) {
      _parseConfig({});
    }
    const lcTag = transformCaseFunc(tag);
    const lcName = transformCaseFunc(attr);
    return _isValidAttribute(lcTag, lcName, value);
  };
  DOMPurify.addHook = function (entryPoint, hookFunction) {
    if (typeof hookFunction !== 'function') {
      return;
    }
    arrayPush(hooks[entryPoint], hookFunction);
  };
  DOMPurify.removeHook = function (entryPoint, hookFunction) {
    if (hookFunction !== undefined) {
      const index = arrayLastIndexOf(hooks[entryPoint], hookFunction);
      return index === -1 ? undefined : arraySplice(hooks[entryPoint], index, 1)[0];
    }
    return arrayPop(hooks[entryPoint]);
  };
  DOMPurify.removeHooks = function (entryPoint) {
    hooks[entryPoint] = [];
  };
  DOMPurify.removeAllHooks = function () {
    hooks = _createHooksMap();
  };
  return DOMPurify;
}
var purify = createDOMPurify();

/**
 * Versão standalone (vanilla) do `PoUserGuide`, distribuída via CDN no pacote `@po-ui/user-guide`.
 *
 * A classe expõe uma API encadeável e mínima para criação de tours guiados, sem dependência de
 * Angular. Internamente usa `driver.js` (embutido no bundle) para a renderização do popover e
 * `DOMPurify` (também embutido) para sanitização de conteúdo HTML.
 *
 * @example
 * ```html
 * <script src="https://cdn.jsdelivr.net/npm/@po-ui/user-guide@latest/dist/po-user-guide.iife.js"></script>
 * <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@po-ui/user-guide@latest/dist/po-user-guide.css" />
 * <script>
 *   PoUserGuide.create()
 *     .setSteps([{ element: '#hello', title: 'Olá', content: 'Bem-vindo!' }])
 *     .start();
 * </script>
 * ```
 */
class PoUserGuide {
  constructor() {
    Object.defineProperty(this, 'steps', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: []
    });
    Object.defineProperty(this, 'options', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: {}
    });
    Object.defineProperty(this, 'driverInstance', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: null
    });
    Object.defineProperty(this, 'currentIndex', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: -1
    });
    Object.defineProperty(this, 'pendingEndReason', {
      enumerable: true,
      configurable: true,
      writable: true,
      value: null
    });
  }
  /** Cria uma nova instância do `PoUserGuide`. */
  static create() {
    return new PoUserGuide();
  }
  /** Configura a lista de passos do tour. */
  setSteps(steps) {
    this.validateSteps(steps);
    this.steps = [...steps];
    return this;
  }
  /** Configura as opções globais do tour. */
  setOptions(options) {
    this.options = this.resolveOptions(options);
    return this;
  }
  /**
   * Inicia o tour a partir do passo informado em `startIndex` (padrão `0`).
   *
   * Se um tour já estiver em execução, ele é encerrado antes do novo iniciar.
   *
   * @throws Erro se a lista de passos não tiver sido configurada ou `startIndex` for inválido.
   */
  start(startIndex = 0) {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    if (!Array.isArray(this.steps) || this.steps.length === 0) {
      throw new Error('PoUserGuide: a lista de passos não foi configurada. Chame setSteps() antes de start().');
    }
    if (
      typeof startIndex !== 'number' ||
      !Number.isInteger(startIndex) ||
      startIndex < 0 ||
      startIndex >= this.steps.length
    ) {
      throw new Error(`PoUserGuide: startIndex (${startIndex}) está fora do intervalo [0, ${this.steps.length - 1}].`);
    }
    if (this.driverInstance !== null) {
      this.close();
    }
    if (Object.keys(this.options).length === 0) {
      this.options = this.resolveOptions();
    }
    this.injectStyles();
    const config = this.buildDriverConfig();
    this.driverInstance = Ae(config);
    if (typeof this.options.onTourStart === 'function') {
      const event = {
        totalSteps: this.steps.length,
        startIndex,
        timestamp: Date.now()
      };
      this.options.onTourStart(event);
    }
    this.driverInstance.drive(startIndex);
  }
  /** Avança para o próximo passo. */
  next() {
    if (this.driverInstance === null) {
      return;
    }
    if (this.currentIndex === this.steps.length - 1) {
      this.pendingEndReason = 'completed';
      this.driverInstance.destroy();
      return;
    }
    this.driverInstance.moveNext();
  }
  /** Retrocede para o passo anterior. */
  previous() {
    if (this.driverInstance === null || this.currentIndex <= 0) {
      return;
    }
    this.driverInstance.movePrevious();
  }
  /** Move o tour para o passo identificado por `index`. */
  goTo(index) {
    if (typeof index !== 'number' || !Number.isInteger(index) || index < 0 || index >= this.steps.length) {
      throw new Error(`PoUserGuide: goTo(${index}) está fora do intervalo [0, ${this.steps.length - 1}].`);
    }
    if (this.driverInstance === null) {
      this.start(index);
      return;
    }
    this.driverInstance.moveTo(index);
  }
  /** Encerra o tour em execução. */
  close() {
    if (this.driverInstance === null) {
      return;
    }
    this.pendingEndReason = this.pendingEndReason ?? 'closed';
    this.driverInstance.destroy();
  }
  /** Indica se há um tour em execução. */
  isActive() {
    return this.driverInstance !== null && this.currentIndex >= 0;
  }
  /** Retorna o passo ativo, ou `null` se não houver tour em execução. */
  getCurrentStep() {
    return this.isActive() ? this.steps[this.currentIndex] : null;
  }
  /** Retorna o índice do passo ativo, ou `-1` se não houver tour em execução. */
  getCurrentIndex() {
    return this.isActive() ? this.currentIndex : -1;
  }
  // -------------------------------------------------------------------------
  // Internos
  // -------------------------------------------------------------------------
  validateSteps(steps) {
    if (steps === null || steps === undefined) {
      throw new Error('PoUserGuide: a lista de passos é obrigatória.');
    }
    if (!Array.isArray(steps)) {
      throw new Error('PoUserGuide: a lista de passos deve ser um array.');
    }
    if (steps.length === 0) {
      throw new Error('PoUserGuide: a lista de passos não pode ser vazia.');
    }
    const isBrowser = typeof document !== 'undefined';
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (step === null || step === undefined || typeof step !== 'object') {
        throw new Error(`PoUserGuide: passo no índice ${i} é inválido.`);
      }
      if (step.content === null || step.content === undefined || step.content.trim() === '') {
        throw new Error(`PoUserGuide: o passo no índice ${i} precisa ter a propriedade 'content' definida.`);
      }
      if (typeof step.element === 'string' && isBrowser) {
        try {
          document.querySelector(step.element);
        } catch {
          throw new Error(`PoUserGuide: seletor CSS inválido no passo no índice ${i}: "${step.element}".`);
        }
      }
    }
  }
  resolveOptions(options) {
    const defaults = {
      allowClose: true,
      allowScroll: false,
      showProgress: true,
      keyboardControl: true,
      overlayOpacity: 0.7,
      nextLabel: 'Próximo',
      previousLabel: 'Anterior',
      doneLabel: 'Finalizar',
      closeLabel: 'Fechar',
      progressTemplate: '{{current}} de {{total}}'
    };
    const resolved = { ...defaults, ...(options ?? {}) };
    if (typeof resolved.overlayOpacity !== 'number' || !Number.isFinite(resolved.overlayOpacity)) {
      resolved.overlayOpacity = defaults.overlayOpacity;
    } else {
      resolved.overlayOpacity = Math.min(1, Math.max(0, resolved.overlayOpacity));
    }
    return resolved;
  }
  sanitize(value) {
    if (typeof value !== 'string') {
      return value;
    }
    return purify.sanitize(value, { USE_PROFILES: { html: true } });
  }
  injectStyles() {
    if (typeof document === 'undefined') {
      return;
    }
    const existing = document.head.querySelector(`style[${PoUserGuide.STYLES_FLAG}="true"]`);
    if (existing !== null) {
      return;
    }
    const style = document.createElement('style');
    style.setAttribute(PoUserGuide.STYLES_FLAG, 'true');
    style.textContent = `.po-user-guide-popover { font-family: var(--font-family-theme, system-ui, -apple-system, sans-serif); }`;
    document.head.appendChild(style);
  }
  buildDriverConfig() {
    const opts = this.options;
    return {
      steps: this.mapSteps(),
      allowClose: opts.allowClose,
      showProgress: opts.showProgress,
      allowKeyboardControl: opts.keyboardControl,
      overlayOpacity: opts.overlayOpacity,
      overlayColor: 'var(--color-po-user-guide-overlay, rgb(0, 0, 0))',
      nextBtnText: this.sanitize(opts.nextLabel),
      prevBtnText: this.sanitize(opts.previousLabel),
      doneBtnText: this.sanitize(opts.doneLabel),
      progressText: this.sanitize(opts.progressTemplate),
      popoverClass: ['po-user-guide-popover', opts.popoverClass].filter(Boolean).join(' '),
      stagePadding: 6,
      onHighlightStarted: (_el, _step, ctx) => this.handleHighlight(ctx),
      onDestroyed: () => this.handleDestroyed(),
      onCloseClick: () => this.handleCloseClick()
    };
  }
  mapSteps() {
    const opts = this.options;
    return this.steps.map((step, index) => ({
      element: step.element,
      popover: {
        title: this.sanitize(step.title),
        description: this.sanitize(step.content),
        side: step.position && step.position !== 'auto' ? step.position : undefined,
        align: step.align ?? undefined,
        nextBtnText: this.sanitize(step.nextLabel ?? opts.nextLabel),
        prevBtnText: this.sanitize(step.previousLabel ?? opts.previousLabel),
        doneBtnText: this.sanitize(step.doneLabel ?? opts.doneLabel),
        popoverClass: ['po-user-guide-popover', opts.popoverClass].filter(Boolean).join(' '),
        showButtons: this.resolveShowButtons(step),
        onPopoverRender: popoverDom => this.renderPopover(popoverDom, step, index)
      }
    }));
  }
  resolveShowButtons(step) {
    const showButtons = step.showButtons;
    if (this.options.allowClose === false && Array.isArray(showButtons)) {
      return showButtons.filter(button => button !== 'close');
    }
    if (this.options.allowClose === false) {
      return ['next', 'previous'];
    }
    return showButtons;
  }
  renderPopover(popoverDom, step, index) {
    if (!popoverDom?.wrapper) {
      return;
    }
    popoverDom.wrapper.setAttribute('role', 'dialog');
    const ariaLabel = typeof step.title === 'string' && step.title.length > 0 ? step.title : step.content.slice(0, 100);
    popoverDom.wrapper.setAttribute('aria-label', ariaLabel);
    const totalSteps = this.steps.length;
    const isLast = index === totalSteps - 1;
    const previousButton = popoverDom.previousButton;
    const nextButton = popoverDom.nextButton;
    const closeButton = popoverDom.closeButton;
    if (previousButton) {
      previousButton.classList.add('po-user-guide-button', 'po-user-guide-button-tertiary');
      previousButton.setAttribute('type', 'button');
    }
    if (nextButton) {
      nextButton.classList.add('po-user-guide-button', 'po-user-guide-button-primary');
      nextButton.setAttribute('type', 'button');
      if (isLast) {
        const doneLabel = step.doneLabel ?? this.options.doneLabel;
        if (typeof doneLabel === 'string' && doneLabel.length > 0) {
          nextButton.textContent = doneLabel;
          nextButton.setAttribute('aria-label', doneLabel);
        }
      }
    }
    if (closeButton) {
      closeButton.classList.add('po-user-guide-button-close');
      closeButton.setAttribute('type', 'button');
      const closeLabel = this.options.closeLabel ?? 'Fechar';
      closeButton.setAttribute('aria-label', closeLabel);
    }
  }
  handleHighlight(ctx) {
    let newIndex = null;
    if (ctx?.state && typeof ctx.state.activeIndex === 'number') {
      newIndex = ctx.state.activeIndex;
    } else if (this.driverInstance && typeof this.driverInstance.getActiveIndex === 'function') {
      try {
        const idx = this.driverInstance.getActiveIndex();
        if (typeof idx === 'number') {
          newIndex = idx;
        }
      } catch {
        /* ignore */
      }
    }
    if (newIndex === null || newIndex < 0 || newIndex >= this.steps.length) {
      return;
    }
    const previousIndex = this.currentIndex;
    let direction;
    if (previousIndex === -1) {
      direction = 'start';
    } else if (newIndex === previousIndex + 1) {
      direction = 'next';
    } else if (newIndex === previousIndex - 1) {
      direction = 'previous';
    } else {
      direction = 'goto';
    }
    this.currentIndex = newIndex;
    if (typeof this.options.onStepChange === 'function') {
      const event = {
        step: this.steps[newIndex],
        index: newIndex,
        direction,
        totalSteps: this.steps.length
      };
      this.options.onStepChange(event);
    }
  }
  handleDestroyed() {
    if (this.driverInstance === null && this.currentIndex === -1) {
      return;
    }
    const reason = this.pendingEndReason ?? 'closed';
    const lastIndex = this.currentIndex >= 0 ? this.currentIndex : 0;
    const totalSteps = this.steps.length;
    this.driverInstance = null;
    this.currentIndex = -1;
    this.pendingEndReason = null;
    if (typeof this.options.onTourEnd === 'function') {
      const event = { reason, lastIndex, totalSteps };
      this.options.onTourEnd(event);
    }
  }
  handleCloseClick() {
    if (this.options.allowClose === false) {
      return;
    }
    this.pendingEndReason = 'closed';
    if (this.driverInstance !== null) {
      this.driverInstance.destroy();
    }
  }
}
Object.defineProperty(PoUserGuide, 'STYLES_FLAG', {
  enumerable: true,
  configurable: true,
  writable: true,
  value: 'data-po-user-guide-styles'
});

export { PoUserGuide };
//# sourceMappingURL=po-user-guide.esm.js.map
