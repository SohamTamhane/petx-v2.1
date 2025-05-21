import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function DeploymentTest() {

    const navigate = useNavigate();

    useEffect(()=>{
        navigate('/');
    }, [])

    return (
        <div>
            
        </div>
    )
}
