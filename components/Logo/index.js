import React from "react"
import Image from "next/image"

function Logo({
  src = "/logo.png",      // default logo
  alt = "Logo",
  width = 150,            // default width
  height = 50,            // default height
  priority = false,
  className = "",
}) {
  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes="(max-width: 768px) 120px, 150px"
        className="object-contain"
      />
    </div>
  )
}

export default Logo
