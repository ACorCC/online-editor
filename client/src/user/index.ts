let userId: string = ''

export function getUserId() {
  if (!userId) {
    let num = Math.floor(Math.random() * 1000)
    userId = (`user_` + `000${num}`.slice(-3))
  }
  return userId
}