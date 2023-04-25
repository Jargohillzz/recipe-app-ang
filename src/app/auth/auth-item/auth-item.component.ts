import {
  Component,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NgForm, NgModel } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthResponseData, AuthService } from '../auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth-item',
  templateUrl: './auth-item.component.html',
  styleUrls: ['./auth-item.component.css'],
})
export class AuthItemComponent implements OnInit {
  isLogin: boolean;
  isLoading: boolean = false;
  error: string;
  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.isLogin = params['name'] == 'login';
    });
  }

  onSubmit(form: NgForm) {
    console.log(form);
    if (form.invalid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.passwords.password;
    const confirmPassword = form.value.confirmPassword;
    let authObsv: Observable<AuthResponseData>;
    this.isLoading = true;
    if (this.isLogin) {
      authObsv = this.authService.login(email, password);
    } else {
      authObsv = this.authService.signup(email, password);
    }
    authObsv.subscribe({
      next: (data) => {
        console.log(data);
        this.router.navigate(['/recipes']);
        this.isLoading = false;
        form.reset();
      },
      error: (errorMessage) => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.isLoading = false;
        setTimeout(() => {
          this.error = '';
        }, 5000);
      },
    });
  }
}
