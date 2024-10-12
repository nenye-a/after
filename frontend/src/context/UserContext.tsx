import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { MMKV } from 'react-native-mmkv';
import { useAuth0, User, Credentials } from 'react-native-auth0';
import {
  UserCreateInput,
  UserType,
} from '@/services/graphql/after/generated/graphql';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createAfterInstance } from '@/services/afterInstance';
import { CREATE_USER, GET_USER } from '@/services/graphql/after/queries/user';
import { GraphQLClient } from 'graphql-request';
import { seconds } from '@/helpers/dates';

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
    await clearSession();
    setApiInstance(null);
    setUserDetails(null);
    setCredentials(null);
  };

  const {
    data: newUserDetails,
    isLoading: isLoadingUserDetails,
    refetch: refetchUserDetails,
  } = useQuery({
    queryKey: ['getUser', { id: auth0User?.sub }],
    queryFn: () => {
      if (apiInstance) return apiInstance.request(GET_USER);
      else {
        throw new Error('No valid credentials (API INSTANCE)');
      }
    },
    enabled: !!auth0User && !!credentials && !!apiInstance && !userDetails,
    staleTime: 10 * seconds,
  });

  const { mutate: createUser, isPending: isCreatingUser } = useMutation({
    mutationFn: (data: UserCreateInput) => {
      if (apiInstance)
        return apiInstance.request(CREATE_USER, {
          data,
        });
      else {
        throw new Error('No valid credentials (API INSTANCE)');
      }
    },
    onSuccess: (data) => {
      let newUser = data.createUser;
      setUserDetails(newUser);
    },
  });

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
  }, [auth0User]);

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

  useEffect(() => {
    if (
      auth0User?.sub &&
      !userDetails &&
      !(isLoadingUserDetails || isCreatingUser) &&
      !newUserDetails?.getUser
    ) {
      createUser({
        email: auth0User.email ?? '',
        first_name:
          auth0User.nickname ?? auth0User.given_name ?? auth0User.name,
        last_name: auth0User.familyName,
        phone: auth0User.phoneNumber ?? '',
        home_address: auth0User.address ?? '',
        auth0_id: auth0User.sub,
      });
    }
  }, [
    auth0User,
    userDetails,
    isLoadingUserDetails,
    isCreatingUser,
    newUserDetails,
  ]);

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
        isAuthorized: !!auth0User && !!credentials && !!apiInstance,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
