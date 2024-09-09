import { AuthChecker, MiddlewareFn } from 'type-graphql';
import { Context } from '../../context';
import { getUser } from '../../api/auth0';

/**
 * Note that this will only trigger for authorized routes. Therefore for non-authorized routes,
 * there will be no user object in the context, and user specific actions will fail.
 * @param param0
 * @param roles
 * @returns
 */
export const AuthMiddlware: AuthChecker<Context> = async (
  { context },
  roles,
) => {
  let authHeader = context.req?.headers.authorization;
  if (!authHeader) {
    return false;
  } else {
    let user = await getUser(authHeader.replace('Bearer ', ''));

    if (!user) {
      return false;
    }
    context.auth0User = user;
    context.user = await context.models.users.findByAuth0Id(user.sub);
  }
  return true;
};
