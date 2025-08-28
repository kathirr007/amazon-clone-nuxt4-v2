import { H3Event } from 'h3'
import jwt from 'jsonwebtoken'
import User from '~~/server/api/models/user'
import type { User as IUser } from "#auth-utils";


export default defineEventHandler(async (event: H3Event) => {
  const method = event.method
  const action = getRouterParam(event, 'action')


  if (action === 'login' && method === 'POST') return handleLogin(event)
  if (action === 'authLogin' && method === 'POST') return handleAuthLogin(event)
  if (action === 'signup' && method === 'POST') return handleSignup(event)
  if (action === 'authSignup' && method === 'POST') return handleAuthSignup(event)
  if (action === 'getUser' && method === 'GET') return handleGetUser(event)
  if (action === 'updateUser' && method === 'PUT') return handleGetUser(event)

  throw createError({
    statusCode: 404,
    message: `Not Found api router`
  })
})

/**
 * ✅ SIGNUP
 */
async function handleSignup(event: H3Event) {
  const body = await readBody(event)
  if (!body.email || !body.password) {
    return { success: false, message: "Please enter email or password" }
  }

  try {
    let newUser = new User()
    newUser.name = body.name
    newUser.email = body.email
    newUser.password = body.password
    newUser = await newUser.save()

    const token = jwt.sign(newUser.toJSON(), process.env.SECRET as string, {
      expiresIn: 604800 // 1 week
    })

    await setUserSession(event, {
        user: newUser.toJSON(),
        loggedInAt: new Date(),
      });

    return { success: true, token, message: "Successfully created new User" }
  } catch (err: any) {
    return { success: false, message: err.message }
  }
}

/**
 * ✅ Auth SIGNUP
 */
async function handleAuthSignup(event: H3Event) {
  // Clear the current user session
  await clearUserSession(event);

  const storage = useStorage("data");

  // get email, password, name from the post body
  const body = await readBody(event);
  const { email, password, name } = body;
  // check if email already exists in storage
  const existingUser = await storage.getItem(email);
  if (existingUser) {
    return createError({
      statusCode: 400,
      statusMessage: "User already exists",
    });
  }

  const user = {
    name,
    email,
    createdAt: new Date(),
  };

  // if it doesn't, create a new user
  await storage.setItem(email, {
    ...user,
    // make sure to has the password for security!
    // never store plain text passwords!
    password: await hashPassword(password),
  });

  await setUserSession(event, {
    user,
    loggedInAt: new Date(),
  });

  return {
    email,
    password,
  };
}

/**
 * ✅ LOGIN
 */
async function handleLogin(event: H3Event) {
  try {
    const storage = useStorage("data");
    const body = await readBody(event)
    console.log(body)
    const foundUser = await User.findOne({ email: body.email }).populate('address')
    const user = await storage.getItem<IUser & { password?: string }>(body.email);


    if (!foundUser) {
      return { success: false, message: "Authentication failed, User not found" }
    }

    if (foundUser.comparePassword(body.password)) {
      const token = jwt.sign(foundUser.toJSON(), process.env.SECRET as string, {
        expiresIn: 604800
      })

      await setUserSession(event, {
        user: foundUser.toJSON(),
        loggedInAt: new Date(),
      });

      return { success: true, token }
    } else {
      return { success: false, message: "Authentication failed, password is wrong!" }
    }
  } catch (err: any) {
    setResponseStatus(event, 500)
    return { success: false, message: err.message }
  }
}

/**
 * ✅ Auth LOGIN
 */
async function handleAuthLogin(event: H3Event) {
  const storage = useStorage("data");
  const { email, password } = await readBody(event);
  const user = await storage.getItem<IUser & { password?: string }>(email);
  if (!user) {
    return createError({
      statusCode: 400,
      statusMessage: "Please check your email and password.",
    });
  }

  const isPasswordValid = await verifyPassword(user?.password || "", password);

  if (!isPasswordValid) {
    return createError({
      statusCode: 400,
      statusMessage: "Please check your email and password.",
    });
  }

  delete user.password;
  await setUserSession(event, {
    user,
    loggedInAt: new Date(),
  });

  return await getUserSession(event);
}


/**
 * ✅ GET USER PROFILE
 */
async function handleGetUser(event: H3Event) {
  try {
    const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
    if (!token) throw new Error('No token provided')

    const decoded = jwt.verify(token, process.env.SECRET as string)
    const foundUser = await User.findOne({ _id: (decoded as any)._id }).populate('address')

    if (foundUser) {
      return { success: true, user: foundUser }
    }

    return { success: false, message: "User not found" }
  } catch (err: any) {
    setResponseStatus(event, 500)
    return { success: false, message: err.message }
  }
}

/**
 * ✅ UPDATE USER PROFILE
 */
async function handleUpdateUser(event: H3Event) {
  try {
    const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
    if (!token) throw new Error('No token provided')

    const decoded = jwt.verify(token, process.env.SECRET as string)
    const body = await readBody(event)

    const foundUser = await User.findOne({ _id: (decoded as any)._id })
    if (foundUser) {
      if (body.name) foundUser.name = body.name
      if (body.email) foundUser.email = body.email
      if (body.password) foundUser.password = body.password

      await foundUser.save()

      return { success: true, message: `Successfully updated ${body.name} Profile` }
    }

    return { success: false, message: "User not found" }
  } catch (err: any) {
    setResponseStatus(event, 500)
    return { success: false, message: err.message }
  }
}
