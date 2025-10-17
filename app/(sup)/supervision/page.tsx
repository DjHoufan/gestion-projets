import { GetUserCookies } from '@/core/hooks/use-get-user-cookies';
import { SuperiviseurBody } from '@/core/view/superiviseur/superiviseur-body'
import React from 'react'

const Superivision = async () => {
  const user = await GetUserCookies();

  return <SuperiviseurBody id={user.id} />
}

export default Superivision