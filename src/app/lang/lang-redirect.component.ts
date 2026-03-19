import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

@Component({ template: '' })
export class LangRedirectComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const AVAILABLE_LANGS = ['en', 'pl', 'uk'];
    const saved = localStorage.getItem('preferredLang');
    const lang = saved && AVAILABLE_LANGS.includes(saved) ? saved : 'en';

    // Берём текущий путь без языка и редиректим с языком
    const currentPath = this.router.url.replace(/^\/[a-z]{2}\//, '/').replace(/^\//, '');
    
    this.router.navigate([`/${lang}/${currentPath}`]);
  }
}