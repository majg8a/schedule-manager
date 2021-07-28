import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketService } from './services/socket.service';
import * as moment from 'moment';
import { map, tap } from 'rxjs/Operators';
@Component({
  selector: 'app-root',
  template: `
    <ng-container
      *ngIf="{ currentSchedule: currentSchedule$ | async } as state"
    >
      <div class="container">
        <div
          *ngFor="let schedule of state.currentSchedule; index as i"
          [ngClass]="[
            'item',
            'green',
            schedule.motos.length < 8 ? 'selected' : 'meh',
            schedule.motos.length === 0 ? 'red' : 'meh',

            lastclicked === i ? 'lastclicked' : 'meh'
          ]"
          (click)="handleSchedulePicking(i)"
        >
          <p><span>horario: </span> {{ schedule.time }}</p>
          <p>
            <span>motos: </span>
            {{ schedule.motos.length }}
          </p>
        </div>
      </div>
    </ng-container>
  `,
  styles: [
    `
      .lastclicked {
        border: black solid 2px;
      }

      .container {
        display: grid;
        grid-row-gap: 16px;
        grid-column-gap: 16px;
        justify-content: start;
        width: 100%;
        grid-auto-flow: column;
        grid-template-rows: repeat(5, 1fr);
        grid-template-columns: repeat(5, 1fr);

      }

      .item {
        padding: 8px;
        cursor: pointer;
      }

      .green {
        background-color: green;
      }

      .selected {
        background-color: blue;
      }

      .red {
        background-color: red;
      }
    `,
  ],
})
export class AppComponent {
  selected = false;

  lastclicked: any = null;

  currentSchedule$: Observable<any[]> = this.socketService
    .fromEvent('schedule')
    .pipe(
      tap((result) => console.log(result)),
      map((schedules: any) =>
        schedules.map((schedule: any) => ({
          ...schedule,
          time: moment.utc(schedule?.time).format('HH:mm:ss'),
          motos: schedule.motos.filter((moto: any) => !moto),
        }))
      )
    );

  constructor(private socketService: SocketService) {
    this.socketService.sendMessage(null);
  }

  handleSchedulePicking(id: number) {
    console.log(id);
    this.lastclicked = id;
    this.socketService.sendMessage({ id });
  }
}
