import React, {useEffect, useState} from 'react'
import axios from 'axios'
import config from './config'
import './menu.css'
export default function MenuContainer(props) {

    const [allowClick, setAllowClick] = useState(false)
    const [menuClass, setMenuClass] = useState("")

    const logoutReq = (config.production ? config.server : config.local) + '/logout'

    const closeMenu = ()=> {
        if(allowClick)
        {
            setMenuClass("menuCardFull menuCardFullHide")
            setTimeout(() => {
                setMenuClass("") 
                setAllowClick(true)
                props.openMenu(false)
            }, 295);
        }
        setAllowClick(false)
    }

    const logout = (e) => {
        e.stopPropagation()
        console.log("logging out")
        axios.post(logoutReq, {}, {withCredentials: true}).then(result => {
            console.log(result)
            window.location.reload()
        }).catch(err => {
            console.log(err)
        })
    }
    
    useEffect(() => {
        setMenuClass("")
        setTimeout(() => {
            setMenuClass(props.menuClass)
        }, 10);
    },[props.menuClass])

    useEffect(()=> {
        setAllowClick(true)
        setMenuClass("") 
    },[])

    return (
        <div className="menuContainer" onClick={() => closeMenu()}>
            <div className={"menuCard " + menuClass}>
                <div className="MenuList">
                    <span >New group</span>
                    <span>New broadcast</span>
                    <span>WhatsApp web</span>
                    <span>Starred messages</span>
                    <span>Settings</span>
                    <span onClick={logout}>Log out</span>
                </div>
            </div>
        </div>
    )
}
