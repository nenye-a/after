import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { MMKV } from 'react-native-mmkv';
import { useAuth0, User, Credentials } from 'react-native-auth0';
import { UserType } from '@/services/graphql/after/generated/graphql';
import { useQuery } from '@tanstack/react-query';
import { afterInstance, createAfterInstance } from '@/services/afterInstance';
import { GET_USER } from '@/services/graphql/after/queries/user';
import { GraphQLClient } from 'graphql-request';

export type UserContextType = {
  auth0User: User | null;
  setAuth0User: (user: User) => void;
  userDetails: UserType | null;
  setUserDetails: (user: UserType) => void;
  refetchUserDetails: () => void;
  login: () => void;
  logout: () => void;
  credentials: Credentials | null;
  apiInstance: GraphQLClient | null;
  isLoadingUserDetails: boolean;
  isAuthorized: boolean;
};

const UserContext = createContext<UserContextType>({
  auth0User: null,
  setAuth0User: () => {},
  userDetails: null,
  setUserDetails: () => {},
  refetchUserDetails: () => {},
  login: () => {},
  logout: () => {},
  credentials: null,
  apiInstance: null,
  isLoadingUserDetails: false,
  isAuthorized: false,
});

export const useUser = () => useContext(UserContext);

type Props = PropsWithChildren & { storage: MMKV };

export default function UserProvider({ children, storage }: Props) {
  const { user, clearSession, getCredentials, hasValidCredentials, authorize } =
    useAuth0();

  const [auth0User, setAuth0User] = useState<User | null>(user);
  const [userDetails, setUserDetails] = useState<UserType | null>(null);
  const [credentials, setCredentials] = useState<Credentials | null>(null);
  const [apiInstance, setApiInstance] = useState<GraphQLClient | null>(null);

  const login = async () => {
    await authorize().catch((err) => console.log(err));
  };

  const logout = async () => {
    setAuth0User(null);
    setUserDetails(null);
    setCredentials(null);
    setApiInstance(null);
    await clearSession();
  };

  const {
    data: newUserDetails,
    isPending: isLoadingUserDetails,
    refetch: refetchUserDetails,
  } = useQuery({
    queryKey: ['getUser', { id: auth0User?.sub }],
    queryFn: () => {
      if (apiInstance) return apiInstance.request(GET_USER);
      else {
        throw new Error('No valid credentials (API INSTANCE)');
      }
    },
    enabled: !!auth0User && !!credentials && !!apiInstance,
  });

  const isAuthorized = !!auth0User && !!credentials && !!apiInstance;

  /** Logout stale users. */
  useEffect(() => {
    if (auth0User) {
      hasValidCredentials().then((authorized) => {
        if (!authorized)
          logout().then(() => {
            // Navigate to login screen
          });
      });
    }
  });

  /** Set new users upon detected logins. */
  useEffect(() => {
    if (user && !auth0User) {
      setAuth0User(user);
    }
  }, [user]);

  /** Set the user details */
  useEffect(() => {
    if (newUserDetails?.getUser) {
      setUserDetails(newUserDetails.getUser);
    }
  }, [newUserDetails]);

  /** Update credentials upon a new detected login. */
  useEffect(() => {
    if (user && !credentials) {
      getCredentials().then((creds) => {
        if (creds) {
          setCredentials(creds);
          setApiInstance(createAfterInstance(creds.accessToken));
        }
      });
    }
  }, [user, credentials]);

  /** Update user details */

  return (
    <UserContext.Provider
      value={{
        auth0User,
        setAuth0User,
        userDetails,
        setUserDetails,
        refetchUserDetails,
        login,
        logout,
        credentials,
        apiInstance,
        isLoadingUserDetails,
        isAuthorized,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
