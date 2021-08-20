import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from './services/events.service';
import { NavigationService } from './services/navigation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit{
  title = 'Kektakte';
  public loggedInFlag: boolean = false;

  constructor(private router: Router, private cdRef: ChangeDetectorRef, private eventsService: EventsService,
              private navigationService: NavigationService) { }

  public ngOnInit(): void {
    this.eventsService.changeLogRegButton.subscribe((data) => {
      this.loggedInFlag = data;
      this.cdRef.markForCheck();
    });

    this.loggedInCheck();
    this.authTokenCheck();
    this.cdRef.markForCheck();
  }

  public loggedInCheck(): boolean {
    const temp = localStorage.getItem('userName');
    if (temp != null && temp !== 'none') {
      this.loggedInFlag = true;
      this.cdRef.markForCheck();
      return true;
    }
    else {
      this.loggedInFlag = false;
      this.navigateTo('/account/login');
      this.cdRef.markForCheck();
      return false;
    }
  }

  public authTokenCheck(): void {
    if (localStorage.getItem('authToken') === null) {
      localStorage.setItem('authToken', 'none');
    }
  }

  public navigateTo(address: string): void {
    if (!this.loggedInFlag) {
      this.router.navigate(['/account/login']);
    } else if (typeof address === 'string') {
      this.router.navigate([address]);
    }
  }

  public goToMainPage(): void {
    if (!this.loggedInFlag) {
      return;
    } else {
      const userIdLs: number = +localStorage.getItem('userId');
      this.navigationService.goToUserPage(userIdLs);
      this.scrollUp();
      // this.eventsService.reloadDataEvent.emit();
      this.cdRef.markForCheck();
    }
  }

  public goToIndex(): void {
    const result = this.loggedInCheck();
    if (!result) {
      return;
    } else {
      this.router.navigate(['/']);
    }
  }

  // public goToLogin(): void {
  //   this.router.navigate(['/account/login']);
  // }
  //
  // public goToMessages(): void  {
  //   this.router.navigate(['/messages']);
  // }
  //
  // public goToLogout(): void  {
  //   this.router.navigate(['/logout']);
  // }
  //
  // public goToDialogs(): void {
  //   this.router.navigate(['/dialogs']);
  // }
  //
  // public goToFriends(): void {
  //   this.router.navigate(['/friends']);
  // }
  //
  // public goToHarold(): void {
  //   this.router.navigate(['/harold']);
  // }

  public transitToMainPage(): void {
    setTimeout(() => {
      this.goToMainPage();
    }, 1);
    this.cdRef.markForCheck();

  }

  public scrollUp(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  public scrollDown(): void {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
  }

}
