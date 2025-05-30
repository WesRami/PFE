import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent, NavBarComponent] // Déclarer NavBarComponent
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    // Nettoyer localStorage avant chaque test
    localStorage.clear();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should return true for isAuthenticated when accessToken is present', () => {
    localStorage.setItem('accessToken', 'fake-token');
    expect(component.isAuthenticated()).toBeTrue();
  });

  it('should return false for isAuthenticated when accessToken is absent', () => {
    expect(component.isAuthenticated()).toBeFalse();
  });

  it('should render NavBarComponent when authenticated', () => {
    localStorage.setItem('accessToken', 'fake-token');
    fixture.detectChanges();
    const navBarElement = fixture.debugElement.query(By.directive(NavBarComponent));
    expect(navBarElement).toBeTruthy();
  });

  it('should not render NavBarComponent when not authenticated', () => {
    localStorage.removeItem('accessToken');
    fixture.detectChanges();
    const navBarElement = fixture.debugElement.query(By.directive(NavBarComponent));
    expect(navBarElement).toBeNull();
  });
});