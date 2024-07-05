import React from 'react'
import { useParams } from 'react-router-dom'

const UpdateListing = () => {
    const {id} = useParams()
    console.log(id)
  return (
    <div>UpdateListing</div>
  )
}

export default UpdateListing