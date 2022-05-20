import {Component, Input, OnInit} from '@angular/core';
import {Lesson, Schedule} from "../../../../../models";
import {ScheduleService} from "../../../../../services/shared/schedule.service";
import {AddSubjectDialogComponent} from "../../add-subject-dialog/add-subject-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-edit-scdedule',
  templateUrl: './edit-schedule.component.html',
  styleUrls: ['./edit-schedule.component.scss']
})
export class EditScheduleComponent implements OnInit {

  @Input() set schedule(schedule: Schedule){
    let lessons: Lesson[] = []

    schedule.lessons.forEach(lesson => {
      let add = true

      lessons.forEach(templateSubject => {
        if (templateSubject.subject == lesson.subject
          && templateSubject.group == lesson.group
          && templateSubject.room == lesson.room
          && templateSubject.teacher == lesson.teacher)
          add = false;
      })
      if (!add || lesson.type != "STAY") return

      lessons.push(lesson)
    })

    this.templateLessons = lessons
  }

  templateLessons: Lesson[] = []
  templatesFilter: string = ""

  constructor(public dialog: MatDialog, private scheduleService: ScheduleService) {
  }

  ngOnInit(): void {
  }

  filter(input: string, lesson: Lesson): boolean {
    input = input.toLowerCase()

    return lesson.subject.toLowerCase().includes(input)
      || lesson.group.toLowerCase().includes(input)
      || lesson.teacher.toLowerCase().includes(input)
      || lesson.room.toLowerCase().includes(input)
  }

  add(lesson: Lesson | undefined = undefined) {
    const dialogRef = this.dialog.open(AddSubjectDialogComponent, {data: lesson})
    dialogRef.afterClosed().subscribe((lesson: Lesson) => this.scheduleService.addLesson(lesson))
  }

  confirmEdit() {
    this.scheduleService.confirmEdit()
  }
}
