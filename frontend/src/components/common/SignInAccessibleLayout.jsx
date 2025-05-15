import React from 'react'
import BottomNavigation from './BottomNavigation'
import HeaderToGoBack from './HeaderToGoBack'

const SignInAccessibleLayout = ({children}) => {
  return (
    <div>
        <HeaderToGoBack />
        <div className='p-3'>

        {children}
        </div>

        <BottomNavigation/>
    </div>
  )
}

export default SignInAccessibleLayout