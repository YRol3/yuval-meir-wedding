import { Component } from '@angular/core';
import { AppViewService } from '../../../app-view.service';
import { InviteContextService } from '../../../invite-context.service';

type AttendanceOption = 'approved' | 'rejected' | 'maybe';

@Component({
  selector: 'app-rsvp-section',
  standalone: false,
  templateUrl: './rsvp-section.component.html',
  styleUrl: './rsvp-section.component.css'
})
export class RsvpSectionComponent {
  attendance: AttendanceOption | null;
  guestsCount: string;
  blessingNote: string;

  readonly attendanceOptions: AttendanceOption[] = ['approved', 'rejected', 'maybe'];

  constructor(
    inviteContext: InviteContextService,
    private readonly appView: AppViewService
  ) {
    const invite = inviteContext.data;

    this.attendance = this.normalizeAttendance(invite?.will_arrive);
    this.guestsCount = invite?.how_many ?? '';
    this.blessingNote = invite?.note ?? '';
  }

  submit(): void {
    this.appView.showThanks();
  }

  private normalizeAttendance(value: string | undefined): AttendanceOption | null {
    if (value === 'approved' || value === 'rejected' || value === 'maybe') {
      return value;
    }

    return null;
  }
}
