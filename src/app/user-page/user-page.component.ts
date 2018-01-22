import { Component, OnInit } from '@angular/core';
import { GroupItemComponent } from '../group-item/group-item.component';
import { Router } from '@angular/router';

// models
import { Group } from './../_models/group';
import { Message } from './../_models/message';
import { User } from './../_models/user';

// services
import { SocketService } from './../_services/socket.service';
import { AuthenticationService } from './../_services/users.service';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit {

  users: User[];
  groups: Group[];
  messages: Message[];

  constructor(private authenticationService: AuthenticationService,
              private socketService: SocketService,
              private router: Router) { }

  ngOnInit() {
    this.socketService.initSocket();

    this.socketService.onSuccsess()
      .subscribe((data: any) => {
        this.groups.push(data.groups);
        this.users.push(data.users);
        this.messages.push(data.messages);
      });
  }

  public onOpenGroup(selected: Group): void {
    this.router.navigate(['chat', selected.id]);
  }

  public onLeaveGroup(selected: Group): void {
    this.socketService.leaveGroup(selected);
  }

  public logoutButton(): void {
    this.socketService.disconnect();
    this.authenticationService.logout();
    this.router.navigate(['login']);
  }
}
