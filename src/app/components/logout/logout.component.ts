import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoutComponent implements OnInit {



  constructor(private router: Router, private cdRef: ChangeDetectorRef, private ngzone: NgZone, private eventsService: EventsService) {
  }

  ngOnInit(): void {
  }

  public logout(): void {
    localStorage.setItem('authToken', 'none');
    localStorage.removeItem('userName');
    localStorage.removeItem('name');
    localStorage.removeItem('userId');
    this.eventsService.changeNameEvent.emit('Гость');
    this.eventsService.changeLogRegButton.emit(false);
    setTimeout(() => {
      // this.goToIndex();
      this.router.navigate(['/account/login']);
    }, 1000);
    this.cdRef.markForCheck();

  }

  public goToIndex(){
    this.router.navigate(['/']);
    this.cdRef.markForCheck();
  }

}
