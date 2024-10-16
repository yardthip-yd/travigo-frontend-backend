// Import
import React from 'react'
import defaultAvatar from "@/assets/image/avatar-cactus-default.png"

const Avatar = (props) => {

    const { imgSrc, menu, ...restProps } = props

    return (
        <div className="avatar items-center cursor-pointer">
            <div {...restProps}>
                <img src={imgSrc ?? defaultAvatar} />
            </div>
        </div>
    )
}

export default Avatar