/* tslint:disable:no-string-literal */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { User } from '../../entities/user';
import { LoginService } from '../../services/login.service';
import { debounceTime, take } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventsService } from '../../services/events.service';
import { HelperService } from '../../services/helper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements OnInit {

    public userNameControl: FormControl;
    public passwordControl: FormControl;
    public loginForm: FormGroup;

    public user: User = new User('', '');
    public receivedUser: User = new User('', '');
    public responseMessage: string = '';
    public responseStatus: boolean = false;

    public done: boolean = false;
    public doneTemp: boolean = false;



  constructor(private loginService: LoginService, private cdRef: ChangeDetectorRef, private ngzone: NgZone,
              private router: Router, private eventsService: EventsService,
              private helperService: HelperService) {
  }

  public ngOnInit(): void {
    this.buildForm();
  }

  private buildForm(): void {
      this.userNameControl = new FormControl('', [Validators.required]);
      this.passwordControl = new FormControl('', [Validators.required]);
      this.loginForm = new FormGroup({
          login: this.userNameControl,
          password: this.passwordControl
      });
      this.loginForm.valueChanges
          .pipe(
              debounceTime(30)
          )
          .subscribe((data) => {
              this.user.userName = data.login;
              this.user.password = data.password;
              this.doneTemp = true;
              this.cdRef.markForCheck();
          });
  }

    public nameFromHeaders(user: User): void {
        this.loginService.tryToLogIn(user)
            .pipe(
                take (1)
            )
            .subscribe((data: any) => {
                    localStorage.setItem('authToken', data['token']);
                    localStorage.setItem('userName', data['userName']);
                    localStorage.setItem('userId', data['id']);
                    this.responseStatus = data['state'];
                    this.responseMessage = data['message'];
                    this.eventsService.changeNameEvent.emit(data['userName']);
                    this.eventsService.changeLogRegButton.emit(true);
                    this.transitToIndex();
                    this.cdRef.markForCheck();
                },
                error => console.log(error)
            );
        setTimeout(() => {
            this.getNameToLC();
        },1000);
    }

    public getNameToLC(): void {
        this.helperService.GetUserName(this.receivedUser)
            .pipe(
                take(1)
            )
            .subscribe((data) => {
                localStorage.setItem('name', data.valueOf());
                console.log(data);
                this.cdRef.markForCheck();
            });
    }

    public transitToIndex(): void {
        let temp = localStorage.getItem('userName');
        if (temp !== null && temp !== 'none') {
            setTimeout(() => {
                this.goToIndex();
            }, 1000);
        }
        this.cdRef.markForCheck();
    }

    public goToRegistration() {
        this.router.navigate(['/account/registration']);
    }

    public goToIndex(){
        this.router.navigate(['/']);
    }

}
