import React, { useEffect, useState } from 'react'
import { getMenu } from '../../services/api';

const MenuList = () => {
    const [menu, setMenu] = useState([]);

    useEffect (() => {
        fetchMenu();
    },[] );

    const fetchMenu = async () => {
        try{
            const res = await getMenu();
            setMenu(res.data)
        }catch(err){

            console.log(err);
        }
    }
  return (
    <>
        <div className="menu-container">
            <h2>MENU</h2>

            <div className="menu-grid">
                {menu.map((item) => (
                    <div className="menu-card" key={item.id}>

                        <h3>{item.itemName}</h3>
                        <p>{item.description}</p>
                        <span>₹{item.price}</span>
                    </div>
                    
                ))}
            </div>
        </div>
    </>
  )
}

export default MenuList
