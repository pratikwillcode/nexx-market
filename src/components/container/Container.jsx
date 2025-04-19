import React,{ useEffect, useRef }  from 'react'
import {motion, useInView, useAnimation} from 'framer-motion'

function Container({children}) {
  const ref = useRef(null)
  const isInView = useInView(ref, {once: true})
  const mainControls = useAnimation()

  useEffect(() => {
    if(isInView) {
      mainControls.start("visible")
    }
    console.log(isInView)
  }, [isInView]);
  return (
    <div ref={ref}>
    <motion.div variants={{
      hidden: {
        opacity: 0, y:75
      },
      visible: {
        opacity: 1,
        
        y: 0
      }
    }} initial="hidden" animate= {mainControls} transition={ {
      delay: 0.25,
      duration: 0.5,
    }} className='w-full lg:p-8 lg:px-24 p-4 md:px-16 md:p-4'>{children}</motion.div>
    </div>
  )
}

export default Container 