import {Component} from '@angular/core';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav-util',
  templateUrl: './sidenav-util.component.html',
  styleUrls: ['./sidenav-util.component.scss']
})
export class SidenavUtilComponent {

  isSideNavCollapsed = false;
  screenWidth = 0;


  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }
}
