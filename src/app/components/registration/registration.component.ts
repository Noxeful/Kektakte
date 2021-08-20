import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, NgZone } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../entities/user';
import { RegistrationService } from '../../services/registration.service';
import { debounceTime, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CreateMessageDto } from '../../entities/createMessageDto';
import { MessagesService } from '../../services/messages.service';

@Component({
    selector: 'app-registration',
    templateUrl: 'registration.component.html',
    styleUrls: ['registration.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class RegistrationComponent implements OnInit {

  public userNameControl: FormControl;
  public passwordControl: FormControl;
  public registrationForm: FormGroup;

  public user: User = new User('', '');
  public receivedUser: User = new User('', '');
  public responseMessage: string = '';
  public responseStatus: boolean = false;

  public done: boolean = false;
  public doneTemp: boolean = false;

  constructor(private cdRef: ChangeDetectorRef, private registrationService: RegistrationService, ngzone: NgZone, private router: Router,
              private messagesService: MessagesService) {
    }

  public ngOnInit(): void {
      this.buildForm();
  }

    private buildForm(): void {
        this.userNameControl = new FormControl('', [Validators.required]);
        this.passwordControl = new FormControl('', [Validators.required]);
        this.registrationForm = new FormGroup({
            login: this.userNameControl,
            password: this.passwordControl
        });
        this.registrationForm.valueChanges
            .pipe(
                debounceTime(30)
            )
            .subscribe((data) => {
                this.user.userName = data.login;
                this.user.password = data.password;
                this.done = true;
                this.cdRef.markForCheck();
            });
    }

    public registerUser(user: User): void {
        this.registrationService.tryToRegisterUser(user)
            .pipe(
                take(1)
            )
            .subscribe((data: any) => {
                this.responseMessage = data.message;
                this.responseStatus = data.state;
                    setTimeout(() => {
                        this.goToIndex();
                    }, 3000);
                this.cdRef.markForCheck();
            },
                error => console.log(error));
    }

    public goToIndex(){
        this.router.navigate(['/']);
        this.cdRef.markForCheck();
    }

    public sendStarterMessage(destId: number): void {
        this.messagesService.CreateMessage(new CreateMessageDto(destId, 'Здесь вы можете оставлять заметки самому себе'))
            .subscribe((data) => {
                    this.cdRef.markForCheck();
                },
                error => console.log(error, 'ошибочка')
            );
    }

}
