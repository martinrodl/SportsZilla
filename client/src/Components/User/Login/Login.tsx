import React, { ReactElement, useState, FormEvent, ChangeEvent, Dispatch, SetStateAction } from 'react';
import { useHistory } from 'react-router-dom';
import { useLazyQuery, gql } from '@apollo/client';
import { Field, Label, Input, Message } from '@zendeskgarden/react-forms';
import { Button } from '@zendeskgarden/react-buttons';
import { VALIDATION } from '@zendeskgarden/react-forms/dist/typings/utils/validation';
import styled from 'styled-components';
import Loader from '../../Loader/Loader';
import { UserData } from '../UserData';
import styles from './Login.module.scss';

const LOGIN = gql`
  query Login($email: String!, $passW: String!) {
    login(email: $email, passW: $passW) {
      accessToken
      user{email}
    }
  }
`;

const SButton = styled(Button)`
  font-size: 30px;
  border-color: #90755f;
  color: #90755f;
  width: 50%;
  &:hover {
    border-color: #ffffff;
    color: #ffffff;
  }
`;

interface PropTypes {
  setUser: Dispatch<SetStateAction<UserData>>;
}
function Login({ setUser }: PropTypes): ReactElement {
  const [email, setEmail] = useState<string>('');
  const [passW, setPassW] = useState<string>('');
  const [mailValid, setMailValid] = useState<VALIDATION | undefined>(undefined);
  const [passValid, setPassValid] = useState<VALIDATION | undefined>(undefined);
  const [mailValidMsg, setMailValidMsg] = useState<string>('');
  const [passValidMsg, setPassValidMsg] = useState<string>('');

  interface LoginResponse {
    accessToken: string;
    user: UserData;
  }
  interface Response {
    login: LoginResponse;
  }
  interface Arguments {
    email: string;
    passW: string;
  }
  const [login, { loading, data, error }] = useLazyQuery<Response, Arguments>(LOGIN);
  const history = useHistory();

  const validateEmail = (email: string): boolean => {
    const mailRgx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return mailRgx.test(email);
  };

  const validatePassW = (passW: string): boolean => {
    const passWRgx = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/;
    return passWRgx.test(passW);
  };

  interface FormMethod<E> {
    (event: E): void;
  }
  const handleChange: FormMethod<ChangeEvent<HTMLInputElement>> = (event) => {
    const { name, value } = event.target;
    if (name === 'email') {
      setEmail(value);
      if (value.length === 0) {
        setMailValid(undefined);
        setMailValidMsg(' ');
      } else if (validateEmail(value)) {
        setMailValid('success');
        setMailValidMsg('OK');
      } else {
        setMailValid('warning');
        setMailValidMsg('Invalid email!');
      }
    } else if (name === 'passW') {
      setPassW(value);
      if (value.length === 0) {
        setPassValid(undefined);
        setPassValidMsg(' ');
      } else if (validatePassW(value)) {
        setPassValid('success');
        setPassValidMsg('OK');
      } else {
        setPassValid('warning');
        setPassValidMsg('Invalid password');
      }
    }
  };

  const verifyForm = (): boolean => {
    if (passValid !== 'success') {
      setPassValid('error');
      setPassValidMsg('Please, give a correct password!');
    }
    if (mailValid !== 'success') {
      setMailValid('error');
      setMailValidMsg('Please, give a correct email address!');
    }
    return passValid === 'success' && mailValid === 'success';
  };

  const handleSubmit: FormMethod<FormEvent<HTMLFormElement>> = (event) => {
    event.preventDefault();
    if (!verifyForm()) return null;

    login({ variables: { email, passW } });

    setPassValid(undefined);
    setPassValidMsg('');
    setPassW('');
    setMailValid(undefined);
    setMailValidMsg('');
    setEmail('');
  };

  if (loading) return <Loader boxHeight={400} />;
  if (error) return <div className={styles.errorNotification}>Oopsie: {error.message}</div>;
  if (data && data.login) {
    localStorage.setItem('accessToken', data.login.accessToken);
    setUser(data.login.user);
    history.push('/user/profile');
  }

  return (
    <div className={styles.Login} data-testid="Login">
      <h2 className={styles.welcome}>Welcome back!</h2>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <Field className={styles.emailField}>
          <Label>Email</Label>
          <Input
            name="email"
            value={email}
            style={{ fontSize: '20px' }}
            validation={mailValid}
            onChange={handleChange}
          />
          <Message validation={mailValid}>{mailValidMsg}&nbsp;</Message>
        </Field>
        <Field className={styles.passWField}>
          <Label>Password</Label>
          <Input
            name="passW"
            value={passW}
            type="password"
            style={{ fontSize: '20px' }}
            validation={passValid}
            onChange={handleChange}
          />
          <Message validation={passValid}>{passValidMsg}&nbsp;</Message>
        </Field>
        <SButton type="submit">Log in</SButton>
      </form>
    </div>
  );
};

export default Login;
