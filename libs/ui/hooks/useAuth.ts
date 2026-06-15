import { useAppDispatch } from './useAppDispatch';
import { useAppSelector } from './useAppSelector';
import {
  setCredentials,
  logout as logoutAction,
  enterConsultantMode,
  exitConsultantMode,
  useAuthActionMutation,
} from '@sprintpulse/services';
import { UserRole, ISignInResponse } from '@sprintpulse/interfaces';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isConsultantMode } = useAppSelector((state) => state.auth);
  const [authAction, { isLoading, error }] = useAuthActionMutation();

  const login = async (email: string, password: string) => {
    const result = (await authAction({
      action: 'signin',
      email,
      password,
    }).unwrap()) as ISignInResponse;
    dispatch(setCredentials({ user: result.data.user, token: result.data.token }));
    return result;
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  const enterMode = () => {
    dispatch(enterConsultantMode());
  };

  const exitMode = () => {
    dispatch(exitConsultantMode());
  };

  const isAdmin = user?.role === UserRole.ADMIN;
  const isConsultant = user?.role === UserRole.CONSULTANT;

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    isConsultant,
    isConsultantMode,
    login,
    logout,
    enterConsultantMode: enterMode,
    exitConsultantMode: exitMode,
    isLoading,
    error,
  };
};
