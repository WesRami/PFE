import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isLoginRoute: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Subscribe to router events to detect route changes
    this.router.events
      .pipe(
        filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
      )
      .subscribe((event: NavigationEnd) => {
        // Check if the current route is '/login'
        this.isLoginRoute = event.urlAfterRedirects === '/login';
      });
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }
}