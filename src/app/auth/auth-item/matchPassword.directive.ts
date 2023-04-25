import { Directive } from '@angular/core';
import {
  AbstractControl,
  FormGroup,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';

function matchPassword(): ValidatorFn {
  return (control: AbstractControl) => {
    if (control && control instanceof FormGroup) {
      let group = control as FormGroup;
      let password = group.controls['password'];
      let confirmPassword = group.controls['confirmPassword'];
      if (
        password &&
        confirmPassword &&
        password?.value !== confirmPassword?.value
      ) {
        return { matchError: true };
      }
    }
    return null;
  };
}

@Directive({
  selector: '[matchPassword]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordMatchDirective,
      multi: true,
    },
  ],
})
export class PasswordMatchDirective implements Validator {
  private valFn;
  constructor() {
    this.valFn = matchPassword();
  }
  validate(control: AbstractControl): ValidationErrors | null {
    return this.valFn(control);
  }
}
