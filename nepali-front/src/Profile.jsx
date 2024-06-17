import React, { useEffect, useState } from 'react'
import { getUser } from './api'

export const Profile = () => {
  const [firstName, setFirstName] = useState('')
  const accessToken = localStorage.getItem('accessToken');

  useEffect(() => {
    if (accessToken) {
      handleGetUser();
      handleGetOrders();

    }
  })

  const handleGetUser = async () => {
    try {
      const userData = await getUser({ auth: { accessToken }});
      console.log('User Data: ', userData);
      setFirstName(userData.first_name);
    } catch (error) {
      console.error('Error getting user: ', error);
    }
  }

  console.log('First name: ', firstName);
  return (
    <div>
      <h1>{firstName}'s Orders</h1>
    </div>
  )
}
