/**
 * Copia texto para a área de transferência.
 *
 * Usa `navigator.clipboard` quando existe (HTTPS ou localhost e com permissão). Sem ele (HTTP comum,
 * navegador antigo, permissão negada) cai no `textarea` + `execCommand('copy')`, que ainda funciona dentro
 * de um clique do usuário.
 * @returns `true` se copiou
 */
export async function copyText(text: string, doc: Document = document): Promise<boolean> {
  const clipboard = doc.defaultView?.navigator?.clipboard;

  if (clipboard?.writeText) {
    try {
      await clipboard.writeText(text);

      return true;
    } catch {
      // segue para o fallback (permissão negada, documento sem foco...)
    }
  }

  return legacyCopy(text, doc);
}

function legacyCopy(text: string, doc: Document): boolean {
  const area = doc.createElement('textarea');
  const active = doc.activeElement as HTMLElement | null;

  area.value = text;
  area.setAttribute('readonly', '');
  // fora da tela e sem rolar a página
  area.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0';
  doc.body.appendChild(area);
  area.focus({ preventScroll: true });
  area.select();

  let copied = false;

  try {
    copied = doc.execCommand('copy');
  } catch {
    copied = false;
  }

  area.remove();
  active?.focus?.({ preventScroll: true });

  return copied;
}
