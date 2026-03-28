import { Pipe, PipeTransform } from '@angular/core';
import { MarkdownService } from 'ngx-markdown';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'markdown',
  standalone: false
})
export class MarkdownPipe implements PipeTransform {

  constructor(
    private markdownService: MarkdownService,
    private sanitizer: DomSanitizer
  ) {}

  transform(value: string): SafeHtml {
    if (!value) {
      return '';
    }
    const html = this.markdownService.parse(value, { decodeHtml: false });
    return this.sanitizer.bypassSecurityTrustHtml(html as string);
  }
}
