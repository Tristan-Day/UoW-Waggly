import { getCurrentUser } from 'aws-amplify/auth'
import { get, post } from 'aws-amplify/api'

export const getAccount = async () => {
  const user = await getCurrentUser()

  const operation = get({
    apiName: "UserService",
    path: "/users/" + user.username
  })

  const { body } = await operation.response
  return await body.json()
}

export const updateAccount = async (body) => {
  const user = await getCurrentUser()

  const operation = post
    ({
      apiName: "UserService",
      path: "/users/" + user.username,
      options: { body: body }
    })

  await operation.response
}

export const getPets = async () => {
  const user = await getCurrentUser()

  const operation = get({
    apiName: "PetService",
    path: "/pets/" + user.username
  })

  const { body } = await operation.response
  return await body.json()
}

export const updatePet = async (name, body) => {
  const user = await getCurrentUser()

  const operation = post
    ({
      apiName: "PetService",
      path: `/pets/${user.username}/${name}`,
      options: { body: body }
    })

  await operation.response
}