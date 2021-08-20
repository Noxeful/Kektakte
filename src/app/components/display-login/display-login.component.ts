import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgZone,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-display-login',
  templateUrl: './display-login.component.html',
  styleUrls: ['./display-login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class DisplayLoginComponent implements OnInit {

  public name: string = '';
  public loggedInFlag2 = false;
  public li = false;

  constructor(private cdRef: ChangeDetectorRef, private ngzone: NgZone, private eventsService: EventsService) {

  }

  ngOnInit(): void {
    this.eventsService.changeNameEvent.subscribe((data) => {
      this.name = data;
      this.cdRef.markForCheck();

    });

    this.checkName();
    this.cdRef.markForCheck();
  }

  public checkName(): void {
    let temp = localStorage.getItem('userName');
    if (temp !== null && temp !== 'none') {
      this.loggedInFlag2 = true;
      this.name = temp;
    } else {
      this.loggedInFlag2 = false;
      this.name = 'Гость';
    }
  }

}
