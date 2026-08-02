import React from 'react'

const FormGroup = ({ label, placeholder, value, onChange }) => {
    return (
        <div className="form-group">
            <label htmlFor={label}>{label}</label>
            <input onChange={onChange} value= {value} type={label}id={label} name={label} required  placeholder={placeholder}/>
        </div>
    )
}

export default FormGroup