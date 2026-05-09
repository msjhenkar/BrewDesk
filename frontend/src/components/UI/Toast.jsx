import React from 'react'

const Toast = ({toast, onClose}) => {

    if(!toast.show) return null;


    const styles = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        info: 'bg-blue-500 text-white'
    };
  return (
    <div>
      
    </div>
  )
}

export default Toast;
