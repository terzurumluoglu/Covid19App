import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { environment } from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DatePipe]
})
export class AppComponent implements OnInit {

  path: string = 'https://covid-19-data.p.rapidapi.com/';
  countries: any[];
  response: any;
  virusForm: FormGroup;
  isSubmitted: boolean = false;
  selectedDate: string;
  today : string;
  constructor(private http: HttpClient, private fb: FormBuilder, private datePipe: DatePipe) { }

  ngOnInit() {
    var dateObj = new Date();
    this.today = this.datePipe.transform(dateObj, 'yyyy-MM-dd');
    this.createForm();
    this.getCountries();
  }

  get f() { return this.virusForm.controls }

  async submit() {
    const date: string = this.f.date.value;
    const sDate: string[] = date.split('-');
    this.selectedDate = sDate[2] + '/' + sDate[1];
    const code: string = this.f.country.value;
    await this.getDailyReportByCountryCode(code, date);
    this.isSubmitted = true;
  }
  
  async getDailyReportByCountryCode(code: string, date: string) {
    const url: string = this.path + 'report/country/code?date-format=YYYY-MM-DD&date=' + date + '&code=' + code;
    this.response = await this.http.get(url, environment.requestOptions).toPromise();
  }

  async getCountries() {
    const url: string = this.path + 'help/countries';
    this.countries = await this.http.get(url, environment.requestOptions).toPromise() as any[];
  }

  createForm() {
    this.virusForm = this.fb.group({
      date: [this.today, [Validators.required, Validators.pattern('[0-9]{4}-[0-9]{2}-[0-9]{2}')]],
      country: ['TR', [Validators.required]]
    })
  }
}