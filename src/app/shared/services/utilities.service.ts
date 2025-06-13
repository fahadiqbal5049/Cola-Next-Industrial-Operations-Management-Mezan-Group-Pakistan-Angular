import { Injectable } from '@angular/core';
import { Data } from '@angular/router';
import { Subscription } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class UtilitiesService {
	constructor() {}

	currentYear: number = new Date().getFullYear();
	currentDate: Date = new Date();
	month: number = this.currentDate.getMonth() + 1;
	currentQuarter: number = Math.ceil(this.month / 3);
	yearStart: Date = new Date(Date.UTC(this.currentDate.getUTCFullYear(),0,1));
	currentWeek: number = Math.ceil(( ( (this.currentDate.valueOf() - this.yearStart.valueOf()) / 86400000) + 1)/7);

	public quarters: any[] = [
		{
			name: 'Quarter 1',
			value: 1
		},
		{
			name: 'Quarter 2',
			value: 2
		},
		{
			name: 'Quarter 3',
			value: 3
		},
		{
			name: 'Quarter 4',
			value: 4
		}
	];

	public months: any[] = [
		{
			name: 'January',
			value: 1
		},
		{
			name: 'February',
			value: 2
		},
		{
			name: 'March',
			value: 3
		},
		{
			name: 'April',
			value: 4
		},
		{
			name: 'May',
			value: 5
		},
		{
			name: 'June',
			value: 6
		},
		{
			name: 'July',
			value: 7
		},
		{
			name: 'August',
			value: 8
		},
		{
			name: 'September',
			value: 9
		},
		{
			name: 'October',
			value: 10
		},
		{
			name: 'November',
			value: 11
		},
		{
			name: 'December',
			value: 12
		}
	];

	public years: any[] = [
		{
			name: this.currentYear + 2,
			value: this.currentYear + 2
		},
		{
			name: this.currentYear + 1,
			value: this.currentYear + 1
		},
		{
			name: this.currentYear,
			value: this.currentYear
		},
		{
			name: this.currentYear - 1,
			value: this.currentYear - 1
		}
	];

	public Weeks: any[] = [
		{
			value: 1,
			weekName: 'Week 1'
		},
		{
			value: 2,
			weekName: 'Week 2'
		},
		{
			value: 3,
			weekName: 'Week 3'
		},
		{
			value: 4,
			weekName: 'Week 4'
		},
		{
			value: 5,
			weekName: 'Week 5'
		},
		{
			value: 6,
			weekName: 'Week 6'
		},
		{
			value: 7,
			weekName: 'Week 7'
		},
		{
			value: 8,
			weekName: 'Week 8'
		},
		{
			value: 9,
			weekName: 'Week 9'
		},
		{
			value: 10,
			weekName: 'Week 10'
		},
		{
			value: 11,
			weekName: 'Week 11'
		},
		{
			value: 12,
			weekName: 'Week 12'
		},
		{
			value: 13,
			weekName: 'Week 13'
		},
		{
			value: 14,
			weekName: 'Week 14'
		},
		{
			value: 15,
			weekName: 'Week 15'
		},
		{
			value: 16,
			weekName: 'Week 16'
		},
		{
			value: 17,
			weekName: 'Week 17'
		},
		{
			value: 18,
			weekName: 'Week 18'
		},
		{
			value: 19,
			weekName: 'Week 19'
		},
		{
			value: 20,
			weekName: 'Week 20'
		},
		{
			value: 21,
			weekName: 'Week 21'
		},
		{
			value: 22,
			weekName: 'Week 22'
		},
		{
			value: 23,
			weekName: 'Week 23'
		},
		{
			value: 24,
			weekName: 'Week 24'
		},
		{
			value: 25,
			weekName: 'Week 25'
		},
		{
			value: 26,
			weekName: 'Week 26'
		},
		{
			value: 27,
			weekName: 'Week 27'
		},
		{
			value: 28,
			weekName: 'Week 28'
		},
		{
			value: 29,
			weekName: 'Week 29'
		},
		{
			value: 30,
			weekName: 'Week 30'
		},
		{
			value: 31,
			weekName: 'Week 31'
		},
		{
			value: 32,
			weekName: 'Week 32'
		},
		{
			value: 33,
			weekName: 'Week 33'
		},
		{
			value: 34,
			weekName: 'Week 34'
		},
		{
			value: 35,
			weekName: 'Week 35'
		},
		{
			value: 36,
			weekName: 'Week 36'
		},
		{
			value: 37,
			weekName: 'Week 37'
		},
		{
			value: 38,
			weekName: 'Week 38'
		},
		{
			value: 39,
			weekName: 'Week 39'
		},
		{
			value: 40,
			weekName: 'Week 40'
		},
		{
			value: 41,
			weekName: 'Week 41'
		},
		{
			value: 42,
			weekName: 'Week 42'
		},
		{
			value: 43,
			weekName: 'Week 43'
		},
		{
			value: 44,
			weekName: 'Week 44'
		},
		{
			value: 45,
			weekName: 'Week 45'
		},
		{
			value: 46,
			weekName: 'Week 46'
		},
		{
			value: 47,
			weekName: 'Week 47'
		},
		{
			value: 48,
			weekName: 'Week 48'
		},
		{
			value: 49,
			weekName: 'Week 49'
		},
		{
			value: 50,
			weekName: 'Week 50'
		},
		{
			value: 51,
			weekName: 'Week 51'
		},
		{
			value: 52,
			weekName: 'Week 52'
		}
	];

	getWeekNumberFromDate(d:any): number {
		// Copy date so don't modify original
		d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
		// Set to nearest Thursday: current date + 4 - current day number
		// Make Sunday's day number 7
		d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
		// Get first day of year
		var yearStart: any = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
		// Calculate full weeks to nearest Thursday
		var weekNo = Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
		// Return array of year and week number
		return weekNo;
	}

	// validation methods at the end
	checkDuplication(key: string, value: any, list: any[]): boolean {
		let isDuplicate: boolean = false;
		list.forEach((item) => {
			if (item[key] === value) {
				isDuplicate = true;
			}
		});
		return isDuplicate;
	}

	checkDateDuplication(key: string, value: Date, list: any[]): boolean {
		let isDuplicate: boolean = false;
		list.forEach((item) => {
			if (new Date(item[key]).toLocaleDateString() == new Date(value).toLocaleDateString()) {
				isDuplicate = true;
			}
		});
		return isDuplicate;
	}

	checkDuplicateOnUpdate(key: string, newValue: any, oldValue: any, list: any[]) {
		let isDuplicate: boolean = false;
		if (newValue == oldValue) {
			isDuplicate = false;
		} else {
			list.forEach((item) => {
				if (item[key] == newValue) {
					isDuplicate = true;
				}
			});
		}
		return isDuplicate;
	}

	isValidNumber(value: string): boolean {
		const numberRegex = /^-?(0|[1-9]\d*)?$/;
		if (numberRegex.test(value)) {
			return true;
		}
		return false;
	}

	checkDates(fromDate: Date, toDate: Date) {
		if (Date.parse(fromDate.toDateString()) > Date.parse(toDate.toDateString())) {
			return true;
		}
		return false;
	}

	roundNumberValues(num: number): number {
		return Number.parseFloat(num.toFixed(2));
	}

	roundToTwoDecimals(num: number): string {
		if (num) {
			return this.numberWithCommas(Number(num).toFixed(2));
		}
		return '0';
	}

	numberWithCommas(num: string): string {
		return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}
	unsubscribeAll(subscriptions: Subscription[]) {
		subscriptions.forEach((item) => {
			if (item) {
				item.unsubscribe();
			}
		});
	}
}
