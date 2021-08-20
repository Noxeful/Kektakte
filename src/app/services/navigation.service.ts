import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(private router: Router) { }

  public goToUserPage(id: number) {
    this.router.navigate([`/user/:${id}/`]);
  }

  public goToDialogs(): void {
    this.router.navigate([`/dialogs`]);
  }

}
