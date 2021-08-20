import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { PictureService } from '../../services/picture.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FriendsComponent implements OnInit {

  public friendsRequestsToggle: boolean = false;

  constructor(private cdRef: ChangeDetectorRef,
              private ngZone: NgZone, private router: Router, private navigationService: NavigationService,
              private pictureService: PictureService, private activatedRoute: ActivatedRoute,
              private userService: UserService) { }

  ngOnInit(): void {
  }

  public friendsReqToggle(): void {
    this.friendsRequestsToggle = !this.friendsRequestsToggle;
    this.cdRef.markForCheck();
  }

}
