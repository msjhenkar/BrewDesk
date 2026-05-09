import React from 'react'

const MenuForm = (isOpen, onClose, onSubmit, editingItem) => {

    const [formData, setFormData] = useState({
        name:'', description:'', price:'', category:'',
    });

    const [errors, setErrors] = useState({});

    // useEffect(() => {
    //     if(editingItem){
    //         setFormData({
    //             name: editingItem.name || '',
    //         })
    //     }
    // })

  return (
    <div>
      
    </div>
  )
}

export default MenuForm
