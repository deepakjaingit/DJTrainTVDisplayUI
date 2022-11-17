import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { take } from 'rxjs/operators';
import { Column, HeaderSetting, ResponseModel } from './responsemodel';
import { Footer, Train, TrainStatusModel } from './trainsmodel';
import { CommonModule, DatePipe } from '@angular/common';
import {
  trigger,
  transition,
  style,
  animate,
  query,
  stagger,
  state,
  keyframes
} from "@angular/animations";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DatePipe],
  animations: [
    trigger("listAnimation", [
      transition("* => *", [
        // each time the binding value changes
        query(
          ":leave",
          [stagger(100, [animate("0.5s", style({ opacity: 0 }))])],
          { optional: true }
        ),
        query(
          ":enter",
          [
            style({ opacity: 0 }),
            stagger(100, [animate("0.5s", style({ opacity: 1 }))])
          ],
          { optional: true }
        )
      ])
    ]),
    trigger("enterAnimation", [
      transition(":enter", [
        style({ transform: "translateX(100%)", opacity: 0 }),
        animate(
          "500ms",
          style({
            transform: "translateX(0)",
            opacity: 1,
            "overflow-x": "hidden"
          })
        )
      ]),
      transition(":leave", [
        style({ transform: "translateX(0)", opacity: 1 }),
        animate("500ms", style({ transform: "translateX(100%)", opacity: 0 }))
      ])
    ]),
    trigger("slideIn", [
      state("*", style({ "overflow-y": "hidden" })),
      state("void", style({ "overflow-y": "hidden" })),
      transition("* => void", [
        style({ height: "*" }),
        animate(250, style({ height: 0 }))
      ]),
      transition("void => *", [
        style({ height: "0" }),
        animate(250, style({ height: "*" }))
      ])
    ])
  ]
})
export class AppComponent implements OnInit {
  title = 'DJTrainTVDisplay';
  tableBodyColor = '#fff'
  config: ResponseModel | undefined;
  trainsDetail: TrainStatusModel | undefined;
  currentLang = 'en';


  header: HeaderSetting | undefined;
  columns: Column[] | any;
  trains: Train[] | any;
  footers: Footer[] | undefined;
  public now: string = '';
  timerInterval: any;
  syncInterval: any;

  constructor(private http: HttpClient, private datePipe: DatePipe) {
    this.onConfigSuccess = this.onConfigSuccess.bind(this);
    this.onTrainsSuccess = this.onTrainsSuccess.bind(this);

  }
  ngOnInit(): void {
    this.GetConfig(this.onConfigSuccess, this.onConfigError);
    this.GetTrains(this.onTrainsSuccess, this.onTrainError);

    this.timerInterval = setInterval(() => {
      const time: string | any = this.datePipe.transform(new Date(), 'HH:mm:ss')
      this.now = time;
    }, 1);


    this.timerInterval = setInterval(() => {
      this.currentLang = (this.currentLang == 'hi') ? 'en' : 'hi';
      this.updateLanguageData();
    }, 5000);


  }



  GetConfig(successEmit: (result: any) => void, FailEmit: (result: any) => void) {
    const httpOptions = {
      headers: new HttpHeaders({
        'USER_DEVICE_WIDTH': window.screen.availWidth.toString()
      })
    }
    const url = 'https://localhost:44328/request/config';
    const request = this.http.get(url, httpOptions)
      .pipe(take(1)).subscribe(
        {
          next: (v) => successEmit(v as any as ResponseModel),
          error: (e) => FailEmit(e),
          complete: () => { request.unsubscribe() }
        }
      );
  }

  GetTrains(successEmit: (result: any) => void, FailEmit: (result: any) => void) {
    const httpOptions = {
      headers: new HttpHeaders({
        'USER_DEVICE_WIDTH': window.screen.availWidth.toString()
      })
    }
    const url = 'https://localhost:44328/request/trains';
    const request = this.http.get(url, httpOptions)
      .pipe(take(1)).subscribe(
        {
          next: (v) => successEmit(v as any as TrainStatusModel),
          error: (e) => FailEmit(e),
          complete: () => { request.unsubscribe() }
        }
      );
  }

  onConfigSuccess(result: ResponseModel) {
    this.config = result;
    this.updateLanguageData()
  }
  onConfigError(result: any) {

  }
  onTrainsSuccess(result: any) {
    this.trainsDetail = result;
    this.updateLanguageData();
  }
  onTrainError(result: any) {

  }

  updateLanguageData() {
    if (this.config) {
      this.header = this.config.HeaderSettings.find((row: HeaderSetting) =>
        row.Lang == this.currentLang
      );
      if (!this.header) {
        this.header = this.config.HeaderSettings.find((row: HeaderSetting) =>
          row.Lang == ''
        );
      }


      this.columns = this.config.Columns.filter((row: Column) =>
        row.Lang == this.currentLang
      );
      if (this.columns.length <= 0) {
        this.columns = this.config.Columns.filter((row: Column) =>
          row.Lang == ''
        );
      }
    }

    if (this.trainsDetail) {
      this.trains = this.trainsDetail.Trains.filter((row: Train) =>
        row.LANG == this.currentLang
      );
      this.footers = this.trainsDetail.Footer.filter((row: Footer) =>
        row.LANG == this.currentLang
      );

      //       if (this.trains.length == 2) {
      // this.trains.push()
      // this.trains.push()
      // this.trains.push()
      // this.trains.push()
      //       }

    }



  }

  changeLang(lang: string) {
    this.currentLang = lang;
    this.updateLanguageData()
  }
}
