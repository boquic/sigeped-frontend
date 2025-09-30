import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, Output, EventEmitter } from '@angular/core'; // Añade Output y EventEmitter


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Output() toggleEvent = new EventEmitter<boolean>(); // <-- Añade esta línea
  isCollapsed = false;

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.toggleEvent.emit(this.isCollapsed); // <-- Añade esta línea
  }
}