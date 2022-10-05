import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Record } from '../class/record';
import { Category } from '../class/category';
import { User } from '../class/user';
import { UserLog } from '../class/log';
import { UserData } from '../class/userdata';
import { Target } from '../class/target';
import { Daycounts } from '../class/daycount';
import { Catcount } from '../class/catcount';
import { CusCatCount } from '../class/catcount_custom';
import { UserCategory } from '../class/usercategory';
import { Email } from '../class/email';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    PHP_API_SERVER = "http://localhost/project/penny-track/api";

    constructor(private httpClient: HttpClient) { }

    //User authentication
    AuthUser(): boolean {
        const role = localStorage.getItem('user_lock');
        if (role == "1") {
            return true;
        } else {
            return false; //Prevent access to user pages
        }
    }

    //Get data
    getRecords(userid: number) {
        return this.httpClient.get<Record[]>(`${this.PHP_API_SERVER}/get_record.php/?userid=` + userid);
    }

    getTopRecent(userid: number) {
        return this.httpClient.get<Record[]>(`${this.PHP_API_SERVER}/get_top_record.php/?userid=` + userid);
    }

    getCategory(): Observable<Category[]> {
        return this.httpClient.get<Category[]>(`${this.PHP_API_SERVER}/get_category.php`);
    }

    getUser(userid: number) {
        return this.httpClient.get<User[]>(`${this.PHP_API_SERVER}/get_user.php/?userid=` + userid);
    }

    getTarget(userid: number) {
        return this.httpClient.get<Target[]>(`${this.PHP_API_SERVER}/get_target.php/?userid=` + userid);
    }
    
    getCountdown(userid: number) {
        return this.httpClient.get<Daycounts[]>(`${this.PHP_API_SERVER}/calculate_date.php/?userid=` + userid);
    }

    getPostSaving(userid: number, tdate: string, cdate: string) {
        return this.httpClient.get<UserData[]>(`${this.PHP_API_SERVER}/post_target_saving.php/?userid=` + userid + `&targetDate=` + tdate + `&createDate=` + cdate);
    }

    getPostSpending(userid: number, tdate: string, cdate: string) {
        return this.httpClient.get<UserData[]>(`${this.PHP_API_SERVER}/post_target_spending.php/?userid=` + userid + `&targetDate=` + tdate + `&createDate=` + cdate);
    }

    getUserData(userid: number, sort: number) {
        return this.httpClient.get<UserData[]>(`${this.PHP_API_SERVER}/get_user_data.php/?userid=` + userid + `&sort=` + sort);
    }

    getCatCount(userid: number, sort: number) {
        return this.httpClient.get<Catcount[]>(`${this.PHP_API_SERVER}/get_cat_count.php/?userid=` + userid + `&sort=` + sort);
    }

    getCatCountSpen(userid: number) {
        return this.httpClient.get<CusCatCount[]>(`${this.PHP_API_SERVER}/get_cat_custom.php/?userid=` + userid );
    }

    getCatByIDs(userid: number, array) {
        return this.httpClient.get<UserCategory[]>(`${this.PHP_API_SERVER}/get_data_category.php/?userid=` + userid + `&arr=` + array);
    }

    getCategoryName(catid: number) {
        return this.httpClient.get<Category[]>(`${this.PHP_API_SERVER}/get_category_name.php/?catID=` + catid );
    }

    
    //CRUD user data
    createRecord(newrecord: UserData): Observable<UserData> {
        return this.httpClient.post<UserData>(`${this.PHP_API_SERVER}/create_record.php`, newrecord);
    }

    updateRecord(record: UserData) {
        return this.httpClient.put<UserData>(`${this.PHP_API_SERVER}/update_record.php`, record);
    }

    deleteRecord(id: number, uid: number) {
        return this.httpClient.get(`${this.PHP_API_SERVER}/delete_record.php?id=` + id + `&uid=` + uid);
    }


    //Login
    getUserLogin(email: String, password: String) {
        return this.httpClient.get(`${this.PHP_API_SERVER}/login.php?email=` + email + `&pwd=` + password);

    }

    updateLog(userlog: UserLog) {
        return this.httpClient.put<UserLog>(`${this.PHP_API_SERVER}/update_user_log.php`, userlog);
    }

    addLog(log: UserLog): Observable<UserLog> {
        return this.httpClient.post<UserLog>(`${this.PHP_API_SERVER}/add_user_log.php`, log);
    }

    getUserLog(logs: String) {
        return this.httpClient.get(`${this.PHP_API_SERVER}/get_user_log.php?user_session=` + logs);
    }

    //Register
    addUser(log: User): Observable<User> {
        return this.httpClient.post<User>(`${this.PHP_API_SERVER}/user_register.php`, log);
    }

    checkEmail(email: String) {
        return this.httpClient.get(`${this.PHP_API_SERVER}/email_check.php?email=` + email);

    }

    //CRUD user target
    createTarget(newtarget: Target): Observable<Target> {
        return this.httpClient.post<Target>(`${this.PHP_API_SERVER}/create_target.php`, newtarget);
    }

    updateTarget(edittarget: Target) {
        return this.httpClient.put<Target>(`${this.PHP_API_SERVER}/update_target.php`, edittarget);
    }

    //Emailing
    sendEmail(name: String, email: String, phone: String, type: String, message: String) {
        return this.httpClient.get(`${this.PHP_API_SERVER}/email.php?name=` + name + `&email=` + email + `&ph=` + phone + `&type=` + type + `&msg=` + message);
    }

}