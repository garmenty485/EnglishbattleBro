import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

function useGoogleLoginLogic(onLogin) {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      // console.log('Login Success:', tokenResponse);
      await onLogin(tokenResponse);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('token', tokenResponse.access_token); // 存儲訪問令牌
      navigate('/loggedin');
    },
    onError: (error) => console.error('Login Failed:', error)
  });

  return login;
}

export default useGoogleLoginLogic;