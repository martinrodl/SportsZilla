import React, { useState, FormEvent, ChangeEvent } from 'react';
import { Field, Label, Input, Message } from '@zendeskgarden/react-forms';
import { Button } from '@zendeskgarden/react-buttons';
import { VALIDATION } from '@zendeskgarden/react-forms/dist/typings/utils/validation';
import styled from 'styled-components';
import styles from './SignUp.module.scss';

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

interface UserData {
  [index: string]: string | Date | undefined;
  firstName: string;
  lastName: string;
  userName?: string;
  email: string;
  passW: string;
  birthday?: Date | undefined;
}
interface ValidStatuses {
  [index: string]: VALIDATION | undefined;
  firstName: VALIDATION | undefined;
  lastName: VALIDATION | undefined;
  userName: VALIDATION | undefined;
  email: VALIDATION | undefined;
  passW: VALIDATION | undefined;
  birthday: VALIDATION | undefined;
}
interface ValidMsgs {
  [index: string]: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  passW: string;
  birthday: string;
}

const SignUp: React.FC = () => {
  const initialUD: UserData = {
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    passW: '',
    birthday: undefined,
  }
  const [userData, setUserData] = useState<UserData>(initialUD);

  const initialSts: ValidStatuses = {
    firstName: undefined,
    lastName: undefined,
    userName: undefined,
    email: undefined,
    passW: undefined,
    birthday: undefined,
  }
  const [validStatuses, setValidStatuses] = useState<ValidStatuses>(initialSts);

  const initialMsgs: ValidMsgs = {
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    passW: '',
    birthday: '',
  }
  const [validMsgs, setValidMsgs] = useState<ValidMsgs>(initialMsgs);

  const validateField = (fieldName: string, fieldValue: string): boolean => {
    switch (fieldName) {
      case 'firstName':
        return fieldName.length < 40 && fieldName.length > 2;
      case 'lastName':
        return fieldName.length < 60 && fieldName.length > 2;
      case 'userName':
        return fieldName.length < 40;
      case 'email':
        const mailRgx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return mailRgx.test(fieldValue);
      case 'passW':
        const passWRgx = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/;
        return passWRgx.test(fieldValue);
      case 'birthday':
        if (fieldValue.length === 0) return true;
        try {
          const now = new Date();
          const birthday = new Date(fieldValue);
          if (now.getFullYear() - birthday.getFullYear() >= 120) {
            throw new Error('Suspiciously old!');
          }
          return true;
        } catch {
          return false;
        }
    }
    return false;
  };

  interface FormMethod<E> {
    (event: E): void;
  }
  const handleChange: FormMethod<ChangeEvent<HTMLInputElement>> = (event) => {
    const { name, value } = event.target;
    setUserData((userData) => ({ ...userData, [name]: value }));
    const updatedVals = validStatuses;
    const updatedMsgs = validMsgs;
    if (value.length === 0) {
      updatedVals[name] = undefined;
      updatedMsgs[name] = ' ';
      setValidStatuses(updatedVals);
      setValidMsgs(updatedMsgs);
    } else if (validateField(name, value)) {
      updatedVals[name] = 'success';
      updatedMsgs[name] = 'OK';
      setValidStatuses(updatedVals);
      setValidMsgs(updatedMsgs);
    } else {
      updatedVals[name] = 'warning';
      updatedMsgs[name] = `Invalid ${name}`;
      setValidStatuses(updatedVals);
      setValidMsgs(updatedMsgs);
    }
  };

  const verifyForm = (): boolean => {
    const isValids = Object
      .keys(validStatuses)
      .reduce<boolean[]>((isValids: boolean[], key: string) => {
        if (validStatuses[key] === 'success') {
          isValids.push(true);
          return isValids;
        // not compulsory values (can be undefined, not just success):
        } else if ((key === 'userName' || key === 'birthday') && validStatuses[key] === undefined) {
          isValids.push(true);
          return isValids;
        } else {
          isValids.push(false);
          return isValids;
        }
      }, []);
   return isValids.every((isValid) => isValid);
  };

  const handleSubmit: FormMethod<FormEvent<HTMLFormElement>> = (event) => {
    event.preventDefault();
    if (!verifyForm()) return null;

    setUserData(initialUD);
    setValidStatuses(initialSts);
    setValidMsgs(initialMsgs);
  };

  return (
    <div className={styles.SignUp} data-testid="SignUp">
      <h2 className={styles.welcome}>Thank you for signing up with us.</h2>
      <form onSubmit={handleSubmit} className={styles.signUpForm}>
        <Field className={styles.emailField}>
          <Label>Email</Label>
          <Input
            name="email"
            value={userData.email}
            style={{ fontSize: '20px' }}
            validation={validStatuses.email}
            onChange={handleChange}
          />
          <Message validation={validStatuses.email}>{validMsgs.email}&nbsp;</Message>
        </Field>
        <Field className={styles.passWField}>
          <Label>Password</Label>
          <Input
            name="passW"
            value={userData.passW}
            type="password"
            style={{ fontSize: '20px' }}
            validation={validStatuses.passW}
            onChange={handleChange}
          />
          <Message validation={validStatuses.passW}>{validMsgs.passW}&nbsp;</Message>
        </Field>
        <SButton type="submit">Sign up</SButton>
      </form>
    </div>
  );
};

export default SignUp;
