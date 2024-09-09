import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

const AUTH0_URL = `https://` + process.env.AUTH0_DOMAIN;

const auth0AxiosInstance = axios.create({
  baseURL: AUTH0_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * From a given access token, get the user details from Auth0. This is a good way to verify
 * if a token is valid, as no user details will be returned if invalid.
 * @param accessToken
 * @returns
 */
export const getUser = async (accessToken: string) => {
  return await auth0AxiosInstance
    .get('/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });
};

// if (require.main === module) {
//   (async () => {
//     const user = await getUser(
//       '',
//     );

//     console.log(user);
//   })();
// }
