// import Container from "../container/Container";
import {Container} from '../index'

import { AiFillHeart,AiFillGithub,AiOutlineTwitter } from "react-icons/ai";

function About() {
  return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <Container>
          <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">About Us</h1>
              <p className="text-lg text-gray-700 mb-4">
                  We are a company dedicated to providing the best products and services to our customers.
                  Our team is passionate about what we do and we strive to exceed our customers' expectations.
              </p>
              <p className="text-lg text-gray-700 mb-4">
                  We believe in the power of technology to transform lives and we are committed to making a positive impact in the communities we serve.
              </p>
          </div>
          <div className="w-full px-8  flex flex-col justify-center items-center">
              <h2 className="text-2xl font-bold mb-4 max-sm:flex max-sm:flex-col max-sm:items-center"><span>Our Team</span> <span className=" text-sm font-normal">actually its just me.😉</span></h2>
              <div className="flex flex-wrap -mx-4 ">
                  {/* Replace with actual team members */}
                  {['Pratik Awari'].map((name, index) => (
                      <div key={index} className=" w-48 mb-4">
                          <div className="bg-white shadow rounded p-4 text-center">
                              <div className="mb-4">
                                  {/* Replace with actual image */}
                                  <img src="/profile_pic_resized.png" alt={name} className="mx-auto rounded-full w-24 h-24 object-cover" />
                              </div>
                              <h3 className="text-xl font-bold">{name}</h3>
                              <p className="text-gray-600">Owner</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
          <div className="mt-auto">
              <footer className="w-full text-center border-t border-grey p-4 pin-b flex flex-col items-center">
              <div className=' flex items-center'>Made with <span className=' text-red-600 px-1'><AiFillHeart /></span>By<a href='https://www.linkedin.com/in/pratik-awari-608908218/' target='_blank' className='px-1 underline'>Pratik</a>
</div>
<div className='flex p-2 text-2xl gap-2'>
                    <a href='https://github.com/pratikwillcode' target='_blank'><AiFillGithub /></a>
                    <a href='https://twitter.com/i/flow/login?redirect_after_login=%2FPratikAwari28' target='_blank'><AiOutlineTwitter /></a>
                </div>
              </footer>
          </div>
          </Container>
      </div>
  );
}

export default About;