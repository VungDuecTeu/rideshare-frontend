import { Component, OnInit, NgModule, TemplateRef } from '@angular/core';
import { UserService } from 'src/app/services/user-service/user.service';
import { User } from 'src/app/models/user';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth-service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { BsModalService, BsModalRef} from 'ngx-bootstrap';
import { EmployeeServiceService } from 'src/app/services/employee-service.service';

	import { from } from 'rxjs';
import { Employee } from 'src/app/models/employee';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})


/**
 * This is the login component
 */
export class LoginComponent implements OnInit {

	/**
	 * Creates an array of Users
	 * Creates an array of all Users
	 * Sets a chosen user object
	 * Sets name string variable to the chosen user
	 * Sets pagination
	 */

	users: User[] = [];
	allUsers: User[] = [];

	chosenUser: User;
	chosenUserFullName: string = '';
	userName: string;
	passWord: string;
	totalPage: number = 1;
  	curPage: number = 1;

	showDropDown: boolean = false;
	failed: boolean = false;
	banned: boolean = false;

	pwdError: string;
    usernameError: string;
	userNotFound: string;
	modalRef :BsModalRef;
	/**
	 * This is a constructor
	 * @param userService An user service is instantiated.
	 * @param router A router service is injected.
	 * @param http A HTTP Client is created.
	 * @param authService An auth service is injected.
	 *
	 */
	constructor(private modalService :BsModalService,private es: EmployeeServiceService, private http: HttpClient, private authService: AuthService, public r: Router) { }

	/**
	 * When the component is initialized, the system checks for the session storage to validate. Once validated, the user service is called to retrieve all users.
	 */
	ngOnInit() {
		
	}

	/**
	 * A function that allows the user to choose an account to log in as
	 * @param user
	 */

	// changeUser(user) {
	// 	this.showDropDown = false;
	// 	this.curPage = 1;
	// 	this.totalPage = Math.ceil(this.allUsers.length / 5);
	// 	this.users = this.allUsers.slice(this.curPage * 5 - 5, this.curPage * 5);
	// 	this.chosenUserFullName = `${user.firstName} ${user.lastName}: ${user.driver ? 'Driver' : 'Rider'}`;
	// 	this.chosenUser = user;
	// }

	/**
	 * A GET method the fetches all the users
	 */

	searchAccount() {
		this.showDropDown = true;
		if (this.chosenUserFullName.length) {
			this.users = this.allUsers.filter(user => {
				return (
					user.firstName.toLowerCase().startsWith(this.chosenUserFullName.toLowerCase()) ||
					user.lastName.toLowerCase().startsWith(this.chosenUserFullName.toLowerCase()) ||
					`${user.firstName} ${user.lastName}`.toLowerCase().startsWith(this.chosenUserFullName.toLowerCase()) ||
					`${user.firstName} ${user.lastName}: ${user.driver ? 'Driver' : 'Rider'}`.toLowerCase().startsWith(this.chosenUserFullName.toLowerCase())
				);
			});
			this.totalPage = Math.ceil(this.users.length / 5);
		} else {
			this.curPage = 1;
			this.totalPage = Math.ceil(this.allUsers.length / 5);
			this.users = this.allUsers.slice(this.curPage * 5 - 5, this.curPage * 5);
		}
	}

	/**
	 * A toggle function
	 */

	toggleDropDown() {
		this.showDropDown = !this.showDropDown;
	}

	/**
	 * Set next page
	 */
	nextPage() {
		this.curPage++;
		this.users = this.allUsers.slice(this.curPage * 5 - 5, this.curPage * 5);
	}

	/**
	 * Set prev page
	 */

	prevPage() {
		this.curPage--;
		this.users = this.allUsers.slice(this.curPage * 5 - 5, this.curPage * 5);
	}

	/**
	 * A function that indicate a fail to login
	 */

	openModal(template :TemplateRef<any>){
		this.modalRef = this.modalService.show(template);
	}

	/**
	 * A login function
	 */

	async employeelogin(){
		let username=this.userName;
		let password=this.passWord;
		let  empl:Employee = new Employee(0,"","","","",username,password,"",false,true,false,false,null);
		let e:Employee = await this.es.login(empl);
		console.log(e);
		  if(e != null){
			let key = 'User';
			sessionStorage.setItem(key,JSON.stringify(e));
			let user = JSON.parse(sessionStorage.getItem(key))
			this.modalRef.hide();
			if(e.is_manager){
				
			  this.r.navigateByUrl("/profile");
			}else{
			  this.r.navigateByUrl("/profile");
			}
		  }
		  else {
			console.log("c")
			alert("User or password doesnt exist!");
		  } 
	  }
	}





	// login() {
	// 	this.pwdError ='';
	// 	this.usernameError= '';
		
    //     this.http.get(`${environment.loginUri}?userName=${this.userName}&passWord=${this.passWord}`)
	// 		.subscribe(
    //               (response) => {
    //                  //console.log(response);
    //                   if(response["userName"] != undefined){
    //                      this.usernameError=  response["userName"][0];
    //                   }
    //                   if(response["passWord"] != undefined){
    //                      this.pwdError = response["pwdError"][0];
	// 				  }
	// 				  if((response["name"] != undefined) && (response["userid"] != undefined)){
	// 					sessionStorage.setItem("name", response["name"]);
	// 					sessionStorage.setItem("userid", response["userid"]);
						
	// 					//call landing page
	// 					//this.router.navigate(['landingPage']);
	// 					location.replace('profile');
	// 				  }
	// 				  if(response["userNotFound"] != undefined){
	// 					this.userNotFound = response["userNotFound"][0];
	// 				  }
    //              }
    //     );
		/*this.http.get<User[]>(`${environment.userUri}?username=${this.userName}`)
			.subscribe((user: User[]) => {
				if (!user.length) {
					this.loginFailed();
				}
				else if(this.chosenUser.active == false){
					this.loginBanned();
				}
				else {
					if (!this.authService.login(user[0], this.chosenUser.userName)) {
						this.loginFailed();
					}
				}
			});*/
	// }


