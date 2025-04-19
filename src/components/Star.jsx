import { FaStar, FaStarHalfAlt } from 'react-icons/fa'
import {AiOutlineStar} from 'react-icons/ai'

function Star({stars, reviews}) {
    const ratingStar = Array.from({length: 5}, (_, index) => {
        const halfStar = index + 0.5
        const filledStar = index + 1
        return (
            <span key={index}>
                {stars >= filledStar ? <FaStar /> : stars >= halfStar ? <FaStarHalfAlt /> : <AiOutlineStar />}
            </span>
        )
    })
  return (
    <div className='flex  gap-4'>
        <span className='flex text-orange-400'>{ratingStar}</span>
        <p className='text-xs font-light'>({reviews} customer reviews)</p></div>
  )
}

export default Star