import SignInForm from '@/app/signin/sign-in-form';
import { metaObject } from '@/config/site.config';

import '@public/assets/css/animate.css';
import '@public/assets/css/main.css';
import AuthWrapperFour from '../shared/auth-layout/auth-wrapper-four';

export const metadata = {
  ...metaObject('Sign In Admin'),
};

export default function SignIn() {
  return (
    <AuthWrapperFour title={<>ADMIN AREA</>} isSignIn role="admin">
      <SignInForm role="admin" />
    </AuthWrapperFour>
  );
}
