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
    // No token provided -- UNAUTHORIZED
    return false;
  }

  let token = authHeader.replace('Bearer ', '');
  let session = await context.models.sessions.findSession(token);
  if (session) {
    if (session.user_id) {
      // Existing session for user -- AUTHORIZED
      context.user = await context.models.users.findById(session.user_id);
      return true;
    } else {
      // Session exists but user is not found -- UNAUTHORIZED
      console.log('Key is known to be invalid');
      return false;
    }
  } else {
    // Check autho0 for user.
    let user = await getUser(token);
    if (user) {
      // AUTH0 User found -- AUTHORIZED
      context.user =
        (await context.models.users.findByAuth0Id(user.sub)) ??
        // Create user if not found in our system.
        (await context.models.users
          .create({
            auth0_id: user.sub,
            email: user.email,
            first_name: user.nickname ?? user.given_name ?? user.name,
            last_name: user.family_name,
            phone: user.phone_number,
          })
          .catch((err) => {
            if (err.includes('duplicate key')) {
              return context.models.users.findByAuth0Id(user.sub);
            } else {
              throw err;
            }
          }));
      await context.models.sessions.createSession(token, context.user?._id);
      return true;
    } else {
      // No user found -- UNAUTHORIZED. Marking token as invalid.
      await context.models.sessions.createSession(token, null);
    }
  }

  return false;
};
