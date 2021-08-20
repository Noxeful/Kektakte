import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef, NgZone } from '@angular/core';
import { MessagesService } from '../../services/messages.service';
import { MessageDTO } from '../../entities/messageDTO';
import { User } from '../../entities/user';
import { take } from 'rxjs/operators';
import { LoginService } from '../../services/login.service';
import { CreateMessageDto } from '../../entities/createMessageDto';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { PictureService } from '../../services/picture.service';
import { UserService } from '../../services/user.service';
import { WallService } from '../../services/wall.service';
import { WallPost } from '../../entities/wallPost';

@Component({
    selector: 'app-harold',
    templateUrl: 'harold.component.html',
    styleUrls: ['harold.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class HaroldComponent implements OnInit {

    public user: User = new User('', '');
    public messageDTO: MessageDTO = new MessageDTO(1, 1);
    public createMessageDto: CreateMessageDto = new CreateMessageDto(2, 'kekCreated');

    public tempBase64: string;
    public base64ForAvatar: string = '';
    public userIdParams: number;

    public wallPostCollection: WallPost[];


    constructor(private messagesService: MessagesService, private cdRef: ChangeDetectorRef,
                private ngZone: NgZone, private loginService: LoginService,
                private router: Router, private navigationService: NavigationService,
                private pictureService: PictureService, private activatedRoute: ActivatedRoute,
                private userService: UserService, private wallService: WallService) {
    }

    public ngOnInit(): void {
        this.activatedRoute.paramMap
            .subscribe( params => {
                let data1 = params.get('id');
                let data: number = +data1.replace(':', '');
                this.userIdParams = data;
                this.cdRef.markForCheck();
            });
        this.cdRef.markForCheck();


        this.getAvatarAsBase64(this.userIdParams);
    }

    public wallThing(num: number): void {
        this.wallService.getAllWallPostsById(num).subscribe((data) => {
            this.wallPostCollection = data;
            console.log(data);
            this.cdRef.markForCheck();
        }, error => console.log(error)
        );

    }

    public getBase64FromImage(): void {
        const picInp: any = document.getElementById('image-input');
        let reader = new FileReader();
        reader.onload = ((e) => {
            let temptemp = btoa(e.target.result.toString());
            this.tempBase64 = temptemp;
            this.cdRef.markForCheck();
            console.log(temptemp);
        });
        reader.readAsBinaryString(picInp.files.item(0));
    }

    public getAvatarAsBase64(id: number): void {
        this.pictureService.getAvatar(id)
            .pipe(
                take(1)
            )
            .subscribe((data) => {
                this.base64ForAvatar = data;
                this.cdRef.markForCheck();
            },
                error => console.log(error)
            );
    }

    public saveAvatar(base64str: string): void {
        this.pictureService.tryToCreateAvatar(base64str)
            .pipe(
                take(1)
            )
            .subscribe((data) => {
               console.log(data);
               setTimeout(() => {
                   this.getAvatarAsBase64(this.userIdParams);
                   this.cdRef.markForCheck();
               });
            },
                error => console.log(error)
            );
    }

    public kekCheck(user: User): void {
        this.loginService.jsonPlease(user)
            .pipe(
                take(1)
            )
            .subscribe((data) => {
                    console.log(data);
                    this.user.userName = data['userName'];
                    this.user.password = data['password'];
                    this.cdRef.markForCheck();
                },
                error => console.log(error)
            );
    }

    // public kekCreateAvatar(user: User): void {
    //     this.pictureService.tryToCreateAvatar(user)
    //         .pipe(
    //             take(1)
    //         )
    //         .subscribe((data) => {
    //             console.log(data);
    //         },
    //             error => console.log(error)
    //         );
    // }


    public kekCheck2(messDTO: MessageDTO): void {
        this.messagesService.GetDialogs(messDTO)
            .pipe(
                take(1)
            )
            .subscribe((data) => {
                console.log(data);
            },
                error => console.log(error)
            );
    }

    public kekCreate(messageCreateDto: CreateMessageDto): void {
        this.messagesService.CreateMessage(messageCreateDto)
            .subscribe((data) => {
                console.log(data.message);
            },
                    error => console.log(error, 'ошибочка')
            );
    }

    public kekDelete(id: number): void {
        this.messagesService.DeleteMessage(id)
            .pipe(
                take(1)
            )
            .subscribe((data) => {
                    console.log(data.message);
                    this.cdRef.markForCheck();
                },
                error => console.log(error, 'ошибочка')
            );
    }

    public goToMainPage(): void {
        const userIdLs: number = +localStorage.getItem('userId');
        this.navigationService.goToUserPage(userIdLs);
    }

    public testGetAllFriendsRequests(userId: number): void {
        this.userService.getAllFriendsRequests(userId)
            .subscribe((data) => {
                console.log(data);
                this.cdRef.markForCheck();
            });
    }

    public wierdCalculations(): void {
        let x: number;
        let y: number;
        for (x = 20000; x < 100001; x += 1){
            for (y = 1; y < 21; y += 1){
                if (x / 40 * y === 1500){
                   console.log('eto X' + ' ' + x + ' ' + ', eto Y' + ' ' + y);
                }
            }
        }

        let x1: number;
        let y1: number;
        for (x1 = 20000; x1 < 60000; x1 += 1){
            for (y1 = 1; y1 < 21; y1 += 1){
                if (x1 / 40 * y1 === 1300){
                    console.log('eto X1' + ' ' + x1 + ' ' + ', eto Y1' + ' ' + y1);
                }
            }
        }

        let x2: number;
        let y2: number;
        for (x2 = 20000; x2 < 52000; x2 += 1){
            for (y2 = 1; y2 < 21; y2 += 1){
                if (x2 / 40 * y2 === 1200){
                    console.log('eto X2' + ' ' + x2 + ' ' + ', eto Y2' + ' ' + y2);
                }
            }
        }
    }

    public wierdCalculations2(): void {
        let x1: number;
        let y1: number;
        let x2: number;
        let y2: number;
        let x3: number;
        let y3: number;

        for (x1 = 20000; x1 < 100001; x1 += 1){
            for (y1 = 1; y1 < 21; y1 += 1){
                if (x1 / 40 * y1 === 1500){
                    for (x2 = 20000; x2 < x1; x2 += 1){
                        for (y2 = 1; y2 < 21; y2 += 1){
                            if (x2 / 40 * y2 === 1300.05){
                                for (x3 = 20000; x3 < x2; x3 += 1){
                                    for (y3 = 1; y3 < 21; y3 += 1){
                                        if ( x3 / 40 * y3 === 1200){
                                            console.log('X1 =' + x1  + ' ' + 'Y1 =' + y1 + '___' + ' ' + 'X2 =' + x2 + ' ' + 'Y2 =' + y2 + '___' + ' ' + 'X3 =' + x3 + ' ' + 'Y3 =' + y3);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    public wierdCalculations3(): void {
        let x1: number;
        let y1: number;
        let x2: number;
        let y2: number;

        for (x1 = 16000; x1 < 100001; x1 += 1){
            for (y1 = 1; y1 < 21; y1 += 1){
                if (x1 / 40 * y1 === 750){
                    for (x2 = 16000; x2 < x1; x2 += 1){
                        for (y2 = 1; y2 < 21; y2 += 1){
                            if (x2 / 40 * y2 === 675){
                                console.log('X1 =' + x1  + ' ' + 'Y1 =' + y1 + '___' + ' ' + 'X2 =' + x2 + ' ' + 'Y2 =' + y2);
                            }
                        }
                    }
                }
            }
        }
    }



}
